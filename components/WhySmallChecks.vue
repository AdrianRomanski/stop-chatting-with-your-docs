<script setup lang="ts">
import { useId } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * The bridge from "One round of sparring" (SparRound) to "Verification asymmetry" (VerifierLaw):
 * the question the round leaves open. Same two models, same words as SparRound.
 * 1. the laptop, offline; Gemma 4B · "ask question", my answer goes right
 * 2. Gemma 12B · "verify answer" (both pills the same size, centered in their boxes)
 * One line only: from "ask question" through "my answer" into "verify answer". The laptop label sits
 * top middle, with the Ollama logo: both models run on Ollama.
 * VerifierLaw answers it. No props.
 */
const { at } = useTimeline(6)
const uid = useId()
const id = (name: string) => `kt-whysc-${name}-${uid}`

const T = { laptop: 0.1, ask: 0.3, answer: 0.9, verify: 1.3 }

const L = { x: 70, y: 112, w: 270, h: 150 }
const R = { x: 540, y: 112, w: 270, h: 150 }
const PILL = 140
const PY = 86
</script>

<template>
  <svg class="kt-whysc" viewBox="22 72 836 222" role="img"
    aria-label="On my laptop, offline: Gemma 4B: ask question. My answer goes to Gemma 12B: verify answer.">
    <defs>
      <marker :id="id('head')" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M1 1 L 9 5 L 1 9" class="kt-whysc__head" />
      </marker>
    </defs>

    <!-- the laptop, offline -->
    <g class="kt-whysc__part" :class="{ 'is-on': at(T.laptop) }">
      <rect x="30" y="80" width="820" height="206" rx="20" class="kt-whysc__laptop" />
      <image href="/images/logos/ollama.svg" x="390" y="86" width="20" height="22" />
      <text x="452" y="103" text-anchor="middle" class="kt-whysc__where">offline</text>
    </g>

    <!-- Gemma 4B · asks -->
    <g class="kt-whysc__part" :class="{ 'is-on': at(T.ask) }">
      <rect :x="L.x" :y="L.y" :width="L.w" :height="L.h" rx="16" class="kt-whysc__card is-ask" />
      <image href="/images/logos/gemma-mark.png" :x="L.x + 20" :y="L.y + 22" width="30" height="30" />
      <text :x="L.x + 62" :y="L.y + 45" class="kt-whysc__model">Gemma 4B</text>
      <rect :x="L.x + (L.w - PILL) / 2" :y="L.y + PY" :width="PILL" height="28" rx="14" class="kt-whysc__role is-ask" />
      <text :x="L.x + L.w / 2" :y="L.y + PY + 19" text-anchor="middle" class="kt-whysc__roletext is-ask">ask question</text>
    </g>

    <!-- Gemma 12B · verifies -->
    <g class="kt-whysc__part" :class="{ 'is-on': at(T.verify) }">
      <rect :x="R.x" :y="R.y" :width="R.w" :height="R.h" rx="16" class="kt-whysc__card is-check" />
      <image href="/images/logos/gemma-mark.png" :x="R.x + 20" :y="R.y + 22" width="30" height="30" />
      <text :x="R.x + 62" :y="R.y + 45" class="kt-whysc__model">Gemma 12B</text>
      <rect :x="R.x + (R.w - PILL) / 2" :y="R.y + PY" :width="PILL" height="28" rx="14" class="kt-whysc__role is-check" />
      <text :x="R.x + R.w / 2" :y="R.y + PY + 19" text-anchor="middle" class="kt-whysc__roletext is-check">verify answer</text>
    </g>

    <!-- my answer → -->
    <g class="kt-whysc__part" :class="{ 'is-on': at(T.answer) }">
      <path :d="`M${L.x + (L.w + PILL) / 2 + 4} ${L.y + PY + 14} H ${R.x + (R.w - PILL) / 2 - 8}`" class="kt-whysc__wire" :marker-end="`url(#${id('head')})`" />
      <text :x="(L.x + L.w + R.x) / 2" :y="L.y + PY + 4" text-anchor="middle" class="kt-whysc__label">my answer</text>
    </g>

  </svg>
</template>

<style>
.kt-whysc { width: 100%; height: auto; overflow: visible; font-family: var(--font-family-sans); }

.kt-whysc__part { opacity: 0; transition: opacity 0.45s; }
.kt-whysc__part.is-on { opacity: 1; }

.kt-whysc__laptop { fill: color-mix(in srgb, var(--kt-c-primary) 8%, transparent); stroke: color-mix(in srgb, var(--kt-c-primary) 60%, transparent); stroke-width: 1.5; }
.kt-whysc__where { font: 800 13px var(--font-family-mono); text-transform: uppercase; letter-spacing: 0.12em; fill: var(--kt-c-primary-soft); }

.kt-whysc__card { fill: var(--kt-code-bg); stroke-width: 2.5; }
.kt-whysc__card.is-ask { stroke: var(--kt-c-primary); }
.kt-whysc__card.is-check { stroke: var(--kt-good); }
.kt-whysc__model { font-size: 24px; font-weight: 800; fill: var(--kt-heading); }
.kt-whysc__role.is-ask { fill: color-mix(in srgb, var(--kt-cool) 16%, transparent); stroke: var(--kt-cool); stroke-width: 1.5; }
.kt-whysc__role.is-check { fill: color-mix(in srgb, var(--kt-good) 16%, transparent); stroke: var(--kt-good); stroke-width: 1.5; }
.kt-whysc__roletext { font: 800 13px var(--font-family-mono); }
.kt-whysc__roletext.is-ask { fill: var(--kt-cool); }
.kt-whysc__roletext.is-check { fill: var(--kt-good); }
.kt-whysc__small { font: 600 12px var(--font-family-mono); fill: var(--kt-muted); }

.kt-whysc__wire { fill: none; stroke: var(--kt-line-strong); stroke-width: 2.5; }
.kt-whysc__label { font: 700 12px var(--font-family-mono); fill: var(--kt-muted); }
.kt-whysc__head { fill: none; stroke: var(--kt-line-strong); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.kt-whysc__head.is-hot { stroke: var(--kt-hot); }




</style>
