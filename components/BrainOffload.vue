<script setup lang="ts">
import { computed } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * David Allen's line, drawn: a brain (the glyph from LearningFlow) strained under the notes it is
 * holding, which sway around it. The notes fly off along a dashed wire into a vault (the doc stack
 * from LearningFlow), the brain relaxes, lights up and a spark appears above it: having ideas.
 * No props.
 */
const { at } = useTimeline(4.2)
const BRAIN = { x: 300, y: 118 }
const VAULT = { x: 676, y: 112 }
const notes = [
  { x: -104, y: -44, r: -10 },
  { x: -112, y: 40, r: 8 },
  { x: -44, y: -84, r: 6 },
  { x: 46, y: -84, r: -7 },
  { x: 108, y: -40, r: 9 },
  { x: 110, y: 44, r: -6 },
]
const offloaded = computed(() => at(1.7))
const relaxed = computed(() => at(2.9))
const noteStyle = (n: typeof notes[number], i: number) => {
  const sx = BRAIN.x + n.x
  const sy = BRAIN.y + n.y
  const moved = offloaded.value
  return {
    transform: moved
      ? `translate(${VAULT.x}px, ${VAULT.y}px) scale(0.5)`
      : `translate(${sx}px, ${sy}px) rotate(${n.r}deg)`,
    opacity: moved ? 0 : 1,
    transitionDelay: moved ? `${i * 0.12}s` : '0s',
  }
}
</script>

<template>
  <svg class="kt-boff" :class="{ 'is-relaxed': relaxed }" viewBox="0 0 880 250" role="img"
    aria-label="A brain strained by the notes it holds offloads them into a vault, then lights up with a new idea">
    <!-- the wire to the vault -->
    <path d="M420 118 H 600" class="kt-boff__wire" :class="{ 'is-on': at(1.4) }" />
    <text x="510" y="98" text-anchor="middle" class="kt-boff__tag kt-boff__part" :class="{ 'is-on': at(1.4) }">offload</text>

    <!-- the vault -->
    <g class="kt-boff__part" :class="{ 'is-on': at(1.2) }">
      <rect x="626" y="58" width="70" height="88" rx="7" class="kt-boff__doc is-back" />
      <rect x="638" y="68" width="70" height="88" rx="7" class="kt-boff__doc is-back" />
      <rect x="650" y="78" width="70" height="88" rx="7" class="kt-boff__doc" :class="{ 'is-full': at(2.4) }" />
      <text x="660" y="102" class="kt-boff__hash">#</text>
      <path d="M676 96 h30 M660 118 h50 M660 132 h40 M660 146 h44" class="kt-boff__lines" />
      <text x="673" y="200" text-anchor="middle" class="kt-boff__name">your vault</text>
      <text x="673" y="224" text-anchor="middle" class="kt-boff__tag">holds the notes</text>
    </g>

    <!-- the brain -->
    <g class="kt-boff__part" :class="{ 'is-on': at(0.1) }">
      <circle :cx="BRAIN.x" :cy="BRAIN.y" r="62" class="kt-boff__halo" />
      <g :transform="`translate(${BRAIN.x} ${BRAIN.y}) scale(1.4)`">
        <g class="kt-boff__strain">
          <path d="M0 -32 c-22 0 -38 14 -38 32 c0 18 16 32 38 32 c22 0 38 -14 38 -32 c0 -18 -16 -32 -38 -32z M0 -28 v56 M-22 -12 c8 4 8 12 0 16 M22 -12 c-8 4 -8 12 0 16" class="kt-boff__brain" />
        </g>
      </g>
    </g>
    <text :x="BRAIN.x" y="224" text-anchor="middle" class="kt-boff__state" :class="{ 'is-gone': relaxed }">holding</text>
    <text :x="BRAIN.x" y="224" text-anchor="middle" class="kt-boff__state is-hot" :class="{ 'is-gone': !relaxed }">having ideas</text>

    <!-- the notes it's holding: they sway, then fly to the vault -->
    <g v-for="(n, i) in notes" :key="i" class="kt-boff__note" :class="{ 'is-on': at(0.3 + i * 0.12) }" :style="noteStyle(n, i)">
      <g class="kt-boff__sway" :style="{ animationDelay: `${i * -0.4}s` }">
        <rect x="-13" y="-16" width="26" height="32" rx="3" class="kt-boff__ndoc" />
        <path d="M-6 -6 h12 M-6 0 h12 M-6 6 h8" class="kt-boff__lines" />
      </g>
    </g>

    <!-- the spark: an idea -->
    <g class="kt-boff__spark" :class="{ 'is-on': at(3.2) }">
      <path :d="`M${BRAIN.x + 64} ${BRAIN.y - 86} l6 14 14 6 -14 6 -6 14 -6 -14 -14 -6 14 -6z`" class="kt-boff__star" />
      <path :d="`M${BRAIN.x + 92} ${BRAIN.y - 44} l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z`" class="kt-boff__star is-small" />
    </g>
  </svg>
</template>

<style>
.kt-boff {
  width: 880px;
  height: auto;
  font-family: var(--font-family-sans);
}

.kt-boff__part,
.kt-boff__wire {
  opacity: 0;
  transition: opacity 0.45s;
}

.kt-boff__part.is-on { opacity: 1; }

.kt-boff__wire {
  fill: none;
  stroke: var(--kt-c-primary-soft);
  stroke-width: 2.5;
  stroke-dasharray: 6 7;
}

.kt-boff__wire.is-on {
  opacity: 1;
  animation: kt-boff-flow 1s linear infinite;
}

@keyframes kt-boff-flow {
  to { stroke-dashoffset: -26; }
}

.kt-boff__tag { font: 14px var(--font-family-mono); fill: var(--kt-subtle); }
.kt-boff__name { font-size: 18px; font-weight: 700; fill: var(--kt-heading); }

.kt-boff__doc { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 2; transition: fill 0.4s, stroke 0.4s; }
.kt-boff__doc.is-back { opacity: 0.5; }
.kt-boff__doc.is-full { fill: var(--kt-tint-primary); stroke: var(--kt-c-primary); }
.kt-boff__hash { font: 700 17px var(--font-family-mono); fill: var(--kt-c-primary-soft); }
.kt-boff__lines { stroke: var(--kt-subtle); stroke-width: 3; stroke-linecap: round; }

/* the brain: strained (warn), then relaxed and lit */
.kt-boff__brain {
  fill: var(--kt-tint-warning);
  stroke: var(--kt-warn);
  stroke-width: 2.4;
  stroke-linecap: round;
  transition: fill 0.6s, stroke 0.6s;
}

.kt-boff.is-relaxed .kt-boff__brain { fill: var(--kt-tint-primary); stroke: var(--kt-c-primary-soft); }

.kt-boff__strain { animation: kt-boff-strain 2.2s ease-in-out infinite; }
.kt-boff.is-relaxed .kt-boff__strain { animation: none; }

@keyframes kt-boff-strain {
  50% { transform: scale(1.04); }
}

.kt-boff__halo {
  fill: var(--kt-c-primary);
  opacity: 0;
  transition: opacity 0.6s;
  transform-box: fill-box;
  transform-origin: center;
}

.kt-boff.is-relaxed .kt-boff__halo { opacity: 0.18; animation: kt-boff-pulse 2.4s ease-in-out infinite; }

@keyframes kt-boff-pulse {
  50% { opacity: 0.36; transform: scale(1.12); }
}

.kt-boff__state {
  font: 600 16px var(--font-family-mono);
  fill: var(--kt-warn);
  transition: opacity 0.45s;
}

.kt-boff__state.is-hot { fill: var(--kt-hot); }
.kt-boff__state.is-gone { opacity: 0; }

.kt-boff__note {
  opacity: 0;
  transition: transform 0.7s ease-in-out, opacity 0.45s;
}

.kt-boff__note:not(.is-on) { opacity: 0 !important; }

.kt-boff__sway {
  animation: kt-boff-sway 2.4s ease-in-out infinite;
}

@keyframes kt-boff-sway {
  0%, 100% { transform: translate(0, 0) rotate(0); }
  50% { transform: translate(0, -5px) rotate(4deg); }
}

.kt-boff__ndoc { fill: var(--kt-card); stroke: var(--kt-warn); stroke-width: 1.8; }

.kt-boff__spark {
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
  transform: scale(0.4);
  transition: opacity 0.35s, transform 0.45s cubic-bezier(0.3, 1.6, 0.5, 1);
}

.kt-boff__spark.is-on { opacity: 1; transform: none; }
.kt-boff__star { fill: var(--kt-hot); }
.kt-boff__star.is-small { opacity: 0.7; }
</style>
