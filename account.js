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
  let profile = null; // { id, username, phone, role }
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
        "/rest/v1/profiles?select=id,username,phone,role,status&id=eq." + encodeURIComponent(session.user.id),
        { token: session.access_token }
      );
      profile = (rows && rows[0]) || null;
    } catch (e) {
      profile = null;
    }
    if (!profile) {
      const meta = session.user.user_metadata || {};
      profile = { id: session.user.id, username: meta.username || "我", phone: meta.phone || "", role: "user" };
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

  async function signUp(username, password, phone) {
    const email = await emailFor(username);
    const data = await api("/auth/v1/signup", {
      method: "POST",
      body: { email, password, data: { username: norm(username), phone: phone.trim() } },
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

  async function savePhone(phone) {
    if (!session) throw new Error("还没登录");
    await api("/rest/v1/profiles?id=eq." + encodeURIComponent(session.user.id), {
      method: "PATCH",
      token: session.access_token,
      body: { phone: phone.trim() },
    });
    await loadProfile();
    emit();
  }

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
      $("#mePhone").textContent = profile.phone ? "电话 " + profile.phone : "电话 未填写";
      $("#meRole").textContent = profile.role === "admin" ? "管理员" : "普通成员";
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
        const tel = $("#suPhone").value.trim();
        if (u.length < 2 || u.length > 20) return msg($("#signupMsg"), "用户名要 2~20 个字", true);
        if (p.length < 6) return msg($("#signupMsg"), "密码至少 6 位", true);
        if (p !== p2) return msg($("#signupMsg"), "两次密码不一样", true);
        if (!/^\d{6,20}$/.test(tel)) return msg($("#signupMsg"), "电话填数字就行（6~20 位）", true);
        const btn = sf.querySelector("button[type=submit]");
        btn.disabled = true;
        msg($("#signupMsg"), "注册中…");
        try {
          await signUp(u, p, tel);
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

    const pf = $("#phoneForm");
    if (pf) {
      pf.onsubmit = async (e) => {
        e.preventDefault();
        const tel = $("#mePhoneInput").value.trim();
        if (!/^\d{6,20}$/.test(tel)) return msg($("#phoneMsg"), "电话填数字就行（6~20 位）", true);
        try {
          await savePhone(tel);
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

  window.ACCOUNT = {
    state,
    onChange: (fn) => { listeners.push(fn); try { fn(state()); } catch (e) {} },
    signIn, signUp, signOut, savePhone,
    api: (path, o) => api(path, Object.assign({}, o, { token: session ? session.access_token : undefined })),
    publicApi: (path, o) => api(path, o),
  };

  document.addEventListener("DOMContentLoaded", () => { wire(); render(); });
  boot();
})();
