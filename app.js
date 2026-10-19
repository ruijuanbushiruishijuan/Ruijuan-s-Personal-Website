/* 站点逻辑 */
(function () {
  const $ = s => document.querySelector(s);
  const pad = n => String(n).padStart(2, "0");

  /* ---------- 基础信息 ---------- */
  $("#siteTitle").textContent = SITE.title;
  $("#siteTitleGhost").textContent = SITE.title;
  $("#siteSub").textContent = SITE.subtitle;
  if (SITE.kicker) $("#siteKicker").textContent = SITE.kicker;
  $("#aboutText").textContent = SITE.about || "";
  $("#aboutWhat").textContent = SITE.what || "";
  $("#aboutWhere").textContent = SITE.where || "";
  $("#footerText").textContent = SITE.footer || "";
  document.title = SITE.title;

  /* ---------- 数据层 ---------- */
  const STORE_KEY = "ruijuan_posts_v1";
  const OPEN_KEY = "ruijuan_admin_ok";

  const ensureIds = arr => {
    arr.forEach((p, i) => { if (!p.id) p.id = "p" + i + Date.now().toString(36); });
    return arr;
  };
  const filePosts = () => ensureIds(POSTS.map(p => Object.assign({}, p)));

  let posts = (function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr) && arr.length) return ensureIds(arr);
      }
    } catch (e) { /* 用文件版 */ }
    return filePosts();
  })();

  const savePosts = () => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(posts)); } catch (e) {}
  };

  let all = [];

  /* ---------- 工具 ---------- */
  const plain = html => String(html || "").replace(/<[^>]*>/g, "");
  const readMinutes = body => {
    const n = plain(body).replace(/\s/g, "").length;
    return Math.max(1, Math.round(n / 320));
  };
  const norm = s => String(s == null ? "" : s).trim().toLowerCase().replace(/\s+/g, "");
  const today = () => {
    const t = new Date();
    return `${t.getFullYear()}.${pad(t.getMonth() + 1)}.${pad(t.getDate())}`;
  };
  const normDate = s => {
    const v = String(s || "").trim().replace(/[-/]/g, ".");
    const m = v.match(/^(\d{4})\.(\d{1,2})\.(\d{1,2})$/);
    return m ? `${m[1]}.${pad(+m[2])}.${pad(+m[3])}` : v;
  };
  const byDateDesc = (a, b) => (b.date || "").localeCompare(a.date || "");
  const DEFAULT_AUTHOR = (typeof SITE !== "undefined" && SITE.defaultAuthor) || "瑞卷";

  /* ---------- 状态 ---------- */
  let activeTag = "";
  let keyword = "";

  /* ---------- 标签栏 ---------- */
  const tagBar = $("#tagBar");
  const mkTag = (label, value) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "tag" + (value === activeTag ? " on" : "");
    b.textContent = label;
    b.onclick = () => { activeTag = value; render(); };
    return b;
  };
  function renderTags() {
    const set = new Set();
    all.forEach(p => (p.tags || []).forEach(t => set.add(t)));
    tagBar.innerHTML = "";
    tagBar.appendChild(mkTag("全部", ""));
    [...set].forEach(t => tagBar.appendChild(mkTag(t, t)));
  }

  /* ---------- 列表 ---------- */
  function filtered() {
    const kw = keyword.trim().toLowerCase();
    return all.filter(p => {
      if (activeTag && !(p.tags || []).includes(activeTag)) return false;
      if (!kw) return true;
      const hay = (p.title + " " + (p.excerpt || "") + " " + plain(p.body)).toLowerCase();
      return hay.includes(kw);
    });
  }

  function render() {
    renderTags();
    const list = filtered();
    const wrap = $("#posts");
    wrap.innerHTML = "";
    $("#empty").hidden = list.length > 0;

    list.forEach((p, i) => {
      const el = document.createElement("article");
      el.className = "post-item";
      el.innerHTML = `
        <div class="post-index">${pad(list.length - i)}</div>
        <div>
          <div class="post-title"><span class="pin-flag" ${p.pinned ? "" : "hidden"}>置顶</span><span class="t"></span></div>
          <div class="post-excerpt"></div>
        </div>
        <div class="post-side">
          <div class="post-date">${p.date || ""}</div>
          <div class="post-author">${p.author || DEFAULT_AUTHOR}</div>
          <div class="post-tags">${(p.tags || []).map(t =>
            `<span class="mini-tag">${t}</span>`).join("")}</div>
          <div class="post-read">约 ${readMinutes(p.body)} 分钟</div>
        </div>`;
      el.querySelector(".post-title .t").textContent = p.title;
      el.querySelector(".post-excerpt").textContent = p.excerpt || "";
      el.onclick = () => openPost(p);
      wrap.appendChild(el);
    });
  }

  /* ---------- 搜索 ---------- */
  const searchInput = $("#search");
  const clearBtn = $("#searchClear");
  searchInput.addEventListener("input", () => {
    keyword = searchInput.value;
    clearBtn.hidden = !keyword;
    render();
  });
  clearBtn.onclick = () => {
    searchInput.value = ""; keyword = ""; clearBtn.hidden = true; render();
  };

  /* ---------- 打开文章 ---------- */
  function openPost(p) {
    showSection("article");
    $("#artAuthor").textContent = p.author || DEFAULT_AUTHOR;
    $("#artDate").textContent = p.date || "";
    $("#artRead").textContent = `约 ${readMinutes(p.body)} 分钟`;
    $("#artTags").textContent = (p.tags || []).join(" / ");
    $("#artTitle").textContent = p.title;

    const body = $("#artBody");
    body.innerHTML = p.body || "";

    const tocBody = $("#tocBody");
    tocBody.innerHTML = "";
    const heads = [...body.querySelectorAll("h3")];
    if (heads.length >= 2) {
      heads.forEach((h, i) => {
        h.id = "h" + i;
        const a = document.createElement("a");
        a.href = "#h" + i;
        a.textContent = h.textContent;
        a.onclick = e => {
          e.preventDefault();
          h.scrollIntoView({ behavior: "smooth", block: "start" });
        };
        tocBody.appendChild(a);
      });
      $("#toc").hidden = false;
    } else {
      $("#toc").hidden = true;
    }

    const chrono = posts.slice().sort(byDateDesc);
    const idx = chrono.indexOf(p);
    const nav = $("#postnav");
    nav.innerHTML = "";
    nav.appendChild(mkPn("← 更新的一篇", chrono[idx - 1], "prev"));
    nav.appendChild(mkPn("更旧的一篇 →", chrono[idx + 1], "next"));

    window.scrollTo({ top: 0 });
    updateProgress();
  }

  function mkPn(label, post, cls) {
    const d = document.createElement("div");
    d.className = "pn " + cls + (post ? "" : " void");
    if (post) {
      d.innerHTML = `<div class="pn-label">${label}</div><div class="pn-title"></div>`;
      d.querySelector(".pn-title").textContent = post.title;
      d.onclick = () => openPost(post);
    }
    return d;
  }

  /* ---------- 区块切换 ---------- */
  function showSection(name) {
    if (name !== "admin") adminOpen = false;   // 一旦离开就上锁
    ["list", "article", "archive", "about", "admin"].forEach(id => {
      const el = $("#" + id);
      if (el) el.hidden = (id !== name);
    });
    document.querySelectorAll(".nav a").forEach(a => a.classList.remove("active"));
    const navFor = { list: "#navList", archive: '.nav a[href="#archive"]',
      about: '.nav a[href="#about"]', admin: '.nav a[href="#admin"]' };
    const sel = navFor[name];
    if (sel && $(sel)) $(sel).classList.add("active");
    updateProgress();
  }

  $("#backBtn").onclick = () => { showSection("list"); window.scrollTo({ top: 0 }); };

  /* ---------- 归档 ---------- */
  function renderArchive() {
    const box = $("#archiveBody");
    box.innerHTML = "";
    const byYear = new Map();
    all.forEach(p => {
      const y = (p.date || "").slice(0, 4) || "----";
      if (!byYear.has(y)) byYear.set(y, []);
      byYear.get(y).push(p);
    });
    [...byYear.keys()].sort().reverse().forEach(y => {
      const rows = byYear.get(y).slice().sort(byDateDesc);
      const sec = document.createElement("div");
      sec.innerHTML = `
        <div class="archive-year"><b>${y}</b><span>${pad(rows.length)} 篇</span></div>
        <div class="archive-rows"></div>`;
      const holder = sec.querySelector(".archive-rows");
      rows.forEach(p => {
        const r = document.createElement("div");
        r.className = "archive-row";
        r.innerHTML = `
          <div class="archive-date">${(p.date || "").slice(5)}</div>
          <div class="archive-title"></div>
          <div class="archive-tags">${(p.tags || []).join(" · ")}</div>`;
        r.querySelector(".archive-title").textContent = p.title;
        r.onclick = () => openPost(p);
        holder.appendChild(r);
      });
      box.appendChild(sec);
    });
  }

  /* ================= 管理 ================= */
  const ADMIN_CFG = (typeof ADMIN !== "undefined" && ADMIN) ? ADMIN : {};
  const QUESTIONS = Array.isArray(ADMIN_CFG.questions) ? ADMIN_CFG.questions : [];
  let gateQuestion = null;

  let adminOpen = false;   // 只存内存：刷新、离开管理页都会重新上锁
  const isOpen = () => adminOpen;
  const pickQuestion = () => QUESTIONS.length
    ? QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)]
    : null;

  function renderGate() {
    gateQuestion = pickQuestion();
    const btn = $("#gateForm").querySelector("button");
    $("#gateErr").hidden = true;
    $("#gateInput").value = "";
    if (!gateQuestion) {
      $("#gateQ").textContent = "还没设置问题：去 posts.js 的 ADMIN.questions 里填一条。";
      $("#gateInput").disabled = true;
      btn.disabled = true;
      return;
    }
    $("#gateQ").textContent = gateQuestion.q;
    $("#gateInput").disabled = false;
    btn.disabled = false;
  }

  async function sha256Hex(str) {
    const buf = new TextEncoder().encode(str);
    const dig = await crypto.subtle.digest("SHA-256", buf);
    return [...new Uint8Array(dig)].map(b => b.toString(16).padStart(2, "0")).join("");
  }

  async function answerOk(q, input) {
    const v = norm(input);
    if (Array.isArray(q.h) && q.h.length) {
      if (!(window.crypto && crypto.subtle)) return false;
      const hh = await sha256Hex(v);
      if (q.h.includes(hh)) return true;
    }
    return [].concat(q.a == null ? [] : q.a).some(a => norm(a) === v);
  }

  $("#gateForm").addEventListener("submit", async e => {
    e.preventDefault();
    if (!gateQuestion) return;
    const ok = await answerOk(gateQuestion, $("#gateInput").value);
    if (ok) {
      adminOpen = true;
      $("#gateInput").value = "";
      renderAdmin();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      $("#gateErr").hidden = false;
      $("#gateInput").select();
    }
  });

  function renderAdmin() {
    const open = isOpen();
    $("#gate").hidden = open;
    $("#panel").hidden = !open;
    if (open) {
      updateAdminList();
      if (!$("#fDate").value) $("#fDate").value = today();
    } else {
      $("#addForm").hidden = true;
      renderGate();
    }
  }

  function updateAdminList() {
    const box = $("#adminList");
    box.innerHTML = "";
    $("#panelCount").textContent = `${all.length} 篇`;

    all.forEach(p => {
      const row = document.createElement("div");
      row.className = "admin-row" + (p.pinned ? " is-pinned" : "");
      row.innerHTML = `
        <input class="rowchk" type="checkbox" aria-label="选择">
        <div class="admin-meta">
          <div class="admin-title"></div>
          <div class="admin-date">${p.date || ""}</div>
        </div>
        <span class="pin-mark" ${p.pinned ? "" : "hidden"}>置顶</span>`;
      row.querySelector(".admin-title").textContent = p.title;
      const chk = row.querySelector(".rowchk");
      chk.dataset.id = p.id;
      chk.onchange = updateSelBar;
      box.appendChild(row);
    });
    updateSelBar();
  }

  const selectedIds = () =>
    [...document.querySelectorAll("#adminList .rowchk:checked")].map(c => c.dataset.id);

  function updateSelBar() {
    const ids = selectedIds();
    $("#selBar").hidden = ids.length === 0;
    $("#selCount").textContent = `已选 ${ids.length} 篇`;
  }

  const clearSel = () => {
    document.querySelectorAll("#adminList .rowchk").forEach(c => { c.checked = false; });
    updateSelBar();
  };

  $("#clearSel").onclick = clearSel;

  $("#pinSel").onclick = () => {
    const ids = selectedIds();
    posts.forEach(p => { if (ids.includes(p.id)) p.pinned = true; });
    savePosts(); refresh(); renderAdmin();
  };

  $("#unpinSel").onclick = () => {
    const ids = selectedIds();
    posts.forEach(p => { if (ids.includes(p.id)) p.pinned = false; });
    savePosts(); refresh(); renderAdmin();
  };

  $("#delSel").onclick = () => {
    const ids = selectedIds();
    if (!ids.length) return;
    if (!confirm(`删除选中的 ${ids.length} 篇文章？`)) return;
    posts = posts.filter(p => !ids.includes(p.id));
    savePosts(); refresh(); renderAdmin();
  };

  /* --- 添加文章 --- */
  $("#toggleEditor").onclick = () => {
    const f = $("#addForm");
    f.hidden = !f.hidden;
    if (!f.hidden) {
      if (!$("#fDate").value) $("#fDate").value = today();
      if (!$("#fAuthor").value) $("#fAuthor").value = DEFAULT_AUTHOR;
      $("#fTitle").focus();
    }
  };

  $("#cancelAdd").onclick = () => {
    $("#addForm").hidden = true;
    $("#addForm").reset();
    $("#fDate").value = today();
  };

  $("#addForm").addEventListener("submit", e => {
    e.preventDefault();
    const title = $("#fTitle").value.trim();
    if (!title) return;
    const post = {
      id: "p" + Date.now().toString(36),
      date: normDate($("#fDate").value) || today(),
      tags: $("#fTags").value.split(/[,，、\s]+/).map(s => s.trim()).filter(Boolean),
      title,
      author: $("#fAuthor").value.trim() || DEFAULT_AUTHOR,
      excerpt: $("#fExcerpt").value.trim(),
      body: $("#fBody").value,
      pinned: false,
    };
    posts.push(post);
    savePosts(); refresh(); renderAdmin();
    $("#addForm").reset();
    $("#fDate").value = today();
    $("#addForm").hidden = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* --- 导出 / 恢复 --- */
  function buildFile() {
    const adminCfg = (typeof ADMIN !== "undefined" && ADMIN) ? ADMIN : { questions: [] };
    return [
      "/* 由「管理文章」面板导出 —— 用它覆盖 /sdcard/DSH/website/posts.js */",
      "",
      "const SITE = " + JSON.stringify(SITE, null, 2) + ";",
      "",
      "const ADMIN = " + JSON.stringify(adminCfg, null, 2) + ";",
      "",
      "const POSTS = " + JSON.stringify(posts, null, 2) + ";",
      "",
    ].join("\n");
  }

  $("#exportBtn").onclick = () => {
    const blob = new Blob([buildFile()], { type: "application/javascript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "posts.js";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  };

  $("#resetBtn").onclick = () => {
    if (!confirm("丢弃浏览器里的改动，恢复成 posts.js 里的内容？")) return;
    localStorage.removeItem(STORE_KEY);
    posts = filePosts();
    refresh(); renderAdmin();
  };

  $("#lockBtn").onclick = () => {
    adminOpen = false;
    renderAdmin();
    window.scrollTo({ top: 0 });
  };

  /* ---------- 导航 ---------- */
  document.querySelectorAll('.nav a[href^="#"]').forEach(a => {
    a.onclick = e => {
      e.preventDefault();
      const id = a.getAttribute("href").slice(1);
      showSection(id);
      if (id === "archive") renderArchive();
      if (id === "admin") renderAdmin();
      window.scrollTo({ top: 0 });
    };
  });

  /* ---------- 主题 ---------- */
  const themeBtn = $("#themeBtn");
  const saved = localStorage.getItem("theme");
  if (saved) document.documentElement.dataset.theme = saved;
  themeBtn.onclick = () => {
    const cur = document.documentElement.dataset.theme === "dark" ? "" : "dark";
    document.documentElement.dataset.theme = cur;
    localStorage.setItem("theme", cur);
  };

  /* ---------- 进度条 / 回顶 ---------- */
  const bar = $("#progress");
  const toTop = $("#toTop");
  function updateProgress() {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const y = h.scrollTop || document.body.scrollTop;
    const pct = max > 0 ? (y / max) * 100 : 0;
    bar.style.width = pct + "%";
    toTop.hidden = y < 400;
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  toTop.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });

  /* ---------- 刷新 ---------- */
  function refresh() {
    all = posts.slice().sort((a, b) => {
      const pa = a.pinned ? 1 : 0, pb = b.pinned ? 1 : 0;
      if (pa !== pb) return pb - pa;
      return byDateDesc(a, b);
    });
    $("#postCount").textContent = pad(all.length);
    render();
    renderArchive();
  }

  /* ---------- 启动 ---------- */
  refresh();
  showSection("list");
  updateProgress();
})();
