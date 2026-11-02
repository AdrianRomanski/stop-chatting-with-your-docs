<script setup lang="ts">
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * One coaching session as a walk through TwoTiers: five step cards, three on the laptop
 * (primary), two in the cloud (secondary), the same boundary between them. A highlight walks
 * the steps in a calm loop (1 s per step); when it passes the boundary, the challenge + answer
 * packet crosses the gate. No props.
 */
const { at } = useTimeline(3)
const W = 144
const steps = [
  { x: 14, tier: 'local', icon: 'note', lines: ['pick a note', 'due for review'] },
  { x: 176, tier: 'local', icon: 'coach', lines: ['Gemma asks'] },
  { x: 338, tier: 'local', icon: 'you', lines: ['you answer', 'in your', 'own words'] },
  { x: 552, tier: 'cloud', icon: 'judge', lines: ['Argon judges', 'challenge', '+ answer'] },
  { x: 714, tier: 'cloud', icon: 'schedule', lines: ['schedule', 'the next', 'review'] },
] as const
const num = (i: number) => String(i + 1).padStart(2, '0')
const CY = 174 // the wire through the gaps
const gaps = [0, 1, 3].map(i => ({ x1: steps[i].x + W, x2: steps[i + 1].x }))

// the highlight on step i is on during [i/5, (i+1)/5) of a 5 s loop
function lit(i: number) {
  const a = i / 5
  const b = (i + 1) / 5
  if (i === 0) return { keyTimes: `0;${b - 0.02};${b};1`, values: '1;1;0;0' }
  if (i === 4) return { keyTimes: `0;${a - 0.02};${a};1`, values: '0;0;1;1' }
  return { keyTimes: `0;${a - 0.02};${a};${b - 0.02};${b};1`, values: '0;0;1;1;0;0' }
}
</script>

<template>
  <svg class="kt-ssteps" viewBox="0 0 880 312" role="img"
    aria-label="One session in five steps. On the laptop: pick a note due for review, Gemma asks, you answer in your own words. In the cloud: Argon judges challenge plus answer, then schedules the next review.">
    <!-- zones and boundary, as in TwoTiers -->
    <g class="kt-ssteps__part" :class="{ 'is-on': at(0.05) }">
      <rect x="2" y="2" width="496" height="306" rx="20" class="kt-ssteps__zone is-local" />
      <text x="22" y="32" class="kt-ssteps__zonename is-local">laptop · offline</text>
      <rect x="536" y="2" width="342" height="306" rx="20" class="kt-ssteps__zone is-cloud" />
      <text x="556" y="32" class="kt-ssteps__zonename is-cloud">cloud</text>
      <path :d="`M517 0 V ${CY - 18} M517 ${CY + 18} V 312`" class="kt-ssteps__boundary" />
      <path :d="`M508 ${CY - 18} h18 M508 ${CY + 18} h18`" class="kt-ssteps__gate" />
    </g>

    <!-- wires through the gaps -->
    <g class="kt-ssteps__part" :class="{ 'is-on': at(1.2) }">
      <path v-for="(gp, i) in gaps" :key="i" :d="`M${gp.x1 + 2} ${CY} H ${gp.x2 - 2}`" class="kt-ssteps__wire" />
      <path id="kt-ssteps-cross" :d="`M${steps[2].x + W + 2} ${CY} H ${steps[3].x - 2}`" class="kt-ssteps__wire is-cross" />
    </g>

    <!-- the step cards -->
    <g v-for="(s, i) in steps" :key="i" class="kt-ssteps__part" :class="{ 'is-on': at(0.2 + i * 0.18) }">
      <rect :x="s.x" y="52" :width="W" height="244" rx="14" class="kt-ssteps__card" :class="`is-${s.tier}`" />
      <rect :x="s.x" y="52" :width="W" height="244" rx="14" class="kt-ssteps__lit" :class="`is-${s.tier}`">
        <animate attributeName="opacity" dur="5s" repeatCount="indefinite" v-bind="lit(i)" />
      </rect>
      <text :x="s.x + 16" y="82" class="kt-ssteps__num" :class="`is-${s.tier}`">{{ num(i) }}</text>

      <g :transform="`translate(${s.x + W / 2} 140)`">
        <template v-if="s.icon === 'note'">
          <rect x="-24" y="-32" width="48" height="60" rx="6" class="kt-ssteps__doc" />
          <text x="-16" y="-12" class="kt-ssteps__hash">#</text>
          <path d="M-16 0 h30 M-16 10 h22" class="kt-ssteps__lines" />
          <circle cx="22" cy="24" r="13" class="kt-ssteps__clock" />
          <path d="M22 16 v8 h6" class="kt-ssteps__hand" />
        </template>
        <template v-else-if="s.icon === 'coach'">
          <rect x="-38" y="-22" width="76" height="48" rx="12" class="kt-ssteps__box is-local" />
          <path d="M-22 -6 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" class="kt-ssteps__spark is-local" />
          <circle cx="12" cy="2" r="13" class="kt-ssteps__q" />
          <text x="12" y="8" text-anchor="middle" class="kt-ssteps__qtext">?</text>
        </template>
        <template v-else-if="s.icon === 'you'">
          <g transform="scale(0.85)">
            <path d="M0 -32 c-22 0 -38 14 -38 32 c0 18 16 32 38 32 c22 0 38 -14 38 -32 c0 -18 -16 -32 -38 -32z M0 -28 v56 M-22 -12 c8 4 8 12 0 16 M22 -12 c-8 4 -8 12 0 16" class="kt-ssteps__brain" />
          </g>
        </template>
        <template v-else-if="s.icon === 'judge'">
          <rect x="-38" y="-22" width="76" height="48" rx="12" class="kt-ssteps__box is-cloud" />
          <path d="M-22 -6 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" class="kt-ssteps__spark is-cloud" />
          <path d="M2 2 l7 7 13 -15" class="kt-ssteps__tick" />
        </template>
        <template v-else>
          <rect x="-28" y="-26" width="56" height="52" rx="6" class="kt-ssteps__cal" />
          <path d="M-28 -12 h56" class="kt-ssteps__calbar" />
          <path d="M-14 -32 v10 M14 -32 v10" class="kt-ssteps__ring" />
          <g class="kt-ssteps__dots">
            <circle v-for="d in 8" :key="d" :cx="-17 + ((d - 1) % 4) * 11.3" :cy="(d <= 4 ? -1 : 13)" r="2.6" />
          </g>
          <rect x="11" y="6" width="13" height="13" rx="3" class="kt-ssteps__due" />
        </template>
      </g>

      <text :x="s.x + 14" y="220" class="kt-ssteps__title">
        <tspan v-for="(l, j) in s.lines" :key="j" :x="s.x + 14" :dy="j ? 22 : 0">{{ l }}</tspan>
      </text>
    </g>

    <!-- the packet crosses while the walk passes the boundary -->
    <g class="kt-ssteps__part" :class="{ 'is-on': at(1.4) }">
      <g>
        <rect x="-16" y="-11" width="32" height="22" rx="6" class="kt-ssteps__packet" />
        <text x="-7" y="5" text-anchor="middle" class="kt-ssteps__ptext">?</text>
        <path d="M0 -3 h9 M0 3 h7" class="kt-ssteps__plines" />
        <animateMotion dur="5s" repeatCount="indefinite" calcMode="linear"
          keyTimes="0;0.53;0.63;1" keyPoints="0;0;1;1"><mpath href="#kt-ssteps-cross" /></animateMotion>
        <animate attributeName="opacity" dur="5s" repeatCount="indefinite"
          keyTimes="0;0.52;0.54;0.62;0.64;1" values="0;0;1;1;0;0" />
      </g>
    </g>
  </svg>
</template>

<style>
.kt-ssteps {
  width: 860px;
  height: auto;
  font-family: var(--font-family-sans);
}

.kt-ssteps__part {
  opacity: 0;
  transition: opacity 0.45s;
}

.kt-ssteps__part.is-on { opacity: 1; }

.kt-ssteps__zone { stroke-width: 1.5; fill-opacity: 0.45; }
.kt-ssteps__zone.is-local { fill: var(--kt-tint-primary); stroke: var(--kt-c-primary); }
.kt-ssteps__zone.is-cloud { fill: var(--kt-tint-secondary); stroke: var(--kt-c-secondary); }
.kt-ssteps__zonename {
  font: 700 14px var(--font-family-mono);
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.kt-ssteps__zonename.is-local { fill: var(--kt-cool); }
.kt-ssteps__zonename.is-cloud { fill: var(--kt-hot); }

.kt-ssteps__boundary {
  fill: none;
  stroke: var(--kt-heading);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 2 9;
}
.kt-ssteps__gate { stroke: var(--kt-heading); stroke-width: 3; stroke-linecap: round; }

.kt-ssteps__card { fill: var(--kt-card); stroke-width: 2; }
.kt-ssteps__card.is-local { stroke: var(--kt-c-primary); }
.kt-ssteps__card.is-cloud { stroke: var(--kt-c-secondary); }
.kt-ssteps__lit { stroke-width: 4; opacity: 0; }
.kt-ssteps__lit.is-local { fill: var(--kt-tint-primary); stroke: var(--kt-c-primary-soft); }
.kt-ssteps__lit.is-cloud { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); }

.kt-ssteps__num { font: 700 15px var(--font-family-mono); }
.kt-ssteps__num.is-local { fill: var(--kt-cool); }
.kt-ssteps__num.is-cloud { fill: var(--kt-hot); }
.kt-ssteps__title { font-size: 17px; font-weight: 700; fill: var(--kt-heading); }

.kt-ssteps__wire {
  fill: none;
  stroke: var(--kt-c-primary-soft);
  stroke-width: 2.5;
  stroke-dasharray: 6 7;
  animation: kt-ssteps-flow 1s linear infinite;
}
.kt-ssteps__wire.is-cross { stroke: var(--kt-hot); }

@keyframes kt-ssteps-flow {
  to { stroke-dashoffset: -26; }
}

.kt-ssteps__doc { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 2; }
.kt-ssteps__hash { font: 700 15px var(--font-family-mono); fill: var(--kt-c-primary-soft); }
.kt-ssteps__lines { stroke: var(--kt-subtle); stroke-width: 3; stroke-linecap: round; }
.kt-ssteps__clock { fill: var(--kt-bg); stroke: var(--kt-cool); stroke-width: 2.5; }
.kt-ssteps__hand { fill: none; stroke: var(--kt-cool); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }

.kt-ssteps__box { stroke-width: 2.5; }
.kt-ssteps__box.is-local { fill: var(--kt-tint-primary); stroke: var(--kt-c-primary); }
.kt-ssteps__box.is-cloud { fill: var(--kt-tint-secondary); stroke: var(--kt-c-secondary); }
.kt-ssteps__spark.is-local { fill: var(--kt-c-primary-soft); }
.kt-ssteps__spark.is-cloud { fill: var(--kt-hot); }
.kt-ssteps__q { fill: var(--kt-bg); stroke: var(--kt-c-primary-soft); stroke-width: 2; }
.kt-ssteps__qtext { font-size: 17px; font-weight: 800; fill: var(--kt-heading); }
.kt-ssteps__tick { fill: none; stroke: var(--kt-hot); stroke-width: 3.5; stroke-linecap: round; stroke-linejoin: round; }

.kt-ssteps__brain {
  fill: var(--kt-tint-primary);
  stroke: var(--kt-c-primary-soft);
  stroke-width: 2.6;
  stroke-linecap: round;
}

.kt-ssteps__cal { fill: var(--kt-card); stroke: var(--kt-c-secondary-soft); stroke-width: 2.5; }
.kt-ssteps__calbar { stroke: var(--kt-c-secondary-soft); stroke-width: 2.5; }
.kt-ssteps__ring { stroke: var(--kt-heading); stroke-width: 3; stroke-linecap: round; }
.kt-ssteps__dots circle { fill: var(--kt-subtle); }
.kt-ssteps__due { fill: var(--kt-hot); }

.kt-ssteps__packet { fill: var(--kt-bg); stroke: var(--kt-hot); stroke-width: 2.5; }
.kt-ssteps__ptext { font-size: 13px; font-weight: 800; fill: var(--kt-hot); }
.kt-ssteps__plines { stroke: var(--kt-hot); stroke-width: 2; stroke-linecap: round; }
</style>
