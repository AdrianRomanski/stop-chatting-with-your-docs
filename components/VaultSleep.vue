<script setup lang="ts">
import { computed } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * The Second Brain on your laptop: private (a lock, "on your disk"), tidy (the PARA folders, drawn
 * as on the SecondBrain slide) and asleep (a "z z z" drifting up).
 * - `mode`: 'asleep' (it stays that way) | 'wake' (a "?" challenge is pushed in from the right, the
 *   same chip as LearningFlow's push, and the folders light up). The bridge into the architecture.
 */
const props = withDefaults(defineProps<{ mode?: 'asleep' | 'wake' }>(), { mode: 'asleep' })
const { at } = useTimeline(4)
const wake = computed(() => props.mode === 'wake')
const awake = computed(() => wake.value && at(3.1))
const folders = ['Projects', 'Areas', 'Resources', 'Archives']
const zs = [0, 1, 2]
</script>

<template>
  <svg class="kt-vsleep" :class="{ 'is-awake': awake }" viewBox="0 0 780 250" role="img"
    :aria-label="wake ? 'A challenge is pushed into the private vault and wakes it up' : 'The private, tidy vault on your laptop, asleep'">
    <!-- the laptop -->
    <g class="kt-vsleep__part" :class="{ 'is-on': at(0.1) }">
      <rect x="150" y="16" width="460" height="176" rx="14" class="kt-vsleep__screen" />
      <path d="M118 206 h524 l-24 20 h-476z" class="kt-vsleep__base" />
    </g>

    <!-- private -->
    <g class="kt-vsleep__part" :class="{ 'is-on': at(1.2) }">
      <rect x="176" y="42" width="18" height="14" rx="3" class="kt-vsleep__lock" />
      <path d="M179 42 v-5 a6 6 0 0 1 12 0 v5" class="kt-vsleep__shackle" />
      <text x="204" y="55" class="kt-vsleep__tag">on your disk</text>
    </g>

    <!-- tidy: the PARA folders -->
    <g v-for="(f, i) in folders" :key="f" class="kt-vsleep__part" :class="{ 'is-on': at(0.4 + i * 0.2) }">
      <path :d="`M${180 + i * 102} 82 h30 l8 8 h50 v56 h-88z`" class="kt-vsleep__fold" />
      <text :x="224 + i * 102" y="172" text-anchor="middle" class="kt-vsleep__fname">{{ f }}</text>
    </g>

    <!-- asleep -->
    <g class="kt-vsleep__zzz" :class="{ 'is-on': at(1.6) && !awake }">
      <text v-for="z in zs" :key="z" :x="560 + z * 16" :y="66 - z * 14" class="kt-vsleep__z" :style="{ animationDelay: `${z * 0.6}s` }">z</text>
    </g>

    <!-- wake: a challenge pushed in -->
    <template v-if="wake">
      <path d="M760 110 H 614" class="kt-vsleep__wire" :class="{ 'is-on': at(2.1) }" />
      <text x="700" y="94" text-anchor="middle" class="kt-vsleep__tag kt-vsleep__part" :class="{ 'is-on': at(2.1) }">push</text>
      <g class="kt-vsleep__chip" :class="{ 'is-on': at(2.2), 'is-in': at(2.4) }">
        <circle cx="740" cy="110" r="16" class="kt-vsleep__q" />
        <text x="740" y="117" text-anchor="middle" class="kt-vsleep__qtext">?</text>
      </g>
    </template>
  </svg>
</template>

<style>
.kt-vsleep {
  width: 780px;
  height: auto;
  font-family: var(--font-family-sans);
}

.kt-vsleep__part,
.kt-vsleep__zzz,
.kt-vsleep__wire {
  opacity: 0;
  transition: opacity 0.45s;
}

.kt-vsleep__part.is-on,
.kt-vsleep__zzz.is-on,
.kt-vsleep__wire.is-on { opacity: 1; }

.kt-vsleep__screen { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 2.5; }
.kt-vsleep__base { fill: var(--kt-tint-neutral); stroke: var(--kt-line-strong); stroke-width: 2; }

.kt-vsleep__lock { fill: var(--kt-subtle); }
.kt-vsleep__shackle { fill: none; stroke: var(--kt-subtle); stroke-width: 2.5; }
.kt-vsleep__tag { font: 14px var(--font-family-mono); fill: var(--kt-subtle); }

.kt-vsleep__fold {
  fill: var(--kt-tint-neutral);
  stroke: var(--kt-line-strong);
  stroke-width: 2;
  transition: fill 0.5s, stroke 0.5s;
}

.kt-vsleep__fname { font-size: 15px; font-weight: 700; fill: var(--kt-heading); }

.kt-vsleep.is-awake .kt-vsleep__fold { fill: var(--kt-tint-primary); stroke: var(--kt-c-primary-soft); }
.kt-vsleep.is-awake .kt-vsleep__screen { stroke: var(--kt-c-primary); }

.kt-vsleep__z {
  font-size: 22px;
  font-weight: 800;
  fill: var(--kt-subtle);
  animation: kt-vsleep-drift 2.4s ease-in-out infinite;
}

@keyframes kt-vsleep-drift {
  50% { transform: translateY(-6px); opacity: 0.4; }
}

.kt-vsleep__wire {
  fill: none;
  stroke: var(--kt-hot);
  stroke-width: 2.5;
  stroke-dasharray: 6 7;
}

.kt-vsleep__wire.is-on { animation: kt-vsleep-flow 1s linear infinite; }

@keyframes kt-vsleep-flow {
  to { stroke-dashoffset: -26; }
}

.kt-vsleep__chip {
  opacity: 0;
  transition: opacity 0.3s, transform 0.7s ease-in;
}

.kt-vsleep__chip.is-on { opacity: 1; }
.kt-vsleep__chip.is-in { transform: translateX(-140px); }

.kt-vsleep__q { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); stroke-width: 2; }
.kt-vsleep__qtext { font-size: 19px; font-weight: 800; fill: var(--kt-hot); }
</style>
