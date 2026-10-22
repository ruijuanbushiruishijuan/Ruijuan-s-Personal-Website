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
      msg("发出去了，只有站长知道是你问的 ✧");
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
      who.textContent = "以「" + (st.profile ? st.profile.username : "我") + "」的身份提问（页面上显示匿名）";
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
