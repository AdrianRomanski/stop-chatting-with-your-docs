<script setup lang="ts">
/**
 * The hint box of the Base theme: a tinted strip that tells the audience what the slide is for.
 * `tone`: primary | secondary | success | warning. Use bold for the key words.
 */
withDefaults(defineProps<{ tone?: 'primary' | 'secondary' | 'success' | 'warning'; align?: 'center' | 'left' }>(), { tone: 'primary', align: 'center' })
</script>

<template>
  <div class="kt-hint" :class="[`kt-hint--${tone}`, `kt-hint--${align}`]"><slot /></div>
</template>

<style>
.kt-hint {
  padding: 14px 22px;
  border-radius: var(--kt-radius-card);
  font-size: 18px;
  line-height: 1.45;
  color: var(--kt-fg);
}

.kt-hint--center { text-align: center; }
.kt-hint--left { text-align: left; }
.kt-hint > :last-child { margin-bottom: 0; }

.kt-hint--primary { background: var(--kt-tint-primary); --kt-hint-acc: var(--kt-c-primary); }
.kt-hint--secondary { background: var(--kt-tint-secondary); --kt-hint-acc: var(--kt-c-secondary); }
.kt-hint--success { background: var(--kt-tint-success); --kt-hint-acc: var(--kt-c-success); }
.kt-hint--warning { background: var(--kt-tint-warning); --kt-hint-acc: var(--kt-c-warning); }

.kt-hint b,
.kt-hint .acc { color: var(--kt-hint-acc); }
</style>
