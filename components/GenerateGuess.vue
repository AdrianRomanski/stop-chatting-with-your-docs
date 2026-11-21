<script setup lang="ts">
import { computed } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * Climb step 3, Generate, as `coach generate Distillation` runs it (ai-performance-coach cli generate.ts,
 * application generating.ts; kb-template's "From memory" draw mode is the same flow). Five beats, lit
 * one by one in a bar on top: name only → write → reveal → mark → check.
 * 1. The concept note, on the right, is closed: only its name shows; its Reveal button is grey,
 *    "write first" (reveal() before submit() throws). On the left, a blank page.
 * 2. All I know types into the page, one line per idea; "attempted ✓" is stamped.
 * 3. Reveal turns on and opens the note: three of its real core assertions (as on ConceptNote).
 * 4. I mark each one against what I wrote: got it, wrong, got it.
 * 5. Gemma 12B checks every mark: ✓, ✗ on the wrong one, ✓. On the wrong one it gives me a hint, not
 *    the answer. My correction types in, in my own words (no 6 words copied from the assertion);
 *    Gemma checks it: ✗ turns to ✓, wrong to solved, attempted to passed.
 * No props.
 */
const { t, at } = useTimeline(16)

const B = { title: 0.2, write: 1.0, reveal: 4.8, mark: 6.6 }
const MARKED = [B.mark + 0.2, B.mark + 0.8, B.mark + 1.4]
const CHECK = B.mark + 2.0
const HINT = CHECK + 1.5 // Gemma: a hint on the wrong one
const FIX: [number, number] = [HINT + 1.4, HINT + 3.2]
const RECHECK = FIX[1] + 0.5
const SOLVED = RECHECK + 0.5
const beats = [
  { n: 1, name: 'name only', at: B.title },
  { n: 2, name: 'write', at: B.write },
  { n: 3, name: 'reveal', at: B.reveal },
  { n: 4, name: 'mark', at: B.mark },
  { n: 5, name: 'check', at: CHECK },
].map((b, i) => ({ ...b, x: i * 176 }))
const beat = computed(() => beats.reduce((n, b) => (at(b.at) ? b.n : n), 0))

// all I know, one line per idea, on a blank page; each line meets one assertion
const lines = ['I bold what I find interesting,', 'then highlight whole paragraphs,', 'and write a summary on top.']
const GX = 0
const TOP = 46 // both boxes' top
const BOT = 382 // both boxes' bottom
const GW = 376 // the left column's width
const PY = TOP // the page's top
const GY = PY + 70 // first line's baseline
const LINE = 42
const TYPE: [number, number] = [B.write + 0.3, B.write + 3.3]
const total = lines.join(' ').length
const typed = computed(() => {
  let left = Math.round(total * Math.min(1, Math.max(0, (t.value - TYPE[0]) / (TYPE[1] - TYPE[0]))))
  return lines.map(l => {
    const s = l.slice(0, Math.max(0, left))
    left -= l.length + 1
    return s
  })
})
const ATTEMPT = TYPE[1] + 0.3

// the note, on the right
const NX = 404
const NW = 476
const rows = [
  { text: ['The learner identifies interesting', 'text by bolding it.'], mark: 'got' },
  { text: ['The learner then highlights portions', 'of the bolded text.'], mark: 'wrong' },
  { text: ['The learner creates a fourth layer', 'consisting of a summary.'], mark: 'got' },
].map((r, i) => ({
  ...r,
  i,
  y: 92 + i * 76,
  in: B.reveal + 0.7 + i * 0.3,
  marked: MARKED[i],
  checked: CHECK + 0.3 + i * 0.3,
}))
// my correction passes: the wrong one is solved
const state = (r: { mark: string }) => (r.mark === 'wrong' && at(SOLVED) ? 'solved' : r.mark)
const chip = { got: '✓ got it', wrong: '✗ wrong', solved: '✓ solved' } as Record<string, string>
const fix = ['Only parts of the bold get highlighted,', 'not whole paragraphs.']
const FY = 270 // the correction box's top
const fixTyped = computed(() => {
  const all = fix.join(' ').length
  let left = Math.round(all * Math.min(1, Math.max(0, (t.value - FIX[0]) / (FIX[1] - FIX[0]))))
  return fix.map(l => {
    const s = l.slice(0, Math.max(0, left))
    left -= l.length + 1
    return s
  })
})
const gemma = computed(() =>
  at(RECHECK)
    ? { title: 'Gemma 12B checks my correction', sub: 'in my own words ✓' }
    : at(HINT)
      ? { title: 'Hint: “whole paragraphs” is what’s wrong', sub: 'so what do I highlight instead?' }
      : { title: 'Gemma 12B checks every mark', sub: 'against what I wrote' },
)
</script>

<template>
  <svg class="kt-gen" viewBox="0 0 880 386" role="img"
    aria-label="Generate, with coach generate on the Distillation concept note, in five beats. One, name only: the concept's name and a blank page; the note is closed, and its reveal button waits: write first. Two, write: I write all I know, before I look: I bold what I find interesting, then highlight whole paragraphs, and write a summary on top. Three, reveal: the note opens on three of its core assertions. Four, mark: I mark each one against what I wrote. Bolding interesting text: got it. Highlighting portions of the bold: wrong. A summary as a fourth layer: got it. Five, check: Gemma 12B checks every mark: both got its hold, the wrong one fails. Gemma gives me a hint on what's wrong, not the answer: whole paragraphs is the wrong part. I type my correction in my own words: only parts of the bold get highlighted, not whole paragraphs. Gemma checks it: solved, and attempted turns into passed.">
    <!-- the five beats -->
    <g v-for="b in beats" :key="b.n" class="kt-gen__beat" :class="{ 'is-on': beat >= b.n, 'is-now': beat === b.n, 'is-passed': b.n === 5 && at(SOLVED) }">
      <rect :x="b.x" y="0" width="168" height="30" rx="15" class="kt-gen__beatbox" />
      <circle :cx="b.x + 16" cy="15" r="10" class="kt-gen__beatdot" />
      <text :x="b.x + 16" y="19" text-anchor="middle" class="kt-gen__beatnum">{{ b.n }}</text>
      <text :x="b.x + 34" y="20" class="kt-gen__beatname">{{ b.name }}</text>
    </g>

    <!-- ── the note, closed until the reveal ── -->
    <g class="kt-gen__fade" :class="{ 'is-on': at(B.title) }">
      <rect :x="NX" :y="TOP" :width="NW" :height="BOT - TOP" rx="12" class="kt-gen__note" :class="{ 'is-open': at(B.reveal + 0.5), 'is-failed': at(rows[1].checked) && !at(SOLVED), 'is-passed': at(SOLVED) }" />
      <path :d="`M${NX + 22} 58 l 10 11 l -10 11 l -10 -11 z`" class="kt-gen__diamond" />
      <text :x="NX + 42" y="76" class="kt-gen__ntitle">Distillation</text>
      <text :x="NX + NW - 16" y="75" text-anchor="end" class="kt-gen__small">concept note</text>
    </g>
    <!-- closed: blurred lines, a lock, a grey Reveal -->
    <g class="kt-gen__closed" :class="{ 'is-gone': at(B.reveal + 0.5) }">
      <rect v-for="k in 6" :key="k" :x="NX + 22" :y="98 + k * 26" :width="k % 3 === 0 ? 240 : 360" height="9" rx="4.5" class="kt-gen__blur" />
      <g :transform="`translate(${NX + NW / 2} 210)`">
        <rect x="-15" y="-4" width="30" height="24" rx="5" class="kt-gen__lock" />
        <path d="M-9 -4 v -7 a 9 9 0 0 1 18 0 v 7" class="kt-gen__shackle" :class="{ 'is-open': at(B.reveal + 0.3) }" />
      </g>
    </g>
    <g class="kt-gen__fade" :class="{ 'is-on': at(B.title) && !at(B.reveal + 0.6) }">
      <rect :x="NX + NW / 2 - 50" :y="BOT - 56" width="100" height="30" rx="15" class="kt-gen__reveal" :class="{ 'is-ready': at(ATTEMPT), 'is-pressed': at(B.reveal) }" />
      <text :x="NX + NW / 2" :y="BOT - 36.5" text-anchor="middle" class="kt-gen__revealtext" :class="{ 'is-ready': at(ATTEMPT) }">Reveal</text>
      <text :x="NX + NW / 2" :y="BOT - 10" text-anchor="middle" class="kt-gen__small kt-gen__fade" :class="{ 'is-on': !at(ATTEMPT) }">write first</text>
    </g>
    <!-- open: the core assertions, marked -->
    <g v-for="r in rows" :key="r.text[0]" class="kt-gen__row" :class="{ 'is-on': at(r.in) }">
      <rect :x="NX + 12" :y="r.y" :width="NW - 24" height="64" rx="10" class="kt-gen__arow" :class="{ [`is-${state(r)}`]: at(r.marked) }" />
      <text v-for="(l, j) in r.text" :key="l" :x="NX + 24" :y="r.y + 27 + j * 21" class="kt-gen__atext">{{ l }}</text>
      <g class="kt-gen__fade" :class="{ 'is-on': at(r.marked) }">
        <rect :x="NX + NW - 104" :y="r.y + 20" width="84" height="24" rx="12" class="kt-gen__mark" :class="`is-${state(r)}`" />
        <text :x="NX + NW - 62" :y="r.y + 36.5" text-anchor="middle" class="kt-gen__marktext">{{ chip[state(r)] }}</text>
      </g>
    </g>

    <!-- ── the blank page, filled with all I know ── -->
    <g class="kt-gen__fade" :class="{ 'is-on': at(B.title) }">
      <rect :x="GX" :y="PY" :width="GW" :height="FY - 16 - PY" rx="12" class="kt-gen__pad" :class="{ 'is-done': at(ATTEMPT) }" />
      <text :x="GX + 18" :y="PY + 30" class="kt-gen__small">all I know about Distillation</text>
    </g>
    <text v-for="(l, i) in typed" :key="i" :x="GX + 18" :y="GY + i * LINE" class="kt-gen__guess">{{ l }}</text>
    <g :transform="`translate(${GX + GW - 72} ${PY + 14})`">
      <g class="kt-gen__stamp" :class="{ 'is-on': at(ATTEMPT), 'is-passed': at(SOLVED) }">
        <rect x="-58" y="0" width="116" height="26" rx="6" class="kt-gen__stampbox" />
        <text y="18" text-anchor="middle" class="kt-gen__stamptext">{{ at(SOLVED) ? 'passed ✓' : 'attempted ✓' }}</text>
      </g>
    </g>

    <!-- after the hint: my correction, in my own words -->
    <g class="kt-gen__fade" :class="{ 'is-on': at(FIX[0] - 0.2) }">
      <rect :x="GX" :y="FY" :width="GW" :height="BOT - FY" rx="12" class="kt-gen__fixbox" :class="{ 'is-solved': at(SOLVED) }" />
      <text :x="GX + 18" :y="FY + 26" class="kt-gen__small">correction</text>
      <text v-for="(l, i) in fixTyped" :key="i" :x="GX + 18" :y="FY + 60 + i * 28" class="kt-gen__fix">{{ l }}</text>
    </g>

    <!-- check: Gemma 12B, in the note under the assertions -->
    <g class="kt-gen__fade" :class="{ 'is-on': at(CHECK) }">
      <rect :x="NX + 12" y="320" :width="NW - 24" height="52" rx="10" class="kt-gen__checkbox" :class="{ 'is-hint': at(HINT) && !at(SOLVED), 'is-again': at(SOLVED) }" />
      <image href="/images/logos/gemma-mark.png" :x="NX + 24" y="335" width="22" height="22" />
      <text :x="NX + 56" y="341" class="kt-gen__checktitle" :class="{ 'is-hint': at(HINT) && !at(RECHECK) }">{{ gemma.title }}</text>
      <text :x="NX + 56" y="361" class="kt-gen__small">{{ gemma.sub }}</text>
    </g>
    <!-- Gemma's result on each row: ✓, or ✗ on the wrong one until it's solved -->
    <g v-for="r in rows" :key="`c${r.i}`" class="kt-gen__fade" :class="{ 'is-on': at(r.checked) }">
      <circle :cx="NX + NW - 120" :cy="r.y + 32" r="9" class="kt-gen__ok" :class="{ 'is-fail': state(r) === 'wrong' }" />
      <path v-if="state(r) !== 'wrong'" :d="`M${NX + NW - 124} ${r.y + 32} l 3 3 5 -6`" class="kt-gen__oktick" />
      <path v-else :d="`M${NX + NW - 123} ${r.y + 29} l 6 6 M ${NX + NW - 117} ${r.y + 29} l -6 6`" class="kt-gen__oktick" />
    </g>
  </svg>
</template>

<style>
.kt-gen { width: 880px; height: auto; overflow: visible; font-family: var(--font-family-sans); }
.kt-gen__fade { opacity: 0; transition: opacity 0.35s; }
.kt-gen__fade.is-on { opacity: 1; }

.kt-gen__beat { opacity: 0.35; transition: opacity 0.3s; }
.kt-gen__beat.is-on { opacity: 1; }
.kt-gen__beatbox { fill: var(--kt-code-bg); stroke: var(--kt-line-strong); stroke-width: 1.5; transition: stroke 0.3s, fill 0.3s; }
.kt-gen__beat.is-now .kt-gen__beatbox { stroke: var(--kt-hot); fill: color-mix(in srgb, var(--kt-hot) 14%, var(--kt-bg)); }
.kt-gen__beatdot { fill: var(--kt-line-strong); transition: fill 0.3s; }
.kt-gen__beat.is-on .kt-gen__beatdot { fill: var(--kt-c-primary); }
.kt-gen__beat.is-now .kt-gen__beatdot { fill: var(--kt-hot); }
.kt-gen__beat.is-passed .kt-gen__beatbox { stroke: var(--kt-good); fill: color-mix(in srgb, var(--kt-good) 14%, var(--kt-bg)); }
.kt-gen__beat.is-passed .kt-gen__beatdot { fill: var(--kt-good); }
.kt-gen__beatnum { font: 800 11px var(--font-family-mono); fill: var(--kt-bg); }
.kt-gen__beatname { font: 700 14px var(--font-family-mono); fill: var(--kt-heading); }

.kt-gen__small { font: 600 12.5px var(--font-family-mono); fill: var(--kt-muted); }

/* the note */
.kt-gen__note { fill: var(--kt-code-bg); stroke: var(--kt-line-strong); stroke-width: 1.8; transition: stroke 0.4s; }
.kt-gen__note.is-open { stroke: var(--kt-c-primary); }
.kt-gen__note.is-failed { stroke: var(--kt-bad); }
.kt-gen__note.is-passed { stroke: var(--kt-good); }
.kt-gen__diamond { fill: color-mix(in srgb, var(--kt-hot) 35%, var(--kt-bg)); stroke: var(--kt-hot); stroke-width: 1.6; }
.kt-gen__ntitle { font-size: 20px; font-weight: 800; fill: var(--kt-heading); }
.kt-gen__closed { transition: opacity 0.4s; }
.kt-gen__closed.is-gone { opacity: 0; }
.kt-gen__blur { fill: var(--kt-line-strong); opacity: 0.5; }
.kt-gen__lock { fill: var(--kt-warn); }
.kt-gen__shackle { fill: none; stroke: var(--kt-warn); stroke-width: 3.5; transition: transform 0.3s; transform-box: fill-box; transform-origin: 100% 100%; }
.kt-gen__shackle.is-open { transform: translateY(-6px) rotate(25deg); }
.kt-gen__reveal { fill: var(--kt-line); transition: fill 0.3s, transform 0.15s; transform-box: fill-box; transform-origin: center; }
.kt-gen__reveal.is-ready { fill: var(--kt-c-primary); }
.kt-gen__reveal.is-pressed { transform: scale(0.92); }
.kt-gen__revealtext { font-size: 14px; font-weight: 800; fill: var(--kt-muted); }
.kt-gen__revealtext.is-ready { fill: var(--kt-bg); }
.kt-gen__row { opacity: 0; transform: translateY(6px); transition: opacity 0.35s, transform 0.35s; }
.kt-gen__row.is-on { opacity: 1; transform: none; }
.kt-gen__arow { fill: color-mix(in srgb, var(--kt-fg) 4%, var(--kt-bg)); stroke: var(--kt-card-line); stroke-width: 1.2; transition: stroke 0.3s; }
.kt-gen__arow.is-got { stroke: var(--kt-good); }
.kt-gen__arow.is-wrong { stroke: var(--kt-bad); }
.kt-gen__arow.is-solved { stroke: var(--kt-good); }
.kt-gen__atext { font-size: 17px; font-weight: 600; fill: var(--kt-fg); }
.kt-gen__mark { transition: fill 0.3s; }
.kt-gen__mark.is-got { fill: var(--kt-good); }
.kt-gen__mark.is-wrong { fill: var(--kt-bad); }
.kt-gen__mark.is-solved { fill: var(--kt-good); }
.kt-gen__marktext { font: 800 12.5px var(--font-family-mono); fill: var(--kt-bg); }

/* the page */
.kt-gen__pad { fill: var(--kt-code-bg); stroke: var(--kt-c-primary-soft); stroke-width: 1.8; transition: stroke 0.3s; }
.kt-gen__pad.is-done { stroke: var(--kt-c-primary); }
.kt-gen__guess { font-size: 20px; font-weight: 600; fill: var(--kt-heading); }
.kt-gen__stamp { opacity: 0; transform: scale(1.4); transform-box: fill-box; transform-origin: center; transition: opacity 0.25s, transform 0.3s cubic-bezier(0.3, 1.6, 0.5, 1); }
.kt-gen__stamp.is-on { opacity: 1; transform: none; }
.kt-gen__stampbox { fill: none; stroke: var(--kt-warn); stroke-width: 1.6; transition: stroke 0.3s; }
.kt-gen__stamptext { font: 800 12.5px var(--font-family-mono); fill: var(--kt-warn); transition: fill 0.3s; }
.kt-gen__stamp.is-passed .kt-gen__stampbox { stroke: var(--kt-good); }
.kt-gen__stamp.is-passed .kt-gen__stamptext { fill: var(--kt-good); }
.kt-gen__fixbox { fill: color-mix(in srgb, var(--kt-hot) 10%, var(--kt-bg)); stroke: var(--kt-hot); stroke-width: 1.5; transition: stroke 0.3s; }
.kt-gen__fixbox.is-solved { stroke: var(--kt-good); }
.kt-gen__fix { font-size: 18px; font-weight: 700; fill: var(--kt-heading); }
.kt-gen__checkbox { fill: var(--kt-code-bg); stroke: var(--kt-c-primary); stroke-width: 1.5; transition: stroke 0.3s; }
.kt-gen__checkbox.is-hint { stroke: var(--kt-warn); }
.kt-gen__checkbox.is-again { stroke: var(--kt-good); }
.kt-gen__checktitle.is-hint { fill: var(--kt-warn); }
.kt-gen__checktitle { font-size: 17px; font-weight: 800; fill: var(--kt-heading); }
.kt-gen__ok { fill: var(--kt-good); transition: fill 0.3s; }
.kt-gen__ok.is-fail { fill: var(--kt-bad); }
.kt-gen__oktick { fill: none; stroke: var(--kt-bg); stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
</style>
