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
        '<div class="nr-top"><b class="nr-title"></b><span class="nr-time"></span></div>' +
        '<div class="nr-body"></div>';
      d.querySelector(".nr-title").textContent = n.title;
      d.querySelector(".nr-time").textContent = fmt(n.created_at);
      d.querySelector(".nr-body").textContent = n.body || "";
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
