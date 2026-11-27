// Canvas charts for NusaStat: line, bar, horizontal bar and donut.
// No libraries, no network — plain Canvas 2D, drawn from hardcoded data.
// Every chart supports a hover tooltip and redraws crisply on resize.

const INK = '#1c2733';
const MUTED = '#5a6b7a';
const GRID = '#e3e9ec';
const TEAL = '#0e7c6b';
const TEAL_LIGHT = '#2fae97';
const AMBER = '#e8a317';

function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const w = Math.max(50, Math.round(rect.width));
  const h = Math.max(50, Math.round(rect.height));
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h };
}

function niceMax(v) {
  if (v <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
}

function niceMin(v) {
  if (v >= 0) return 0;
  const p = Math.pow(10, Math.floor(Math.log10(-v)));
  const n = -v / p;
  return -(n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
}

function font(size, weight) {
  return (weight ? weight + ' ' : '') + size + 'px system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
}

function drawAxes(ctx, plot, yMin, yMax, ticks) {
  ctx.strokeStyle = GRID;
  ctx.fillStyle = MUTED;
  ctx.font = font(11);
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let i = 0; i <= ticks; i++) {
    const v = yMin + ((yMax - yMin) * i) / ticks;
    const y = plot.y + plot.h - ((v - yMin) / (yMax - yMin)) * plot.h;
    ctx.beginPath();
    ctx.moveTo(plot.x, y);
    ctx.lineTo(plot.x + plot.w, y);
    ctx.stroke();
    ctx.fillText(formatTick(v), plot.x - 8, y);
  }
}

function formatTick(v) {
  if (Math.abs(v) >= 1000) return String(Math.round(v));
  if (Number.isInteger(v)) return String(v);
  return v.toFixed(1);
}

function attachTip(canvas, tip, points) {
  // points: [{x, y, label}] in CSS pixels relative to the canvas.
  canvas.addEventListener('mousemove', (ev) => {
    const rect = canvas.getBoundingClientRect();
    const mx = ev.clientX - rect.left;
    const my = ev.clientY - rect.top;
    let best = null;
    let bestD = 1e9;
    for (const p of points) {
      const d = Math.hypot(p.x - mx, p.y - my);
      if (d < bestD) { bestD = d; best = p; }
    }
    if (best && bestD < 44) {
      tip.style.display = 'block';
      tip.style.left = best.x + 'px';
      tip.style.top = best.y + 'px';
      tip.textContent = best.label;
    } else {
      tip.style.display = 'none';
    }
  });
  canvas.addEventListener('mouseleave', () => { tip.style.display = 'none'; });
}

export function lineChart(canvas, { labels, values, unit, color, zeroLine, yMin: yMinOpt, yMax: yMaxOpt }) {
  const tip = canvas.parentElement.querySelector('.tip');
  const draw = () => {
    const { ctx, w, h } = setupCanvas(canvas);
    const plot = { x: 52, y: 12, w: w - 64, h: h - 42 };
    const yMax = yMaxOpt !== undefined ? yMaxOpt : niceMax(Math.max(...values));
    const yMin = yMinOpt !== undefined ? yMinOpt : niceMin(Math.min(...values));
    drawAxes(ctx, plot, yMin, yMax, 4);
    const px = (i) => plot.x + (plot.w * i) / (labels.length - 1);
    const py = (v) => plot.y + plot.h - ((v - yMin) / (yMax - yMin)) * plot.h;
    if (zeroLine && yMin < 0 && yMax > 0) {
      ctx.strokeStyle = '#b3402e';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(plot.x, py(0));
      ctx.lineTo(plot.x + plot.w, py(0));
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.strokeStyle = color || TEAL;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    values.forEach((v, i) => { i === 0 ? ctx.moveTo(px(i), py(v)) : ctx.lineTo(px(i), py(v)); });
    ctx.stroke();
    const points = [];
    values.forEach((v, i) => {
      ctx.fillStyle = color || TEAL;
      ctx.beginPath();
      ctx.arc(px(i), py(v), 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(px(i), py(v), 1.5, 0, Math.PI * 2);
      ctx.fill();
      points.push({ x: px(i), y: py(v), label: labels[i] + ': ' + v + (unit ? ' ' + unit : '') });
    });
    ctx.fillStyle = MUTED;
    ctx.font = font(11);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    labels.forEach((lab, i) => ctx.fillText(lab, px(i), plot.y + plot.h + 8));
    if (tip) attachTip(canvas, tip, points);
  };
  draw();
  return draw;
}

export function barChart(canvas, { labels, values, unit, color }) {
  const tip = canvas.parentElement.querySelector('.tip');
  const draw = () => {
    const { ctx, w, h } = setupCanvas(canvas);
    const plot = { x: 52, y: 12, w: w - 64, h: h - 42 };
    const yMax = niceMax(Math.max(...values));
    const yMin = niceMin(Math.min(...values));
    drawAxes(ctx, plot, yMin, yMax, 4);
    const slot = plot.w / labels.length;
    const bw = Math.min(46, slot * 0.62);
    const py = (v) => plot.y + plot.h - ((v - yMin) / (yMax - yMin)) * plot.h;
    const points = [];
    values.forEach((v, i) => {
      const x = plot.x + slot * i + (slot - bw) / 2;
      const yTop = py(Math.max(v, 0));
      const yBot = py(Math.min(v, 0));
      ctx.fillStyle = v < 0 ? '#b3402e' : (color || TEAL);
      ctx.fillRect(x, Math.min(yTop, yBot), bw, Math.abs(yBot - yTop) || 1);
      points.push({ x: x + bw / 2, y: yTop, label: labels[i] + ': ' + v + (unit ? ' ' + unit : '') });
    });
    if (yMin < 0 && yMax > 0) {
      ctx.strokeStyle = INK;
      ctx.beginPath();
      ctx.moveTo(plot.x, py(0));
      ctx.lineTo(plot.x + plot.w, py(0));
      ctx.stroke();
    }
    ctx.fillStyle = MUTED;
    ctx.font = font(11);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    labels.forEach((lab, i) => ctx.fillText(lab, plot.x + slot * i + slot / 2, plot.y + plot.h + 8));
    if (tip) attachTip(canvas, tip, points);
  };
  draw();
  return draw;
}

export function hBarChart(canvas, { items, unit, color, max }) {
  const tip = canvas.parentElement.querySelector('.tip');
  const draw = () => {
    const { ctx, w, h } = setupCanvas(canvas);
    const top = 8;
    const rowH = (h - top - 8) / items.length;
    const barH = Math.min(20, rowH * 0.55);
    const labelW = 150;
    const valueW = 52;
    const x0 = labelW;
    const bw = w - labelW - valueW - 8;
    const m = max || Math.max(...items.map((it) => it.value));
    const points = [];
    items.forEach((it, i) => {
      const y = top + rowH * i + (rowH - barH) / 2;
      ctx.fillStyle = INK;
      ctx.font = font(12);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(it.label, labelW - 10, y + barH / 2);
      ctx.fillStyle = it.color || color || TEAL;
      const len = Math.max(2, (it.value / m) * bw);
      ctx.beginPath();
      ctx.roundRect(x0, y, len, barH, 4);
      ctx.fill();
      ctx.fillStyle = MUTED;
      ctx.font = font(12, 600);
      ctx.textAlign = 'left';
      ctx.fillText(String(it.value) + (unit ? ' ' + unit : ''), x0 + len + 8, y + barH / 2);
      points.push({ x: x0 + len / 2, y: y + barH / 2, label: it.label + ': ' + it.value + (unit ? ' ' + unit : '') });
    });
    if (tip) attachTip(canvas, tip, points);
  };
  draw();
  return draw;
}

export function donutChart(canvas, { items, centerLabel }) {
  const tip = canvas.parentElement.querySelector('.tip');
  const draw = () => {
    const { ctx, w, h } = setupCanvas(canvas);
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(w, h) / 2 - 14;
    const inner = r * 0.62;
    const total = items.reduce((s, it) => s + it.value, 0);
    let a0 = -Math.PI / 2;
    const slices = [];
    items.forEach((it) => {
      const a1 = a0 + (it.value / total) * Math.PI * 2;
      ctx.fillStyle = it.color || TEAL;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, a0, a1);
      ctx.closePath();
      ctx.fill();
      const mid = (a0 + a1) / 2;
      slices.push({ x: cx + Math.cos(mid) * ((r + inner) / 2), y: cy + Math.sin(mid) * ((r + inner) / 2), label: it.label + ': ' + it.value + '%' });
      a0 = a1;
    });
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(cx, cy, inner, 0, Math.PI * 2);
    ctx.fill();
    if (centerLabel) {
      ctx.fillStyle = INK;
      ctx.font = font(15, 700);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const words = centerLabel.split('\n');
      words.forEach((wd, i) => ctx.fillText(wd, cx, cy + (i - (words.length - 1) / 2) * 19));
    }
    if (tip) attachTip(canvas, tip, slices);
  };
  draw();
  return draw;
}

export function redrawAll(redrawers) {
  redrawers.forEach((fn) => { try { fn(); } catch (e) { /* keep the rest drawing */ } });
}
