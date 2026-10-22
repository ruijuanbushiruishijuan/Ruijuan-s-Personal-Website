/* 工具页：番茄钟 + 白噪音（真实录音） */
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
      const ac = window.__noiseCtx || new (window.AudioContext || window.webkitAudioContext)();
      window.__noiseCtx = ac;
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
  let audio = null;
  let playing = "";
  let whiteCtx = null;
  let whiteSrc = null;

  const volume = () => {
    const v = $("#noiseVol");
    return v ? Number(v.value) / 100 : 0.6;
  };

  const markOn = (kind) => {
    document.querySelectorAll(".noise-btn").forEach((b) => {
      b.classList.toggle("on", b.dataset.noise === kind);
    });
  };

  const setHint = (t, bad) => {
    const el = $("#noiseHint");
    if (!el) return;
    el.textContent = t || "";
    el.classList.toggle("bad", !!bad);
  };

  const stopWhite = () => {
    if (whiteSrc) { try { whiteSrc.stop(); } catch (e) {} whiteSrc = null; }
  };

  const stopAll = () => {
    if (audio) {
      try { audio.pause(); audio.removeAttribute("src"); audio.load(); } catch (e) {}
    }
    stopWhite();
    playing = "";
    markOn("");
    setHint("");
  };

  function playWhite() {
    if (playing === "white") return stopAll();
    stopAll();
    try {
      if (!whiteCtx) whiteCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (whiteCtx.state === "suspended") whiteCtx.resume();
      const len = Math.floor(whiteCtx.sampleRate * 3);
      const buf = whiteCtx.createBuffer(1, len, whiteCtx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * 0.35;
      const src = whiteCtx.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      const g = whiteCtx.createGain();
      g.gain.value = volume();
      src.connect(g).connect(whiteCtx.destination);
      src.start();
      whiteSrc = src;
      playing = "white";
      markOn("white");
      setHint("");
    } catch (e) {
      setHint("播放失败", true);
    }
  }

  function play(kind) {
    if (kind === "white") return playWhite();
    if (playing === kind) return stopAll();
    stopAll();
    if (!audio) audio = new Audio();
    const url = window.ACCOUNT && window.ACCOUNT.mediaUrl
      ? window.ACCOUNT.mediaUrl("noise/" + kind + ".mp3")
      : "";
    audio.loop = true;
    audio.volume = volume();
    audio.src = url;
    audio.onerror = () => {
      playing = "";
      markOn("");
      setHint("「" + (TRACKS[kind] || kind) + "」还没上传（后台 → 音效）", true);
    };
    setHint("加载中…");
    const p = audio.play();
    if (p && p.then) {
      p.then(() => {
        playing = kind;
        markOn(kind);
        setHint(TRACKS[kind] || "");
      }).catch(() => {
        playing = "";
        markOn("");
        setHint("「" + (TRACKS[kind] || kind) + "」还没上传（后台 → 音效）", true);
      });
    }
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
        if (audio) audio.volume = volume();
      };
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopAll();
    });
  }

  document.addEventListener("DOMContentLoaded", wire);
})();
