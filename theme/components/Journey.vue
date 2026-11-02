<script setup lang="ts">
import { computed } from 'vue'
import { useTimeline } from '../composables/useTimeline'

/**
 * The phases of the story as numbered stops on one line, the current one lit (the NG Vienna phase
 * slides). Open every phase with it: the same `stops`, the next `at`. When the slide is shown, the
 * line grows from the previous stop to the current one, and the current stop lights up as it arrives.
 * - `stops`: the phase names, short and lowercase
 * - `at`: the current phase, an index into `stops`
 * - `from`: the number of the first stop (default 0, "phase 0")
 */
const props = withDefaults(defineProps<{
  stops: string[]
  at?: number
  from?: number
}>(), { at: 0, from: 0 })

const { t } = useTimeline(1)

/* how far the line has grown from the previous stop to this one, 0..1 */
const progress = computed(() => 1 - (1 - Math.min(1, Math.max(0, (t.value - 0.1) / 0.6))) ** 3)

/* share of the line, first stop to last, that is filled */
const fill = computed(() => {
  if (props.stops.length < 2) return 0
  const prev = Math.max(0, props.at - 1)
  return (prev + (props.at - prev) * progress.value) / (props.stops.length - 1)
})

/* the stop lights up as the line reaches it */
const lit = computed(() => (props.at === 0 ? t.value >= 0.1 : progress.value >= 0.9))
</script>

<template>
  <div class="kt-journey" :style="{ '--kt-journey-n': stops.length, '--kt-journey-fill': fill }">
    <div class="kt-journey__line"><div class="kt-journey__fill" /></div>
    <div
      v-for="(name, i) in stops"
      :key="name"
      class="kt-journey__stop"
      :class="{ 'is-done': i < at, 'is-at': i === at && lit }"
    >
      <div class="kt-journey__dot">{{ i + from }}</div>
      <div class="kt-journey__name">{{ name }}</div>
    </div>
  </div>
</template>

<style>
.kt-journey {
  position: relative;
  display: grid;
  grid-template-columns: repeat(var(--kt-journey-n), minmax(0, 1fr));
  width: min(100%, 760px);
  margin: 0 auto;
  --kt-journey-dim: color-mix(in srgb, var(--kt-fg) 55%, transparent);
}

/* from the centre of the first stop to the centre of the last */
.kt-journey__line {
  position: absolute;
  top: 22px;
  left: calc(50% / var(--kt-journey-n));
  right: calc(50% / var(--kt-journey-n));
  height: 3px;
  border-radius: 2px;
  background: color-mix(in srgb, var(--kt-fg) 22%, transparent);
}

.kt-journey__fill {
  width: calc(var(--kt-journey-fill) * 100%);
  height: 100%;
  border-radius: inherit;
  background: var(--kt-fg);
}

.kt-journey__stop {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.kt-journey__dot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  font: 700 18px/1 var(--font-family-mono);
  color: var(--kt-journey-dim);
  background: var(--kt-bg);
  border: 2px solid color-mix(in srgb, var(--kt-fg) 35%, transparent);
  transition: background 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}

/* the number takes the slide's background color: purple on accent-1, dark on light, ... */
.kt-journey__stop.is-done .kt-journey__dot {
  color: var(--kt-bg);
  background: color-mix(in srgb, var(--kt-fg) 85%, transparent);
  border-color: transparent;
}

.kt-journey__stop.is-at .kt-journey__dot {
  color: var(--kt-bg);
  background: var(--kt-fg);
  border-color: var(--kt-fg);
  box-shadow: 0 0 0 8px color-mix(in srgb, var(--kt-fg) 18%, transparent);
  animation: kt-journey-pulse 1.8s ease-in-out infinite;
}

@keyframes kt-journey-pulse {
  50% { box-shadow: 0 0 0 15px color-mix(in srgb, var(--kt-fg) 6%, transparent); }
}

.kt-journey__name {
  margin-top: 16px;
  padding: 0 6px;
  text-align: center;
  text-wrap: balance;
  font: 600 13px/1.35 var(--font-family-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--kt-journey-dim);
  transition: color 0.3s ease;
}

.kt-journey__stop.is-at .kt-journey__name { color: var(--kt-fg); }

@media (prefers-reduced-motion: reduce) {
  .kt-journey__stop.is-at .kt-journey__dot { animation: none; }
}
</style>
