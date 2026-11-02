<script setup lang="ts">
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * The three desirable difficulties the coach is built on, each with its own drawn icon:
 * retrieve (a thought pulled out of the brain), explain (a speech bubble filling with your own
 * words), space it out (a calendar whose review marks spread further apart). Each names the part
 * of the system that applies it, so later slides pay it off.
 */
const { at } = useTimeline(4)
const items = [
  { x: 150, label: 'retrieve', by: 'the coach asks' },
  { x: 430, label: 'explain it yourself', by: 'the Feynman check' },
  { x: 710, label: 'space it out', by: 'the judge schedules' },
]
const reviews = [0, 1, 3, 6]
</script>

<template>
  <svg class="kt-diff" viewBox="0 0 860 260" role="img" aria-label="Retrieve, explain it yourself, space it out">
    <g v-for="(it, i) in items" :key="it.label" class="kt-diff__item" :class="{ 'is-on': at(0.3 + i * 0.9) }">
      <circle :cx="it.x" cy="90" r="66" class="kt-diff__ring" />
      <text :x="it.x" y="196" text-anchor="middle" class="kt-diff__label">{{ it.label }}</text>
      <text :x="it.x" y="222" text-anchor="middle" class="kt-diff__by">→ {{ it.by }}</text>
    </g>

    <!-- retrieve: a thought pulled out of the brain -->
    <g class="kt-diff__item" :class="{ 'is-on': at(0.3) }" transform="translate(150 98)">
      <path d="M0 -30 c-20 0 -34 12 -34 28 c0 16 14 28 34 28 c20 0 34 -12 34 -28 c0 -16 -14 -28 -34 -28z M0 -26 v50" class="kt-diff__icon" />
      <path d="M0 -36 V -62" class="kt-diff__pull" :class="{ 'is-on': at(0.8) }" />
      <path d="M-7 -55 L0 -64 L7 -55" class="kt-diff__pull" :class="{ 'is-on': at(0.8) }" />
    </g>

    <!-- explain: your own words filling a bubble -->
    <g class="kt-diff__item" :class="{ 'is-on': at(1.2) }" transform="translate(430 90)">
      <path d="M-38 -26 h76 a10 10 0 0 1 10 10 v34 a10 10 0 0 1 -10 10 h-46 l-16 14 v-14 h-14 a10 10 0 0 1 -10 -10 v-34 a10 10 0 0 1 10 -10z" class="kt-diff__icon" />
      <path d="M-26 -10 h40" class="kt-diff__word" :class="{ 'is-on': at(1.6) }" />
      <path d="M-26 2 h52" class="kt-diff__word" :class="{ 'is-on': at(1.85) }" />
      <path d="M-26 14 h30" class="kt-diff__word" :class="{ 'is-on': at(2.1) }" />
    </g>

    <!-- space it out: reviews spread further apart -->
    <g class="kt-diff__item" :class="{ 'is-on': at(2.1) }" transform="translate(710 90)">
      <rect x="-40" y="-34" width="80" height="70" rx="8" class="kt-diff__icon" />
      <path d="M-40 -18 h80 M-24 -42 v14 M24 -42 v14" class="kt-diff__icon" />
      <circle v-for="(d, j) in reviews" :key="d" :cx="-30 + d * 10" cy="10" r="4" class="kt-diff__mark" :class="{ 'is-on': at(2.5 + j * 0.3) }" />
    </g>
  </svg>
</template>

<style>
.kt-diff {
  width: 860px;
  height: auto;
  font-family: var(--font-family-sans);
}

.kt-diff__item {
  opacity: 0;
  transition: opacity 0.45s;
}

.kt-diff__item.is-on { opacity: 1; }

.kt-diff__ring {
  fill: var(--kt-tint-primary);
  stroke: var(--kt-c-primary);
  stroke-width: 2.5;
}

.kt-diff__icon {
  fill: none;
  stroke: var(--kt-heading);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.kt-diff__pull,
.kt-diff__word {
  fill: none;
  stroke: var(--kt-hot);
  stroke-width: 3.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0;
  transition: opacity 0.3s;
}

.kt-diff__pull.is-on,
.kt-diff__word.is-on { opacity: 1; }

.kt-diff__mark {
  fill: var(--kt-hot);
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
  transform: scale(0.3);
  transition: opacity 0.3s, transform 0.3s;
}

.kt-diff__mark.is-on { opacity: 1; transform: none; }

.kt-diff__label {
  font-size: 21px;
  font-weight: 800;
  fill: var(--kt-heading);
}

.kt-diff__by {
  font: 14px var(--font-family-mono);
  fill: var(--kt-subtle);
}
</style>
