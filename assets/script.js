/* Nawar Academy — Physics Chapter 1 — shared helpers + simulators */
"use strict";

/* ---------- Current-flow animation ----------
   Animates small dots along an SVG path to visualise current.
   Usage: animateCurrent(svgId, pathId, dotsGroup, speed, on) */
const animRegistry = [];

function animateCurrent(pathId, dotsGroup, opts) {
  const path = document.getElementById(pathId);
  const group = document.getElementById(dotsGroup);
  if (!path || !group) return;
  const state = { path, group, on: opts.on !== false, speed: opts.speed || 60, dots: [], raf: null, offset: 0 };
  const N = opts.count || 8;
  for (let i = 0; i < N; i++) {
    const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c.setAttribute("r", opts.radius || 4);
    c.setAttribute("fill", opts.color || "#ffd54f");
    group.appendChild(c);
    state.dots.push(c);
  }
  let last = performance.now();
  function step(now) {
    const dt = (now - last) / 1000;
    last = now;
    if (state.on && state.speed > 0) {
      state.offset = (state.offset + state.speed * dt) % 100;
      const len = path.getTotalLength();
      state.dots.forEach((d, i) => {
        const frac = ((state.offset + (100 / state.dots.length) * i) % 100) / 100;
        const p = path.getPointAtLength(frac * len);
        d.setAttribute("cx", p.x);
        d.setAttribute("cy", p.y);
        d.setAttribute("opacity", "1");
      });
    } else {
      state.dots.forEach(d => d.setAttribute("opacity", "0"));
    }
    state.raf = requestAnimationFrame(step);
  }
  state.raf = requestAnimationFrame(step);
  animRegistry.push(state);
  return state;
}

function setAnimSpeed(state, speed) {
  if (state) state.speed = speed;
}
function setAnimOn(state, on) {
  if (state) state.on = on;
}

/* ---------- Nav active state ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  document.querySelectorAll(".nav-links a").forEach(a => {
    if (a.dataset.nav === page) a.classList.add("active");
  });
});
