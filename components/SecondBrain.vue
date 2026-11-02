<script setup lang="ts">
import { useId } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * Tiago Forte's CODE pipeline: four stage cards (Capture, Organize, Distill, Express) with a note
 * travelling along them, an inbox tray under Capture, and under Distill a zoomed card that builds
 * progressive summarization bottom-up: raw → bold → highlight → your summary on top.
 * Once everything is in, the Capture card beats softly (lub-dub): keep what resonates, catch the
 * feeling. The card style is reused, small, by WriteOnlyGraveyard. No props.
 */
const { at } = useTimeline(5.5)
const uid = useId()
const wire = `kt-sbrain-wire-${uid}`
const stages = [
  { x: 30, letter: 'C', word: 'Capture', sub: 'keep what resonates' },
  { x: 240, letter: 'O', word: 'Organize', sub: 'by actionability' },
  { x: 450, letter: 'D', word: 'Distill', sub: 'summarize in layers' },
  { x: 660, letter: 'E', word: 'Express', sub: 'ship from packets' },
]
// progressive summarization, drawn bottom-up
const layers = [
  { y: 302, n: '1', label: 'raw', kind: 'raw' },
  { y: 274, n: '2', label: 'bold', kind: 'bold' },
  { y: 246, n: '3', label: 'highlight', kind: 'hl' },
  { y: 218, n: '4', label: 'your summary', kind: 'sum' },
]
</script>

<template>
  <svg class="kt-sbrain" viewBox="0 0 880 330" role="img"
    aria-label="CODE: capture, organize, distill, express. Distill builds in layers: raw, bold, highlight, your own summary.">
    <!-- capture: a soft heartbeat, keep what resonates -->
    <rect x="22" y="2" width="206" height="138" rx="19" class="kt-sbrain__beat" :class="{ 'is-on': at(4.9) }" />

    <!-- the CODE stages -->
    <g v-for="(s, i) in stages" :key="s.letter" class="kt-sbrain__part" :class="{ 'is-on': at(0.2 + i * 0.5) }">
      <rect :x="s.x" y="10" width="190" height="122" rx="14" class="kt-sbrain__card" :class="{ 'is-focus': i === 2 }" />
      <text :x="s.x + 20" y="62" class="kt-sbrain__letter">{{ s.letter }}</text>
      <text :x="s.x + 60" y="56" class="kt-sbrain__word">{{ s.word }}</text>
      <text :x="s.x + 20" y="96" class="kt-sbrain__sub">{{ s.sub }}</text>
    </g>

    <!-- the pipeline a note travels -->
    <path :id="wire" d="M125 156 H 755" class="kt-sbrain__wire" :class="{ 'is-on': at(2.2) }" />
    <g class="kt-sbrain__part" :class="{ 'is-on': at(2.3) }">
      <rect x="-11" y="-14" width="22" height="28" rx="3" class="kt-sbrain__doc" />
      <path d="M-5 -5 h10 M-5 1 h10 M-5 7 h6" class="kt-sbrain__lines" />
      <animateMotion dur="3.6s" repeatCount="indefinite">
        <mpath :href="`#${wire}`" />
      </animateMotion>
    </g>

    <!-- capture lands in an inbox first -->
    <g class="kt-sbrain__part" :class="{ 'is-on': at(2.6) }">
      <path d="M125 132 V 206" class="kt-sbrain__link" />
      <path d="M62 214 h126 v40 a8 8 0 0 1 -8 8 h-110 a8 8 0 0 1 -8 -8z M62 236 h36 l8 10 h38 l8 -10 h36" class="kt-sbrain__tray" />
      <text x="125" y="290" text-anchor="middle" class="kt-sbrain__tag">inbox first</text>
    </g>

    <!-- distill, zoomed: progressive summarization -->
    <g class="kt-sbrain__part" :class="{ 'is-on': at(2.9) }">
      <path d="M545 132 V 192" class="kt-sbrain__link" />
      <rect x="360" y="192" width="370" height="128" rx="12" class="kt-sbrain__zoom" />
    </g>
    <g v-for="(l, i) in layers" :key="l.n" class="kt-sbrain__part" :class="{ 'is-on': at(3.2 + i * 0.45) }">
      <text x="382" :y="l.y + 5" class="kt-sbrain__lnum">{{ l.n }}</text>
      <text x="402" :y="l.y + 5" class="kt-sbrain__lname">{{ l.label }}</text>
      <rect v-if="l.kind === 'hl'" x="530" :y="l.y - 9" width="96" height="18" rx="4" class="kt-sbrain__hl" />
      <path :d="l.kind === 'sum' ? `M530 ${l.y} h178` : `M530 ${l.y} h${l.kind === 'raw' ? 178 : l.kind === 'bold' ? 140 : 96}`"
        class="kt-sbrain__layer" :class="`is-${l.kind}`" />
    </g>
  </svg>
</template>

<style>
.kt-sbrain {
  width: 880px;
  height: auto;
  font-family: var(--font-family-sans);
}

.kt-sbrain__part {
  opacity: 0;
  transition: opacity 0.45s;
}

.kt-sbrain__part.is-on { opacity: 1; }

.kt-sbrain__card {
  fill: var(--kt-tint-primary);
  stroke: var(--kt-c-primary);
  stroke-width: 2.5;
}

.kt-sbrain__card.is-focus { stroke: var(--kt-hot); }

.kt-sbrain__beat {
  fill: none;
  stroke: var(--kt-hot);
  stroke-width: 2;
  opacity: 0;
}

.kt-sbrain__beat.is-on { animation: kt-sbrain-beat 2.6s ease-out infinite; }

@keyframes kt-sbrain-beat {
  0%, 46%, 100% { opacity: 0; }
  8% { opacity: 0.6; }
  18% { opacity: 0.12; }
  27% { opacity: 0.45; }
}

.kt-sbrain__letter { font-size: 46px; font-weight: 800; fill: var(--kt-hot); }
.kt-sbrain__word { font-size: 21px; font-weight: 800; fill: var(--kt-heading); }
.kt-sbrain__sub { font: 13px var(--font-family-mono); fill: var(--kt-subtle); }
.kt-sbrain__tag { font: 14px var(--font-family-mono); fill: var(--kt-subtle); }

.kt-sbrain__wire {
  fill: none;
  stroke: var(--kt-line);
  stroke-width: 2.5;
  stroke-dasharray: 6 7;
  opacity: 0;
  transition: opacity 0.45s;
}

.kt-sbrain__wire.is-on {
  opacity: 1;
  stroke: var(--kt-c-primary-soft);
  animation: kt-sbrain-flow 1s linear infinite;
}

@keyframes kt-sbrain-flow {
  to { stroke-dashoffset: -26; }
}

.kt-sbrain__doc { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 1.5; }
.kt-sbrain__lines { stroke: var(--kt-subtle); stroke-width: 2.5; stroke-linecap: round; }

.kt-sbrain__link {
  fill: none;
  stroke: var(--kt-line-strong);
  stroke-width: 2;
  stroke-dasharray: 3 6;
}

.kt-sbrain__tray {
  fill: var(--kt-card);
  stroke: var(--kt-line-strong);
  stroke-width: 2;
  stroke-linejoin: round;
}

.kt-sbrain__zoom { fill: var(--kt-card); stroke: var(--kt-hot); stroke-width: 2; }

.kt-sbrain__lnum { font: 700 14px var(--font-family-mono); fill: var(--kt-hot); }
.kt-sbrain__lname { font: 14px var(--font-family-mono); fill: var(--kt-fg); }

.kt-sbrain__layer { stroke-linecap: round; }
.kt-sbrain__layer.is-raw { stroke: var(--kt-line-strong); stroke-width: 3; }
.kt-sbrain__layer.is-bold { stroke: var(--kt-heading); stroke-width: 6; }
.kt-sbrain__layer.is-hl { stroke: var(--kt-heading); stroke-width: 6; }
.kt-sbrain__layer.is-sum { stroke: var(--kt-hot); stroke-width: 7; }
.kt-sbrain__hl { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); stroke-width: 1.5; }
</style>
