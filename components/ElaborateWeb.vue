<script setup lang="ts">
import { computed } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * Climb step 5, Elaborate, set against step 4, Retrieve, on the concept the talk follows: Distillation.
 * The speaker's framing (vault note "Climbing"): Retrieve looks inward, is it in my head? Elaborate looks
 * outward, how does it fit into my world?
 * 1. The concept note, in the middle.
 * 2. Left, Retrieve: one thread from the note into my head, a dot runs in: "is it in my head?"
 * 3. Right, Elaborate: three threads grow out of the note, one per question of `coach elaborate`
 *    (ai-performance-coach ADR-0041, domain elaborate.ts): why → a reason ("because…"), like → another
 *    note ([[Executive summary]]), use → a project (this talk, under 1.Projects). A dot runs out along each.
 * 4. At the foot, Make It Stick on elaboration: it "multiplies the mental cues available to you for later
 *    recall" (p. 207, as quoted in ADR-0041).
 * No props.
 */
const { t, at } = useTimeline(7)

const B = { note: 0.2, retrieve: 0.7, elaborate: 2.3, quote: 5.9 }
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const ease = (v: number) => 1 - (1 - v) ** 3

// the note, in the middle
const N = { x: 350, y: 122, w: 180, h: 54 }
const NCY = N.y + N.h / 2

// Retrieve: my head on the left, one thread into it
const HEAD = { cx: 120, cy: NCY, r: 34 }
const THREAD = { from: N.x, to: HEAD.cx + HEAD.r + 4 }
const RUN_IN: [number, number] = [B.retrieve + 0.7, B.retrieve + 1.5]
const inDot = computed(() => {
  const p = ease(clamp01((t.value - RUN_IN[0]) / (RUN_IN[1] - RUN_IN[0])))
  return { x: THREAD.from + (THREAD.to - THREAD.from) * p, on: t.value >= RUN_IN[0] && t.value < RUN_IN[1] + 0.2 }
})

// Elaborate: three threads out, to three nodes on the right
const NODE = { x: 612, w: 268, h: 40 }
const outs = [
  { kind: 'why', text: 'a reason: “because …”', link: false },
  { kind: 'like', text: '[[Executive summary]]', link: true },
  { kind: 'use', text: '1.Projects: this talk', link: true },
].map((o, i) => {
  const cy = 90 + i * 58
  const grow = B.elaborate + 0.4 + i * 0.6
  const x0 = N.x + N.w
  const x1 = NODE.x
  const mid = (x0 + x1) / 2
  return { ...o, i, cy, grow, d: `M${x0} ${NCY} C ${mid} ${NCY}, ${mid} ${cy}, ${x1} ${cy}`, p: [x0, NCY, mid, NCY, mid, cy, x1, cy] }
})
const RUN_OUT = B.elaborate + 2.4
function bez(p: number[], s: number) {
  const u = 1 - s
  const x = u ** 3 * p[0] + 3 * u * u * s * p[2] + 3 * u * s * s * p[4] + s ** 3 * p[6]
  const y = u ** 3 * p[1] + 3 * u * u * s * p[3] + 3 * u * s * s * p[5] + s ** 3 * p[7]
  return { x, y }
}
const outDots = computed(() => outs.map((o) => {
  const start = RUN_OUT + o.i * 0.15
  const s = ease(clamp01((t.value - start) / 0.9))
  return { ...bez(o.p, s), on: t.value >= start && t.value < start + 1.1, k: o.kind }
}))
</script>

<template>
  <svg class="kt-eweb" viewBox="0 0 880 330" role="img"
    aria-label="Retrieve looks in, Elaborate looks out, on the Distillation concept note. Left, Retrieve: one thread from the note into my head: is it in my head? Right, Elaborate: three threads out of the note, one per question of coach elaborate. Why leads to a reason, because. Like leads to another note, Executive summary. Use leads to a project, this talk. Each one is one more way back to the idea. At the foot, Make It Stick: elaboration multiplies the mental cues available to you for later recall, page 207.">
    <!-- ── Retrieve: looks in ── -->
    <g class="kt-eweb__fade" :class="{ 'is-on': at(B.retrieve) }">
      <text :x="HEAD.cx + 115" y="34" text-anchor="middle" class="kt-eweb__kicker">retrieve · looks in</text>
      <circle :cx="HEAD.cx" :cy="HEAD.cy" :r="HEAD.r + 4" class="kt-eweb__headring" :class="{ 'is-hit': at(RUN_IN[1]) }" />
      <image href="/images/speaker.webp" :x="HEAD.cx - HEAD.r" :y="HEAD.cy - HEAD.r" :width="HEAD.r * 2" :height="HEAD.r * 2" :clip-path="`circle(${HEAD.r}px)`" />
      <text :x="HEAD.cx" :y="HEAD.cy + HEAD.r + 26" text-anchor="middle" class="kt-eweb__small">from memory</text>
    </g>
    <path :d="`M${THREAD.from} ${NCY} H ${THREAD.to}`" pathLength="1" class="kt-eweb__thread is-in" :class="{ 'is-on': at(B.retrieve + 0.2) }" />
    <text :x="(THREAD.from + THREAD.to) / 2" :y="NCY - 14" text-anchor="middle" class="kt-eweb__label kt-eweb__fade" :class="{ 'is-on': at(B.retrieve + 0.5) }">is it in my head?</text>
    <circle :cx="inDot.x" :cy="NCY" r="5" class="kt-eweb__dot is-in" :class="{ 'is-on': inDot.on }" />

    <!-- ── the note ── -->
    <g class="kt-eweb__fade" :class="{ 'is-on': at(B.note) }">
      <rect :x="N.x" :y="N.y" :width="N.w" :height="N.h" rx="12" class="kt-eweb__note" />
      <path :d="`M${N.x + 22} ${NCY - 10} l 9 10 l -9 10 l -9 -10 z`" class="kt-eweb__diamond" />
      <text :x="N.x + 40" :y="NCY - 1" class="kt-eweb__ntitle">Distillation</text>
      <text :x="N.x + 40" :y="NCY + 16" class="kt-eweb__small">concept note</text>
    </g>

    <!-- ── Elaborate: looks out ── -->
    <text :x="NODE.x + NODE.w / 2" y="34" text-anchor="middle" class="kt-eweb__kicker is-hot kt-eweb__fade" :class="{ 'is-on': at(B.elaborate) }">elaborate · looks out</text>
    <g v-for="o in outs" :key="o.kind">
      <path :d="o.d" pathLength="1" class="kt-eweb__thread is-out" :class="{ 'is-on': at(o.grow) }" />
      <g class="kt-eweb__node" :class="{ 'is-on': at(o.grow + 0.35) }">
        <rect :x="NODE.x" :y="o.cy - NODE.h / 2" :width="NODE.w" :height="NODE.h" rx="10" class="kt-eweb__nodebox" />
        <rect :x="NODE.x + 10" :y="o.cy - 11" width="52" height="22" rx="11" class="kt-eweb__chip" />
        <text :x="NODE.x + 36" :y="o.cy + 4.5" text-anchor="middle" class="kt-eweb__chiptext">{{ o.kind }}</text>
        <text :x="NODE.x + 74" :y="o.cy + 5" class="kt-eweb__nodetext" :class="{ 'is-link': o.link }">{{ o.text }}</text>
      </g>
    </g>
    <circle v-for="d in outDots" :key="d.k" :cx="d.x" :cy="d.y" r="5" class="kt-eweb__dot is-out" :class="{ 'is-on': d.on }" />
    <text :x="NODE.x + NODE.w / 2" y="246" text-anchor="middle" class="kt-eweb__label kt-eweb__fade" :class="{ 'is-on': at(RUN_OUT + 1.2) }">three more ways back to the idea</text>

    <!-- ── Make It Stick, at the foot ── -->
    <g class="kt-eweb__fade" :class="{ 'is-on': at(B.quote) }">
      <image href="/images/books/make-it-stick.jpg" x="196" y="270" width="36" height="54" preserveAspectRatio="xMidYMid slice" />
      <text x="248" y="294" class="kt-eweb__quote">“multiplies the mental cues available to you for later recall”</text>
      <text x="248" y="316" class="kt-eweb__small">Make It Stick · Brown, Roediger, McDaniel · p. 207</text>
    </g>
  </svg>
</template>

<style>
.kt-eweb { width: 880px; height: auto; overflow: visible; font-family: var(--font-family-sans); }
.kt-eweb__fade { opacity: 0; transition: opacity 0.4s; }
.kt-eweb__fade.is-on { opacity: 1; }

.kt-eweb__kicker { font: 700 13px var(--font-family-mono); letter-spacing: 0.14em; text-transform: uppercase; fill: var(--kt-muted); }
.kt-eweb__kicker.is-hot { fill: var(--kt-hot); }
.kt-eweb__small { font: 600 11px var(--font-family-mono); fill: var(--kt-muted); }
.kt-eweb__label { font: 600 13px var(--font-family-mono); fill: var(--kt-subtle); }

.kt-eweb__note { fill: var(--kt-code-bg); stroke: var(--kt-hot); stroke-width: 1.8; }
.kt-eweb__diamond { fill: color-mix(in srgb, var(--kt-hot) 35%, var(--kt-bg)); stroke: var(--kt-hot); stroke-width: 1.6; }
.kt-eweb__ntitle { font-size: 17px; font-weight: 800; fill: var(--kt-heading); }

.kt-eweb__headring { fill: none; stroke: var(--kt-line-strong); stroke-width: 2; transition: stroke 0.3s; }
.kt-eweb__headring.is-hit { stroke: var(--kt-c-primary); }

.kt-eweb__thread { fill: none; stroke-width: 2.2; stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 0.6s ease-out; }
.kt-eweb__thread.is-on { stroke-dashoffset: 0; }
.kt-eweb__thread.is-in { stroke: var(--kt-c-primary); }
.kt-eweb__thread.is-out { stroke: var(--kt-hot); }

.kt-eweb__dot { opacity: 0; transition: opacity 0.15s; }
.kt-eweb__dot.is-on { opacity: 1; }
.kt-eweb__dot.is-in { fill: var(--kt-c-primary); }
.kt-eweb__dot.is-out { fill: var(--kt-hot); }

.kt-eweb__node { opacity: 0; transform: translateX(-8px); transition: opacity 0.35s, transform 0.35s; }
.kt-eweb__node.is-on { opacity: 1; transform: none; }
.kt-eweb__nodebox { fill: var(--kt-card); stroke: var(--kt-card-line); stroke-width: 1.4; }
.kt-eweb__chip { fill: color-mix(in srgb, var(--kt-hot) 16%, var(--kt-bg)); stroke: var(--kt-hot); stroke-width: 1.2; }
.kt-eweb__chiptext { font: 800 11px var(--font-family-mono); fill: var(--kt-hot); }
.kt-eweb__nodetext { font-size: 14px; font-weight: 700; fill: var(--kt-heading); }
.kt-eweb__nodetext.is-link { fill: var(--kt-cool); font-family: var(--font-family-mono); font-size: 13px; }

.kt-eweb__quote { font-size: 17px; font-weight: 700; font-style: italic; fill: var(--kt-heading); }

@media (prefers-reduced-motion: reduce) {
  .kt-eweb * { transition: none !important; }
}
</style>
