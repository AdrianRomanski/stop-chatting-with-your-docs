<script setup lang="ts">
import { computed } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * The speaker's stress test of the Tier 1 check as a data grid: answer sets as rows, one column of
 * bars per check, each bar the share of rounds with the right verdict. The columns fill one after
 * the other; a bar under `warnBelow` turns warn and glows (the check let that answer set through,
 * or failed a right one); a column with `tone: 'good'` fills green on a tinted band.
 * - `rows`: `{ label, note?, should: 'fail' | 'pass' }[]`: the answer set in the learner's voice,
 *   a dim note after it, and the verdict it should get
 * - `columns`: `{ title, sub?, values: number[], tone?: 'good' }[]`: one per check, `values` in %
 *   in row order, `sub` a mono line under the title (rounds)
 * - `warnBelow`: the % under which a bar glows warn (default 80)
 * - `per100`: show each value as "19 in 100" instead of "19 %" (the same rate, in plain words)
 */
type Row = { label: string; note?: string; should: 'fail' | 'pass' }
type Column = { title: string; sub?: string; values: number[]; tone?: 'good' }

const props = withDefaults(defineProps<{ rows: Row[]; columns: Column[]; warnBelow?: number; per100?: boolean }>(), { warnBelow: 80, per100: false })
const fmt = (v: number) => (props.per100 ? `${v} in 100` : `${v} %`)

const COL_X0 = 330
const COL_W = props.per100 ? 214 : 196
const BAR_W = props.per100 ? 78 : 108
const TOP = 86
const PITCH = 38
const START = 0.9
const COL_BEAT = 1.7

// rows that should fail come first; a gap and a dashed line separate them from the passing ones
const firstPass = computed(() => props.rows.findIndex((r) => r.should === 'pass'))
const rowY = (i: number) => TOP + i * PITCH + (firstPass.value > 0 && i >= firstPass.value ? 16 : 0)
const sepY = computed(() => (firstPass.value > 0 ? rowY(firstPass.value) - PITCH / 2 - 8 : -1))
const height = computed(() => rowY(props.rows.length - 1) + 26)
const width = computed(() => COL_X0 + props.columns.length * COL_W + 6)

const colX = (c: number) => COL_X0 + c * COL_W
const colAt = (c: number) => START + c * COL_BEAT
const barW = (v: number) => Math.max(4, (v / 100) * BAR_W)

const { at } = useTimeline(START + COL_BEAT * 3 + 1.5)
</script>

<template>
  <svg class="kt-ckbench" :viewBox="`0 0 ${width} ${height}`" role="img"
    aria-label="Share of rounds with the right verdict, per answer set and per check">
    <!-- the band behind a 'good' column -->
    <rect v-for="(col, c) in columns" v-show="col.tone === 'good'" :key="`band${c}`"
      :x="colX(c) - 14" y="0" :width="COL_W + 6" :height="height" rx="14"
      class="kt-ckbench__band" :class="{ 'is-on': at(colAt(c)) }" />

    <!-- the label column -->
    <g class="kt-ckbench__part" :class="{ 'is-on': at(0.1) }">
      <text x="0" y="24" class="kt-ckbench__head">my answer</text>
      <text v-if="per100" x="0" y="46" class="kt-ckbench__sub">right verdicts, per 100 rounds</text>
      <text x="306" y="24" text-anchor="end" class="kt-ckbench__head">should</text>
    </g>
    <g v-for="(row, i) in rows" :key="`r${i}`" class="kt-ckbench__part" :class="{ 'is-on': at(0.2 + i * 0.1) }">
      <text x="0" :y="rowY(i) + 6" class="kt-ckbench__label">{{ row.label }}<tspan v-if="row.note" class="kt-ckbench__note"> ({{ row.note }})</tspan></text>
      <text x="306" :y="rowY(i) + 5" text-anchor="end" class="kt-ckbench__should" :class="`is-${row.should}`">{{ row.should }}</text>
    </g>
    <path v-if="sepY > 0" :d="`M0 ${sepY} H ${width}`" class="kt-ckbench__sep kt-ckbench__part" :class="{ 'is-on': at(0.6) }" />

    <!-- one column per check, filling one after the other -->
    <g v-for="(col, c) in columns" :key="`c${c}`" :class="{ 'is-good': col.tone === 'good' }">
      <g class="kt-ckbench__part" :class="{ 'is-on': at(colAt(c) - 0.3) }">
        <text :x="colX(c)" y="24" class="kt-ckbench__title">{{ col.title }}</text>
        <text v-if="col.sub" :x="colX(c)" y="46" class="kt-ckbench__sub">{{ col.sub }}</text>
      </g>
      <g v-for="(v, i) in col.values" :key="`b${c}-${i}`"
        :class="{ 'is-warn': col.tone !== 'good' && v < warnBelow }">
        <rect :x="colX(c)" :y="rowY(i) - 9" :width="BAR_W" height="18" rx="9" class="kt-ckbench__track kt-ckbench__part" :class="{ 'is-on': at(0.3) }" />
        <rect :x="colX(c)" :y="rowY(i) - 9" :width="barW(v)" height="18" rx="9" class="kt-ckbench__bar"
          :class="{ 'is-on': at(colAt(c) + i * 0.08), 'is-glow': at(colAt(c) + 0.9) }" />
        <text :x="colX(c) + BAR_W + 12" :y="rowY(i) + 6" class="kt-ckbench__value kt-ckbench__part"
          :class="{ 'is-on': at(colAt(c) + i * 0.08 + 0.5) }">{{ fmt(v) }}</text>
      </g>
    </g>
  </svg>
</template>

<style>
.kt-ckbench {
  width: 830px;
  height: auto;
  font-family: var(--font-family-sans);
}

.kt-ckbench__part,
.kt-ckbench__band {
  opacity: 0;
  transition: opacity 0.4s;
}

.kt-ckbench__part.is-on { opacity: 1; }
.kt-ckbench__band { fill: var(--kt-tint-success); }
.kt-ckbench__band.is-on { opacity: 1; }

.kt-ckbench__head { font: 600 13px var(--font-family-mono); letter-spacing: var(--kt-track-label); text-transform: uppercase; fill: var(--kt-subtle); }
.kt-ckbench__title { font-size: 17px; font-weight: 800; fill: var(--kt-heading); }
.kt-ckbench__sub { font: 13px var(--font-family-mono); fill: var(--kt-subtle); }

.kt-ckbench__label { font-size: 18px; font-weight: 700; fill: var(--kt-heading); }
.kt-ckbench__note { font-weight: 500; fill: var(--kt-muted); }
.kt-ckbench__should { font: 600 13px var(--font-family-mono); fill: var(--kt-subtle); }
.kt-ckbench__should.is-fail { fill: var(--kt-hot); }

.kt-ckbench__sep {
  stroke: var(--kt-line-strong);
  stroke-width: 1.5;
  stroke-dasharray: 5 6;
}

.kt-ckbench__track { fill: var(--kt-tint-neutral); }

/* a bar grows from the left, then (when it is a miss) glows warn in a calm pulse */
.kt-ckbench__bar {
  fill: var(--kt-c-primary-soft);
  transform-box: fill-box;
  transform-origin: left center;
  transform: scaleX(0);
  transition: transform 0.7s ease-out;
}

.kt-ckbench__bar.is-on { transform: scaleX(1); }
.is-good .kt-ckbench__bar { fill: var(--kt-good); }
.is-warn .kt-ckbench__bar { fill: var(--kt-warn); }
.is-warn .kt-ckbench__bar.is-glow { animation: kt-ckbench-glow 2.4s ease-in-out infinite; }

@keyframes kt-ckbench-glow {
  0%, 100% { filter: drop-shadow(0 0 2px var(--kt-warn)); }
  50% { filter: drop-shadow(0 0 9px var(--kt-warn)); }
}

.kt-ckbench__value { font-size: 18px; font-weight: 800; fill: var(--kt-heading); }
.is-warn .kt-ckbench__value { fill: var(--kt-warn); }
.is-good .kt-ckbench__value { fill: var(--kt-good); }

@media (prefers-reduced-motion: reduce) {
  .is-warn .kt-ckbench__bar.is-glow { animation: none; filter: drop-shadow(0 0 6px var(--kt-warn)); }
}
</style>
