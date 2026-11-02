<script setup lang="ts">
import { useId } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * Outsourcing synthesis vs stress-testing it, side by side.
 * Left (the trap, secondary): the summary trap in small, files → ✨ → report → a passive you.
 * Right (primary): you connect ideas yourself, one line at a time; the AI fires "?" at two
 * connections, one turns out wrong and gets redrawn. Result lines under each panel.
 */
const { at } = useTimeline(5)
const arrow = `kt-synth-arrow-${useId()}`
const ideas = [
  { x: 500, y: 90 }, { x: 600, y: 60 }, { x: 700, y: 110 },
  { x: 560, y: 190 }, { x: 680, y: 210 }, { x: 790, y: 170 },
]
const links: [number, number][] = [[0, 1], [1, 2], [0, 3], [3, 4], [2, 5], [4, 5]]
const line = (a: number, b: number) => `M${ideas[a].x} ${ideas[a].y} L${ideas[b].x} ${ideas[b].y}`
</script>

<template>
  <svg class="kt-synth" viewBox="0 0 860 320" role="img" aria-label="Letting AI connect the dots vs connecting them yourself while AI challenges the connections">
    <defs>
      <marker :id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0 0 L10 5 L0 10 z" class="kt-synth__head" />
      </marker>
    </defs>

    <!-- panels -->
    <rect x="10" y="10" width="400" height="250" rx="16" class="kt-synth__panel is-trap" />
    <rect x="440" y="10" width="410" height="250" rx="16" class="kt-synth__panel is-good" />
    <text x="30" y="40" class="kt-synth__title is-trap">outsourcing synthesis</text>
    <text x="460" y="40" class="kt-synth__title is-good">cognitive sparring</text>

    <!-- left: the summary trap, small -->
    <g class="kt-synth__in" :class="{ 'is-on': at(0.3) }">
      <rect x="40" y="106" width="44" height="56" rx="5" class="kt-synth__doc is-back" />
      <rect x="48" y="114" width="44" height="56" rx="5" class="kt-synth__doc" />
      <path d="M58 132 h24 M58 144 h18 M58 156 h22" class="kt-synth__lines" />
      <path d="M100 142 H 136" class="kt-synth__wire" :marker-end="`url(#${arrow})`" />
      <rect x="142" y="114" width="70" height="56" rx="12" class="kt-synth__ai" />
      <path d="M170 132 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" class="kt-synth__spark" />
      <path d="M218 142 H 254" class="kt-synth__wire" :marker-end="`url(#${arrow})`" />
      <rect x="260" y="112" width="48" height="60" rx="5" class="kt-synth__doc" />
      <text x="284" y="148" text-anchor="middle" class="kt-synth__rep">report</text>
      <path d="M314 142 H 342" class="kt-synth__wire" :marker-end="`url(#${arrow})`" />
      <g transform="translate(372 142)">
        <path d="M0 -22 c-15 0 -26 9 -26 22 c0 13 11 22 26 22 c15 0 26 -9 26 -22 c0 -13 -11 -22 -26 -22z M0 -18 v36" class="kt-synth__brain is-idle" />
      </g>
    </g>
    <text x="210" y="232" text-anchor="middle" class="kt-synth__result is-bad" :class="{ 'is-on': at(1.2) }">can't reproduce it on a whiteboard</text>

    <!-- right: you connect, the AI challenges -->
    <g v-for="(n, i) in ideas" :key="i" class="kt-synth__in" :class="{ 'is-on': at(0.5 + i * 0.1) }">
      <circle :cx="n.x" :cy="n.y" r="13" class="kt-synth__idea" />
    </g>
    <path v-for="([a, b], i) in links" :key="`l${i}`" :d="line(a, b)" class="kt-synth__link"
      :class="{ 'is-on': at(1.2 + i * 0.3), 'is-wrong': i === 3 && at(3.3) && !at(4.1), 'is-fixed': i === 3 && at(4.1) }" />
    <g class="kt-synth__q" :class="{ 'is-on': at(3) && !at(4.3) }" transform="translate(620 200)">
      <circle r="14" /><text y="6" text-anchor="middle">?</text>
    </g>
    <g class="kt-synth__q" :class="{ 'is-on': at(3.4) && !at(4.6) }" transform="translate(650 85)">
      <circle r="14" /><text y="6" text-anchor="middle">?</text>
    </g>
    <text x="645" y="244" text-anchor="middle" class="kt-synth__result is-good" :class="{ 'is-on': at(4.4) }">you own the mental model</text>
  </svg>
</template>

<style>
.kt-synth {
  width: 860px;
  height: auto;
  font-family: var(--font-family-sans);
}

.kt-synth__panel { stroke-width: 2; }
.kt-synth__panel.is-trap { fill: var(--kt-tint-secondary); stroke: var(--kt-c-secondary); stroke-opacity: 0.5; }
.kt-synth__panel.is-good { fill: var(--kt-tint-primary); stroke: var(--kt-c-primary); }

.kt-synth__title {
  font: 14px var(--font-family-mono);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.kt-synth__title.is-trap { fill: var(--kt-bad); }
.kt-synth__title.is-good { fill: var(--kt-cool); }

.kt-synth__in,
.kt-synth__result,
.kt-synth__q {
  opacity: 0;
  transition: opacity 0.4s;
}

.kt-synth__in.is-on,
.kt-synth__result.is-on,
.kt-synth__q.is-on { opacity: 1; }

.kt-synth__doc { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 1.5; }
.kt-synth__doc.is-back { opacity: 0.5; }
.kt-synth__lines { stroke: var(--kt-subtle); stroke-width: 2.5; stroke-linecap: round; }
.kt-synth__rep { font: 11px var(--font-family-mono); fill: var(--kt-subtle); }
.kt-synth__ai { fill: var(--kt-tint-neutral); stroke: var(--kt-line-strong); stroke-width: 2; }
.kt-synth__spark { fill: var(--kt-subtle); }
.kt-synth__wire { fill: none; stroke: var(--kt-line-strong); stroke-width: 2; stroke-dasharray: 4 5; }
.kt-synth__head { fill: var(--kt-line-strong); }
.kt-synth__brain { fill: var(--kt-tint-neutral); stroke: var(--kt-line-strong); stroke-width: 2; }

.kt-synth__idea { fill: var(--kt-card); stroke: var(--kt-c-primary); stroke-width: 3; }

.kt-synth__link {
  stroke: var(--kt-c-primary-soft);
  stroke-width: 3.5;
  stroke-linecap: round;
  stroke-dasharray: 160;
  stroke-dashoffset: 160;
  transition: stroke-dashoffset 0.4s ease-out, stroke 0.3s;
}

.kt-synth__link.is-on { stroke-dashoffset: 0; }
.kt-synth__link.is-wrong { stroke: var(--kt-bad); stroke-dasharray: 6 6; }
.kt-synth__link.is-fixed { stroke: var(--kt-good); }

.kt-synth__q circle { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); stroke-width: 2; }
.kt-synth__q text { font-size: 17px; font-weight: 800; fill: var(--kt-hot); }

.kt-synth__result { font-size: 18px; font-weight: 700; }
.kt-synth__result.is-bad { fill: var(--kt-bad); }
.kt-synth__result.is-good { fill: var(--kt-good); }
</style>
