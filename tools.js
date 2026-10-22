/* 工具页：番茄钟 + 白噪音 */
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
    document.title = tick ? (String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0") + " · 瑞卷") : null;
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
  let ac = null;
  let nodes = [];
  let playing = "";

  const ensureAC = () => {
    if (!ac) {
      ac = new (window.AudioContext || window.webkitAudioContext)();
      window.__noiseCtx = ac;
    }
    if (ac.state === "suspended") ac.resume();
    return ac;
  };

  function noiseBuffer(ctx, kind, seconds) {
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      if (kind === "white") {
        d[i] = white * 0.5;
      } else {
        last = (last + 0.018 * white) / 1.018;
        d[i] = last * 4;
      }
    }
    return buf;
  }

  function stopAll() {
    nodes.forEach((n) => { try { n.stop && n.stop(); n.disconnect && n.disconnect(); } catch (e) {} });
    nodes = [];
    playing = "";
    document.querySelectorAll(".noise-btn").forEach((b) => b.classList.remove("on"));
  }

  function play(kind) {
    if (playing === kind) { stopAll(); return; }
    stopAll();
    const ctx = ensureAC();
    playing = kind;

    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(ctx, kind === "white" ? "white" : "brown", 5);
    src.loop = true;

    let node = src;
    const chain = [src];

    const add = (n) => { chain.push(n); node.connect(n); node = n; return n; };

    if (kind === "rain") {
      const hp = add(ctx.createBiquadFilter());
      hp.type = "highpass"; hp.frequency.value = 700;
      const lp = add(ctx.createBiquadFilter());
      lp.type = "lowpass"; lp.frequency.value = 7000;
      const g = add(ctx.createGain());
      g.gain.value = 0.5;
      add(ctx.destination);
    } else if (kind === "fire") {
      const lp = add(ctx.createBiquadFilter());
      lp.type = "lowpass"; lp.frequency.value = 900;
      const g = add(ctx.createGain());
      g.gain.value = 0.55;
      add(ctx.destination);
      // 噼啪声
      const crackle = setInterval(() => {
        if (playing !== "fire") return clearInterval(crackle);
        try {
          const o = ctx.createOscillator();
          const cg = ctx.createGain();
          o.type = "square";
          o.frequency.value = 180 + Math.random() * 900;
          cg.gain.setValueAtTime(0.0001, ctx.currentTime);
          cg.gain.exponentialRampToValueAtTime(0.05 + Math.random() * 0.06, ctx.currentTime + 0.005);
          cg.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);
          o.connect(cg).connect(ctx.destination);
          o.start(); o.stop(ctx.currentTime + 0.07);
        } catch (e) {}
      }, 260);
      chain.push({ stop: () => clearInterval(crackle) });
    } else if (kind === "cafe") {
      const bp = add(ctx.createBiquadFilter());
      bp.type = "bandpass"; bp.frequency.value = 900; bp.Q.value = 0.7;
      const g = add(ctx.createGain());
      g.gain.value = 0.9;
      add(ctx.destination);
    } else if (kind === "wave") {
      const lp = add(ctx.createBiquadFilter());
      lp.type = "lowpass"; lp.frequency.value = 1200;
      const g = add(ctx.createGain());
      g.gain.value = 0.35;
      add(ctx.destination);
      // 潮汐起伏
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.09;
      lfoGain.gain.value = 0.32;
      lfo.connect(lfoGain).connect(g.gain);
      lfo.start();
      chain.push(lfo);
    } else {
      const g = add(ctx.createGain());
      g.gain.value = 0.28;
      add(ctx.destination);
    }

    src.start();
    nodes = chain;
    const btn = document.querySelector('.noise-btn[data-noise="' + kind + '"]');
    if (btn) btn.classList.add("on");
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
    const s = $("#tmStart"), r = $("#tmReset");
    if (s) s.onclick = go;
    if (r) r.onclick = () => {
      reset(+((document.querySelector(".tm-modes .tag.on") || {}).dataset || {}).min || 25);
    };

    document.querySelectorAll(".noise-btn").forEach((b) => {
      b.onclick = () => play(b.dataset.noise);
    });
    const ns = $("#noiseStop");
    if (ns) ns.onclick = stopAll;

    // 离开工具页就停掉声音
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopAll();
    });
  }

  document.addEventListener("DOMContentLoaded", wire);
})();
