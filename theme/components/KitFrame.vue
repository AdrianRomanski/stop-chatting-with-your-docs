<script setup lang="ts">
import { computed } from 'vue'
import { configs } from '@slidev/client'

/**
 * The Speaker theme's frame: the PushBased symbol bottom-left, the event logo bottom-right.
 * The event logo comes from `themeConfig.eventLogo` (a path in the talk's public/ folder);
 * without it the corner stays empty. Layouts render this; turn it off with `frame: false`.
 */
withDefaults(defineProps<{ symbol?: boolean }>(), { symbol: true })
const eventLogo = computed(() => (configs.themeConfig as any)?.eventLogo as string | undefined)
</script>

<template>
  <div class="kt-frame">
    <Logo v-if="symbol" variant="symbol" class="kt-frame__symbol" />
    <img v-if="eventLogo" class="kt-frame__event" :src="eventLogo" alt="event logo">
  </div>
</template>

<style>
.kt-frame {
  position: absolute;
  inset: auto 0 0 0;
  height: 0;
  z-index: 3;
  pointer-events: none;
}

.kt-frame__symbol {
  position: absolute;
  left: 30px;
  bottom: 22px;
  height: 28px;
}

.kt-frame__event {
  position: absolute;
  right: 30px;
  bottom: 20px;
  height: 32px;
  width: auto;
}
</style>
