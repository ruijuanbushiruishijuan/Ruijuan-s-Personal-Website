/* 点赞 / 评论 / 阅读量 */
(function () {
  const $ = (s) => document.querySelector(s);
  const pub = (p, o) => window.ACCOUNT.publicApi(p, o);
  const auth = (p, o) => window.ACCOUNT.api(p, o);
  const enc = encodeURIComponent;

  let current = null; // 当前文章 id
  let likeRows = [];
  const viewed = new Set();

  const fmt = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d)) return "";
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
  };

  /* ---------- 全部文章的赞数（归档排序用） ---------- */
  async function loadAllLikes() {
    try {
      const rows = await pub("/rest/v1/like_count?select=post_id,likes");
      const map = {};
      (rows || []).forEach((r) => { map[r.post_id] = Number(r.likes) || 0; });
      window.dispatchEvent(new CustomEvent("likes:loaded", { detail: map }));
    } catch (e) {}
  }

  /* ---------- 打开一篇文章 ---------- */
  async function loadPost(postId) {
    current = postId;
    $("#artStats").hidden = false;
    $("#comments").hidden = false;
    $("#likeCount").textContent = "0";
    $("#viewCount").textContent = "0";
    $("#commentCount").textContent = "0";
    $("#commentList").innerHTML = '<p class="c-empty">加载中…</p>';

    if (!viewed.has(postId)) {
      viewed.add(postId);
      try { await pub("/rest/v1/rpc/inc_view", { method: "POST", body: { p: postId } }); } catch (e) {}
    }

    try {
      const rows = await pub("/rest/v1/post_stats?select=views&post_id=eq." + enc(postId));
      $("#viewCount").textContent = (rows && rows[0] && rows[0].views) || 0;
    } catch (e) {}

    await loadLikes(postId);
    await loadComments(postId);
  }

  /* ---------- 点赞 ---------- */
  async function loadLikes(postId) {
    try {
      const rows = await pub("/rest/v1/likes?select=user_id&post_id=eq." + enc(postId));
      likeRows = rows || [];
      $("#likeCount").textContent = likeRows.length;
      const st = window.ACCOUNT.state();
      const mine = st.loggedIn && likeRows.some((r) => r.user_id === st.user.id);
      const btn = $("#likeBtn");
      btn.classList.toggle("on", !!mine);
      btn.title = st.loggedIn ? (mine ? "取消赞" : "点个赞") : "登录后才能点赞";
    } catch (e) {}
  }

  async function toggleLike() {
    const st = window.ACCOUNT.state();
    if (!st.loggedIn) return gotoAccount("先登录才能点赞～");
    const pid = current;
    const mine = likeRows.some((r) => r.user_id === st.user.id);
    try {
      if (mine) {
        await auth("/rest/v1/likes?post_id=eq." + enc(pid) + "&user_id=eq." + enc(st.user.id), { method: "DELETE" });
      } else {
        await auth("/rest/v1/likes", { method: "POST", body: { post_id: pid, user_id: st.user.id } });
      }
    } catch (e) {}
    await loadLikes(pid);
    loadAllLikes();
  }

  /* ---------- 评论 ---------- */
  async function loadComments(postId) {
    const box = $("#commentList");
    try {
      const rows = await pub(
        "/rest/v1/comment_feed?select=*&post_id=eq." + enc(postId) + "&order=created_at.desc"
      );
      $("#commentCount").textContent = (rows || []).length;
      if (!rows || !rows.length) {
        box.innerHTML = '<p class="c-empty">还没有人说话，来当第一个。</p>';
        return;
      }
      const st = window.ACCOUNT.state();
      box.innerHTML = "";
      rows.forEach((c) => {
        const d = document.createElement("div");
        d.className = "comment";
        const mine = st.loggedIn && c.user_id === st.user.id;
        const adm = st.loggedIn && st.profile && st.profile.role === "admin";
        d.innerHTML =
          '<div class="c-head"><b class="c-name"></b><span class="c-time">' + fmt(c.created_at) + "</span>" +
          ((mine || adm) ? '<button class="c-del" type="button">删除</button>' : "") + "</div>" +
          '<div class="c-body"></div>';
        d.querySelector(".c-name").textContent = c.username || "匿名";
        d.querySelector(".c-body").textContent = c.body;
        const del = d.querySelector(".c-del");
        if (del) {
          del.onclick = async () => {
            if (!confirm("删除这条评论？")) return;
            try {
              await auth("/rest/v1/comments?id=eq." + enc(c.id), { method: "DELETE" });
              await loadComments(postId);
            } catch (e) {
              alert("删不掉：" + e.message);
            }
          };
        }
        box.appendChild(d);
      });
    } catch (e) {
      box.innerHTML = '<p class="c-empty">评论加载失败。</p>';
    }
  }

  async function submitComment(e) {
    e.preventDefault();
    const st = window.ACCOUNT.state();
    const ta = $("#commentBody");
    const body = ta.value.trim();
    if (!st.loggedIn) return gotoAccount("先登录再留言～");
    if (!body) return;
    const btn = $("#commentForm").querySelector("button[type=submit]");
    btn.disabled = true;
    try {
      await auth("/rest/v1/comments", { method: "POST", body: { post_id: current, user_id: st.user.id, body } });
      ta.value = "";
      await loadComments(current);
    } catch (err) {
      alert("留言失败：" + err.message);
    } finally {
      btn.disabled = false;
    }
  }

  /* ---------- 杂 ---------- */
  function gotoAccount(tip) {
    if (window.SHOW_SECTION) window.SHOW_SECTION("account");
    window.scrollTo({ top: 0 });
    if (tip) {
      const m = $("#loginMsg");
      if (m) { m.textContent = tip; m.classList.add("bad"); }
    }
  }

  function syncWho() {
    const st = window.ACCOUNT.state();
    const who = $("#commentAs");
    if (who) who.textContent = st.loggedIn && st.profile ? "以 " + st.profile.username + " 的身份留言" : "登录后可以留言";
    if (current) loadLikes(current);
  }

  document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener("post:open", (e) => loadPost(e.detail.id));
    $("#likeBtn").onclick = toggleLike;
    $("#commentForm").onsubmit = submitComment;
    if (window.ACCOUNT) window.ACCOUNT.onChange(syncWho);
    loadAllLikes();
  });
})();
