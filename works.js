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
