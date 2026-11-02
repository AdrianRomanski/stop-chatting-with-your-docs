<script setup lang="ts">
import { computed } from 'vue'
import { useTimeline } from '../composables/useTimeline'

/**
 * Horizontal bars made of two parts each, with a legend (Base theme: "Grouped Stacked Bar").
 * Example: CPU time inside execution time, before and after.
 * - `legend`: names of the two parts, e.g. ['CPU time', 'Execution time']
 * - `rows`: [{ label, parts: [inner, outer], tone, total? }] — tone: primary | secondary
 * - `unit`, `max`, `ticks`
 */
type Row = { label: string; parts: [number, number]; tone?: 'primary' | 'secondary'; total?: string }
const props = withDefaults(defineProps<{ rows: Row[]; legend: [string, string]; unit?: string; max?: number; ticks?: number }>(), { unit: '', ticks: 6 })

const max = computed(() => props.max ?? Math.ceil(Math.max(...props.rows.map(r => r.parts[1])) / 20) * 20)
const tickValues = computed(() => Array.from({ length: props.ticks + 1 }, (_, i) => Math.round((max.value / props.ticks) * i)))
const { at } = useTimeline(2)
</script>

<template>
  <div class="kt-gbars">
    <div class="kt-gbars__legend">
      <span><i class="kt-fill--secondary-soft" /><i class="kt-fill--primary-soft" />{{ legend[1] }}</span>
      <span><i class="kt-fill--secondary" /><i class="kt-fill--primary" />{{ legend[0] }}</span>
    </div>
    <div v-for="(r, i) in rows" :key="r.label" class="kt-gbars__row">
      <span class="kt-gbars__label">{{ r.label }}</span>
      <div class="kt-gbars__lane">
        <div class="kt-gbars__track">
          <div class="kt-gbars__outer kt-grow" :class="`kt-fill--${r.tone ?? 'primary'}-soft`" :style="{ width: at(0.2 + i * 0.2) ? `${(r.parts[1] / max) * 100}%` : '0%' }" />
          <div class="kt-gbars__inner kt-grow" :class="`kt-fill--${r.tone ?? 'primary'}`" :style="{ width: at(0.5 + i * 0.2) ? `${(r.parts[0] / max) * 100}%` : '0%' }" />
          <span class="kt-gbars__total" :class="`kt-text--${r.tone ?? 'primary'}`" :style="{ left: `calc(${(r.parts[1] / max) * 100}% + 12px)` }">{{ r.total ?? `${r.parts[1]}${unit}` }}</span>
        </div>
      </div>
    </div>
    <div class="kt-gbars__ticks">
      <span v-for="t in tickValues" :key="t" :style="{ left: `${(t / max) * 100}%` }">{{ t }}{{ unit }}</span>
    </div>
  </div>
</template>

<style>
.kt-gbars { position: relative; display: flex; flex-direction: column; gap: 18px; padding-bottom: 30px; text-align: left; font-size: 14px; color: var(--kt-subtle); }

.kt-gbars__legend {
  display: flex;
  justify-content: center;
  gap: 32px;
  font-size: 16px;
  color: var(--kt-fg);
}

.kt-gbars__legend span { display: flex; align-items: center; gap: 6px; }
.kt-gbars__legend i { width: 22px; height: 22px; border-radius: var(--radius-sm); }
.kt-gbars__legend i + i { margin-right: 6px; }

.kt-gbars__label { text-align: right; font-weight: 700; color: var(--kt-fg); }

.kt-gbars__row {
  display: grid;
  grid-template-columns: 170px 1fr;
  gap: 14px;
  align-items: center;
}

.kt-gbars__lane { position: relative; height: 48px; }

.kt-gbars__track {
  position: absolute;
  inset: 0 70px 0 0;
}

.kt-gbars__outer,
.kt-gbars__inner {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 0 var(--radius-base) var(--radius-base) 0;
}

.kt-gbars__total {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  white-space: nowrap;
  font-size: 24px;
  font-weight: 800;
}

.kt-gbars__ticks {
  position: absolute;
  left: 184px;
  right: 70px;
  bottom: 0;
  height: 20px;
  border-top: 1px solid var(--kt-line);
  font-family: var(--font-family-mono);
}

.kt-gbars__ticks span { position: absolute; top: 4px; transform: translateX(-50%); }
</style>
