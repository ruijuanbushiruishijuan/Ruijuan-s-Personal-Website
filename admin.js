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
        const holder = nav.querySelector(".nav-links") || nav;
        holder.appendChild(a);
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
        <button type="button" class="tag${tab === "works" ? " on" : ""}" data-tab="works">作品</button>
        <button type="button" class="tag${tab === "noise" ? " on" : ""}" data-tab="noise">音效</button>
        <button type="button" class="tag${tab === "banned" ? " on" : ""}" data-tab="banned">违禁词</button>
        <button type="button" class="tag${tab === "qa" ? " on" : ""}" data-tab="qa">问答</button>
        <button type="button" class="tag${tab === "about" ? " on" : ""}" data-tab="about">关于页</button>
      </div>
      <div id="adminPane"></div>`;
    box.querySelectorAll("#adminTabs .tag").forEach((b) => {
      b.onclick = () => { tab = b.dataset.tab; render(); };
    });
    if (tab === "posts") renderPosts();
    else if (tab === "comments") renderComments();
    else if (tab === "users") renderUsers();
    else if (tab === "works") renderWorks();
    else if (tab === "noise") renderNoise();
    else if (tab === "banned") renderBanned();
    else if (tab === "qa") renderQa();
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
      rows = await api("/rest/v1/profiles?select=id,username,phone,contact,contact_type,role,status,created_at&order=created_at");
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
          <span class="ar-sub">${u.contact ? (u.contact_type === "wechat" ? "微信 " : "QQ ") + u.contact : (u.phone || "未绑定")} · ${fmt(u.created_at)}</span>
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

  /* ---------- 违禁词 ---------- */
  async function renderBanned() {
    const pane = $("#adminPane");
    pane.innerHTML =
      '<p class="comment-as" style="margin-bottom:12px">评论、提问、用户名、关于页文字都会检查；文章正文不检查。</p>' +
      '<div class="pf-actions" style="margin-bottom:16px">' +
      '<input id="bwInput" class="bw-input" placeholder="输入一个词，回车添加">' +
      '<button type="button" class="btn-red" id="bwAdd">添加</button>' +
      '<span class="comment-as" id="bwMsg"></span>' +
      '</div>' +
      '<div class="bw-list" id="bwList"><p class="c-empty">加载中…</p></div>';

    const input = $("#bwInput");
    const msg = $("#bwMsg");
    input.onkeydown = (e) => { if (e.key === "Enter") { e.preventDefault(); addWord(); } };
    $("#bwAdd").onclick = addWord;

    async function addWord() {
      const raw = input.value.trim();
      if (!raw) return;
      const words = raw.split(/[,，\s]+/).map((w) => w.trim()).filter(Boolean);
      if (!words.length) return;
      msg.classList.remove("bad");
      msg.textContent = "添加中…";
      let ok = 0;
      for (const w of words) {
        try {
          await api("/rest/v1/banned_words", { method: "POST", body: { word: w } });
          ok++;
        } catch (e) {}
      }
      input.value = "";
      msg.textContent = ok ? "已添加 " + ok + " 个" : "都没加上（可能已存在）";
      await loadWords();
    }

    async function loadWords() {
      const list = $("#bwList");
      let rows = [];
      try { rows = await api("/rest/v1/banned_words?select=word&order=word"); } catch (e) {}
      if (!rows || !rows.length) {
        list.innerHTML = '<p class="c-empty">还没有违禁词。</p>';
        return;
      }
      list.innerHTML = "";
      rows.forEach((r) => {
        const chip = document.createElement("span");
        chip.className = "bw-chip";
        const t = document.createElement("b");
        t.textContent = r.word;
        const x = document.createElement("button");
        x.type = "button";
        x.textContent = "×";
        x.onclick = async () => {
          try {
            await api("/rest/v1/banned_words?word=eq." + enc(r.word), { method: "DELETE" });
            await loadWords();
          } catch (e) { alert("删不掉：" + e.message); }
        };
        chip.appendChild(t);
        chip.appendChild(x);
        list.appendChild(chip);
      });
    }

    await loadWords();
  }

  /* ---------- 音效 ---------- */
  const NOISE_SLOTS = [["rain", "雨声"], ["fire", "篝火"], ["cafe", "咖啡馆"], ["wave", "海浪"]];

  function renderNoise() {
    const pane = $("#adminPane");
    pane.innerHTML =
      '<p class="comment-as" style="margin-bottom:14px">把 mp3 传上去就会替换前台对应按钮。建议 30 秒~3 分钟、1MB 左右的循环音频。</p>' +
      '<div class="noise-admin" id="nsList"></div>';
    const wrap = $("#nsList");
    NOISE_SLOTS.forEach(([key, label]) => {
      const d = document.createElement("div");
      d.className = "ns-row";
      d.innerHTML =
        '<div class="ns-main"><b></b><span class="ns-sub"></span></div>' +
        '<div class="ns-btns">' +
        '<label class="tag upload-btn">选择文件<input type="file" accept="audio/*" hidden></label>' +
        '<button type="button" class="tag" data-act="try">试听</button>' +
        '<button type="button" class="tag danger" data-act="del">删除</button>' +
        '</div>';
      d.querySelector("b").textContent = label;
      const sub = d.querySelector(".ns-sub");
      sub.textContent = "noise/" + key + ".mp3";

      let cur = null;
      const inp = d.querySelector("input[type=file]");
      inp.onchange = async () => {
        const f = inp.files && inp.files[0];
        if (!f) return;
        if (f.size > 8 * 1024 * 1024) {
          sub.textContent = "文件太大了（上限 8MB）";
          sub.classList.add("bad");
          return;
        }
        sub.classList.remove("bad");
        sub.textContent = "上传中…";
        try {
          await window.ACCOUNT.uploadObject("noise/" + key + ".mp3", f, f.type || "audio/mpeg");
          sub.textContent = "已上传 · " + Math.round(f.size / 1024) + " KB";
        } catch (e) {
          sub.textContent = "失败：" + e.message;
          sub.classList.add("bad");
        }
        inp.value = "";
      };

      d.querySelector('[data-act="try"]').onclick = () => {
        if (cur) { cur.pause(); cur = null; return; }
        cur = new Audio(window.ACCOUNT.mediaUrl("noise/" + key + ".mp3"));
        cur.play().catch(() => {
          sub.textContent = "还没有这个音效";
          sub.classList.add("bad");
          cur = null;
        });
        cur.onended = () => { cur = null; };
      };

      d.querySelector('[data-act="del"]').onclick = async () => {
        if (!confirm("删除「" + label + "」的音频？")) return;
        await window.ACCOUNT.removeObject("noise/" + key + ".mp3");
        sub.textContent = "已删除（noise/" + key + ".mp3）";
      };

      wrap.appendChild(d);
    });
  }

  /* ---------- 作品集 ---------- */
  function compressImage(file, maxEdge, quality) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        let w = img.naturalWidth;
        let h = img.naturalHeight;
        const scale = Math.min(1, maxEdge / Math.max(w, h));
        w = Math.max(1, Math.round(w * scale));
        h = Math.max(1, Math.round(h * scale));
        const c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        const ctx = c.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        c.toBlob((blob) => {
          URL.revokeObjectURL(url);
          if (blob) resolve({ blob, w, h });
          else reject(new Error("压缩失败"));
        }, "image/jpeg", quality);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("这张图读不了"));
      };
      img.src = url;
    });
  }

  async function renderWorks() {
    const pane = $("#adminPane");
    pane.innerHTML =
      '<div class="admin-bar">' +
      '<label class="tag upload-btn">+ 上传图片<input type="file" id="wkFile" accept="image/*" multiple hidden></label>' +
      '<span class="comment-as" id="wkMsg">自动压到长边 2000px，省空间</span>' +
      '</div>' +
      '<div class="works-admin" id="wkList"><p class="c-empty">加载中…</p></div>';
    $("#wkFile").onchange = (e) => uploadPicked(e.target.files);
    await reloadWorks();
  }

  async function reloadWorks() {
    const list = $("#wkList");
    if (!list) return;
    let rows = [];
    try { rows = await api("/rest/v1/works?select=*&order=created_at.desc&limit=200"); } catch (e) {}
    if (!rows || !rows.length) {
      list.innerHTML = '<p class="c-empty">还没有作品。</p>';
      return;
    }
    list.innerHTML = "";
    rows.forEach((w) => {
      const d = document.createElement("div");
      d.className = "wk-row";
      d.innerHTML =
        '<img class="wk-thumb" alt="">' +
        '<div class="wk-main"><b class="wk-title"></b><span class="wk-sub"></span></div>' +
        '<button type="button" class="tag danger" data-act="del">删除</button>';
      const im = d.querySelector(".wk-thumb");
      im.src = window.ACCOUNT.imageUrl(w.path);
      d.querySelector(".wk-title").textContent = w.title || "(无标题)";
      d.querySelector(".wk-sub").textContent =
        (w.width && w.height ? w.width + "×" + w.height + " · " : "") + fmt(w.created_at);
      d.querySelector('[data-act="del"]').onclick = async () => {
        if (!confirm("删除这张作品？")) return;
        try {
          await api("/rest/v1/works?id=eq." + enc(w.id), { method: "DELETE" });
          await window.ACCOUNT.removeObject("works/" + w.path);
          await reloadWorks();
          if (window.WORKS_LOAD) window.WORKS_LOAD();
        } catch (e) { alert("删不掉：" + e.message); }
      };
      list.appendChild(d);
    });
  }

  async function uploadPicked(files) {
    const msg = $("#wkMsg");
    const arr = Array.from(files || []);
    if (!arr.length) return;
    let ok = 0;
    for (let i = 0; i < arr.length; i++) {
      msg.classList.remove("bad");
      msg.textContent = "处理中 " + (i + 1) + "/" + arr.length + "…";
      try {
        const { blob, w, h } = await compressImage(arr[i], 2000, 0.85);
        const name = "w" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6) + ".jpg";
        await window.ACCOUNT.uploadObject("works/" + name, blob, "image/jpeg");
        const title = String(arr[i].name || "").replace(/\.[^.]+$/, "").slice(0, 40);
        await api("/rest/v1/works", {
          method: "POST",
          body: { title, path: name, width: w, height: h },
        });
        ok++;
      } catch (e) {
        msg.textContent = "出错：" + e.message;
        msg.classList.add("bad");
      }
    }
    if (ok) msg.textContent = "上传了 " + ok + " 张";
    const inp = $("#wkFile");
    if (inp) inp.value = "";
    await reloadWorks();
    if (window.WORKS_LOAD) window.WORKS_LOAD();
  }

  /* ---------- 问答 ---------- */
  async function renderQa() {
    const pane = $("#adminPane");
    pane.innerHTML = '<div class="admin-list" id="qaWrap"><p class="c-empty">加载中…</p></div>';
    let rows = [];
    let profs = [];
    try { rows = await api("/rest/v1/questions?select=*&order=created_at.desc&limit=200"); } catch (e) {}
    try { profs = await api("/rest/v1/profiles?select=id,username,contact,contact_type"); } catch (e) {}
    const map = {};
    (profs || []).forEach((p) => { map[p.id] = p; });
    const wrap = $("#qaWrap");
    if (!rows || !rows.length) {
      wrap.innerHTML = '<p class="c-empty">还没有人提问。</p>';
      return;
    }
    wrap.innerHTML = "";

    rows.forEach((q) => {
      const who = map[q.user_id] || null;
      const answered = !!(q.answer && q.answer.trim());
      const d = document.createElement("div");
      d.className = "qa-admin-item" + (answered ? " done" : "");

      const head = document.createElement("div");
      head.className = "qa-admin-head";
      const whoEl = document.createElement("b");
      whoEl.className = "qa-admin-who";
      whoEl.textContent = who ? who.username : "匿名";
      if (who && who.contact) {
        whoEl.textContent += "（" + (who.contact_type === "wechat" ? "微信 " : "QQ ") + who.contact + "）";
      }
      const timeEl = document.createElement("span");
      timeEl.className = "qa-admin-time";
      timeEl.textContent = fmt(q.created_at);
      head.appendChild(whoEl);
      head.appendChild(timeEl);

      const bodyEl = document.createElement("p");
      bodyEl.className = "qa-admin-body";
      bodyEl.textContent = q.body;

      const act = document.createElement("div");
      act.className = "pf-actions";

      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "tag danger";
      delBtn.textContent = "删除";
      delBtn.onclick = async () => {
        if (!confirm("删除这条提问？")) return;
        try {
          await api("/rest/v1/questions?id=eq." + enc(q.id), { method: "DELETE" });
          renderQa();
          if (window.QALOAD) window.QALOAD();
        } catch (e) { alert("删不掉：" + e.message); }
      };

      if (answered) {
        const done = document.createElement("span");
        done.className = "qa-done";
        done.textContent = "✓ 已回答" + (q.answered_at ? " · " + fmt(q.answered_at) : "");
        const ansText = document.createElement("p");
        ansText.className = "qa-admin-ans-text";
        ansText.textContent = q.answer;
        act.appendChild(done);
        act.appendChild(delBtn);
        d.appendChild(head);
        d.appendChild(bodyEl);
        d.appendChild(ansText);
        d.appendChild(act);
      } else {
        const ta = document.createElement("textarea");
        ta.className = "qa-admin-ans";
        ta.rows = 2;
        ta.placeholder = "写回答…";
        const hint = document.createElement("span");
        hint.className = "comment-as";
        const saveBtn = document.createElement("button");
        saveBtn.type = "button";
        saveBtn.className = "btn-red";
        saveBtn.textContent = "保存回答";
        saveBtn.onclick = async () => {
          if (!ta.value.trim()) { hint.textContent = "先写点内容"; hint.classList.add("bad"); return; }
          hint.classList.remove("bad");
          hint.textContent = "保存中…";
          saveBtn.disabled = true;
          try {
            await api("/rest/v1/questions?id=eq." + enc(q.id), {
              method: "PATCH",
              body: { answer: ta.value.trim(), answered_at: new Date().toISOString() },
            });
            if (window.QALOAD) window.QALOAD();
            renderQa();
          } catch (e) {
            hint.textContent = "失败：" + e.message;
            hint.classList.add("bad");
            saveBtn.disabled = false;
          }
        };
        act.appendChild(saveBtn);
        act.appendChild(delBtn);
        act.appendChild(hint);
        d.appendChild(head);
        d.appendChild(bodyEl);
        d.appendChild(ta);
        d.appendChild(act);
      }

      wrap.appendChild(d);
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
      <label class="field"><span>网易云音乐主页链接（留空则导航不显示「音乐」）</span><input id="abMusic" placeholder="https://music.163.com/#/user/home?id=..."></label>
      <div class="pf-actions">
        <button type="button" class="btn-red" id="abSave">保存</button>
        <span class="comment-as" id="abMsg"></span>
      </div>`;
    const def = (k, v) => (map[k] != null && map[k] !== "" ? map[k] : v);
    $("#abAbout").value = def("about", $("#aboutText").textContent);
    $("#abWhat").value = def("what", $("#aboutWhat").textContent);
    $("#abWhere").value = def("where", $("#aboutWhere").textContent);
    $("#abMusic").value = map.netease || "";
    $("#abSave").onclick = async () => {
      const msg = $("#abMsg");
      msg.classList.remove("bad");
      msg.textContent = "保存中…";
      const items = [
        ["about", $("#abAbout").value],
        ["what", $("#abWhat").value],
        ["where", $("#abWhere").value],
        ["netease", $("#abMusic").value.trim()],
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
