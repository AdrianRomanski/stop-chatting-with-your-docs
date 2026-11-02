<script setup lang="ts">
/**
 * The list items of the Base theme: square markers that are plain, checked or crossed, or numbered.
 * - `items`: strings, or { text, state: check | cross | plain }
 * - `tone`: primary | secondary | neutral (crossed items always use the red of "not included")
 * - `numbered`: numbered squares instead of check marks
 * - `stagger`: items appear one after the other
 */
type Item = string | { text: string; state?: 'check' | 'cross' | 'plain' }
const props = withDefaults(defineProps<{
  items: Item[]
  tone?: 'primary' | 'secondary' | 'neutral'
  numbered?: boolean
  stagger?: boolean
}>(), { tone: 'primary', numbered: false, stagger: false })

const rows = props.items.map((it, i) => {
  const item = typeof it === 'string' ? { text: it, state: 'check' as const } : { state: 'check' as const, ...it }
  return { ...item, mark: props.numbered ? String(i + 1) : item.state === 'check' ? '✓' : item.state === 'cross' ? '✗' : '' }
})
</script>

<template>
  <ul class="kt-check" :class="[`kt-acc--${tone}`, { 'kt-stagger': stagger }]">
    <li v-for="r in rows" :key="r.text" :class="`is-${numbered ? 'num' : r.state}`">
      <i>{{ r.mark }}</i><span v-html="r.text" />
    </li>
  </ul>
</template>

<style>
.kt-slide ul.kt-check {
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: left;
}

.kt-slide ul.kt-check > li {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 0;
  padding: 0;
  font-size: 20px;
  font-weight: 700;
  color: var(--kt-fg);
}

.kt-slide ul.kt-check > li::before { content: none; }

.kt-check i {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: var(--radius-sm);
  font-style: normal;
  font-size: 17px;
  font-weight: 800;
  color: #fff;
  background: var(--kt-acc);
}

.kt-check .is-plain i { background: var(--kt-acc); }
.kt-check .is-check i { background: var(--kt-acc); }
.kt-check .is-cross i { background: var(--color-secondary-400); }
.kt-check .is-num i { font: 700 15px var(--font-family-mono); }
.kt-check .is-cross span b { color: var(--kt-hot); }
</style>
