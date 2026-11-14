<script setup lang="ts">
import { computed } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * One spaced round of climb step 6, Space, on Distillation: one slide per style, after SpaceDays.
 * On top: the day, `coach spar Distillation` and the style it runs in. Then, one by one:
 * 1. Gemma's question, in that style (offline), and my answer, from memory, note closed.
 * 2. Tier 1, Gemma 12B checks the core assertions: ✓ pass.
 * 3. Tier 2, Argon, online, blind: gets the concept, the question and my answer, not the notes: ✓ no gaps.
 * 4. At the foot, the spaced styles passed so far, two pips: feynman, then socratic. The second
 *    style is the coach's own pick (ADR-0047: socratic, or feynman when the note is socratic).
 * The questions and answers are illustrative, not a recorded session (see the slide notes).
 * - `kind`: the style, feynman (day 1, the note's own style) | socratic (day 2, the second style)
 */
const props = defineProps<{ kind: 'feynman' | 'socratic' }>()

const ROUNDS = {
  feynman: {
    day: 'day 1',
    why: 'the note’s own style',
    q: 'Without the words “progressive” or “summary”: how do you make a long note readable in ten seconds?',
    a: 'Every time a project brings me back to the note, I bold the best sentences, then highlight the best of the bold, then write two lines on top in my own words. Each pass keeps a small part of the one before.',
    passed: 1,
  },
  socratic: {
    day: 'day 2',
    why: 'the coach switched the style',
    q: 'If thin layers save so much time, why not distill every note the day you save it?',
    a: 'Because most notes never come back. Distilling up front is work for a project that may never happen, so I add a layer only when a real project opens the note. Where that rule stops: a note I know I’ll need tomorrow.',
    passed: 2,
  },
}

const r = computed(() => ROUNDS[props.kind])
const { at } = useTimeline(8)
const B = { q: 0.3, a: 1.6, t1: 3.6, t2: 4.6, pips: 5.8 }
const STYLES = ['feynman', 'socratic']
const label = computed(() => `Space, ${r.value.day}, coach spar Distillation in the ${props.kind} style, ${r.value.why}. Gemma asks: ${r.value.q} My answer, from memory: ${r.value.a} Tier 1, Gemma 12B: pass. Tier 2, Argon, blind, no notes: pass, no gaps. Spaced styles passed: ${STYLES.slice(0, r.value.passed).join(' and ')}, ${r.value.passed} of 2.`)
</script>

<template>
  <div class="kt-sround2" :class="`is-${kind}`" role="img" :aria-label="label">
    <div class="kt-sround2__top">
      <span class="kt-sround2__day">{{ r.day }}</span>
      <code>coach spar Distillation</code>
      <span class="kt-sround2__style">{{ kind }}</span>
      <em>{{ r.why }}</em>
    </div>

    <div class="kt-sround2__turn is-coach" :class="{ 'is-on': at(B.q) }">
      <img src="/images/logos/gemma-mark.png" alt="">
      <span><small>gemma · offline</small>{{ r.q }}</span>
    </div>
    <div class="kt-sround2__turn is-me" :class="{ 'is-on': at(B.a) }">
      <img src="/images/speaker.webp" alt="">
      <span><small>my answer · note closed</small>{{ r.a }}</span>
    </div>

    <div class="kt-sround2__verdicts">
      <div class="kt-sround2__verdict" :class="{ 'is-on': at(B.t1) }">
        <img src="/images/logos/gemma-mark.png" alt="">
        <div><small>tier 1 · Gemma 12B</small>core assertions</div>
        <b>✓ pass</b>
      </div>
      <div class="kt-sround2__verdict" :class="{ 'is-on': at(B.t2) }">
        <img src="/images/logos/gemini-mark.png" alt="">
        <div><small>tier 2 · Argon · blind</small>no notes, only my answer</div>
        <b>✓ no gaps</b>
      </div>
    </div>

    <div class="kt-sround2__pips" :class="{ 'is-on': at(B.pips) }">
      <span class="kt-sround2__pipslabel">spaced styles passed</span>
      <span v-for="(s, i) in STYLES" :key="s" class="kt-sround2__pip" :class="[`is-${s}`, { 'is-done': i < r.passed }]">{{ i < r.passed ? '●' : '○' }} {{ s }}</span>
      <span class="kt-sround2__count">{{ r.passed }} / 2<template v-if="r.passed >= 2"> · Teach opens</template></span>
    </div>
  </div>
</template>

<style>
.kt-sround2 { --tone: var(--kt-info); width: 920px; font-family: var(--font-family-sans); display: flex; flex-direction: column; gap: 10px; }
.kt-sround2.is-socratic { --tone: var(--kt-hot); }

.kt-sround2__top { display: flex; align-items: center; gap: 12px; }
.kt-sround2__day { padding: 3px 12px; border-radius: 999px; background: var(--kt-warn); color: var(--kt-bg); font: 800 13px var(--font-family-mono); text-transform: uppercase; letter-spacing: 0.08em; }
.kt-sround2__top code { font: 600 14px var(--font-family-mono); color: var(--kt-fg); background: none !important; padding: 0 !important; }
.kt-sround2__style { padding: 2px 12px; border-radius: 999px; border: 1.5px solid var(--tone); color: var(--tone); font: 700 13px var(--font-family-mono); text-transform: uppercase; letter-spacing: 0.06em; }
.kt-sround2__top em { margin-left: auto; font: 600 13px var(--font-family-mono); font-style: normal; color: var(--kt-muted); }

.kt-sround2__turn { display: flex; align-items: flex-start; gap: 10px; opacity: 0; transform: translateY(8px); transition: opacity 0.4s, transform 0.4s; }
.kt-sround2__turn.is-on { opacity: 1; transform: none; }
.kt-sround2__turn.is-coach { padding-right: 60px; }
.kt-sround2__turn.is-me { flex-direction: row-reverse; padding-left: 60px; }
.kt-sround2__turn img { flex: none; width: 34px; height: 34px; margin-top: 4px; border-radius: 50%; object-fit: cover; }
.kt-sround2__turn span { padding: 8px 15px; border-radius: 14px; font-size: 17px; line-height: 1.38; }
.kt-sround2__turn small { display: block; margin-bottom: 2px; font: 700 12px var(--font-family-mono); text-transform: uppercase; letter-spacing: 0.06em; color: var(--kt-muted); }
.kt-sround2__turn.is-coach span { border: 1.5px solid var(--tone); border-top-left-radius: 3px; background: color-mix(in srgb, var(--tone) 12%, transparent); color: var(--kt-heading); font-weight: 700; }
.kt-sround2__turn.is-coach small { color: var(--tone); }
.kt-sround2__turn.is-me span { border-top-right-radius: 3px; background: var(--kt-tint-secondary); color: var(--kt-fg); font-weight: 600; }

.kt-sround2__verdicts { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 2px; }
.kt-sround2__verdict { display: flex; align-items: center; gap: 12px; padding: 9px 14px; border: 1.5px solid var(--kt-good); border-radius: 12px; background: color-mix(in srgb, var(--kt-good) 8%, transparent); opacity: 0; transform: scale(0.96); transition: opacity 0.35s, transform 0.35s; }
.kt-sround2__verdict.is-on { opacity: 1; transform: none; }
.kt-sround2__verdict img { width: 26px; height: 26px; }
.kt-sround2__verdict div { flex: 1; font-size: 15px; font-weight: 600; color: var(--kt-fg); }
.kt-sround2__verdict small { display: block; font: 700 12px var(--font-family-mono); text-transform: uppercase; letter-spacing: 0.06em; color: var(--kt-muted); }
.kt-sround2__verdict b { padding: 2px 10px; border-radius: 999px; background: var(--kt-good); color: var(--kt-bg); font: 800 13px var(--font-family-mono); white-space: nowrap; }

.kt-sround2__pips { display: flex; align-items: center; gap: 14px; margin-top: 4px; font: 700 14px var(--font-family-mono); opacity: 0; transition: opacity 0.4s; }
.kt-sround2__pips.is-on { opacity: 1; }
.kt-sround2__pipslabel { color: var(--kt-muted); text-transform: uppercase; letter-spacing: 0.06em; font-size: 12px; }
.kt-sround2__pip { color: var(--kt-muted); }
.kt-sround2__pip.is-done.is-feynman { color: var(--kt-info); }
.kt-sround2__pip.is-done.is-socratic { color: var(--kt-hot); }
.kt-sround2__count { margin-left: auto; color: var(--kt-warn); }

@media (prefers-reduced-motion: reduce) {
  .kt-sround2 * { transition: none !important; }
}
</style>
