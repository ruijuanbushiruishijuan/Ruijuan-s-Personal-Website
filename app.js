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
    window.dispatchEvent(new CustomEvent("post:open", { detail: p }));
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
    ["list", "article", "works", "archive", "about", "qa", "forum", "forumPost", "tools", "account", "admin"].forEach(id => {
      const el = $("#" + id);
      if (el) el.hidden = (id !== name);
    });
    document.querySelectorAll(".nav a").forEach(a => a.classList.remove("active"));
    const navFor = { list: "#navList", archive: '.nav a[href="#archive"]',
      about: '.nav a[href="#about"]', forum: '.nav a[href="#forum"]' };
    const sel = navFor[name];
    if (sel && $(sel)) {
      $(sel).classList.add("active");
      try { $(sel).scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" }); } catch (e) {}
    }
    updateProgress();
  }
  window.SHOW_SECTION = showSection;

  window.OPEN_POST_BY_ID = (id) => {
    const p = POSTS.find((x) => String(x.id) === String(id));
    if (p) openPost(p);
  };

  $("#backBtn").onclick = () => { showSection("list"); window.scrollTo({ top: 0 }); };

  /* ---------- 归档 ---------- */
  let archSort = "date";
  const sortRows = rows => {
    const r = rows.slice();
    if (archSort === "author")
      return r.sort((a, b) => (a.author || "").localeCompare(b.author || "") || byDateDesc(a, b));
    if (archSort === "likes")
      return r.sort((a, b) => (b.likes || 0) - (a.likes || 0) || byDateDesc(a, b));
    return r.sort(byDateDesc);
  };
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
      const rows = sortRows(byYear.get(y));
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
          <div class="archive-tags">${p.author || ""}</div>`;
        r.querySelector(".archive-title").textContent = p.title;
        r.onclick = () => openPost(p);
        holder.appendChild(r);
      });
      box.appendChild(sec);
    });
  }

  document.querySelectorAll("#sortBar .tag").forEach(btn => {
    btn.onclick = () => {
      archSort = btn.dataset.sort;
      document.querySelectorAll("#sortBar .tag").forEach(b => b.classList.toggle("on", b === btn));
      renderArchive();
    };
  });

  /* ---------- 导航 ---------- */
  document.querySelectorAll('.nav a[href^="#"]:not([target])').forEach(a => {
    a.onclick = e => {
      e.preventDefault();
      const id = a.getAttribute("href").slice(1);
      showSection(id);
      if (id === "archive") renderArchive();
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

  /* ---------- 赞数回填（供归档按赞排序） ---------- */
  let likeMap = {};
  function applyLikes() {
    posts.forEach(p => { p.likes = likeMap[p.id] || 0; });
    refresh();
  }
  window.addEventListener("likes:loaded", e => {
    likeMap = e.detail || {};
    applyLikes();
  });

  /* ---------- 从数据库加载文章 ---------- */
  async function loadFromDB() {
    if (!window.ACCOUNT) return null;
    try {
      const rows = await window.ACCOUNT.publicApi("/rest/v1/posts?select=*&order=date.desc");
      if (Array.isArray(rows) && rows.length) {
        posts = rows.map(r => Object.assign({}, r, { tags: r.tags || [] }));
        applyLikes();
      }
      return rows;
    } catch (e) { return null; }
  }
  window.RELOAD_POSTS = loadFromDB;

  /* ---------- 从数据库加载「关于」文字 ---------- */
  async function loadSiteInfo() {
    if (!window.ACCOUNT) return;
    try {
      const rows = await window.ACCOUNT.publicApi("/rest/v1/site_settings?select=key,value");
      const map = {};
      (rows || []).forEach(r => { map[r.key] = r.value; });
      if (map.about) $("#aboutText").textContent = map.about;
      if (map.what) $("#aboutWhat").textContent = map.what;
      if (map.where) $("#aboutWhere").textContent = map.where;
      const music = $("#navMusic");
      if (music && map.netease) {
        music.href = map.netease;
        music.hidden = false;
      }
    } catch (e) {}
  }
  window.RELOAD_SITE = loadSiteInfo;
  window.POSTS = POSTS;

  /* ---------- 启动 ---------- */
  refresh();
  showSection("list");
  updateProgress();
  loadFromDB();
  loadSiteInfo();
})();
