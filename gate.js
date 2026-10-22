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
