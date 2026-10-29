/* bundle：posts.js + account.js + gate.js + social.js + tools.js + qa.js + works.js + forum.js + notice.js + admin.js + app.js */

;
/* ---- posts.js ---- */
/* ============================================================
 * 站点内容配置
 * 加文章：复制一段对象即可
 *   tags 可以是多个，筛选条会自动生成
 * ============================================================ */

const SITE = {
  title: "瑞卷",
  subtitle: "不是瑞士卷，是瑞卷",
  kicker: "ЛИЧНЫЙ БЛОГ · 个人博客",
  about: "这里是关于我的一段话。可以写你是谁、在哪里、在做什么。",
  what: "这里写我在做什么、关心什么。",
  where: "联系方式 / 邮箱 / 社交账号。",
  footer: "© 2026 個人ブログ",
};

/* ============================================================
 * 管理区：只有你知道的问题
 *   h = 答案规范化（去空格、转小写）后的 SHA-256 哈希，源码里看不到明文
 *   a = 也可以直接写明文答案（不推荐，但方便）
 *   想加新题：把答案发我，我算哈希；或者你把 a 写明文也能用
 * ============================================================ */
const ADMIN = {
  questions: [
    {
      q: "我最喜欢的漫画作品是？",
      h: [
        "e2c921d37fa15fa36fcfef678eff5e9c32e4dcc06276622088768bf303337f1c",
        "caea79e7382f262ccc2aa98bf86a388b682465bdfb0dd8bb5f66088a4bbf6655",
        "228eb9a87ea9811b33a399b90e065f2eac0d1b5319c9f7a8b10c5b5c415fa3ea",
        "3e490567c44ab9aeb925073c62bc89bca7a8a357b1d450f10328076323737bc3",
      ],
    },
    {
      q: "我第一任女友的姓是？",
      h: ["c732e4d7e3805bf45ca30b2a35b9eca7daec5e5a1cfcb098e8fdded9ea7a66ef"],
    },
    {
      q: "瑞卷的梦想是？",
      h: [
        "adea0726341ddc1e5afb864e7036468cce87279273b3e2a3542d4e318830c178",
        "e86aae75fd0db0454f472e1fa728dcb90ad090b8274dc04492c5bf9bd5289673",
        "b2f8207b2d72fe64b0fcbac52d68a4605be3bef875bc52619ed2577d983794ee",
      ],
    },

    {
      q: "世萌萌王里我最喜欢的是？",
      h: ["6c645a49994fe5f741d709856c0c1a72a3ee2b8ec4d554aa07b8e4467ac5c3ba"],
    },
    {
      q: "我读的第一本马列著作是？",
      h: [
        "eee8ff7f6341bae724fd5ee2e7888895f1e2fe50a66aedc8eca49e94eae68bdf",
        "b90c1c69389718d75e1124bdf5bb2934c2125a966348c4441e0a9897094a4b2e",
      ],
    },
    {
      q: "我桌前的画像是？",
      h: [
        "a949a533ee191bd36faf1dad84cbc608955a6659a1cb450771859f2bfdafa7eb",
        "e540426218dfc1c974b96d4dbf44074a194e109ab1e82cd16011d8d8b497a58f",
      ],
    },
  ],
};

const POSTS = [
  {
    id: "first",
    date: "2026.10.19",
    author: "deepseek蓝色大肥鱼",
    tags: ["随笔"],
    title: "第一篇文章",
    excerpt: "站建起来了。先写点什么，把这块空地占住。",
    body: `
      <p>位置是空的，那就先从空着开始。</p>
      <h3>为什么开这个</h3>
      <p>有些想法不写下来就会散掉。这里当仓库用，也当练手用。</p>
      <blockquote>写下来，是因为不想让它们只在脑子里转一圈。</blockquote>
      <h3>会写什么</h3>
      <p>内容会很杂，想到什么写什么。技术、设计、路上的见闻，都算。</p>
      <p>不追求完整，只求比昨天多留下一点东西。</p>
    `,
  },
  {
    id: "constructivism",
    date: "2026.10.19",
    author: "deepseek蓝色大肥鱼",
    tags: ["设计", "随笔"],
    title: "关于这套配色的来历",
    excerpt: "红、黑、米白，斜切的楔形，大字压着版面——构成主义的招数。",
    body: `
      <p>二十年代的先锋派把版面当成建筑：几何、对角线、粗体字、强对比。</p>
      <h3>三个元素</h3>
      <p>红是强调，黑是骨架，米白是纸。所有装饰都必须有结构上的理由。</p>
      <p>所以这里的饰件只有三种：斜块、圆、粗线。</p>
      <h3>为什么不用图片</h3>
      <p>一旦放了图，版面就散了。构成主义靠排版撑起来，不靠插图。</p>
      <blockquote>装饰要有理由，否则就是噪音。</blockquote>
    `,
  },
  {
    id: "typing",
    date: "2026.10.18",
    author: "deepseek蓝色大肥鱼",
    tags: ["随笔"],
    title: "写字这件事",
    excerpt: "写下来跟想清楚，很多时候是同一件事。",
    body: `
      <p>有些东西在脑子里转的时候觉得很清楚，一落笔就发现漏洞。</p>
      <h3>落笔是检查</h3>
      <p>所以我写东西更多是为了检查自己，而不是为了给人看。</p>
      <p>但写给别人看的压力，也确实能让话更准确一些。</p>
    `,
  },
  {
    id: "stack",
    date: "2026.10.17",
    author: "deepseek蓝色大肥鱼",
    tags: ["技术"],
    title: "这套站的构成",
    excerpt: "三个文件，没有框架，没有构建步骤。",
    body: `
      <p>纯静态：一个 HTML、一个 CSS、一个 JS，加一个内容文件。</p>
      <h3>为什么不折腾框架</h3>
      <p>内容量撑不起一套构建流程。加依赖的收益，还不如直接手写。</p>
      <p>需要搜索和筛选，就用几十行 JS 做完。</p>
      <h3>以后呢</h3>
      <p>文章多了再说。到那时候，迁移也不难。</p>
    `,
  },
  {
    id: "winter",
    date: "2026.10.15",
    author: "deepseek蓝色大肥鱼",
    tags: ["备忘"],
    title: "入冬前要处理的事",
    excerpt: "一份不长的清单。",
    body: `
      <p>一、把该收的东西收好。</p>
      <p>二、检查备用电源。</p>
      <p>三、早点睡。</p>
      <blockquote>清单越短，越容易真的做完。</blockquote>
    `,
  },
  {
    id: "reading",
    date: "2026.10.12",
    author: "deepseek蓝色大肥鱼",
    tags: ["随笔", "设计"],
    title: "关于版面的一点偏见",
    excerpt: "版面对齐的方式，决定了读者怎么读。",
    body: `
      <p>居中看起来安全，但读起来慢；左对齐朴素，但推进快。</p>
      <h3>我的偏好</h3>
      <p>正文永远左对齐。标题可以放肆，正文必须老实。</p>
      <p>行宽控制在三十来字，再宽眼睛就要回头找了。</p>
    `,
  },
];

;

;
/* ---- account.js ---- */
/* 账号系统：注册 / 登录 / 退出（Supabase Auth + 花名册） */
(function () {
  const CFG = {
    /* 走自家域名中转，避免 supabase.co 被墙 */
    url: "https://api.ruijuanbushiruishijuan.top",
    key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyZnpweW96Yml3bmZ6Y25ka2ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1ODMxNjcsImV4cCI6MjEwODE1OTE2N30.JFDrDZZXB6aIwYHVR8Fl8kfAFtf0IAfPZsKsPgmXbfg",
    /* 用户名会被转成 <hash>@mail.<域名> 的内部邮箱，用户看不到 */
    mail: "user.ruijuanbushiruishijuan.top",
  };
  const LS_KEY = "ruijuan_session_v1";
  const $ = (s) => document.querySelector(s);

  let session = null; // { access_token, refresh_token, expires_at, user }
  let profile = null; // { id, username, phone, contact, contact_type, role, status }
  let ctSignup = "qq";
  let ctEdit = "qq";
  const listeners = [];

  /* ---------- 基础请求 ---------- */
  async function api(path, opts) {
    const o = opts || {};
    const headers = Object.assign({ apikey: CFG.key }, o.headers || {});
    if (o.body) headers["Content-Type"] = "application/json";
    if (o.token) headers.Authorization = "Bearer " + o.token;
    let res;
    try {
      res = await fetch(CFG.url + path, {
        method: o.method || "GET",
        headers,
        body: o.body ? JSON.stringify(o.body) : undefined,
      });
    } catch (e) {
      throw new Error("连不上服务器，检查一下网络");
    }
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch (e) { data = { raw: text }; }
    if (!res.ok) {
      const err = new Error(
        (data && (data.msg || data.message || data.error_description || data.hint)) ||
        "请求失败（" + res.status + "）"
      );
      err.status = res.status;
      err.code = data && (data.error_code || data.code);
      throw err;
    }
    return data;
  }

  /* ---------- 用户名 → 内部邮箱 ---------- */
  const norm = (u) => u.trim().toLowerCase();
  async function emailFor(username) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(norm(username)));
    const hex = [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
    return "u" + hex.slice(0, 40) + "@" + CFG.mail;
  }

  /* ---------- 会话 ---------- */
  function persist() {
    try {
      if (session) localStorage.setItem(LS_KEY, JSON.stringify(session));
      else localStorage.removeItem(LS_KEY);
    } catch (e) {}
  }

  async function loadProfile() {
    if (!session) { profile = null; return; }
    try {
      const rows = await api(
        "/rest/v1/profiles?select=id,username,phone,role,status,contact,contact_type&id=eq." + encodeURIComponent(session.user.id),
        { token: session.access_token }
      );
      profile = (rows && rows[0]) || null;
    } catch (e) {
      profile = null;
    }
    if (!profile) {
      const meta = session.user.user_metadata || {};
      profile = { id: session.user.id, username: meta.username || "我", phone: meta.phone || "", contact: meta.contact || "", contact_type: meta.contact_type || "qq", role: "user" };
    }
  }

  async function setSession(data) {
    session = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: Date.now() + (data.expires_in || 3600) * 1000,
      user: data.user,
    };
    persist();
    await loadProfile();
    if (profile && profile.status === "banned") {
      session = null;
      profile = null;
      persist();
      emit();
      throw new Error("这个账号已被停用，请联系管理员");
    }
    emit();
  }

  async function signUp(username, password, contact, ct) {
    const email = await emailFor(username);
    const data = await api("/auth/v1/signup", {
      method: "POST",
      body: {
        email, password,
        data: { username: norm(username), contact: String(contact).trim(), contact_type: ct || "qq" },
      },
    });
    if (!data || !data.access_token) throw new Error("注册没拿到登录凭证，请检查后端的「确认邮件」是否已关闭");
    await setSession(data);
  }

  async function signIn(username, password) {
    const email = await emailFor(username);
    const data = await api("/auth/v1/token?grant_type=password", {
      method: "POST",
      body: { email, password },
    });
    await setSession(data);
  }

  async function signOut() {
    if (session) {
      try { await api("/auth/v1/logout", { method: "POST", token: session.access_token }); } catch (e) {}
    }
    session = null;
    profile = null;
    persist();
    emit();
  }

  async function saveContact(contact, ct) {
    if (!session) throw new Error("还没登录");
    await api("/rest/v1/profiles?id=eq." + encodeURIComponent(session.user.id), {
      method: "PATCH",
      token: session.access_token,
      body: { contact: String(contact).trim(), contact_type: ct || "qq" },
    });
    await loadProfile();
    emit();
  }

  async function uploadObject(path, blob, type) {
    if (!session) throw new Error("还没登录");
    if (session.refresh_token && Date.now() > (session.expires_at || 0) - 60000) {
      await refreshSession();
    }
    if (!session) throw new Error("登录已过期，请重新登录");
    const put = (tk) => fetch(CFG.url + "/storage/v1/object/" + path, {
      method: "POST",
      headers: {
        apikey: CFG.key,
        Authorization: "Bearer " + tk,
        "Content-Type": type || "application/octet-stream",
      },
      body: blob,
    });
    let res = await put(session.access_token);
    if (res.status === 401 && session && session.refresh_token) {
      const ok = await refreshSession();
      if (ok && session) res = await put(session.access_token);
    }
    if (!res.ok) {
      let t = "";
      try { t = await res.text(); } catch (e) {}
      throw new Error(!t ? "上传失败 " + res.status : t.slice(0, 140));
    }
    return CFG.url + "/storage/v1/object/public/" + path;
  }

  async function removeObject(path) {
    if (!session) return;
    try {
      if (session.refresh_token && Date.now() > (session.expires_at || 0) - 60000) {
        await refreshSession();
      }
      if (!session) return;
      await fetch(CFG.url + "/storage/v1/object/" + path, {
        method: "DELETE",
        headers: { apikey: CFG.key, Authorization: "Bearer " + session.access_token },
      });
    } catch (e) {}
  }

  const imageUrl = (p) => CFG.url + "/storage/v1/object/public/works/" + p;
  const mediaUrl = (p) => CFG.url + "/storage/v1/object/public/" + p;

  /* ---------- 状态广播 ---------- */
  function emit() {
    render();
    listeners.forEach((fn) => { try { fn(state()); } catch (e) {} });
  }
  const state = () => ({
    loggedIn: !!session,
    user: session ? session.user : null,
    profile,
    token: session ? session.access_token : null,
  });

  /* ---------- 界面 ---------- */
  const msg = (el, text, bad) => {
    if (!el) return;
    el.textContent = text || "";
    el.classList.toggle("bad", !!bad);
  };

  function render() {
    const chip = $("#userChip");
    if (chip) {
      if (session && profile) {
        chip.textContent = profile.username;
        chip.classList.add("on");
      } else {
        chip.textContent = "登录";
        chip.classList.remove("on");
      }
    }
    const loginForm = $("#loginForm");
    const signupForm = $("#signupForm");
    const mePanel = $("#mePanel");
    const tabs = $("#authTabs");
    const logged = !!session;
    if (loginForm) loginForm.hidden = logged;
    if (signupForm) signupForm.hidden = true;
    if (mePanel) mePanel.hidden = !logged;
    if (tabs) tabs.hidden = logged;
    if (logged && profile) {
      $("#meName").textContent = profile.username;
      $("#mePhone").textContent = (profile.contact ? (profile.contact_type === "wechat" ? "微信 " : "QQ ") + profile.contact : "未绑定");
      $("#meRole").textContent = profile.role === "admin" ? "管理员" : "普通成员";
      const c2 = $("#ctSwitch2");
      if (c2) {
        c2.querySelectorAll("button").forEach((b) =>
          b.classList.toggle("on", b.dataset.ct === (profile.contact_type || "qq")));
      }
      const mi = $("#mePhoneInput");
      if (mi && !mi.value) mi.value = profile.contact || "";
    }
  }

  function switchTab(which) {
    const login = which !== "signup";
    $("#loginForm").hidden = !login;
    $("#signupForm").hidden = login;
    document.querySelectorAll("#authTabs .tag").forEach((b) => {
      b.classList.toggle("on", b.dataset.tab === (login ? "login" : "signup"));
    });
    msg($("#loginMsg"), "");
    msg($("#signupMsg"), "");
  }

  function wire() {
    const chip = $("#userChip");
    if (chip) {
      chip.onclick = () => {
        if (window.SHOW_SECTION) window.SHOW_SECTION("account");
        window.scrollTo({ top: 0 });
      };
    }
    const tabs = $("#authTabs");
    if (tabs) {
      tabs.querySelectorAll(".tag").forEach((b) => {
        b.onclick = () => switchTab(b.dataset.tab);
      });
    }

    const lf = $("#loginForm");
    if (lf) {
      lf.onsubmit = async (e) => {
        e.preventDefault();
        const u = $("#loginUser").value.trim();
        const p = $("#loginPass").value;
        if (!u || !p) return msg($("#loginMsg"), "用户名和密码都要填", true);
        const btn = lf.querySelector("button[type=submit]");
        btn.disabled = true;
        msg($("#loginMsg"), "登录中…");
        try {
          await signIn(u, p);
          msg($("#loginMsg"), "");
          $("#loginPass").value = "";
        } catch (err) {
          const m = String(err.message || "");
          msg($("#loginMsg"), /invalid|credentials/i.test(m) ? "用户名或密码不对" : m, true);
        } finally {
          btn.disabled = false;
        }
      };
    }

    const sf = $("#signupForm");
    if (sf) {
      sf.onsubmit = async (e) => {
        e.preventDefault();
        const u = $("#suUser").value.trim();
        const p = $("#suPass").value;
        const p2 = $("#suPass2").value;
        const tel = $("#suContact").value.trim();
        if (u.length < 2 || u.length > 20) return msg($("#signupMsg"), "用户名要 2~20 个字", true);
        if (p.length < 6) return msg($("#signupMsg"), "密码至少 6 位", true);
        if (p !== p2) return msg($("#signupMsg"), "两次密码不一样", true);
        if (tel.length < 4) return msg($("#signupMsg"), "填一下 QQ 号或微信号", true);
        const btn = sf.querySelector("button[type=submit]");
        btn.disabled = true;
        msg($("#signupMsg"), "注册中…");
        try {
          await signUp(u, p, tel, ctSignup);
          msg($("#signupMsg"), "");
          sf.reset();
        } catch (err) {
          const m = String(err.message || "");
          let say = m;
          if (/already|registered|exists/i.test(m)) say = "这个用户名被占了，换一个吧";
          else if (/password/i.test(m) && /least|short/i.test(m)) say = "密码太短了";
          msg($("#signupMsg"), say, true);
        } finally {
          btn.disabled = false;
        }
      };
    }

    const out = $("#logoutBtn");
    if (out) {
      out.onclick = async () => {
        out.disabled = true;
        await signOut();
        out.disabled = false;
        switchTab("login");
      };
    }

    const cs = $("#ctSwitch");
    if (cs) {
      cs.querySelectorAll("button").forEach((b) => {
        b.onclick = () => {
          ctSignup = b.dataset.ct;
          cs.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
          $("#suContact").placeholder = ctSignup === "wechat" ? "微信号" : "QQ 号";
        };
      });
    }
    const cs2 = $("#ctSwitch2");
    if (cs2) {
      cs2.querySelectorAll("button").forEach((b) => {
        b.onclick = () => {
          ctEdit = b.dataset.ct;
          cs2.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
        };
      });
    }

    const pf = $("#phoneForm");
    if (pf) {
      pf.onsubmit = async (e) => {
        e.preventDefault();
        const tel = $("#mePhoneInput").value.trim();
        if (tel.length < 4) return msg($("#phoneMsg"), "填一下 QQ 号或微信号", true);
        try {
          await saveContact(tel, ctEdit);
          msg($("#phoneMsg"), "已保存");
        } catch (err) {
          msg($("#phoneMsg"), err.message, true);
        }
      };
    }
  }

  /* ---------- 启动 ---------- */
  async function boot() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        session = JSON.parse(raw);
        if (session && session.refresh_token) {
          if (Date.now() > (session.expires_at || 0) - 60000) {
            try {
              const data = await api("/auth/v1/token?grant_type=refresh_token", {
                method: "POST",
                body: { refresh_token: session.refresh_token },
              });
              await setSession(data);
            } catch (e) {
              session = null; profile = null; persist();
            }
          } else {
            await loadProfile();
          }
        } else {
          session = null;
        }
      }
    } catch (e) {
      session = null; profile = null;
    }
    emit();
  }

  /* ---------- 自动续期 ---------- */
  let refreshing = null;
  function refreshSession() {
    if (!session || !session.refresh_token) return Promise.resolve(false);
    if (!refreshing) {
      refreshing = (async () => {
        try {
          const data = await api("/auth/v1/token?grant_type=refresh_token", {
            method: "POST",
            body: { refresh_token: session.refresh_token },
          });
          if (!data || !data.access_token) throw new Error("refresh failed");
          session.access_token = data.access_token;
          if (data.refresh_token) session.refresh_token = data.refresh_token;
          session.expires_at = Date.now() + (data.expires_in || 3600) * 1000;
          if (data.user) session.user = data.user;
          persist();
          return true;
        } catch (e) {
          session = null; profile = null; persist();
          try { emit(); } catch (e2) {}
          return false;
        } finally {
          refreshing = null;
        }
      })();
    }
    return refreshing;
  }

  async function authed(path, o) {
    if (!session) throw new Error("请先登录");
    if (session.refresh_token && Date.now() > (session.expires_at || 0) - 60000) {
      await refreshSession();
    }
    if (!session) throw new Error("登录已过期，请重新登录");
    try {
      return await api(path, Object.assign({}, o, { token: session.access_token }));
    } catch (e) {
      if (e.status === 401 && session && session.refresh_token) {
        const ok = await refreshSession();
        if (ok && session) {
          return await api(path, Object.assign({}, o, { token: session.access_token }));
        }
      }
      throw e;
    }
  }

  window.ACCOUNT = {
    state,
    onChange: (fn) => { listeners.push(fn); try { fn(state()); } catch (e) {} },
    signIn, signUp, signOut, saveContact, uploadObject, removeObject, imageUrl, mediaUrl,
    api: authed,
    publicApi: (path, o) => api(path, o),
  };

  document.addEventListener("DOMContentLoaded", () => { wire(); render(); });
  boot();
})();

;

;
/* ---- gate.js ---- */
/* 未登录拦截：只能看文章，其他栏目一律跳登录 */
(function () {
  const BLOCKED = ["#archive", "#about", "#qa", "#tools", "#works"];

  const logged = () => {
    const st = window.ACCOUNT && window.ACCOUNT.state ? window.ACCOUNT.state() : null;
    return !!(st && st.loggedIn);
  };

  function goAccount() {
    if (window.SHOW_SECTION) window.SHOW_SECTION("account");
    window.scrollTo({ top: 0 });
    const m = document.querySelector("#loginMsg");
    if (m && !m.textContent) {
      m.textContent = "登录或注册之后才能看这些内容哦";
      m.classList.add("bad");
    }
  }

  function syncTip() {
    const el = document.querySelector("#loginTip");
    if (el) el.hidden = logged();
  }

  document.addEventListener(
    "click",
    (e) => {
      if (logged()) return;
      const a = e.target && e.target.closest ? e.target.closest("a") : null;
      if (!a) return;
      if (!a.closest(".nav")) return;
      const href = a.getAttribute("href") || "";
      if (a.id === "navMusic" || BLOCKED.indexOf(href) >= 0) {
        e.preventDefault();
        e.stopPropagation();
        goAccount();
      }
    },
    true
  );

  document.addEventListener("DOMContentLoaded", () => {
    const go = document.querySelector("#loginTipGo");
    if (go) go.onclick = goAccount;
    if (window.ACCOUNT && window.ACCOUNT.onChange) {
      window.ACCOUNT.onChange((st) => {
        const el = document.querySelector("#loginTip");
        if (el) el.hidden = !!(st && st.loggedIn);
      });
    }
    syncTip();
  });

  window.GATE_SYNC = syncTip;
})();

;

;
/* ---- social.js ---- */
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

  /* ---------- 点赞名单（长按） ---------- */
  async function openLikeList() {
    const st = window.ACCOUNT.state();
    if (!(st.loggedIn && st.profile && st.profile.role === "admin")) return;
    const box = $("#likeModal");
    const body = $("#likeModalBody");
    if (!box || !body) return;
    box.hidden = false;
    body.innerHTML = '<p class="c-empty">加载中…</p>';
    try {
      const rows = await pub("/rest/v1/like_feed?select=*&post_id=eq." + enc(current) + "&order=created_at.desc");
      if (!rows || !rows.length) { body.innerHTML = '<p class="c-empty">这篇还没有人点赞。</p>'; return; }
      body.innerHTML = "";
      rows.forEach((r) => {
        const d = document.createElement("div");
        d.className = "like-row";
        const b1 = document.createElement("b");
        b1.textContent = r.username || "匿名";
        const s1 = document.createElement("span");
        s1.textContent = fmt(r.created_at);
        d.appendChild(b1);
        d.appendChild(s1);
        body.appendChild(d);
      });
    } catch (e) {
      body.innerHTML = '<p class="c-empty">加载失败。</p>';
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
    const likeBtn = $("#likeBtn");
    let pressTimer = null;
    let longFired = false;
    let pressing = false;

    const cancelPress = () => {
      clearTimeout(pressTimer);
      pressTimer = null;
      pressing = false;
      likeBtn.classList.remove("pressing");
    };
    const beginPress = () => {
      if (pressing) return;
      pressing = true;
      longFired = false;
      likeBtn.classList.add("pressing");
      pressTimer = setTimeout(() => {
        pressTimer = null;
        pressing = false;
        longFired = true;
        likeBtn.classList.remove("pressing");
        if (navigator.vibrate) navigator.vibrate(15);
        openLikeList();
      }, 600);
    };

    likeBtn.addEventListener("pointerdown", beginPress);
    likeBtn.addEventListener("pointerup", cancelPress);
    likeBtn.addEventListener("pointercancel", cancelPress);
    likeBtn.addEventListener("contextmenu", (e) => e.preventDefault());
    likeBtn.addEventListener("click", (e) => {
      if (longFired) {
        e.preventDefault();
        e.stopPropagation();
        longFired = false;
        return;
      }
      toggleLike();
    });

    const lc = $("#likeModalClose");
    if (lc) lc.onclick = () => { $("#likeModal").hidden = true; };
    const lm = $("#likeModal");
    if (lm) lm.onclick = (e) => { if (e.target === lm) lm.hidden = true; };
    $("#commentForm").onsubmit = submitComment;
    if (window.ACCOUNT) window.ACCOUNT.onChange(syncWho);
    loadAllLikes();
  });
})();

;

;
/* ---- tools.js ---- */
/* 工具页：番茄钟 + 白噪音（真实录音，无缝循环） */
(function () {
  const $ = (s) => document.querySelector(s);

  /* ================= 番茄钟 ================= */
  let total = 25 * 60;
  let left = total;
  let tick = null;

  const clockEl = () => $("#tmClock");
  const barEl = () => $("#tmBar");
  const startEl = () => $("#tmStart");

  const paint = () => {
    const m = Math.floor(left / 60);
    const s = left % 60;
    const c = clockEl();
    if (c) c.textContent = String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
    const b = barEl();
    if (b) b.style.width = (total ? ((total - left) / total) * 100 : 0) + "%";
    if (tick) document.title = String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0") + " · 瑞卷";
  };

  const stop = () => {
    if (tick) { clearInterval(tick); tick = null; }
    const b = startEl();
    if (b) b.textContent = "继续";
    if (window.__SITE_TITLE) document.title = window.__SITE_TITLE;
  };

  const reset = (mins) => {
    stop();
    total = (mins || Math.round(total / 60)) * 60;
    left = total;
    const b = startEl();
    if (b) b.textContent = "开始";
    paint();
  };

  const go = () => {
    if (tick) return stop();
    if (left <= 0) left = total;
    startEl().textContent = "暂停";
    tick = setInterval(() => {
      left--;
      if (left <= 0) {
        left = 0;
        paint();
        stop();
        beep();
        return;
      }
      paint();
    }, 1000);
  };

  function beep() {
    try {
      const ac = ensureCtx();
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = "sine";
      o.frequency.value = 880;
      g.gain.setValueAtTime(0.001, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.25, ac.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 1.2);
      o.connect(g).connect(ac.destination);
      o.start();
      o.stop(ac.currentTime + 1.3);
      if (navigator.vibrate) navigator.vibrate([120, 80, 120]);
    } catch (e) {}
  }

  /* ================= 白噪音 ================= */
  const TRACKS = { rain: "雨声", fire: "篝火", cafe: "咖啡馆", wave: "海浪" };

  let ctx = null;
  let src = null;
  let gain = null;
  let playing = "";
  const buffers = {};

  function ensureCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    window.__noiseCtx = ctx;
    return ctx;
  }

  const volume = () => {
    const v = $("#noiseVol");
    return v ? Number(v.value) / 100 : 0.6;
  };

  const markOn = (kind) => {
    document.querySelectorAll(".noise-btn").forEach((b) => {
      b.classList.toggle("on", b.dataset.noise === kind);
      b.classList.remove("loading");
    });
  };

  const setHint = (t, bad) => {
    const el = $("#noiseHint");
    if (!el) return;
    el.textContent = t || "";
    el.classList.toggle("bad", !!bad);
  };

  function stopAll() {
    if (src && gain && ctx) {
      try {
        const t = ctx.currentTime;
        gain.gain.cancelScheduledValues(t);
        gain.gain.setValueAtTime(gain.gain.value, t);
        gain.gain.linearRampToValueAtTime(0.0001, t + 0.35);
        const s = src;
        setTimeout(() => { try { s.stop(); s.disconnect(); } catch (e) {} }, 420);
      } catch (e) {}
    }
    src = null;
    gain = null;
    playing = "";
    markOn("");
    setHint("");
  }

  function whiteBuffer(c) {
    const len = Math.floor(c.sampleRate * 3);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * 0.35;
    return buf;
  }

  async function loadBuffer(kind) {
    if (buffers[kind]) return buffers[kind];
    if (kind === "white") {
      buffers.white = whiteBuffer(ensureCtx());
      return buffers.white;
    }
    const url = window.ACCOUNT.mediaUrl("noise/" + kind + ".mp3");
    const res = await fetch(url);
    if (!res.ok) throw new Error("missing");
    const arr = await res.arrayBuffer();
    const buf = await ensureCtx().decodeAudioData(arr);
    buffers[kind] = buf;
    return buf;
  }

  async function play(kind) {
    if (playing === kind) return stopAll();
    stopAll();
    const c = ensureCtx();
    const btn = document.querySelector('.noise-btn[data-noise="' + kind + '"]');
    if (btn) btn.classList.add("loading");
    setHint("加载中…");
    let buf;
    try {
      buf = await loadBuffer(kind);
    } catch (e) {
      if (btn) btn.classList.remove("loading");
      setHint("「" + (TRACKS[kind] || kind) + "」还没上传（后台 → 音效）", true);
      return;
    }
    if (btn) btn.classList.remove("loading");

    gain = c.createGain();
    gain.gain.setValueAtTime(0.0001, c.currentTime);
    src = c.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    src.connect(gain).connect(c.destination);
    src.start();
    gain.gain.linearRampToValueAtTime(volume(), c.currentTime + 0.6);

    playing = kind;
    markOn(kind);
    setHint(kind === "white" ? "白噪" : TRACKS[kind] || "");
  }

  /* ================= 初始化 ================= */
  function wire() {
    const wrap = $("#tools");
    if (!wrap) return;

    reset(25);
    document.querySelectorAll(".tm-modes .tag").forEach((b) => {
      b.onclick = () => {
        document.querySelectorAll(".tm-modes .tag").forEach((x) => x.classList.remove("on"));
        b.classList.add("on");
        reset(+b.dataset.min);
      };
    });
    const s = $("#tmStart");
    const r = $("#tmReset");
    if (s) s.onclick = go;
    if (r) r.onclick = () => {
      const on = document.querySelector(".tm-modes .tag.on");
      reset(on ? +on.dataset.min : 25);
    };

    document.querySelectorAll(".noise-btn").forEach((b) => {
      b.onclick = () => play(b.dataset.noise);
    });
    const ns = $("#noiseStop");
    if (ns) ns.onclick = stopAll;
    const vol = $("#noiseVol");
    if (vol) {
      vol.oninput = () => {
        if (gain && ctx) gain.gain.setTargetAtTime(volume(), ctx.currentTime, 0.05);
      };
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopAll();
    });
  }

  document.addEventListener("DOMContentLoaded", wire);
})();

;

;
/* ---- qa.js ---- */
/* 伪匿名问答（前台） */
(function () {
  const $ = (s) => document.querySelector(s);
  const pub = (p, o) => window.ACCOUNT.publicApi(p, o);
  const auth = (p, o) => window.ACCOUNT.api(p, o);

  const fmt = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d)) return "";
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`;
  };

  const msg = (text, bad) => {
    const el = $("#qaMsg");
    if (!el) return;
    el.textContent = text || "";
    el.classList.toggle("bad", !!bad);
  };

  async function load() {
    const list = $("#qaList");
    if (!list) return;
    list.innerHTML = '<p class="c-empty">加载中…</p>';
    let rows = [];
    try {
      rows = await pub("/rest/v1/qa_public?select=*&order=created_at.desc&limit=100");
    } catch (e) {}
    if (!rows || !rows.length) {
      list.innerHTML = '<p class="c-empty">还没有人提问，来当第一个。</p>';
      return;
    }
    list.innerHTML = "";
    rows.forEach((q) => {
      const d = document.createElement("div");
      d.className = "qa-item";
      d.innerHTML =
        '<div class="qa-q"><span class="qa-mark">?</span><div class="qa-ask"></div></div>' +
        '<div class="qa-a"></div>' +
        '<div class="qa-meta"></div>';
      d.querySelector(".qa-ask").textContent = q.body;
      const a = d.querySelector(".qa-a");
      if (q.answer && q.answer.trim()) {
        a.textContent = q.answer;
      } else {
        a.textContent = "还没有回答。";
        a.classList.add("pending");
      }
      d.querySelector(".qa-meta").textContent =
        "匿名 · " + fmt(q.created_at) + (q.answered_at ? " · 已回答 " + fmt(q.answered_at) : "");
      list.appendChild(d);
    });
  }

  async function ask(e) {
    e.preventDefault();
    const st = window.ACCOUNT.state();
    const ta = $("#qaInput");
    if (!ta) return;
    const body = ta.value.trim();
    if (!st.loggedIn) {
      msg("先登录才能提问", true);
      if (window.SHOW_SECTION) window.SHOW_SECTION("account");
      window.scrollTo({ top: 0 });
      return;
    }
    if (body.length < 2) return msg("多写几个字吧", true);
    const btn = $("#qaForm").querySelector("button[type=submit]");
    btn.disabled = true;
    msg("发送中…");
    try {
      await auth("/rest/v1/questions", { method: "POST", body: { user_id: st.user.id, body } });
      ta.value = "";
      msg("发出去了 ✧");
      await load();
      refreshQuota();
    } catch (err) {
      const t = String(err.message || "");
      msg(/row-level|policy/i.test(t) ? "今天的问题用完了（每天 2 个），明天再来" : "发不出去：" + t, true);
      refreshQuota();
    } finally {
      btn.disabled = false;
    }
  }

  async function refreshQuota() {
    const st = window.ACCOUNT.state();
    const who = $("#qaWho");
    const btn = $("#qaForm") ? $("#qaForm").querySelector("button[type=submit]") : null;
    if (!who) return;
    if (!st.loggedIn) {
      who.textContent = "登录后才能提问";
      if (btn) btn.disabled = false;
      return;
    }
    try {
      const n = await auth("/rest/v1/rpc/my_quota", { method: "POST", body: {} });
      const left = Number(n);
      who.textContent = left > 0 ? "今天还能问 " + left + " 个（每天 2 个）" : "今天的问题用完了，明天再来";
      if (btn) btn.disabled = left <= 0;
    } catch (e) {
      who.textContent = "登录后可以提问";
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const form = $("#qaForm");
    if (form) form.onsubmit = ask;
    if (window.ACCOUNT) window.ACCOUNT.onChange(refreshQuota);
    window.QALOAD = load;
    load();
  });
})();

;

;
/* ---- works.js ---- */
/* 作品集（前台展示 + 大图查看） */
(function () {
  const $ = (s) => document.querySelector(s);
  const pub = (p, o) => window.ACCOUNT.publicApi(p, o);

  let rows = [];

  const imgUrl = (path) => {
    if (!window.ACCOUNT || !window.ACCOUNT.imageUrl) return "";
    return window.ACCOUNT.imageUrl(path);
  };

  async function load() {
    const grid = $("#worksGrid");
    if (!grid) return;
    grid.innerHTML = '<p class="c-empty">加载中…</p>';
    try {
      rows = await pub("/rest/v1/works?select=*&order=created_at.desc&limit=200");
    } catch (e) {
      rows = [];
    }
    if (!rows || !rows.length) {
      grid.innerHTML = '<p class="c-empty">还没有作品。</p>';
      return;
    }
    grid.innerHTML = "";
    rows.forEach((w, i) => {
      const d = document.createElement("figure");
      d.className = "work";
      const im = document.createElement("img");
      im.loading = "lazy";
      im.alt = w.title || "作品";
      im.src = imgUrl(w.path);
      const cap = document.createElement("figcaption");
      cap.textContent = w.title || "";
      if (!w.title) cap.style.display = "none";
      d.appendChild(im);
      d.appendChild(cap);
      d.onclick = () => openBig(i);
      grid.appendChild(d);
    });
  }

  function openBig(i) {
    const w = rows[i];
    if (!w) return;
    const box = $("#imgModal");
    const im = $("#imgBig");
    const cap = $("#imgCap");
    if (!box || !im) return;
    im.src = imgUrl(w.path);
    im.alt = w.title || "作品";
    if (cap) cap.textContent = w.title || "";
    box.hidden = false;
    box.dataset.idx = String(i);
  }

  function step(delta) {
    const box = $("#imgModal");
    if (!box || box.hidden) return;
    const i = (Number(box.dataset.idx) || 0) + delta;
    if (i < 0 || i >= rows.length) return;
    openBig(i);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const box = $("#imgModal");
    const close = $("#imgClose");
    if (close) close.onclick = () => { box.hidden = true; };
    if (box) box.onclick = (e) => { if (e.target === box) box.hidden = true; };
    const prev = $("#imgPrev");
    const next = $("#imgNext");
    if (prev) prev.onclick = (e) => { e.stopPropagation(); step(-1); };
    if (next) next.onclick = (e) => { e.stopPropagation(); step(1); };
    document.addEventListener("keydown", (e) => {
      if (!box || box.hidden) return;
      if (e.key === "Escape") box.hidden = true;
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    });
    window.WORKS_LOAD = load;
    load();
  });
})();

;

;
/* ---- forum.js ---- */
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

;

;
/* ---- notice.js ---- */
/* 通知：横幅 + 面板，点开即已读并删除 */
(function () {
  const $ = (s) => document.querySelector(s);
  const auth = (p, o) => window.ACCOUNT.api(p, o);
  const enc = encodeURIComponent;

  let items = [];

  const fmt = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d)) return "";
    const p = (n) => String(n).padStart(2, "0");
    return `${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
  };

  async function load() {
    const st = window.ACCOUNT.state();
    if (!st.loggedIn) {
      items = [];
      $("#noticeTip").hidden = true;
      return;
    }
    try {
      const data = await auth(
        "/rest/v1/notifications?select=id,kind,title,body,target,created_at&order=created_at.desc&limit=50"
      );
      items = data || [];
      renderBadge();
      if (!$("#noticeModal").hidden) renderList();
    } catch (e) {}
  }

  function renderBadge() {
    const tip = $("#noticeTip");
    if (!tip) return;
    if (!items.length) { tip.hidden = true; return; }
    tip.hidden = false;
    const n = items.length;
    $("#noticeText").textContent = n === 1
      ? items[0].title
      : items[0].title + "（还有 " + (n - 1) + " 条）";
  }

  function renderList() {
    const box = $("#noticeList");
    if (!items.length) {
      box.innerHTML = '<p class="c-empty">没有新通知。</p>';
      return;
    }
    box.innerHTML = "";
    items.forEach((n) => {
      const d = document.createElement("div");
      d.className = "notice-row";
      d.innerHTML =
        '<div class="nr-top"><b class="nr-title"></b><span class="nr-time"></span>' +
        '<button class="nr-go" type="button">打开</button></div>' +
        '<div class="nr-body"></div>';
      d.querySelector(".nr-title").textContent = n.title;
      d.querySelector(".nr-time").textContent = fmt(n.created_at);
      d.querySelector(".nr-body").textContent = n.body || "";
      d.querySelector(".nr-go").onclick = (e) => { e.stopPropagation(); openTarget(n); };
      d.onclick = () => openTarget(n);
      box.appendChild(d);
    });
  }

  async function openTarget(n) {
    try {
      await auth("/rest/v1/notifications?id=eq." + enc(n.id), { method: "DELETE" });
    } catch (e) {}
    items = items.filter((x) => x.id !== n.id);
    renderBadge();
    renderList();

    const parts = String(n.target || "").split(":");
    const kind = parts[0];
    const val = parts.slice(1).join(":");

    if (kind === "post" && val) {
      closeModal();
      if (String(val).startsWith("f_") && window.FORUM_OPEN) window.FORUM_OPEN(val);
      else if (window.OPEN_POST_BY_ID) window.OPEN_POST_BY_ID(val);
    } else if (kind === "forum" && val && window.FORUM_OPEN) {
      closeModal();
      window.FORUM_OPEN(val);
    } else if (kind === "qa") {
      closeModal();
      if (window.SHOW_SECTION) window.SHOW_SECTION("qa");
      window.scrollTo({ top: 0 });
    } else if (kind === "user") {
      closeModal();
      if (window.SHOW_SECTION) window.SHOW_SECTION("admin");
      window.scrollTo({ top: 0 });
    } else {
      closeModal();
    }
  }

  function closeModal() { $("#noticeModal").hidden = true; }

  function wire() {
    $("#noticeGo").onclick = () => {
      $("#noticeModal").hidden = false;
      renderList();
    };
    $("#noticeClose").onclick = closeModal;
    $("#noticeModal").onclick = (e) => { if (e.target.id === "noticeModal") closeModal(); };
    window.ACCOUNT.onChange(() => load());
  }

  document.addEventListener("DOMContentLoaded", () => { wire(); load(); });
  window.NOTICE_LOAD = load;
})();

;

;
/* ---- admin.js ---- */
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
        <button type="button" class="tag${tab === "forum" ? " on" : ""}" data-tab="forum">论坛</button>
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
    else if (tab === "forum") renderForum();
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
  let cmFilter = "all";

  async function renderComments() {
    const pane = $("#adminPane");
    pane.innerHTML =
      '<div class="admin-tabs" id="cmFilter">' +
      '<button type="button" class="tag' + (cmFilter === "all" ? " on" : "") + '" data-f="all">全部</button>' +
      '<button type="button" class="tag' + (cmFilter === "article" ? " on" : "") + '" data-f="article">文章</button>' +
      '<button type="button" class="tag' + (cmFilter === "forum" ? " on" : "") + '" data-f="forum">论坛</button>' +
      '</div><div class="admin-list" id="cmList"><p class="c-empty">加载中…</p></div>';
    pane.querySelectorAll("#cmFilter .tag").forEach((b) => {
      b.onclick = () => { cmFilter = b.dataset.f; renderComments(); };
    });

    let rows = [];
    try {
      rows = await pub("/rest/v1/comment_feed?select=*&order=created_at.desc&limit=200");
    } catch (e) {}

    const isForum = (id) => String(id).startsWith("f_");
    if (cmFilter === "article") rows = (rows || []).filter((c) => !isForum(c.post_id));
    if (cmFilter === "forum") rows = (rows || []).filter((c) => isForum(c.post_id));

    const list = $("#cmList");
    if (!rows || !rows.length) { list.innerHTML = '<p class="c-empty">没有评论。</p>'; return; }

    const titles = {};
    posts.forEach((p) => { titles[p.id] = p.title; });
    try {
      const f = await api("/rest/v1/forum_posts?select=id,title,body");
      (f || []).forEach((x) => { titles[x.id] = x.title || String(x.body || "").slice(0, 18) || "无标题"; });
    } catch (e) {}

    list.innerHTML = "";
    rows.forEach((c) => {
      const d = document.createElement("div");
      d.className = "admin-row";
      const tag = isForum(c.post_id) ? "论坛" : "文章";
      d.innerHTML =
        '<div class="ar-main"><b class="ar-title"></b>' +
        '<span class="ar-sub">' + tag + ' · ' + (c.username || "匿名") + ' · ' + fmt(c.created_at) +
        ' · 《' + (titles[c.post_id] || c.post_id) + '》</span></div>' +
        '<div class="ar-btns"><button type="button" class="tag danger" data-act="del">删除</button></div>';
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

  /* ---------- 论坛审核 ---------- */
  async function renderForum() {
    const pane = $("#adminPane");
    pane.innerHTML = '<div class="admin-list" id="fmList"><p class="c-empty">加载中…</p></div>';
    let rows = [];
    try {
      rows = await api("/rest/v1/forum_posts?select=id,user_id,title,body,status,created_at&order=created_at.desc&limit=200");
    } catch (e) {}
    const list = $("#fmList");
    if (!rows || !rows.length) { list.innerHTML = '<p class="c-empty">还没有帖子。</p>'; return; }

    const users = {};
    try {
      const us = await api("/rest/v1/profiles?select=id,username");
      (us || []).forEach((u) => { users[u.id] = u.username; });
    } catch (e) {}
    const me = window.ACCOUNT.state().user.id;

    list.innerHTML = "";
    rows.forEach((p) => {
      const d = document.createElement("div");
      d.className = "admin-row";
      const label = p.status === "pending" ? "待审核" : p.status === "approved" ? "已通过" : "已拒绝";
      d.innerHTML =
        '<div class="ar-main"><b class="ar-title"></b>' +
        '<span class="ar-sub">' + label + ' · ' + (users[p.user_id] || "匿名") + ' · ' + fmt(p.created_at) + '</span>' +
        '<details class="fm-full"><summary>展开全文</summary><div class="fm-text"></div></details></div>' +
        '<div class="ar-btns">' +
        (p.status === "pending"
          ? '<button type="button" class="tag" data-act="ok">通过</button>' +
            '<button type="button" class="tag danger" data-act="no">拒绝</button>'
          : "") +
        '<button type="button" class="tag danger" data-act="del">删除</button></div>';
      d.querySelector(".ar-title").textContent = p.title || "无标题";
      d.querySelector(".fm-text").textContent = p.body || "";
      const set = async (status) => {
        try {
          await api("/rest/v1/forum_posts?id=eq." + enc(p.id), {
            method: "PATCH",
            body: { status, reviewed_at: new Date().toISOString(), reviewed_by: me },
          });
          renderForum();
        } catch (e) { alert("操作失败：" + e.message); }
      };
      const ok = d.querySelector('[data-act="ok"]');
      const no = d.querySelector('[data-act="no"]');
      if (ok) ok.onclick = () => set("approved");
      if (no) no.onclick = () => set("rejected");
      d.querySelector('[data-act="del"]').onclick = async () => {
        if (!confirm("彻底删除这个帖子？")) return;
        try {
          await api("/rest/v1/forum_posts?id=eq." + enc(p.id), { method: "DELETE" });
          renderForum();
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

;

;
/* ---- app.js ---- */
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

;
