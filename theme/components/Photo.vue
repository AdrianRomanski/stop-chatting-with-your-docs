<script setup lang="ts">
/**
 * A round portrait (1:1, design guide: Aspect Ratios — avatars are always square, cropped to fill).
 * - `size` in px; `zoom` and `origin` crop into a half-portrait (e.g. zoom 1.45, origin "48% 12%")
 * - `initials` show when there is no `src`
 */
withDefaults(defineProps<{
  src?: string
  size?: number
  zoom?: number
  origin?: string
  initials?: string
  alt?: string
}>(), { size: 140, zoom: 1, origin: '50% 30%', alt: '' })
</script>

<template>
  <div class="kt-photo" :style="{ width: `${size}px`, height: `${size}px`, fontSize: `${size * 0.34}px` }">
    <img v-if="src" :src="src" :alt="alt" :style="{ transform: `scale(${zoom})`, transformOrigin: origin }">
    <span v-else>{{ initials }}</span>
  </div>
</template>

<style>
.kt-photo {
  position: relative;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 50%;
  border: 4px solid var(--kt-card);
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-950));
  box-shadow: var(--kt-shadow);
  font-weight: 800;
  color: #fff;
}

.kt-scheme-light .kt-photo { border-color: #ffffff; }
.kt-scheme-dark .kt-photo { border-color: var(--color-neutral-25); }

.kt-photo img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
