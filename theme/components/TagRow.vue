<script setup lang="ts">
/** Topics in a row with bars between them, e.g. "JS | Performance | Architecture". */
withDefaults(defineProps<{ items: string[]; size?: number }>(), { size: 26 })
</script>

<template>
  <div class="kt-tags" :style="{ fontSize: `${size}px` }">
    <template v-for="(t, i) in items" :key="t">
      <i v-if="i" /><span>{{ t }}</span>
    </template>
  </div>
</template>

<style>
.kt-tags {
  display: flex;
  align-items: center;
  gap: 14px;
  font-weight: 700;
  color: var(--kt-hot);
}

.kt-tags i {
  width: 3px;
  height: 1.15em;
  background: var(--kt-fg);
  opacity: 0.85;
}
</style>
