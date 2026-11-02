<script setup lang="ts">
/**
 * A screenshot or picture as an object on the slide.
 * - `frame`: card (white padded card — screenshots of dashboards) | border (primary border — the
 *   Speaker theme's report grid) | plain (rounded + shadow)
 * - `height` in px (default 380), `caption` under it
 */
withDefaults(defineProps<{
  src: string
  alt?: string
  frame?: 'card' | 'border' | 'plain'
  height?: number
  caption?: string
}>(), { alt: '', frame: 'card', height: 380 })
</script>

<template>
  <figure class="kt-shot" :class="`kt-shot--${frame}`">
    <img :src="src" :alt="alt" :style="{ height: `${height}px` }">
    <figcaption v-if="caption">{{ caption }}</figcaption>
  </figure>
</template>

<style>
.kt-shot {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
}

.kt-shot img {
  display: block;
  max-width: 100%;
  width: auto;
  object-fit: contain;
}

.kt-shot--card img {
  padding: 10px;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: var(--kt-shadow);
}

.kt-shot--border img {
  border-radius: var(--radius-lg);
  border: 2px solid var(--kt-c-primary);
  object-fit: cover;
}

.kt-shot--plain img {
  border-radius: 14px;
  box-shadow: var(--kt-shadow);
}

.kt-shot figcaption {
  margin-top: 12px;
  font: 13px/1.3 var(--font-family-mono);
  color: var(--kt-subtle);
}
</style>
