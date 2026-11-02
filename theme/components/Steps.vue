<script setup lang="ts">
/**
 * Step boxes with arrows, as in the Base theme: numbered cards with a colored top bar.
 * - `items`: [{ title, text?, tone? }] — tone: primary | secondary | neutral | muted (a later step)
 * - `active`: index of the step to highlight (bigger, red bar)
 * - `stagger`: steps appear one after the other when the slide is shown
 */
type Step = { title: string; text?: string; tone?: 'primary' | 'secondary' | 'neutral' | 'muted' }
withDefaults(defineProps<{ items: Step[]; active?: number; stagger?: boolean }>(), { stagger: true })
const num = (i: number) => String(i + 1).padStart(2, '0')
</script>

<template>
  <div class="kt-steps" :class="{ 'kt-stagger': stagger }" :style="{ '--kt-steps': items.length }">
    <div
      v-for="(s, i) in items"
      :key="s.title"
      class="kt-step"
      :class="[`kt-step--${s.tone ?? 'primary'}`, { 'is-active': i === active }]"
    >
      <b>{{ num(i) }}</b>
      <strong>{{ s.title }}</strong>
      <span v-if="s.text">{{ s.text }}</span>
    </div>
  </div>
</template>

<style>
.kt-steps {
  display: flex;
  align-items: stretch;
  gap: 24px;
  text-align: left;
}

.kt-step {
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  padding: 16px 14px 18px;
  background: var(--kt-card);
  border: 1px solid var(--kt-card-line);
  border-top: 6px solid var(--kt-c-primary);
  transition: transform 0.3s;
}

.kt-step--secondary { border-top-color: var(--kt-c-secondary); }
.kt-step--neutral { border-top-color: var(--kt-c-neutral); }
.kt-step--muted { border-top-color: var(--kt-c-track); }

.kt-step b {
  display: block;
  font: 700 15px var(--font-family-mono);
  color: var(--kt-c-primary);
}

.kt-step--secondary b { color: var(--kt-c-secondary); }
.kt-step--neutral b, .kt-step--muted b { color: var(--kt-subtle); }

.kt-step strong {
  display: block;
  margin-top: 4px;
  font-size: 18px;
  line-height: 1.2;
  overflow-wrap: break-word;
  hyphens: auto;
  color: var(--kt-fg);
}

.kt-step--muted strong { color: var(--kt-subtle); }

.kt-step span {
  display: block;
  margin-top: 6px;
  font-size: 15px;
  line-height: 1.4;
  color: var(--kt-muted);
}

.kt-step.is-active {
  border-top-color: var(--kt-c-secondary);
  transform: translateY(-8px) scale(1.06);
  box-shadow: var(--kt-shadow);
}

/* the arrow sits in the gap, so it takes no width from the steps */
.kt-step:not(:last-child)::after {
  content: '→';
  position: absolute;
  top: 50%;
  right: -21px;
  transform: translateY(-50%);
  font-size: 18px;
  line-height: 1;
  color: var(--kt-c-primary);
}
</style>
