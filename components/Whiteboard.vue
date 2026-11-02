<script setup lang="ts">
import { useId } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * The whiteboard motif: blank two days after the summary, filled at the close.
 * - `mode`: 'blank' (an empty board, a marker, a question mark that never gets an answer) |
 *   'filled' (the coach's model drawn stroke by stroke: notes → coach → you, judge beside it)
 * - `prompt`: the question written at the top of the board
 */
withDefaults(defineProps<{ mode?: 'blank' | 'filled'; prompt?: string }>(), {
  mode: 'blank',
  prompt: 'draw it, no notes',
})
const { at } = useTimeline(4)
const arrow = `kt-board-arrow-${useId()}`
</script>

<template>
  <svg class="kt-board" :class="`is-${mode}`" viewBox="0 0 640 300" role="img" :aria-label="mode === 'blank' ? 'An empty whiteboard' : 'A whiteboard with the model drawn on it'">
    <defs>
      <marker :id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0 0 L10 5 L0 10 z" class="kt-board__head" />
      </marker>
    </defs>

    <!-- the board -->
    <rect x="20" y="10" width="600" height="250" rx="10" class="kt-board__frame" />
    <rect x="34" y="24" width="572" height="222" rx="4" class="kt-board__surface" />
    <rect x="200" y="262" width="240" height="10" rx="3" class="kt-board__tray" />
    <rect x="390" y="252" width="46" height="10" rx="4" class="kt-board__marker" />
    <text x="56" y="56" class="kt-board__prompt">{{ prompt }}</text>

    <!-- blank: the question nobody answers -->
    <g v-if="mode === 'blank'">
      <text x="320" y="178" text-anchor="middle" class="kt-board__q" :class="{ 'is-on': at(0.6) }">?</text>
      <rect x="300" y="196" width="3" height="28" class="kt-board__caret" :class="{ 'is-on': at(1.2) }" />
    </g>

    <!-- filled: the model, drawn by hand -->
    <g v-else>
      <g class="kt-board__box" :class="{ 'is-on': at(0.3) }">
        <rect x="62" y="104" width="120" height="64" rx="10" /><text x="122" y="142" text-anchor="middle">notes</text>
      </g>
      <path d="M186 136 H 250" class="kt-board__ink" :class="{ 'is-on': at(0.8) }" :marker-end="`url(#${arrow})`" />
      <g class="kt-board__box" :class="{ 'is-on': at(1.1) }">
        <rect x="256" y="104" width="128" height="64" rx="10" /><text x="320" y="142" text-anchor="middle">coach</text>
      </g>
      <path d="M388 136 H 452" class="kt-board__ink" :class="{ 'is-on': at(1.6) }" :marker-end="`url(#${arrow})`" />
      <g class="kt-board__box" :class="{ 'is-on': at(1.9) }">
        <rect x="458" y="104" width="120" height="64" rx="10" /><text x="518" y="142" text-anchor="middle">you</text>
      </g>
      <path d="M518 172 C 518 222, 420 226, 380 214" class="kt-board__ink" :class="{ 'is-on': at(2.4) }" :marker-end="`url(#${arrow})`" />
      <g class="kt-board__box is-judge" :class="{ 'is-on': at(2.8) }">
        <rect x="256" y="190" width="128" height="44" rx="10" /><text x="320" y="218" text-anchor="middle">judge</text>
      </g>
      <path d="M250 212 C 160 212, 120 196, 122 172" class="kt-board__ink is-dashed" :class="{ 'is-on': at(3.3) }" :marker-end="`url(#${arrow})`" />
    </g>
  </svg>
</template>

<style>
.kt-board {
  width: 560px;
  height: auto;
  font-family: var(--font-family-sans);
}

.kt-board__frame {
  fill: var(--kt-line);
}

.kt-board__surface {
  fill: var(--kt-card);
  stroke: var(--kt-line-strong);
  stroke-width: 1;
}

.kt-board__tray { fill: var(--kt-line-strong); }
.kt-board__marker { fill: var(--kt-c-primary); }

.kt-board__prompt {
  font: 15px var(--font-family-mono);
  fill: var(--kt-subtle);
}

.kt-board__q {
  font-size: 110px;
  font-weight: 800;
  fill: var(--kt-line-strong);
  opacity: 0;
  transition: opacity 0.6s;
}

.kt-board__q.is-on { opacity: 0.8; }

.kt-board__caret {
  fill: var(--kt-c-primary);
  opacity: 0;
}

.kt-board__caret.is-on { animation: kt-board-blink 1.2s steps(1) infinite; }

@keyframes kt-board-blink {
  50% { opacity: 1; }
}

.kt-board__box {
  opacity: 0;
  transition: opacity 0.4s;
}

.kt-board__box.is-on { opacity: 1; }

.kt-board__box rect {
  fill: var(--kt-tint-primary);
  stroke: var(--kt-c-primary);
  stroke-width: 2.5;
}

.kt-board__box.is-judge rect {
  fill: var(--kt-tint-secondary);
  stroke: var(--kt-c-secondary);
}

.kt-board__box text {
  font-size: 22px;
  font-weight: 700;
  fill: var(--kt-heading);
}

.kt-board__ink {
  fill: none;
  stroke: var(--kt-heading);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 220;
  stroke-dashoffset: 220;
  transition: stroke-dashoffset 0.5s ease-out;
}

.kt-board__ink.is-on { stroke-dashoffset: 0; }
.kt-board__ink.is-dashed.is-on { stroke-dasharray: 7 7; }

.kt-board__head { fill: var(--kt-heading); }
</style>
