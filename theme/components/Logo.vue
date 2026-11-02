<script setup lang="ts">
import { computed } from 'vue'
import symbolRaw from '../assets/pb-symbol.svg?raw'
import wordmarkRaw from '../assets/pb-wordmark.svg?raw'

/**
 * The PushBased logo, inline so it takes the official color or the official white version from
 * the slide it sits on (--kt-logo-a/b in semantic.css: color on light, white on dark and accents).
 * Design guide (Logo): never recolor it otherwise, never smaller than 24 px, keep clear space.
 * - `variant`: symbol (the brand mark) | wordmark (mark + PUSHBASED)
 */
const props = withDefaults(defineProps<{ variant?: 'symbol' | 'wordmark' }>(), { variant: 'symbol' })

function themed(raw: string) {
  return raw
    .replace(/<defs>[\s\S]*?<\/defs>/, '')
    .replace(/\sclip-path="[^"]*"/g, '')
    .replace(/fill="#2D0064"/gi, 'fill="var(--kt-logo-a)"')
    .replace(/fill="#FF003C"/gi, 'fill="var(--kt-logo-b)"')
    .replace(/\swidth="\d+(\.\d+)?"\sheight="\d+(\.\d+)?"/, '')
}

const svg = computed(() => themed(props.variant === 'symbol' ? symbolRaw : wordmarkRaw))
</script>

<template>
  <span class="kt-logo" :class="`kt-logo--${variant}`" role="img" aria-label="PushBased" v-html="svg" />
</template>

<style>
.kt-logo {
  display: inline-block;
  line-height: 0;
}

.kt-logo svg {
  height: 100%;
  width: auto;
}
</style>
