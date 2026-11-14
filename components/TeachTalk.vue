<script setup lang="ts">
import { computed, useId } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * The payoff of the climb (MasteryStairs, ClimbCheckpoint): the last step, Teach, is this talk, given at
 * GDG DevFest Wrocław 2026, in a lecture hall at Uniwersytet Ekonomiczny (Komandorska 118/120, Wrocław).
 * 1. On the projector screen, the stairs of ClimbCheckpoint (Read, the Synthesize bridge, Group … Space, Teach)
 *    light up block by block as I hop up them; on Teach (the Protégé Effect, yellow) a flag and confetti,
 *    and under its name "this talk".
 * 2. Below the screen, the hall: stepped rows of seats (rows A–C, two aisles), people in them;
 *    row by row they light up warm: the students. "the students: you".
 * 3. At the foot, the GDG logo with DevFest Wrocław, and the venue.
 * No props.
 */
const { t, at } = useTimeline(7)
const uid = useId()
const face = `kt-teachtalk-face-${uid}`
const crop = `kt-teachtalk-crop-${uid}`

// the screen and the climb on it
const SCREEN = { x: 22, y: 0, w: 836, h: 172 }
const GROUND = 154
const COL = 98
const W = 88
const blocks = ['Read', 'Synthesize', 'Group', 'Generate', 'Retrieve', 'Elaborate', 'Space', 'Teach'].map((name, i) => ({
  name,
  i,
  x: 52 + i * COL,
  top: 126 - i * 14,
  kind: i === 0 ? 'basb' : i === 1 ? 'synth' : i === 7 ? 'teach' : 'mis',
}))
// each block in the colors of the books over it (as on the "Six steps up the climb" ClimbCheckpoint): Building a Second Brain
// blue, Make It Stick green, the styles' books yellow, Feynman's Mental Models yellow, Tomorrowmind white
const BOOKS: [string, number, number][] = [['basb', 0, 3], ['mis', 2, 6], ['style', 4, 6], ['teach', 7, 7], ['tm', 0, 7]]
const striped = blocks.map(b => {
  const keys = BOOKS.filter(([, from, to]) => from <= b.i && b.i <= to).map(([k]) => k)
  return { keys, stops: keys.flatMap((k, j) => [{ k, o: j / keys.length }, { k, o: (j + 1) / keys.length }]) }
})
const HOP0 = 0.5
const HOP_DT = 0.38
const HOP_FOR = 0.32
const LIT = (i: number) => HOP0 + i * HOP_DT + HOP_FOR
const TOP = LIT(7)

const stops = [{ x: 36, y: GROUND - 20 }, ...blocks.map(b => ({ x: b.x + W / 2, y: b.top - 20 }))]
const me = computed(() => {
  let pos = stops[0]
  for (let i = 0; i < stops.length - 1; i++) {
    const p = Math.min(1, Math.max(0, (t.value - HOP0 - i * HOP_DT) / HOP_FOR))
    if (p <= 0) break
    const a = stops[i]
    const b = stops[i + 1]
    pos = { x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p - 26 * Math.sin(Math.PI * p) }
  }
  return pos
})
const summit = blocks[7]
const confetti = Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2
  return { dx: Math.cos(a) * (36 + (i % 3) * 12), dy: Math.sin(a) * (26 + (i % 4) * 8) - 20, r: (i * 47) % 360, hot: i % 3 === 0 }
})

// the hall: three stepped rows, two aisles; front row (A) nearest the screen
const ROOM = TOP + 0.5
const SEAT = 34
const PITCH = 40
const blocksOf = [4, 9, 4] // seats left aisle | middle | right aisle
const AISLE = 30
const rowW = blocksOf.reduce((a, n) => a + n * PITCH, 0) + AISLE * 2
const seats = ['A', 'B', 'C'].flatMap((row, r) => {
  const y = 208 + r * 44
  let x = 440 - rowW / 2 + (PITCH - SEAT) / 2
  const out: { row: string; r: number; x: number; y: number; on: number }[] = []
  blocksOf.forEach((n, bi) => {
    for (let k = 0; k < n; k++) out.push({ row, r, x: x + k * PITCH, y, on: ROOM + r * 0.25 + k * 0.01 })
    x += n * PITCH + (bi < blocksOf.length - 1 ? AISLE : 0)
  })
  return out
})
const LIGHT = ROOM + 1.2
const rowsX = 440 - rowW / 2 - 18
</script>

<template>
  <svg class="kt-teachtalk" viewBox="0 0 880 400" role="img"
    aria-label="A lecture hall at DevFest Wrocław, at Uniwersytet Ekonomiczny. On the screen, the climb lights up step by step as I hop up it: Read, the Synthesize bridge, Group, Generate, Retrieve, Elaborate, Space, and on top Teach, the Protégé Effect: a flag and confetti, and under it: this talk. Below the screen, rows A to C of seats with people in them light up: the students, you. At the bottom, the GDG logo, DevFest Wrocław, and the venue.">
    <defs>
      <clipPath :id="face" clipPathUnits="objectBoundingBox"><circle cx="0.5" cy="0.5" r="0.5" /></clipPath>
      <linearGradient v-for="(g, i) in striped" :id="`${crop}-st${i}`" :key="`st${i}`" x1="0" y1="0" x2="1" y2="0">
        <stop v-for="(st, j) in g.stops" :key="j" :offset="st.o" class="kt-teachtalk__stop" :class="`is-${st.k}`" />
      </linearGradient>
      <linearGradient :id="`${crop}-beam`" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" class="kt-teachtalk__beam0" />
        <stop offset="1" class="kt-teachtalk__beam1" />
      </linearGradient>
    </defs>

    <!-- the screen -->
    <g class="kt-teachtalk__fade is-on">
      <path :d="`M${SCREEN.x + 8} ${SCREEN.y + SCREEN.h} L 440 196 L ${SCREEN.x + SCREEN.w - 8} ${SCREEN.y + SCREEN.h} Z`" :fill="`url(#${crop}-beam)`" />
      <rect :x="SCREEN.x" :y="SCREEN.y" :width="SCREEN.w" :height="SCREEN.h" rx="6" class="kt-teachtalk__screen" />
    </g>

    <!-- the climb, on the screen -->
    <path :d="`M${SCREEN.x + 10} ${GROUND} H ${SCREEN.x + SCREEN.w - 10}`" class="kt-teachtalk__ground" />
    <g v-for="b in blocks" :key="b.name">
      <rect :x="b.x" :y="b.top" :width="W" :height="GROUND - b.top" rx="8" class="kt-teachtalk__step" />
      <g class="kt-teachtalk__striped" :class="{ 'is-lit': at(LIT(b.i)) }">
        <rect :x="b.x" :y="b.top" :width="W" :height="GROUND - b.top" rx="8" :fill="`url(#${crop}-st${b.i})`" class="kt-teachtalk__stfill" />
        <rect :x="b.x" :y="b.top" :width="W" :height="GROUND - b.top" rx="8" fill="none" :stroke="`url(#${crop}-st${b.i})`" class="kt-teachtalk__stline" />
      </g>
      <text :x="b.x + 7" :y="b.top + 18" class="kt-teachtalk__name" :class="{ 'is-lit': at(LIT(b.i)) }">{{ b.name }}</text>
    </g>
    <g class="kt-teachtalk__fade" :class="{ 'is-on': at(TOP + 0.2) }">
      <text :x="summit.x + 7" :y="summit.top + 36" class="kt-teachtalk__this">this talk</text>
      <text :x="summit.x + 7" :y="summit.top + 53" class="kt-teachtalk__effect">Protégé</text>
      <text :x="summit.x + 7" :y="summit.top + 65" class="kt-teachtalk__effect">Effect</text>
    </g>
    <g class="kt-teachtalk__flag" :class="{ 'is-on': at(TOP) }">
      <path :d="`M${summit.x + W - 12} ${summit.top} V ${summit.top - 36}`" class="kt-teachtalk__pole" />
      <path :d="`M${summit.x + W - 12} ${summit.top - 36} l-22 8 l22 8z`" class="kt-teachtalk__cloth" />
    </g>
    <rect v-for="(c, i) in confetti" :key="`c${i}`" :x="summit.x + W / 2 - 3" :y="summit.top - 22" width="6" height="10" rx="1.5"
      class="kt-teachtalk__confetti" :class="{ 'is-on': at(TOP), 'is-hot': c.hot }"
      :style="{ '--dx': `${c.dx}px`, '--dy': `${c.dy}px`, '--r': `${c.r}deg`, animationDelay: `${i * 0.015}s` }" />
    <g class="kt-teachtalk__fade" :class="{ 'is-on': at(0.2) }">
      <circle :cx="me.x" :cy="me.y" r="19" class="kt-teachtalk__glow" :class="{ 'is-top': at(TOP) }" />
      <image href="/images/speaker.webp" :x="me.x - 15" :y="me.y - 15" width="30" height="30" :clip-path="`url(#${face})`"
        preserveAspectRatio="xMidYMid slice" />
      <circle :cx="me.x" :cy="me.y" r="15" class="kt-teachtalk__ring" :class="{ 'is-top': at(TOP) }" />
    </g>

    <!-- the hall: rows A–C, two aisles; people in the seats light up row by row -->
    <g v-for="(row, r) in ['A', 'B', 'C']" :key="row" class="kt-teachtalk__fade" :class="{ 'is-on': at(ROOM + r * 0.25) }">
      <text :x="rowsX" :y="214 + r * 44" text-anchor="middle" class="kt-teachtalk__rowname">{{ row }}</text>
      <text :x="880 - rowsX" :y="214 + r * 44" text-anchor="middle" class="kt-teachtalk__rowname">{{ row }}</text>
      <path :d="`M${440 - rowW / 2 - 6} ${226 + r * 44} H ${440 + rowW / 2 + 6}`" class="kt-teachtalk__tier" />
    </g>
    <g v-for="(s, i) in seats" :key="`s${i}`" class="kt-teachtalk__seat" :class="{ 'is-on': at(s.on), 'is-lit': at(LIGHT + s.r * 0.2) }">
      <circle :cx="s.x + SEAT / 2" :cy="s.y - 9" r="8" class="kt-teachtalk__head" />
      <path :d="`M${s.x + 4} ${s.y + 6} Q ${s.x + 4} ${s.y - 2} ${s.x + SEAT / 2} ${s.y - 2} Q ${s.x + SEAT - 4} ${s.y - 2} ${s.x + SEAT - 4} ${s.y + 6} Z`" class="kt-teachtalk__body" />
      <rect :x="s.x" :y="s.y + 2" :width="SEAT" height="18" rx="5" class="kt-teachtalk__back" />
      <rect :x="s.x - 2" :y="s.y + 8" width="4" height="12" rx="2" class="kt-teachtalk__arm" />
      <rect :x="s.x + SEAT - 2" :y="s.y + 8" width="4" height="12" rx="2" class="kt-teachtalk__arm" />
    </g>

    <!-- the room, and who's in it -->
    <g class="kt-teachtalk__fade" :class="{ 'is-on': at(LIGHT + 0.5) }">
      <path d="M22 352 H 858" class="kt-teachtalk__floor" />
      <!-- the GDG mark only: its wordmark is white -->
      <svg x="26" y="364" width="42" height="20" viewBox="0 0 222 107" preserveAspectRatio="xMinYMid meet">
        <image href="/images/logos/gdg.png" x="0" y="0" width="501" height="107" />
      </svg>
      <text x="72" y="381" class="kt-teachtalk__event">DevFest Wrocław</text>
      <text x="440" y="383" text-anchor="middle" class="kt-teachtalk__you">the students: <tspan class="is-hot">you</tspan></text>
      <text x="858" y="381" text-anchor="end" class="kt-teachtalk__event">Uniwersytet Ekonomiczny</text>
    </g>
  </svg>
</template>

<style>
.kt-teachtalk { width: 880px; height: auto; overflow: visible; font-family: var(--font-family-sans); }
.kt-teachtalk__fade { opacity: 0; transition: opacity 0.4s; }
.kt-teachtalk__fade.is-on { opacity: 1; }

/* the projector screen and the projector's light under it */
.kt-teachtalk__screen { fill: color-mix(in srgb, var(--kt-fg) 5%, var(--kt-bg)); stroke: var(--kt-line-strong); stroke-width: 2; }
.kt-teachtalk__beam0 { stop-color: var(--kt-fg); stop-opacity: 0.07; }
.kt-teachtalk__beam1 { stop-color: var(--kt-fg); stop-opacity: 0; }
.kt-teachtalk__ground { stroke: var(--kt-line-strong); stroke-width: 2; }

.kt-teachtalk__step { fill: color-mix(in srgb, var(--kt-fg) 4%, var(--kt-bg)); stroke: var(--kt-line-strong); stroke-width: 1.5; transition: fill 0.3s, stroke 0.3s; }
.kt-teachtalk__step.is-lit.is-basb { fill: color-mix(in srgb, var(--kt-info) 22%, var(--kt-bg)); stroke: var(--kt-info); stroke-width: 2; }
.kt-teachtalk__step.is-lit.is-synth { fill: color-mix(in srgb, var(--kt-hot) 20%, var(--kt-bg)); stroke: var(--kt-hot); stroke-width: 2; }
.kt-teachtalk__step.is-lit.is-mis { fill: color-mix(in srgb, var(--kt-good) 22%, var(--kt-bg)); stroke: var(--kt-good); stroke-width: 2; }
.kt-teachtalk__step.is-lit.is-teach { fill: color-mix(in srgb, var(--kt-warn) 28%, var(--kt-bg)); stroke: var(--kt-warn); stroke-width: 2.5; }
.kt-teachtalk__striped { opacity: 0; transition: opacity 0.35s; }
.kt-teachtalk__striped.is-lit { opacity: 1; }
.kt-teachtalk__stfill { opacity: 0.42; }
.kt-teachtalk__stline { stroke-width: 3; }
.kt-teachtalk__stop.is-basb { stop-color: var(--kt-info); }
.kt-teachtalk__stop.is-mis { stop-color: var(--kt-good); }
.kt-teachtalk__stop.is-style { stop-color: var(--kt-warn); }
.kt-teachtalk__stop.is-teach { stop-color: var(--kt-warn); }
.kt-teachtalk__stop.is-tm { stop-color: var(--kt-heading); }
.kt-teachtalk__name { font-size: 13px; font-weight: 800; fill: var(--kt-muted); transition: fill 0.3s; }
.kt-teachtalk__name.is-lit { fill: var(--kt-heading); }
.kt-teachtalk__this { font: 800 12px var(--font-family-mono); fill: var(--kt-warn); }
.kt-teachtalk__effect { font: 700 10.5px var(--font-family-mono); fill: var(--kt-warn); opacity: 0.85; }

.kt-teachtalk__flag { opacity: 0; transition: opacity 0.3s; }
.kt-teachtalk__flag.is-on { opacity: 1; }
.kt-teachtalk__pole { stroke: var(--kt-heading); stroke-width: 2.5; }
.kt-teachtalk__cloth { fill: var(--kt-warn); }
.kt-teachtalk__confetti { fill: var(--kt-warn); opacity: 0; transform-box: fill-box; transform-origin: center; }
.kt-teachtalk__confetti.is-hot { fill: var(--kt-hot); }
.kt-teachtalk__confetti.is-on { animation: kt-teachtalk-pop 1.3s ease-out forwards; }
@keyframes kt-teachtalk-pop {
  0% { opacity: 1; transform: translate(0, 0) rotate(0); }
  100% { opacity: 0; transform: translate(var(--dx), var(--dy)) rotate(var(--r)); }
}

.kt-teachtalk__glow { fill: color-mix(in srgb, var(--kt-c-primary) 25%, transparent); transition: fill 0.4s; }
.kt-teachtalk__glow.is-top { fill: color-mix(in srgb, var(--kt-warn) 40%, transparent); }
.kt-teachtalk__ring { fill: none; stroke: var(--kt-c-primary-soft); stroke-width: 3; transition: stroke 0.4s; }
.kt-teachtalk__ring.is-top { stroke: var(--kt-warn); }

/* the hall: seats in the talk's hot color, people in them */
.kt-teachtalk__rowname { font: 800 12px var(--font-family-mono); fill: var(--kt-muted); }
.kt-teachtalk__tier { stroke: var(--kt-line); stroke-width: 1.5; }
.kt-teachtalk__seat { opacity: 0; transition: opacity 0.4s; }
.kt-teachtalk__seat.is-on { opacity: 1; }
.kt-teachtalk__back { fill: color-mix(in srgb, var(--kt-hot) 45%, var(--kt-bg)); stroke: color-mix(in srgb, var(--kt-hot) 70%, var(--kt-bg)); stroke-width: 1; }
.kt-teachtalk__arm { fill: color-mix(in srgb, var(--kt-hot) 30%, var(--kt-bg)); }
.kt-teachtalk__head, .kt-teachtalk__body { fill: var(--kt-line-strong); transition: fill 0.5s; }
.kt-teachtalk__seat.is-lit .kt-teachtalk__head, .kt-teachtalk__seat.is-lit .kt-teachtalk__body { fill: color-mix(in srgb, var(--kt-warn) 75%, var(--kt-bg)); }

.kt-teachtalk__floor { stroke: var(--kt-line); stroke-width: 1.5; }
.kt-teachtalk__event { font-size: 15px; font-weight: 800; fill: var(--kt-heading); }
.kt-teachtalk__venue { font: 600 10.5px var(--font-family-mono); fill: var(--kt-muted); }
.kt-teachtalk__you { font-size: 18px; font-weight: 800; fill: var(--kt-heading); }
.kt-teachtalk__you .is-hot { fill: var(--kt-hot); }

@media (prefers-reduced-motion: reduce) {
  .kt-teachtalk__confetti.is-on { animation: none !important; }
}
</style>
