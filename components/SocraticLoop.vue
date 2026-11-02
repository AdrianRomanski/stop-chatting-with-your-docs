<script setup lang="ts">
import { computed, useId } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * The Socratic method as a loop: claim → why? → counterexample → refine, then back to claim.
 * The nodes light up in turn, each with a tiny line of the exchange under it (you claim, the coach
 * asks, the coach tests, you refine). A "?" chip, the same as LearningFlow's push chip, travels the
 * loop and keeps going.
 * - `compact`: the nodes and the loop only, no exchange lines; the recap after the coach demo.
 */
const props = withDefaults(defineProps<{ compact?: boolean }>(), { compact: false })
const { at } = useTimeline(6.5)
const uid = useId()
const loop = `kt-socr-loop-${uid}`

const cy = 120
const xs = [110, 323, 537, 750]
const steps = [
  { label: 'claim', who: 'you', lines: ['“SSR is always', 'faster”'] },
  { label: 'why?', who: 'coach', lines: ['“Why would', 'it be?”'] },
  { label: 'counterexample', who: 'coach', lines: ['“A 4 MB HTML page', 'on 3G?”'] },
  { label: 'refine', who: 'you', lines: ['“Faster first paint', 'while HTML is small”'] },
]
const start = 1.0
const beat = 1.1
const back = start + beat * 4 // the loop closes, claim lights again

const lit = (i: number) => at(start + i * beat)
const now = (i: number) => (i === 0 && at(back)) || (lit(i) && !at(start + (i + 1) * beat))
const arc = `M${xs[3]} ${cy} C ${xs[3]} 8, ${xs[0]} 8, ${xs[0]} ${cy}`
const path = computed(() => `M${xs[0]} ${cy} H ${xs[3]} C ${xs[3]} 8, ${xs[0]} 8, ${xs[0]} ${cy}`)
const height = computed(() => (props.compact ? 236 : 330))
</script>

<template>
  <svg class="kt-socr" :class="{ 'is-compact': compact }" :viewBox="`0 0 860 ${height}`" role="img"
    aria-label="The Socratic loop: claim, ask why, test a counterexample, refine, and back to the claim">
    <path :id="loop" :d="path" fill="none" stroke="none" />

    <!-- wires between the steps, and the arc back to the claim -->
    <path v-for="i in 3" :key="`w${i}`" :d="`M${xs[i - 1]} ${cy} H ${xs[i]}`" class="kt-socr__wire" :class="{ 'is-on': at(0.5), 'is-hot': lit(i) }" />
    <path :d="arc" class="kt-socr__wire is-arc" :class="{ 'is-on': at(0.5), 'is-hot': at(back) }" />
    <text x="430" y="62" text-anchor="middle" class="kt-socr__tag" :class="{ 'is-on': at(back) }">again, until it holds</text>

    <!-- the "?" chip travels the loop; the nodes are drawn over it -->
    <g class="kt-socr__chip" :class="{ 'is-on': at(start) }">
      <circle r="15" class="kt-socr__q" />
      <text y="6" text-anchor="middle" class="kt-socr__qtext">?</text>
      <animateMotion dur="5.6s" begin="0s" repeatCount="indefinite" rotate="0">
        <mpath :href="`#${loop}`" />
      </animateMotion>
    </g>

    <g v-for="(s, i) in steps" :key="s.label" class="kt-socr__step" :class="{ 'is-on': at(0.15 + i * 0.15), 'is-lit': lit(i), 'is-now': now(i) }">
      <circle :cx="xs[i]" :cy="cy" r="60" class="kt-socr__halo" :style="{ transformOrigin: `${xs[i]}px ${cy}px` }" />
      <circle :cx="xs[i]" :cy="cy" r="46" class="kt-socr__base" />
      <circle :cx="xs[i]" :cy="cy" r="46" class="kt-socr__node" />

      <g :transform="`translate(${xs[i]} ${cy})`" class="kt-socr__glyph">
        <!-- claim: a speech bubble with a bold line in it -->
        <template v-if="i === 0">
          <path d="M-20 -16 h40 a6 6 0 0 1 6 6 v18 a6 6 0 0 1 -6 6 h-24 l-10 9 v-9 h-6 a6 6 0 0 1 -6 -6 v-18 a6 6 0 0 1 6 -6z" />
          <path d="M-11 -4 h22" class="is-ink" />
        </template>
        <!-- why: a question mark -->
        <template v-else-if="i === 1">
          <path d="M-10 -10 a10 10 0 1 1 14 9 c-3 2 -4 4 -4 8" />
          <circle cx="0" cy="17" r="2.4" class="is-dot" />
        </template>
        <!-- counterexample: a bolt striking the claim -->
        <template v-else-if="i === 2">
          <path d="M5 -22 L-10 3 H1 L-4 22 L12 -4 H1z" />
        </template>
        <!-- refine: a pencil -->
        <template v-else>
          <path d="M-16 16 l4 -12 l20 -20 l8 8 l-20 20z M4 -12 l8 8 M-16 16 l12 -4" />
        </template>
      </g>

      <text :x="xs[i]" :y="cy + 80" text-anchor="middle" class="kt-socr__label">{{ s.label }}</text>
      <text v-if="!compact" :x="xs[i]" :y="cy + 102" text-anchor="middle" class="kt-socr__who">{{ s.who }}</text>
      <text v-else :x="xs[i]" :y="cy + 102" text-anchor="middle" class="kt-socr__who">{{ s.who === 'coach' ? 'asked' : 'you' }}</text>
    </g>

    <!-- the exchange: one line per step, under its node -->
    <g v-if="!compact">
      <g v-for="(s, i) in steps" :key="`b${i}`" class="kt-socr__bubble" :class="[`is-${s.who}`, { 'is-on': lit(i) }]">
        <path :d="`M${xs[i] - 86} 244 h74 l12 -12 l12 12 h74 a8 8 0 0 1 8 8 v58 a8 8 0 0 1 -8 8 h-172 a8 8 0 0 1 -8 -8 v-58 a8 8 0 0 1 8 -8z`" class="kt-socr__bshape" />
        <text :x="xs[i]" y="274" text-anchor="middle" class="kt-socr__btext">{{ s.lines[0] }}</text>
        <text :x="xs[i]" y="298" text-anchor="middle" class="kt-socr__btext">{{ s.lines[1] }}</text>
      </g>
    </g>
  </svg>
</template>

<style>
.kt-socr {
  width: 860px;
  height: auto;
  font-family: var(--font-family-sans);
}

.kt-socr.is-compact { width: 760px; }

.kt-socr__step,
.kt-socr__chip,
.kt-socr__tag,
.kt-socr__wire,
.kt-socr__bubble {
  opacity: 0;
  transition: opacity 0.4s;
}

.kt-socr__step.is-on,
.kt-socr__chip.is-on,
.kt-socr__tag.is-on,
.kt-socr__wire.is-on { opacity: 1; }

.kt-socr__bubble { transform: translateY(8px); transition: opacity 0.4s, transform 0.4s ease-out; }
.kt-socr__bubble.is-on { opacity: 1; transform: none; }

.kt-socr__wire {
  fill: none;
  stroke: var(--kt-line-strong);
  stroke-width: 2.5;
  stroke-dasharray: 6 7;
  transition: opacity 0.4s, stroke 0.4s;
}

.kt-socr__wire.is-on { animation: kt-socr-flow 1s linear infinite; }
.kt-socr__wire.is-hot { stroke: var(--kt-c-primary-soft); }
.kt-socr__wire.is-arc.is-hot { stroke: var(--kt-hot); }

@keyframes kt-socr-flow {
  to { stroke-dashoffset: -26; }
}

.kt-socr__tag { font: 14px var(--font-family-mono); fill: var(--kt-subtle); }

.kt-socr__base { fill: var(--kt-bg); }

/* nodes: unlit → lit (primary) → now (the step being played, hot ring and halo) */
.kt-socr__node {
  fill: var(--kt-tint-neutral);
  stroke: var(--kt-line-strong);
  stroke-width: 2.5;
  transition: fill 0.4s, stroke 0.4s;
}

.kt-socr__step.is-lit .kt-socr__node { fill: var(--kt-tint-primary); stroke: var(--kt-c-primary); }
.kt-socr__step.is-now .kt-socr__node { stroke: var(--kt-hot); stroke-width: 3; }

.kt-socr__halo {
  fill: var(--kt-c-primary);
  opacity: 0;
  transition: opacity 0.4s;
}

.kt-socr__step.is-now .kt-socr__halo {
  opacity: 0.2;
  animation: kt-socr-pulse 1.4s ease-in-out infinite;
}

@keyframes kt-socr-pulse {
  50% { opacity: 0.4; transform: scale(1.1); }
}

.kt-socr__glyph path {
  fill: none;
  stroke: var(--kt-subtle);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: stroke 0.4s;
}

.kt-socr__glyph .is-dot { fill: var(--kt-subtle); transition: fill 0.4s; }
.kt-socr__step.is-lit .kt-socr__glyph path { stroke: var(--kt-heading); }
.kt-socr__step.is-lit .kt-socr__glyph .is-dot { fill: var(--kt-heading); }
.kt-socr__step.is-now .kt-socr__glyph path { stroke: var(--kt-hot); }
.kt-socr__step.is-now .kt-socr__glyph .is-dot { fill: var(--kt-hot); }

.kt-socr__label { font-size: 20px; font-weight: 800; fill: var(--kt-heading); }
.kt-socr__who { font: 14px var(--font-family-mono); fill: var(--kt-subtle); }

.kt-socr__bshape { stroke-width: 2; }
.kt-socr__bubble.is-you .kt-socr__bshape { fill: var(--kt-card); stroke: var(--kt-line-strong); }
.kt-socr__bubble.is-coach .kt-socr__bshape { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); }
.kt-socr__btext { font-size: 17px; font-weight: 600; fill: var(--kt-heading); }

.kt-socr__q { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); stroke-width: 2; }
.kt-socr__qtext { font-size: 18px; font-weight: 800; fill: var(--kt-hot); }
</style>
