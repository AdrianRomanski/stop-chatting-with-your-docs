<script setup lang="ts">
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * The talk's promise in one picture (talk.md: "Before: hoard, summarize, nod, forget. After:
 * retrieve, explain in your own words, get judged, review on schedule"). Top, PULL: four steps land,
 * then the row greys out and a line strikes through it. Bottom, PUSH: the same four beats,
 * flipped, light up one by one, each naming the part of the talk that does it. No props, no numbers.
 */
const { at } = useTimeline(6)

const pull = [
  { name: 'hoard', icon: 'inbox' },
  { name: 'summarize', icon: 'magic' },
  { name: 'nod', icon: 'like' },
  { name: 'forget', icon: 'ghost' },
]
const push = [
  { name: 'retrieve', by: 'the coach asks', icon: 'retrieve' },
  { name: 'explain', by: 'in my own words', icon: 'speak' },
  { name: 'get judged', by: 'Argon, blind', icon: 'judge' },
  { name: 'review', by: 'on schedule', icon: 'cal' },
]
</script>

<template>
  <div class="kt-p2p" role="img"
    aria-label="Before, pull: hoard, summarize, nod, forget. Struck out. After, push: retrieve, because the coach asks; explain, in my own words; get judged, by Argon, blind; review, on schedule.">
    <!-- PULL -->
    <div class="kt-p2p__row is-pull" :class="{ 'is-on': at(0.2), 'is-dead': at(2.0) }">
      <div class="kt-p2p__label">pull</div>
      <template v-for="(s, i) in pull" :key="s.name">
        <div v-if="i > 0" class="kt-p2p__arrow">→</div>
        <div class="kt-p2p__step" :class="{ 'is-on': at(0.4 + i * 0.25) }">
          <solar-inbox-bold-duotone v-if="s.icon === 'inbox'" />
          <solar-magic-stick-3-bold-duotone v-else-if="s.icon === 'magic'" />
          <solar-like-bold-duotone v-else-if="s.icon === 'like'" />
          <solar-ghost-bold-duotone v-else />
          <b>{{ s.name }}</b>
        </div>
      </template>
      <i class="kt-p2p__strike" />
    </div>

    <div class="kt-p2p__flip" :class="{ 'is-on': at(2.5) }">↓ flip it</div>

    <!-- PUSH -->
    <div class="kt-p2p__row is-push" :class="{ 'is-on': at(2.7) }">
      <div class="kt-p2p__label">push</div>
      <template v-for="(s, i) in push" :key="s.name">
        <div v-if="i > 0" class="kt-p2p__arrow" :class="{ 'is-lit': at(3.0 + i * 0.6) }">→</div>
        <div class="kt-p2p__step" :class="{ 'is-on': at(2.9 + i * 0.6), 'is-lit': at(3.0 + i * 0.6) }">
          <solar-refresh-circle-bold-duotone v-if="s.icon === 'retrieve'" />
          <solar-user-speak-bold-duotone v-else-if="s.icon === 'speak'" />
          <ph-scales-duotone v-else-if="s.icon === 'judge'" />
          <solar-calendar-mark-bold-duotone v-else />
          <b>{{ s.name }}</b>
          <span>{{ s.by }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<style>
.kt-p2p {
  width: 880px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  font-family: var(--font-family-sans);
}

.kt-p2p__row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  opacity: 0;
  transition: opacity 0.4s, filter 0.6s;
}

.kt-p2p__row.is-on { opacity: 1; }

.kt-p2p__label {
  width: 72px;
  flex: none;
  font: 800 15px var(--font-family-mono);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.kt-p2p__row.is-pull .kt-p2p__label { color: var(--kt-muted); }
.kt-p2p__row.is-push .kt-p2p__label { color: var(--kt-hot); }

.kt-p2p__step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  border: 2px solid var(--kt-line-strong);
  border-radius: 14px;
  background: var(--kt-card);
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.35s, transform 0.45s cubic-bezier(0.2, 0.9, 0.3, 1.2), border-color 0.4s, box-shadow 0.4s, background 0.4s;
}

.kt-p2p__step.is-on { opacity: 1; transform: none; }
.kt-p2p__step svg { width: 30px; height: 30px; color: var(--kt-muted); transition: color 0.4s; }
.kt-p2p__step b { font-size: 20px; font-weight: 800; color: var(--kt-heading); }
.kt-p2p__step span { font: 600 12px var(--font-family-mono); color: var(--kt-muted); }

/* pull dies: grey, struck */
.kt-p2p__row.is-dead { filter: grayscale(1); opacity: 0.45; }
.kt-p2p__strike {
  position: absolute;
  left: 72px;
  right: 0;
  top: 50%;
  height: 4px;
  border-radius: 2px;
  background: var(--kt-hot);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.5s ease-out;
}
.kt-p2p__row.is-dead .kt-p2p__strike { transform: scaleX(1); }

/* push lights up, step by step */
.kt-p2p__row.is-push .kt-p2p__step { padding: 14px 8px; }
.kt-p2p__step.is-lit {
  border-color: var(--kt-c-primary);
  background: var(--kt-tint-primary);
  box-shadow: 0 0 22px color-mix(in srgb, var(--kt-c-primary) 40%, transparent);
}
.kt-p2p__step.is-lit svg { color: var(--kt-cool); }

.kt-p2p__arrow { flex: none; font-size: 20px; font-weight: 800; color: var(--kt-line-strong); transition: color 0.4s; }
.kt-p2p__arrow.is-lit { color: var(--kt-c-primary); }

.kt-p2p__flip {
  font: 700 14px var(--font-family-mono);
  letter-spacing: 0.06em;
  color: var(--kt-hot);
  opacity: 0;
  transition: opacity 0.4s;
}

.kt-p2p__flip.is-on { opacity: 1; }
</style>
