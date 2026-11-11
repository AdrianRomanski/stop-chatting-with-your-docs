<script setup lang="ts">
import { computed } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * Climb step 3, Generate, as `coach generate Distillation` runs it (ai-performance-coach domain generate.ts,
 * application generating.ts; kb-template's "From memory" draw mode is the same flow). Five beats, lit
 * one by one in a bar on top: title only → guess → reveal → mark → check.
 * 1. The concept note, on the right, is closed: only its title shows; its Reveal button is grey,
 *    "guess first" (reveal() before submit() throws).
 * 2. My guess types into the pad on the left, one line per idea; "attempted ✓" is
 *    stamped, yellow; once every mark holds it turns to "passed ✓", green.
 * 3. Reveal turns on and opens the note: three of its real core assertions (as on ConceptNote).
 * 4. I mark each one against my guess: got it, wrong, got it.
 * 5. Gemma 12B, in a box under the assertions, checks every mark: ✓, ✗ on the wrong one, ✓. Then my
 *    correction types in, in my own words (no 6 words copied from the assertion), and Gemma checks
 *    again: it holds, ✗ turns to ✓ and wrong to got it, red to green.
 * No props.
 */
const { t, at } = useTimeline(14)

const B = { title: 0.2, guess: 1.0, reveal: 5.0, mark: 6.9 }
// I mark all three; Gemma checks them: one fails. Then my correction, and Gemma checks it again.
const MARKED = [B.mark + 0.2, B.mark + 0.8, B.mark + 1.4]
const CHECK = B.mark + 2.1
const FIX: [number, number] = [CHECK + 1.4, CHECK + 3.4]
const RECHECK = FIX[1] + 0.5
const beats = [
  { n: 1, name: 'title only', at: B.title },
  { n: 2, name: 'guess', at: B.guess },
  { n: 3, name: 'reveal', at: B.reveal },
  { n: 4, name: 'mark', at: B.mark },
  { n: 5, name: 'check', at: CHECK },
].map((b, i) => ({ ...b, x: i * 176 }))
const beat = computed(() => beats.reduce((n, b) => (at(b.at) ? b.n : n), 0))

// the guess, one line per idea; each line meets one assertion
const lines = ['I bold what I find interesting,', 'then highlight whole paragraphs,', 'and write a summary on top.']
const GX = 0
const GY = 112 // first line's baseline
const LINE = 32
const TYPE: [number, number] = [B.guess + 0.3, B.guess + 3.3]
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
const NX = 488
const NW = 392
const rows = [
  { text: ['The learner identifies interesting', 'text by bolding it.'], mark: 'got' },
  { text: ['The learner then highlights portions', 'of the bolded text.'], mark: 'wrong' },
  { text: ['The learner creates a fourth layer', 'consisting of a summary.'], mark: 'got' },
].map((r, i) => ({
  ...r,
  i,
  y: 98 + i * 64,
  in: B.reveal + 0.7 + i * 0.3,
  marked: MARKED[i],
  checked: CHECK + 0.3 + i * 0.3,
}))
// the second check passes the correction: the wrong one becomes got it
const PASSED = RECHECK + 0.4
const state = (r: { mark: string }) => (r.mark === 'wrong' && at(PASSED) ? 'got' : r.mark)
const fix = 'Only parts of the bold get highlighted, not whole paragraphs.'
const fixTyped = computed(() => fix.slice(0, Math.round(fix.length * Math.min(1, Math.max(0, (t.value - FIX[0]) / (FIX[1] - FIX[0]))))))
</script>

<template>
  <svg class="kt-gen" viewBox="0 0 880 356" role="img"
    aria-label="Generate, with coach generate on the Distillation concept note, in five beats. One, title only: the note is closed, and its reveal button waits: guess first. Two, guess: I type, before I look: I bold what I find interesting, then highlight whole paragraphs, and write a summary on top. Three, reveal: the note opens on three of its core assertions. Four, mark: I mark each one against my guess. Bolding interesting text: got it. Highlighting portions of the bold: wrong, and I correct it in my own words: only parts of the bold get highlighted, not whole paragraphs. A summary as a fourth layer: got it. Five, check: Gemma 12B checks every mark against my guess; the wrong one fails. Then I type my correction, Gemma checks again, wrong turns into got it, and attempted turns into passed.">
    <!-- the five beats -->
    <g v-for="b in beats" :key="b.n" class="kt-gen__beat" :class="{ 'is-on': beat >= b.n, 'is-now': beat === b.n }">
      <rect :x="b.x" y="0" width="168" height="30" rx="15" class="kt-gen__beatbox" />
      <circle :cx="b.x + 16" cy="15" r="10" class="kt-gen__beatdot" />
      <text :x="b.x + 16" y="19" text-anchor="middle" class="kt-gen__beatnum">{{ b.n }}</text>
      <text :x="b.x + 34" y="20" class="kt-gen__beatname">{{ b.name }}</text>
    </g>

    <!-- ── the note, closed until the reveal ── -->
    <g class="kt-gen__fade" :class="{ 'is-on': at(B.title) }">
      <rect :x="NX" y="46" :width="NW" height="304" rx="12" class="kt-gen__note" :class="{ 'is-open': at(B.reveal + 0.5) }" />
      <path :d="`M${NX + 20} 58 l 9 10 l -9 10 l -9 -10 z`" class="kt-gen__diamond" />
      <text :x="NX + 38" y="74" class="kt-gen__ntitle">Distillation</text>
      <text :x="NX + NW - 14" y="73" text-anchor="end" class="kt-gen__small">concept note</text>
    </g>
    <!-- closed: blurred lines, a lock, a grey Reveal -->
    <g class="kt-gen__closed" :class="{ 'is-gone': at(B.reveal + 0.5) }">
      <rect v-for="k in 6" :key="k" :x="NX + 22" :y="98 + k * 26" :width="k % 3 === 0 ? 200 : 300" height="9" rx="4.5" class="kt-gen__blur" />
      <g :transform="`translate(${NX + NW / 2} 200)`">
        <rect x="-15" y="-4" width="30" height="24" rx="5" class="kt-gen__lock" />
        <path d="M-9 -4 v -7 a 9 9 0 0 1 18 0 v 7" class="kt-gen__shackle" :class="{ 'is-open': at(B.reveal + 0.3) }" />
      </g>
    </g>
    <g class="kt-gen__fade" :class="{ 'is-on': at(B.title) && !at(B.reveal + 0.6) }">
      <rect :x="NX + NW / 2 - 50" y="296" width="100" height="30" rx="15" class="kt-gen__reveal" :class="{ 'is-ready': at(ATTEMPT), 'is-pressed': at(B.reveal) }" />
      <text :x="NX + NW / 2" y="315.5" text-anchor="middle" class="kt-gen__revealtext" :class="{ 'is-ready': at(ATTEMPT) }">Reveal</text>
      <text :x="NX + NW / 2" y="342" text-anchor="middle" class="kt-gen__small kt-gen__fade" :class="{ 'is-on': !at(ATTEMPT) }">guess first</text>
    </g>
    <!-- open: the core assertions, marked -->
    <g v-for="r in rows" :key="r.text[0]" class="kt-gen__row" :class="{ 'is-on': at(r.in) }">
      <rect :x="NX + 12" :y="r.y" :width="NW - 24" height="52" rx="9" class="kt-gen__arow" :class="{ [`is-${state(r)}`]: at(r.marked) }" />
      <text v-for="(l, j) in r.text" :key="l" :x="NX + 24" :y="r.y + 22 + j * 17" class="kt-gen__atext">{{ l }}</text>
      <g class="kt-gen__fade" :class="{ 'is-on': at(r.marked) }">
        <rect :x="NX + NW - 94" :y="r.y + 16" width="72" height="20" rx="10" class="kt-gen__mark" :class="`is-${state(r)}`" />
        <text :x="NX + NW - 58" :y="r.y + 30" text-anchor="middle" class="kt-gen__marktext">{{ state(r) === 'got' ? '✓ got it' : '✗ wrong' }}</text>
      </g>
    </g>

    <!-- ── my guess ── -->
    <g class="kt-gen__fade" :class="{ 'is-on': at(B.guess) }">
      <rect :x="GX" y="72" width="440" height="142" rx="12" class="kt-gen__pad" :class="{ 'is-done': at(ATTEMPT) }" />
    </g>
    <text v-for="(l, i) in typed" :key="i" :x="GX + 16" :y="GY + i * LINE" class="kt-gen__guess">{{ l }}</text>
    <g :transform="`translate(${GX + 370} 84)`">
      <g class="kt-gen__stamp" :class="{ 'is-on': at(ATTEMPT), 'is-passed': at(PASSED) }">
        <rect x="-54" y="0" width="108" height="22" rx="5" class="kt-gen__stampbox" />
        <text y="15.5" text-anchor="middle" class="kt-gen__stamptext">{{ at(PASSED) ? 'passed ✓' : 'attempted ✓' }}</text>
      </g>
    </g>

    <!-- the correction, in my own words -->
    <g class="kt-gen__fade" :class="{ 'is-on': at(FIX[0] - 0.2) }">
      <rect :x="GX" y="232" width="440" height="38" rx="10" class="kt-gen__fixbox" />
      <text :x="GX + 14" y="256" class="kt-gen__fix">{{ fixTyped }}</text>
    </g>

    <!-- check: Gemma 12B, in the note under the assertions -->
    <g class="kt-gen__fade" :class="{ 'is-on': at(CHECK) }">
      <rect :x="NX + 12" y="290" :width="NW - 24" height="48" rx="10" class="kt-gen__checkbox" :class="{ 'is-again': at(RECHECK) }" />
      <image href="/images/logos/gemma-mark.png" :x="NX + 22" y="305" width="18" height="18" />
      <text :x="NX + 50" y="310" class="kt-gen__checktitle">{{ at(RECHECK) ? 'Gemma 12B checks again' : 'Gemma 12B checks every mark' }}</text>
      <text :x="NX + 50" y="327" class="kt-gen__small">{{ at(RECHECK) ? 'with my correction' : 'against my guess' }}</text>
    </g>
    <!-- Gemma's result on each row: ✓, or ✗ on the wrong one until the second check -->
    <g v-for="r in rows" :key="`c${r.i}`" class="kt-gen__fade" :class="{ 'is-on': at(r.checked) }">
      <circle :cx="NX + NW - 104" :cy="r.y + 26" r="8" class="kt-gen__ok" :class="{ 'is-fail': state(r) === 'wrong' }" />
      <path v-if="state(r) === 'got'" :d="`M${NX + NW - 108} ${r.y + 26} l 3 3 5 -6`" class="kt-gen__oktick" />
      <path v-else :d="`M${NX + NW - 107} ${r.y + 23} l 6 6 M ${NX + NW - 101} ${r.y + 23} l -6 6`" class="kt-gen__oktick" />
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
.kt-gen__beatnum { font: 800 11px var(--font-family-mono); fill: var(--kt-bg); }
.kt-gen__beatname { font: 700 13px var(--font-family-mono); fill: var(--kt-heading); }

.kt-gen__small { font: 600 11px var(--font-family-mono); fill: var(--kt-muted); }

/* the note */
.kt-gen__note { fill: var(--kt-code-bg); stroke: var(--kt-line-strong); stroke-width: 1.8; transition: stroke 0.4s; }
.kt-gen__note.is-open { stroke: var(--kt-hot); }
.kt-gen__diamond { fill: color-mix(in srgb, var(--kt-hot) 35%, var(--kt-bg)); stroke: var(--kt-hot); stroke-width: 1.6; }
.kt-gen__ntitle { font-size: 17px; font-weight: 800; fill: var(--kt-heading); }
.kt-gen__closed { transition: opacity 0.4s; }
.kt-gen__closed.is-gone { opacity: 0; }
.kt-gen__blur { fill: var(--kt-line-strong); opacity: 0.5; }
.kt-gen__lock { fill: var(--kt-warn); }
.kt-gen__shackle { fill: none; stroke: var(--kt-warn); stroke-width: 3.5; transition: transform 0.3s; transform-box: fill-box; transform-origin: 100% 100%; }
.kt-gen__shackle.is-open { transform: translateY(-6px) rotate(25deg); }
.kt-gen__reveal { fill: var(--kt-line); transition: fill 0.3s, transform 0.15s; transform-box: fill-box; transform-origin: center; }
.kt-gen__reveal.is-ready { fill: var(--kt-c-primary); }
.kt-gen__reveal.is-pressed { transform: scale(0.92); }
.kt-gen__revealtext { font-size: 13px; font-weight: 800; fill: var(--kt-muted); }
.kt-gen__revealtext.is-ready { fill: var(--kt-bg); }
.kt-gen__row { opacity: 0; transform: translateY(6px); transition: opacity 0.35s, transform 0.35s; }
.kt-gen__row.is-on { opacity: 1; transform: none; }
.kt-gen__arow { fill: color-mix(in srgb, var(--kt-fg) 4%, var(--kt-bg)); stroke: var(--kt-card-line); stroke-width: 1.2; transition: stroke 0.3s; }
.kt-gen__arow.is-got { stroke: var(--kt-good); }
.kt-gen__arow.is-wrong { stroke: var(--kt-bad); }
.kt-gen__atext { font-size: 13px; font-weight: 600; fill: var(--kt-fg); }
.kt-gen__mark { transition: fill 0.3s; }
.kt-gen__mark.is-got { fill: var(--kt-good); }
.kt-gen__mark.is-wrong { fill: var(--kt-bad); }
.kt-gen__marktext { font: 800 11px var(--font-family-mono); fill: var(--kt-bg); }

/* my guess */
.kt-gen__pad { fill: var(--kt-code-bg); stroke: var(--kt-c-primary-soft); stroke-width: 1.8; transition: stroke 0.3s; }
.kt-gen__pad.is-done { stroke: var(--kt-c-primary); }
.kt-gen__guess { font-size: 15px; font-weight: 600; fill: var(--kt-heading); }
.kt-gen__stamp { opacity: 0; transform: scale(1.4); transform-box: fill-box; transform-origin: center; transition: opacity 0.25s, transform 0.3s cubic-bezier(0.3, 1.6, 0.5, 1); }
.kt-gen__stamp.is-on { opacity: 1; transform: none; }
.kt-gen__stampbox { fill: none; stroke: var(--kt-warn); stroke-width: 1.6; transition: stroke 0.3s; }
.kt-gen__stamptext { font: 800 11px var(--font-family-mono); fill: var(--kt-warn); transition: fill 0.3s; }
.kt-gen__stamp.is-passed .kt-gen__stampbox { stroke: var(--kt-good); }
.kt-gen__stamp.is-passed .kt-gen__stamptext { fill: var(--kt-good); }
.kt-gen__fixbox { fill: color-mix(in srgb, var(--kt-hot) 10%, var(--kt-bg)); stroke: var(--kt-hot); stroke-width: 1.5; }
.kt-gen__fix { font-size: 12.5px; font-weight: 700; fill: var(--kt-heading); }
.kt-gen__checkbox { fill: var(--kt-code-bg); stroke: var(--kt-c-primary); stroke-width: 1.5; transition: stroke 0.3s; }
.kt-gen__checkbox.is-again { stroke: var(--kt-good); }
.kt-gen__checktitle { font-size: 13.5px; font-weight: 800; fill: var(--kt-heading); }
.kt-gen__ok { fill: var(--kt-good); transition: fill 0.3s; }
.kt-gen__ok.is-fail { fill: var(--kt-bad); }
.kt-gen__oktick { fill: none; stroke: var(--kt-bg); stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
</style>
