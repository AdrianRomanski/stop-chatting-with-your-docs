<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId } from 'vue'
import { onSlideEnter, onSlideLeave } from '@slidev/client'

/**
 * Cover background, variant D: "inside the brain" (B) with the constellation morph (C).
 * One large brain on the right is the stage. Act 1, left hemisphere: notes come out of a book and a
 * pen links them. Act 2: each note breaks into four dots that pour into the vault at the brain's
 * base. Act 3: the same twenty dots burst out of the vault and become the brain's neurons, across
 * both hemispheres; new links flash hot, then settle, and the brain glows. The reset sends the dots
 * back into the book, where the next notes come from, so the loop never jumps. 13.6 s per cycle.
 * Reduced motion: the connected brain, static. Brand roles only, no props.
 */
const uid = useId()
const CYCLE = 13.6
const END = 11.7

// ---- the clock: loops while the slide is shown
const t = ref(END)
let raf = 0
let t0 = 0
const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
function tick(now: number) {
  t.value = ((now - t0) / 1000) % CYCLE
  raf = requestAnimationFrame(tick)
}
function start() {
  cancelAnimationFrame(raf)
  if (reduced) { t.value = END; return }
  t0 = performance.now()
  raf = requestAnimationFrame(tick)
}
function stop() { cancelAnimationFrame(raf) }
onMounted(() => { measure(); start() })
onSlideEnter(start)
onSlideLeave(stop)
onBeforeUnmount(stop)

const clamp = (v: number) => Math.max(0, Math.min(1, v))
const ease = (v: number) => v * v * (3 - 2 * v)
const p = (s: number, d: number) => ease(clamp((t.value - s) / d))
const lerp = (a: number, b: number, k: number) => a + (b - a) * k
/** a point on a quadratic curve from a to b, bowed by (bx, by) */
function arc(a: { x: number; y: number }, b: { x: number; y: number }, k: number, bx: number, by: number) {
  const cx = (a.x + b.x) / 2 + bx
  const cy = (a.y + b.y) / 2 + by
  return {
    x: (1 - k) ** 2 * a.x + 2 * (1 - k) * k * cx + k * k * b.x,
    y: (1 - k) ** 2 * a.y + 2 * (1 - k) * k * cy + k * k * b.y,
  }
}

// ---- the stage (geometry from variant B)
const C = { x: 856, y: 326 }
const R = { x: 176, y: 184 }
function hemisphere(side: -1 | 1) {
  const lobes = [1.13, 1.1, 1.14, 1.09, 1.13, 1.1, 1.12]
  const n = lobes.length
  const at = (a: number, k = 1) => ({
    x: C.x + side * (4 + Math.cos(a) * (R.x - 4) * k * (1 - 0.08 * Math.max(0, -Math.sin(a)))),
    y: C.y + Math.sin(a) * R.y * k,
  })
  const a0 = -Math.PI / 2 + 0.07
  const a1 = Math.PI / 2 - 0.07
  let d = ''
  for (let i = 0; i < n; i++) {
    const s = a0 + ((a1 - a0) * i) / n
    const e = a0 + ((a1 - a0) * (i + 1)) / n
    const p0 = at(s)
    const c = at((s + e) / 2, lobes[i])
    const p1 = at(e)
    if (!i) d += `M${p0.x.toFixed(1)} ${p0.y.toFixed(1)}`
    d += ` Q${c.x.toFixed(1)} ${c.y.toFixed(1)} ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`
  }
  const bottom = at(a1)
  const top = at(a0)
  const mx = C.x + side * 5
  d += ` Q${mx} ${bottom.y - 30} ${mx} ${C.y + 60} Q${mx + side * 4} ${C.y} ${mx} ${C.y - 60} Q${mx} ${top.y + 30} ${top.x.toFixed(1)} ${top.y.toFixed(1)}Z`
  return d
}
const brainPath = [hemisphere(-1), hemisphere(1)].join(' ')
const folds = [
  'M700 250 c18 4 22 20 10 32', 'M712 384 c20 -2 30 12 22 28',
  'M1012 250 c-18 4 -22 20 -10 32', 'M1000 384 c-20 -2 -30 12 -22 28', 'M940 172 c-4 14 -20 20 -34 12',
]

// ---- act 1: the book, notes out of it, the pen links them
const book = { x: 750, y: 270 }
const cards = [
  { x: 800, y: 190, r: -5 },
  { x: 812, y: 262, r: 5 },
  { x: 806, y: 342, r: -4 },
  { x: 722, y: 352, r: 4 },
  { x: 754, y: 430, r: -3 },
]
const CW = 46
const CH = 58
const cardIn = (i: number) => p(0.4 + i * 0.5, 0.7)
const shrinkS = (i: number) => 5.0 + i * 0.4
const cardPose = (i: number) => {
  const c = cards[i]
  const g = cardIn(i)
  const k = p(shrinkS(i), 0.4)
  const x = lerp(book.x, c.x, g)
  const y = lerp(book.y, c.y, g)
  const s = lerp(0.4, 1, g) * lerp(1, 0.2, k)
  return { transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${c.r}) scale(${s.toFixed(3)})`, opacity: g * (1 - k) }
}
const penD = 'M800 212 Q 834 238 812 262 Q 788 302 806 340 Q 764 330 722 352 Q 724 404 754 428'
const penEl = ref<SVGPathElement>()
const penLen = ref(1)
function measure() { if (penEl.value) penLen.value = penEl.value.getTotalLength() }
const penP = computed(() => p(2.8, 1.8))
const penTip = computed(() => {
  const el = penEl.value
  if (!el) return { x: 800, y: 212 }
  const pt = el.getPointAtLength(penP.value * penLen.value)
  return { x: pt.x, y: pt.y }
})
const penOn = computed(() => clamp((t.value - 2.6) / 0.3) * (1 - clamp((t.value - 4.7) / 0.4)))
const inkOp = computed(() => 1 - p(5.0, 0.6))
// the book is there at the start, leaves once the notes are in the vault, returns to catch the dots
const bookOp = computed(() => Math.max(1 - p(6.2, 0.8), p(12.0, 0.7)))
const bookGlow = computed(() => {
  const d = t.value - 12.4
  return d > 0 && d < 1.2 ? Math.sin((d / 1.2) * Math.PI) : 0
})

// ---- the neurons: where the twenty dots settle in act 3
const nodes = [
  // left hemisphere
  { x: 806, y: 182 }, { x: 760, y: 214 }, { x: 822, y: 238 }, { x: 724, y: 292 }, { x: 790, y: 292 },
  { x: 708, y: 350 }, { x: 764, y: 348 }, { x: 818, y: 374 }, { x: 744, y: 412 }, { x: 778, y: 460 },
  // right hemisphere
  { x: 898, y: 190 }, { x: 946, y: 236 }, { x: 886, y: 272 }, { x: 966, y: 300 }, { x: 916, y: 318 },
  { x: 896, y: 366 }, { x: 950, y: 372 }, { x: 968, y: 414 }, { x: 934, y: 432 }, { x: 930, y: 478 },
]
// each card feeds both hemispheres: particle k is card floor(k / 4), and settles on node order[k]
const order = [0, 10, 4, 14, 2, 12, 6, 16, 1, 11, 7, 15, 3, 13, 8, 17, 5, 18, 9, 19]
const mouth = { x: C.x, y: 402 }
const dropS = (k: number) => shrinkS(Math.floor(k / 4)) + 0.25 + (k % 4) * 0.08
const burstS = (k: number) => 7.3 + k * 0.12
const arrive = (k: number) => burstS(k) + 0.8
const returnS = (k: number) => 12.0 + k * 0.03

const particles = computed(() => order.map((n, k) => {
  const card = cards[Math.floor(k / 4)]
  const j = k % 4
  const home = { x: card.x + (j % 2 ? 7 : -7), y: card.y + (j < 2 ? -9 : 9) }
  const node = nodes[n]
  const tv = t.value
  // act 2: card → vault
  if (tv < dropS(k)) return { x: home.x, y: home.y, r: 4, o: 0, settled: false }
  if (tv < dropS(k) + 0.9) {
    const q = p(dropS(k), 0.9)
    const pt = arc(home, mouth, q, 30, -50)
    return { ...pt, r: 4, o: clamp(q * 6) * (1 - clamp((q - 0.85) / 0.15)), settled: false }
  }
  // inside the vault
  if (tv < burstS(k)) return { ...mouth, r: 4, o: 0, settled: false }
  // act 3: vault → neuron
  if (tv < arrive(k)) {
    const q = p(burstS(k), 0.8)
    const pt = arc(mouth, node, q, node.x < C.x ? -40 : 40, -40)
    return { ...pt, r: lerp(4, 8, q), o: 1, settled: false }
  }
  // a neuron
  if (tv < returnS(k)) return { ...node, r: 8, o: 1, settled: true }
  // the reset: back into the book
  const q = p(returnS(k), 1.0)
  const pt = arc(node, book, q, 0, -40)
  return { ...pt, r: lerp(8, 3, q), o: 1 - clamp((q - 0.75) / 0.25), settled: q < 0.3 }
}))

// the vault pulses as dots land in it, and as they leave
const vaultPulse = computed(() => {
  let v = 0
  for (let k = 0; k < order.length; k++) {
    for (const s of [dropS(k) + 0.85, burstS(k)]) {
      const d = t.value - s
      if (d > 0 && d < 0.5) v = Math.max(v, Math.sin((d / 0.5) * Math.PI) * 0.7)
    }
  }
  return v
})
const vaultFill = computed(() => p(5.4, 2.0) * (1 - p(7.3, 2.6)))

// ---- links: each neuron to its two nearest, plus a few across the midline; they grow as dots arrive
const arrivalOf = (n: number) => arrive(order.indexOf(n))
const dist = (a: number, b: number) => Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y)
const pairSet = new Map<string, [number, number]>()
nodes.forEach((_, a) => {
  nodes.map((__, b) => b).filter(b => b !== a).sort((x, y) => dist(a, x) - dist(a, y)).slice(0, 2)
    .forEach(b => pairSet.set([a, b].sort((x, y) => x - y).join('-'), [Math.min(a, b), Math.max(a, b)]))
})
for (const [a, b] of [[2, 12], [4, 14], [7, 15], [0, 10]] as [number, number][]) pairSet.set(`${a}-${b}`, [a, b])
const links = [...pairSet.values()].map(([a, b]) => ({
  d: `M${nodes[a].x} ${nodes[a].y} L${nodes[b].x} ${nodes[b].y}`,
  s: Math.max(arrivalOf(a), arrivalOf(b)) + 0.1,
  cross: nodes[a].x < C.x !== nodes[b].x < C.x,
})).sort((x, y) => x.s - y.s)
const linkOut = computed(() => p(12.0, 0.5))
const glow = computed(() => p(8.8, 2.4) * (1 - p(12.0, 0.9)))

const ids = { glow: `kt-cbm-glow-${uid}`, vglow: `kt-cbm-vglow-${uid}`, clip: `kt-cbm-clip-${uid}` }
</script>

<template>
  <svg class="kt-cbm" viewBox="0 0 980 552" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <radialGradient :id="ids.glow">
        <stop offset="0%" class="kt-cbm__glow-in" />
        <stop offset="100%" class="kt-cbm__glow-out" />
      </radialGradient>
      <radialGradient :id="ids.vglow">
        <stop offset="0%" class="kt-cbm__vglow-in" />
        <stop offset="100%" class="kt-cbm__vglow-out" />
      </radialGradient>
      <clipPath :id="ids.clip"><path :d="brainPath" /></clipPath>
    </defs>

    <!-- the brain: an idle glow that brightens as the network grows -->
    <ellipse :cx="C.x" :cy="C.y" rx="230" ry="230" :fill="`url(#${ids.glow})`" :style="{ opacity: 0.35 + 0.65 * glow }" />
    <path :d="brainPath" class="kt-cbm__brain" />
    <g :clip-path="`url(#${ids.clip})`">
      <path :d="brainPath" class="kt-cbm__brain-lit" :style="{ opacity: glow }" />
    </g>
    <path v-for="(f, i) in folds" :key="`f${i}`" :d="f" class="kt-cbm__fold" />

    <!-- the vault, the knowledge base at the brain's core -->
    <circle :cx="mouth.x" :cy="mouth.y + 24" r="74" :fill="`url(#${ids.vglow})`"
      :style="{ opacity: 0.2 + 0.5 * vaultFill + 0.5 * vaultPulse }" />
    <g :transform="`translate(${C.x} 418)`">
      <path d="M-34 -14 v44 a34 10 0 0 0 68 0 v-44" class="kt-cbm__cyl" />
      <path d="M-34 1 a34 10 0 0 0 68 0 M-34 16 a34 10 0 0 0 68 0" class="kt-cbm__ring" />
      <path d="M-34 1 a34 10 0 0 0 68 0" class="kt-cbm__ring is-lit" :style="{ opacity: clamp(vaultFill * 2) }" />
      <path d="M-34 16 a34 10 0 0 0 68 0" class="kt-cbm__ring is-lit" :style="{ opacity: clamp(vaultFill * 2 - 1) }" />
      <ellipse cx="0" cy="-14" rx="34" ry="10" class="kt-cbm__lid" :style="{ '--pulse': vaultPulse }" />
    </g>

    <!-- act 1: the book (it also catches the dots at the reset) -->
    <circle :cx="book.x" :cy="book.y" r="46" :fill="`url(#${ids.vglow})`" :style="{ opacity: bookGlow }" />
    <g :transform="`translate(${book.x} ${book.y})`" :style="{ opacity: bookOp }">
      <path d="M0 -14 C -10 -22, -26 -22, -34 -16 V 16 C -26 10, -10 10, 0 18 C 10 10, 26 10, 34 16 V -16 C 26 -22, 10 -22, 0 -14 Z" class="kt-cbm__pages" />
      <path d="M0 -14 V 18" class="kt-cbm__spine" />
      <path d="M-27 -8 c6 -3 14 -3 20 0 M-27 0 c6 -3 14 -3 20 0 M7 -8 c6 -3 14 -3 20 0 M7 0 c6 -3 14 -3 20 0" class="kt-cbm__text" />
    </g>

    <!-- act 1: the ink between the notes -->
    <path ref="penEl" :d="penD" class="kt-cbm__ink" pathLength="1" :style="{ strokeDashoffset: 1 - penP, opacity: inkOp }" />

    <!-- the notes -->
    <g v-for="(c, i) in cards" :key="`c${i}`" :transform="cardPose(i).transform" :style="{ opacity: cardPose(i).opacity }">
      <rect :x="-CW / 2" :y="-CH / 2" :width="CW" :height="CH" rx="5" class="kt-cbm__card" />
      <text :x="-CW / 2 + 7" :y="-CH / 2 + 17" class="kt-cbm__hash">#</text>
      <path :d="`M${-CW / 2 + 19} ${-CH / 2 + 11} h16 M${-CW / 2 + 7} ${-CH / 2 + 28} h32 M${-CW / 2 + 7} ${-CH / 2 + 38} h24 M${-CW / 2 + 7} ${-CH / 2 + 48} h28`" class="kt-cbm__lines" />
    </g>

    <!-- the pen -->
    <g :transform="`translate(${penTip.x} ${penTip.y}) rotate(-38) scale(1.3)`" :style="{ opacity: penOn }">
      <path d="M0 0 l-4 -10 h8 z" class="kt-cbm__nib" />
      <rect x="-4" y="-40" width="8" height="30" rx="2" class="kt-cbm__barrel" />
    </g>

    <!-- act 3: the links (a hot flash as each one is drawn, then it settles) -->
    <g :style="{ opacity: 1 - linkOut }">
      <path v-for="(l, i) in links" :key="`l${i}`" :d="l.d" pathLength="1" class="kt-cbm__link" :class="{ 'is-cross': l.cross }"
        :style="{ strokeDashoffset: 1 - p(l.s, 0.45) }" />
      <path v-for="(l, i) in links" :key="`h${i}`" :d="l.d" pathLength="1" class="kt-cbm__flash"
        :style="{ strokeDashoffset: 1 - p(l.s, 0.45), opacity: t > l.s && t < l.s + 0.9 ? Math.sin(((t - l.s) / 0.9) * Math.PI) : 0 }" />
    </g>

    <!-- the dots: notes → vault → neurons → back into the book -->
    <circle v-for="(d, k) in particles" :key="`p${k}`" :cx="d.x" :cy="d.y" :r="d.r" :style="{ opacity: d.o }"
      class="kt-cbm__dot" :class="{ 'is-node': d.settled }" />
  </svg>
</template>

<style>
.kt-cbm {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  font-family: var(--font-family-sans);
}

.kt-cbm__glow-in { stop-color: var(--kt-c-primary); stop-opacity: 0.4; }
.kt-cbm__glow-out { stop-color: var(--kt-c-primary); stop-opacity: 0; }
.kt-cbm__vglow-in { stop-color: var(--kt-cool); stop-opacity: 0.45; }
.kt-cbm__vglow-out { stop-color: var(--kt-cool); stop-opacity: 0; }

.kt-cbm__brain {
  fill: var(--kt-tint-primary);
  stroke: var(--kt-c-primary-soft);
  stroke-width: 2.2;
  stroke-linejoin: round;
}

.kt-cbm__brain-lit {
  fill: var(--kt-tint-primary);
  stroke: var(--kt-c-primary);
  stroke-width: 4;
}

.kt-cbm__fold {
  fill: none;
  stroke: var(--kt-c-primary-soft);
  stroke-width: 2;
  stroke-linecap: round;
  opacity: 0.45;
}

.kt-cbm__cyl { fill: var(--kt-bg); stroke: var(--kt-cool); stroke-width: 2.2; }
.kt-cbm__ring { fill: none; stroke: var(--kt-line-strong); stroke-width: 1.5; }
.kt-cbm__ring.is-lit { stroke: var(--kt-cool); stroke-width: 2.2; }

.kt-cbm__lid {
  fill: color-mix(in srgb, var(--kt-cool) calc(18% + var(--pulse, 0) * 40%), var(--kt-bg));
  stroke: var(--kt-cool);
  stroke-width: 2.2;
}

.kt-cbm__tag { font: 600 13px var(--font-family-mono); letter-spacing: 0.08em; fill: var(--kt-cool); }

.kt-cbm__pages { fill: var(--kt-card); stroke: var(--kt-c-primary-soft); stroke-width: 2; stroke-linejoin: round; }
.kt-cbm__spine { stroke: var(--kt-c-primary-soft); stroke-width: 1.5; }
.kt-cbm__text { fill: none; stroke: var(--kt-subtle); stroke-width: 2; stroke-linecap: round; }

.kt-cbm__ink {
  fill: none;
  stroke: var(--kt-hot);
  stroke-width: 3.4;
  stroke-linecap: round;
  stroke-dasharray: 1;
}

.kt-cbm__card { fill: color-mix(in srgb, var(--kt-fg) 8%, var(--kt-bg)); stroke: var(--kt-line-strong); stroke-width: 1.5; }
.kt-cbm__hash { font: 700 13px var(--font-family-mono); fill: var(--kt-c-primary-soft); }
.kt-cbm__lines { stroke: var(--kt-subtle); stroke-width: 2.6; stroke-linecap: round; }

.kt-cbm__nib { fill: var(--kt-hot); }
.kt-cbm__barrel { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); stroke-width: 1.8; }

.kt-cbm__link {
  fill: none;
  stroke: var(--kt-c-primary-soft);
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-dasharray: 1;
}

.kt-cbm__link.is-cross { stroke: var(--kt-cool); }
.kt-cbm__flash { fill: none; stroke: var(--kt-hot); stroke-width: 3.2; stroke-linecap: round; stroke-dasharray: 1; }

.kt-cbm__dot { fill: var(--kt-cool); }

.kt-cbm__dot.is-node {
  fill: color-mix(in srgb, var(--kt-c-primary) 25%, var(--kt-bg));
  stroke: var(--kt-c-primary);
  stroke-width: 3;
}
</style>
