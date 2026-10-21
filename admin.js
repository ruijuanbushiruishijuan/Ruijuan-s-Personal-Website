/* 后台：文章 / 评论 / 账号（仅管理员可见） */
(function () {
  const $ = (s) => document.querySelector(s);
  const api = (p, o) => window.ACCOUNT.api(p, o);
  const pub = (p, o) => window.ACCOUNT.publicApi(p, o);
  const enc = encodeURIComponent;

  let tab = "posts";
  let posts = [];
  let editing = null;

  const isAdmin = () => {
    const st = window.ACCOUNT.state();
    return !!(st.loggedIn && st.profile && st.profile.role === "admin");
  };

  const fmt = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d)) return "";
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
  };

  const today = () => {
    const t = new Date();
    const p = (n) => String(n).padStart(2, "0");
    return `${t.getFullYear()}.${p(t.getMonth() + 1)}.${p(t.getDate())}`;
  };

  /* ---------- 导航入口 ---------- */
  function syncNav() {
    const nav = document.querySelector(".nav");
    if (!nav) return;
    let a = document.getElementById("navAdmin");
    if (isAdmin()) {
      if (!a) {
        a = document.createElement("a");
        a.id = "navAdmin";
        a.href = "#admin";
        a.textContent = "后台";
        a.onclick = (e) => {
          e.preventDefault();
          if (window.SHOW_SECTION) window.SHOW_SECTION("admin");
          window.scrollTo({ top: 0 });
          render();
        };
        const rule = nav.querySelector(".nav-rule");
        nav.insertBefore(a, rule || nav.querySelector(".user-chip"));
      }
    } else if (a) {
      a.remove();
    }
  }

  /* ---------- 主渲染 ---------- */
  function render() {
    syncNav();
    const box = $("#adminBody");
    if (!box) return;
    if (!isAdmin()) {
      box.innerHTML = '<p class="c-empty">这里只有管理员能进。</p>';
      return;
    }
    box.innerHTML = `
      <div class="admin-tabs" id="adminTabs">
        <button type="button" class="tag${tab === "posts" ? " on" : ""}" data-tab="posts">文章</button>
        <button type="button" class="tag${tab === "comments" ? " on" : ""}" data-tab="comments">评论</button>
        <button type="button" class="tag${tab === "users" ? " on" : ""}" data-tab="users">账号</button>
        <button type="button" class="tag${tab === "about" ? " on" : ""}" data-tab="about">关于页</button>
      </div>
      <div id="adminPane"></div>`;
    box.querySelectorAll("#adminTabs .tag").forEach((b) => {
      b.onclick = () => { tab = b.dataset.tab; render(); };
    });
    if (tab === "posts") renderPosts();
    else if (tab === "comments") renderComments();
    else if (tab === "users") renderUsers();
    else if (tab === "about") renderAbout();
  }

  /* ---------- 文章 ---------- */
  async function renderPosts() {
    const pane = $("#adminPane");
    pane.innerHTML = `
      <div class="admin-bar">
        <button type="button" class="btn-red" id="newPost">+ 写文章</button>
        <button type="button" class="tag" id="importPosts">导入现有文章</button>
        <span class="comment-as" id="postHint"></span>
      </div>
      <div class="admin-list" id="postList"><p class="c-empty">加载中…</p></div>
      <div id="postEditor"></div>`;
    $("#newPost").onclick = () => openEditor(null);
    $("#importPosts").onclick = doImport;

    try {
      posts = await pub("/rest/v1/posts?select=id,title,date,author,tags,pinned&order=date.desc");
    } catch (e) {
      posts = [];
    }
    const list = $("#postList");
    if (!posts.length) {
      list.innerHTML = '<p class="c-empty">数据库里还没有文章。可以点「导入现有文章」把现在这 6 篇搬进来。</p>';
      return;
    }
    list.innerHTML = "";
    posts.forEach((p) => {
      const d = document.createElement("div");
      d.className = "admin-row";
      d.innerHTML = `
        <div class="ar-main"><b class="ar-title"></b><span class="ar-sub">${p.date || ""} · ${p.author || ""}</span></div>
        <div class="ar-btns">
          <button type="button" class="tag" data-act="edit">编辑</button>
          <button type="button" class="tag danger" data-act="del">删除</button>
        </div>`;
      d.querySelector(".ar-title").textContent = p.title + (p.pinned ? " 📌" : "");
      d.querySelector('[data-act="edit"]').onclick = () => openEditor(p.id);
      d.querySelector('[data-act="del"]').onclick = async () => {
        if (!confirm("删除《" + p.title + "》？不能撤销。")) return;
        try {
          await api("/rest/v1/posts?id=eq." + enc(p.id), { method: "DELETE" });
          if (window.RELOAD_POSTS) await window.RELOAD_POSTS();
          renderPosts();
        } catch (e) { alert("删不掉：" + e.message); }
      };
      list.appendChild(d);
    });
  }

  async function openEditor(id) {
    let row = null;
    if (id) {
      try {
        const rows = await pub("/rest/v1/posts?select=*&id=eq." + enc(id));
        row = rows && rows[0];
      } catch (e) {}
    }
    editing = row;
    const box = $("#postEditor");
    box.innerHTML = `
      <form class="post-form" id="postForm">
        <div class="pf-head">${row ? "编辑文章" : "新文章"}</div>
        <label class="field"><span>标题</span><input id="pfTitle" required></label>
        <div class="pf-row">
          <label class="field"><span>日期</span><input id="pfDate" placeholder="2026.10.21"></label>
          <label class="field"><span>作者</span><input id="pfAuthor"></label>
        </div>
        <label class="field"><span>标签（用逗号隔开）</span><input id="pfTags" placeholder="随笔, 设计"></label>
        <label class="field"><span>摘要</span><input id="pfExcerpt"></label>
        <label class="field"><span>正文（支持 HTML，如 &lt;h3&gt;小标题&lt;/h3&gt;）</span>
          <textarea id="pfBody" rows="12"></textarea></label>
        <label class="pf-check"><input type="checkbox" id="pfPinned"> 置顶</label>
        <div class="pf-actions">
          <button type="submit" class="btn-red">保存</button>
          <button type="button" class="tag" id="pfCancel">取消</button>
          <span class="comment-as" id="pfMsg"></span>
        </div>
      </form>`;
    if (row) {
      $("#pfTitle").value = row.title || "";
      $("#pfDate").value = row.date || "";
      $("#pfAuthor").value = row.author || "";
      $("#pfTags").value = (row.tags || []).join(", ");
      $("#pfExcerpt").value = row.excerpt || "";
      $("#pfBody").value = row.body || "";
      $("#pfPinned").checked = !!row.pinned;
    } else {
      $("#pfDate").value = today();
      const st = window.ACCOUNT.state();
      $("#pfAuthor").value = (st.profile && st.profile.username) || "瑞卷";
    }
    $("#pfCancel").onclick = () => { box.innerHTML = ""; };
    $("#postForm").onsubmit = savePost;
    box.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function savePost(e) {
    e.preventDefault();
    const msg = $("#pfMsg");
    const body = {
      title: $("#pfTitle").value.trim(),
      date: $("#pfDate").value.trim() || today(),
      author: $("#pfAuthor").value.trim(),
      tags: $("#pfTags").value.split(/[,，、]/).map((s) => s.trim()).filter(Boolean),
      excerpt: $("#pfExcerpt").value.trim(),
      body: $("#pfBody").value,
      pinned: $("#pfPinned").checked,
    };
    if (!body.title) { msg.textContent = "标题不能空"; msg.classList.add("bad"); return; }
    msg.classList.remove("bad");
    msg.textContent = "保存中…";
    try {
      if (editing) {
        await api("/rest/v1/posts?id=eq." + enc(editing.id), {
          method: "PATCH",
          body: Object.assign({}, body, { updated_at: new Date().toISOString() }),
        });
      } else {
        await api("/rest/v1/posts", {
          method: "POST",
          body: Object.assign({ id: "p" + Date.now().toString(36) }, body),
        });
      }
      msg.textContent = "";
      $("#postEditor").innerHTML = "";
      if (window.RELOAD_POSTS) await window.RELOAD_POSTS();
      renderPosts();
    } catch (err) {
      msg.textContent = "保存失败：" + err.message;
      msg.classList.add("bad");
    }
  }

  async function doImport() {
    const src = window.POSTS;
    if (!Array.isArray(src) || !src.length) return alert("没找到可导入的文章");
    const hint = $("#postHint");
    hint.textContent = "导入中…";
    let ok = 0;
    for (const p of src) {
      try {
        await api("/rest/v1/posts?on_conflict=id", {
          method: "POST",
          headers: { Prefer: "resolution=merge-duplicates" },
          body: {
            id: p.id || "p" + Math.random().toString(36).slice(2, 8),
            title: p.title, date: p.date, author: p.author || "",
            tags: p.tags || [], excerpt: p.excerpt || "",
            body: p.body || "", pinned: !!p.pinned,
          },
        });
        ok++;
      } catch (e) {}
    }
    hint.textContent = `导入了 ${ok} / ${src.length} 篇`;
    if (window.RELOAD_POSTS) await window.RELOAD_POSTS();
    renderPosts();
  }

  /* ---------- 评论 ---------- */
  async function renderComments() {
    const pane = $("#adminPane");
    pane.innerHTML = '<div class="admin-list" id="cmList"><p class="c-empty">加载中…</p></div>';
    let rows = [];
    try {
      rows = await pub("/rest/v1/comment_feed?select=*&order=created_at.desc&limit=200");
    } catch (e) {}
    const list = $("#cmList");
    if (!rows || !rows.length) { list.innerHTML = '<p class="c-empty">还没有评论。</p>'; return; }
    const titles = {};
    posts.forEach((p) => { titles[p.id] = p.title; });
    list.innerHTML = "";
    rows.forEach((c) => {
      const d = document.createElement("div");
      d.className = "admin-row";
      d.innerHTML = `
        <div class="ar-main">
          <b class="ar-title"></b>
          <span class="ar-sub">${c.username || "匿名"} · ${fmt(c.created_at)} · 《${titles[c.post_id] || c.post_id}》</span>
        </div>
        <div class="ar-btns"><button type="button" class="tag danger" data-act="del">删除</button></div>`;
      d.querySelector(".ar-title").textContent = c.body;
      d.querySelector('[data-act="del"]').onclick = async () => {
        if (!confirm("删除这条评论？")) return;
        try {
          await api("/rest/v1/comments?id=eq." + enc(c.id), { method: "DELETE" });
          renderComments();
        } catch (e) { alert("删不掉：" + e.message); }
      };
      list.appendChild(d);
    });
  }

  /* ---------- 账号 ---------- */
  async function renderUsers() {
    const pane = $("#adminPane");
    pane.innerHTML = '<div class="admin-list" id="usList"><p class="c-empty">加载中…</p></div>';
    let rows = [];
    try {
      rows = await api("/rest/v1/profiles?select=id,username,phone,role,status,created_at&order=created_at");
    } catch (e) {}
    const list = $("#usList");
    if (!rows || !rows.length) { list.innerHTML = '<p class="c-empty">没有账号。</p>'; return; }
    const me = window.ACCOUNT.state().user.id;
    list.innerHTML = "";
    rows.forEach((u) => {
      const d = document.createElement("div");
      d.className = "admin-row";
      const admin = u.role === "admin";
      const banned = u.status === "banned";
      d.innerHTML = `
        <div class="ar-main">
          <b class="ar-title"></b>
          <span class="ar-sub">${u.phone || "无电话"} · ${fmt(u.created_at)}</span>
        </div>
        <div class="ar-btns">
          <span class="role-chip${admin ? " on" : ""}${banned ? " off" : ""}">${banned ? "已停用" : admin ? "管理员" : "成员"}</span>
          <button type="button" class="tag" data-act="role">${admin ? "撤管理员" : "设管理员"}</button>
          <button type="button" class="tag${banned ? "" : " danger"}" data-act="status">${banned ? "恢复" : "停用"}</button>
        </div>`;
      d.querySelector(".ar-title").textContent = u.username + (u.id === me ? "（你）" : "");
      d.querySelector('[data-act="role"]').onclick = async () => {
        if (u.id === me && admin && !confirm("取消你自己的管理员身份？你会失去后台权限。")) return;
        try {
          await api("/rest/v1/profiles?id=eq." + enc(u.id), {
            method: "PATCH",
            body: { role: admin ? "user" : "admin" },
          });
          renderUsers();
        } catch (e) { alert("改不了：" + e.message); }
      };
      d.querySelector('[data-act="status"]').onclick = async () => {
        if (u.id === me) return alert("不能停用自己");
        try {
          await api("/rest/v1/profiles?id=eq." + enc(u.id), {
            method: "PATCH",
            body: { status: banned ? "active" : "banned" },
          });
          renderUsers();
        } catch (e) { alert("改不了：" + e.message); }
      };
      list.appendChild(d);
    });
  }

  /* ---------- 关于页 ---------- */
  async function renderAbout() {
    const pane = $("#adminPane");
    pane.innerHTML = '<div id="abWrap" class="post-form"><p class="c-empty">加载中…</p></div>';
    let map = {};
    try {
      const rows = await pub("/rest/v1/site_settings?select=key,value");
      (rows || []).forEach((r) => { map[r.key] = r.value; });
    } catch (e) {}
    $("#abWrap").innerHTML = `
      <div class="pf-head">关于页的三段文字</div>
      <label class="field"><span>КТО / 你是谁</span><textarea id="abAbout" rows="4"></textarea></label>
      <label class="field"><span>ЧТО / 你在做什么</span><textarea id="abWhat" rows="4"></textarea></label>
      <label class="field"><span>ГДЕ / 在哪找到你</span><textarea id="abWhere" rows="4"></textarea></label>
      <div class="pf-actions">
        <button type="button" class="btn-red" id="abSave">保存</button>
        <span class="comment-as" id="abMsg"></span>
      </div>`;
    const def = (k, v) => (map[k] != null && map[k] !== "" ? map[k] : v);
    $("#abAbout").value = def("about", $("#aboutText").textContent);
    $("#abWhat").value = def("what", $("#aboutWhat").textContent);
    $("#abWhere").value = def("where", $("#aboutWhere").textContent);
    $("#abSave").onclick = async () => {
      const msg = $("#abMsg");
      msg.classList.remove("bad");
      msg.textContent = "保存中…";
      const items = [
        ["about", $("#abAbout").value],
        ["what", $("#abWhat").value],
        ["where", $("#abWhere").value],
      ];
      try {
        for (const [k, v] of items) {
          await api("/rest/v1/site_settings?on_conflict=key", {
            method: "POST",
            headers: { Prefer: "resolution=merge-duplicates" },
            body: { key: k, value: v, updated_at: new Date().toISOString() },
          });
        }
        if (window.RELOAD_SITE) await window.RELOAD_SITE();
        msg.textContent = "已保存";
      } catch (e) {
        msg.textContent = "保存失败：" + e.message;
        msg.classList.add("bad");
      }
    };
  }

  /* ---------- 启动 ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    if (!window.ACCOUNT) return;
    window.ACCOUNT.onChange(() => {
      syncNav();
      const el = $("#admin");
      if (el && !el.hidden) {
        if (isAdmin()) render();
      }
    });
  });

  window.ADMIN_RENDER = render;
})();
