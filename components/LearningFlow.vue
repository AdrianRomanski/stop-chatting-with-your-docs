<script setup lang="ts">
import { computed, useId } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * The talk's core flip, drawn twice with the same nodes in the same places: vault → AI → you.
 * - `mode`: 'pull' (muted: you ask "summarize", summaries flow back, your brain stays idle) |
 *   'push' (vivid: the coach reads the vault and pushes "?" challenges, your brain lights up)
 * The architecture slide reuses these shapes.
 */
const props = withDefaults(defineProps<{ mode?: 'pull' | 'push' }>(), { mode: 'pull' })
const { at } = useTimeline(3)
const uid = useId()
const push = computed(() => props.mode === 'push')
const wireIn = `kt-lflow-in-${uid}`
const wireOut = `kt-lflow-out-${uid}`
const wireAsk = `kt-lflow-ask-${uid}`
const chips = [0, 1, 2]
</script>

<template>
  <svg class="kt-lflow" :class="`is-${mode}`" viewBox="0 0 880 300" role="img"
    :aria-label="push ? 'The coach reads the vault and pushes challenges to your brain' : 'You ask an AI wrapper for a summary of your vault; your brain stays idle'">
    <!-- wires -->
    <path :id="wireIn" d="M170 150 H 330" class="kt-lflow__wire" :class="{ 'is-on': at(0.6) }" />
    <path :id="wireOut" d="M530 150 H 690" class="kt-lflow__wire is-out" :class="{ 'is-on': at(1.2) }" />
    <path v-if="!push" :id="wireAsk" d="M690 196 C 640 236, 580 236, 530 196" class="kt-lflow__ask" :class="{ 'is-on': at(0.9) }" />
    <text v-if="!push" x="610" y="252" text-anchor="middle" class="kt-lflow__tag" :class="{ 'is-on': at(0.9) }">“summarize”</text>
    <text x="610" y="128" text-anchor="middle" class="kt-lflow__tag is-on-wire" :class="{ 'is-on': at(1.2) }">{{ push ? 'push challenge' : 'pull summary' }}</text>

    <!-- vault -->
    <g class="kt-lflow__node" :class="{ 'is-on': at(0.1) }">
      <rect x="62" y="96" width="70" height="88" rx="7" class="kt-lflow__doc is-back" />
      <rect x="74" y="106" width="70" height="88" rx="7" class="kt-lflow__doc is-back" />
      <rect x="86" y="116" width="70" height="88" rx="7" class="kt-lflow__doc" />
      <text x="96" y="140" class="kt-lflow__hash">#</text>
      <path d="M112 134 h30 M96 156 h50 M96 170 h40 M96 184 h44" class="kt-lflow__lines" />
      <text x="110" y="236" text-anchor="middle" class="kt-lflow__name">your notes</text>
    </g>

    <!-- AI in the middle -->
    <g class="kt-lflow__node" :class="{ 'is-on': at(0.3) }">
      <rect x="330" y="104" width="200" height="92" rx="16" class="kt-lflow__ai" />
      <path d="M350 140 l4 9 9 4 -9 4 -4 9 -4 -9 -9 -4 9 -4z" class="kt-lflow__spark" />
      <text x="444" y="146" text-anchor="middle" class="kt-lflow__ainame">{{ push ? 'mind coach' : 'AI wrapper' }}</text>
      <text x="444" y="170" text-anchor="middle" class="kt-lflow__sub">{{ push ? 'asks' : 'answers' }}</text>
    </g>

    <!-- you -->
    <g class="kt-lflow__node" :class="{ 'is-on': at(0.4) }">
      <circle cx="770" cy="150" r="64" class="kt-lflow__halo" />
      <g transform="translate(770 150) scale(1.4)">
        <path d="M0 -32 c-22 0 -38 14 -38 32 c0 18 16 32 38 32 c22 0 38 -14 38 -32 c0 -18 -16 -32 -38 -32z M0 -28 v56 M-22 -12 c8 4 8 12 0 16 M22 -12 c-8 4 -8 12 0 16" class="kt-lflow__brain" />
      </g>
      <text x="770" y="246" text-anchor="middle" class="kt-lflow__name">you</text>
      <text x="770" y="268" text-anchor="middle" class="kt-lflow__sub">{{ push ? 'under load' : 'idle' }}</text>
    </g>

    <!-- what travels to you -->
    <g v-for="c in chips" :key="c" class="kt-lflow__chip" :class="{ 'is-on': at(1.4 + c * 0.2) }">
      <template v-if="push">
        <circle r="15" class="kt-lflow__q" />
        <text y="6" text-anchor="middle" class="kt-lflow__qtext">?</text>
      </template>
      <template v-else>
        <rect x="-12" y="-15" width="24" height="30" rx="3" class="kt-lflow__sum" />
        <path d="M-6 -6 h12 M-6 0 h12 M-6 6 h8" class="kt-lflow__lines" />
      </template>
      <animateMotion dur="2.4s" :begin="`${c * 0.8}s`" repeatCount="indefinite">
        <mpath :href="`#${wireOut}`" />
      </animateMotion>
    </g>
  </svg>
</template>

<style>
.kt-lflow {
  width: 860px;
  height: auto;
  font-family: var(--font-family-sans);
}

.kt-lflow__node,
.kt-lflow__chip,
.kt-lflow__tag,
.kt-lflow__ask {
  opacity: 0;
  transition: opacity 0.4s;
}

.kt-lflow__node.is-on,
.kt-lflow__chip.is-on,
.kt-lflow__tag.is-on,
.kt-lflow__ask.is-on { opacity: 1; }

.kt-lflow__doc { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 2; }
.kt-lflow__doc.is-back { opacity: 0.5; }
.kt-lflow__hash { font: 700 17px var(--font-family-mono); fill: var(--kt-c-primary-soft); }
.kt-lflow__lines { stroke: var(--kt-subtle); stroke-width: 3; stroke-linecap: round; }

.kt-lflow__name { font-size: 18px; font-weight: 700; fill: var(--kt-heading); }
.kt-lflow__sub,
.kt-lflow__tag { font: 14px var(--font-family-mono); fill: var(--kt-subtle); }

.kt-lflow__ai { stroke-width: 2.5; }
.kt-lflow__ainame { font-size: 20px; font-weight: 800; fill: var(--kt-heading); }

.kt-lflow__wire {
  fill: none;
  stroke: var(--kt-line);
  stroke-width: 2.5;
  stroke-dasharray: 6 7;
}

.kt-lflow__wire.is-on { animation: kt-lflow-flow 1s linear infinite; }

@keyframes kt-lflow-flow {
  to { stroke-dashoffset: -26; }
}

.kt-lflow__ask {
  fill: none;
  stroke: var(--kt-line-strong);
  stroke-width: 2;
  stroke-dasharray: 3 6;
}

.kt-lflow__brain { stroke-width: 2.4; stroke-linecap: round; }

/* pull: muted, the brain idle */
.kt-lflow.is-pull .kt-lflow__ai { fill: var(--kt-tint-neutral); stroke: var(--kt-line-strong); }
.kt-lflow.is-pull .kt-lflow__spark { fill: var(--kt-subtle); }
.kt-lflow.is-pull .kt-lflow__wire.is-on { stroke: var(--kt-line-strong); }
.kt-lflow.is-pull .kt-lflow__brain { fill: var(--kt-tint-neutral); stroke: var(--kt-line-strong); }
.kt-lflow.is-pull .kt-lflow__halo { fill: none; }
.kt-lflow.is-pull .kt-lflow__sum { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 1.5; }

/* push: vivid, the brain glowing under load */
.kt-lflow.is-push .kt-lflow__ai { fill: var(--kt-tint-primary); stroke: var(--kt-c-primary); }
.kt-lflow.is-push .kt-lflow__spark { fill: var(--kt-c-primary-soft); }
.kt-lflow.is-push .kt-lflow__wire.is-on { stroke: var(--kt-c-primary-soft); }
.kt-lflow.is-push .kt-lflow__wire.is-out.is-on { stroke: var(--kt-hot); }
.kt-lflow.is-push .kt-lflow__brain { fill: var(--kt-tint-primary); stroke: var(--kt-c-primary-soft); }
.kt-lflow.is-push .kt-lflow__halo {
  fill: var(--kt-c-primary);
  opacity: 0.18;
  transform-origin: 770px 150px;
  animation: kt-lflow-pulse 2.4s ease-in-out infinite;
}

@keyframes kt-lflow-pulse {
  50% { opacity: 0.38; transform: scale(1.12); }
}

.kt-lflow__q { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); stroke-width: 2; }
.kt-lflow__qtext { font-size: 18px; font-weight: 800; fill: var(--kt-hot); }
</style>
