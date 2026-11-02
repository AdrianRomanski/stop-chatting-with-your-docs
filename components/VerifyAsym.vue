<script setup lang="ts">
import { computed } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * Verification asymmetry, as the coach uses it: asking is cheap to get wrong, checking is not.
 * Left, ASK: Gemma 4B fires questions in the four styles; one is off ("so-so"), and it still makes
 * me think: a spark. Right, CHECK: Gemma 12B goes through my six core assertions, one at a time,
 * temperature 0, each ticked only with my own words as evidence (ADR-0027). A small model's
 * "pass ✓" tries to slip in and is struck: a false pass is the fluency illusion again (slide 6).
 * Under both, a seesaw: the cost of a mistake, light on ask, heavy on check; it tips to check.
 * No props.
 */
const { at } = useTimeline(9)

const qs = [
  { style: 'feynman', y: 62, on: 0.6 },
  { style: 'socratic', y: 100, on: 0.9 },
  { style: 'devil', y: 140, on: 1.2, off: true },
  { style: 'cornell', y: 192, on: 1.5 },
]
const rows = [0, 1, 2, 3, 4, 5].map(i => ({ y: 58 + i * 24, on: 3.4 + i * 0.3 }))
const tilt = computed(() => (at(7.4) ? 7 : 0))
</script>

<template>
  <svg class="kt-vasym" viewBox="0 0 840 374" role="img"
    aria-label="Ask: Gemma 4B fires questions in four styles; even a so-so question still makes me think, so a wrong question is cheap. Check: Gemma 12B checks my six core assertions one by one, at temperature 0, each ticked only with my own words as evidence; a small model's pass slips in and is struck, because a false pass is the fluency illusion again, so a wrong verdict is expensive. A seesaw tips to check: small model asks, bigger model checks.">
    <!-- ASK -->
    <g class="kt-vasym__part" :class="{ 'is-on': at(0.1) }">
      <rect x="0" y="0" width="400" height="260" rx="16" class="kt-vasym__panel" />
      <text x="20" y="30" class="kt-vasym__title">ask · generate</text>
      <image href="/images/logos/gemma-mark.png" x="20" y="114" width="22" height="22" />
      <text x="48" y="124" class="kt-vasym__model">Gemma 4B</text>
      <text x="48" y="142" class="kt-vasym__sub">any style</text>
    </g>
    <g v-for="q in qs" :key="q.style" class="kt-vasym__q" :class="{ 'is-on': at(q.on), 'is-off': q.off }">
      <path :d="`M136 ${q.y} H 186`" class="kt-vasym__wire" />
      <rect x="190" :y="q.y - 14" width="108" height="28" rx="14" class="kt-vasym__bubble" />
      <text x="244" :y="q.y + 5" text-anchor="middle" class="kt-vasym__qtext">{{ q.style }} ?</text>
      <text v-if="q.off" x="244" :y="q.y + 26" text-anchor="middle" class="kt-vasym__soso">so-so question</text>
    </g>
    <g class="kt-vasym__part" :class="{ 'is-on': at(2.0) }">
      <path d="M302 120 H 326" class="kt-vasym__wire" />
      <image href="/images/speaker.webp" x="332" y="98" width="44" height="44" clip-path="circle(22px)" />
      <g class="kt-vasym__spark" :class="{ 'is-on': at(2.4) }" transform="translate(372 94)">
        <path d="M0 -10 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" />
      </g>
      <text x="354" y="160" text-anchor="middle" class="kt-vasym__sub">still thinking</text>
    </g>
    <text x="200" y="246" text-anchor="middle" class="kt-vasym__part kt-vasym__cost is-cheap" :class="{ 'is-on': at(2.6) }">wrong question → cheap</text>

    <!-- CHECK -->
    <g class="kt-vasym__part" :class="{ 'is-on': at(3.0) }">
      <rect x="440" y="0" width="400" height="260" rx="16" class="kt-vasym__panel is-check" />
      <text x="460" y="30" class="kt-vasym__title">check · verify</text>
      <image href="/images/logos/gemma-mark.png" x="460" y="104" width="22" height="22" />
      <text x="488" y="114" class="kt-vasym__model">Gemma 12B</text>
      <text x="488" y="132" class="kt-vasym__sub">temperature 0</text>
    </g>
    <g v-for="(r, i) in rows" :key="i" class="kt-vasym__q" :class="{ 'is-on': at(r.on) }">
      <rect x="606" :y="r.y - 9" width="112" height="18" rx="4" class="kt-vasym__assert" />
      <text x="614" :y="r.y + 4" class="kt-vasym__an">assertion {{ i + 1 }}</text>
      <text x="726" :y="r.y + 5" class="kt-vasym__tick">✓</text>
      <text x="744" :y="r.y + 4" class="kt-vasym__ev">“my words”</text>
    </g>
    <g class="kt-vasym__fake" :class="{ 'is-on': at(5.6), 'is-struck': at(6.2) }" transform="translate(530 212)">
      <rect x="-56" y="-16" width="112" height="32" rx="8" />
      <text y="6" text-anchor="middle">4B: pass ✓</text>
      <path d="M-62 0 H 62" class="kt-vasym__strike" />
    </g>
    <text x="728" y="217" text-anchor="middle" class="kt-vasym__part kt-vasym__illusion" :class="{ 'is-on': at(6.4) }">false pass = fluency illusion</text>
    <text x="640" y="246" text-anchor="middle" class="kt-vasym__part kt-vasym__cost is-dear" :class="{ 'is-on': at(6.8) }">wrong verdict → expensive</text>

    <!-- the seesaw: cost of a mistake -->
    <g class="kt-vasym__part" :class="{ 'is-on': at(7.0) }" transform="translate(0 14)">
      <path d="M420 346 L 404 316 H 436 Z" class="kt-vasym__pivot" />
      <g class="kt-vasym__beam" :style="{ transform: `rotate(${tilt}deg)` }">
        <rect x="140" y="304" width="560" height="10" rx="5" class="kt-vasym__bar" />
        <rect x="150" y="286" width="90" height="18" rx="5" class="kt-vasym__w is-light" />
        <text x="195" y="299" text-anchor="middle" class="kt-vasym__wt">ask</text>
        <rect x="560" y="262" width="130" height="42" rx="6" class="kt-vasym__w is-heavy" />
        <text x="625" y="289" text-anchor="middle" class="kt-vasym__wt is-heavy">check</text>
      </g>
      <text x="420" y="282" text-anchor="middle" class="kt-vasym__sub">cost of a mistake</text>
    </g>
  </svg>
</template>

<style>
.kt-vasym {
  width: 840px;
  height: auto;
  font-family: var(--font-family-sans);
}

.kt-vasym__part,
.kt-vasym__q {
  opacity: 0;
  transition: opacity 0.4s, transform 0.4s ease-out;
}

.kt-vasym__part.is-on { opacity: 1; }
.kt-vasym__q { transform: translateX(-12px); }
.kt-vasym__q.is-on { opacity: 1; transform: none; }

.kt-vasym__panel { fill: var(--kt-tint-neutral); stroke: var(--kt-line); stroke-width: 2; }
.kt-vasym__panel.is-check { fill: var(--kt-tint-primary); stroke: var(--kt-c-primary); }

.kt-vasym__title {
  font: 700 15px var(--font-family-mono);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  fill: var(--kt-fg);
}

.kt-vasym__model { font-size: 18px; font-weight: 800; fill: var(--kt-heading); }
.kt-vasym__sub { font: 12px var(--font-family-mono); fill: var(--kt-subtle); }

.kt-vasym__wire { fill: none; stroke: var(--kt-line-strong); stroke-width: 2; stroke-dasharray: 4 5; }
.kt-vasym__bubble { fill: var(--kt-card); stroke: var(--kt-c-primary); stroke-width: 2; }
.kt-vasym__qtext { font: 600 13px var(--font-family-mono); fill: var(--kt-fg); }
.kt-vasym__q.is-off .kt-vasym__bubble { stroke: var(--kt-warn); stroke-dasharray: 4 3; }
.kt-vasym__q.is-off.is-on { animation: kt-vasym-wobble 0.5s ease-in-out 2; }
.kt-vasym__soso { font: 11px var(--font-family-mono); fill: var(--kt-warn); }

@keyframes kt-vasym-wobble {
  25% { transform: rotate(-2deg); }
  75% { transform: rotate(2deg); }
}

.kt-vasym__spark path { fill: var(--kt-warn); }
.kt-vasym__spark { opacity: 0; transform-box: fill-box; transform-origin: center; }
.kt-vasym__spark.is-on { opacity: 1; animation: kt-vasym-spark 1.2s ease-in-out infinite; }

@keyframes kt-vasym-spark {
  0%, 100% { transform: translate(372px, 94px) scale(0.8); }
  50% { transform: translate(372px, 94px) scale(1.3) rotate(30deg); }
}

.kt-vasym__cost { font: 700 15px var(--font-family-mono); }
.kt-vasym__cost.is-cheap { fill: var(--kt-good); }
.kt-vasym__cost.is-dear { fill: var(--kt-bad); }

.kt-vasym__assert { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 1.2; }
.kt-vasym__an { font: 11px var(--font-family-mono); fill: var(--kt-fg); }
.kt-vasym__tick { font-size: 15px; font-weight: 800; fill: var(--kt-good); }
.kt-vasym__ev { font: italic 11px var(--font-family-sans); fill: var(--kt-cool); }

.kt-vasym__fake { opacity: 0; transition: opacity 0.3s; }
.kt-vasym__fake.is-on { opacity: 1; }
.kt-vasym__fake rect { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 1.5; }
.kt-vasym__fake text { font: 600 14px var(--font-family-mono); fill: var(--kt-fg); }
.kt-vasym__fake.is-struck text { fill: var(--kt-subtle); }
.kt-vasym__strike {
  stroke: var(--kt-bad);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 130;
  stroke-dashoffset: 130;
  transition: stroke-dashoffset 0.35s ease-out;
}
.kt-vasym__fake.is-struck .kt-vasym__strike { stroke-dashoffset: 0; }

.kt-vasym__illusion { font-size: 14px; font-weight: 700; fill: var(--kt-bad); }

.kt-vasym__pivot { fill: var(--kt-line-strong); }
.kt-vasym__beam {
  transform-box: view-box;
  transform-origin: 420px 309px;
  transition: transform 0.9s cubic-bezier(0.3, 1.5, 0.5, 1);
}
.kt-vasym__bar { fill: var(--kt-line-strong); }
.kt-vasym__w.is-light { fill: var(--kt-tint-neutral); stroke: var(--kt-good); stroke-width: 2; }
.kt-vasym__w.is-heavy { fill: color-mix(in srgb, var(--kt-bad) 25%, transparent); stroke: var(--kt-bad); stroke-width: 2.5; }
.kt-vasym__wt { font: 700 13px var(--font-family-mono); fill: var(--kt-fg); }
.kt-vasym__wt.is-heavy { font-size: 16px; fill: var(--kt-heading); }
</style>
