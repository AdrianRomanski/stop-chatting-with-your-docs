<script setup lang="ts">
import { computed } from 'vue'
import { useTimeline } from '../composables/useTimeline'

/**
 * A number that counts up to its value when the slide is shown, then stays.
 * - `to`, `from` (default 0), `duration` in seconds, `decimals`
 * - `prefix` / `suffix`, e.g. suffix=" M"
 */
const props = withDefaults(defineProps<{
  to: number
  from?: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
}>(), { from: 0, duration: 1.6, decimals: 0, prefix: '', suffix: '' })

const { t } = useTimeline(props.duration + 0.3)
const value = computed(() => {
  const p = Math.min(1, Math.max(0, (t.value - 0.15) / props.duration))
  const eased = 1 - (1 - p) ** 3
  const v = props.from + (props.to - props.from) * eased
  return v.toLocaleString('en', { minimumFractionDigits: props.decimals, maximumFractionDigits: props.decimals })
})
</script>

<template>
  <span class="kt-counter">{{ prefix }}{{ value }}{{ suffix }}</span>
</template>

<style>
.kt-counter { font-variant-numeric: tabular-nums; }
</style>
