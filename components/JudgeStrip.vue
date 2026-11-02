<script setup lang="ts">
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * The judge demo's setup in one strip, about the judging, not the network. Left, what Argon gets:
 * the challenge, my answer, my claims; "my notes" is struck out, it never leaves. Middle, Argon,
 * the blind judge, weighing it. Right, what comes back: the verdict, the gaps, hand-waving named,
 * the next review. The three land in turn, the arrows between them light up. No props.
 */
const { at } = useTimeline(4)

const gets = ['the challenge', 'my answer', 'my claims']
const back = ['verdict', 'gaps', 'hand-waving', 'next review']
</script>

<template>
  <div class="kt-jstrip" role="img"
    aria-label="Argon gets the challenge, my answer and my claims, never my notes. It judges blind and sends back the verdict, the gaps, any hand-waving, and the next review.">
    <div class="kt-jstrip__card" :class="{ 'is-on': at(0.2) }">
      <div class="kt-jstrip__head">it gets</div>
      <div v-for="(g, i) in gets" :key="g" class="kt-jstrip__chip" :class="{ 'is-on': at(0.4 + i * 0.2) }">{{ g }}</div>
      <div class="kt-jstrip__chip is-never" :class="{ 'is-on': at(1.1), 'is-struck': at(1.4) }">my notes</div>
    </div>

    <div class="kt-jstrip__arrow" :class="{ 'is-on': at(1.7) }">→</div>

    <div class="kt-jstrip__card is-judge" :class="{ 'is-on': at(1.9), 'is-weighing': at(2.3) }">
      <img src="/images/logos/gemini-mark.png" alt="">
      <b>Argon</b>
      <span>blind judge</span>
      <ph-scales-duotone class="kt-jstrip__scale" />
    </div>

    <div class="kt-jstrip__arrow" :class="{ 'is-on': at(2.7) }">→</div>

    <div class="kt-jstrip__card" :class="{ 'is-on': at(2.9) }">
      <div class="kt-jstrip__head">it sends back</div>
      <div v-for="(r, i) in back" :key="r" class="kt-jstrip__chip is-back" :class="{ 'is-on': at(3.1 + i * 0.2) }">{{ r }}</div>
    </div>
  </div>
</template>

<style>
.kt-jstrip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  font-family: var(--font-family-sans);
}

.kt-jstrip__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 210px;
  padding: 16px 14px;
  border: 2px solid var(--kt-line-strong);
  border-radius: 16px;
  background: var(--kt-tint-neutral);
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.4s, transform 0.5s cubic-bezier(0.2, 0.9, 0.3, 1.2), box-shadow 0.5s;
}

.kt-jstrip__card.is-on { opacity: 1; transform: none; }

.kt-jstrip__head {
  font: 700 12px var(--font-family-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--kt-subtle);
}

.kt-jstrip__chip {
  width: 100%;
  box-sizing: border-box;
  padding: 6px 10px;
  border: 1.5px solid var(--kt-line-strong);
  border-radius: 999px;
  background: var(--kt-card);
  font: 600 14px var(--font-family-mono);
  text-align: center;
  color: var(--kt-heading);
  opacity: 0;
  transition: opacity 0.3s, color 0.3s, border-color 0.3s;
}

.kt-jstrip__chip.is-on { opacity: 1; }
.kt-jstrip__chip.is-never.is-struck {
  color: var(--kt-subtle);
  border-style: dashed;
  text-decoration: line-through;
  text-decoration-color: var(--kt-bad);
  text-decoration-thickness: 2px;
}

.kt-jstrip__chip.is-back { border-color: var(--kt-c-secondary); }

/* the judge */
.kt-jstrip__card.is-judge {
  width: 190px;
  padding: 22px 14px;
  border-color: var(--kt-heading);
  background: var(--kt-tint-secondary);
}

.kt-jstrip__card.is-judge img { width: 34px; height: 34px; }
.kt-jstrip__card.is-judge b { font-size: 26px; font-weight: 800; color: var(--kt-heading); }
.kt-jstrip__card.is-judge span { font: 600 13px var(--font-family-mono); color: var(--kt-fg); }
.kt-jstrip__card.is-judge.is-weighing { box-shadow: 0 0 30px color-mix(in srgb, var(--kt-heading) 35%, transparent); }

.kt-jstrip__scale { width: 40px; height: 40px; color: var(--kt-heading); }
.kt-jstrip__card.is-weighing .kt-jstrip__scale { animation: kt-jstrip-weigh 1.6s ease-in-out infinite; }

@keyframes kt-jstrip-weigh {
  0%, 100% { transform: rotate(-6deg); }
  50% { transform: rotate(6deg); }
}

.kt-jstrip__arrow {
  font-size: 30px;
  font-weight: 800;
  color: var(--kt-heading);
  opacity: 0;
  transition: opacity 0.4s;
}

.kt-jstrip__arrow.is-on { opacity: 1; }

@media (prefers-reduced-motion: reduce) {
  .kt-jstrip__scale { animation: none !important; }
}
</style>
