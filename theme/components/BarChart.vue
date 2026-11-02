<script setup lang="ts">
import { computed } from 'vue'
import { useTimeline } from '../composables/useTimeline'

/**
 * Bars for direct comparison (Base theme: "Bar Chart (Vertical)" and "(Horizontal)").
 * - `items`: [{ label, value, tone? }]
 * - `orientation`: vertical | horizontal
 * - `max`: the axis maximum (default: the largest value, rounded up); `ticks`: number of grid lines
 * - `format`: how a value is written, e.g. (v) => `${v}s`
 */
type Item = { label: string; value: number; tone?: string }
const props = withDefaults(defineProps<{
  items: Item[]
  orientation?: 'vertical' | 'horizontal'
  max?: number
  ticks?: number
  unit?: string
  height?: number
}>(), { orientation: 'vertical', ticks: 5, unit: '', height: 260 })

const max = computed(() => {
  if (props.max) return props.max
  const top = Math.max(...props.items.map(i => i.value))
  const step = 10 ** Math.floor(Math.log10(top))
  return Math.ceil(top / step) * step
})
const tickValues = computed(() => Array.from({ length: props.ticks + 1 }, (_, i) => Math.round((max.value / props.ticks) * i)))
const fmt = (v: number) => `${v.toLocaleString('en')}${props.unit}`
const { at } = useTimeline(2)
</script>

<template>
  <div class="kt-bars" :class="`kt-bars--${orientation}`" :style="{ '--kt-bars-h': `${height}px` }">
    <template v-if="orientation === 'vertical'">
      <div class="kt-bars__axis">
        <span v-for="t in [...tickValues].reverse()" :key="t">{{ fmt(t) }}</span>
      </div>
      <div class="kt-bars__plot">
        <div v-for="(it, i) in items" :key="it.label" class="kt-bars__col">
          <div class="kt-bars__slot">
            <span class="kt-bars__value" :class="`kt-text--${it.tone ?? 'primary'}`">{{ fmt(it.value) }}</span>
            <div class="kt-bars__bar kt-grow" :class="`kt-fill--${it.tone ?? 'primary'}`" :style="{ height: at(0.2 + i * 0.1) ? `${(it.value / max) * 100}%` : '0%' }" />
          </div>
          <span class="kt-bars__label">{{ it.label }}</span>
        </div>
      </div>
    </template>
    <template v-else>
      <div v-for="(it, i) in items" :key="it.label" class="kt-bars__row">
        <span class="kt-bars__label">{{ it.label }}</span>
        <div class="kt-bars__lane">
          <div class="kt-bars__bar kt-grow" :class="`kt-fill--${it.tone ?? 'primary'}`" :style="{ width: at(0.2 + i * 0.15) ? `${(it.value / max) * 100}%` : '0%' }" />
          <span class="kt-bars__value" :class="`kt-text--${it.tone ?? 'primary'}`">{{ fmt(it.value) }}</span>
        </div>
      </div>
      <div class="kt-bars__ticks">
        <span v-for="t in tickValues" :key="t" :style="{ left: `${(t / max) * 100}%` }">{{ fmt(t) }}</span>
      </div>
    </template>
  </div>
</template>

<style>
.kt-bars { min-width: 0; text-align: left; font-size: 14px; color: var(--kt-subtle); }

/* vertical */
.kt-bars--vertical { display: grid; grid-template-columns: auto 1fr; gap: 12px; }

.kt-bars__axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: var(--kt-bars-h);
  text-align: right;
  font-family: var(--font-family-mono);
}

.kt-bars__plot {
  display: flex;
  gap: 14px;
  align-items: flex-end;
  border-bottom: 1px solid var(--kt-line);
}

.kt-bars__col {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.kt-bars__slot {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: var(--kt-bars-h);
}

.kt-bars--vertical .kt-bars__bar {
  width: 70%;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

.kt-bars--vertical .kt-bars__value {
  margin-bottom: 6px;
  font-weight: 800;
}

.kt-bars--vertical .kt-bars__label {
  margin-top: 8px;
  font-weight: 700;
  color: var(--kt-fg);
  text-align: center;
}

/* horizontal */
.kt-bars--horizontal { position: relative; display: flex; flex-direction: column; gap: 18px; padding-bottom: 28px; }

.kt-bars__row {
  display: grid;
  grid-template-columns: 170px 1fr;
  gap: 14px;
  align-items: center;
}

.kt-bars--horizontal .kt-bars__label {
  text-align: right;
  font-weight: 700;
  color: var(--kt-fg);
}

.kt-bars__lane {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 46px;
}

.kt-bars--horizontal .kt-bars__bar {
  height: 100%;
  border-radius: 0 var(--radius-base) var(--radius-base) 0;
}

.kt-bars--horizontal .kt-bars__value {
  white-space: nowrap;
  font-size: 24px;
  font-weight: 800;
}

.kt-bars__ticks {
  position: absolute;
  left: 184px;
  right: 70px;
  bottom: 0;
  height: 20px;
  border-top: 1px solid var(--kt-line);
  font-family: var(--font-family-mono);
}

.kt-bars__ticks span {
  position: absolute;
  top: 4px;
  transform: translateX(-50%);
}
</style>
