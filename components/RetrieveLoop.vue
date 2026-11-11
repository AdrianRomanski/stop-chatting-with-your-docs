<script setup lang="ts">
import { useId } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * Step 4 of the climb, Retrieve, as one loop (the ring of CoachLoop, without the rest of the climb).
 * 1. spar, top left: the coach questions me offline with Gemma 4B, in one of four training styles;
 *    the chips light one by one and one is picked.
 * 2. fail → I ask for a study session (study, bottom) → spar again.
 * 3. pass → the concept, the question and my answer go to the judge, Argon, online; the notes don't
 *    (the "notes" chip is struck).
 * 4. Argon looks for gaps in my answer; gaps → a study session again → spar again.
 * No props.
 */
const { at } = useTimeline(9)
const uid = useId()
const id = (name: string) => `kt-retloop-${name}-${uid}`

const SPAR = { x: 40, y: 34, w: 250, h: 140 }
const JUDGE = { x: 590, y: 34, w: 250, h: 140 }
const STUDY = { x: 295, y: 286, w: 290, h: 76 }
const SY = STUDY.y + STUDY.h / 2

const styles = ['feynman', 'socratic', 'cornell', 'devil'].map((name, i) => ({
  name,
  x: SPAR.x + 16 + i * 56,
  lit: 0.9 + i * 0.3,
}))
const PICK = 1 // socratic
const PICKED = 2.3

const T = { spar: 0.2, fail: 2.8, study: 3.2, again: 3.8, pass: 4.6, packet: 5.0, noNotes: 5.8, judge: 6.3, gaps: 7.1, loop: 7.8 }

const packet = [
  { name: 'concept', w: 62 },
  { name: 'question', w: 66 },
  { name: 'my answer', w: 72 },
  { name: 'notes', w: 54, struck: true },
].reduce<{ name: string; w: number; struck?: boolean; x: number }[]>((acc, c) => {
  const x = acc.length ? acc[acc.length - 1].x + acc[acc.length - 1].w + 6 : 304
  return [...acc, { ...c, x }]
}, [])
</script>

<template>
  <svg class="kt-retloop" viewBox="0 0 880 380" role="img"
    aria-label="The loop inside Retrieve. Spar: the coach questions me offline with Gemma 4B, in one of four training styles: feynman, socratic, cornell or devil. Fail, and I ask for a study session, then spar again. Pass, and the concept, the question and my answer go to the judge, Argon, online, without the notes. Argon looks for gaps in my answer; if there are any, it's a study session again, and then I spar again.">
    <defs>
      <marker v-for="tone in ['good', 'bad', 'hot', 'cool']" :id="id(tone)" :key="tone" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M1 1 L 9 5 L 1 9" class="kt-retloop__head" :class="`is-${tone}`" />
      </marker>
    </defs>

    <!-- spar: the coach, offline, in one of four styles -->
    <g class="kt-retloop__part" :class="{ 'is-on': at(T.spar) }">
      <rect :x="SPAR.x" :y="SPAR.y" :width="SPAR.w" :height="SPAR.h" rx="16" class="kt-retloop__box is-local" />
      <text :x="SPAR.x + 18" :y="SPAR.y + 34" class="kt-retloop__name">spar</text>
      <image href="/images/logos/gemma-mark.png" :x="SPAR.x + 18" :y="SPAR.y + 48" width="14" height="14" />
      <text :x="SPAR.x + 38" :y="SPAR.y + 60" class="kt-retloop__does is-local">coach · Gemma 4B · offline</text>
      <text :x="SPAR.x + 18" :y="SPAR.y + 90" class="kt-retloop__small">a training style, one of four</text>
    </g>
    <g v-for="(s, i) in styles" :key="s.name" class="kt-retloop__chip"
      :class="{ 'is-on': at(s.lit - 0.3), 'is-lit': at(s.lit) && !at(s.lit + 0.3) && !at(PICKED), 'is-picked': i === PICK && at(PICKED), 'is-dim': i !== PICK && at(PICKED) }">
      <rect :x="s.x" :y="SPAR.y + 102" width="52" height="22" rx="11" class="kt-retloop__chipbox" />
      <text :x="s.x + 26" :y="SPAR.y + 117" text-anchor="middle" class="kt-retloop__chiptext">{{ s.name }}</text>
    </g>

    <!-- fail → study session -->
    <path :d="`M${SPAR.x + 70} ${SPAR.y + SPAR.h + 2} V ${SY} H ${STUDY.x - 4}`" class="kt-retloop__wire is-bad" :class="{ 'is-on': at(T.fail) }" :marker-end="`url(#${id('bad')})`" />
    <g class="kt-retloop__part" :class="{ 'is-on': at(T.fail) }">
      <text :x="SPAR.x + 82" y="262" class="kt-retloop__label is-bad">fail</text>
      <text :x="SPAR.x + 82" y="278" class="kt-retloop__small">ask for a study session</text>
    </g>

    <!-- study -->
    <g class="kt-retloop__part" :class="{ 'is-on': at(T.study) }">
      <rect :x="STUDY.x" :y="STUDY.y" :width="STUDY.w" :height="STUDY.h" rx="16" class="kt-retloop__box is-plain" />
      <text :x="STUDY.x + 18" :y="STUDY.y + 32" class="kt-retloop__name">study</text>
      <image href="/images/logos/gemma-mark.png" :x="STUDY.x + 18" :y="STUDY.y + 44" width="14" height="14" />
      <text :x="STUDY.x + 38" :y="STUDY.y + 56" class="kt-retloop__does">a study session on what I missed</text>
    </g>

    <!-- study → spar again -->
    <path :d="`M${STUDY.x + 90} ${STUDY.y - 2} V 222 H ${SPAR.x + 170} V ${SPAR.y + SPAR.h + 4}`" class="kt-retloop__wire is-cool"
      :class="{ 'is-on': at(T.again), 'is-pulse': at(T.loop) }" :marker-end="`url(#${id('cool')})`" />
    <g class="kt-retloop__part" :class="{ 'is-on': at(T.again) }">
      <text :x="SPAR.x + 182" y="214" class="kt-retloop__label is-cool">spar again</text>
    </g>

    <!-- pass → the judge, with the concept, the question and my answer, never the notes -->
    <path :d="`M${SPAR.x + SPAR.w + 2} ${SPAR.y + 50} H ${JUDGE.x - 4}`" class="kt-retloop__wire is-good" :class="{ 'is-on': at(T.pass) }" :marker-end="`url(#${id('good')})`" />
    <g class="kt-retloop__part" :class="{ 'is-on': at(T.pass) }">
      <text :x="(SPAR.x + SPAR.w + JUDGE.x) / 2" :y="SPAR.y + 40" text-anchor="middle" class="kt-retloop__label is-good">pass</text>
    </g>
    <g class="kt-retloop__packet" :class="{ 'is-on': at(T.packet) }">
      <g v-for="c in packet" :key="c.name" :class="{ 'is-struck': c.struck && at(T.noNotes) }" class="kt-retloop__pchip">
        <rect :x="c.x" :y="SPAR.y + 66" :width="c.w" height="22" rx="6" class="kt-retloop__pbox" />
        <text :x="c.x + c.w / 2" :y="SPAR.y + 81" text-anchor="middle" class="kt-retloop__ptext">{{ c.name }}</text>
        <path v-if="c.struck" :d="`M${c.x + 4} ${SPAR.y + 77} H ${c.x + c.w - 4}`" class="kt-retloop__strike" />
      </g>
    </g>
    <g class="kt-retloop__part" :class="{ 'is-on': at(T.noNotes) }">
      <text :x="(SPAR.x + SPAR.w + JUDGE.x) / 2" :y="SPAR.y + 112" text-anchor="middle" class="kt-retloop__small is-bad">judged without the notes</text>
    </g>

    <!-- the judge -->
    <g class="kt-retloop__part" :class="{ 'is-on': at(T.judge) }">
      <rect :x="JUDGE.x" :y="JUDGE.y" :width="JUDGE.w" :height="JUDGE.h" rx="16" class="kt-retloop__box is-cloud" />
      <text :x="JUDGE.x + 18" :y="JUDGE.y + 34" class="kt-retloop__name">judge</text>
      <image href="/images/logos/gemini-mark.png" :x="JUDGE.x + 18" :y="JUDGE.y + 48" width="14" height="14" />
      <text :x="JUDGE.x + 38" :y="JUDGE.y + 60" class="kt-retloop__does is-cloud">Argon · online</text>
      <text :x="JUDGE.x + 18" :y="JUDGE.y + 92" class="kt-retloop__body">looks for the gaps</text>
      <text :x="JUDGE.x + 18" :y="JUDGE.y + 112" class="kt-retloop__body">in my answer</text>
    </g>

    <!-- gaps → study session again -->
    <path :d="`M${JUDGE.x + 130} ${JUDGE.y + JUDGE.h + 2} V ${SY} H ${STUDY.x + STUDY.w + 4}`" class="kt-retloop__wire is-hot" :class="{ 'is-on': at(T.gaps) }" :marker-end="`url(#${id('hot')})`" />
    <g class="kt-retloop__part" :class="{ 'is-on': at(T.gaps) }">
      <text :x="JUDGE.x + 142" y="262" class="kt-retloop__label is-hot">gaps</text>
      <text :x="JUDGE.x + 142" y="278" class="kt-retloop__small">a study session again</text>
    </g>
  </svg>
</template>

<style>
.kt-retloop { width: 860px; height: auto; overflow: visible; font-family: var(--font-family-sans); }

.kt-retloop__part, .kt-retloop__wire { opacity: 0; transition: opacity 0.45s; }
.kt-retloop__part.is-on, .kt-retloop__wire.is-on { opacity: 1; }

.kt-retloop__box { fill: var(--kt-code-bg); stroke: var(--kt-line-strong); stroke-width: 2.5; }
.kt-retloop__box.is-local { stroke: var(--kt-c-primary); }
.kt-retloop__box.is-cloud { stroke: var(--kt-c-secondary); }
.kt-retloop__box.is-plain { stroke: var(--kt-c-primary-soft); }
.kt-retloop__name { font-size: 22px; font-weight: 800; fill: var(--kt-heading); }
.kt-retloop__does { font: 700 12px var(--font-family-mono); fill: var(--kt-muted); }
.kt-retloop__does.is-local { fill: var(--kt-cool); }
.kt-retloop__does.is-cloud { fill: var(--kt-hot); }
.kt-retloop__body { font-size: 15px; font-weight: 700; fill: var(--kt-fg); }
.kt-retloop__small { font: 600 11.5px var(--font-family-mono); fill: var(--kt-muted); }
.kt-retloop__small.is-bad { fill: var(--kt-bad); font-weight: 800; }
.kt-retloop__label { font: 800 14px var(--font-family-mono); }
.kt-retloop__label.is-good { fill: var(--kt-good); }
.kt-retloop__label.is-bad { fill: var(--kt-bad); }
.kt-retloop__label.is-hot { fill: var(--kt-hot); }
.kt-retloop__label.is-cool { fill: var(--kt-cool); }

/* the four training styles */
.kt-retloop__chip { opacity: 0; transition: opacity 0.3s; }
.kt-retloop__chip.is-on { opacity: 1; }
.kt-retloop__chip.is-dim { opacity: 0.4; }
.kt-retloop__chipbox { fill: var(--kt-bg); stroke: var(--kt-line-strong); stroke-width: 1.5; transition: fill 0.25s, stroke 0.25s; }
.kt-retloop__chiptext { font: 700 10px var(--font-family-mono); fill: var(--kt-fg); transition: fill 0.25s; }
.kt-retloop__chip.is-lit .kt-retloop__chipbox { stroke: var(--kt-warn); }
.kt-retloop__chip.is-picked .kt-retloop__chipbox { fill: var(--kt-warn); stroke: var(--kt-warn); }
.kt-retloop__chip.is-picked .kt-retloop__chiptext { fill: var(--kt-bg); }

/* what goes to the judge */
.kt-retloop__packet { opacity: 0; transform: translateX(-40px); transition: opacity 0.4s, transform 0.8s ease-out; }
.kt-retloop__packet.is-on { opacity: 1; transform: none; }
.kt-retloop__pbox { fill: color-mix(in srgb, var(--kt-good) 12%, var(--kt-bg)); stroke: var(--kt-good); stroke-width: 1.3; transition: fill 0.3s, stroke 0.3s; }
.kt-retloop__ptext { font: 700 10.5px var(--font-family-mono); fill: var(--kt-heading); transition: fill 0.3s; }
.kt-retloop__strike { stroke: var(--kt-bad); stroke-width: 2; stroke-linecap: round; opacity: 0; transition: opacity 0.3s; }
.kt-retloop__pchip.is-struck .kt-retloop__pbox { fill: var(--kt-bg); stroke: var(--kt-bad); }
.kt-retloop__pchip.is-struck .kt-retloop__ptext { fill: var(--kt-muted); }
.kt-retloop__pchip.is-struck .kt-retloop__strike { opacity: 1; }

/* wires */
.kt-retloop__wire { fill: none; stroke-width: 2.5; stroke-dasharray: 6 5; }
.kt-retloop__wire.is-on { animation: kt-retloop-flow 1.2s linear infinite; }
.kt-retloop__wire.is-good { stroke: var(--kt-good); }
.kt-retloop__wire.is-bad { stroke: var(--kt-bad); }
.kt-retloop__wire.is-hot { stroke: var(--kt-hot); }
.kt-retloop__wire.is-cool { stroke: var(--kt-cool); }
.kt-retloop__wire.is-pulse { stroke-width: 3.5; }
.kt-retloop__head { fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.kt-retloop__head.is-good { stroke: var(--kt-good); }
.kt-retloop__head.is-bad { stroke: var(--kt-bad); }
.kt-retloop__head.is-hot { stroke: var(--kt-hot); }
.kt-retloop__head.is-cool { stroke: var(--kt-cool); }

@keyframes kt-retloop-flow { to { stroke-dashoffset: -22; } }

@media (prefers-reduced-motion: reduce) {
  .kt-retloop__wire.is-on { animation: none !important; }
}
</style>
