<script setup lang="ts">
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * Climb step 6, Space, before its two rounds: the same check as Retrieve (spar offline with Gemma,
 * then the judge, Argon, blind), done again after a gap, and in more than one style.
 * Three day cards land left to right, a "≥ 1 day" gap between them:
 * 1. day 0, Retrieve: spar → judge, failed once, studied, passed (the AnswerGap slide).
 * 2. day 1, Space in the note's own style, feynman: spar ✓ → judge ✓.
 * 3. day 2, Space in a second style: the coach switches to socratic by itself: spar ✓ → judge ✓.
 * Sources: ai-performance-coach ADR-0047 (2026-11-11), docs/guide/the-climb.md "6. Space".
 * The days are illustrative. No props.
 */
const { at } = useTimeline(4.5)

const days = [
  { day: 'day 0', step: 'Retrieve', style: 'feynman', at: 0.2, past: true },
  { day: 'day 1', step: 'Space', style: 'feynman', at: 1.4 },
  { day: 'day 2', step: 'Space', style: 'socratic', at: 2.9 },
]
</script>

<template>
  <div class="kt-sdays" role="img"
    aria-label="Space: the same check as Retrieve, again after a gap. Day 0, Retrieve: spar offline with Gemma, then the judge, Argon, blind. At least a day later, day 1, Space in the note's own style, feynman: spar passed, judge passed. At least a day later, day 2, Space in a second style, socratic: spar passed, judge passed.">
    <div class="kt-sdays__row">
      <template v-for="(d, i) in days" :key="d.day">
        <div v-if="i" class="kt-sdays__gap" :class="{ 'is-on': at(d.at - 0.4) }"><span>≥ 1 day</span><i /></div>
        <div class="kt-sdays__card" :class="{ 'is-on': at(d.at), 'is-past': d.past }">
          <div class="kt-sdays__day">{{ d.day }}</div>
          <div class="kt-sdays__step">{{ d.step }}</div>
          <div class="kt-sdays__style" :class="`is-${d.style}`">{{ d.style }}</div>
          <div class="kt-sdays__pair">
            <span :class="{ 'is-ok': at(d.at + 0.5) }"><img src="/images/logos/gemma-mark.png" alt="">spar<b>✓</b></span>
            <em>→</em>
            <span :class="{ 'is-ok': at(d.at + 0.9) }"><img src="/images/logos/gemini-mark.png" alt="">judge<b>✓</b></span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style>
.kt-sdays { width: 940px; font-family: var(--font-family-sans); display: flex; flex-direction: column; gap: 26px; }
.kt-sdays__row { display: flex; align-items: stretch; }

.kt-sdays__card {
  flex: 1; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 16px;
  min-height: 330px; padding: 26px 24px; border: 2px solid var(--kt-hot); border-radius: 16px; background: var(--kt-card);
  box-shadow: 0 0 22px color-mix(in srgb, var(--kt-hot) 18%, transparent);
  opacity: 0; transform: translateY(8px); transition: opacity 0.4s, transform 0.4s;
}
.kt-sdays__card.is-on { opacity: 1; transform: none; }
.kt-sdays__card.is-past { border-color: var(--kt-line-strong); box-shadow: none; }
.kt-sdays__day { font: 700 17px var(--font-family-mono); text-transform: uppercase; letter-spacing: 0.1em; color: var(--kt-muted); }
.kt-sdays__step { font-size: 42px; font-weight: 800; color: var(--kt-heading); line-height: 1; }
.kt-sdays__card.is-past .kt-sdays__step { color: var(--kt-fg); }
.kt-sdays__style { padding: 4px 14px; border-radius: 999px; font: 700 16px var(--font-family-mono); text-transform: uppercase; letter-spacing: 0.06em; border: 1.5px solid currentColor; }
.kt-sdays__style.is-feynman { color: var(--kt-info); }
.kt-sdays__style.is-socratic { color: var(--kt-hot); }
.kt-sdays__pair { display: flex; flex-direction: column; align-items: stretch; gap: 8px; margin-top: 8px; align-self: stretch; }
.kt-sdays__pair em { font-style: normal; color: var(--kt-muted); text-align: center; line-height: 1; transform: rotate(90deg); }
.kt-sdays__pair span { display: flex; align-items: center; gap: 10px; padding: 9px 14px; border-radius: 12px; border: 2px solid var(--kt-line-strong); font: 700 18px var(--font-family-mono); color: var(--kt-fg); transition: border-color 0.3s; }
.kt-sdays__pair img { width: 24px; height: 24px; }
.kt-sdays__pair b { margin-left: auto; color: var(--kt-good); opacity: 0; transition: opacity 0.3s; }
.kt-sdays__pair span.is-ok { border-color: var(--kt-good); }
.kt-sdays__pair span.is-ok b { opacity: 1; }

.kt-sdays__gap { flex: none; width: 64px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; opacity: 0; transition: opacity 0.4s; }
.kt-sdays__gap.is-on { opacity: 1; }
.kt-sdays__gap span { font: 700 14px var(--font-family-mono); color: var(--kt-warn); white-space: nowrap; }
.kt-sdays__gap i { width: 54px; border-top: 2px dashed var(--kt-warn); position: relative; }
.kt-sdays__gap i::after { content: ''; position: absolute; right: -2px; top: -6px; border: 5px solid transparent; border-left: 7px solid var(--kt-warn); }


@media (prefers-reduced-motion: reduce) {
  .kt-sdays * { transition: none !important; }
}
</style>
