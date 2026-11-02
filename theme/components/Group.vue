<script setup lang="ts">
/**
 * A dashed, rounded group around related boxes — the Speaker theme's compiler pipeline.
 * `label` sits above the group, `foot` below it.
 */
defineProps<{ label?: string; foot?: string }>()
</script>

<template>
  <div class="kt-group">
    <div v-if="label" class="kt-group__label">{{ label }}</div>
    <div class="kt-group__box"><slot /></div>
    <div v-if="foot" class="kt-group__foot">{{ foot }}</div>
  </div>
</template>

<style>
.kt-group {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.kt-group__label,
.kt-group__foot {
  font: 600 13px var(--font-family-mono);
  text-align: center;
  color: var(--kt-subtle);
}

.kt-group__label { margin-bottom: 8px; }
.kt-group__foot { margin-top: 8px; }

.kt-group__box {
  flex: 1;
  display: flex;
  gap: 8px;
  padding: 10px;
  border: 1.5px dashed var(--kt-line-strong);
  border-radius: var(--radius-3xl);
}

.kt-group__box > * { flex: 1 1 0; min-width: 0; }

/* cards in a group are stages: compact and centred */
.kt-group__box > .kt-card {
  padding: 16px 8px;
  font-size: 15px;
  text-align: center;
  overflow-wrap: break-word;
  hyphens: auto;
}
</style>
