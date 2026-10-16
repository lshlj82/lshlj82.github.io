/* The lab logo assembles itself, stub by stub, like the configuration model.
   The 10 nodes appear scattered at random, each grows one stub per future link (pointing at its
   partner), and the 7 pairs of stubs join one at a time, in random order. Meanwhile every node
   drifts toward its place in the logo, arriving just after its last link forms, so the network
   pulls itself into the logo's shape. Then the lab name fades in. Plays once on load (about 6.5 s);
   clicking the logo plays it again (with a new scattering). Without JavaScript, or with
   "reduce motion" on, the finished logo is shown. */
(function () {
  const box = document.querySelector(".logo-anim");
  if (!box || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const svg = box.querySelector("svg"), text = box.querySelector(".logo-text");
  const NS = "http://www.w3.org/2000/svg";
  const dots = [...svg.querySelectorAll(".dots circle")];
  const links = [...svg.querySelectorAll(".links line")];
  const R = +dots[0].getAttribute("r");

  // timeline (ms)
  const DOT_GAP = 80, DOT_DUR = 380;                    // nodes pop in one after another
  const STUB_START = 950, STUB_DUR = 600, STUB = 0.42;  // stubs grow to 42% of the way to the link's middle
  const JOIN_START = 1750, JOIN_GAP = 560, JOIN_DUR = 460, GLOW = 450;
  const MOVE_START = 700, SETTLE = 500;                 // a node arrives SETTLE ms after its last link joins
  const TEXT_DUR = 600;

  // final geometry, read from the finished logo in the page
  const FX = dots.map(c => +c.getAttribute("cx")), FY = dots.map(c => +c.getAttribute("cy"));
  const near = (x, y) => dots.reduce((best, _, k) => {
    const d = Math.hypot(x - FX[k], y - FY[k]); return d < best[1] ? [k, d] : best; }, [-1, Infinity])[0];
  const L = links.map(l => {
    const x1 = +l.getAttribute("x1"), y1 = +l.getAttribute("y1"), x2 = +l.getAttribute("x2"), y2 = +l.getAttribute("y2");
    const a = near(x1, y1), b = near(x2, y2);
    // where each end meets its node, relative to the node's center (on the rim, sometimes off-center)
    return { el: l, a, b, oa: [x1 - FX[a], y1 - FY[a]], ob: [x2 - FX[b], y2 - FY[b]] };
  });

  // two stubs per link, drawn under the nodes
  const stubLayer = document.createElementNS(NS, "g"); stubLayer.setAttribute("class", "stubs");
  svg.insertBefore(stubLayer, svg.querySelector(".dots"));
  L.forEach(l => {
    l.stubs = [0, 1].map(() => {
      const line = document.createElementNS(NS, "line"), tip = document.createElementNS(NS, "circle");
      tip.setAttribute("r", 3.2); stubLayer.append(line, tip); return { line, tip };
    });
  });

  const ease = t => 1 - Math.pow(1 - t, 3);
  const smooth = t => t * t * (3 - 2 * t);
  const backOut = t => { const s = 1.6; t -= 1; return t * t * ((s + 1) * t + s) + 1; };
  const clamp = t => Math.max(0, Math.min(1, t));
  const set = (el, attrs) => { for (const k in attrs) el.setAttribute(k, attrs[k]); };

  let order, SX, SY, arrive, start = null, raf = null;

  // scatter the nodes at random over the logo's area, keeping them apart
  function scatter() {
    SX = []; SY = [];
    for (let k = 0; k < dots.length; k++) {
      let x, y, tries = 0;
      do { x = 40 + Math.random() * 432; y = 35 + Math.random() * 316; tries++; }
      while (tries < 200 && SX.some((px, i) => Math.hypot(px - x, SY[i] - y) < 70));
      SX.push(x); SY.push(y);
    }
  }

  function frame(now) {
    if (start === null) start = now;
    box.classList.add("playing");   // reveal (the page hides the finished logo until the animation starts)
    const t = now - start;
    // node positions: drift from the scattered start to the logo, arriving after the node's last link joins
    const m = dots.map((_, k) => smooth(clamp((t - MOVE_START) / (arrive[k] - MOVE_START))));
    const X = dots.map((_, k) => SX[k] + (FX[k] - SX[k]) * m[k]);
    const Y = dots.map((_, k) => SY[k] + (FY[k] - SY[k]) * m[k]);
    dots.forEach((c, k) => {
      const p = clamp((t - k * DOT_GAP) / DOT_DUR), s = p === 0 ? 0 : backOut(p);
      set(c, { cx: X[k], cy: Y[k], transform: `translate(${X[k]} ${Y[k]}) scale(${s}) translate(${-X[k]} ${-Y[k]})` });
    });

    // a link end sits on its node's rim: facing the partner while moving, its exact logo spot once settled
    function end(k, other, off, w) {
      const dx = X[other] - X[k], dy = Y[other] - Y[k], d = Math.hypot(dx, dy) || 1;
      return [X[k] + (R * dx / d) * (1 - w) + off[0] * w, Y[k] + (R * dy / d) * (1 - w) + off[1] * w];
    }
    const grow = ease(clamp((t - STUB_START) / STUB_DUR));
    let done = true;
    L.forEach((l, e) => {
      const w = Math.min(m[l.a], m[l.b]);
      const A = end(l.a, l.b, l.oa, w), B = end(l.b, l.a, l.ob, w);
      const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2;
      const j0 = JOIN_START + order.indexOf(e) * JOIN_GAP, pj = clamp((t - j0) / JOIN_DUR), joined = t >= j0 + JOIN_DUR;
      const frac = joined ? 1 : STUB * grow + (1 - STUB) * ease(pj);
      [A, B].forEach((P, i) => {
        const s = l.stubs[i], ex = P[0] + (mx - P[0]) * frac, ey = P[1] + (my - P[1]) * frac;
        set(s.line, { x1: P[0], y1: P[1], x2: ex, y2: ey }); set(s.tip, { cx: ex, cy: ey });
        const visible = grow > 0 && !joined;
        s.line.style.opacity = visible ? 1 : 0; s.tip.style.opacity = visible && pj === 0 ? 1 : 0;
        s.line.classList.toggle("joining", pj > 0 && !joined);
      });
      set(l.el, { x1: A[0], y1: A[1], x2: B[0], y2: B[1] });
      l.el.style.opacity = joined ? 1 : 0;
      l.el.classList.toggle("joining", joined && t < j0 + JOIN_DUR + GLOW);   // brief gold glow, then black
      if (t < j0 + JOIN_DUR + GLOW || w < 1) done = false;
    });

    const textStart = JOIN_START + L.length * JOIN_GAP;
    if (text) text.style.opacity = clamp((t - textStart) / TEXT_DUR);
    if (done && dots.every((_, k) => m[k] === 1) && t > textStart + TEXT_DUR) { finish(); raf = null; return; }
    raf = requestAnimationFrame(frame);
  }

  // leave the page exactly as the finished logo
  function finish() {
    dots.forEach((c, k) => { set(c, { cx: FX[k], cy: FY[k] }); c.removeAttribute("transform"); });
    L.forEach(l => set(l.el, { x1: FX[l.a] + l.oa[0], y1: FY[l.a] + l.oa[1], x2: FX[l.b] + l.ob[0], y2: FY[l.b] + l.ob[1] }));
  }

  function play() {
    order = L.map((_, i) => i).sort(() => Math.random() - 0.5);   // links join in random order
    // each node arrives SETTLE ms after the last of its links has joined
    arrive = dots.map((_, k) => {
      let last = MOVE_START + 400;
      L.forEach((l, e) => { if (l.a === k || l.b === k) last = Math.max(last, JOIN_START + order.indexOf(e) * JOIN_GAP + JOIN_DUR); });
      return last + SETTLE;
    });
    scatter();
    if (raf) cancelAnimationFrame(raf);
    start = null; raf = requestAnimationFrame(frame);
  }
  box.addEventListener("click", play);
  box.style.cursor = "pointer"; box.title = "Click to assemble the network again";
  play();
})();
