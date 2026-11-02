<script setup lang="ts">
import { useId } from 'vue'

/**
 * The talk's cover background: the thesis in motion. Markdown notes drift on the left; challenges
 * ("?") travel from them along dashed wires to a brain on the right, which glows as they land.
 * Push, not pull. Calm loops, brand roles only, no props. Use it in the cover's `::bg::` slot.
 */
const uid = useId()

// the vault: note cards, scattered behind the title
const notes = [
  { x: 40, y: 40, d: 9 }, { x: 150, y: 150, d: 11 }, { x: 60, y: 300, d: 10 },
  { x: 250, y: 380, d: 12 }, { x: 330, y: 60, d: 13 }, { x: 170, y: 440, d: 9.5 },
  { x: 420, y: 250, d: 11.5 }, { x: 520, y: 430, d: 10.5 }, { x: 560, y: 110, d: 12.5 },
]

// the brain the challenges are pushed to
const brain = { x: 860, y: 286 }

// wires: from a note's right edge to the brain, each with its own pace
const wires = [0, 2, 3, 6, 7, 8].map((n, i) => {
  const { x, y } = notes[n]
  const sx = x + 64
  const sy = y + 40
  return {
    id: `kt-cpush-w${i}-${uid}`,
    d: `M${sx} ${sy} C ${sx + 160} ${sy}, ${brain.x - 200} ${brain.y}, ${brain.x - 62} ${brain.y}`,
    dur: 5.5 + (i % 3) * 1.1,
    begin: -i * 1.3,
  }
})
</script>

<template>
  <svg class="kt-cpush" viewBox="0 0 980 552" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <radialGradient :id="`kt-cpush-glow-${uid}`">
        <stop offset="0%" class="kt-cpush__glow-in" />
        <stop offset="100%" class="kt-cpush__glow-out" />
      </radialGradient>
      <radialGradient :id="`kt-cpush-scrim-${uid}`" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" class="kt-cpush__scrim-in" />
        <stop offset="62%" class="kt-cpush__scrim-in" />
        <stop offset="100%" class="kt-cpush__scrim-out" />
      </radialGradient>
    </defs>

    <!-- wires -->
    <path v-for="w in wires" :id="w.id" :key="w.id" :d="w.d" class="kt-cpush__wire" />

    <!-- the vault -->
    <g v-for="(n, i) in notes" :key="i" class="kt-cpush__note" :style="{ '--d': `${n.d}s`, '--o': `${-i * 1.7}s` }">
      <rect :x="n.x" :y="n.y" width="64" height="80" rx="6" class="kt-cpush__card" />
      <text :x="n.x + 10" :y="n.y + 22" class="kt-cpush__hash">#</text>
      <path :d="`M${n.x + 26} ${n.y + 16} h26 M${n.x + 10} ${n.y + 38} h44 M${n.x + 10} ${n.y + 50} h36 M${n.x + 10} ${n.y + 62} h40`" class="kt-cpush__lines" />
      <text :x="n.x + 32" :y="n.y + 98" text-anchor="middle" class="kt-cpush__md">.md</text>
    </g>

    <!-- a soft scrim keeps the title and subtitle clear of notes and wires -->
    <ellipse cx="350" cy="270" rx="420" ry="230" :fill="`url(#kt-cpush-scrim-${uid})`" />

    <!-- challenges travelling to the brain -->
    <g v-for="w in wires" :key="`c${w.id}`" class="kt-cpush__chip">
      <circle r="14" />
      <text y="6" text-anchor="middle">?</text>
      <animateMotion :dur="`${w.dur}s`" :begin="`${w.begin}s`" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.4 0 0.6 1">
        <mpath :href="`#${w.id}`" />
      </animateMotion>
      <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.5;0.62;0.9;1" :dur="`${w.dur}s`" :begin="`${w.begin}s`" repeatCount="indefinite" />
    </g>

    <!-- the brain, glowing under load -->
    <circle :cx="brain.x" :cy="brain.y" r="120" :fill="`url(#kt-cpush-glow-${uid})`" class="kt-cpush__glow" />
    <g :transform="`translate(${brain.x} ${brain.y}) scale(1.6)`" class="kt-cpush__brain">
      <path d="M0 -32 c-22 0 -38 14 -38 32 c0 18 16 32 38 32 c22 0 38 -14 38 -32 c0 -18 -16 -32 -38 -32z M0 -28 v56 M-22 -12 c8 4 8 12 0 16 M22 -12 c-8 4 -8 12 0 16" />
    </g>
  </svg>
</template>

<style>
.kt-cpush {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  font-family: var(--font-family-sans);
}

.kt-cpush__wire {
  fill: none;
  stroke: var(--kt-c-primary-soft);
  stroke-width: 1.5;
  stroke-dasharray: 5 7;
  opacity: 0.35;
  animation: kt-cpush-flow 1.4s linear infinite;
}

@keyframes kt-cpush-flow {
  to { stroke-dashoffset: -24; }
}

.kt-cpush__scrim-in { stop-color: var(--kt-bg); stop-opacity: 0.88; }
.kt-cpush__scrim-out { stop-color: var(--kt-bg); stop-opacity: 0; }

.kt-cpush__note {
  opacity: 0.32;
  animation: kt-cpush-drift var(--d) ease-in-out infinite alternate;
  animation-delay: var(--o);
}

@keyframes kt-cpush-drift {
  from { transform: translateY(0); }
  to { transform: translateY(-14px); }
}

.kt-cpush__card {
  fill: var(--kt-card);
  stroke: var(--kt-line-strong);
  stroke-width: 1.5;
}

.kt-cpush__hash {
  font: 700 16px var(--font-family-mono);
  fill: var(--kt-c-primary-soft);
}

.kt-cpush__lines {
  stroke: var(--kt-subtle);
  stroke-width: 3;
  stroke-linecap: round;
}

.kt-cpush__md {
  font: 11px var(--font-family-mono);
  fill: var(--kt-subtle);
}

.kt-cpush__chip circle {
  fill: var(--kt-tint-secondary);
  stroke: var(--kt-hot);
  stroke-width: 2;
}

.kt-cpush__chip text {
  font-size: 17px;
  font-weight: 800;
  fill: var(--kt-hot);
}

.kt-cpush__glow-in { stop-color: var(--kt-c-primary); stop-opacity: 0.55; }
.kt-cpush__glow-out { stop-color: var(--kt-c-primary); stop-opacity: 0; }

.kt-cpush__glow {
  transform-origin: 860px 286px;
  animation: kt-cpush-pulse 2.6s ease-in-out infinite;
}

@keyframes kt-cpush-pulse {
  0%, 100% { opacity: 0.55; transform: scale(0.92); }
  50% { opacity: 1; transform: scale(1.06); }
}

.kt-cpush__brain path {
  fill: var(--kt-tint-primary);
  stroke: var(--kt-c-primary-soft);
  stroke-width: 2.2;
  stroke-linecap: round;
}

@media (prefers-reduced-motion: reduce) {
  .kt-cpush__wire,
  .kt-cpush__note,
  .kt-cpush__glow { animation: none; }
}
</style>
