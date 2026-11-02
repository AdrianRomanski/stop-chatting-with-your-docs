<script setup lang="ts">
import { computed } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * The coach demo's setup in one strip: the airplane-mode toggle switches on, the Wi-Fi glyph goes
 * dim and gets struck through, and the "local · Gemma" coach stays lit, pulsing like a live badge.
 * - `mode`: 'off' (the coach demo, default) | 'back' (the judge demo: the same strip in reverse,
 *   airplane mode off, Wi-Fi back, the cloud judge comes online)
 */
const props = withDefaults(defineProps<{ mode?: 'off' | 'back' }>(), { mode: 'off' })
const { at } = useTimeline(3)
const back = computed(() => props.mode === 'back')
const flying = computed(() => (back.value ? !at(0.9) : at(0.9)))
const cut = computed(() => (back.value ? !at(1.4) : at(1.4)))
const arcs = [12, 24, 36]
const arcPath = (r: number) => `M${-r * 0.74} ${-r * 0.67} A ${r} ${r} 0 0 1 ${r * 0.74} ${-r * 0.67}`
</script>

<template>
  <svg class="kt-plane" :class="{ 'is-flying': flying, 'is-cut': cut, 'is-back': back }" viewBox="0 0 800 200" role="img"
    :aria-label="back ? 'Airplane mode switches off, Wi-Fi comes back, the cloud judge comes online' : 'Airplane mode switches on, Wi-Fi goes off, the local Gemma coach keeps running'">
    <!-- the toggle -->
    <g class="kt-plane__part" :class="{ 'is-on': at(0.1) }">
      <rect x="40" y="48" width="120" height="64" rx="32" class="kt-plane__track" />
      <g class="kt-plane__knob">
        <circle cx="80" cy="80" r="26" class="kt-plane__knobc" />
        <path transform="translate(80 80) rotate(45) scale(0.95)" d="M0 -18 C2 -18 3 -16 3 -13 V-4 L18 5 V9 L3 4 V13 L8 17 V20 L0 18 L-8 20 V17 L-3 13 V4 L-18 9 V5 L-3 -4 V-13 C-3 -16 -2 -18 0 -18Z" class="kt-plane__glyph" />
      </g>
      <text x="100" y="152" text-anchor="middle" class="kt-plane__name">airplane mode</text>
      <text x="100" y="176" text-anchor="middle" class="kt-plane__sub">{{ flying ? 'on' : 'off' }}</text>
    </g>

    <!-- Wi-Fi -->
    <g class="kt-plane__part" :class="{ 'is-on': at(0.2) }">
      <g transform="translate(350 104)" class="kt-plane__wifi">
        <path v-for="(r, i) in arcs" :key="r" :d="arcPath(r)" class="kt-plane__arc" :style="{ transitionDelay: `${(2 - i) * 0.15}s` }" />
        <circle cx="0" cy="0" r="4.5" class="kt-plane__dot" />
        <path d="M-34 -50 L34 10" class="kt-plane__slash" />
      </g>
      <text x="350" y="152" text-anchor="middle" class="kt-plane__name">Wi-Fi</text>
      <text x="350" y="176" text-anchor="middle" class="kt-plane__sub">{{ cut ? 'no network' : 'connected' }}</text>
    </g>

    <!-- the coach, still running (or, in 'back' mode, the judge coming online) -->
    <g class="kt-plane__part" :class="{ 'is-on': at(0.3) }">
      <rect x="540" y="44" width="220" height="72" rx="16" class="kt-plane__coach" />
      <circle cx="568" cy="80" r="13" class="kt-plane__ring" />
      <circle cx="568" cy="80" r="7" class="kt-plane__live" />
      <text x="666" y="76" text-anchor="middle" class="kt-plane__cname">{{ back ? 'cloud · Argon' : 'local · Gemma' }}</text>
      <text x="666" y="100" text-anchor="middle" class="kt-plane__csub">{{ back ? 'blind judge' : 'mind coach' }}</text>
      <text x="650" y="152" text-anchor="middle" class="kt-plane__name">{{ back ? 'in the cloud' : 'on your laptop' }}</text>
      <text x="650" y="176" text-anchor="middle" class="kt-plane__sub kt-plane__still" :class="{ 'is-on': at(1.9) }">{{ back ? 'never sees your notes' : 'still running' }}</text>
    </g>
  </svg>
</template>

<style>
.kt-plane {
  width: 800px;
  height: auto;
  font-family: var(--font-family-sans);
}

.kt-plane__part,
.kt-plane__still {
  opacity: 0;
  transition: opacity 0.4s, stroke 0.4s;
}

.kt-plane__part.is-on,
.kt-plane__still.is-on { opacity: 1; }

/* toggle: off (neutral, knob left) → on (hot, knob right) */
.kt-plane__track {
  fill: var(--kt-tint-neutral);
  stroke: var(--kt-line-strong);
  stroke-width: 2.5;
  transition: fill 0.4s, stroke 0.4s;
}

.kt-plane__knob { transition: transform 0.45s cubic-bezier(0.5, 0, 0.2, 1); }
.kt-plane__knobc { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 2; transition: stroke 0.4s; }
.kt-plane__glyph { fill: var(--kt-subtle); transition: fill 0.4s; }

.kt-plane.is-flying .kt-plane__track { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); }
.kt-plane.is-flying .kt-plane__knob { transform: translateX(40px); }
.kt-plane.is-flying .kt-plane__knobc { stroke: var(--kt-hot); }
.kt-plane.is-flying .kt-plane__glyph { fill: var(--kt-hot); }

/* Wi-Fi: lit → dim and struck through */
.kt-plane__arc {
  fill: none;
  stroke: var(--kt-heading);
  stroke-width: 5;
  stroke-linecap: round;
  transition: opacity 0.35s, stroke 0.35s;
}

.kt-plane__dot { fill: var(--kt-heading); transition: opacity 0.35s; }

.kt-plane__slash {
  fill: none;
  stroke: var(--kt-bad);
  stroke-width: 5;
  stroke-linecap: round;
  stroke-dasharray: 92;
  stroke-dashoffset: 92;
  transition: stroke-dashoffset 0.4s ease-out 0.35s;
}

.kt-plane.is-cut .kt-plane__arc { opacity: 0.22; stroke: var(--kt-subtle); }
.kt-plane.is-cut .kt-plane__dot { opacity: 0.22; }
.kt-plane.is-cut .kt-plane__slash { stroke-dashoffset: 0; }

/* the coach stays lit */
.kt-plane__coach { fill: var(--kt-tint-primary); stroke: var(--kt-c-primary); stroke-width: 2.5; }
.kt-plane__live { fill: var(--kt-good); }
.kt-plane__ring { fill: var(--kt-good); opacity: 0.25; animation: kt-plane-live 1.4s ease-in-out infinite; }

@keyframes kt-plane-live {
  50% { opacity: 0.05; }
}

.kt-plane__cname { font-size: 21px; font-weight: 800; fill: var(--kt-heading); }
.kt-plane__csub { font: 14px var(--font-family-mono); fill: var(--kt-subtle); }
.kt-plane__name { font-size: 18px; font-weight: 700; fill: var(--kt-heading); }
.kt-plane__sub { font: 14px var(--font-family-mono); fill: var(--kt-subtle); }
.kt-plane__still { fill: var(--kt-heading); }

/* back: the judge sits in the cloud zone's colour, and only goes live once the Wi-Fi is back */
.kt-plane.is-back .kt-plane__coach { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); }
.kt-plane.is-back.is-cut .kt-plane__live,
.kt-plane.is-back.is-cut .kt-plane__ring { fill: var(--kt-subtle); animation: none; }
</style>
