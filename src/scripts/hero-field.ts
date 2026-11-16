/**
 * Hero background: a simulated forward pass drawn live on a canvas.
 * Seven layers of nodes sit in 3D space; tokens enter on the left, hop along edges layer by
 * layer, and light up the nodes they pass through. A sweep plane scans across the layers, the
 * camera drifts and follows the pointer, and colors are read from the site's CSS tokens so the
 * field matches both themes without introducing new colors.
 */

type Node3 = { x: number; y: number; z: number; layer: number; out: number[]; glow: number };
type Token = { from: number; to: number; t: number; speed: number; trail: [number, number][] };

const LAYERS = 7;
const PER_LAYER = 26;
const MAX_TOKENS = 46;

function rng(seed: number) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function parseColor(value: string): [number, number, number] {
  const v = value.trim();
  if (v.startsWith('#')) {
    const hex = v.length === 4 ? [...v.slice(1)].map((c) => c + c).join('') : v.slice(1, 7);
    return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [number, number, number];
  }
  const m = v.match(/\d+(\.\d+)?/g);
  return m ? [Number(m[0]), Number(m[1]), Number(m[2])] : [255, 225, 0];
}

export function initHeroField() {
  const canvas = document.querySelector<HTMLCanvasElement>('#hero-field');
  if (!canvas) return;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D | null;
  if (!ctx) return;
  const g: CanvasRenderingContext2D = ctx;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const hudStep = document.querySelector('#hud-step');
  const hudTokens = document.querySelector('#hud-tokens');

  /* ---------- colors from the theme ---------- */
  let accent: [number, number, number] = [255, 225, 0];
  let muted: [number, number, number] = [193, 185, 169];
  let line: [number, number, number] = [61, 65, 64];
  const readColors = () => {
    const cs = getComputedStyle(document.documentElement);
    accent = parseColor(cs.getPropertyValue('--accent'));
    muted = parseColor(cs.getPropertyValue('--dim'));
    line = parseColor(cs.getPropertyValue('--line'));
  };
  readColors();
  new MutationObserver(() => {
    readColors();
    if (reduced) render(performance.now());
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  const rgba = (c: [number, number, number], a: number) =>
    `rgba(${c[0]},${c[1]},${c[2]},${Math.max(0, Math.min(1, a)).toFixed(3)})`;

  /* ---------- sizing ---------- */
  let W = 0;
  let H = 0;
  const size = () => {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  size();
  new ResizeObserver(() => {
    size();
    if (reduced) render(performance.now());
  }).observe(canvas);

  /* ---------- build the network ---------- */
  const R = rng(11);
  const nodes: Node3[] = [];
  const spanX = 13;
  for (let l = 0; l < LAYERS; l++) {
    const x = -spanX / 2 + (l / (LAYERS - 1)) * spanX;
    // middle layers are wider, like a model's hidden dimension
    const radius = 2.2 + Math.sin((l / (LAYERS - 1)) * Math.PI) * 1.6;
    for (let i = 0; i < PER_LAYER; i++) {
      const a = (i / PER_LAYER) * Math.PI * 2 + R() * 0.4;
      const r = radius * (0.35 + R() * 0.65);
      nodes.push({
        x: x + (R() - 0.5) * 0.5,
        y: Math.sin(a) * r,
        z: Math.cos(a) * r,
        layer: l,
        out: [],
        glow: 0,
      });
    }
  }
  for (const n of nodes) {
    if (n.layer === LAYERS - 1) continue;
    const next = nodes
      .map((m, idx) => ({ idx, m }))
      .filter(({ m }) => m.layer === n.layer + 1)
      .sort(
        (a, b) =>
          (a.m.y - n.y) ** 2 + (a.m.z - n.z) ** 2 - ((b.m.y - n.y) ** 2 + (b.m.z - n.z) ** 2),
      );
    const picks = new Set<number>([next[0].idx, next[1 + Math.floor(R() * 3)].idx]);
    if (R() < 0.45) picks.add(next[Math.floor(R() * next.length)].idx);
    n.out = [...picks];
  }

  // ambient dust
  const dust = Array.from({ length: 140 }, () => ({
    x: (R() - 0.5) * 16,
    y: (R() - 0.5) * 12,
    z: (R() - 0.5) * 8,
    v: 0.15 + R() * 0.35,
  }));

  /* ---------- tokens ---------- */
  const tokens: Token[] = [];
  const firstLayer = nodes.map((n, i) => (n.layer === 0 ? i : -1)).filter((i) => i >= 0);
  let routed = 0;
  const spawn = () => {
    const from = firstLayer[Math.floor(Math.random() * firstLayer.length)];
    const outs = nodes[from].out;
    tokens.push({
      from,
      to: outs[Math.floor(Math.random() * outs.length)],
      t: 0,
      speed: 0.9 + Math.random() * 0.8,
      trail: [],
    });
    nodes[from].glow = 1;
  };

  /* ---------- camera ---------- */
  let mx = 0;
  let my = 0;
  let tx = 0;
  let ty = 0;
  addEventListener(
    'pointermove',
    (e) => {
      tx = e.clientX / innerWidth - 0.5;
      ty = e.clientY / innerHeight - 0.5;
    },
    { passive: true },
  );

  let yaw = 0;
  let pitch = 0;
  let cx = 0;
  let cy = 0;
  let focal = 0;
  let squash = 1;
  const project = (x: number, y: number, z: number): [number, number, number] | null => {
    const cyw = Math.cos(yaw);
    const syw = Math.sin(yaw);
    const x1 = x * cyw - z * syw;
    const z1 = x * syw + z * cyw;
    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);
    const y1 = y * cp - z1 * sp;
    const z2 = y * sp + z1 * cp + 17;
    if (z2 < 1) return null;
    return [cx + (x1 / z2) * focal, cy + (y1 / z2) * focal * squash, z2];
  };

  /* ---------- render ---------- */
  let last = performance.now();
  let frame = 0;
  let spawnClock = 0;

  function render(time: number) {
    const dt = Math.min(0.05, (time - last) / 1000);
    last = time;
    const t = time / 1000;
    mx += (tx - mx) * 0.05;
    my += (ty - my) * 0.05;

    // Layers run left to right so they line up with the INPUT → OUTPUT labels below the panel.
    cx = W * 0.5 + mx * 10;
    cy = H * 0.5 + my * 6;
    focal = (W * 0.92 * 17) / spanX;
    squash = Math.min(1, (H * 0.44) / ((4 / 17) * focal));
    yaw = (reduced ? 0.06 : Math.sin(t * 0.15) * 0.1) + mx * 0.14;
    pitch = (reduced ? 0.35 : 0.35 + Math.sin(t * 0.11) * 0.08) + my * 0.12;

    g.clearRect(0, 0, W, H);

    // dust
    for (const d of dust) {
      if (!reduced) {
        d.x += d.v * dt;
        if (d.x > 8) d.x -= 16;
      }
      const p = project(d.x, d.y, d.z);
      if (!p) continue;
      g.fillStyle = rgba(muted, 0.35 * (1 - p[2] / 40));
      g.fillRect(p[0], p[1], 1.4, 1.4);
    }

    // sweep plane across layers
    const sweepX = -spanX / 2 - 1 + ((t * 0.22) % 1) * (spanX + 2);

    // edges
    const P = nodes.map((n) => project(n.x, n.y, n.z));
    g.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      const a = P[i];
      if (!a) continue;
      for (const j of nodes[i].out) {
        const b = P[j];
        if (!b) continue;
        const heat = Math.max(nodes[i].glow, nodes[j].glow);
        g.strokeStyle = heat > 0.05 ? rgba(accent, 0.12 + heat * 0.35) : rgba(line, 0.55);
        g.beginPath();
        g.moveTo(a[0], a[1]);
        g.lineTo(b[0], b[1]);
        g.stroke();
      }
    }

    // nodes
    for (let i = 0; i < nodes.length; i++) {
      const p = P[i];
      if (!p) continue;
      const n = nodes[i];
      const scan = Math.max(0, 1 - Math.abs(n.x - sweepX) / 0.9);
      const s = Math.max(1.6, 4.2 - p[2] / 9);
      const lit = Math.max(n.glow, scan * 0.6);
      g.fillStyle = lit > 0.05 ? rgba(accent, 0.35 + lit * 0.65) : rgba(muted, 0.55 - p[2] / 70);
      g.beginPath();
      g.arc(p[0], p[1], s * (1 + n.glow * 0.6), 0, Math.PI * 2);
      g.fill();
      if (n.glow > 0.4) {
        g.strokeStyle = rgba(accent, (n.glow - 0.4) * 0.8);
        g.beginPath();
        g.arc(p[0], p[1], s * 2.6 * (1.4 - n.glow), 0, Math.PI * 2);
        g.stroke();
      }
      if (!reduced) n.glow = Math.max(0, n.glow - dt * 1.4);
    }

    // tokens
    if (!reduced) {
      spawnClock += dt;
      while (spawnClock > 0.16) {
        spawnClock -= 0.16;
        if (tokens.length < MAX_TOKENS) spawn();
      }
    }
    for (let k = tokens.length - 1; k >= 0; k--) {
      const tk = tokens[k];
      if (!reduced) tk.t += dt * tk.speed * 1.6;
      if (tk.t >= 1) {
        nodes[tk.to].glow = 1;
        routed++;
        const outs = nodes[tk.to].out;
        if (!outs.length) {
          tokens.splice(k, 1);
          continue;
        }
        tk.from = tk.to;
        tk.to = outs[Math.floor(Math.random() * outs.length)];
        tk.t = 0;
      }
      const a = nodes[tk.from];
      const b = nodes[tk.to];
      const e = tk.t * tk.t * (3 - 2 * tk.t);
      const p = project(a.x + (b.x - a.x) * e, a.y + (b.y - a.y) * e, a.z + (b.z - a.z) * e);
      if (!p) continue;
      tk.trail.push([p[0], p[1]]);
      if (tk.trail.length > 9) tk.trail.shift();
      for (let q = 1; q < tk.trail.length; q++) {
        g.strokeStyle = rgba(accent, (q / tk.trail.length) * 0.6);
        g.lineWidth = 2;
        g.beginPath();
        g.moveTo(tk.trail[q - 1][0], tk.trail[q - 1][1]);
        g.lineTo(tk.trail[q][0], tk.trail[q][1]);
        g.stroke();
      }
      g.fillStyle = rgba(accent, 1);
      g.beginPath();
      g.arc(p[0], p[1], Math.max(2, 3.6 - p[2] / 14), 0, Math.PI * 2);
      g.fill();
    }

    frame++;
    if (frame % 6 === 0 || reduced) {
      if (hudStep) hudStep.textContent = String(frame).padStart(6, '0');
      if (hudTokens) hudTokens.textContent = routed.toLocaleString('en-US');
    }
  }

  if (reduced) {
    // seed a still frame with a few lit paths so the visual still reads
    for (let i = 0; i < 18; i++) spawn();
    tokens.forEach((tk) => (tk.t = Math.random()));
    render(performance.now());
    return;
  }

  let visible = true;
  new IntersectionObserver((entries) => (visible = entries[0].isIntersecting)).observe(canvas);
  const loop = (time: number) => {
    if (visible && !document.hidden) render(time);
    else last = time;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
