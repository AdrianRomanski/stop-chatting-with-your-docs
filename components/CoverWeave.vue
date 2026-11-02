<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId } from 'vue'

/**
 * Cover background, variant "the weave": the talk's story in one calm loop.
 * 1. A person at a book: notes peel off it and their pen links them into a small graph.
 * 2. The linked notes slide along a dashed wire into the Markdown vault (bottom right).
 * 3. Challenges ("?") rise from the vault to a brain, whose neurons light up and link one by one.
 * 4. Examination, by two coaches. The sparring partner (local Gemma, bottom right, mirroring the
 *    learner) sends four Socratic challenges, one node at a time; the node answers. Each challenge
 *    plus answer (never the notes: blind) rises to the judge (Gemini Argon, in the cloud, top
 *    right), which comes online for this act. Its verdict lands on the node: a check, and that
 *    node's links thicken (what you retrieve gets stronger); the third verdict finds a gap, the link
 *    flashes red, is redrawn, then passes. Finally the judge schedules the next review.
 * One cycle is CYCLE seconds, then the moving layer fades out and the story starts again.
 * The art stays out of the title block (the strip under the byline and the right ~25%).
 * Reduced motion: the final state (the connected, tested brain with its checks), still.
 */
const uid = useId()
const CYCLE = 19.4
const FINAL = 17.9

const t = ref(FINAL)
let raf = 0
let t0 = 0
function tick(now: number) {
  t.value = ((now - t0) / 1000) % CYCLE
  raf = requestAnimationFrame(tick)
}
onMounted(() => {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (reduced) return
  t0 = performance.now()
  raf = requestAnimationFrame(tick)
})
onBeforeUnmount(() => cancelAnimationFrame(raf))

const clamp = (v: number) => Math.min(1, Math.max(0, v))
const ease = (p: number) => (p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2)
const prog = (start: number, dur: number) => clamp((t.value - start) / dur)
const lerp = (a: number, b: number, p: number) => a + (b - a) * p

// ---- beat 1: the person, the book, the notes they make and link
const book = { x: 146, y: 512 }
const notes = [
  { x: 210, y: 470, r: -6 },
  { x: 272, y: 496, r: 4 },
  { x: 222, y: 524, r: 3 },
  { x: 334, y: 468, r: 7 },
  { x: 330, y: 524, r: -5 },
]
const NOTE_AT = 0.5
const NOTE_STEP = 0.38
const NOTE_DUR = 0.7
// the order the pen draws them: a chain, so the pen mostly flows on
const noteLinks: [number, number][] = [[0, 1], [1, 3], [3, 4], [4, 2], [2, 0], [1, 2]]
const LINK_AT = 2.6
const LINK_STEP = 0.42
const LINK_DUR = 0.38
function bend(a: { x: number; y: number }, b: { x: number; y: number }, k = 0.16) {
  // a slightly curved, hand-drawn stroke: the control point sits off the midpoint
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2
  return { x: mx - (b.y - a.y) * k, y: my + (b.x - a.x) * k }
}
const noteLinkPaths = noteLinks.map(([a, b]) => {
  const c = bend(notes[a], notes[b])
  return { a: notes[a], b: notes[b], c, d: `M${notes[a].x} ${notes[a].y} Q${c.x} ${c.y} ${notes[b].x} ${notes[b].y}` }
})
const quad = (a: number, c: number, b: number, p: number) => (1 - p) ** 2 * a + 2 * (1 - p) * p * c + p * p * b

const noteStyle = computed(() => notes.map((n, i) => {
  const p = ease(prog(NOTE_AT + i * NOTE_STEP, NOTE_DUR))
  const x = lerp(book.x, n.x, p)
  const y = lerp(book.y - 4, n.y, p) - Math.sin(Math.PI * p) * 34
  const s = lerp(0.35, 1, p)
  const r = lerp(0, n.r, p)
  return { transform: `translate(${x}px, ${y}px) rotate(${r}deg) scale(${s})`, opacity: p > 0 ? Math.min(1, p * 3) : 0 }
}))
const linkDraw = computed(() => noteLinks.map((_, i) => ease(prog(LINK_AT + i * LINK_STEP, LINK_DUR))))

// the pen: rests by the book, then follows each stroke as it is drawn
const rest = { x: 124, y: 494 }
const pen = computed(() => {
  const T = t.value
  const first = noteLinkPaths[0]
  const lastEnd = LINK_AT + (noteLinks.length - 1) * LINK_STEP + LINK_DUR
  if (T < LINK_AT - 0.5) return rest
  if (T < LINK_AT) {
    const p = ease(clamp((T - (LINK_AT - 0.5)) / 0.5))
    return { x: lerp(rest.x, first.a.x, p), y: lerp(rest.y, first.a.y, p) }
  }
  if (T > lastEnd) {
    const end = noteLinkPaths[noteLinkPaths.length - 1].b
    const p = ease(clamp((T - lastEnd) / 0.6))
    return { x: lerp(end.x, rest.x, p), y: lerp(end.y, rest.y, p) }
  }
  const k = Math.min(noteLinks.length - 1, Math.floor((T - LINK_AT) / LINK_STEP))
  const local = (T - LINK_AT - k * LINK_STEP)
  const L = noteLinkPaths[k]
  if (local <= LINK_DUR) {
    const p = ease(local / LINK_DUR)
    return { x: quad(L.a.x, L.c.x, L.b.x, p), y: quad(L.a.y, L.c.y, L.b.y, p) }
  }
  // between strokes: glide to the next stroke's start
  const next = noteLinkPaths[Math.min(k + 1, noteLinkPaths.length - 1)]
  const p = ease((local - LINK_DUR) / (LINK_STEP - LINK_DUR))
  return { x: lerp(L.b.x, next.a.x, p), y: lerp(L.b.y, next.a.y, p) }
})
const penWriting = computed(() => t.value > LINK_AT - 0.1 && t.value < LINK_AT + noteLinks.length * LINK_STEP)

// ---- beat 2: the linked notes slide along the wire into the vault
const cluster = { x: 272, y: 497 }
const vault = { x: 826, y: 486 }
const SLIDE_AT = 5.4
const SLIDE_DUR = 2.3
const clusterStyle = computed(() => {
  const p = ease(prog(SLIDE_AT, SLIDE_DUR))
  const dx = (vault.x - cluster.x) * p
  const dy = (vault.y - cluster.y) * p
  const s = lerp(1, 0.3, ease(clamp((p - 0.5) / 0.5)))
  return {
    transform: `translate(${cluster.x + dx}px, ${cluster.y + dy}px) scale(${s}) translate(${-cluster.x}px, ${-cluster.y}px)`,
    opacity: 1 - clamp((p - 0.84) / 0.16),
  }
})
const wireHot = computed(() => t.value > SLIDE_AT - 0.2 && t.value < SLIDE_AT + SLIDE_DUR + 0.2)
const VAULT_IN = SLIDE_AT + SLIDE_DUR
const vaultNew = computed(() => ease(prog(VAULT_IN - 0.15, 0.45)))
const vaultFlash = computed(() => {
  const p = prog(VAULT_IN - 0.1, 1.4)
  return p > 0 && p < 1 ? Math.sin(Math.PI * p) : 0
})

// ---- beat 3: challenges rise to the brain; its network grows, node by node
const brain = { x: 862, y: 252, s: 2.7 }
const chipPath = `M${vault.x} ${vault.y - 34} C ${vault.x} ${vault.y - 74}, ${brain.x - 8} ${brain.y + 140}, ${brain.x - 8} ${brain.y + 84}`
const CHIP_AT = VAULT_IN + 0.1
const CHIP_STEP = 0.5
const CHIP_DUR = 1.0
const chips = [0, 1, 2]
const cp = [
  { x: vault.x, y: vault.y - 34 }, { x: vault.x, y: vault.y - 74 },
  { x: brain.x - 8, y: brain.y + 140 }, { x: brain.x - 8, y: brain.y + 84 },
]
const cubic = (k: 'x' | 'y', p: number) =>
  (1 - p) ** 3 * cp[0][k] + 3 * (1 - p) ** 2 * p * cp[1][k] + 3 * (1 - p) * p * p * cp[2][k] + p ** 3 * cp[3][k]
const chipStyle = computed(() => chips.map((c) => {
  const raw = prog(CHIP_AT + c * CHIP_STEP, CHIP_DUR)
  const p = ease(raw)
  return {
    transform: `translate(${cubic('x', p)}px, ${cubic('y', p)}px)`,
    opacity: raw <= 0 || raw >= 1 ? 0 : Math.min(1, raw * 5, (1 - raw) * 4),
  }
}))

// neurons inside the brain (BrainBuild's layout, scaled up, plus two more)
const nodes = [
  [-56, -47], [-88, 9], [-45, 52], [-27, -2], [18, -45], [38, 16], [88, -4], [65, 56], [4, 61], [-16, 28], [56, -50],
].map(([x, y]) => ({ x: brain.x + x, y: brain.y + y }))
const nodeOrder = [3, 0, 2, 4, 5, 1, 8, 6, 9, 7, 10]
const pairs: [number, number][] = [
  [0, 1], [1, 2], [0, 3], [3, 2], [3, 4], [4, 6], [3, 5], [5, 6], [6, 7], [5, 7], [2, 8], [8, 7], [5, 8],
  [3, 9], [9, 8], [9, 2], [4, 10], [10, 6], [10, 5],
]
const NODE_AT = CHIP_AT + CHIP_DUR - 0.05
const NODE_STEP = 0.24
const nodeTime = nodes.map((_, i) => NODE_AT + nodeOrder.indexOf(i) * NODE_STEP)
const brainLinks = pairs.map(([a, b]) => {
  // drawn from the node that lit first towards the one that just lit
  const [from, to] = nodeTime[a] <= nodeTime[b] ? [a, b] : [b, a]
  const c = bend(nodes[from], nodes[to], 0.1)
  return {
    d: `M${nodes[from].x} ${nodes[from].y} Q${c.x} ${c.y} ${nodes[to].x} ${nodes[to].y}`,
    at: nodeTime[to] + 0.08,
  }
})
const nodeP = computed(() => nodeTime.map(at => prog(at, 0.4)))
const nodeFlash = computed(() => nodeTime.map((at) => {
  const p = prog(at, 0.9)
  return p > 0 && p < 1 ? Math.sin(Math.PI * p) : 0
}))
const brainGrowP = (i: number) => ease(prog(brainLinks[i].at, 0.45))

// ---- beat 4: the sparring partner (local Gemma) asks, the judge (Gemini Argon, cloud) rules
const teacher = { x: 930, y: 472 }
const mark = { x: 889, y: 420 }
const judge = { x: 872, y: 84 }
const ONLINE = 11.2 // connectivity returns: the judge's cloud goes from dashed to solid
const quizzes = [
  { n: 7, s: 11.9, gap: false }, { n: 10, s: 12.8, gap: false }, { n: 9, s: 13.7, gap: true }, { n: 0, s: 14.9, gap: false },
]
type Quiz = typeof quizzes[number]
const Q_DUR = 0.75
const A_DUR = 0.7 // the challenge + answer travelling up to the judge
const hitAt = (q: Quiz) => q.s + Q_DUR
const sendAt = (q: Quiz) => hitAt(q) + 0.15
const verdictAt = (q: Quiz) => sendAt(q) + A_DUR + 0.1
const passAt = (q: Quiz) => verdictAt(q) + (q.gap ? 1.3 : 0.05)
const REVIEW_AT = 17.0
// the blind hand-off: from the answering node up to the cloud, arcing out to the right
const answerPaths = quizzes.map((q) => {
  const n = nodes[q.n]
  const e = { x: judge.x + 20, y: judge.y + 30 }
  const c = { x: Math.max(n.x, e.x) + 50, y: (n.y + e.y) / 2 }
  return { n, c, e }
})
const answerPos = computed(() => quizzes.map((q, i) => {
  const { n, c, e } = answerPaths[i]
  const raw = prog(sendAt(q), A_DUR)
  const k = ease(raw)
  return { x: quad(n.x, c.x, e.x, k), y: quad(n.y, c.y, e.y, k), o: raw <= 0 || raw >= 1 ? 0 : Math.min(1, raw * 6, (1 - raw) * 6) }
}))
const cloudOn = computed(() => ease(prog(ONLINE, 0.6)) * layer.value)
const judgeLit = computed(() => {
  let good = 0
  let bad = 0
  for (const q of quizzes) {
    const d = t.value - (verdictAt(q) - 0.2)
    const v = d > 0 && d < 0.8 ? Math.sin((d / 0.8) * Math.PI) : 0
    if (q.gap) bad = Math.max(bad, v)
    else good = Math.max(good, v)
  }
  return { good: good * layer.value, bad: bad * layer.value }
})
const reviewP = computed(() => ease(prog(REVIEW_AT, 0.5)) * layer.value)
const verdictRing = computed(() => quizzes.map((q) => {
  const d = t.value - verdictAt(q)
  return d > 0 && d < 0.7 ? { r: 8 + d * 26, o: 1 - d / 0.7 } : { r: 8, o: 0 }
}))
const quizCurve = (q: Quiz) => {
  const n = nodes[q.n]
  const s = { x: mark.x, y: mark.y - 14 }
  // arcs out to the right of the brain, then in to its node: aimed, not a stream like beat 3
  const c = { x: Math.max(s.x, n.x) + 46, y: Math.min(s.y, n.y) + 40 }
  return { s, c, n, d: `M${s.x} ${s.y} Q${c.x} ${c.y} ${n.x} ${n.y}` }
}
const quizPaths = quizzes.map(quizCurve)
const quizPos = computed(() => quizzes.map((q, i) => {
  const { s, c, n } = quizPaths[i]
  const k = ease(prog(q.s, Q_DUR))
  const on = t.value > q.s && t.value < hitAt(q) + 0.12
  return { x: quad(s.x, c.x, n.x, k), y: quad(s.y, c.y, n.y, k), o: on ? Math.min(1, (t.value - q.s) / 0.15) : 0, k }
}))
// a faint trace of the aim, drawn behind the challenge and gone soon after the hit
const quizTrail = computed(() => quizzes.map((q, i) => ({
  draw: quizPos.value[i].k,
  o: t.value > q.s ? 0.55 * (1 - clamp((t.value - hitAt(q)) / 0.5)) : 0,
})))
const ringOf = computed(() => quizzes.map((q) => {
  const d = t.value - hitAt(q)
  return d > 0 && d < 0.7 ? { r: 8 + d * 26, o: 1 - d / 0.7 } : { r: 8, o: 0 }
}))
const passP = computed(() => quizzes.map(q => ease(prog(passAt(q), 0.3))))
// the coach's mark lights up as it sends each challenge
const markLit = computed(() => Math.max(0, ...quizzes.map((q) => {
  const d = t.value - (q.s - 0.35)
  return d > 0 && d < 0.75 ? Math.sin((d / 0.75) * Math.PI) : 0
})))
const touches = (i: number, n: number) => pairs[i][0] === n || pairs[i][1] === n
const strong = computed(() => brainLinks.map((_, i) =>
  Math.max(0, ...quizzes.filter(q => touches(i, q.n)).map(q => ease(prog(passAt(q), 0.6))))))
const gapQuiz = quizzes.find(q => q.gap)!
const gapLink = pairs.findIndex((_, i) => touches(i, gapQuiz.n))
const gapFlash = computed(() => {
  const d = t.value - verdictAt(gapQuiz)
  return d > 0 && d < 0.9 ? Math.sin((d / 0.9) * Math.PI) : 0
})
const brainLinkP = computed(() => brainLinks.map((_, i) => {
  const h = verdictAt(gapQuiz)
  if (i === gapLink && t.value > h + 0.35) return ease(prog(h + 0.55, 0.7))
  if (i === gapLink && t.value > h) return 1 - ease(prog(h, 0.35))
  return brainGrowP(i)
}))
const brainGrow = computed(() => prog(NODE_AT, nodeOrder.length * NODE_STEP + 0.5))

// ---- the loop: the moving layer fades in, and out before the reset
const FADE_OUT = 18.3
const layer = computed(() => Math.min(clamp(t.value / 0.4), 1 - clamp((t.value - FADE_OUT) / 0.9)))
const cloudPath = 'M-50 26 A21 21 0 0 1 -42 -12 A30 30 0 0 1 10 -26 A26 26 0 0 1 50 -5 A16 16 0 0 1 50 26 Z'
</script>

<template>
  <svg class="kt-cweave" viewBox="0 0 980 552" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <radialGradient :id="`kt-cweave-glow-${uid}`">
        <stop offset="0%" class="kt-cweave__glow-in" />
        <stop offset="100%" class="kt-cweave__glow-out" />
      </radialGradient>
      <radialGradient :id="`kt-cweave-good-${uid}`">
        <stop offset="0%" class="kt-cweave__good-in" />
        <stop offset="100%" class="kt-cweave__good-out" />
      </radialGradient>
      <radialGradient :id="`kt-cweave-bad-${uid}`">
        <stop offset="0%" class="kt-cweave__bad-in" />
        <stop offset="100%" class="kt-cweave__bad-out" />
      </radialGradient>
    </defs>

    <!-- the stage: always there, dim -->
    <path :d="`M362 497 H ${vault.x - 40}`" class="kt-cweave__wire" :class="{ 'is-hot': wireHot }" />
    <path :d="chipPath" class="kt-cweave__wire is-up" />

    <!-- the person, with a book -->
    <g class="kt-cweave__person">
      <circle cx="66" cy="472" r="18" />
      <path d="M22 548 q0 -48 44 -48 q44 0 44 48z" />
    </g>
    <g class="kt-cweave__book">
      <path :d="`M${book.x} ${book.y + 32} L${book.x - 36} ${book.y + 26} V ${book.y - 4} L${book.x} ${book.y + 2}z`" />
      <path :d="`M${book.x} ${book.y + 32} L${book.x + 36} ${book.y + 26} V ${book.y - 4} L${book.x} ${book.y + 2}z`" />
      <path :d="`M${book.x - 29} ${book.y + 6} l22 3.5 M${book.x - 29} ${book.y + 14} l22 3.5 M${book.x - 29} ${book.y + 22} l14 2 M${book.x + 7} ${book.y + 9.5} l22 -3.5 M${book.x + 7} ${book.y + 17.5} l22 -3.5`" class="kt-cweave__booklines" />
    </g>

    <!-- the judge: Gemini Argon in the cloud, dashed (offline) until connectivity returns -->
    <g :style="{ transform: `translate(${judge.x}px, ${judge.y}px)` }">
      <circle r="70" :fill="`url(#kt-cweave-good-${uid})`" :style="{ opacity: judgeLit.good }" />
      <circle r="70" :fill="`url(#kt-cweave-bad-${uid})`" :style="{ opacity: judgeLit.bad }" />
      <path :d="cloudPath" class="kt-cweave__cloud is-off" :style="{ opacity: 1 - cloudOn }" />
      <path :d="cloudPath" class="kt-cweave__cloud" :style="{ opacity: cloudOn }" />
      <image href="/images/logos/gemini-mark.png" x="-42" y="-13" width="26" height="25" :style="{ opacity: 0.45 + 0.55 * cloudOn }" />
      <text x="-10" y="6" class="kt-cweave__name" :style="{ opacity: 0.45 + 0.55 * cloudOn }">Argon</text>
      <text x="0" y="-36" text-anchor="middle" class="kt-cweave__tag is-role">JUDGE · CLOUD</text>
      <g :style="{ opacity: reviewP, transform: `translateY(${(1 - reviewP) * -6}px)` }">
        <rect x="-90" y="36" width="180" height="26" rx="13" class="kt-cweave__review" />
        <path d="M-77 43 h12 v12 h-12z M-77 47 h12 M-73.5 41 v3 M-68.5 41 v3" class="kt-cweave__cal" />
        <text x="-58" y="54" class="kt-cweave__tag is-review">next review · 3d</text>
      </g>
    </g>

    <!-- the sparring partner (local Gemma), mirroring the learner; its mark lights when it asks -->
    <g class="kt-cweave__person">
      <circle :cx="teacher.x" :cy="teacher.y" r="18" />
      <path :d="`M${teacher.x + 44} 548 q0 -48 -44 -48 q-44 0 -44 48z`" />
    </g>
    <g class="kt-cweave__mark" :style="{ transform: `translate(${mark.x}px, ${mark.y}px) scale(${1 + 0.12 * markLit * layer})` }">
      <circle r="26" :fill="`url(#kt-cweave-glow-${uid})`" :style="{ opacity: markLit * layer }" />
      <rect x="-20" y="-20" width="40" height="40" rx="10" class="kt-cweave__badge" />
      <rect x="-20" y="-20" width="40" height="40" rx="10" class="kt-cweave__badge is-lit" :style="{ opacity: markLit * layer }" />
      <image href="/images/logos/gemma-mark.png" x="-18" y="-18" width="36" height="36" class="kt-cweave__logo" />
    </g>
    <!-- labels sit left of the vault → brain path, so the challenges never cross them -->
    <text :x="mark.x - 82" :y="mark.y - 4" text-anchor="end" class="kt-cweave__name is-small">Gemma</text>
    <text :x="mark.x - 82" :y="mark.y + 13" text-anchor="end" class="kt-cweave__tag is-role">SPARRING PARTNER · LOCAL</text>

    <!-- the vault -->
    <g class="kt-cweave__vault">
      <rect :x="vault.x - 30" :y="vault.y - 18" width="44" height="54" rx="5" class="kt-cweave__under" />
      <rect :x="vault.x - 30" :y="vault.y - 18" width="44" height="54" rx="5" class="kt-cweave__card" />
      <rect :x="vault.x - 24" :y="vault.y - 24" width="44" height="54" rx="5" class="kt-cweave__under" />
      <rect :x="vault.x - 24" :y="vault.y - 24" width="44" height="54" rx="5" class="kt-cweave__card" />
      <g :style="{ opacity: layer * vaultNew, transform: `translateY(${(1 - vaultNew) * -16}px)` }">
        <rect :x="vault.x - 18" :y="vault.y - 30" width="44" height="54" rx="5" class="kt-cweave__under" />
        <rect :x="vault.x - 18" :y="vault.y - 30" width="44" height="54" rx="5" class="kt-cweave__card is-new" />
        <text :x="vault.x - 11" :y="vault.y - 12" class="kt-cweave__hash">#</text>
        <path :d="`M${vault.x - 11} ${vault.y + 2} h30 M${vault.x - 11} ${vault.y + 11} h22`" class="kt-cweave__lines" />
      </g>
      <circle :cx="vault.x" :cy="vault.y" r="46" :fill="`url(#kt-cweave-glow-${uid})`" :style="{ opacity: vaultFlash * layer }" />
      <text :x="vault.x - 2" :y="vault.y + 56" text-anchor="middle" class="kt-cweave__tag">.md vault</text>
    </g>

    <!-- the brain -->
    <circle :cx="brain.x" :cy="brain.y" r="150" :fill="`url(#kt-cweave-glow-${uid})`" class="kt-cweave__halo"
      :style="{ opacity: (0.25 + 0.75 * brainGrow) * layer + 0.2 * (1 - layer) }" />
    <g :transform="`translate(${brain.x} ${brain.y}) scale(${brain.s})`" class="kt-cweave__brain">
      <path d="M0 -32 c-22 0 -38 14 -38 32 c0 18 16 32 38 32 c22 0 38 -14 38 -32 c0 -18 -16 -32 -38 -32z" />
      <path d="M0 -28 v56" class="kt-cweave__mid" />
    </g>

    <!-- the moving layer: one story per cycle -->
    <g :style="{ opacity: layer }">
      <!-- beat 1 + 2: the note graph, then the whole graph slides into the vault -->
      <g :style="clusterStyle">
        <path v-for="(l, i) in noteLinkPaths" :key="`nl${i}`" :d="l.d" pathLength="1" class="kt-cweave__ink"
          :style="{ strokeDashoffset: 1 - linkDraw[i], opacity: linkDraw[i] > 0 ? 1 : 0 }" />
        <g v-for="(n, i) in notes" :key="`n${i}`" :style="noteStyle[i]">
          <rect x="-16" y="-20" width="32" height="40" rx="5" class="kt-cweave__under" />
          <rect x="-16" y="-20" width="32" height="40" rx="5" class="kt-cweave__card" />
          <text x="-9" y="-5" class="kt-cweave__hash is-small">#</text>
          <path d="M1 -9 h8 M-9 3 h18 M-9 11 h12" class="kt-cweave__lines is-small" />
        </g>
      </g>

      <!-- beat 3: challenges rise, neurons light and link -->
      <g v-for="(c, i) in chips" :key="`c${i}`" class="kt-cweave__chip" :style="chipStyle[i]">
        <circle r="14" />
        <text y="6" text-anchor="middle">?</text>
      </g>
      <path v-for="(l, i) in brainLinks" :key="`bl${i}`" :d="l.d" pathLength="1" class="kt-cweave__synapse"
        :style="{ strokeDashoffset: 1 - brainLinkP[i], opacity: brainLinkP[i] > 0 ? 1 : 0 }" />
      <!-- beat 4: links through a tested node get stronger; the gap flashes red -->
      <path v-for="(l, i) in brainLinks" :key="`st${i}`" :d="l.d" class="kt-cweave__strong" :style="{ opacity: strong[i] }" />
      <path v-if="gapLink >= 0" :d="brainLinks[gapLink].d" class="kt-cweave__gap" :style="{ opacity: gapFlash }" />
      <g v-for="(n, i) in nodes" :key="`bn${i}`" :style="{ transform: `translate(${n.x}px, ${n.y}px)` }">
        <circle r="16" class="kt-cweave__spark" :style="{ opacity: nodeFlash[i] * 0.7, transform: `scale(${0.6 + nodeFlash[i] * 0.6})` }" />
        <circle r="7" class="kt-cweave__node" :style="{ opacity: nodeP[i], transform: `scale(${0.4 + 0.6 * nodeP[i]})` }" />
      </g>

      <!-- beat 4: the teacher's challenges, one node at a time -->
      <path v-for="(qp, i) in quizPaths" :key="`qt${i}`" :d="qp.d" pathLength="1" class="kt-cweave__aim"
        :style="{ strokeDasharray: `${quizTrail[i].draw} 1`, opacity: quizTrail[i].o }" />
      <circle v-for="(q, i) in quizzes" :key="`qr${i}`" :cx="nodes[q.n].x" :cy="nodes[q.n].y" :r="ringOf[i].r"
        class="kt-cweave__hit is-answer" :style="{ opacity: ringOf[i].o }" />
      <circle v-for="(q, i) in quizzes" :key="`qv${i}`" :cx="nodes[q.n].x" :cy="nodes[q.n].y" :r="verdictRing[i].r"
        class="kt-cweave__hit" :class="{ 'is-gap': q.gap }" :style="{ opacity: verdictRing[i].o }" />
      <!-- blind: only the challenge and your answer travel to the judge -->
      <g v-for="(q, i) in quizzes" :key="`qa${i}`" :style="{ transform: `translate(${answerPos[i].x}px, ${answerPos[i].y}px)`, opacity: answerPos[i].o }">
        <rect x="-11" y="-8" width="22" height="16" rx="4" class="kt-cweave__answer" />
        <path d="M-6 -2 h12 M-6 3 h8" class="kt-cweave__answerlines" />
      </g>
      <g v-for="(q, i) in quizzes" :key="`qq${i}`" :style="{ transform: `translate(${quizPos[i].x}px, ${quizPos[i].y}px)`, opacity: quizPos[i].o }">
        <circle r="13" class="kt-cweave__q" />
        <text y="6" text-anchor="middle" class="kt-cweave__qtext">?</text>
      </g>
      <g v-for="(q, i) in quizzes" :key="`qk${i}`"
        :style="{ transform: `translate(${nodes[q.n].x + 17}px, ${nodes[q.n].y - 17}px) scale(${0.6 + 0.4 * passP[i]})`, opacity: passP[i] }">
        <circle r="13" class="kt-cweave__pass" />
        <path d="M-6 0.5 l4 4 l8 -8.5" class="kt-cweave__tick" />
      </g>
    </g>

    <!-- the pen: stays with the person across the reset -->
    <g :style="{ transform: `translate(${pen.x}px, ${pen.y}px)` }" class="kt-cweave__pen" :class="{ 'is-writing': penWriting }">
      <g transform="rotate(32)">
        <path d="M0 0 l-4 -9 h8z" class="kt-cweave__nib" />
        <rect x="-4" y="-38" width="8" height="29" rx="2" class="kt-cweave__penbody" />
      </g>
    </g>
  </svg>
</template>

<style>
.kt-cweave {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  font-family: var(--font-family-sans);
}

.kt-cweave__wire {
  fill: none;
  stroke: var(--kt-c-primary-soft);
  stroke-width: 1.5;
  stroke-dasharray: 5 7;
  opacity: 0.3;
  transition: opacity 0.4s;
  animation: kt-cweave-flow 1.4s linear infinite;
}

.kt-cweave__wire.is-hot { opacity: 0.75; }

@keyframes kt-cweave-flow {
  to { stroke-dashoffset: -24; }
}

.kt-cweave__person circle,
.kt-cweave__person path {
  fill: var(--kt-tint-primary);
  stroke: var(--kt-c-primary-soft);
  stroke-width: 2.2;
}

.kt-cweave__book path {
  fill: var(--kt-card);
  stroke: var(--kt-c-primary-soft);
  stroke-width: 1.8;
  stroke-linejoin: round;
}

.kt-cweave__book .kt-cweave__booklines {
  fill: none;
  stroke: var(--kt-subtle);
  stroke-width: 1.6;
  stroke-linecap: round;
}

.kt-cweave__under { fill: var(--kt-bg); }

.kt-cweave__card {
  fill: var(--kt-card);
  stroke: var(--kt-line-strong);
  stroke-width: 1.5;
}

.kt-cweave__card.is-new { stroke: var(--kt-c-primary-soft); }

.kt-cweave__hash {
  font: 700 13px var(--font-family-mono);
  fill: var(--kt-c-primary-soft);
}

.kt-cweave__lines {
  fill: none;
  stroke: var(--kt-subtle);
  stroke-width: 3;
  stroke-linecap: round;
}

.kt-cweave__lines.is-small { stroke-width: 2.4; }
.kt-cweave__hash.is-small { font-size: 11px; }

.kt-cweave__tag {
  font: 13px var(--font-family-mono);
  fill: var(--kt-subtle);
}

.kt-cweave__ink {
  fill: none;
  stroke: var(--kt-hot);
  stroke-width: 2.8;
  stroke-linecap: round;
  stroke-dasharray: 1;
}

.kt-cweave__nib { fill: var(--kt-hot); }

.kt-cweave__penbody {
  fill: var(--kt-tint-secondary);
  stroke: var(--kt-hot);
  stroke-width: 1.6;
}

.kt-cweave__pen { opacity: 0.8; }
.kt-cweave__pen.is-writing { opacity: 1; }

.kt-cweave__chip circle {
  fill: var(--kt-tint-secondary);
  stroke: var(--kt-hot);
  stroke-width: 2;
}

.kt-cweave__chip text {
  font-size: 17px;
  font-weight: 800;
  fill: var(--kt-hot);
}

.kt-cweave__glow-in { stop-color: var(--kt-c-primary); stop-opacity: 0.5; }
.kt-cweave__glow-out { stop-color: var(--kt-c-primary); stop-opacity: 0; }

.kt-cweave__brain path {
  fill: var(--kt-tint-primary);
  stroke: var(--kt-c-primary-soft);
  stroke-width: 0.9;
  stroke-linecap: round;
}

.kt-cweave__brain .kt-cweave__mid {
  fill: none;
  stroke: var(--kt-line-strong);
  stroke-dasharray: 1.5 2.5;
  stroke-width: 0.6;
}

.kt-cweave__synapse {
  fill: none;
  stroke: var(--kt-c-primary-soft);
  stroke-width: 2.6;
  stroke-linecap: round;
  stroke-dasharray: 1;
}

.kt-cweave__node {
  fill: color-mix(in srgb, var(--kt-c-primary) 25%, var(--kt-bg));
  stroke: var(--kt-c-primary);
  stroke-width: 2.6;
}

.kt-cweave__spark { fill: var(--kt-c-primary-soft); }

/* beat 4: examination (CoverBrainStage's visual language) */
.kt-cweave__badge { fill: var(--kt-tint-primary); stroke: var(--kt-c-primary-soft); stroke-width: 2; }
.kt-cweave__badge.is-lit { fill: color-mix(in srgb, var(--kt-c-primary) 30%, var(--kt-bg)); stroke: var(--kt-c-primary); }
.kt-cweave__sparkle { fill: var(--kt-c-primary-soft); }
.kt-cweave__sparkle.is-lit { fill: var(--kt-hot); }
.kt-cweave__aim { fill: none; stroke: var(--kt-hot); stroke-width: 1.6; stroke-linecap: round; }
.kt-cweave__strong { fill: none; stroke: var(--kt-c-primary); stroke-width: 4.6; stroke-linecap: round; }
.kt-cweave__gap { fill: none; stroke: var(--kt-bad); stroke-width: 4.6; stroke-linecap: round; stroke-dasharray: 6 6; }
.kt-cweave__hit { fill: none; stroke: var(--kt-good); stroke-width: 2.5; }
.kt-cweave__hit.is-gap { stroke: var(--kt-bad); }
.kt-cweave__q { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); stroke-width: 2; }
.kt-cweave__qtext { font-size: 17px; font-weight: 800; fill: var(--kt-hot); }
.kt-cweave__pass { fill: color-mix(in srgb, var(--kt-good) 22%, var(--kt-bg)); stroke: var(--kt-good); stroke-width: 2; }
.kt-cweave__tick { fill: none; stroke: var(--kt-good); stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }

/* beat 4: the two coaches */
.kt-cweave__cloud { fill: var(--kt-tint-primary); stroke: var(--kt-c-primary-soft); stroke-width: 2; stroke-linejoin: round; }
.kt-cweave__cloud.is-off { fill: none; stroke: var(--kt-line-strong); stroke-dasharray: 5 6; }
.kt-cweave__name { font-size: 16px; font-weight: 700; fill: var(--kt-heading); }
.kt-cweave__name.is-small { font-size: 18px; }
.kt-cweave__logo { filter: brightness(1.35) saturate(1.1); }
.kt-scheme-light .kt-cweave__logo { filter: brightness(0.72) saturate(1.4); }
.kt-scheme-light .kt-cweave__tag.is-role { fill: var(--kt-cool); }
.kt-cweave__tag.is-role { font-size: 15px; font-weight: 700; letter-spacing: 0.03em; fill: var(--kt-c-primary-soft); }
.kt-cweave__tag.is-review { font-size: 14px; font-weight: 700; fill: var(--kt-good); }
.kt-cweave__review { fill: color-mix(in srgb, var(--kt-good) 14%, var(--kt-bg)); stroke: var(--kt-good); stroke-width: 1.5; }
.kt-cweave__cal { fill: none; stroke: var(--kt-good); stroke-width: 1.4; stroke-linecap: round; }
.kt-cweave__answer { fill: var(--kt-tint-primary); stroke: var(--kt-c-primary); stroke-width: 1.8; }
.kt-cweave__answerlines { fill: none; stroke: var(--kt-c-primary-soft); stroke-width: 1.8; stroke-linecap: round; }
.kt-cweave__hit.is-answer { stroke: var(--kt-c-primary-soft); }
.kt-cweave__good-in { stop-color: var(--kt-good); stop-opacity: 0.4; }
.kt-cweave__good-out { stop-color: var(--kt-good); stop-opacity: 0; }
.kt-cweave__bad-in { stop-color: var(--kt-bad); stop-opacity: 0.4; }
.kt-cweave__bad-out { stop-color: var(--kt-bad); stop-opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .kt-cweave__wire { animation: none; }
}
</style>
