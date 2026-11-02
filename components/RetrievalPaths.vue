<script setup lang="ts">
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * Two ways back to an idea. Top lane: re-read the summary, effort low, the memory trace appears
 * and fades. Bottom lane: pull it from memory, effort high, the trace grows thick and stays.
 * Effort meters are qualitative (5 segments), not data.
 */
const { at } = useTimeline(4)
const segments = [0, 1, 2, 3, 4]
</script>

<template>
  <svg class="kt-paths" viewBox="0 0 860 300" role="img" aria-label="Re-reading feels easy and fades; retrieving from memory feels hard and sticks">
    <!-- column labels -->
    <text x="300" y="24" text-anchor="middle" class="kt-paths__col">effort</text>
    <text x="640" y="24" text-anchor="middle" class="kt-paths__col">memory trace</text>

    <!-- lane 1 · re-read -->
    <g class="kt-paths__lane" :class="{ 'is-on': at(0.2) }">
      <rect x="20" y="52" width="190" height="76" rx="12" class="kt-paths__act is-easy" />
      <text x="115" y="86" text-anchor="middle" class="kt-paths__name">re-read</text>
      <text x="115" y="110" text-anchor="middle" class="kt-paths__sub">the summary</text>
      <rect v-for="i in segments" :key="`e${i}`" :x="236 + i * 26" y="76" width="20" height="28" rx="4"
        class="kt-paths__seg" :class="{ 'is-lit': i < 1 && at(0.6) }" />
      <text x="300" y="140" text-anchor="middle" class="kt-paths__note">feels easy</text>
      <path d="M420 90 H 850" class="kt-paths__trace is-thin" :class="{ 'is-on': at(1), 'is-gone': at(2.6) }" />
      <text x="860" y="140" text-anchor="end" class="kt-paths__verdict is-bad" :class="{ 'is-on': at(2.8) }">fades</text>
    </g>

    <!-- lane 2 · retrieve -->
    <g class="kt-paths__lane" :class="{ 'is-on': at(1.4) }">
      <rect x="20" y="182" width="190" height="76" rx="12" class="kt-paths__act is-hard" />
      <text x="115" y="216" text-anchor="middle" class="kt-paths__name">pull it</text>
      <text x="115" y="240" text-anchor="middle" class="kt-paths__sub">from memory</text>
      <rect v-for="i in segments" :key="`h${i}`" :x="236 + i * 26" y="206" width="20" height="28" rx="4"
        class="kt-paths__seg is-hard" :class="{ 'is-lit': i < 4 && at(1.8 + i * 0.15) }" />
      <text x="300" y="270" text-anchor="middle" class="kt-paths__note">feels hard</text>
      <path d="M420 220 H 850" class="kt-paths__trace is-thick" :class="{ 'is-on': at(2.6) }" />
      <text x="860" y="270" text-anchor="end" class="kt-paths__verdict is-good" :class="{ 'is-on': at(3.4) }">sticks</text>
    </g>
  </svg>
</template>

<style>
.kt-paths {
  width: 860px;
  height: auto;
  font-family: var(--font-family-sans);
}

.kt-paths__col {
  font: 13px var(--font-family-mono);
  fill: var(--kt-subtle);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.kt-paths__lane {
  opacity: 0;
  transition: opacity 0.4s;
}

.kt-paths__lane.is-on { opacity: 1; }

.kt-paths__act {
  stroke-width: 2;
}

.kt-paths__act.is-easy { fill: var(--kt-tint-secondary); stroke: var(--kt-c-secondary); }
.kt-paths__act.is-hard { fill: var(--kt-tint-primary); stroke: var(--kt-c-primary); }

.kt-paths__name {
  font-size: 24px;
  font-weight: 800;
  fill: var(--kt-heading);
}

.kt-paths__sub,
.kt-paths__note {
  font: 14px var(--font-family-mono);
  fill: var(--kt-subtle);
}

.kt-paths__seg {
  fill: var(--kt-c-track);
  transition: fill 0.3s;
}

.kt-paths__seg.is-lit { fill: var(--kt-c-secondary-soft); }
.kt-paths__seg.is-hard.is-lit { fill: var(--kt-c-primary); }

.kt-paths__trace {
  fill: none;
  stroke-linecap: round;
  stroke-dasharray: 440;
  stroke-dashoffset: 440;
  transition: stroke-dashoffset 1.2s ease-out, opacity 1.2s;
}

.kt-paths__trace.is-on { stroke-dashoffset: 0; }
.kt-paths__trace.is-thin { stroke: var(--kt-c-secondary-soft); stroke-width: 4; }
.kt-paths__trace.is-thin.is-gone { opacity: 0.12; }
.kt-paths__trace.is-thick { stroke: var(--kt-c-primary); stroke-width: 16; }

.kt-paths__verdict {
  font-size: 26px;
  font-weight: 800;
  opacity: 0;
  transition: opacity 0.4s;
}

.kt-paths__verdict.is-on { opacity: 1; }
.kt-paths__verdict.is-bad { fill: var(--kt-bad); }
.kt-paths__verdict.is-good { fill: var(--kt-good); }
</style>
