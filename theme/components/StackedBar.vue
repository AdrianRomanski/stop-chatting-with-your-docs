<script setup lang="ts">
import { computed } from 'vue'
import { useTimeline } from '../composables/useTimeline'

/**
 * Segments of a total in one horizontal bar (Base theme: "Segmented Stacked Bar").
 * - `segments`: [{ label, value, tone }] — label and value are written into the segment
 * - `title` above (e.g. "369 Units Total — Measurement Case"), `note` below right
 */
type Segment = { label: string; value: number; tone?: string }
const props = withDefaults(defineProps<{ segments: Segment[]; title?: string; note?: string; noteTone?: string; height?: number }>(), { height: 56, noteTone: 'primary' })
const total = computed(() => props.segments.reduce((sum, s) => sum + s.value, 0))
const { at } = useTimeline(1.6)
</script>

<template>
  <div class="kt-stacked">
    <div v-if="title" class="kt-chart-title">{{ title }}</div>
    <div class="kt-stacked__bar" :style="{ height: `${height}px` }">
      <div
        v-for="(s, i) in segments" :key="s.label"
        class="kt-stacked__seg kt-grow" :class="`kt-fill--${s.tone ?? (i ? 'primary-soft' : 'track')}`"
        :style="{ width: at(0.2 + i * 0.15) ? `${(s.value / total) * 100}%` : '0%' }"
      >
        <span>{{ s.label }} · {{ s.value }}</span>
      </div>
    </div>
    <div v-if="note" class="kt-chart-note" :class="`kt-text--${noteTone}`">{{ note }}</div>
  </div>
</template>

<style>
.kt-stacked { min-width: 0; text-align: left; }

.kt-stacked__bar {
  display: flex;
  overflow: hidden;
  border-radius: var(--radius-base);
}

.kt-stacked__seg {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  overflow: hidden;
}

.kt-stacked__seg span {
  white-space: nowrap;
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
}

.kt-stacked__seg.kt-fill--track span { color: var(--kt-fg); }
</style>
