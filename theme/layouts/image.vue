<script setup lang="ts">
import { useSurface, type Scheme } from '../composables/useSurface'

/**
 * A full-bleed image (16:9). The slide's markdown sits on top, on a scrim so it stays readable.
 * - `image`, `fit` (cover | contain), `position` (CSS object-position). Not `src`: Slidev reserves
 *   it for importing slides, and a slide with `src:` disappears.
 * - `overlay`: none | bottom | left — where the text and its scrim go
 * - `caption`: a source line, bottom-left
 * The frame is off by default: logos don't belong on a photo.
 */
const props = withDefaults(defineProps<{
  image: string
  fit?: 'cover' | 'contain'
  position?: string
  overlay?: 'none' | 'bottom' | 'left'
  caption?: string
  scheme?: Scheme
  frame?: boolean
}>(), { fit: 'cover', position: 'center', overlay: 'bottom', scheme: 'dark', frame: false })

const { classes, showFrame } = useSurface({ ...props, surface: 'base', texture: 'none' })
</script>

<template>
  <div class="slidev-layout kt-image" :class="[...classes, `kt-image--${overlay}`]">
    <img class="kt-image__img" :src="image" alt="" :style="{ objectFit: fit, objectPosition: position }">
    <div v-if="overlay !== 'none'" class="kt-image__scrim" />
    <div class="kt-image__body"><slot /></div>
    <div v-if="caption" class="kt-caption">{{ caption }}</div>
    <KitFrame v-if="showFrame" />
  </div>
</template>

<style>
.slidev-layout.kt-image {
  padding: 0;
  background: var(--color-neutral-950);
}

.kt-image__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.kt-image__scrim {
  position: absolute;
  inset: 0;
}

.kt-image--bottom .kt-image__scrim {
  background: linear-gradient(to top, rgba(13, 18, 28, 0.85) 0%, rgba(13, 18, 28, 0.35) 38%, transparent 62%);
}

.kt-image--left .kt-image__scrim {
  background: linear-gradient(to right, rgba(13, 18, 28, 0.88) 0%, rgba(13, 18, 28, 0.4) 46%, transparent 70%);
}

.kt-image__body {
  position: absolute;
  z-index: 1;
  color: #fff;
}

.kt-image--bottom .kt-image__body {
  left: var(--kt-gutter);
  right: var(--kt-gutter);
  bottom: 52px;
}

.kt-image--left .kt-image__body {
  top: 50%;
  left: var(--kt-gutter);
  width: 46%;
  transform: translateY(-50%);
}

.kt-image__body h1 {
  color: #fff;
}
</style>
