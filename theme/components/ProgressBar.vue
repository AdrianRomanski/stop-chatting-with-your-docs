<script setup lang="ts">
import { computed } from 'vue'
import { useTimeline } from '../composables/useTimeline'

/**
 * Completion of a finite process (Base theme: "Chart – Progress Bar"). Use it for a clear start and
 * end point against a total, not to compare values.
 * - `value`, `total`, `unit` → the label "96 / 200 Units ~48%" (or pass `label`)
 * - `tone`: primary | secondary | success | warning | neutral; `size`: lg | md | sm
 */
const props = withDefaults(defineProps<{
  value: number
  total: number
  unit?: string
  label?: string
  tone?: string
  size?: 'lg' | 'md' | 'sm'
  delay?: number
}>(), { unit: '', tone: 'primary', size: 'lg', delay: 0.2 })

const pct = computed(() => Math.round((props.value / props.total) * 100))
const text = computed(() => props.label ?? `${props.value} / ${props.total}${props.unit ? ` ${props.unit}` : ''} ~${pct.value}%`)
const { at } = useTimeline(props.delay + 1.2)
</script>

<template>
  <div class="kt-progress" :class="`kt-progress--${size}`">
    <div class="kt-progress__label">{{ text }}</div>
    <div class="kt-progress__track kt-fill--track">
      <div class="kt-progress__bar kt-grow" :class="`kt-fill--${tone}`" :style="{ width: at(delay) ? `${pct}%` : '0%' }" />
    </div>
  </div>
</template>

<style>
.kt-progress { min-width: 0; text-align: left; }

.kt-progress__label {
  margin-bottom: 8px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--kt-fg);
}

.kt-progress__track {
  overflow: hidden;
  border-radius: var(--radius-lg);
}

.kt-progress__bar {
  height: 100%;
  border-radius: var(--radius-lg);
}

.kt-progress--lg .kt-progress__label { font-size: 22px; }
.kt-progress--lg .kt-progress__track { height: 40px; }
.kt-progress--md .kt-progress__label { font-size: 15px; }
.kt-progress--md .kt-progress__track { height: 22px; }
.kt-progress--sm .kt-progress__label { font-size: 13px; }
.kt-progress--sm .kt-progress__track { height: 14px; }
</style>
