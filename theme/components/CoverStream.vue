<script setup lang="ts">
/**
 * An animated cover background: rows of page cards drifting left to right at different speeds.
 * Brand colors only, calm, loops forever. Use it in the cover's `::bg::` slot.
 */
const palettes = [
  ['var(--color-primary-700)', 'var(--color-secondary-400)'],
  ['var(--color-primary-950)', 'var(--color-primary-300)'],
  ['var(--color-neutral-800)', 'var(--color-secondary-500)'],
  ['var(--color-primary-500)', 'var(--color-neutral-50)'],
  ['var(--color-secondary-800)', 'var(--color-secondary-200)'],
]

let seed = 7
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646

const rows = Array.from({ length: 6 }, (_, r) => ({
  r,
  dur: 50 + rand() * 30,
  delay: -rand() * 40,
  tiles: Array.from({ length: 14 }, (_, i) => ({ i, p: palettes[Math.floor(rand() * palettes.length)], hero: rand() > 0.4 })),
}))
</script>

<template>
  <div class="kt-stream">
    <div v-for="row in rows" :key="row.r" class="kt-stream__row" :style="{ '--dur': `${row.dur}s`, '--delay': `${row.delay}s` }">
      <div v-for="copy in 2" :key="copy" class="kt-stream__set">
        <div v-for="tile in row.tiles" :key="tile.i" class="kt-stream__tile">
          <div class="kt-stream__bar" :style="{ background: tile.p[0] }"><i :style="{ background: tile.p[1] }" /></div>
          <div v-if="tile.hero" class="kt-stream__hero" :style="{ background: tile.p[0] }" />
          <div class="kt-stream__line" />
          <div class="kt-stream__line is-short" />
        </div>
      </div>
    </div>
    <div class="kt-stream__fade" />
  </div>
</template>

<style>
.kt-stream {
  position: absolute;
  inset: -20px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 14px;
  overflow: hidden;
  transform: rotate(-6deg) scale(1.12);
}

.kt-tone-dark .kt-stream { opacity: 0.32; }
.kt-tone-light .kt-stream { opacity: 0.22; }

.kt-stream__row {
  display: flex;
  width: max-content;
  animation: kt-stream var(--dur) linear infinite;
  animation-delay: var(--delay);
}

.kt-stream__set { display: flex; gap: 14px; padding-right: 14px; }

@keyframes kt-stream {
  from { transform: translateX(-50%); }
  to { transform: translateX(0); }
}

.kt-stream__tile {
  width: 104px;
  height: 74px;
  padding: 6px;
  border-radius: 8px;
  background: var(--color-neutral-25);
}

.kt-stream__bar { display: flex; justify-content: flex-end; height: 10px; border-radius: 3px; padding: 2px; }
.kt-stream__bar i { width: 14px; border-radius: 2px; }
.kt-stream__hero { height: 22px; margin-top: 5px; border-radius: 3px; opacity: 0.85; }
.kt-stream__line { height: 5px; margin-top: 5px; border-radius: 2px; background: var(--color-neutral-200); }
.kt-stream__line.is-short { width: 60%; }

/* keep the left (where the title sits) quiet */
.kt-stream__fade {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, var(--kt-bg) 0%, color-mix(in srgb, var(--kt-bg) 70%, transparent) 45%, transparent 85%);
}
</style>
