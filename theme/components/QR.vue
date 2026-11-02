<script setup lang="ts">
import { computed } from 'vue'
import { renderSVG } from 'uqr'

/** A QR code rendered at build time from the URL: no network needed at the venue. */
const props = withDefaults(defineProps<{ url: string; size?: number }>(), { size: 160 })
const svg = computed(() => renderSVG(props.url, { border: 1, blackColor: '#121926', whiteColor: '#ffffff' }))
</script>

<template>
  <div class="kt-qr" :style="{ width: `${size}px`, height: `${size}px` }" v-html="svg" />
</template>

<style>
.kt-qr {
  flex: none;
  padding: 8px;
  border-radius: var(--radius-lg);
  background: #ffffff;
  box-sizing: content-box;
}

.kt-qr svg {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
