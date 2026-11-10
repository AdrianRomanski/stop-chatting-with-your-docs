<script setup lang="ts">
import { computed, useId } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * Climb step 2, Group, as `coach group "Building a Second Brain"` runs it (ai-performance-coach domain
 * group.ts, application grouping; kb-template's /climb "Structure" board draws the same thing).
 * Ten of the book's concept notes wait, unsorted, in a tray on the left. I add four layers and name them
 * (here after the book's CODE, top to bottom: Capture, Organize, Distill, Express; the names are mine to
 * pick), each layer in its own color, and the concepts fly into them one by one: green where they
 * belong, red where I put them wrong. Two land wrong (Executive summary in Capture, Hemingway bridge in
 * Organize). Gemma asks about each, as a question (it may ask up to 3 and never proposes a group or a
 * move: grouping's questionAllowed), and I move it myself: it turns green. Then "builds on" arrows run
 * up the stack: each layer builds on the one above it. I draw one arrow too many, Capture builds on
 * Express: it turns red, a ✕, and the code's cycle check (findCycle) prints the loop; it fades. The
 * rules tick: 2–7 groups, every concept in exactly one, no cycle.
 * No props.
 */
const { t, at } = useTimeline(16.5)
const uid = useId()
const id = (name: string) => `kt-glayers-${name}-${uid}`

const LX = 190 // the layers' left edge
const LW = 690
const LH = 50
const GAP = 24
const CHIP_H = 24
const chipW = (s: string) => s.length * 6.5 + 14
const layers = [
  { name: 'Capture', concepts: ['Keep what resonates', '12 favorite problems'] },
  { name: 'Organize', concepts: ['PARA', 'Organize for action'] },
  { name: 'Distill', concepts: ['Distillation', 'Executive summary'] },
  { name: 'Express', concepts: ['Intermediate packets', 'Archipelago of ideas', 'Hemingway bridge', 'Dial down the scope'] },
].map((l, i) => ({ ...l, i, y: 28 + i * (LH + GAP), named: 0.8 + i * 0.35 }))

// where each concept lands: left to right in its layer
const slots = new Map<string, { x: number; y: number }>()
for (const l of layers) {
  let x = LX + 98
  for (const c of l.concepts) {
    slots.set(c, { x, y: l.y + (LH - CHIP_H) / 2 })
    x += chipW(c) + 6
  }
}
// two land in the wrong layer first: red, until Gemma asks and I move them
const WRONG: Record<string, string> = { 'Executive summary': 'Capture', 'Hemingway bridge': 'Organize' }
const wrongSlot = (title: string) => {
  const l = layers.find(x => x.name === WRONG[title])!
  const x = l.concepts.reduce((acc, c) => acc + chipW(c) + 6, LX + 98)
  return { x, y: l.y + (LH - CHIP_H) / 2 }
}
// the tray: unsorted, as synthesize left them
const order = ['Distillation', 'PARA', 'Hemingway bridge', 'Keep what resonates', 'Executive summary',
  'Intermediate packets', '12 favorite problems', 'Dial down the scope', 'Organize for action', 'Archipelago of ideas']
const FLY0 = 2.4
const FLY_DT = 0.32
const FLY = 0.5
const tray = order.map((title, k) => ({
  title,
  w: chipW(title),
  from: { x: 0, y: 28 + k * 29 },
  first: WRONG[title] ? wrongSlot(title) : slots.get(title)!,
  to: slots.get(title)!,
  fly: FLY0 + k * FLY_DT,
}))
const FLY_END = FLY0 + order.length * FLY_DT + FLY
const ASKS = [
  { title: 'Executive summary', q: 'Is Executive summary something you capture, or distill?', at: FLY_END + 0.4 },
  { title: 'Hemingway bridge', q: 'Is Hemingway bridge about organizing, or expressing?', at: FLY_END + 3.0 },
]
const MOVE = 0.7
const moveAt = (title: string) => (ASKS.find(a => a.title === title)?.at ?? 0) + 1.6
const ease = (p: number) => p * p * (3 - 2 * p)
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const chips = computed(() => tray.map(c => {
  const p = ease(clamp01((t.value - c.fly) / FLY))
  let x = c.from.x + (c.first.x - c.from.x) * p
  let y = c.from.y + (c.first.y - c.from.y) * p
  let lift = Math.sin(Math.PI * p)
  const wrong = !!WRONG[c.title]
  const q = wrong ? ease(clamp01((t.value - moveAt(c.title)) / MOVE)) : 0
  if (q > 0) {
    x = c.first.x + (c.to.x - c.first.x) * q
    y = c.first.y + (c.to.y - c.first.y) * q
    lift = Math.sin(Math.PI * q) * 1.6
  }
  const placed = p >= 1
  return { ...c, x, y, lift, placed, state: !placed ? '' : wrong && q < 1 ? 'is-wrong' : 'is-right', asked: wrong && at(ASKS.find(a => a.title === c.title)!.at) && q < 1 }
}))
const ask = computed(() => ASKS.reduce<(typeof ASKS)[number] | null>((cur, a) => (at(a.at) ? a : cur), null))
const ARROWS = ASKS[1].at + 1.6 + MOVE + 0.6
const CYCLE = ARROWS + 1.0
const RED = CYCLE + 0.6
const GONE = RED + 1.8
const CHECKS = GONE + 0.1
const AX = LX + 48 // the builds-on arrows' x
const BOTTOM = layers[3].y + LH
</script>

<template>
  <svg class="kt-glayers" viewBox="0 0 880 380" role="img"
    aria-label="Group, with coach group on Building a Second Brain. Each layer has its own color; a concept turns green in the right layer and red in the wrong one. Executive summary first lands in Capture and Hemingway bridge in Organize, both red; Gemma asks whether Executive summary is something you capture or distill, and whether Hemingway bridge is about organizing or expressing; I move each, and it turns green. Ten concept notes wait unsorted: Distillation, PARA, Hemingway bridge, Keep what resonates, Executive summary, Intermediate packets, 12 favorite problems, Dial down the scope, Organize for action, Archipelago of ideas. I add four layers and name them, top to bottom: Capture, Organize, Distill, Express. Capture gets Keep what resonates and 12 favorite problems; Organize gets PARA and Organize for action; Distill gets Distillation and Executive summary; Express gets Intermediate packets, Archipelago of ideas, Hemingway bridge and Dial down the scope. Each layer builds on the one above it. One more arrow, Capture building on Express, is refused: the coach prints the cycle. The checks pass: 4 groups, between 2 and 7, every concept in exactly one, no cycle. Gemma asks up to three questions about my layers and never proposes a group.">
    <defs>
      <marker :id="id('head')" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M1 1 L 9 5 L 1 9" class="kt-glayers__head" />
      </marker>
      <marker :id="id('bad')" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M1 1 L 9 5 L 1 9" class="kt-glayers__head is-bad" />
      </marker>
    </defs>

    <g class="kt-glayers__fade" :class="{ 'is-on': at(0.1) }">
      <text x="0" y="14" class="kt-glayers__label">the book's concepts</text>
      <text :x="LX" y="14" class="kt-glayers__label">layers I name · ↑ builds on the one above</text>
      <text x="880" y="14" text-anchor="end" class="kt-glayers__cmd"><tspan class="is-prog">coach</tspan> group "Building a Second Brain"</text>
    </g>

    <!-- the layers -->
    <g v-for="l in layers" :key="l.name" class="kt-glayers__fade" :class="{ 'is-on': at(l.named) }">
      <rect :x="LX" :y="l.y" :width="LW" :height="LH" rx="10" class="kt-glayers__layer" :class="`is-l${l.i}`" />
      <text :x="LX + 14" :y="l.y + 31" class="kt-glayers__lname" :class="`is-l${l.i}`">{{ l.name }}</text>
    </g>
    <!-- builds on: up the stack -->
    <g v-for="l in layers.slice(1)" :key="`a${l.name}`" class="kt-glayers__fade" :class="{ 'is-on': at(ARROWS + (l.i - 1) * 0.25) }">
      <path :d="`M${AX} ${l.y - 2} V ${l.y - GAP + 4}`" class="kt-glayers__wire" :marker-end="`url(#${id('head')})`" />
    </g>
    <!-- one arrow too many: Capture builds on Express, a cycle, refused -->
    <g class="kt-glayers__cycle" :class="{ 'is-on': at(CYCLE), 'is-bad': at(RED), 'is-gone': at(GONE) }">
      <path :d="`M${LX - 4} ${layers[0].y + LH / 2} C ${LX - 56} ${layers[0].y + LH}, ${LX - 56} ${layers[3].y}, ${LX - 6} ${layers[3].y + LH / 2}`"
        class="kt-glayers__wire is-cycle" :marker-end="`url(#${id('bad')})`" />
      <g :transform="`translate(${LX - 42} ${(layers[0].y + BOTTOM) / 2})`">
        <circle r="11" class="kt-glayers__x" />
        <path d="M-4.5 -4.5 l9 9 M4.5 -4.5 l-9 9" class="kt-glayers__xmark" />
      </g>
      <text x="0" :y="BOTTOM + 36" class="kt-glayers__err">cycle: Capture → Express → Distill → Organize → Capture</text>
    </g>

    <!-- the concepts: tray → layer -->
    <g v-for="c in chips" :key="c.title" class="kt-glayers__fade" :class="{ 'is-on': at(0.4) }" :transform="`translate(${c.x} ${c.y - 8 * c.lift})`">
      <rect :width="c.w" :height="CHIP_H" rx="12" class="kt-glayers__chip" :class="[c.state, { 'is-asked': c.asked }]" />
      <text :x="c.w / 2" y="16.5" text-anchor="middle" class="kt-glayers__chiptext">{{ c.title }}</text>
    </g>

    <!-- the rules, checked in code; Gemma's question -->
    <g class="kt-glayers__fade" :class="{ 'is-on': at(CHECKS) }">
      <text x="0" :y="BOTTOM + 36" class="kt-glayers__ok">✓ 4 groups (2–7) · ✓ every concept in one · ✓ no cycle</text>
    </g>
    <g class="kt-glayers__fade" :class="{ 'is-on': ask }">
      <rect x="440" :y="BOTTOM + 14" width="440" height="44" rx="10" class="kt-glayers__ask" />
      <image href="/images/logos/gemma-mark.png" x="452" :y="BOTTOM + 27" width="18" height="18" />
      <text x="478" :y="BOTTOM + 32" class="kt-glayers__asktext">{{ ask?.q }}</text>
      <text x="478" :y="BOTTOM + 49" class="kt-glayers__asksub">Gemma asks · I move it · it never proposes a group</text>
    </g>
  </svg>
</template>

<style>
.kt-glayers { width: 880px; height: auto; overflow: visible; font-family: var(--font-family-sans); }
.kt-glayers__fade { opacity: 0; transition: opacity 0.35s; }
.kt-glayers__fade.is-on { opacity: 1; }
.kt-glayers__label { font: 600 11px var(--font-family-mono); fill: var(--kt-muted); }
.kt-glayers__cmd { font: 500 12px var(--font-family-mono); fill: var(--kt-c-primary-soft); }
.kt-glayers__cmd .is-prog { fill: var(--kt-hot); font-weight: 700; }

.kt-glayers__layer { stroke-width: 2; }
.kt-glayers__layer.is-l0 { fill: color-mix(in srgb, var(--kt-info) 10%, var(--kt-bg)); stroke: var(--kt-info); }
.kt-glayers__layer.is-l1 { fill: color-mix(in srgb, var(--kt-c-primary) 12%, var(--kt-bg)); stroke: var(--kt-c-primary); }
.kt-glayers__layer.is-l2 { fill: color-mix(in srgb, var(--kt-warn) 10%, var(--kt-bg)); stroke: var(--kt-warn); }
.kt-glayers__layer.is-l3 { fill: color-mix(in srgb, var(--kt-hot) 10%, var(--kt-bg)); stroke: var(--kt-hot); }
.kt-glayers__lname.is-l0 { fill: var(--kt-info); }
.kt-glayers__lname.is-l1 { fill: var(--kt-c-primary-soft); }
.kt-glayers__lname.is-l2 { fill: var(--kt-warn); }
.kt-glayers__lname.is-l3 { fill: var(--kt-hot); }
.kt-glayers__lname { font-size: 16px; font-weight: 800; fill: var(--kt-heading); }
.kt-glayers__chip { fill: var(--kt-code-bg); stroke: var(--kt-c-primary-soft); stroke-width: 1.5; transition: stroke 0.3s, fill 0.3s; }
.kt-glayers__chip.is-right { fill: color-mix(in srgb, var(--kt-good) 22%, var(--kt-bg)); stroke: var(--kt-good); stroke-width: 2; }
.kt-glayers__chip.is-wrong { fill: color-mix(in srgb, var(--kt-bad) 24%, var(--kt-bg)); stroke: var(--kt-bad); stroke-width: 2; }
.kt-glayers__chip.is-asked { filter: drop-shadow(0 0 8px var(--kt-bad)); }
.kt-glayers__chiptext { font-size: 11.5px; font-weight: 700; fill: var(--kt-fg); }

.kt-glayers__wire { fill: none; stroke: var(--kt-line-strong); stroke-width: 2; }
.kt-glayers__wire.is-cycle { stroke: var(--kt-c-primary-soft); stroke-dasharray: 5 4; transition: stroke 0.3s; }
.kt-glayers__head { fill: none; stroke: var(--kt-line-strong); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.kt-glayers__head.is-bad { stroke: var(--kt-bad); }
.kt-glayers__cycle { opacity: 0; transition: opacity 0.4s; }
.kt-glayers__cycle.is-on { opacity: 1; }
.kt-glayers__cycle.is-gone { opacity: 0; }
.kt-glayers__cycle.is-bad .kt-glayers__wire.is-cycle { stroke: var(--kt-bad); }
.kt-glayers__x { fill: var(--kt-bad); opacity: 0; transition: opacity 0.3s; }
.kt-glayers__xmark { stroke: var(--kt-bg); stroke-width: 2.4; stroke-linecap: round; opacity: 0; transition: opacity 0.3s; }
.kt-glayers__err { font: 700 12px var(--font-family-mono); fill: var(--kt-bad); opacity: 0; transition: opacity 0.3s; }
.kt-glayers__cycle.is-bad .kt-glayers__x, .kt-glayers__cycle.is-bad .kt-glayers__xmark, .kt-glayers__cycle.is-bad .kt-glayers__err { opacity: 1; }
.kt-glayers__ok { font: 700 12px var(--font-family-mono); fill: var(--kt-good); }
.kt-glayers__ask { fill: var(--kt-code-bg); stroke: var(--kt-c-primary); stroke-width: 1.5; }
.kt-glayers__asktext { font-size: 13px; font-weight: 700; fill: var(--kt-fg); }
.kt-glayers__asksub { font: 600 10.5px var(--font-family-mono); fill: var(--kt-muted); }
</style>
