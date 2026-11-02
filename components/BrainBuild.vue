<script setup lang="ts">
import { useId } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * The thesis, drawn small and calm: "?" challenges flow in from both sides and your brain (the
 * LearningFlow glyph) builds itself node by node, link by link, then glows. Sits under a statement.
 */
const { at } = useTimeline(4.5)
const uid = useId()
const wireL = `kt-bbuild-l-${uid}`
const wireR = `kt-bbuild-r-${uid}`
const nodes = [
  { x: 150, y: 46 }, { x: 122, y: 96 }, { x: 160, y: 134 }, { x: 176, y: 86 }, { x: 216, y: 48 },
  { x: 234, y: 102 }, { x: 278, y: 84 }, { x: 258, y: 138 }, { x: 204, y: 142 },
]
const pairs: [number, number][] = [[0, 1], [1, 2], [0, 3], [3, 2], [3, 4], [4, 6], [3, 5], [5, 6], [6, 7], [5, 7], [2, 8], [8, 7], [5, 8]]
const links = pairs.map(([a, b]) => `M${nodes[a].x} ${nodes[a].y} L${nodes[b].x} ${nodes[b].y}`)
const chips = [0, 1]
</script>

<template>
  <svg class="kt-bbuild" viewBox="0 -8 400 192" role="img" aria-label="Challenges flow in and a brain builds its own connections, node by node">
    <path :id="wireL" d="M8 88 H 96" class="kt-bbuild__wire" :class="{ 'is-on': at(0.2) }" />
    <path :id="wireR" d="M392 88 H 304" class="kt-bbuild__wire" :class="{ 'is-on': at(0.2) }" />

    <ellipse cx="200" cy="88" rx="100" ry="80" class="kt-bbuild__halo" :class="{ 'is-on': at(3.6) }" />

    <g transform="translate(200 88) scale(2.4)">
      <path d="M0 -32 c-22 0 -38 14 -38 32 c0 18 16 32 38 32 c22 0 38 -14 38 -32 c0 -18 -16 -32 -38 -32z" class="kt-bbuild__brain" :class="{ 'is-on': at(0.1) }" />
      <path d="M0 -28 v56" class="kt-bbuild__mid" :class="{ 'is-on': at(0.6) }" />
    </g>

    <path v-for="(d, i) in links" :key="`l${i}`" :d="d" class="kt-bbuild__link" :class="{ 'is-on': at(1.3 + i * 0.18) }" />
    <circle v-for="(n, i) in nodes" :key="`n${i}`" :cx="n.x" :cy="n.y" r="8" class="kt-bbuild__node" :class="{ 'is-on': at(0.9 + i * 0.17) }" />

    <g v-for="c in chips" :key="`a${c}`" class="kt-bbuild__chip" :class="{ 'is-on': at(0.8) }">
      <g>
        <circle r="12" class="kt-bbuild__q" />
        <text y="5" text-anchor="middle" class="kt-bbuild__qtext">?</text>
        <animateMotion dur="2.6s" :begin="`${c * 1.3}s`" repeatCount="indefinite"><mpath :href="`#${wireL}`" /></animateMotion>
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.2;0.8;1" dur="2.6s" :begin="`${c * 1.3}s`" repeatCount="indefinite" />
      </g>
    </g>
    <g v-for="c in chips" :key="`b${c}`" class="kt-bbuild__chip" :class="{ 'is-on': at(0.8) }">
      <g>
        <circle r="12" class="kt-bbuild__q" />
        <text y="5" text-anchor="middle" class="kt-bbuild__qtext">?</text>
        <animateMotion dur="2.6s" :begin="`${0.65 + c * 1.3}s`" repeatCount="indefinite"><mpath :href="`#${wireR}`" /></animateMotion>
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.2;0.8;1" dur="2.6s" :begin="`${0.65 + c * 1.3}s`" repeatCount="indefinite" />
      </g>
    </g>
  </svg>
</template>

<style>
.kt-bbuild {
  width: 460px;
  height: auto;
}

.kt-bbuild__wire {
  fill: none;
  stroke: var(--kt-line-strong);
  stroke-width: 2.5;
  stroke-dasharray: 6 7;
  opacity: 0;
  transition: opacity 0.4s;
}

.kt-bbuild__wire.is-on { opacity: 1; animation: kt-bbuild-flow 1s linear infinite; }

@keyframes kt-bbuild-flow {
  to { stroke-dashoffset: -26; }
}

.kt-bbuild__brain {
  fill: var(--kt-tint-primary);
  stroke: var(--kt-c-primary-soft);
  stroke-width: 1.2;
  stroke-dasharray: 220;
  stroke-dashoffset: 220;
  fill-opacity: 0;
  transition: stroke-dashoffset 0.9s ease-out, fill-opacity 0.6s 0.6s;
}

.kt-bbuild__brain.is-on { stroke-dashoffset: 0; fill-opacity: 1; }

.kt-bbuild__mid {
  stroke: var(--kt-line-strong);
  stroke-width: 1;
  stroke-dasharray: 2 3;
  opacity: 0;
  transition: opacity 0.4s;
}

.kt-bbuild__mid.is-on { opacity: 1; }

.kt-bbuild__node {
  fill: color-mix(in srgb, var(--kt-c-primary) 25%, var(--kt-bg));
  stroke: var(--kt-c-primary);
  stroke-width: 3;
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
  transform: scale(0.4);
  transition: opacity 0.3s, transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1.4);
}

.kt-bbuild__node.is-on { opacity: 1; transform: none; }

.kt-bbuild__link {
  stroke: var(--kt-c-primary-soft);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  transition: stroke-dashoffset 0.4s ease-out;
}

.kt-bbuild__link.is-on { stroke-dashoffset: 0; }

.kt-bbuild__halo {
  fill: var(--kt-c-primary);
  opacity: 0;
  transition: opacity 0.8s;
  transform-origin: 200px 88px;
  transform-box: view-box;
}

.kt-bbuild__halo.is-on { opacity: 0.12; animation: kt-bbuild-pulse 2.8s ease-in-out infinite; }

@keyframes kt-bbuild-pulse {
  50% { opacity: 0.24; transform: scale(1.05); }
}

.kt-bbuild__chip { visibility: hidden; }
.kt-bbuild__chip.is-on { visibility: visible; }
.kt-bbuild__q { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); stroke-width: 2; }
.kt-bbuild__qtext { font: 800 15px var(--font-family-sans); fill: var(--kt-hot); }

@media (prefers-reduced-motion: reduce) {
  .kt-bbuild__wire.is-on,
  .kt-bbuild__halo.is-on { animation: none; }
}
</style>
