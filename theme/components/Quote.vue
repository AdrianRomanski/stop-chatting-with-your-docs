<script setup lang="ts">
/**
 * A quote, optionally next to a picture (the Hamlet slide). The slot is the quote's headline
 * (an h1 works best); `line` is the quoted line under it, `by` the attribution.
 */
withDefaults(defineProps<{ src?: string; alt?: string; line?: string; by?: string; imageWidth?: number }>(), { alt: '', imageWidth: 300 })
</script>

<template>
  <div class="kt-quote" :class="{ 'has-image': src }" :style="{ '--kt-quote-img': `${imageWidth}px` }">
    <img v-if="src" :src="src" :alt="alt">
    <div>
      <slot />
      <div v-if="line" class="kt-quote__line">{{ line }}</div>
      <div v-if="by" class="kt-quote__by">— {{ by }}</div>
    </div>
  </div>
</template>

<style>
.kt-quote {
  display: grid;
  gap: 44px;
  align-items: center;
  max-width: 860px;
  text-align: left;
}

.kt-quote.has-image { grid-template-columns: var(--kt-quote-img) 1fr; }

.kt-quote img {
  width: var(--kt-quote-img);
  height: auto;
  border-radius: 10px;
  box-shadow: var(--kt-shadow);
}

.kt-quote__line {
  margin-top: 20px;
  font: italic 600 24px var(--font-family-sans);
  color: var(--kt-cool);
}

.kt-quote__by {
  margin-top: 10px;
  font: 14px var(--font-family-mono);
  color: var(--kt-subtle);
}
</style>
