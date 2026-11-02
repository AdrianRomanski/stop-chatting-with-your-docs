<script setup lang="ts">
/**
 * A marked placeholder for an image the speaker still has to supply (photo, illustration, meme).
 * Replace it with <Shot>, <Meme> or <img class="kt-picture"> once the file is in public/images/.
 * - `label`: what the image has to show
 * - `file`: the path it will live at, e.g. /images/whiteboard.png
 * - `width`, `height`: the box in px, so the layout holds its final shape
 */
withDefaults(defineProps<{ label: string; file?: string; width?: number; height?: number }>(), {
  width: 360,
  height: 220,
})
</script>

<template>
  <div class="kt-asset" :style="{ width: `${width}px`, height: `${height}px` }">
    <b>asset needed</b>
    <span>{{ label }}</span>
    <code v-if="file">{{ file }}</code>
  </div>
</template>

<style>
.kt-asset {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: 0 auto;
  padding: 16px;
  border: 2px dashed var(--kt-warn);
  border-radius: var(--kt-radius-card);
  background: var(--kt-tint-warning);
  color: var(--kt-fg);
  text-align: center;
  font-size: 16px;
  line-height: 1.3;
}

.kt-asset b {
  color: var(--kt-warn);
  font-family: var(--kt-font-mono, ui-monospace, monospace);
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.kt-asset code {
  color: var(--kt-muted);
  font-size: 13px;
}
</style>
