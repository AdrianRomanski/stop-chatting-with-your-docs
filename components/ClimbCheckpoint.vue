<script setup lang="ts">
import { computed, useId } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * Where the concept stands on the climb (MasteryStairs) after a phase of the talk, and what that phase gave it.
 * 1. the seven steps, dim, with Synthesize between Read and Group: not one of the climb's steps in the code
 *    (coach synthesize is the bridge that makes the concept notes the climb runs on), so it is a block of its
 *    own with the concept's diamond, in hot. The ones done light up in their book's color (Read Second Brain
 *    blue, Group..Space Make It Stick green, Teach yellow) and I hop up block by block onto the last one done;
 *    the next one gets a dashed "next"
 * 2. no terminal: the stairs, the books under them and what the phase gave carry it
 * 3. what the phase gave: either rows (`gained`), one at a time, or a trail of cards (`flow`), left to right,
 *    each with a little page: raw text → read (my notes) → distilled (bold, highlight) → ◆ concept note; with
 *    `never` a dashed arc runs under the cards from the first to the last, crossed: never straight from it
 * Props:
 * - `done`: how many of the climb's seven steps are done, from the bottom (1 = Read)
 * - `synthesized`: the concept note exists (default true: a checkpoint always follows a concept)
 * - `concept`: the concept note's title, as `coach climb` prints it
 * - `gained`: rows of what the phase gave; `step` names the step it came from (or 'concept' for the note)
 * - `flow`: cards { kind: raw | read | distill | concept, title, lines, via? }; replaces `gained`. `via` names
 *   the bridge into the card: a wide pink arrow with its name on a pill and the command under it
 *   (`via: 'synthesize'` on the concept card: coach synthesize turns the distilled marks into the concept)
 * - `never`: the label on the crossed arc under the flow
 * - `books`: under the stairs, which book each step comes from, as brackets: Building a Second Brain over
 *   Read, the bridge, Group and Generate (synthesize the concepts, connect them); Make It Stick over Group to
 *   Space; Richard Feynman's Mental Models (the Protégé Effect) under Teach. The two books overlap on Group and
 *   Generate. Under the steps that question in a coaching style (Retrieve, Elaborate, Space: spar, study,
 *   elaborate), the styles' books: The Socratic Method, Feynman's Mental Models. Under everything, Tomorrowmind:
 *   a concept from it in every step, and the spark for the app. `books` alone shows only the stretch already
 *   climbed; `books="all"` shows every book, whole. `covers` puts each book's cover beside its name.
 */
type Gain = { step: string; text: string }
type Card = { kind: 'raw' | 'read' | 'distill' | 'concept'; title: string; lines: string[]; via?: string }
const props = withDefaults(defineProps<{
  done: number; concept: string; synthesized?: boolean; gained?: Gain[]; flow?: Card[]; never?: string; books?: boolean | 'all'; covers?: boolean
}>(), { synthesized: true, gained: () => [], flow: () => [], books: false, covers: false })

const NAMES = ['Read', 'Group', 'Generate', 'Retrieve', 'Elaborate', 'Space', 'Teach']
const BOOK = (k: number) => (k === 0 ? 'basb' : k === 6 ? 'teach' : 'mis')

const GROUND = 150
const COL = 101
const W = 92
// the blocks: the seven steps (k = the step's index in the code), Synthesize slotted in after Read
const blocks = [
  { name: 'Read', k: 0 },
  { name: 'Synthesize', k: -1 },
  ...NAMES.slice(1).map((name, i) => ({ name, k: i + 1 })),
].map((b, i) => ({
  ...b,
  i,
  x: 60 + i * COL,
  top: 116 - i * 14,
  book: b.k < 0 ? 'synth' : BOOK(b.k),
  done: b.k < 0 ? props.synthesized : b.k < props.done,
}))
const lastBlock = blocks.reduce((m, b) => (b.done ? b.i : m), -1)
const BOOK_ROW = props.covers ? 58 : 20
const COVER = { w: 34, h: 50 }
// which book each block comes from; only the stretch already climbed shows, and empty rows close up
const bookList = [
  { name: 'Building a Second Brain', from: 0, to: 3, row: 0, key: 'basb', end: false, covers: ['building-a-second-brain.webp'] },
  { name: "Richard Feynman's Mental Models", from: 7, to: 7, row: 0, key: 'teach', end: true, covers: ['richard-feynmans-mental-models.jpg'] },
  { name: 'Make It Stick', from: 2, to: 6, row: 1, key: 'mis', end: false, covers: ['make-it-stick.jpg'] },
  { name: "styles: The Socratic Method · Feynman's Mental Models", from: 4, to: 6, row: 2, key: 'style', end: true, covers: ['the-socratic-method.jpg', 'richard-feynmans-mental-models.jpg'] },
  { name: 'Tomorrowmind', from: 0, to: 7, row: 3, key: 'tm', end: false, covers: ['tomorrowmind.webp'] },
]
  .filter(b => props.books && (props.books === 'all' || b.from <= lastBlock))
  .map(b => ({ ...b, to: props.books === 'all' ? b.to : Math.min(b.to, lastBlock) }))
const usedRows = [...new Set(bookList.map(b => b.row))].sort()
const placed = bookList.map(b => {
  const x1 = 60 + b.from * COL + 4
  const x2 = 60 + b.to * COL + W - 4
  const coversW = props.covers ? b.covers.length * (COVER.w + 6) : 0
  // the covers sit at the label's start: after x1, or before the label when it ends at x2
  const labelW = b.name.length * (props.covers ? 7.6 : 6.6)
  const coverX = b.end ? x2 - labelW - coversW - 2 : x1 + 6
  return {
    ...b, x1, x2,
    y: GROUND + 12 + usedRows.indexOf(b.row) * BOOK_ROW,
    coverX,
    textX: b.end ? x2 : x1 + 6 + coversW + (props.covers ? 4 : 0),
  }
})
// with books, a climbed block takes the colors of the books over it, as vertical stripes (Read: Building a
// Second Brain blue, Tomorrowmind white; Group: blue, Make It Stick green, white; …)
const BOOK_ORDER = ['basb', 'mis', 'style', 'teach', 'tm']
const stripes = (i: number) => BOOK_ORDER.filter(k => placed.some(b => b.key === k && b.from <= i && i <= b.to))
const striped = blocks.map(b => {
  const keys = stripes(b.i)
  return { i: b.i, keys, stops: keys.flatMap((k, j) => [{ k, o: j / keys.length }, { k, o: (j + 1) / keys.length }]) }
})
const BOOKS_H = usedRows.length ? usedRows.length * BOOK_ROW + 8 : 0
const TY = GROUND + 16 + BOOKS_H // what the phase gave starts here
const nextBlock = blocks.find(b => !b.done)?.i ?? -1
const next = props.done < NAMES.length ? props.done : -1

const HOP = 0.7
const HOP_FOR = 0.45
const HOP_DT = 0.55
const LIT = (i: number) => HOP + i * HOP_DT + HOP_FOR // a block lights as I land on it
const CMD = Math.max(1.9, LIT(lastBlock) + 0.4)
const OUT = CMD + 0.9
const GAIN = OUT + 0.9
const CARD_DT = 0.55
const NEVER = GAIN + props.flow.length * CARD_DT + 0.3
const { t, at } = useTimeline(Math.max(GAIN + props.gained.length * 0.45, NEVER) + 0.8)

// the flow: four cards under the terminal, arrows between them
const FY = TY + 4
const GAP = 30
const VIA_GAP = 120
const CH = 86
const gaps = props.flow.map((c, i) => (i === 0 ? 0 : c.via ? VIA_GAP : GAP))
const CW = (864 - gaps.reduce((a, b) => a + b, 0)) / Math.max(1, props.flow.length)
const cards = computed(() => props.flow.map((c, i) => ({
  ...c, i, gap: gaps[i], x: 8 + i * CW + gaps.slice(0, i + 1).reduce((a, b) => a + b, 0),
})))
const booksRows = placed
const H = props.flow.length ? FY + CH + (props.never ? 48 : 12) : TY + 8 + props.gained.length * 40
const uid = useId()
const face = `kt-climbcp-face-${uid}`

// I start on the ground left of the stairs and hop block by block onto the last one done
const START = { x: 28, y: GROUND - 22 }
const stops = [START, ...blocks.slice(0, lastBlock + 1).map(b => ({ x: b.x + W / 2, y: b.top - 22 }))]
const me = computed(() => {
  let pos = stops[0]
  for (let i = 0; i < stops.length - 1; i++) {
    const p = Math.min(1, Math.max(0, (t.value - HOP - i * HOP_DT) / HOP_FOR))
    if (p <= 0) break
    const a = stops[i]
    const b = stops[i + 1]
    pos = { x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p - 40 * Math.sin(Math.PI * p) }
  }
  return pos
})

</script>

<template>
  <svg class="kt-climbcp" :class="{ 'has-covers': covers }" :viewBox="`0 0 880 ${H}`" role="img"
    :aria-label="`The climb of ${concept}: ${blocks.map(b => (b.done ? 'done ' : 'open ') + b.name).join(', ')}. Synthesize, between Read and Group, makes the concept note. I stand on ${blocks[lastBlock]?.name ?? 'the ground'}. What this phase gave: ${[...gained.map(g => g.text), ...flow.map(c => `${c.title}, ${c.lines.join(' ')}`)].join('; ')}.${never ? ` ${never}.` : ''}`">
    <defs>
      <clipPath :id="face" clipPathUnits="objectBoundingBox"><circle cx="0.5" cy="0.5" r="0.5" /></clipPath>
      <linearGradient v-for="g in striped.filter(g => g.keys.length)" :id="`${face}-st${g.i}`" :key="g.i" x1="0" y1="0" x2="1" y2="0">
        <stop v-for="(st, j) in g.stops" :key="j" :offset="st.o" class="kt-climbcp__stop" :class="`is-${st.k}`" />
      </linearGradient>
    </defs>

    <!-- the stairs -->
    <path :d="`M8 ${GROUND} H 872`" class="kt-climbcp__ground" />
    <g v-for="b in blocks" :key="b.name">
      <rect :x="b.x" :y="b.top" :width="W" :height="GROUND - b.top" rx="9" class="kt-climbcp__step"
        :class="[striped[b.i].keys.length ? 'is-books' : `is-${b.book}`, { 'is-lit': b.done && at(LIT(b.i)), 'is-next': b.i === nextBlock && at(OUT) }]" />
      <!-- the books' colors over a climbed block: a tinted fill and an outline in stripes -->
      <g v-if="striped[b.i].keys.length" class="kt-climbcp__striped" :class="{ 'is-lit': b.done && at(LIT(b.i)) }">
        <rect :x="b.x" :y="b.top" :width="W" :height="GROUND - b.top" rx="9" :fill="`url(#${face}-st${b.i})`" class="kt-climbcp__stfill" />
        <rect :x="b.x" :y="b.top" :width="W" :height="GROUND - b.top" rx="9" fill="none" :stroke="`url(#${face}-st${b.i})`" class="kt-climbcp__stline" />
      </g>
      <text :x="b.x + 8" :y="b.top + 20" class="kt-climbcp__name" :class="{ 'is-open': !b.done }">{{ b.name }}</text>
      <text v-if="b.i === nextBlock" :x="b.x + 8" :y="b.top + 38" class="kt-climbcp__next" :class="{ 'is-on': at(OUT) }">next</text>
      <g v-if="b.k < 0">
        <text :x="b.x + 8" :y="b.top + 38" class="kt-climbcp__bridgetag" :class="{ 'is-lit': b.done && at(LIT(b.i)) }">bridge</text>
        <path :d="`M${b.x + W - 18} ${b.top + 25} l 7 8 l -7 8 l -7 -8 z`" class="kt-climbcp__bridge"
          :class="{ 'is-lit': b.done && at(LIT(b.i)) }" />
      </g>
    </g>

    <!-- which book each step comes from -->
    <g v-for="b in booksRows" :key="b.name" class="kt-climbcp__fade" :class="{ 'is-on': at(CMD - 0.3) }">
      <path :d="`M${b.x1} ${b.y - 6} V ${b.y} H ${b.x2} V ${b.y - 6}`" class="kt-climbcp__bracket" :class="`is-${b.key}`" />
      <template v-if="covers">
        <g v-for="(c, k) in b.covers" :key="c">
          <rect :x="b.coverX + k * (COVER.w + 6) + 2" :y="b.y + 6" :width="COVER.w" :height="COVER.h" rx="3" class="kt-climbcp__covershadow" />
          <image :href="`/images/books/${c}`" :x="b.coverX + k * (COVER.w + 6)" :y="b.y + 4" :width="COVER.w" :height="COVER.h" preserveAspectRatio="xMidYMid slice" />
          <rect :x="b.coverX + k * (COVER.w + 6)" :y="b.y + 4" :width="COVER.w" :height="COVER.h" rx="2" class="kt-climbcp__cover" />
        </g>
      </template>
      <text :x="b.textX" :y="b.y + (covers ? 33 : 13)" :text-anchor="b.end ? 'end' : 'start'" class="kt-climbcp__book" :class="`is-${b.key}`">{{ b.name }}</text>
    </g>

    <!-- me -->
    <g class="kt-climbcp__me" :class="{ 'is-on': at(0.2) }">
      <circle :cx="me.x" :cy="me.y" r="23" class="kt-climbcp__glow" />
      <image href="/images/speaker.webp" :x="me.x - 19" :y="me.y - 19" width="38" height="38" :clip-path="`url(#${face})`"
        preserveAspectRatio="xMidYMid slice" />
      <circle :cx="me.x" :cy="me.y" r="19" class="kt-climbcp__ring" />
    </g>


    <!-- what this phase gave -->
    <g v-for="(g, i) in gained" :key="g.text" class="kt-climbcp__gain" :class="{ 'is-on': at(GAIN + i * 0.45) }">
      <rect x="8" :y="TY + 8 + i * 40" width="864" height="32" rx="8" class="kt-climbcp__row" :class="`is-${g.step}`" />
      <text x="24" :y="TY + 29 + i * 40" class="kt-climbcp__tag" :class="`is-${g.step}`">{{ g.step === 'concept' ? '◆ concept' : `✓ ${g.step}` }}</text>
      <text x="150" :y="TY + 29 + i * 40" class="kt-climbcp__text">{{ g.text }}</text>
    </g>

    <!-- or the trail: what I made, left to right -->
    <g v-if="never" class="kt-climbcp__fade" :class="{ 'is-on': at(NEVER) }">
      <path :d="`M${cards[0].x + CW / 2} ${FY + CH + 2} C ${cards[0].x + CW / 2} ${FY + CH + 46}, ${cards[cards.length - 1].x + CW / 2} ${FY + CH + 46}, ${cards[cards.length - 1].x + CW / 2} ${FY + CH + 2}`"
        class="kt-climbcp__never" />
      <rect x="290" :y="FY + CH + 22" width="300" height="26" rx="13" class="kt-climbcp__neverpill" />
      <text x="440" :y="FY + CH + 40" text-anchor="middle" class="kt-climbcp__nevertext">✗ {{ never }}</text>
    </g>
    <g v-for="c in cards" :key="c.title" class="kt-climbcp__gain" :class="{ 'is-on': at(GAIN + c.i * CARD_DT) }">
      <path v-if="c.i > 0" :d="`M${c.x - c.gap + 4} ${FY + CH / 2} H ${c.x - 6}`" class="kt-climbcp__arrow" :class="{ 'is-via': c.via }" />
      <path v-if="c.i > 0" :d="`M${c.x - 13} ${FY + CH / 2 - 6} L ${c.x - 5} ${FY + CH / 2} L ${c.x - 13} ${FY + CH / 2 + 6}`" class="kt-climbcp__arrow" :class="{ 'is-via': c.via }" />
      <g v-if="c.via">
        <rect :x="c.x - c.gap / 2 - 50" :y="FY + CH / 2 - 12" width="94" height="24" rx="12" class="kt-climbcp__viapill" />
        <text :x="c.x - c.gap / 2 - 3" :y="FY + CH / 2 + 4.5" text-anchor="middle" class="kt-climbcp__via">{{ c.via }}</text>
        <text :x="c.x - c.gap / 2 - 3" :y="FY + CH / 2 + 28" text-anchor="middle" class="kt-climbcp__viacmd is-hot">creates</text>
        <text :x="c.x - c.gap / 2 - 3" :y="FY + CH / 2 + 41" text-anchor="middle" class="kt-climbcp__viacmd is-hot">concepts</text>
        <text :x="c.x - c.gap / 2 - 3" :y="FY + CH / 2 - 20" text-anchor="middle" class="kt-climbcp__viacmd is-hot">bridge</text>
      </g>
      <rect :x="c.x" :y="FY" :width="CW" :height="CH" rx="10" class="kt-climbcp__card" :class="`is-${c.kind}`" />
      <!-- the little page -->
      <g v-if="c.kind !== 'concept'">
        <rect :x="c.x + 12" :y="FY + 16" width="40" height="54" rx="3" class="kt-climbcp__page" />
        <rect v-for="j in 6" :key="j" :x="c.x + 18" :y="FY + 20 + j * 7" :width="j % 3 === 0 ? 18 : 28" height="2.5" rx="1"
          class="kt-climbcp__pline" :class="{ 'is-bold': c.kind === 'distill' && (j === 2 || j === 3) }" />
        <rect v-if="c.kind === 'distill'" :x="c.x + 16" :y="FY + 39" width="24" height="7" rx="1.5" class="kt-climbcp__hl" />
        <rect v-if="c.kind === 'read'" :x="c.x + 34" :y="FY + 48" width="24" height="26" rx="3" class="kt-climbcp__note" />
        <path v-if="c.kind === 'read'" :d="`M${c.x + 38} ${FY + 56} h 15 M${c.x + 38} ${FY + 62} h 11 M${c.x + 38} ${FY + 68} h 13`" class="kt-climbcp__noteline" />
      </g>
      <path v-else :d="`M${c.x + 32} ${FY + 18} L ${c.x + 54} ${FY + 43} L ${c.x + 32} ${FY + 68} L ${c.x + 10} ${FY + 43} Z`" class="kt-climbcp__diamond" />
      <text :x="c.x + 62" :y="FY + 32" class="kt-climbcp__ctitle" :class="`is-${c.kind}`">{{ c.title }}</text>
      <text v-for="(l, j) in c.lines" :key="l" :x="c.x + 62" :y="FY + 52 + j * 16" class="kt-climbcp__cline">{{ l }}</text>
    </g>
  </svg>
</template>

<style>
.kt-climbcp { width: 880px; height: auto; overflow: visible; }
.kt-climbcp__ground { stroke: var(--kt-line-strong); stroke-width: 2; }

.kt-climbcp__step {
  fill: color-mix(in srgb, var(--kt-fg) 4%, var(--kt-bg));
  stroke: var(--kt-line-strong);
  stroke-width: 1.5;
  transition: fill 0.4s, stroke 0.4s;
}
.kt-climbcp__step.is-lit.is-basb { fill: color-mix(in srgb, var(--kt-info) 22%, var(--kt-bg)); stroke: var(--kt-info); stroke-width: 2; }
.kt-climbcp__step.is-lit.is-mis { fill: color-mix(in srgb, var(--kt-good) 22%, var(--kt-bg)); stroke: var(--kt-good); stroke-width: 2; }
.kt-climbcp__step.is-lit.is-teach { fill: color-mix(in srgb, var(--kt-warn) 26%, var(--kt-bg)); stroke: var(--kt-warn); stroke-width: 2; }
.kt-climbcp__step.is-next { stroke: var(--kt-c-primary-soft); stroke-dasharray: 6 5; stroke-width: 2; }
.kt-climbcp__step.is-lit.is-synth { fill: color-mix(in srgb, var(--kt-hot) 20%, var(--kt-bg)); stroke: var(--kt-hot); stroke-width: 2; }
.kt-climbcp__bridge { fill: none; stroke: var(--kt-line-strong); stroke-width: 1.8; transition: fill 0.4s, stroke 0.4s; }
.kt-climbcp__bridge.is-lit { fill: color-mix(in srgb, var(--kt-hot) 40%, var(--kt-bg)); stroke: var(--kt-hot); }
.kt-climbcp__bridgetag { font: 700 12px var(--font-family-mono); fill: var(--kt-muted); transition: fill 0.4s; }
.kt-climbcp__bridgetag.is-lit { fill: var(--kt-hot); }
.kt-climbcp__name { font-size: 14px; font-weight: 800; fill: var(--kt-heading); }
.kt-climbcp__name.is-open { fill: var(--kt-muted); }
.kt-climbcp__next { font: 700 12px var(--font-family-mono); fill: var(--kt-c-primary-soft); opacity: 0; transition: opacity 0.3s; }
.kt-climbcp__next.is-on { opacity: 1; }

.kt-climbcp__me { opacity: 0; transition: opacity 0.3s; }
.kt-climbcp__me.is-on { opacity: 1; }
.kt-climbcp__glow { fill: color-mix(in srgb, var(--kt-c-primary) 25%, transparent); }
.kt-climbcp__ring { fill: none; stroke: var(--kt-c-primary-soft); stroke-width: 3; }

.kt-climbcp__fade { opacity: 0; transition: opacity 0.3s; }
.kt-climbcp__fade.is-on { opacity: 1; }
.kt-climbcp__term { fill: var(--kt-code-bg); stroke: var(--kt-card-line); stroke-width: 1.5; }
.kt-climbcp__dot { fill: var(--kt-line-strong); }
.kt-climbcp__label { font: 600 11px var(--font-family-mono); fill: var(--kt-muted); }
.kt-climbcp__mono { font: 500 13px var(--font-family-mono); fill: var(--kt-fg); white-space: pre; }
.kt-climbcp__prompt { fill: var(--kt-muted); }
.kt-climbcp__prog { fill: var(--kt-hot); font-weight: 700; }
.kt-climbcp__args { fill: var(--kt-c-primary-soft); }
.kt-climbcp__title { fill: var(--kt-heading); font-weight: 700; }
.kt-climbcp__mono .is-done { fill: var(--kt-good); font-weight: 700; }
.kt-climbcp__mono .is-teach { fill: var(--kt-warn); font-weight: 700; }
.kt-climbcp__mono .is-open, .kt-climbcp__mono.is-open { fill: var(--kt-muted); }

.kt-climbcp__gain { opacity: 0; transform: translateY(6px); transition: opacity 0.35s, transform 0.35s; }
.kt-climbcp__gain.is-on { opacity: 1; transform: none; }
.kt-climbcp__row { fill: color-mix(in srgb, var(--kt-fg) 4%, var(--kt-bg)); stroke: var(--kt-card-line); stroke-width: 1; }
.kt-climbcp__row.is-read { stroke: var(--kt-info); }
.kt-climbcp__row.is-concept { stroke: var(--kt-hot); }
.kt-climbcp__row.is-group, .kt-climbcp__row.is-generate, .kt-climbcp__row.is-retrieve, .kt-climbcp__row.is-space { stroke: var(--kt-good); }
.kt-climbcp__bracket { fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
.kt-climbcp__bracket.is-basb { stroke: var(--kt-info); }
.kt-climbcp__bracket.is-mis { stroke: var(--kt-good); }
.kt-climbcp__bracket.is-teach { stroke: var(--kt-warn); }
.kt-climbcp__book { font: 700 11px var(--font-family-mono); }
.kt-climbcp.has-covers .kt-climbcp__book { font-size: 12.5px; }
.kt-climbcp__covershadow { fill: var(--kt-bg); opacity: 0.6; }
.kt-climbcp__book.is-basb { fill: var(--kt-info); }
.kt-climbcp__book.is-mis { fill: var(--kt-good); }
.kt-climbcp__book.is-teach { fill: var(--kt-warn); }
.kt-climbcp__cover { fill: none; stroke: var(--kt-line-strong); stroke-width: 1; }
.kt-climbcp__striped { opacity: 0; transition: opacity 0.4s; }
.kt-climbcp__striped.is-lit { opacity: 1; }
.kt-climbcp__stfill { opacity: 0.42; }
.kt-climbcp__stline { stroke-width: 3; }
.kt-climbcp__stop.is-basb { stop-color: var(--kt-info); }
.kt-climbcp__stop.is-mis { stop-color: var(--kt-good); }
.kt-climbcp__stop.is-style { stop-color: var(--kt-warn); }
.kt-climbcp__stop.is-teach { stop-color: var(--kt-warn); }
.kt-climbcp__stop.is-tm { stop-color: var(--kt-heading); }
.kt-climbcp__bracket.is-style { stroke: var(--kt-warn); }
.kt-climbcp__book.is-style { fill: var(--kt-warn); }
.kt-climbcp__bracket.is-tm { stroke: var(--kt-heading); }
.kt-climbcp__book.is-tm { fill: var(--kt-heading); }
.kt-climbcp__tag { font: 800 13px var(--font-family-mono); fill: var(--kt-good); }
.kt-climbcp__tag.is-read { fill: var(--kt-info); }
.kt-climbcp__tag.is-concept { fill: var(--kt-hot); }
.kt-climbcp__text { font-size: 15px; fill: var(--kt-fg); }

/* the trail */
.kt-climbcp__card { fill: color-mix(in srgb, var(--kt-fg) 4%, var(--kt-bg)); stroke: var(--kt-card-line); stroke-width: 1.5; }
.kt-climbcp__card.is-read { stroke: var(--kt-info); }
.kt-climbcp__card.is-distill { stroke: var(--kt-warn); }
.kt-climbcp__card.is-concept { stroke: var(--kt-hot); stroke-width: 2; fill: color-mix(in srgb, var(--kt-hot) 10%, var(--kt-bg)); }
.kt-climbcp__page { fill: var(--kt-bg); stroke: var(--kt-line-strong); stroke-width: 1.2; }
.kt-climbcp__pline { fill: var(--kt-muted); opacity: 0.6; }
.kt-climbcp__pline.is-bold { fill: var(--kt-heading); opacity: 1; height: 3.5px; }
.kt-climbcp__hl { fill: var(--kt-warn); opacity: 0.55; }
.kt-climbcp__note { fill: color-mix(in srgb, var(--kt-info) 30%, var(--kt-bg)); stroke: var(--kt-info); stroke-width: 1.2; }
.kt-climbcp__noteline { stroke: var(--kt-info); stroke-width: 1.6; stroke-linecap: round; }
.kt-climbcp__diamond { fill: color-mix(in srgb, var(--kt-hot) 30%, var(--kt-bg)); stroke: var(--kt-hot); stroke-width: 2; }
.kt-climbcp__ctitle { font-size: 15px; font-weight: 800; fill: var(--kt-heading); }
.kt-climbcp__ctitle.is-raw { fill: var(--kt-muted); }
.kt-climbcp__ctitle.is-read { fill: var(--kt-info); }
.kt-climbcp__ctitle.is-distill { fill: var(--kt-warn); }
.kt-climbcp__ctitle.is-concept { fill: var(--kt-hot); }
.kt-climbcp__cline { font-size: 12.5px; fill: var(--kt-fg); }
.kt-climbcp__arrow { fill: none; stroke: var(--kt-line-strong); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.kt-climbcp__arrow.is-via { stroke: var(--kt-hot); stroke-width: 3; }
.kt-climbcp__viapill { fill: color-mix(in srgb, var(--kt-hot) 22%, var(--kt-bg)); stroke: var(--kt-hot); stroke-width: 1.5; }
.kt-climbcp__via { font: 800 12.5px var(--font-family-mono); fill: var(--kt-heading); }
.kt-climbcp__viacmd { font: 600 10.5px var(--font-family-mono); fill: var(--kt-muted); }
.kt-climbcp__viacmd.is-hot { fill: var(--kt-hot); font-weight: 800; letter-spacing: 0.06em; }
.kt-climbcp__never { fill: none; stroke: var(--kt-bad); stroke-width: 2; stroke-dasharray: 6 6; opacity: 0.8; }
.kt-climbcp__neverpill { fill: var(--kt-bg); stroke: var(--kt-bad); stroke-width: 1.5; }
.kt-climbcp__nevertext { font: 700 13px var(--font-family-mono); fill: var(--kt-bad); }
</style>
