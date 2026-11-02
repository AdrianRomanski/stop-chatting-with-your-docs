<script setup lang="ts">
import { useId } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * The fluency illusion as two questions about the same summary: "seen this before?" gets a
 * confident yes, "explain it, no notes?" gets nothing. A bracket names the gap between them.
 * No data: it's a concept diagram.
 */
const { at } = useTimeline(3.6)
const arrow = `kt-fgap-arrow-${useId()}`
</script>

<template>
  <svg class="kt-fgap" viewBox="0 0 800 280" role="img" aria-label="Recognizing a summary feels like knowing it; explaining it without notes fails">
    <defs>
      <marker :id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M0 0 L10 5 L0 10 z" class="kt-fgap__head" />
      </marker>
    </defs>

    <!-- the summary -->
    <g class="kt-fgap__in" :class="{ 'is-on': at(0.2) }">
      <rect x="40" y="96" width="70" height="88" rx="6" class="kt-fgap__doc" />
      <path d="M53 120 h6 M65 120 h32 M53 138 h6 M65 138 h26 M53 156 h6 M65 156 h30" class="kt-fgap__lines" />
      <text x="75" y="210" text-anchor="middle" class="kt-fgap__sub">summary.md</text>
    </g>

    <!-- two questions -->
    <path d="M118 128 C 180 128, 190 70, 250 70" class="kt-fgap__wire" :class="{ 'is-on': at(0.6) }" :marker-end="`url(#${arrow})`" />
    <path d="M118 152 C 180 152, 190 210, 250 210" class="kt-fgap__wire" :class="{ 'is-on': at(1.6) }" :marker-end="`url(#${arrow})`" />

    <g class="kt-fgap__in" :class="{ 'is-on': at(0.9) }">
      <rect x="258" y="40" width="280" height="60" rx="12" class="kt-fgap__q" />
      <text x="282" y="77" class="kt-fgap__text">Seen this before?</text>
      <circle cx="590" cy="70" r="24" class="kt-fgap__yes" />
      <path d="M578 70 l8 8 16 -16" class="kt-fgap__tick" />
      <text x="626" y="76" class="kt-fgap__text is-good">familiar</text>
    </g>

    <g class="kt-fgap__in" :class="{ 'is-on': at(1.9) }">
      <rect x="258" y="180" width="280" height="60" rx="12" class="kt-fgap__q" />
      <text x="282" y="217" class="kt-fgap__text">Explain it, no notes?</text>
      <circle cx="590" cy="210" r="24" class="kt-fgap__no" />
      <path d="M578 210 h6 M587 210 h6 M596 210 h6" class="kt-fgap__dots" />
      <text x="626" y="216" class="kt-fgap__text is-bad">blank</text>
    </g>

    <!-- the gap -->
    <g class="kt-fgap__in" :class="{ 'is-on': at(2.8) }">
      <path d="M730 70 h14 V 210 h-14" class="kt-fgap__bracket" />
      <text x="760" y="132" class="kt-fgap__gap">the</text>
      <text x="760" y="156" class="kt-fgap__gap">gap</text>
    </g>
  </svg>
</template>

<style>
.kt-fgap {
  width: 820px;
  height: auto;
  font-family: var(--font-family-sans);
}

.kt-fgap__in {
  opacity: 0;
  transition: opacity 0.4s;
}

.kt-fgap__in.is-on { opacity: 1; }

.kt-fgap__doc {
  fill: var(--kt-card);
  stroke: var(--kt-line-strong);
  stroke-width: 2;
}

.kt-fgap__lines {
  stroke: var(--kt-c-primary-soft);
  stroke-width: 3;
  stroke-linecap: round;
}

.kt-fgap__sub {
  font: 13px var(--font-family-mono);
  fill: var(--kt-subtle);
}

.kt-fgap__wire {
  fill: none;
  stroke: var(--kt-line);
  stroke-width: 2;
  stroke-dasharray: 6 6;
}

.kt-fgap__wire.is-on {
  stroke: var(--kt-c-primary-soft);
  animation: kt-fgap-flow 0.9s linear infinite;
}

@keyframes kt-fgap-flow {
  to { stroke-dashoffset: -24; }
}

.kt-fgap__head { fill: var(--kt-c-primary-soft); }

.kt-fgap__q {
  fill: var(--kt-card);
  stroke: var(--kt-line-strong);
  stroke-width: 2;
}

.kt-fgap__text {
  font-size: 21px;
  font-weight: 600;
  fill: var(--kt-heading);
}

.kt-fgap__text.is-good { fill: var(--kt-good); }
.kt-fgap__text.is-bad { fill: var(--kt-bad); }

.kt-fgap__yes { fill: var(--kt-tint-success); stroke: var(--kt-good); stroke-width: 2; }
.kt-fgap__no { fill: var(--kt-tint-secondary); stroke: var(--kt-bad); stroke-width: 2; }

.kt-fgap__tick,
.kt-fgap__dots {
  fill: none;
  stroke-width: 3.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.kt-fgap__tick { stroke: var(--kt-good); }
.kt-fgap__dots { stroke: var(--kt-bad); }

.kt-fgap__bracket {
  fill: none;
  stroke: var(--kt-hot);
  stroke-width: 3;
}

.kt-fgap__gap {
  font-size: 20px;
  font-weight: 800;
  fill: var(--kt-hot);
}
</style>
