<script setup lang="ts">
import { computed, useId } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * Climb step 2, Group, as `coach group "Building a Second Brain"` runs it (ai-performance-coach domain
 * group.ts, application grouping; kb-template's /climb "Structure" board draws the same thing).
 * Ten of the book's concept notes wait, unsorted, in a tray on the left. The groups are mine: I reuse the ones
 * already in my knowledge base (Capture, Organize: tagged "existing", each holding a concept or two from earlier
 * books, in grey) and create the rest (Distill, Express:
 * "+ new"); here after the book's CODE, top to bottom; each layer in its own color, and the concepts fly into them one by one: green where they
 * belong, red where I put them wrong. Two land wrong (Executive summary in Capture, Hemingway bridge in
 * Organize). Gemma asks about each, as a question (it may ask up to 3 and never proposes a group or a
 * move: grouping's questionAllowed), and I move it myself: it turns green. Then "builds on" arrows run
 * up the stack: each layer builds on the one above it.
 * No props.
 */
const { t, at } = useTimeline(19)
const uid = useId()
const id = (name: string) => `kt-glayers-${name}-${uid}`

const LX = 190 // the layers' left edge
const LW = 690
const LH = 50
const GAP = 24
const CHIP_H = 24
const chipW = (s: string) => s.length * 6.5 + 14
const layers = [
  // `old`: concepts from earlier books, already in an existing group; a new group starts empty
  { name: 'Capture', existing: true, old: ['Commonplace book'], concepts: ['Keep what resonates', '12 favorite problems'] },
  { name: 'Organize', existing: true, old: ['Zettelkasten', 'Johnny Decimal'], concepts: ['PARA', 'Organize for action'] },
  { name: 'Distill', existing: false, old: [] as string[], concepts: ['Distillation', 'Executive summary'] },
  { name: 'Express', existing: false, old: [] as string[], concepts: ['Intermediate packets', 'Archipelago of ideas', 'Hemingway bridge', 'Dial down the scope'] },
  // the existing groups are there from the start; the new ones I create after them
].map((l, i) => ({ ...l, i, y: 28 + i * (LH + GAP), named: l.existing ? 0.5 : 1.2 + (i - 2) * 0.45 }))
const CX = LX + 98 // where a layer's chips start (right of the name)
const TRAY_C = 86 // the tray's chips and label are centered on this x
const oldW = (s: string) => chipW(s) + 10 // a little roomier: their text is lighter and reads wider
const yOf = (l: (typeof layers)[number]) => l.y + (LH - CHIP_H) / 2

// two land in the wrong layer first: red, until Gemma hints and I move them
const WRONG: Record<string, string> = { 'Executive summary': 'Capture', 'Hemingway bridge': 'Organize' }
// the tray: unsorted, as synthesize left them
const order = ['Distillation', 'PARA', 'Hemingway bridge', 'Keep what resonates', 'Executive summary',
  'Intermediate packets', '12 favorite problems', 'Dial down the scope', 'Organize for action', 'Archipelago of ideas']
const FLY0 = 2.4
const FLY_DT = 0.32
const FLY = 0.5
const tray = order.map((title, k) => ({
  title,
  w: chipW(title),
  from: { x: TRAY_C - chipW(title) / 2, y: 28 + k * 29 },
  home: layers.find(l => l.concepts.includes(title))!,
  first: layers.find(l => l.name === (WRONG[title] ?? '')) ?? layers.find(l => l.concepts.includes(title))!,
  fly: FLY0 + k * FLY_DT,
}))
const FLY_END = FLY0 + order.length * FLY_DT + FLY
// hints, not answers: a fact about the concept that points me the right way, never the group's name
const ASK_FOR = 3.0 // each question stays up this long before I move the concept
const MOVE = 0.7
const ASKS = [
  { title: 'Executive summary', q: "An executive summary comes after you've marked up a note.", at: FLY_END + 0.4 },
  { title: 'Hemingway bridge', q: 'A Hemingway bridge is what you leave for your next work session.', at: FLY_END + 0.4 + ASK_FOR + MOVE + 0.2 },
]
const moveAt = (title: string) => (ASKS.find(a => a.title === title)?.at ?? 0) + ASK_FOR
const ease = (p: number) => p * p * (3 - 2 * p)
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const flyP = (c: (typeof tray)[number]) => ease(clamp01((t.value - c.fly) / FLY))
const moveQ = (title: string) => (WRONG[title] ? ease(clamp01((t.value - moveAt(title)) / MOVE)) : 0)

// each layer's row, left to right from the chips area's start: the old concepts, then the layer's own, then a
// wrong one parked at the end until I move it; every slot is fixed, so nothing shifts while they fly
const rows = computed(() => {
  const pos = new Map<string, number>() // `${layer}|${title}` → x
  for (const l of layers) {
    const entries = [
      ...l.old.map(title => ({ title, w: oldW(title) })),
      ...l.concepts.map(title => ({ title, w: chipW(title) })),
      ...tray.filter(c => WRONG[c.title] === l.name).map(c => ({ title: c.title, w: c.w })),
    ]
    let x = CX
    for (const e of entries) {
      pos.set(`${l.name}|${e.title}`, x)
      x += e.w + 6
    }
  }
  return pos
})
const oldChips = computed(() => layers.flatMap(l => l.old.map(title => ({
  title, named: l.named, w: oldW(title), y: yOf(l), x: rows.value.get(`${l.name}|${title}`)!,
}))))
const chips = computed(() => tray.map(c => {
  const p = flyP(c)
  const q = moveQ(c.title)
  const wrong = !!WRONG[c.title]
  const first = { x: rows.value.get(`${c.first.name}|${c.title}`)!, y: yOf(c.first) }
  const to = { x: rows.value.get(`${c.home.name}|${c.title}`)!, y: yOf(c.home) }
  let x = c.from.x + (first.x - c.from.x) * p
  let y = c.from.y + (first.y - c.from.y) * p
  let lift = Math.sin(Math.PI * p)
  if (q > 0) {
    x = first.x + (to.x - first.x) * q
    y = first.y + (to.y - first.y) * q
    lift = Math.sin(Math.PI * q) * 1.6
  }
  const placed = p >= 1
  return { ...c, x, y, lift, placed, state: !placed ? '' : wrong && q < 1 ? 'is-wrong' : 'is-right', asked: wrong && at(ASKS.find(a => a.title === c.title)!.at) && q < 1 }
}))
// Gemma's question shows where the tray was, until I've moved that concept; the last one keeps its text while it fades
const ask = computed(() => ASKS.reduce<(typeof ASKS)[number] | null>((cur, a) => (at(a.at) ? a : cur), null))
const asking = computed(() => ASKS.some(a => at(a.at) && !at(moveAt(a.title) + MOVE + 0.4)))
const ARROWS = ASKS[1].at + ASK_FOR + MOVE + 0.6
const AX = LX + 48 // the builds-on arrows' x
const BOTTOM = layers[3].y + LH
</script>

<template>
  <svg class="kt-glayers" viewBox="0 0 880 380" role="img"
    aria-label="Group, with coach group on Building a Second Brain. Each layer has its own color; a concept turns green in the right layer and red in the wrong one. Executive summary first lands in Capture and Hemingway bridge in Organize, both red; Gemma gives a hint, never the answer: an executive summary comes after you've marked up a note; a Hemingway bridge is what you leave for your next work session; I move each, and it turns green. Ten concept notes wait unsorted: Distillation, PARA, Hemingway bridge, Keep what resonates, Executive summary, Intermediate packets, 12 favorite problems, Dial down the scope, Organize for action, Archipelago of ideas. Capture and Organize already exist in my knowledge base, with concepts from earlier books in them (Commonplace book in Capture; Zettelkasten and Johnny Decimal in Organize), and I reuse them; Distill and Express I create. Top to bottom: Capture, Organize, Distill, Express. Capture gets Keep what resonates and 12 favorite problems; Organize gets PARA and Organize for action; Distill gets Distillation and Executive summary; Express gets Intermediate packets, Archipelago of ideas, Hemingway bridge and Dial down the scope. Each layer builds on the one above it. Gemma gives no answers: it asks up to three questions about my groups and never proposes a group or a move.">
    <defs>
      <marker :id="id('head')" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M1 1 L 9 5 L 1 9" class="kt-glayers__head" />
      </marker>
    </defs>

    <g class="kt-glayers__fade" :class="{ 'is-on': at(0.1) }">
      <text :x="TRAY_C" y="14" text-anchor="middle" class="kt-glayers__label" :class="{ 'is-gone': at(FLY_END) }">the book's concepts</text>
    </g>

    <!-- the layers -->
    <g v-for="l in layers" :key="l.name" class="kt-glayers__fade" :class="{ 'is-on': at(l.named) }">
      <rect :x="LX" :y="l.y" :width="LW" :height="LH" rx="10" class="kt-glayers__layer" :class="`is-l${l.i}`" />
      <text :x="LX + 14" :y="l.y + 25" class="kt-glayers__lname" :class="`is-l${l.i}`">{{ l.name }}</text>
      <text :x="LX + 14" :y="l.y + 40" class="kt-glayers__ltag" :class="{ 'is-new': !l.existing }">{{ l.existing ? 'existing' : '+ new' }}</text>
    </g>
    <!-- builds on: up the stack -->
    <g v-for="l in layers.slice(1)" :key="`a${l.name}`" class="kt-glayers__fade" :class="{ 'is-on': at(ARROWS + (l.i - 1) * 0.25) }">
      <path :d="`M${AX} ${l.y - 2} V ${l.y - GAP + 4}`" class="kt-glayers__wire" :marker-end="`url(#${id('head')})`" />
    </g>

    <!-- concepts from earlier books, already in the existing groups -->
    <g v-for="c in oldChips" :key="c.title" class="kt-glayers__fade" :class="{ 'is-on': at(c.named) }" :transform="`translate(${c.x} ${c.y})`">
      <rect :width="c.w" :height="CHIP_H" rx="12" class="kt-glayers__chip is-old" />
      <text :x="c.w / 2" y="16.5" text-anchor="middle" class="kt-glayers__chiptext is-old">{{ c.title }}</text>
    </g>

    <!-- the concepts: tray → layer -->
    <g v-for="c in chips" :key="c.title" class="kt-glayers__fade" :class="{ 'is-on': at(0.4) }" :transform="`translate(${c.x} ${c.y - 8 * c.lift})`">
      <rect :width="c.w" :height="CHIP_H" rx="12" class="kt-glayers__chip" :class="[c.state, { 'is-asked': c.asked }]" />
      <text :x="c.w / 2" y="16.5" text-anchor="middle" class="kt-glayers__chiptext">{{ c.title }}</text>
    </g>

    <!-- the CLI command that runs it -->
    <g class="kt-glayers__fade" :class="{ 'is-on': at(0.1) }">
      <rect :x="LX + LW / 2 - 205" :y="BOTTOM + 14" width="410" height="44" rx="10" class="kt-glayers__term" />
      <text :x="LX + LW / 2" :y="BOTTOM + 42" text-anchor="middle" class="kt-glayers__cmd"><tspan class="is-dollar">$ </tspan><tspan class="is-prog">coach</tspan> group "Building a Second Brain"</text>
    </g>
    <!-- Gemma's question -->
    <!-- Gemma's question, where the concepts waited before they flew into the layers -->
    <!-- reaches left into the slide's padding: the tray's column alone is too narrow for it -->
    <foreignObject x="-36" y="40" width="212" height="250" class="kt-glayers__fade" :class="{ 'is-on': asking }">
      <div xmlns="http://www.w3.org/1999/xhtml" class="kt-glayers__ask">
        <img src="/images/logos/gemma-mark.png" alt="Gemma" class="kt-glayers__askicon" />
        <p class="kt-glayers__asktext"><span class="is-hint">Hint:</span> {{ ask?.q }}</p>
      </div>
    </foreignObject>
  </svg>
</template>

<style>
.kt-glayers { width: 880px; height: auto; overflow: visible; font-family: var(--font-family-sans); }
.kt-glayers__fade { opacity: 0; transition: opacity 0.35s; }
.kt-glayers__fade.is-on { opacity: 1; }
.kt-glayers__label { font: 600 11px var(--font-family-mono); fill: var(--kt-muted); }
.kt-glayers__term { fill: var(--kt-code-bg); stroke: var(--kt-line-strong); stroke-width: 1.5; }
.kt-glayers__cmd { font: 600 16px var(--font-family-mono); fill: var(--kt-fg); }
.kt-glayers__cmd .is-dollar { fill: var(--kt-muted); }
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
.kt-glayers__ltag { font: 700 10px var(--font-family-mono); fill: var(--kt-muted); }
.kt-glayers__ltag.is-new { fill: var(--kt-good); }
.kt-glayers__lname { font-size: 16px; font-weight: 800; fill: var(--kt-heading); }
.kt-glayers__chip { fill: var(--kt-code-bg); stroke: var(--kt-c-primary-soft); stroke-width: 1.5; transition: stroke 0.3s, fill 0.3s; }
.kt-glayers__chip.is-right { fill: color-mix(in srgb, var(--kt-good) 22%, var(--kt-bg)); stroke: var(--kt-good); stroke-width: 2; }
.kt-glayers__chip.is-wrong { fill: color-mix(in srgb, var(--kt-bad) 24%, var(--kt-bg)); stroke: var(--kt-bad); stroke-width: 2; }
.kt-glayers__chip.is-old { fill: color-mix(in srgb, var(--kt-fg) 8%, var(--kt-bg)); stroke: var(--kt-line-strong); }
.kt-glayers__chiptext.is-old { fill: var(--kt-muted); }
.kt-glayers__chip.is-asked { filter: drop-shadow(0 0 8px var(--kt-bad)); }
.kt-glayers__chiptext { font-size: 11.5px; font-weight: 700; fill: var(--kt-fg); }

.kt-glayers__wire { fill: none; stroke: var(--kt-line-strong); stroke-width: 2; }
.kt-glayers__head { fill: none; stroke: var(--kt-line-strong); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.kt-glayers__label { transition: opacity 0.35s; }
.kt-glayers__label.is-gone { opacity: 0; }
.kt-glayers__ask {
  box-sizing: border-box;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  padding: 16px 18px;
  border: 1.5px solid var(--kt-c-primary);
  border-radius: 10px;
  background: var(--kt-code-bg);
}
.kt-glayers__askicon { width: 34px; height: 34px; }
.kt-glayers__asktext .is-hint { color: var(--kt-hot); }
.kt-glayers__asktext { margin: 0; font-size: 21px; font-weight: 700; line-height: 1.3; color: var(--kt-fg); }
</style>
