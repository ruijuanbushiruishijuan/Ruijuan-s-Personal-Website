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
