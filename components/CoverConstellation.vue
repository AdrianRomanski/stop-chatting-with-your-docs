<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId } from 'vue'
import { onSlideEnter, onSlideLeave } from '@slidev/client'

/**
 * Cover background, variant "constellation morph": the same particles tell the whole story.
 * 1. A glowing pen (from the person at the lower right) visits note cards and draws constellation
 *    lines between them: you capture and connect notes.
 * 2. The constellation pours into the vault (a doc stack): the cards literally travel into it.
 * 3. The same particles stream out as the nodes of a brain, and new links light up one by one
 *    until it is densely connected and glows. The vault lifts aside and docks above the brain.
 * 4. Examination: a coach mark (✦) lights up on the vault and sends "?" challenges, one after
 *    another, at brain nodes. A hit rings, a pass earns a check and that node's links thicken (what
 *    you retrieve gets stronger); the third challenge finds a gap: the link flashes red, is redrawn,
 *    then passes. Then everything drifts back and the loop restarts.
 * One cycle is LOOP seconds, positions are continuous across the wrap, so the reset is soft.
 * Reduced motion shows the tested brain (checks, strong links), still. Brand roles only, no props.
 */
const LOOP = 17.4
const END = 15.8 // the story's final frame (shown statically with reduced motion)
const uid = useId()

// ---------- clock: a looping rAF clock, paused off-slide ----------
const t = ref(END)
const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
let raf = 0
let t0 = 0
function tick(now: number) {
  t.value = ((now - t0) / 1000) % LOOP
  raf = requestAnimationFrame(tick)
}
function start() {
  cancelAnimationFrame(raf)
  if (reduced) { t.value = END; return }
  t0 = performance.now()
  t.value = 0
  raf = requestAnimationFrame(tick)
}
function stop() { cancelAnimationFrame(raf) }
onMounted(start)
onSlideEnter(start)
onSlideLeave(stop)
onBeforeUnmount(stop)

// ---------- helpers ----------
let seed = 7
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const ease = (v: number) => { const x = clamp(v); return x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2 }
const ramp = (v: number, a: number, b: number) => clamp((v - a) / (b - a))
const lerp = (a: number, b: number, k: number) => a + (b - a) * k
type P = { x: number; y: number }
function arc(a: P, b: P, k: number, bend: number): P {
  const mx = (a.x + b.x) / 2 - (b.y - a.y) * bend
  const my = (a.y + b.y) / 2 + (b.x - a.x) * bend
  const u = 1 - k
  return { x: u * u * a.x + 2 * u * k * mx + k * k * b.x, y: u * u * a.y + 2 * u * k * my + k * k * b.y }
}

// ---------- geometry ----------
const BRAIN = { x: 782, y: 394, s: 3.0 } // the LearningFlow glyph, scaled
const VAULT = { x: 782, y: 400 }

// scatter: a jittered field of note cards on the right
const cols = [756, 812, 868, 924]
const rows = [40, 100, 160, 220, 280, 340, 400]
const scatter: P[] = []
for (const y of rows) for (const x of cols) scatter.push({ x: x + (rnd() - 0.5) * 28, y: y + (rnd() - 0.5) * 30 })
const N = scatter.length // 28

// brain nodes: three rings inside the glyph, each hemisphere apart from the midline
const brain: P[] = []
const rings = [{ n: 12, f: 0.84 }, { n: 10, f: 0.56 }, { n: 6, f: 0.26 }]
const RX = 38 * BRAIN.s
const RY = 32 * BRAIN.s
for (const [ri, r] of rings.entries()) {
  for (let k = 0; k < r.n; k++) {
    const a = ((k + 0.5) / r.n) * Math.PI * 2 + ri * 0.35 + (rnd() - 0.5) * 0.2
    let x = Math.cos(a) * RX * r.f
    const y = Math.sin(a) * RY * r.f + (rnd() - 0.5) * 8
    x += Math.sign(x || 1) * 9
    brain.push({ x: BRAIN.x + x, y: BRAIN.y + y })
  }
}
// match particles to brain nodes by vertical order so the stream doesn't cross itself much
const byY = (arr: P[]) => arr.map((p, i) => ({ p, i })).sort((a, b) => a.p.y - b.p.y || a.p.x - b.p.x).map(o => o.i)
const sOrder = byY(scatter)
const bOrder = byY(brain)
const target: number[] = Array(N)
sOrder.forEach((si, k) => { target[si] = bOrder[k] })

// brain links: 3 nearest in the same hemisphere, plus a few bridges across the midline
const key = (a: number, b: number) => (a < b ? `${a}-${b}` : `${b}-${a}`)
const linkSet = new Map<string, [number, number]>()
for (let i = 0; i < brain.length; i++) {
  const side = Math.sign(brain[i].x - BRAIN.x)
  const near = brain.map((p, j) => ({ j, d: Math.hypot(p.x - brain[i].x, p.y - brain[i].y) }))
    .filter(o => o.j !== i && Math.sign(brain[o.j].x - BRAIN.x) === side)
    .sort((a, b) => a.d - b.d).slice(0, 3)
  for (const o of near) linkSet.set(key(i, o.j), [i, o.j])
}
{
  const left = brain.map((p, i) => ({ p, i })).filter(o => o.p.x < BRAIN.x)
  const right = brain.map((p, i) => ({ p, i })).filter(o => o.p.x > BRAIN.x)
  for (const l of left) {
    if (Math.abs(l.p.x - BRAIN.x) > 40) continue
    const r = right.sort((a, b) => Math.hypot(a.p.x - l.p.x, a.p.y - l.p.y) - Math.hypot(b.p.x - l.p.x, b.p.y - l.p.y))[0]
    if (r && Math.hypot(r.p.x - l.p.x, r.p.y - l.p.y) < 70) linkSet.set(key(l.i, r.i), [l.i, r.i])
  }
}
// light them in a spreading order: breadth-first from the node nearest the top-left of the brain
const allLinks = [...linkSet.values()]
const order: [number, number][] = []
{
  const seen = new Set<number>()
  const used = new Set<string>()
  let startNode = 0
  brain.forEach((p, i) => { if (p.x + p.y < brain[startNode].x + brain[startNode].y) startNode = i })
  const queue = [startNode]
  seen.add(startNode)
  while (queue.length) {
    const n = queue.shift()!
    for (const [a, b] of allLinks) {
      if (a !== n && b !== n) continue
      const k = key(a, b)
      if (used.has(k)) continue
      used.add(k)
      order.push(a === n ? [a, b] : [b, a])
      const o = a === n ? b : a
      if (!seen.has(o)) { seen.add(o); queue.push(o) }
    }
  }
}
const B_LINK0 = 7.9
const B_STEP = 2.6 / order.length

// the pen's constellation: a nearest-neighbour walk from the lower right over 10 cards
const walk = [27, 22, 17, 12, 9, 14, 11, 6, 1, 4] // grid index r*4+c: a zigzag up from the hand
const PEN0 = 0.7
const PEN_STEP = 0.36
const penAt = (k: number) => PEN0 + k * PEN_STEP // arrival at walk[k]
// extra branches the human adds between notes already visited
const branches: { a: number; b: number; t: number }[] = [
  { a: 22, b: 14, t: penAt(6) },
  { a: 17, b: 9, t: penAt(7) },
  { a: 14, b: 6, t: penAt(8) },
  { a: 9, b: 4, t: penAt(9) + 0.1 },
]
const visitedAt: number[] = Array(N).fill(Infinity)
walk.forEach((i, k) => { visitedAt[i] = penAt(k) })

const HAND = { x: 918, y: 512 }

// timing of the morph
const IN0 = 4.6 // first card leaves for the vault
const IN_STAG = 0.045
const IN_DUR = 1.05
const OUT0 = 6.5
const OUT_STAG = 0.04
const OUT_DUR = 1.0
const RESET0 = 16.0
const RESET_STAG = 0.012
const RESET_DUR = 1.0

const drift = (i: number, tt: number): P => {
  const w = (Math.PI * 2) / LOOP
  return { x: scatter[i].x + Math.sin(w * tt * 2 + i) * 4, y: scatter[i].y + Math.cos(w * tt * 3 + i * 1.7) * 5 }
}
const vaultSlot = (i: number): P => ({ x: VAULT.x - 6 + ((i * 7) % 13), y: VAULT.y - 10 + ((i * 5) % 19) })

// act 4: once the nodes are out, the vault docks above the brain; its coach mark sends challenges
const DOCK = { x: 874, y: 196, s: 0.66 }
const DOCK0 = OUT0 + 0.8
const DOCK_DUR = 1.0
const COACH = { x: 818, y: 172 } // the ✦ badge, beside the docked vault
const COACH_IN = 10.3
const quizzes = [
  { n: 10, s: 11.1, gap: false, dx: 17 },
  { n: 7, s: 11.9, gap: false, dx: 17 },
  { n: 22, s: 12.7, gap: true, dx: -17 },
  { n: 3, s: 13.9, gap: false, dx: -17 },
]
type Q = typeof quizzes[number]
const hitAt = (q: Q) => q.s + 0.7
const passAt = (q: Q) => hitAt(q) + (q.gap ? 1.3 : 0.25)
const gapQuiz = quizzes.find(q => q.gap)!
const touches = (l: [number, number], n: number) => l[0] === n || l[1] === n
const gapLink = order.findIndex(l => touches(l, gapQuiz.n))

const frame = computed(() => {
  const tt = t.value
  const parts = scatter.map((_, i) => {
    const a = IN0 + i * IN_STAG
    const b = OUT0 + i * OUT_STAG
    const r = RESET0 + i * RESET_STAG
    const B = brain[target[i]]
    let pos: P
    let card = 1 // 1 = note card, 0 = brain node
    let vis = 1
    let node = 0
    if (tt < a) pos = drift(i, tt)
    else if (tt < a + IN_DUR) {
      const k = ease((tt - a) / IN_DUR)
      pos = arc(drift(i, tt), vaultSlot(i), k, i % 2 ? 0.2 : -0.2)
      card = 1 - k
      vis = 1 - ramp(k, 0.75, 1)
    } else if (tt < b) { pos = vaultSlot(i); card = 0; vis = 0 }
    else if (tt < b + OUT_DUR) {
      const k = ease((tt - b) / OUT_DUR)
      pos = arc(vaultSlot(i), B, k, i % 2 ? 0.28 : -0.28)
      card = 0
      vis = ramp(k, 0, 0.2)
      node = k
    } else if (tt < r) { pos = B; card = 0; node = 1 }
    else {
      const k = ease((tt - r) / RESET_DUR)
      pos = arc(B, drift(i, tt), k, i % 2 ? -0.18 : 0.18)
      card = ramp(k, 0.3, 1)
      node = 1 - k
    }
    const visited = tt >= visitedAt[i] && tt < a + IN_DUR
    const pop = visited ? 1 + 0.35 * Math.max(0, 1 - (tt - visitedAt[i]) / 0.35) : 1
    const w = lerp(8, 22, card) * pop
    const h = lerp(8, 28, card) * pop
    return {
      x: pos.x, y: pos.y, w, h, rx: lerp(4, 3.5, card),
      card, node, vis,
      lit: visited ? 1 : 0,
      dim: visited || tt >= a ? 1 : 0.5,
    }
  })

  // constellation lines: drawn by the pen, then they follow their cards into the vault and fade
  const conFade = 1 - ramp(tt, IN0 + 0.2, IN0 + 1.0)
  const conLines: { x1: number; y1: number; x2: number; y2: number; o: number }[] = []
  const seg = (ai: number, bi: number, t1: number, dur: number) => {
    const p = ramp(tt, t1, t1 + dur)
    if (p <= 0 || conFade <= 0) return
    const A = parts[ai]
    const Bp = parts[bi]
    conLines.push({ x1: A.x, y1: A.y, x2: lerp(A.x, Bp.x, p), y2: lerp(A.y, Bp.y, p), o: conFade * Math.min(A.vis, Bp.vis) })
  }
  for (let k = 1; k < walk.length; k++) seg(walk[k - 1], walk[k], penAt(k - 1), PEN_STEP)
  for (const br of branches) seg(br.a, br.b, br.t, 0.45)

  // the pen: from the hand to the first card, along the walk, then back home
  let pen: P | null = null
  let penO = 0
  const first = parts[walk[0]]
  const last = parts[walk[walk.length - 1]]
  if (tt >= 0.15 && tt < penAt(0)) {
    pen = arc(HAND, first, ease(ramp(tt, 0.15, penAt(0))), 0.15)
    penO = ramp(tt, 0.15, 0.4)
  } else if (tt >= penAt(0) && tt < penAt(walk.length - 1)) {
    const k = Math.floor((tt - PEN0) / PEN_STEP)
    const f = ease((tt - penAt(k)) / PEN_STEP)
    const A = parts[walk[k]]
    const Bp = parts[walk[k + 1]]
    pen = { x: lerp(A.x, Bp.x, f), y: lerp(A.y, Bp.y, f) }
    penO = 1
  } else if (tt >= penAt(walk.length - 1) && tt < IN0 + 0.4) {
    pen = arc(last, HAND, ease(ramp(tt, penAt(walk.length - 1) + 0.2, IN0 + 0.4)), -0.2)
    penO = 1 - ramp(tt, IN0, IN0 + 0.4)
  }
  const branchPen = branches.map((br) => {
    const p = ramp(tt, br.t, br.t + 0.45)
    if (p <= 0 || p >= 1) return null
    const A = parts[br.a]
    const Bp = parts[br.b]
    return { x: lerp(A.x, Bp.x, p), y: lerp(A.y, Bp.y, p) }
  }).filter(Boolean) as P[]

  // the vault: appears as the cards leave, fills, then lets them out and fades
  const vaultO = ramp(tt, IN0 - 0.4, IN0 + 0.2) * (1 - ramp(tt, RESET0, RESET0 + 0.7))
  const filled = parts.filter((_, i) => tt >= IN0 + i * IN_STAG + IN_DUR * 0.9 && tt < OUT0 + i * OUT_STAG + 0.1).length / N
  const vaultScale = 0.85 + 0.15 * ease(ramp(tt, IN0 - 0.4, IN0 + 0.3)) + 0.06 * filled

  // the brain: outline draws as nodes arrive, links light one by one, then it glows
  const resetFade = 1 - ramp(tt, RESET0, RESET0 + 0.7)
  const outline = ease(ramp(tt, OUT0 + 0.4, OUT0 + 1.6))
  const outlineO = Math.min(ramp(tt, OUT0 + 0.3, OUT0 + 0.6), resetFade)
  const gh = hitAt(gapQuiz)
  const bLinks = order.map(([a, b], k) => {
    const s = B_LINK0 + k * B_STEP
    let p = ease(ramp(tt, s, s + 0.35))
    let fresh = tt < s + 0.6
    // the gap: the link unravels when the challenge hits, then is redrawn (hot while fresh)
    if (k === gapLink && tt > gh + 0.35) { p = ease(ramp(tt, gh + 0.55, gh + 1.25)); fresh = tt < gh + 1.6 }
    else if (k === gapLink && tt > gh) p = 1 - ease(ramp(tt, gh, gh + 0.35))
    if (p <= 0 || resetFade <= 0) return null
    const A = brain[a]
    const Bp = brain[b]
    return { x1: A.x, y1: A.y, x2: lerp(A.x, Bp.x, p), y2: lerp(A.y, Bp.y, p), o: resetFade, fresh }
  }).filter(Boolean) as { x1: number; y1: number; x2: number; y2: number; o: number; fresh: boolean }[]
  const glow = ramp(tt, B_LINK0 + 1.0, B_LINK0 + 2.8) * resetFade

  // act 4: the vault docks, the coach lights up per challenge, checks land, links strengthen
  const dk = ease(ramp(tt, DOCK0, DOCK0 + DOCK_DUR))
  const vaultPos = { x: lerp(VAULT.x, DOCK.x, dk), y: lerp(VAULT.y, DOCK.y, dk) }
  const vaultS = vaultScale * lerp(1, DOCK.s, dk)
  const coachO = ease(ramp(tt, COACH_IN, COACH_IN + 0.5)) * resetFade
  let coachLit = 0
  for (const q of quizzes) {
    const d = tt - (q.s - 0.3)
    if (d > 0 && d < 1.0) coachLit = Math.max(coachLit, Math.sin((d / 1.0) * Math.PI))
  }
  const quiz = quizzes.map((q) => {
    const n = brain[q.n]
    const k = ease(ramp(tt, q.s, q.s + 0.7))
    const pos = arc(COACH, n, k, n.x < COACH.x ? 0.22 : -0.22)
    const on = tt > q.s && tt < hitAt(q) + 0.15
    const d = tt - hitAt(q)
    return {
      x: pos.x, y: pos.y, o: on ? ramp(tt, q.s, q.s + 0.15) * (1 - ramp(tt, hitAt(q), hitAt(q) + 0.15)) : 0,
      nx: n.x, ny: n.y, gap: q.gap,
      ring: d > 0 && d < 0.7 ? { r: 8 + d * 26, o: (1 - d / 0.7) * resetFade } : { r: 8, o: 0 },
      pass: ease(ramp(tt, passAt(q), passAt(q) + 0.3)) * resetFade,
      bx: n.x + q.dx, by: n.y - 17,
    }
  })
  const strong = order.map((l) => {
    const v = Math.max(0, ...quizzes.filter(q => touches(l, q.n)).map(q => ease(ramp(tt, passAt(q), passAt(q) + 0.6))))
    return { x1: brain[l[0]].x, y1: brain[l[0]].y, x2: brain[l[1]].x, y2: brain[l[1]].y, o: v * resetFade }
  }).filter(l => l.o > 0)
  const gd = tt - gh
  const gapFlash = (d => (d > 0 && d < 0.9 ? Math.sin((d / 0.9) * Math.PI) : 0))(gd) * resetFade
  const gapLine = gapLink >= 0 ? { x1: brain[order[gapLink][0]].x, y1: brain[order[gapLink][0]].y, x2: brain[order[gapLink][1]].x, y2: brain[order[gapLink][1]].y } : null

  return {
    parts, conLines, pen, penO, branchPen, vaultO, vaultPos, vaultS, filled, outline, outlineO, bLinks, glow,
    coachO, coachLit, quiz, strong, gapFlash, gapLine,
  }
})

// a quiet night sky behind everything
const stars = Array.from({ length: 46 }, (_, i) => ({ x: rnd() * 980, y: rnd() * 552, r: 0.7 + rnd() * 1.1, d: 3 + rnd() * 4, o: -rnd() * 6, i }))
const brainPath = 'M0 -32 c-22 0 -38 14 -38 32 c0 18 16 32 38 32 c22 0 38 -14 38 -32 c0 -18 -16 -32 -38 -32z M0 -28 v56 M-22 -12 c8 4 8 12 0 16 M22 -12 c-8 4 -8 12 0 16'
</script>

<template>
  <svg class="kt-ccon" :data-t="t.toFixed(2)" viewBox="0 0 980 552" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <radialGradient :id="`kt-ccon-glow-${uid}`">
        <stop offset="0%" class="kt-ccon__glow-in" />
        <stop offset="100%" class="kt-ccon__glow-out" />
      </radialGradient>
      <radialGradient :id="`kt-ccon-pen-${uid}`">
        <stop offset="0%" class="kt-ccon__pen-in" />
        <stop offset="100%" class="kt-ccon__pen-out" />
      </radialGradient>
      <radialGradient :id="`kt-ccon-scrim-${uid}`" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" class="kt-ccon__scrim-in" />
        <stop offset="66%" class="kt-ccon__scrim-in" />
        <stop offset="100%" class="kt-ccon__scrim-out" />
      </radialGradient>
    </defs>

    <!-- night sky -->
    <circle v-for="s in stars" :key="`s${s.i}`" :cx="s.x" :cy="s.y" :r="s.r" class="kt-ccon__star" :style="{ '--d': `${s.d}s`, '--o': `${s.o}s` }" />

    <!-- the scrim keeps the title, subtitle and byline clear -->
    <ellipse cx="320" cy="262" rx="410" ry="250" :fill="`url(#kt-ccon-scrim-${uid})`" />

    <!-- the human, at the edge: the pen comes from here -->
    <g class="kt-ccon__human">
      <circle cx="944" cy="478" r="21" />
      <path d="M888 560 q0 -60 56 -60 q56 0 56 60z" />
    </g>

    <!-- brain: halo and outline -->
    <ellipse :cx="BRAIN.x" :cy="BRAIN.y" rx="170" ry="150" :fill="`url(#kt-ccon-glow-${uid})`" class="kt-ccon__glow" :style="{ opacity: frame.glow }" />
    <g :transform="`translate(${BRAIN.x} ${BRAIN.y}) scale(${BRAIN.s})`" :style="{ opacity: frame.outlineO }">
      <path :d="brainPath" pathLength="100" class="kt-ccon__brain" :style="{ strokeDashoffset: 100 - frame.outline * 100 }" />
    </g>

    <!-- the vault -->
    <g class="kt-ccon__vault" :style="{ opacity: frame.vaultO, transform: `translate(${frame.vaultPos.x}px, ${frame.vaultPos.y}px) scale(${frame.vaultS})` }">
      <circle r="78" :fill="`url(#kt-ccon-glow-${uid})`" :style="{ opacity: 0.25 + frame.filled * 0.75 }" />
      <rect x="-50" y="-58" width="72" height="90" rx="7" class="kt-ccon__doc is-back" />
      <rect x="-42" y="-50" width="72" height="90" rx="7" class="kt-ccon__doc is-back" />
      <rect x="-34" y="-42" width="72" height="90" rx="7" class="kt-ccon__doc" />
      <text x="-24" y="-18" class="kt-ccon__hash">#</text>
      <path d="M-8 -24 h30 M-24 0 h50 M-24 14 h40 M-24 28 h44" class="kt-ccon__lines" />
    </g>
    <text :x="frame.vaultPos.x - 6 * frame.vaultS" :y="frame.vaultPos.y + 76 * frame.vaultS" text-anchor="middle" class="kt-ccon__tag" :style="{ opacity: frame.vaultO }">vault</text>

    <!-- act 4: the coach mark on the vault; it lights up as it sends each challenge -->
    <g :transform="`translate(${COACH.x} ${COACH.y})`" :style="{ opacity: frame.coachO }">
      <circle r="44" :fill="`url(#kt-ccon-pen-${uid})`" :style="{ opacity: frame.coachLit }" />
      <rect x="-17" y="-17" width="34" height="34" rx="9" class="kt-ccon__coach" :style="{ '--lit': frame.coachLit }" />
      <path d="M0 -11 l3.4 7.6 7.6 3.4 -7.6 3.4 -3.4 7.6 -3.4 -7.6 -7.6 -3.4 7.6 -3.4z" class="kt-ccon__spark" :style="{ '--lit': frame.coachLit }" />
      <text y="36" text-anchor="middle" class="kt-ccon__tag is-coach">coach</text>
    </g>

    <!-- constellation lines (the human connecting notes) -->
    <line v-for="(l, i) in frame.conLines" :key="`c${i}`" :x1="l.x1" :y1="l.y1" :x2="l.x2" :y2="l.y2" class="kt-ccon__con" :style="{ opacity: l.o }" />

    <!-- brain links -->
    <line v-for="(l, i) in frame.bLinks" :key="`b${i}`" :x1="l.x1" :y1="l.y1" :x2="l.x2" :y2="l.y2" class="kt-ccon__link" :class="{ 'is-fresh': l.fresh }" :style="{ opacity: l.o }" />

    <!-- act 4: links a challenge passed through get stronger; the gap flashes red -->
    <line v-for="(l, i) in frame.strong" :key="`st${i}`" :x1="l.x1" :y1="l.y1" :x2="l.x2" :y2="l.y2" class="kt-ccon__strong" :style="{ opacity: l.o }" />
    <line v-if="frame.gapLine" :x1="frame.gapLine.x1" :y1="frame.gapLine.y1" :x2="frame.gapLine.x2" :y2="frame.gapLine.y2" class="kt-ccon__gap" :style="{ opacity: frame.gapFlash }" />

    <!-- the particles: note cards that become brain nodes -->
    <g v-for="(p, i) in frame.parts" :key="`p${i}`" :transform="`translate(${p.x} ${p.y})`" :style="{ opacity: p.vis }">
      <g :style="{ opacity: p.card * p.dim }">
        <rect :x="-p.w / 2" :y="-p.h / 2" :width="p.w" :height="p.h" :rx="p.rx" class="kt-ccon__card" :class="{ 'is-lit': p.lit }" />
        <path :d="`M${-p.w / 2 + 5} ${-p.h / 2 + 8} h${p.w - 12} M${-p.w / 2 + 5} ${-p.h / 2 + 14} h${p.w - 10} M${-p.w / 2 + 5} ${-p.h / 2 + 20} h${p.w - 14}`" class="kt-ccon__cardlines" :style="{ opacity: p.card > 0.6 ? 1 : 0 }" />
      </g>
      <circle :r="lerp(3, 6.5, p.node)" class="kt-ccon__node" :style="{ opacity: 1 - p.card }" />
    </g>

    <!-- act 4: challenges from the coach, rings where they hit, a check when the answer holds -->
    <circle v-for="(q, i) in frame.quiz" :key="`r${i}`" :cx="q.nx" :cy="q.ny" :r="q.ring.r" class="kt-ccon__hit" :class="{ 'is-gap': q.gap }" :style="{ opacity: q.ring.o }" />
    <g v-for="(q, i) in frame.quiz" :key="`q${i}`" :transform="`translate(${q.x} ${q.y})`" :style="{ opacity: q.o }">
      <circle r="26" :fill="`url(#kt-ccon-pen-${uid})`" />
      <circle r="13" class="kt-ccon__q" />
      <text y="6" text-anchor="middle" class="kt-ccon__qtext">?</text>
    </g>
    <g v-for="(q, i) in frame.quiz" :key="`k${i}`" :transform="`translate(${q.bx} ${q.by})`" :style="{ opacity: q.pass }">
      <circle r="13" class="kt-ccon__pass" />
      <path d="M-6 0.5 l4 4 l8 -8.5" class="kt-ccon__tick" />
    </g>

    <!-- the pen tip -->
    <g v-if="frame.pen" :transform="`translate(${frame.pen.x} ${frame.pen.y})`" :style="{ opacity: frame.penO }">
      <circle r="30" :fill="`url(#kt-ccon-pen-${uid})`" />
      <circle r="6" class="kt-ccon__pen" />
    </g>
    <g v-for="(b, i) in frame.branchPen" :key="`bp${i}`" :transform="`translate(${b.x} ${b.y})`">
      <circle r="16" :fill="`url(#kt-ccon-pen-${uid})`" />
      <circle r="3.5" class="kt-ccon__pen" />
    </g>
  </svg>
</template>

<style>
.kt-ccon {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  font-family: var(--font-family-sans);
}

.kt-ccon__star {
  fill: var(--kt-subtle);
  opacity: 0.35;
  animation: kt-ccon-twinkle var(--d) ease-in-out infinite alternate;
  animation-delay: var(--o);
}

@keyframes kt-ccon-twinkle {
  from { opacity: 0.15; }
  to { opacity: 0.55; }
}

.kt-ccon__scrim-in { stop-color: var(--kt-bg); stop-opacity: 0.9; }
.kt-ccon__scrim-out { stop-color: var(--kt-bg); stop-opacity: 0; }

.kt-ccon__human {
  fill: var(--kt-tint-primary);
  stroke: var(--kt-c-primary-soft);
  stroke-width: 2;
  opacity: 0.75;
}

.kt-ccon__card {
  fill: var(--kt-card);
  stroke: var(--kt-line-strong);
  stroke-width: 1.5;
}

.kt-ccon__card.is-lit {
  fill: var(--kt-tint-primary);
  stroke: var(--kt-c-primary-soft);
  stroke-width: 2;
}

.kt-ccon__cardlines {
  stroke: var(--kt-subtle);
  stroke-width: 2;
  stroke-linecap: round;
}

.kt-ccon__con {
  stroke: var(--kt-c-primary-soft);
  stroke-width: 2;
  stroke-linecap: round;
}

.kt-ccon__pen { fill: var(--kt-hot); }
.kt-ccon__pen-in { stop-color: var(--kt-hot); stop-opacity: 0.55; }
.kt-ccon__pen-out { stop-color: var(--kt-hot); stop-opacity: 0; }

.kt-ccon__vault { transform-box: view-box; }

.kt-ccon__doc {
  fill: var(--kt-card);
  stroke: var(--kt-c-primary-soft);
  stroke-width: 2;
}

.kt-ccon__doc.is-back { stroke: var(--kt-line-strong); }

.kt-ccon__hash {
  font: 700 18px var(--font-family-mono);
  fill: var(--kt-c-primary-soft);
}

.kt-ccon__lines {
  stroke: var(--kt-subtle);
  stroke-width: 3;
  stroke-linecap: round;
}

.kt-ccon__tag {
  font: 600 14px var(--font-family-mono);
  fill: var(--kt-subtle);
}

.kt-ccon__brain {
  fill: var(--kt-tint-primary);
  fill-opacity: 0.5;
  stroke: var(--kt-c-primary-soft);
  stroke-width: 0.6;
  stroke-linecap: round;
  stroke-dasharray: 100;
  opacity: 0.6;
}

.kt-ccon__link {
  stroke: var(--kt-c-primary-soft);
  stroke-width: 2;
  stroke-linecap: round;
  transition: stroke 0.6s;
}

.kt-ccon__link.is-fresh { stroke: var(--kt-hot); }

.kt-ccon__node {
  fill: color-mix(in srgb, var(--kt-c-primary) 25%, var(--kt-bg));
  stroke: var(--kt-c-primary);
  stroke-width: 2.5;
}

.kt-ccon__glow-in { stop-color: var(--kt-c-primary); stop-opacity: 0.45; }
.kt-ccon__glow-out { stop-color: var(--kt-c-primary); stop-opacity: 0; }

/* act 4: examination */
.kt-ccon__coach {
  fill: color-mix(in srgb, var(--kt-hot) calc(var(--lit, 0) * 22%), var(--kt-tint-primary));
  stroke: color-mix(in srgb, var(--kt-hot) calc(var(--lit, 0) * 100%), var(--kt-c-primary));
  stroke-width: 2;
}
.kt-ccon__spark { fill: color-mix(in srgb, var(--kt-hot) calc(var(--lit, 0) * 100%), var(--kt-c-primary-soft)); }
.kt-ccon__tag.is-coach { font-size: 13px; }
.kt-ccon__strong { stroke: var(--kt-c-primary); stroke-width: 4.6; stroke-linecap: round; }
.kt-ccon__gap { stroke: var(--kt-bad); stroke-width: 4.6; stroke-linecap: round; stroke-dasharray: 6 6; }
.kt-ccon__hit { fill: none; stroke: var(--kt-good); stroke-width: 2.5; }
.kt-ccon__hit.is-gap { stroke: var(--kt-bad); }
.kt-ccon__q { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); stroke-width: 2; }
.kt-ccon__qtext { font-size: 17px; font-weight: 800; fill: var(--kt-hot); }
.kt-ccon__pass { fill: color-mix(in srgb, var(--kt-good) 22%, var(--kt-bg)); stroke: var(--kt-good); stroke-width: 2; }
.kt-ccon__tick { fill: none; stroke: var(--kt-good); stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }

@media (prefers-reduced-motion: reduce) {
  .kt-ccon__star { animation: none; }
}
</style>
