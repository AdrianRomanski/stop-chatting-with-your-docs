<script setup lang="ts">
import { useId } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * Forte's PARA method: four folders (drawn like VaultSleep's) ordered on a bar from "act now" to
 * "cold storage", each with its rule and two examples, then two pitfall pills underneath.
 * No props.
 */
const { at } = useTimeline(4.5)
const uid = useId()
const grad = `kt-para-grad-${uid}`
const buckets = [
  { name: 'Projects', rule: 'has a deadline', ex: ['MVP launch', 'annual reviews'] },
  { name: 'Areas', rule: 'no end date', ex: ['team management', 'architecture rules'] },
  { name: 'Resources', rule: 'might be useful', ex: ['AI prompt templates', 'Stoic philosophy'] },
  { name: 'Archives', rule: 'inactive', ex: ['finished projects', 'paused hobbies'] },
]
const pitfalls = [
  { x: 30, w: 400, text: 'Projects ≠ Areas: projects end' },
  { x: 450, w: 400, text: "don't distill on day one" },
]
</script>

<template>
  <svg class="kt-para" viewBox="0 0 880 340" role="img"
    aria-label="PARA: projects, areas, resources, archives, ordered from act now to cold storage">
    <defs>
      <linearGradient :id="grad" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" class="kt-para__stop is-hot" />
        <stop offset="1" class="kt-para__stop is-cold" />
      </linearGradient>
    </defs>

    <!-- the actionability bar -->
    <g class="kt-para__part" :class="{ 'is-on': at(0.1) }">
      <rect x="30" y="14" width="820" height="8" rx="4" :fill="`url(#${grad})`" />
      <text x="30" y="46" class="kt-para__end is-hot">act now</text>
      <text x="850" y="46" text-anchor="end" class="kt-para__end">cold storage</text>
    </g>

    <!-- the four buckets -->
    <g v-for="(b, i) in buckets" :key="b.name" class="kt-para__part" :class="{ 'is-on': at(0.5 + i * 0.5) }">
      <path :d="`M${30 + i * 210} 64 h60 l12 14 h118 v168 h-190z`" class="kt-para__fold" :class="{ 'is-cold': i === 3 }" />
      <text :x="125 + i * 210" y="118" text-anchor="middle" class="kt-para__name">{{ b.name }}</text>
      <text :x="125 + i * 210" y="144" text-anchor="middle" class="kt-para__rule">{{ b.rule }}</text>
      <path :d="`M${60 + i * 210} 164 h130`" class="kt-para__sep" />
      <text v-for="(e, j) in b.ex" :key="e" :x="125 + i * 210" :y="194 + j * 26" text-anchor="middle" class="kt-para__ex">{{ e }}</text>
    </g>

    <!-- pitfalls -->
    <g v-for="(p, i) in pitfalls" :key="p.text" class="kt-para__part" :class="{ 'is-on': at(2.8 + i * 0.6) }">
      <rect :x="p.x" y="276" :width="p.w" height="44" rx="22" class="kt-para__pill" />
      <text :x="p.x + 26" y="304" class="kt-para__bang">!</text>
      <text :x="p.x + 46" y="303" class="kt-para__pit">{{ p.text }}</text>
    </g>
  </svg>
</template>

<style>
.kt-para {
  width: 880px;
  height: auto;
  font-family: var(--font-family-sans);
}

.kt-para__part {
  opacity: 0;
  transition: opacity 0.45s;
}

.kt-para__part.is-on { opacity: 1; }

.kt-para__stop.is-hot { stop-color: var(--kt-hot); }
.kt-para__stop.is-cold { stop-color: var(--kt-line); }

.kt-para__end { font: 14px var(--font-family-mono); fill: var(--kt-subtle); }
.kt-para__end.is-hot { fill: var(--kt-hot); }

.kt-para__fold {
  fill: var(--kt-tint-primary);
  stroke: var(--kt-c-primary);
  stroke-width: 2.5;
  stroke-linejoin: round;
}

.kt-para__fold.is-cold { fill: var(--kt-tint-neutral); stroke: var(--kt-line-strong); }

.kt-para__name { font-size: 23px; font-weight: 800; fill: var(--kt-heading); }
.kt-para__rule { font: 14px var(--font-family-mono); fill: var(--kt-hot); }
.kt-para__sep { stroke: var(--kt-line); stroke-width: 1.5; }
.kt-para__ex { font-size: 16px; fill: var(--kt-fg); }

.kt-para__pill { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); stroke-width: 1.5; }
.kt-para__bang { font-size: 20px; font-weight: 800; fill: var(--kt-hot); }
.kt-para__pit { font-size: 16px; font-weight: 600; fill: var(--kt-heading); }
</style>
