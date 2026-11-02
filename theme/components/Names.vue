<script setup lang="ts">
/** People's names in a row with dots between them — under a team picture. */
defineProps<{ items: string[] }>()
</script>

<template>
  <div class="kt-names">
    <template v-for="(n, i) in items" :key="n">
      <i v-if="i" /><span>{{ n }}</span>
    </template>
  </div>
</template>

<style>
.kt-names {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 18px;
  margin-top: 18px;
  font-size: 22px;
  font-weight: 800;
  color: var(--kt-heading);
}

.kt-names i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--kt-hot);
}
</style>
