<script setup lang="ts">
/**
 * The card of the PushBased themes.
 * - `variant`: bar (white card, thick top bar — the Base theme's cards and step boxes)
 *   | outline (colored border + the 135° card gradient — the unit box look) | tint (filled, no border)
 * - `accent`: primary | secondary | neutral | success | warning
 * - `title`, `label` (a chip above the title, e.g. "BEFORE: FRAGMENTED")
 * Slots: default (body), `icon` (a Solar icon, e.g. <solar-cpu-bolt-linear />)
 */
withDefaults(defineProps<{
  variant?: 'bar' | 'outline' | 'tint'
  accent?: 'primary' | 'secondary' | 'neutral' | 'success' | 'warning'
  title?: string
  label?: string
}>(), { variant: 'bar', accent: 'primary' })
</script>

<template>
  <div class="kt-card" :class="[`kt-card--${variant}`, `kt-acc--${accent}`]">
    <div v-if="$slots.icon" class="kt-card__icon"><slot name="icon" /></div>
    <span v-if="label" class="kt-card__label">{{ label }}</span>
    <div v-if="title" class="kt-card__title">{{ title }}</div>
    <div class="kt-card__body"><slot /></div>
  </div>
</template>

<style>
.kt-acc--primary { --kt-acc: var(--kt-c-primary); --kt-acc-tint: var(--kt-tint-primary); }
.kt-acc--secondary { --kt-acc: var(--kt-c-secondary); --kt-acc-tint: var(--kt-tint-secondary); }
.kt-acc--neutral { --kt-acc: var(--kt-c-neutral); --kt-acc-tint: var(--kt-tint-neutral); }
.kt-acc--success { --kt-acc: var(--kt-c-success); --kt-acc-tint: var(--kt-tint-success); }
.kt-acc--warning { --kt-acc: var(--kt-c-warning); --kt-acc-tint: var(--kt-tint-warning); }

.kt-card {
  position: relative;
  min-width: 0;
  padding: 20px 22px 18px;
  text-align: left;
  font-size: 17px;
  line-height: 1.45;
  color: var(--kt-muted);
}

.kt-card--bar {
  background: var(--kt-card);
  border: 1px solid var(--kt-card-line);
  border-top: 6px solid var(--kt-acc);
}

.kt-card--outline {
  border-radius: var(--kt-radius-card);
  border: 2px solid var(--kt-acc);
  background: linear-gradient(135deg, var(--kt-card) 40%, var(--kt-acc-tint) 100%);
}

.kt-card--tint {
  border-radius: var(--kt-radius-card);
  background: var(--kt-acc-tint);
}

.kt-card__icon {
  margin-bottom: 10px;
  font-size: 28px;
  line-height: 1;
  color: var(--kt-acc);
}

.kt-card__label {
  display: inline-block;
  margin-bottom: 10px;
  padding: 4px 10px;
  border-radius: var(--radius-base);
  font: 700 12px/1.2 var(--font-family-mono);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--kt-acc);
  background: var(--kt-acc-tint);
}

.kt-card__title {
  margin-bottom: 6px;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: var(--kt-fg);
}

.kt-card__body > :last-child { margin-bottom: 0; }

.kt-card__body ul > li { margin-bottom: 4px; }
</style>
