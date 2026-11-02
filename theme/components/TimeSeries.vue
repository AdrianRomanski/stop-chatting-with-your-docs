<script setup lang="ts">
import { computed, useId } from 'vue'
import { useTimeline } from '../composables/useTimeline'

/**
 * Values over time, as stacked charts on one time axis (the NG Vienna "Same charts. Stable." slide).
 * The lines draw left to right when the slide is shown; the value at the pen sits in the corner.
 * - `rows`: [{ name, unit, values, max, tone, decimals, suffix, format, limit, ghost }]
 *   `values` are evenly spaced samples; `ghost` is an old line behind it, faint and dashed;
 *   `limit` is { value, label }, a red dashed line; tone: primary | secondary | warning | success | neutral
 * - `axis`: labels spread evenly under the charts, e.g. ['0 min', '15 min', '30 min']
 * - `markers`: [{ at: 0..1, label }] — dashed verticals, e.g. a restart or a deploy
 * - `summary`: one line under the axis that appears when the lines are drawn
 * - `duration`: drawing time in seconds (default 5)
 * Line charts are for values over time only; anything else is a bar chart.
 */
type Row = {
  name: string
  unit?: string
  values: number[]
  max: number
  tone?: 'primary' | 'secondary' | 'warning' | 'success' | 'neutral'
  decimals?: number
  suffix?: string
  format?: (v: number) => string
  limit?: { value: number; label?: string }
  ghost?: number[]
}

const props = withDefaults(defineProps<{
  rows: Row[]
  axis?: string[]
  markers?: { at: number; label?: string }[]
  summary?: string
  duration?: number
}>(), { axis: () => [], markers: () => [], duration: 5 })

const id = useId()
const { t } = useTimeline(props.duration + 0.6)
const now = computed(() => Math.min(1, Math.max(0, (t.value - 0.2) / props.duration)))

const X0 = 170
const X1 = 860
const H = 76
const STRIDE = 100
const top = (i: number) => 20 + i * STRIDE
const height = computed(() => top(props.rows.length) + (props.summary ? 52 : 26))
const x = (f: number) => X0 + f * (X1 - X0)
const axisY = computed(() => top(props.rows.length) - 8)

function points(row: Row, i: number, values: number[]) {
  const n = Math.max(2, values.length)
  return values.map((v, k) => [x(k / (n - 1)), top(i) + H - (Math.min(v, row.max) / row.max) * H] as [number, number])
}

/* monotone cubic (Fritsch–Carlson): smooth, but never overshoots the data */
function smooth(p: [number, number][]) {
  if (p.length < 3) return p.map((q, k) => `${k ? 'L' : 'M'}${q[0]} ${q[1]}`).join(' ')
  const d = p.slice(0, -1).map((q, k) => (p[k + 1][1] - q[1]) / (p[k + 1][0] - q[0]))
  const m = p.map((_, k) => (k === 0 ? d[0] : k === p.length - 1 ? d[k - 1] : d[k - 1] * d[k] > 0 ? (d[k - 1] + d[k]) / 2 : 0))
  d.forEach((dk, k) => {
    if (dk === 0) { m[k] = 0; m[k + 1] = 0; return }
    const a = m[k] / dk
    const b = m[k + 1] / dk
    const s = a * a + b * b
    if (s > 9) { const tau = 3 / Math.sqrt(s); m[k] = tau * a * dk; m[k + 1] = tau * b * dk }
  })
  let path = `M${p[0][0]} ${p[0][1]}`
  for (let k = 0; k < p.length - 1; k++) {
    const h = (p[k + 1][0] - p[k][0]) / 3
    path += ` C${p[k][0] + h} ${p[k][1] + m[k] * h} ${p[k + 1][0] - h} ${p[k + 1][1] - m[k + 1] * h} ${p[k + 1][0]} ${p[k + 1][1]}`
  }
  return path
}

function valueAt(values: number[], f: number) {
  const pos = f * (values.length - 1)
  const k = Math.min(values.length - 2, Math.floor(pos))
  return values[k] + (values[k + 1] - values[k]) * (pos - k)
}

function label(row: Row, v: number) {
  if (row.format) return row.format(v)
  return `${v.toLocaleString('en', { minimumFractionDigits: row.decimals ?? 0, maximumFractionDigits: row.decimals ?? 0 })}${row.suffix ?? ''}`
}

const charts = computed(() => props.rows.map((row, i) => ({
  row,
  top: top(i),
  line: smooth(points(row, i, row.values)),
  ghost: row.ghost ? points(row, i, row.ghost).map((q, k) => `${k ? 'L' : 'M'}${q[0]} ${q[1]}`).join(' ') : '',
  limitY: row.limit ? top(i) + H - (row.limit.value / row.max) * H : 0,
  current: label(row, valueAt(row.values, now.value)),
})))
</script>

<template>
  <svg class="kt-ts" :viewBox="`0 0 880 ${height}`" role="img" :aria-label="rows.map(r => r.name).join(', ') + ' over time'">
    <defs>
      <clipPath :id="`${id}-pen`"><rect x="0" y="0" :width="x(now)" :height="height" /></clipPath>
    </defs>

    <g v-for="c in charts" :key="c.row.name" :class="`kt-ts--${c.row.tone ?? 'primary'}`">
      <text x="0" :y="c.top + 34" class="kt-ts__name">{{ c.row.name }}</text>
      <text v-if="c.row.unit" x="0" :y="c.top + 54" class="kt-ts__unit">{{ c.row.unit }}</text>
      <rect :x="X0" :y="c.top" :width="X1 - X0" :height="H" class="kt-ts__frame" />
      <template v-if="c.row.limit">
        <line :x1="X0" :x2="X1" :y1="c.limitY" :y2="c.limitY" class="kt-ts__limit" />
        <text :x="X1 - 6" :y="c.limitY - 6" text-anchor="end" class="kt-ts__limit-text">{{ c.row.limit.label }}</text>
      </template>
      <path v-if="c.ghost" :d="c.ghost" class="kt-ts__ghost" />
      <path :d="c.line" class="kt-ts__line" :clip-path="`url(#${id}-pen)`" />
      <text :x="X0 + 8" :y="c.top + 18" class="kt-ts__now">{{ c.current }}</text>
    </g>

    <g v-for="m in markers" :key="m.at" class="kt-ts__marker" :class="{ 'is-on': now >= m.at }">
      <line :x1="x(m.at)" :x2="x(m.at)" y1="12" :y2="axisY" />
      <text v-if="m.label" :x="x(m.at) - 6" :y="axisY + 20" text-anchor="end">{{ m.label }}</text>
    </g>

    <g v-for="(a, k) in axis" :key="a">
      <line :x1="x(axis.length > 1 ? k / (axis.length - 1) : 0)" :x2="x(axis.length > 1 ? k / (axis.length - 1) : 0)" :y1="axisY" :y2="axisY + 6" class="kt-ts__tick" />
      <text
        :x="x(axis.length > 1 ? k / (axis.length - 1) : 0)"
        :y="axisY + 20"
        :text-anchor="k === 0 ? 'start' : k === axis.length - 1 ? 'end' : 'middle'"
        class="kt-ts__axis"
      >{{ a }}</text>
    </g>

    <text v-if="summary" x="0" :y="height - 12" class="kt-ts__summary" :class="{ 'is-on': now >= 1 }">{{ summary }}</text>
  </svg>
</template>

<style>
.kt-ts {
  display: block;
  width: 100%;
  height: auto;
  font-family: var(--font-family-sans);
}

.kt-scheme-dark .kt-ts {
  --kt-ts-primary: var(--color-primary-300);
  --kt-ts-secondary: var(--color-secondary-400);
  --kt-ts-warning: var(--color-warning-400);
  --kt-ts-success: var(--color-success-400);
  --kt-ts-neutral: var(--color-neutral-300);
}

.kt-scheme-light .kt-ts {
  --kt-ts-primary: var(--color-primary-600);
  --kt-ts-secondary: var(--color-secondary-600);
  --kt-ts-warning: var(--color-warning-500);
  --kt-ts-success: var(--color-success-600);
  --kt-ts-neutral: var(--color-neutral-500);
}

.kt-ts--primary { --kt-ts-tone: var(--kt-ts-primary); }
.kt-ts--secondary { --kt-ts-tone: var(--kt-ts-secondary); }
.kt-ts--warning { --kt-ts-tone: var(--kt-ts-warning); }
.kt-ts--success { --kt-ts-tone: var(--kt-ts-success); }
.kt-ts--neutral { --kt-ts-tone: var(--kt-ts-neutral); }

.kt-ts__name {
  font-size: 22px;
  font-weight: 800;
  fill: var(--kt-heading);
}

.kt-ts__unit {
  font: 12px var(--font-family-mono);
  fill: var(--kt-subtle);
}

.kt-ts__frame {
  fill: var(--kt-card);
  stroke: var(--kt-line);
}

.kt-ts__limit {
  stroke: var(--kt-bad);
  stroke-width: 1.5;
  stroke-dasharray: 6 5;
}

.kt-ts__limit-text {
  font: 600 11px var(--font-family-mono);
  fill: var(--kt-bad);
}

.kt-ts__ghost {
  fill: none;
  stroke: color-mix(in srgb, var(--kt-fg) 20%, transparent);
  stroke-width: 2;
  stroke-dasharray: 4 4;
}

.kt-ts__line {
  fill: none;
  stroke: var(--kt-ts-tone);
  stroke-width: 3;
  stroke-linejoin: round;
  stroke-linecap: round;
}

.kt-ts__now {
  font: 700 13px var(--font-family-mono);
  fill: var(--kt-ts-tone);
}

.kt-ts__marker line {
  stroke: var(--kt-muted);
  stroke-width: 1.5;
  stroke-dasharray: 3 4;
}

.kt-ts__marker text {
  font: 12px var(--font-family-mono);
  fill: var(--kt-muted);
}

.kt-ts__marker {
  opacity: 0;
  transition: opacity 0.3s;
}

.kt-ts__marker.is-on { opacity: 1; }

.kt-ts__tick { stroke: var(--kt-line-strong); }

.kt-ts__axis {
  font: 12px var(--font-family-mono);
  fill: var(--kt-subtle);
}

.kt-ts__summary {
  font: 700 15px var(--font-family-mono);
  fill: var(--kt-fg);
  opacity: 0;
  transition: opacity 0.4s;
}

.kt-ts__summary.is-on { opacity: 1; }
</style>
