<script setup lang="ts">
import { computed, useId } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * Forte's shift from consuming to creating (Ch. 3, p. 48), with Vico's "we only know what we
 * make" (Ch. 7). First, content (articles, videos, posts) flows along dashed wires INTO a passive
 * brain. Then the flow flips: the inputs dim, the brain lights up, and a wire runs OUT to a
 * whiteboard where a diagram draws itself. The two sides carry Forte's two halves of CODE (Ch. 8):
 * divergence (C O) and convergence (D E). The brain glyph and wires are LearningFlow's. No props.
 */
const { at } = useTimeline(5)
const uid = useId()
const flipped = computed(() => at(2.4))
const inputs = [
  { y: 48, kind: 'doc', label: 'articles' },
  { y: 118, kind: 'video', label: 'videos' },
  { y: 188, kind: 'post', label: 'threads' },
]
const wireIn = (y: number) => `M196 ${y} C 290 ${y}, 320 118, 374 118`
const inId = (i: number) => `kt-cc-in-${uid}-${i}`
const outId = `kt-cc-out-${uid}`
// the diagram that draws itself on the whiteboard
const sketch = [
  { d: 'M664 70 h64 v40 h-64z', at: 3.0 },
  { d: 'M728 90 h36 m-8 -7 l8 7 -8 7', at: 3.3 },
  { d: 'M766 70 h64 v40 h-64z', at: 3.5 },
  { d: 'M798 110 v30 m-7 -8 l7 8 7 -8', at: 3.8 },
  { d: 'M732 142 h96 v34 h-96z', at: 4.0, hot: true },
]
</script>

<template>
  <svg class="kt-cc" :class="{ 'is-flipped': flipped }" viewBox="0 0 880 236" role="img"
    aria-label="Content flows into a passive brain; then the brain makes something: a diagram draws itself on a whiteboard">
    <!-- consume: the inputs -->
    <text x="120" y="14" text-anchor="middle" class="kt-cc__phase kt-cc__part" :class="{ 'is-on': at(0.1) }">divergence · C O</text>
    <g v-for="(n, i) in inputs" :key="n.kind" class="kt-cc__part kt-cc__input" :class="{ 'is-on': at(0.2 + i * 0.2) }">
      <rect x="44" :y="n.y - 24" width="152" height="48" rx="12" class="kt-cc__chip" />
      <template v-if="n.kind === 'doc'">
        <rect x="62" :y="n.y - 13" width="20" height="26" rx="3" class="kt-cc__icon" />
        <path :d="`M67 ${n.y - 5} h10 M67 ${n.y + 1} h10 M67 ${n.y + 7} h6`" class="kt-cc__lines" />
      </template>
      <template v-else-if="n.kind === 'video'">
        <rect x="60" :y="n.y - 11" width="26" height="22" rx="4" class="kt-cc__icon" />
        <path :d="`M70 ${n.y - 5} l8 5 -8 5z`" class="kt-cc__play" />
      </template>
      <template v-else>
        <circle cx="68" :cy="n.y + 7" r="3" class="kt-cc__play" />
        <path :d="`M65 ${n.y - 4} a11 11 0 0 1 11 11 M65 ${n.y - 11} a18 18 0 0 1 18 18`" class="kt-cc__arc" />
      </template>
      <text x="98" :y="n.y + 6" class="kt-cc__label">{{ n.label }}</text>
    </g>
    <path v-for="(n, i) in inputs" :id="inId(i)" :key="`w${i}`" :d="wireIn(n.y)" class="kt-cc__wire is-in" :class="{ 'is-on': at(0.6) }" />
    <g v-for="(n, i) in inputs" :key="`c${i}`" class="kt-cc__dot" :class="{ 'is-on': at(0.8 + i * 0.15) && !flipped }">
      <circle r="6" class="kt-cc__bead" />
      <animateMotion dur="1.6s" :begin="`${i * 0.5}s`" repeatCount="indefinite">
        <mpath :href="`#${inId(i)}`" />
      </animateMotion>
    </g>

    <!-- the brain -->
    <g class="kt-cc__part" :class="{ 'is-on': at(0.1) }">
      <circle cx="440" cy="118" r="62" class="kt-cc__halo" />
      <g transform="translate(440 118) scale(1.4)">
        <path d="M0 -32 c-22 0 -38 14 -38 32 c0 18 16 32 38 32 c22 0 38 -14 38 -32 c0 -18 -16 -32 -38 -32z M0 -28 v56 M-22 -12 c8 4 8 12 0 16 M22 -12 c-8 4 -8 12 0 16" class="kt-cc__brain" />
      </g>
    </g>
    <text x="440" y="222" text-anchor="middle" class="kt-cc__state" :class="{ 'is-gone': flipped }">passive</text>
    <text x="440" y="222" text-anchor="middle" class="kt-cc__state is-hot" :class="{ 'is-gone': !flipped }">making</text>

    <!-- create: out to the whiteboard -->
    <path :id="outId" d="M506 118 H 630" class="kt-cc__wire is-out" :class="{ 'is-on': flipped }" />
    <g class="kt-cc__dot" :class="{ 'is-on': at(2.6) }">
      <circle r="6" class="kt-cc__bead is-hot" />
      <animateMotion dur="1.4s" repeatCount="indefinite">
        <mpath :href="`#${outId}`" />
      </animateMotion>
    </g>
    <text x="746" y="14" text-anchor="middle" class="kt-cc__phase is-hot kt-cc__part" :class="{ 'is-on': flipped }">convergence · D E</text>
    <g class="kt-cc__part" :class="{ 'is-on': at(2.6) }">
      <rect x="642" y="40" width="208" height="158" rx="12" class="kt-cc__board" />
      <path d="M690 198 l-14 30 M802 198 l14 30" class="kt-cc__legs" />
    </g>
    <path v-for="(s, i) in sketch" :key="i" :d="s.d" pathLength="1" class="kt-cc__ink" :class="{ 'is-on': at(s.at), 'is-hot': s.hot }" />
  </svg>
</template>

<style>
.kt-cc {
  width: 880px;
  height: auto;
  font-family: var(--font-family-sans);
}

.kt-cc__part,
.kt-cc__dot {
  opacity: 0;
  transition: opacity 0.45s;
}

.kt-cc__part.is-on,
.kt-cc__dot.is-on { opacity: 1; }

/* once flipped, the inputs go quiet */
.kt-cc.is-flipped .kt-cc__input.is-on { opacity: 0.35; }

.kt-cc__phase { font: 600 14px var(--font-family-mono); letter-spacing: 0.16em; text-transform: uppercase; fill: var(--kt-subtle); }
.kt-cc__phase.is-hot { fill: var(--kt-hot); }

.kt-cc__chip { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 2; }
.kt-cc__icon { fill: none; stroke: var(--kt-subtle); stroke-width: 2; }
.kt-cc__lines { stroke: var(--kt-subtle); stroke-width: 2.5; stroke-linecap: round; }
.kt-cc__play { fill: var(--kt-subtle); }
.kt-cc__arc { fill: none; stroke: var(--kt-subtle); stroke-width: 2.5; stroke-linecap: round; }
.kt-cc__label { font-size: 17px; font-weight: 700; fill: var(--kt-heading); }

.kt-cc__wire {
  fill: none;
  stroke: var(--kt-line);
  stroke-width: 2.5;
  stroke-dasharray: 6 7;
  opacity: 0;
  transition: opacity 0.45s, stroke 0.45s;
}

.kt-cc__wire.is-on { opacity: 1; animation: kt-cc-flow 1s linear infinite; }
.kt-cc__wire.is-in.is-on { stroke: var(--kt-line-strong); }
.kt-cc.is-flipped .kt-cc__wire.is-in { opacity: 0.35; animation: none; }
.kt-cc__wire.is-out.is-on { stroke: var(--kt-hot); }

@keyframes kt-cc-flow {
  to { stroke-dashoffset: -26; }
}

.kt-cc__bead { fill: var(--kt-line-strong); }
.kt-cc__bead.is-hot { fill: var(--kt-hot); }

.kt-cc__brain {
  fill: var(--kt-tint-neutral);
  stroke: var(--kt-line-strong);
  stroke-width: 2.4;
  stroke-linecap: round;
  transition: fill 0.6s, stroke 0.6s;
}

.kt-cc.is-flipped .kt-cc__brain { fill: var(--kt-tint-primary); stroke: var(--kt-c-primary-soft); }

.kt-cc__halo {
  fill: var(--kt-c-primary);
  opacity: 0;
  transition: opacity 0.6s;
  transform-box: fill-box;
  transform-origin: center;
}

.kt-cc.is-flipped .kt-cc__halo { opacity: 0.18; animation: kt-cc-pulse 2.4s ease-in-out infinite; }

@keyframes kt-cc-pulse {
  50% { opacity: 0.36; transform: scale(1.12); }
}

.kt-cc__state { font: 600 16px var(--font-family-mono); fill: var(--kt-subtle); transition: opacity 0.45s; }
.kt-cc__state.is-hot { fill: var(--kt-hot); }
.kt-cc__state.is-gone { opacity: 0; }

.kt-cc__board { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 2.5; }
.kt-cc__legs { stroke: var(--kt-line-strong); stroke-width: 3; stroke-linecap: round; }

.kt-cc__ink {
  fill: none;
  stroke: var(--kt-c-primary-soft);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  transition: stroke-dashoffset 0.5s ease-out;
}

.kt-cc__ink.is-on { stroke-dashoffset: 0; }
.kt-cc__ink.is-hot { stroke: var(--kt-hot); }
</style>
