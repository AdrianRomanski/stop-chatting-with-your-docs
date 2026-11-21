<script setup lang="ts">
import { computed, useId } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * What we want to build, told with the Matrix loading and dojo scenes, as a storyboard of film
 * stills with subtitles. The cover ends on Matrix code rain, the train's bulb (TrainOffline) is where the
 * idea came; this is the scene.
 * Each row: its clock runs first (beside its label) and a bar under the header fills with it (the grind's
 * bar ticks as each style loads); then all the row's stills land at once, with the result.
 * Row 1, THE SUMMARY, AI as magic, one prompt: "Teach me kung fu." (the clock stops at 00:00:05):
 *   1. Neo opens his eyes: "I know kung fu."  2. The dojo: Morpheus throws him across the floor. LOST.
 * Row 2, THE GRIND, AI as a coach: "Train me, style by style." The bar is split into the five styles
 *   (jujitsu, kempo, taekwondo, drunken boxing, and kung fu in the Teach step's yellow), each named over
 *   its segment and lit as it's
 *   asked for while the clock runs to 10:00:00. Neo in pain lands as the grind starts; the rest after:
 *   3. Neo in pain in the chair: "Training takes sacrifice."  4. Morpheus and Tank in one
 *   still: Morpheus (right) "How is he?", Tank (left) "Ten hours straight. He's a machine." (yellow)
 *   5. Neo's fist stops at Morpheus' face. WON.
 * Under both, the slide's only line (no headline): what we build, a grinding system, not a magic summary
 * machine.
 * The lost/won framing is the workshop's, not the film's: in the film the ten hours come first and Neo
 * loses the first bout anyway. Stills: The Matrix (1999), Warner Bros.; 1, 2, 5 from screenmusings.org
 * (Blu-ray captures 064, 066, 068), resized to webp in public/images/memes/matrix-*; 3 and 4 are the
 * speaker's own frames (neo-in-pain.webp, morpheus-tank-together.webp). No props.
 */
const { t, at } = useTimeline(10.4)
const uid = useId()
const cid = (n: number) => `kt-neog-${n}-${uid}`

// each row: its clock runs first, then all its stills land at once, with the result
const SUM = { clock: 0.3, for: 1.2 }
const ROW1 = SUM.clock + SUM.for + 0.3
const GRIND = ROW1 + 1.4
const GRIND_FOR = 5 // ten hours, one second per style: slow on purpose, the summary took 1.2
const ROW2 = GRIND + GRIND_FOR + 0.3
const BUILD = ROW2 + 1.2
// the grind asks for one fighting style at a time, as the clock runs
const STYLES = ['jujitsu', 'kempo', 'taekwondo', 'drunken boxing', 'kung fu']
const STYLE_DT = GRIND_FOR / STYLES.length

const clamp = (v: number) => Math.min(1, Math.max(0, v))
const secs = computed(() => Math.round(clamp((t.value - SUM.clock) / SUM.for) * 5))
const sumP = computed(() => clamp((t.value - SUM.clock) / SUM.for))
const grindP = computed(() => clamp((t.value - GRIND) / GRIND_FOR))
const hours = computed(() => {
  const m = Math.round(clamp((t.value - GRIND) / GRIND_FOR) * 600)
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}:00`
})

const R1 = { y: 42, h: 172 }
const R2 = { y: 318, h: 152 }
const panels = [
  { n: 1, at: ROW1, x: 0, w: 433, ...R1, src: '/images/memes/matrix-know-kung-fu.webp', lines: ['I know kung fu.'], who: 'Neo' },
  { n: 2, at: ROW1, x: 447, w: 433, ...R1, src: '/images/memes/matrix-dojo-throw.webp', lines: [], who: '', tone: 'bad' },
  { n: 3, at: GRIND, x: 0, w: 250, ...R2, src: '/images/memes/neo-in-pain.webp', lines: ['Training takes sacrifice.'], who: 'Neo' },
  { n: 4, at: ROW2, x: 264, w: 352, ...R2, src: '/images/memes/morpheus-tank-together.webp', lines: [], who: '' },
  { n: 5, at: ROW2, x: 630, w: 250, ...R2, src: '/images/memes/matrix-dojo-punch.webp', lines: [], who: '', tone: 'good' },
]
// Morpheus and Tank share one still: Morpheus (right) asks, Tank (left) answers
const TALK = panels[3]
</script>

<template>
  <svg class="kt-neog" viewBox="0 0 880 528" role="img"
    aria-label="A storyboard of film stills from The Matrix. The summary, five seconds, one prompt, AI as magic: Teach me kung fu. Neo opens his eyes and says: I know kung fu. In the dojo, Morpheus throws him across the floor: lost. The grind, ten hours, AI as a coach: Train me, style by style. One style at a time: jujitsu, kempo, taekwondo, drunken boxing, kung fu. Neo in pain in the chair: training takes sacrifice. Morpheus, beside Tank at the console, asks: How is he? Tank answers: Ten hours straight. He's a machine. Neo's fist stops at Morpheus' face: won. Underneath: what we build, a grinding system, not a magic summary machine.">
    <defs>
      <clipPath v-for="p in panels" :id="cid(p.n)" :key="p.n">
        <rect :x="p.x" :y="p.y" :width="p.w" :height="p.h" rx="12" />
      </clipPath>
    </defs>

    <!-- row headers: what it is, and how long it took -->
    <g class="kt-neog__part" :class="{ 'is-on': at(0.1) }">
      <text x="0" y="18" class="kt-neog__key is-bad">the summary<tspan dx="14" class="kt-neog__clock">00:00:0{{ secs }}</tspan></text>
      <text x="880" y="18" text-anchor="end" class="kt-neog__ask">AI as magic: <tspan class="kt-neog__say is-bad">“Teach me kung fu.”</tspan></text>
    </g>
    <g class="kt-neog__part" :class="{ 'is-on': at(GRIND) }">
      <text x="0" y="268" class="kt-neog__key is-good">the grind<tspan dx="14" class="kt-neog__clock">{{ hours }}</tspan></text>
      <text x="880" y="268" text-anchor="end" class="kt-neog__ask">AI as a coach: <tspan class="kt-neog__say is-good">“Train me, style by style.”</tspan></text>
      <!-- the styles, one per segment of the bar, each lit as it's asked for -->
      <text v-for="(st, i) in STYLES" :key="st" :x="880 * (i + 0.5) / STYLES.length" y="296" text-anchor="middle"
        class="kt-neog__segname kt-neog__style" :class="{ 'is-on': at(GRIND + i * STYLE_DT), 'is-teach': st === 'kung fu' }">{{ st }}</text>
    </g>

    <!-- time passing: a bar under each header fills while its clock runs -->
    <g class="kt-neog__part" :class="{ 'is-on': at(0.1) }">
      <rect x="0" y="27" width="880" height="6" rx="3" class="kt-neog__track" />
      <rect x="0" y="27" :width="880 * sumP" height="6" rx="3" class="kt-neog__fill is-bad" />
    </g>
    <g class="kt-neog__part" :class="{ 'is-on': at(GRIND) }">
      <rect x="0" y="303" width="880" height="6" rx="3" class="kt-neog__track" />
      <rect x="0" y="303" :width="880 * grindP" height="6" rx="3" class="kt-neog__fill is-good" />
      <!-- the last segment, kung fu, fills in the Teach step's yellow -->
      <rect :x="880 * 4 / 5" y="303" :width="Math.max(0, 880 * grindP - 880 * 4 / 5)" height="6" rx="3" class="kt-neog__fill is-teach" />
      <!-- a tick each time a style has loaded -->
      <rect v-for="(st, i) in STYLES" :key="st" :x="880 * (i + 1) / STYLES.length - 3" y="300" width="3" height="12" rx="1.5"
        class="kt-neog__tick" :class="{ 'is-on': at(GRIND + (i + 1) * STYLE_DT) }" />
    </g>

    <!-- the stills, with film subtitles -->
    <g v-for="p in panels" :key="p.n" class="kt-neog__part" :class="{ 'is-on': at(p.at) }">
      <image :href="p.src" :x="p.x" :y="p.y" :width="p.w" :height="p.h" preserveAspectRatio="xMidYMid slice" :clip-path="`url(#${cid(p.n)})`" />
      <rect :x="p.x" :y="p.y" :width="p.w" :height="p.h" rx="12" class="kt-neog__frame" :class="p.tone ? `is-${p.tone}` : ''" />
      <text v-for="(l, i) in p.lines" :key="l" :x="p.x + p.w / 2" :y="p.y + p.h - 14 - (p.lines.length - 1 - i) * 22" text-anchor="middle" class="kt-neog__sub" :class="{ 'is-accent': p.accent === i }">{{ l }}</text>
      <text v-if="p.who" :x="p.x + 12" :y="p.y + 22" class="kt-neog__who">{{ p.who }}</text>
    </g>

    <!-- one still, two speakers: the question by Morpheus, the answer by Tank -->
    <g class="kt-neog__part" :class="{ 'is-on': at(ROW2) }">
      <text :x="TALK.x + TALK.w - 12" :y="TALK.y + 22" text-anchor="end" class="kt-neog__who">Morpheus</text>
      <text :x="TALK.x + TALK.w - 12" :y="TALK.y + 46" text-anchor="end" class="kt-neog__sub">How is he?</text>
      <text :x="TALK.x + 12" :y="TALK.y + TALK.h - 58" class="kt-neog__who">Tank</text>
      <text :x="TALK.x + 12" :y="TALK.y + TALK.h - 36" class="kt-neog__sub">Ten hours straight.</text>
      <text :x="TALK.x + 12" :y="TALK.y + TALK.h - 14" class="kt-neog__sub is-accent">He’s a machine.</text>
    </g>

    <!-- the results -->
    <g class="kt-neog__part" :class="{ 'is-on': at(ROW1) }">
      <rect x="760" y="54" width="108" height="34" rx="17" class="kt-neog__result is-bad" />
      <text x="814" y="77" text-anchor="middle" class="kt-neog__resulttext">lost</text>
    </g>
    <g class="kt-neog__part" :class="{ 'is-on': at(ROW2) }">
      <rect x="760" y="330" width="108" height="34" rx="17" class="kt-neog__result is-good" />
      <text x="814" y="353" text-anchor="middle" class="kt-neog__resulttext">won</text>
    </g>

    <!-- what we build -->
    <g class="kt-neog__part" :class="{ 'is-on': at(BUILD) }">
      <text x="440" y="522" text-anchor="middle" class="kt-neog__build">
        What we build: a <tspan class="is-hot">grinding system</tspan>, not a magic summary machine
      </text>
    </g>
  </svg>
</template>

<style>
.kt-neog { width: 100%; height: auto; overflow: visible; font-family: var(--font-family-sans); }
.kt-neog__part { opacity: 0; transition: opacity 0.4s; }
.kt-neog__part.is-on { opacity: 1; }

.kt-neog__key { font: 800 14px var(--font-family-mono); text-transform: uppercase; letter-spacing: 0.1em; }
.kt-neog__key.is-bad { fill: var(--kt-bad); }
.kt-neog__key.is-good { fill: var(--kt-good); }
.kt-neog__clock { font: 700 16px var(--font-family-mono); fill: var(--kt-heading); }
.kt-neog__ask { font: 600 16px var(--font-family-mono); fill: var(--kt-muted); }
/* what Neo asks for: big enough for the back row */
.kt-neog__say { font: 800 28px var(--font-family-sans); fill: var(--kt-heading); }
.kt-neog__say.is-bad { fill: var(--kt-bad); }
.kt-neog__say.is-good { fill: var(--kt-good); }
/* kung fu, the style he ends on, in the Teach step's yellow */
.kt-neog__segname.is-teach { fill: var(--kt-warn); }
.kt-neog__segname { font: 800 19px var(--font-family-sans); fill: var(--kt-heading); }
.kt-neog__style { fill-opacity: 0.2; transition: fill-opacity 0.3s; }
.kt-neog__style.is-on { fill-opacity: 1; }

.kt-neog__track { fill: var(--kt-c-track); }
.kt-neog__fill.is-bad { fill: var(--kt-bad); }
.kt-neog__fill.is-good { fill: var(--kt-good); }
.kt-neog__fill.is-teach { fill: var(--kt-warn); }
.kt-neog__tick { fill: var(--kt-heading); opacity: 0; transition: opacity 0.2s; }
.kt-neog__tick.is-on { opacity: 1; }
.kt-neog__frame { fill: none; stroke: var(--kt-line-strong); stroke-width: 2; }
.kt-neog__frame.is-bad { stroke: var(--kt-bad); stroke-width: 3; }
.kt-neog__frame.is-good { stroke: var(--kt-good); stroke-width: 3; }
/* film subtitles: light text with a dark outline, readable on any still */
.kt-neog__sub { font-size: 19px; font-weight: 800; fill: var(--kt-heading); stroke: var(--kt-bg); stroke-width: 4px; paint-order: stroke; stroke-linejoin: round; }
.kt-neog__sub.is-accent { fill: var(--kt-warn); }
.kt-neog__who { font: 700 11px var(--font-family-mono); text-transform: uppercase; letter-spacing: 0.08em; fill: var(--kt-heading); stroke: var(--kt-bg); stroke-width: 3px; paint-order: stroke; }

.kt-neog__result.is-bad { fill: var(--kt-bad); }
.kt-neog__result.is-good { fill: var(--kt-good); }
.kt-neog__resulttext { font: 800 16px var(--font-family-mono); text-transform: uppercase; letter-spacing: 0.1em; fill: var(--kt-bg); }

.kt-neog__build { font-size: 24px; font-weight: 800; fill: var(--kt-heading); }
.kt-neog__build .is-hot { fill: var(--kt-hot); }

@media (prefers-reduced-motion: reduce) {
  .kt-neog__part { transition: none; }
}
</style>
