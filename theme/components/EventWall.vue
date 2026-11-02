<script setup lang="ts">
import { computed } from 'vue'
import { useTimeline } from '../composables/useTimeline'

/**
 * A fleet as a wall of cells, events flashing across it, a counter climbing beside it (the NG Vienna
 * restart slide: 200 pods, 4,784 restarts a day). One day runs in `duration` seconds when the slide
 * is shown; the cells keep flashing after it.
 * - `cells` (default 200) in `columns` (default 20)
 * - `total`: where the counter ends; `title`: what it counts; `clock`: show the hour of the day
 * - `sub`, `note`: two lines under the counter (`\n` breaks the note)
 * - `tone`: bad (red flashes, default) | good
 * - `stats`: more numbers under the counter, [{ label, value, sub, tone }]
 */
const props = withDefaults(defineProps<{
  cells?: number
  columns?: number
  total: number
  title?: string
  clock?: boolean
  sub?: string
  note?: string
  tone?: 'bad' | 'good'
  stats?: { label: string; value: string; sub?: string; tone?: 'bad' | 'good' | 'neutral' }[]
  duration?: number
}>(), { cells: 200, columns: 20, title: 'events', clock: true, tone: 'bad', stats: () => [], duration: 6 })

const SIZE = 18
const GAP = 6
const rows = computed(() => Math.ceil(props.cells / props.columns))

/* a tiny deterministic generator, so the wall flashes the same way every time */
let seed = 11
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
const cells = Array.from({ length: props.cells }, (_, i) => ({
  i,
  x: (i % props.columns) * (SIZE + GAP),
  y: Math.floor(i / props.columns) * (SIZE + GAP),
  period: 1.6 + rand() * 2.8,
  delay: -rand() * 4,
}))

const { t } = useTimeline(props.duration)
const count = computed(() => Math.round(props.total * Math.min(1, t.value / props.duration)).toLocaleString('en-US'))
const hour = computed(() => String(Math.min(24, Math.floor((t.value / props.duration) * 24))).padStart(2, '0'))
</script>

<template>
  <div class="kt-wall" :class="`kt-wall--${tone}`">
    <svg
      class="kt-wall__cells"
      :viewBox="`0 0 ${columns * (SIZE + GAP) - GAP} ${rows * (SIZE + GAP) - GAP}`"
      role="img"
      :aria-label="`${cells.length} cells, ${title} flashing across them`"
    >
      <rect
        v-for="c in cells"
        :key="c.i"
        :x="c.x"
        :y="c.y"
        :width="SIZE"
        :height="SIZE"
        rx="5"
        :style="{ animationDuration: `${c.period}s`, animationDelay: `${c.delay}s` }"
      />
    </svg>
    <div class="kt-wall__side">
      <div>
        <div class="kt-wall__label">{{ title }}<template v-if="clock"> · {{ hour }}:00</template></div>
        <div class="kt-wall__count" :class="`is-${tone}`">{{ count }}</div>
        <div v-if="sub" class="kt-wall__sub">{{ sub }}</div>
        <div v-if="note" class="kt-wall__note" :class="`is-${tone}`">{{ note }}</div>
      </div>
      <div v-for="s in stats" :key="s.label">
        <div class="kt-wall__label">{{ s.label }}</div>
        <div class="kt-wall__count" :class="`is-${s.tone ?? 'neutral'}`">{{ s.value }}</div>
        <div v-if="s.sub" class="kt-wall__sub">{{ s.sub }}</div>
      </div>
    </div>
  </div>
</template>

<style>
.kt-wall {
  display: grid;
  grid-template-columns: minmax(0, 480px) 300px;
  gap: 60px;
  align-items: center;
  justify-content: center;
  text-align: left;
}

.kt-scheme-dark .kt-wall {
  --kt-wall-cell: var(--color-primary-900);
  --kt-wall-line: var(--color-primary-400);
  --kt-wall-bad: var(--color-secondary-500);
  --kt-wall-bad-line: var(--color-secondary-300);
  --kt-wall-good: var(--color-success-500);
  --kt-wall-good-line: var(--color-success-300);
}

.kt-scheme-light .kt-wall {
  --kt-wall-cell: var(--color-primary-50);
  --kt-wall-line: var(--color-primary-300);
  --kt-wall-bad: var(--color-secondary-600);
  --kt-wall-bad-line: var(--color-secondary-700);
  --kt-wall-good: var(--color-success-500);
  --kt-wall-good-line: var(--color-success-700);
}

.kt-wall__cells {
  width: 100%;
  height: auto;
}

.kt-wall__cells rect {
  fill: var(--kt-wall-cell);
  stroke: var(--kt-wall-line);
  stroke-width: 1.2;
  animation-name: kt-wall-flash-bad;
  animation-iteration-count: infinite;
  animation-timing-function: steps(1, end);
}

.kt-wall--good .kt-wall__cells rect { animation-name: kt-wall-flash-good; }

/* a short flash at the start of every cycle */
@keyframes kt-wall-flash-bad {
  0% { fill: var(--kt-wall-bad); stroke: var(--kt-wall-bad-line); }
  9% { fill: var(--kt-wall-cell); stroke: var(--kt-wall-line); }
}

@keyframes kt-wall-flash-good {
  0% { fill: var(--kt-wall-good); stroke: var(--kt-wall-good-line); }
  9% { fill: var(--kt-wall-cell); stroke: var(--kt-wall-line); }
}

.kt-wall__side {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.kt-wall__label {
  font: 600 12px/1 var(--font-family-mono);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--kt-cool);
}

.kt-wall__count {
  margin-top: 8px;
  font-size: 72px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.045em;
  font-variant-numeric: tabular-nums;
  color: var(--kt-fg);
}

.kt-wall__count.is-bad { color: var(--kt-hot); }
.kt-wall__count.is-good { color: var(--kt-good); }

.kt-wall__sub {
  margin-top: 8px;
  font: 13px var(--font-family-mono);
  color: var(--kt-muted);
}

.kt-wall__note {
  margin-top: 10px;
  white-space: pre-line;
  font: 700 14px/1.35 var(--font-family-mono);
}

.kt-wall__note.is-bad { color: var(--kt-hot); }
.kt-wall__note.is-good { color: var(--kt-good); }

@media (prefers-reduced-motion: reduce) {
  .kt-wall__cells rect { animation: none; }
}
</style>
