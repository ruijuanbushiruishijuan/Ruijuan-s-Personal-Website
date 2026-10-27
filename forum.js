/* 论坛：列表 / 发帖 / 详情 / 点赞 / 评论 */
(function () {
  const $ = (s) => document.querySelector(s);
  const pub = (p, o) => window.ACCOUNT.publicApi(p, o);
  const auth = (p, o) => window.ACCOUNT.api(p, o);
  const enc = encodeURIComponent;

  const fmt = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d)) return "";
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
  };

  const pad = (i) => String(i).padStart(2, "0");
  const newId = () => {
    const b = new Uint8Array(8);
    crypto.getRandomValues(b);
    return "f_" + Array.from(b).map((x) => x.toString(16).padStart(2, "0")).join("");
  };

  let rows = [];
  let current = null;
  let likeRows = [];

  /* ---------- 列表 ---------- */
  async function load() {
    try {
      const data = await pub("/rest/v1/forum_feed?select=id,user_id,username,title,body,created_at&order=created_at.desc&limit=100");
      rows = data || [];
      renderList();
    } catch (e) {
      $("#forumList").innerHTML = '<p class="c-empty">论坛加载失败。</p>';
    }
  }

  function renderList() {
    const wrap = $("#forumList");
    wrap.innerHTML = "";
    $("#forumEmpty").hidden = rows.length > 0;
    rows.forEach((r, i) => {
      const el = document.createElement("article");
      el.className = "post-item";
      el.innerHTML =
        '<div class="post-index">' + pad(rows.length - i) + "</div>" +
        '<div><div class="post-title"><span class="t"></span></div>' +
        '<div class="post-excerpt"></div></div>' +
        '<div class="post-side"><div class="post-date"></div>' +
        '<div class="post-author"></div></div>';
      el.querySelector(".post-title .t").textContent = r.title || "无标题";
      el.querySelector(".post-excerpt").textContent = String(r.body || "").replace(/\s+/g, " ").slice(0, 70);
      el.querySelector(".post-date").textContent = fmt(r.created_at);
      el.querySelector(".post-author").textContent = r.username || "匿名";
      el.onclick = () => openPost(r);
      wrap.appendChild(el);
    });
  }

  /* ---------- 详情 ---------- */
  function openPost(r) {
    current = r;
    window.SHOW_SECTION("forumPost");
    $("#fpAuthor").textContent = r.username || "匿名";
    $("#fpDate").textContent = fmt(r.created_at);
    $("#fpTitle").textContent = r.title || "无标题";
    $("#fpBody").textContent = r.body || "";
    $("#fpLikes").textContent = "0";
    $("#fpCommentCount").textContent = "0";
    loadLikes();
    loadComments();
    window.scrollTo({ top: 0 });
  }

  /* ---------- 点赞 ---------- */
  async function loadLikes() {
    if (!current) return;
    try {
      const data = await pub("/rest/v1/likes?select=user_id&post_id=eq." + enc(current.id));
      likeRows = data || [];
      $("#fpLikes").textContent = likeRows.length;
      const st = window.ACCOUNT.state();
      const mine = st.loggedIn && likeRows.some((x) => x.user_id === st.user.id);
      const btn = $("#fpLike");
      btn.classList.toggle("on", !!mine);
      btn.title = st.loggedIn ? (mine ? "取消赞" : "点个赞") : "登录后才能点赞";
    } catch (e) {}
  }

  async function toggleLike() {
    if (!current) return;
    const st = window.ACCOUNT.state();
    if (!st.loggedIn) return goLogin("先登录才能点赞");
    const mine = likeRows.some((x) => x.user_id === st.user.id);
    try {
      if (mine) {
        await auth("/rest/v1/likes?post_id=eq." + enc(current.id) + "&user_id=eq." + enc(st.user.id), { method: "DELETE" });
      } else {
        await auth("/rest/v1/likes", { method: "POST", body: { post_id: current.id, user_id: st.user.id } });
      }
    } catch (e) {}
    await loadLikes();
  }

  /* ---------- 评论 ---------- */
  async function loadComments() {
    if (!current) return;
    const box = $("#fpCommentList");
    box.innerHTML = '<p class="c-empty">加载中…</p>';
    try {
      const data = await pub(
        "/rest/v1/comment_feed?select=id,user_id,username,body,created_at&post_id=eq." +
        enc(current.id) + "&order=created_at.desc"
      );
      const list = data || [];
      $("#fpCommentCount").textContent = list.length;
      if (!list.length) { box.innerHTML = '<p class="c-empty">还没有评论。</p>'; return; }
      box.innerHTML = "";
      const st = window.ACCOUNT.state();
      list.forEach((c) => {
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
              await loadComments();
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
    if (!current) return;
    const st = window.ACCOUNT.state();
    const ta = $("#fpCommentBody");
    const body = ta.value.trim();
    if (!st.loggedIn) return goLogin("先登录再留言");
    if (!body) return;
    const btn = $("#fpCommentForm").querySelector("button[type=submit]");
    btn.disabled = true;
    try {
      await auth("/rest/v1/comments", { method: "POST", body: { post_id: current.id, user_id: st.user.id, body } });
      ta.value = "";
      await loadComments();
    } catch (err) {
      alert("留言失败：" + err.message);
    } finally {
      btn.disabled = false;
    }
  }

  /* ---------- 发帖 ---------- */
  async function submitPost(e) {
    e.preventDefault();
    const st = window.ACCOUNT.state();
    const msg = $("#forumMsg");
    const title = $("#forumTitle").value.trim();
    const body = $("#forumBody").value.trim();
    if (!st.loggedIn) {
      msg.textContent = "先登录再发帖";
      msg.classList.add("bad");
      return goLogin("先登录再发帖");
    }
    if (!body) {
      msg.textContent = "正文不能为空";
      msg.classList.add("bad");
      return;
    }
    const btn = $("#forumForm").querySelector("button[type=submit]");
    btn.disabled = true;
    try {
      await auth("/rest/v1/forum_posts", {
        method: "POST",
        body: { id: newId(), user_id: st.user.id, title, body, status: "pending" },
      });
      $("#forumTitle").value = "";
      $("#forumBody").value = "";
      msg.classList.remove("bad");
      msg.textContent = "已提交，等管理员审核通过后就会出现在这里。";
    } catch (err) {
      msg.classList.add("bad");
      msg.textContent = "发帖失败：" + err.message;
    } finally {
      btn.disabled = false;
    }
  }

  /* ---------- 杂 ---------- */
  function goLogin(tip) {
    if (window.SHOW_SECTION) window.SHOW_SECTION("account");
    window.scrollTo({ top: 0 });
    if (tip) {
      const m = $("#loginMsg");
      if (m) { m.textContent = tip; m.classList.add("bad"); }
    }
  }

  function syncWho() {
    const st = window.ACCOUNT.state();
    const who = $("#forumWho");
    if (who) who.textContent = st.loggedIn ? "发布后需要管理员审核" : "登录后可以发帖";
    const ca = $("#fpCommentAs");
    if (ca) ca.textContent = st.loggedIn ? "以 " + (st.profile && st.profile.username ? st.profile.username : "你") + " 的身份留言" : "登录后可以留言";
  }

  function wire() {
    $("#forumForm").addEventListener("submit", submitPost);
    $("#fpCommentForm").addEventListener("submit", submitComment);
    $("#fpLike").addEventListener("click", toggleLike);
    $("#forumBack").onclick = () => { window.SHOW_SECTION("forum"); window.scrollTo({ top: 0 }); };
    window.ACCOUNT.onChange(syncWho);
    syncWho();
  }

  document.addEventListener("DOMContentLoaded", () => { wire(); load(); });
  window.FORUM_LOAD = load;

  window.FORUM_OPEN = async (id) => {
    try {
      const data = await pub("/rest/v1/forum_feed?select=id,user_id,username,title,body,created_at&id=eq." + enc(id));
      if (data && data[0]) openPost(data[0]);
      else if (window.SHOW_SECTION) window.SHOW_SECTION("forum");
    } catch (e) {}
  };

  // 每次切到论坛栏目，重新拉一次（发帖/审核后能立刻看到变化）
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest('a[href="#forum"]');
    if (a) setTimeout(load, 30);
  });
})();
