<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId } from 'vue'
import { onSlideEnter, onSlideLeave } from '@slidev/client'

/**
 * Cover background, variant "inside the brain": one large brain on the right is the stage for the
 * whole story, read left to right. Left hemisphere: a book, notes come out of it and a pen links
 * them (capture, connect). Midline: the linked notes drop into the vault at the brain's base.
 * Right hemisphere: synapses fire out of the vault, nodes light up and link, the network densifies
 * and the brain glows. Act 4, examination: the vault pushes "?" challenges at the network; each
 * node that answers earns a check and its links thicken (what you retrieve sticks); one challenge
 * finds a gap, the link flashes red and is redrawn. A 17 s loop; the contents crossfade back to the
 * start, the outline stays.
 * Reduced motion: the final, connected brain, static. Brand roles only, no props.
 */
const uid = useId()
const CYCLE = 17
const END = 15.6 // the story's final frame (shown statically with reduced motion)

// ---- the clock: loops forever while the slide is shown
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
/** eased progress of a phase that starts at `s` and lasts `d` seconds */
const p = (s: number, d: number) => ease(clamp((t.value - s) / d))
const lerp = (a: number, b: number, k: number) => a + (b - a) * k

// ---- the stage
const C = { x: 856, y: 326 }
const R = { x: 176, y: 184 }
// two hemispheres, each a run of lobes (bumps) around the outside and a gentle fissure inside
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
const halves = [hemisphere(-1), hemisphere(1)]
const brainPath = halves.join(' ')
// a few gyri, faint, so the shape reads as a brain from the back row
const folds = [
  'M700 250 c18 4 22 20 10 32', 'M712 384 c20 -2 30 12 22 28', 'M772 172 c4 14 20 20 34 12',
  'M720 446 c14 -8 32 -4 40 8',
  'M1012 250 c-18 4 -22 20 -10 32', 'M1000 384 c-20 -2 -30 12 -22 28', 'M940 172 c-4 14 -20 20 -34 12',
  'M992 446 c-14 -8 -32 -4 -40 8',
]

// ---- act 1: a book, notes come out of it, a pen links them
const book = { x: 752, y: 262 }
const cards = [
  { x: 790, y: 196, r: -5 },
  { x: 718, y: 336, r: 4 },
  { x: 800, y: 312, r: 6 },
  { x: 760, y: 414, r: -4 },
]
const CW = 46
const CH = 58
const cardIn = (i: number) => p(0.9 + i * 0.6, 0.7)
const penD = 'M790 214 C 760 236, 812 270, 800 306 S 740 318, 724 334 S 770 380, 760 404'
const penEl = ref<SVGPathElement>()
const penLen = ref(1)
function measure() { if (penEl.value) penLen.value = penEl.value.getTotalLength() }
const penP = computed(() => p(2.9, 1.7))
const penTip = computed(() => {
  const el = penEl.value
  if (!el) return { x: 790, y: 214 }
  const pt = el.getPointAtLength(penP.value * penLen.value)
  return { x: pt.x, y: pt.y }
})
const penOn = computed(() => clamp((t.value - 2.7) / 0.3) * (1 - clamp((t.value - 4.7) / 0.4)))
const linkFade = computed(() => 1 - p(5.0, 0.6))

// ---- act 2: the linked notes drop into the vault
const vault = { x: C.x, y: 418 }
const dropS = (i: number) => 4.9 + i * 0.4
const cardPose = (i: number) => {
  const c = cards[i]
  const k = p(dropS(i), 1.3)
  const sx = c.x
  const sy = c.y
  const ex = vault.x
  const ey = vault.y - 18
  const cx = lerp(sx, ex, 0.5) + 10
  const cy = Math.min(sy, ey) - 40
  const x = (1 - k) ** 2 * sx + 2 * (1 - k) * k * cx + k * k * ex
  const y = (1 - k) ** 2 * sy + 2 * (1 - k) * k * cy + k * k * ey
  const grow = cardIn(i)
  const s = lerp(1, 0.34, k) * lerp(0.4, 1, grow)
  // before it lands it comes out of the book
  const bx = lerp(book.x, x, grow)
  const by = lerp(book.y, y, grow)
  return {
    transform: `translate(${bx.toFixed(1)} ${by.toFixed(1)}) rotate(${lerp(c.r, 0, k)}) scale(${s.toFixed(3)})`,
    opacity: grow * (1 - clamp((k - 0.85) / 0.15)),
  }
}
const vaultPulse = computed(() => {
  let v = 0
  for (let i = 0; i < cards.length; i++) {
    const d = t.value - (dropS(i) + 1.2)
    if (d > 0 && d < 0.9) v = Math.max(v, Math.sin((d / 0.9) * Math.PI))
  }
  return v
})
const vaultFill = computed(() => p(5.8, 1.9))

// ---- act 3: synapses fire from the vault, the network densifies
const nodes = [
  // right hemisphere: the new connections
  { x: 902, y: 214, s: 7.2 }, { x: 948, y: 262, s: 7.45 }, { x: 890, y: 290, s: 7.7 },
  { x: 952, y: 338, s: 7.95 }, { x: 906, y: 366, s: 8.2 }, { x: 958, y: 412, s: 8.45 },
  { x: 884, y: 168, s: 8.7 },
  // left hemisphere: where the notes were (same spots), now connected
  ...cards.map((c, i) => ({ x: c.x, y: c.y, s: 9.0 + i * 0.2 })),
  { x: book.x, y: book.y, s: 9.8 },
]
/** a note leaves a faint trace where it was; act 3 lights it up */
const ghost = (i: number) => (i >= 7 && i < 7 + cards.length ? p(dropS(i - 7) + 0.3, 0.5) * 0.4 : 0)
const nodeIn = (i: number) => p(nodes[i].s, 0.45)
const nodeOp = (i: number) => Math.max(nodeIn(i), ghost(i))
const sparkPos = (i: number) => {
  const n = nodes[i]
  const k = p(n.s - 0.7, 0.7)
  const cx = lerp(vault.x, n.x, 0.5) + (n.x > vault.x ? 30 : -30)
  const cy = lerp(vault.y, n.y, 0.5) + 20
  const sy = vault.y - 22
  const x = (1 - k) ** 2 * vault.x + 2 * (1 - k) * k * cx + k * k * n.x
  const y = (1 - k) ** 2 * sy + 2 * (1 - k) * k * cy + k * k * n.y
  const on = t.value > n.s - 0.7 && t.value < n.s
  return { x, y, o: on ? Math.sin(k * Math.PI) * 0.4 + 0.6 : 0 }
}
const pairs: [number, number, number][] = [
  [0, 2, 7.9], [2, 1, 8.1], [1, 3, 8.3], [2, 4, 8.5], [3, 4, 8.7], [4, 5, 8.9], [3, 5, 9.05],
  [6, 0, 9.2], [6, 1, 9.35], [0, 7, 9.5], [2, 9, 9.65], [7, 11, 9.9], [11, 9, 10.05], [11, 8, 10.2],
  [8, 9, 10.35], [8, 10, 10.5], [9, 10, 10.65], [4, 9, 10.8], [6, 7, 10.95], [11, 0, 11.1],
]
const links = pairs.map(([a, b, s]) => ({
  a,
  b,
  d: `M${nodes[a].x} ${nodes[a].y} L${nodes[b].x} ${nodes[b].y}`, s, cross: nodes[a].x < C.x !== nodes[b].x < C.x,
}))
const glow = computed(() => p(9.6, 2.2))

// ---- act 4: examination: the vault pushes challenges, retrieved connections get stronger
const quizzes = [
  { n: 1, s: 11.6, gap: false }, { n: 7, s: 12.4, gap: false }, { n: 9, s: 13.2, gap: true }, { n: 3, s: 14.2, gap: false },
]
const hitAt = (q: typeof quizzes[number]) => q.s + 0.7
const passAt = (q: typeof quizzes[number]) => hitAt(q) + (q.gap ? 1.3 : 0.25)
const quizPos = (q: typeof quizzes[number]) => {
  const k = p(q.s, 0.7)
  const n = nodes[q.n]
  const sx = vault.x
  const sy = vault.y - 24
  const cx = (sx + n.x) / 2 + (n.x > vault.x ? 50 : -50)
  const cy = (sy + n.y) / 2 - 30
  return {
    x: (1 - k) ** 2 * sx + 2 * (1 - k) * k * cx + k * k * n.x,
    y: (1 - k) ** 2 * sy + 2 * (1 - k) * k * cy + k * k * n.y,
    o: t.value > q.s && t.value < hitAt(q) + 0.15 ? clamp((t.value - q.s) / 0.15) : 0,
  }
}
const ringOf = (q: typeof quizzes[number]) => {
  const d = t.value - hitAt(q)
  return d > 0 && d < 0.7 ? { r: 8 + d * 26, o: 1 - d / 0.7 } : { r: 8, o: 0 }
}
const touches = (l: typeof links[number], n: number) => l.a === n || l.b === n
const strong = (i: number) => Math.max(0, ...quizzes.filter(q => touches(links[i], q.n)).map(q => p(passAt(q), 0.6)))
const gapQuiz = quizzes.find(q => q.gap)!
const gapLink = links.findIndex(l => touches(l, gapQuiz.n))
const gapFlash = computed(() => {
  const d = t.value - hitAt(gapQuiz)
  return d > 0 && d < 0.9 ? Math.sin((d / 0.9) * Math.PI) : 0
})
const linkDraw = (i: number) => {
  const l = links[i]
  if (i === gapLink && t.value > hitAt(gapQuiz) + 0.35) return p(hitAt(gapQuiz) + 0.55, 0.7)
  if (i === gapLink && t.value > hitAt(gapQuiz)) return 1 - p(hitAt(gapQuiz), 0.35)
  return p(l.s, 0.5)
}

// ---- the loop: contents fade in at the start and out at the end; the brain outline stays
const stage = computed(() => (reduced ? 1 : clamp(t.value / 0.6) * (1 - clamp((t.value - 16.0) / 0.8))))
const ids = { glow: `kt-cbs-glow-${uid}`, vglow: `kt-cbs-vglow-${uid}`, clip: `kt-cbs-clip-${uid}` }
</script>

<template>
  <svg class="kt-cbs" viewBox="0 0 980 552" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <radialGradient :id="ids.glow">
        <stop offset="0%" class="kt-cbs__glow-in" />
        <stop offset="100%" class="kt-cbs__glow-out" />
      </radialGradient>
      <radialGradient :id="ids.vglow">
        <stop offset="0%" class="kt-cbs__vglow-in" />
        <stop offset="100%" class="kt-cbs__vglow-out" />
      </radialGradient>
      <clipPath :id="ids.clip"><path :d="brainPath" /></clipPath>
    </defs>

    <!-- the brain: a calm idle glow that brightens as the network grows -->
    <ellipse :cx="C.x" :cy="C.y" rx="230" ry="230" :fill="`url(#${ids.glow})`" class="kt-cbs__halo"
      :style="{ opacity: 0.35 + 0.65 * glow * stage }" />
    <path :d="brainPath" class="kt-cbs__brain" />
    <g :clip-path="`url(#${ids.clip})`">
      <path :d="brainPath" class="kt-cbs__brain-lit" :style="{ opacity: glow * stage }" />
    </g>
        <path v-for="(f, i) in folds" :key="`f${i}`" :d="f" class="kt-cbs__fold" />

    <!-- the vault, the knowledge base at the brain's core -->
    <circle :cx="vault.x" :cy="vault.y + 8" r="74" :fill="`url(#${ids.vglow})`"
      :style="{ opacity: (0.25 + 0.5 * vaultFill + 0.5 * vaultPulse + 0.3 * glow) * stage + 0.2 }" />
    <g class="kt-cbs__vault" :transform="`translate(${vault.x} ${vault.y})`">
      <path d="M-34 -14 v44 a34 10 0 0 0 68 0 v-44" class="kt-cbs__cyl" />
      <path d="M-34 1 a34 10 0 0 0 68 0 M-34 16 a34 10 0 0 0 68 0" class="kt-cbs__ring" />
      <path d="M-34 1 a34 10 0 0 0 68 0" class="kt-cbs__ring is-lit" :style="{ opacity: Math.max(vaultFill, glow) * stage }" />
      <path d="M-34 16 a34 10 0 0 0 68 0" class="kt-cbs__ring is-lit" :style="{ opacity: clamp(vaultFill * 2 - 1) * stage }" />
      <ellipse cx="0" cy="-14" rx="34" ry="10" class="kt-cbs__lid" :style="{ '--pulse': vaultPulse * stage }" />
    </g>
    <text :x="vault.x + 44" :y="vault.y + 32" class="kt-cbs__tag">vault</text>

    <g :style="{ opacity: stage }">
      <!-- act 1: the book, opened -->
      <g class="kt-cbs__book" :transform="`translate(${book.x} ${book.y})`"
        :style="{ opacity: p(0.3, 0.6) * (1 - p(5.6, 0.8)) }">
        <path d="M0 -14 C -10 -22, -26 -22, -34 -16 V 16 C -26 10, -10 10, 0 18 C 10 10, 26 10, 34 16 V -16 C 26 -22, 10 -22, 0 -14 Z" class="kt-cbs__pages" />
        <path d="M0 -14 V 18" class="kt-cbs__spine" />
        <path d="M-27 -8 c6 -3 14 -3 20 0 M-27 0 c6 -3 14 -3 20 0 M7 -8 c6 -3 14 -3 20 0 M7 0 c6 -3 14 -3 20 0" class="kt-cbs__text" />
      </g>

      <!-- act 1: the pen links the notes (drawn under the cards) -->
      <path ref="penEl" :d="penD" class="kt-cbs__ink" pathLength="1"
        :style="{ strokeDashoffset: 1 - penP, opacity: linkFade }" />

      <!-- the notes: out of the book, linked, then into the vault -->
      <g v-for="(c, i) in cards" :key="`c${i}`" :transform="cardPose(i).transform" :style="{ opacity: cardPose(i).opacity }">
        <rect :x="-CW / 2" :y="-CH / 2" :width="CW" :height="CH" rx="5" class="kt-cbs__card" />
        <text :x="-CW / 2 + 7" :y="-CH / 2 + 17" class="kt-cbs__hash">#</text>
        <path :d="`M${-CW / 2 + 19} ${-CH / 2 + 11} h16 M${-CW / 2 + 7} ${-CH / 2 + 28} h32 M${-CW / 2 + 7} ${-CH / 2 + 38} h24 M${-CW / 2 + 7} ${-CH / 2 + 48} h28`" class="kt-cbs__lines" />
      </g>

      <!-- the pen -->
      <g :transform="`translate(${penTip.x} ${penTip.y}) rotate(-38) scale(1.3)`" :style="{ opacity: penOn }" class="kt-cbs__pen">
        <path d="M0 0 l-4 -10 h8 z" class="kt-cbs__nib" />
        <rect x="-4" y="-40" width="8" height="30" rx="2" class="kt-cbs__barrel" />
      </g>

      <!-- act 3: new connections -->
      <path v-for="(l, i) in links" :key="`l${i}`" :d="l.d" pathLength="1" class="kt-cbs__link" :class="{ 'is-cross': l.cross }"
        :style="{ strokeDashoffset: 1 - linkDraw(i) }" />
      <!-- act 4: links a challenge passed through get stronger; the gap flashes red -->
      <path v-for="(l, i) in links" :key="`s${i}`" :d="l.d" class="kt-cbs__strong" :style="{ opacity: strong(i) }" />
      <path v-if="gapLink >= 0" :d="links[gapLink].d" class="kt-cbs__gap" :style="{ opacity: gapFlash }" />
      <circle v-for="(n, i) in nodes" :key="`s${i}`" :cx="sparkPos(i).x" :cy="sparkPos(i).y" r="6" class="kt-cbs__spark" :style="{ opacity: sparkPos(i).o }" />
      <circle v-for="(n, i) in nodes" :key="`n${i}`" :cx="n.x" :cy="n.y" r="8" class="kt-cbs__node"
        :style="{ opacity: nodeOp(i), transform: `scale(${0.4 + 0.6 * Math.max(nodeIn(i), ghost(i) ? 0.5 : 0)})` }" />

      <!-- act 4: challenges from the vault, rings where they hit, a check when the answer holds -->
      <circle v-for="(q, i) in quizzes" :key="`r${i}`" :cx="nodes[q.n].x" :cy="nodes[q.n].y" :r="ringOf(q).r"
        class="kt-cbs__hit" :class="{ 'is-gap': q.gap }" :style="{ opacity: ringOf(q).o }" />
      <g v-for="(q, i) in quizzes" :key="`q${i}`" :transform="`translate(${quizPos(q).x} ${quizPos(q).y})`" :style="{ opacity: quizPos(q).o }">
        <circle r="13" class="kt-cbs__q" />
        <text y="6" text-anchor="middle" class="kt-cbs__qtext">?</text>
      </g>
      <g v-for="(q, i) in quizzes" :key="`k${i}`" :transform="`translate(${nodes[q.n].x + 17} ${nodes[q.n].y - 17})`"
        :style="{ opacity: p(passAt(q), 0.3) }">
        <circle r="13" class="kt-cbs__pass" />
        <path d="M-6 0.5 l4 4 l8 -8.5" class="kt-cbs__tick" />
      </g>
    </g>
  </svg>
</template>

<style>
.kt-cbs {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  font-family: var(--font-family-sans);
}

.kt-cbs__glow-in { stop-color: var(--kt-c-primary); stop-opacity: 0.4; }
.kt-cbs__glow-out { stop-color: var(--kt-c-primary); stop-opacity: 0; }
.kt-cbs__vglow-in { stop-color: var(--kt-cool); stop-opacity: 0.45; }
.kt-cbs__vglow-out { stop-color: var(--kt-cool); stop-opacity: 0; }

.kt-cbs__brain {
  fill: var(--kt-tint-primary);
  stroke: var(--kt-c-primary-soft);
  stroke-width: 2.2;
  stroke-linejoin: round;
}

.kt-cbs__brain-lit {
  fill: var(--kt-tint-primary);
  stroke: var(--kt-c-primary);
  stroke-width: 4;
}

.kt-cbs__fold {
  fill: none;
  stroke: var(--kt-c-primary-soft);
  stroke-width: 2;
  stroke-linecap: round;
  opacity: 0.45;
}

.kt-cbs__cyl {
  fill: var(--kt-bg);
  stroke: var(--kt-cool);
  stroke-width: 2.2;
}

.kt-cbs__ring {
  fill: none;
  stroke: var(--kt-line-strong);
  stroke-width: 1.5;
}

.kt-cbs__ring.is-lit { stroke: var(--kt-cool); stroke-width: 2.2; }

.kt-cbs__lid {
  fill: color-mix(in srgb, var(--kt-cool) calc(18% + var(--pulse, 0) * 40%), var(--kt-bg));
  stroke: var(--kt-cool);
  stroke-width: 2.2;
}

.kt-cbs__tag {
  font: 600 13px var(--font-family-mono);
  letter-spacing: 0.08em;
  fill: var(--kt-cool);
}

.kt-cbs__pages {
  fill: var(--kt-card);
  stroke: var(--kt-c-primary-soft);
  stroke-width: 2;
  stroke-linejoin: round;
}

.kt-cbs__spine { stroke: var(--kt-c-primary-soft); stroke-width: 1.5; }

.kt-cbs__text {
  fill: none;
  stroke: var(--kt-subtle);
  stroke-width: 2;
  stroke-linecap: round;
}

.kt-cbs__ink {
  fill: none;
  stroke: var(--kt-hot);
  stroke-width: 3.4;
  stroke-linecap: round;
  stroke-dasharray: 1;
}

.kt-cbs__card {
  fill: color-mix(in srgb, var(--kt-fg) 8%, var(--kt-bg));
  stroke: var(--kt-line-strong);
  stroke-width: 1.5;
}

.kt-cbs__hash {
  font: 700 13px var(--font-family-mono);
  fill: var(--kt-c-primary-soft);
}

.kt-cbs__lines {
  stroke: var(--kt-subtle);
  stroke-width: 2.6;
  stroke-linecap: round;
}

.kt-cbs__nib { fill: var(--kt-hot); }
.kt-cbs__barrel { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); stroke-width: 1.8; }

.kt-cbs__link {
  fill: none;
  stroke: var(--kt-c-primary-soft);
  stroke-width: 2.6;
  stroke-linecap: round;
  stroke-dasharray: 1;
}

.kt-cbs__link.is-cross { stroke: var(--kt-cool); }

.kt-cbs__spark { fill: var(--kt-cool); }

.kt-cbs__node {
  fill: color-mix(in srgb, var(--kt-c-primary) 25%, var(--kt-bg));
  stroke: var(--kt-c-primary);
  stroke-width: 3;
  transform-box: fill-box;
  transform-origin: center;
}
/* act 4: examination */
.kt-cbs__strong { fill: none; stroke: var(--kt-c-primary); stroke-width: 4.6; stroke-linecap: round; }
.kt-cbs__gap { fill: none; stroke: var(--kt-bad); stroke-width: 4.6; stroke-linecap: round; stroke-dasharray: 6 6; }
.kt-cbs__hit { fill: none; stroke: var(--kt-good); stroke-width: 2.5; }
.kt-cbs__hit.is-gap { stroke: var(--kt-bad); }
.kt-cbs__q { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); stroke-width: 2; }
.kt-cbs__qtext { font-size: 17px; font-weight: 800; fill: var(--kt-hot); }
.kt-cbs__pass { fill: color-mix(in srgb, var(--kt-good) 22%, var(--kt-bg)); stroke: var(--kt-good); stroke-width: 2; }
.kt-cbs__tick { fill: none; stroke: var(--kt-good); stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
</style>
