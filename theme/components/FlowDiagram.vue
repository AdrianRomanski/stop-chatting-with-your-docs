<script setup lang="ts">
import { useTimeline } from '../composables/useTimeline'

/**
 * An example of the kit's animated SVG style (the NG Vienna deck's RequestFlood): clients on the
 * left, a server in the middle, users on the right; requests flow in on dashed wires, the server
 * works, pages flow out. Copy it as the starting point for a talk's own visual.
 *
 * The recipe: one SVG with a fixed viewBox, colors from --kt-* roles only, a timeline from
 * useTimeline() that switches classes (`is-on`) at fixed seconds, CSS transitions for the rest,
 * calm loops (2–3 s) for things that keep moving. No clicks.
 */
withDefaults(defineProps<{ label?: string; sub?: string }>(), { label: 'server', sub: 'rendering…' })
const { at } = useTimeline(3.5)

const lanes = [70, 130, 190, 250]
</script>

<template>
  <svg class="kt-flow" viewBox="0 0 860 320" role="img" aria-label="Requests flow from clients into a server and out to users">
    <defs>
      <marker id="kt-flow-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 z" class="kt-flow__arrowhead" />
      </marker>
    </defs>

    <!-- clients -->
    <g v-for="(y, i) in lanes" :key="`c${y}`" class="kt-flow__client" :class="{ 'is-on': at(0.2 + i * 0.15) }">
      <rect x="40" :y="y - 18" width="26" height="36" rx="5" />
      <rect x="45" :y="y - 12" width="16" height="22" rx="2" class="is-screen" />
    </g>

    <!-- requests flowing in -->
    <path
      v-for="(y, i) in lanes" :key="`w${y}`"
      :d="`M76 ${y} C 200 ${y}, 240 160, 340 160`"
      class="kt-flow__wire" :class="{ 'is-on': at(0.8 + i * 0.1) }"
    />

    <!-- the server -->
    <g class="kt-flow__server" :class="{ 'is-on': at(0.6), 'is-busy': at(1.4) }">
      <rect x="340" y="104" width="180" height="112" rx="16" />
      <text x="430" y="152" text-anchor="middle" class="kt-flow__name">{{ label }}</text>
      <text x="430" y="176" text-anchor="middle" class="kt-flow__sub">{{ sub }}</text>
    </g>

    <!-- pages flowing out -->
    <path d="M520 160 H 700" class="kt-flow__out" :class="{ 'is-on': at(2) }" marker-end="url(#kt-flow-arrow)" />
    <g class="kt-flow__user" :class="{ 'is-on': at(2.4) }">
      <rect x="712" y="124" width="44" height="72" rx="8" />
      <rect x="719" y="133" width="30" height="50" rx="3" class="is-screen" />
      <text x="734" y="226" text-anchor="middle" class="kt-flow__sub">users</text>
    </g>
  </svg>
</template>

<style>
.kt-flow {
  width: 820px;
  height: auto;
  font-family: var(--font-family-sans);
}

.kt-flow__client,
.kt-flow__user,
.kt-flow__server {
  opacity: 0;
  transition: opacity 0.4s;
}

.kt-flow__client.is-on,
.kt-flow__user.is-on,
.kt-flow__server.is-on { opacity: 1; }

.kt-flow__client rect,
.kt-flow__user rect {
  fill: var(--kt-card);
  stroke: var(--kt-line-strong);
  stroke-width: 2;
}

.kt-flow__client rect.is-screen,
.kt-flow__user rect.is-screen {
  fill: var(--kt-c-primary-soft);
  stroke: none;
  opacity: 0.6;
}

.kt-flow__wire {
  fill: none;
  stroke: var(--kt-line);
  stroke-width: 2;
  stroke-dasharray: 6 6;
  transition: stroke 0.4s;
}

.kt-flow__wire.is-on {
  stroke: var(--kt-c-primary-soft);
  animation: kt-flow 0.8s linear infinite;
}

@keyframes kt-flow {
  to { stroke-dashoffset: -24; }
}

.kt-flow__server rect {
  fill: var(--kt-tint-primary);
  stroke: var(--kt-c-primary);
  stroke-width: 2;
  transition: fill 0.4s;
}

.kt-flow__server.is-busy rect {
  animation: kt-flow-busy 1.6s ease-in-out infinite;
}

@keyframes kt-flow-busy {
  50% { fill: var(--kt-tint-secondary); stroke: var(--kt-c-secondary); }
}

.kt-flow__name {
  font-size: 20px;
  font-weight: 800;
  fill: var(--kt-heading);
}

.kt-flow__sub {
  font: 13px var(--font-family-mono);
  fill: var(--kt-subtle);
}

.kt-flow__out {
  fill: none;
  stroke: var(--kt-c-primary);
  stroke-width: 2.5;
  stroke-dasharray: 180;
  stroke-dashoffset: 180;
  transition: stroke-dashoffset 0.6s ease-out;
}

.kt-flow__out.is-on { stroke-dashoffset: 0; }

.kt-flow__arrowhead { fill: var(--kt-c-primary); }
</style>
