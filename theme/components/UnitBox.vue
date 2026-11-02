<script setup lang="ts">
/**
 * The unit box of the Base theme: one key number, what it measures, one sentence.
 * - `value` (e.g. "95%+"), `label` (e.g. "Measurement name")
 * - `tone`: primary | secondary | neutral | success
 * - slot: the sentence (bold and `.acc` words take the tone's color)
 */
withDefaults(defineProps<{
  value: string
  label?: string
  tone?: 'primary' | 'secondary' | 'neutral' | 'success'
}>(), { tone: 'primary' })
</script>

<template>
  <div class="kt-unit" :class="`kt-acc--${tone}`">
    <div class="kt-unit__value">{{ value }}</div>
    <div v-if="label" class="kt-unit__label">{{ label }}</div>
    <div v-if="$slots.default" class="kt-unit__text"><slot /></div>
  </div>
</template>

<style>
.kt-unit {
  min-width: 0;
  padding: 22px 20px 20px;
  border-radius: var(--kt-radius-card);
  border: 2px solid var(--kt-acc);
  background: linear-gradient(135deg, var(--kt-card) 40%, var(--kt-acc-tint) 100%);
  text-align: center;
}

.kt-unit__value {
  font-size: 56px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--kt-acc);
  white-space: nowrap;
}

.kt-acc--neutral .kt-unit__value { color: var(--kt-fg); }

.kt-unit__label {
  margin-top: 12px;
  font-size: 16px;
  font-weight: 700;
  color: var(--kt-fg);
}

.kt-unit__text {
  margin-top: 8px;
  font-size: 15px;
  line-height: 1.4;
  color: var(--kt-muted);
}

.kt-unit__text b,
.kt-unit__text .acc { color: var(--kt-acc); }
.kt-unit__text > :last-child { margin-bottom: 0; }
</style>
