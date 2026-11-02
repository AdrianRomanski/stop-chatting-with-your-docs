<script setup lang="ts">
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * The judge's recap, from the speaker's real session of 25 Oct 2026 ([^session-1025]): the
 * challenge Gemma asked, verbatim; my answer in my words, verbatim; Gemma 4B (Tier 1) says "pass" and fades out, struck through; Argon (Tier 2) says
 * "fail", a dashed wire runs to the answer and underlines it; then Argon's extracted claim marked
 * "hand-waving" (verbatim from the session file), one gap (shortened: a paraphrase, see the
 * slide's notes) and the next review, tomorrow. Plays once; the fail dot then pulses calmly.
 * No props: the content is that one session.
 */
const { at } = useTimeline(4.2)

const QUESTION = '“What is the author’s primary argument regarding this layered text processing system?”'
const ANSWER = '“it helps take the essence of text”'
const CLAIM = '“The layered text processing system helps extract the essence of text.”'
const GAP = 'how highlighting works inside the bolded text'

// the underline under the answer: 23 waves of 16 px, x 24 → 392 (the quote is ~369 px wide)
const squiggle = `M24 84 q 8 6 16 0${' t 16 0'.repeat(22)}`
</script>

<template>
  <svg class="kt-agap" viewBox="0 0 820 274" role="img"
    aria-label="The challenge: what is the author's primary argument regarding this layered text processing system? My answer: it helps take the essence of text. Gemma 4B: pass, struck out. Argon: fail. The claim, the layered text processing system helps extract the essence of text, is marked hand-waving. Gap: how highlighting works inside the bolded text. Next review: tomorrow">
    <!-- the challenge, verbatim -->
    <g class="kt-agap__part" :class="{ 'is-on': at(0.1) }">
      <rect x="4" y="4" width="812" height="46" rx="14" class="kt-agap__ask" />
      <image href="/images/logos/gemma-mark.png" x="18" y="15" width="24" height="24" />
      <text x="52" y="33" class="kt-agap__question">{{ QUESTION }}</text>
    </g>

    <g transform="translate(0 60)">
    <!-- my answer -->
    <g class="kt-agap__part" :class="{ 'is-on': at(0.3) }">
      <rect x="4" y="4" width="486" height="92" rx="14" class="kt-agap__card" />
      <text x="24" y="32" class="kt-agap__label">my answer · 25 Oct</text>
    </g>
    <g class="kt-agap__part" :class="{ 'is-on': at(0.6) }">
      <text x="24" y="72" class="kt-agap__quote">{{ ANSWER }}</text>
    </g>

    <!-- Tier 1: Gemma 4B passes it, then fades -->
    <g class="kt-agap__part kt-agap__t1" :class="{ 'is-on': at(0.9), 'is-faded': at(1.8) }">
      <rect x="520" y="6" width="296" height="40" rx="20" class="kt-agap__chip is-good" />
      <image href="/images/logos/gemma-mark.png" x="532" y="14" width="24" height="24" />
      <text x="566" y="32" class="kt-agap__who">Gemma 4B</text>
      <text x="796" y="32" text-anchor="end" class="kt-agap__pass">pass ✓</text>
      <path d="M540 26 H 800" class="kt-agap__strike" :class="{ 'is-on': at(1.8) }" />
    </g>

    <!-- Tier 2: Argon fails it -->
    <g class="kt-agap__part" :class="{ 'is-on': at(2.2) }">
      <rect x="520" y="54" width="296" height="40" rx="20" class="kt-agap__chip is-bad" />
      <image href="/images/logos/gemini-mark.png" x="532" y="61" width="26" height="25" />
      <text x="566" y="80" class="kt-agap__who">Argon</text>
      <circle cx="744" cy="74" r="6" class="kt-agap__dot" />
      <text x="796" y="80" text-anchor="end" class="kt-agap__fail">fail</text>
    </g>

    <!-- Argon marks the answer -->
    <g class="kt-agap__part" :class="{ 'is-on': at(2.6) }">
      <path d="M520 74 C 470 74 450 84 402 84" class="kt-agap__wire" />
      <path :d="squiggle" class="kt-agap__squiggle" />
    </g>

    <!-- the claim it extracted: hand-waving -->
    <g class="kt-agap__part" :class="{ 'is-on': at(3.0) }">
      <path d="M78 92 V 124" class="kt-agap__wire" />
      <text x="168" y="114" class="kt-agap__by">Argon extracted the claim</text>
      <rect x="4" y="124" width="148" height="34" rx="17" class="kt-agap__pill is-bad" />
      <text x="78" y="146" text-anchor="middle" class="kt-agap__pilltext">hand-waving</text>
      <text x="168" y="147" class="kt-agap__text">{{ CLAIM }}</text>
    </g>

    <!-- one gap, and the next review -->
    <g class="kt-agap__part" :class="{ 'is-on': at(3.4) }">
      <rect x="4" y="174" width="148" height="34" rx="17" class="kt-agap__pill is-bad" />
      <text x="78" y="196" text-anchor="middle" class="kt-agap__pilltext">gap</text>
      <text x="168" y="197" class="kt-agap__text">{{ GAP }}</text>
    </g>
    <g class="kt-agap__part" :class="{ 'is-on': at(3.8) }">
      <rect x="600" y="174" width="216" height="34" rx="17" class="kt-agap__pill is-next" />
      <text x="708" y="196" text-anchor="middle" class="kt-agap__pilltext">next review: tomorrow</text>
    </g>
    </g>
  </svg>
</template>

<style>
.kt-agap {
  width: 800px;
  height: auto;
  font-family: var(--font-family-sans);
}

.kt-agap__part {
  opacity: 0;
  transition: opacity 0.45s;
}
.kt-agap__part.is-on { opacity: 1; }
.kt-agap__t1.is-faded { opacity: 0.35; }

.kt-agap__ask { fill: var(--kt-tint-primary); stroke: var(--kt-c-primary-soft); stroke-width: 1.5; }
.kt-agap__question { font: 600 17px var(--font-family-sans); fill: var(--kt-heading); }
.kt-agap__card { fill: var(--kt-card); stroke: var(--kt-c-primary); stroke-width: 2; }
.kt-agap__label {
  font: 700 13px var(--font-family-mono);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  fill: var(--kt-cool);
}
.kt-agap__quote { font: 600 22px var(--font-family-sans); fill: var(--kt-fg); }
.kt-agap__by { font: 12px var(--font-family-mono); fill: var(--kt-subtle); }
.kt-agap__text { font: 500 17px var(--font-family-sans); fill: var(--kt-fg); }

.kt-agap__chip { fill: var(--kt-card); stroke-width: 2; }
.kt-agap__chip.is-good { stroke: var(--kt-good); }
.kt-agap__chip.is-bad { stroke: var(--kt-bad); }
.kt-agap__who { font: 600 15px var(--font-family-mono); fill: var(--kt-heading); }
.kt-agap__pass { font: 700 15px var(--font-family-mono); fill: var(--kt-good); }
.kt-agap__fail { font: 700 15px var(--font-family-mono); fill: var(--kt-bad); }

.kt-agap__strike {
  fill: none;
  stroke: var(--kt-fg);
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-dasharray: 260;
  stroke-dashoffset: 260;
  transition: stroke-dashoffset 0.5s ease-out;
}
.kt-agap__strike.is-on { stroke-dashoffset: 0; }

.kt-agap__wire {
  fill: none;
  stroke: var(--kt-hot);
  stroke-width: 2.5;
  stroke-dasharray: 6 7;
  animation: kt-agap-flow 1s linear infinite;
}

@keyframes kt-agap-flow {
  to { stroke-dashoffset: -26; }
}

.kt-agap__squiggle {
  fill: none;
  stroke: var(--kt-bad);
  stroke-width: 2.5;
  stroke-linecap: round;
}

.kt-agap__pill { stroke-width: 2; }
.kt-agap__pill.is-bad { fill: var(--kt-tint-secondary); stroke: var(--kt-bad); }
.kt-agap__pill.is-next { fill: var(--kt-tint-primary); stroke: var(--kt-c-primary); }
.kt-agap__pilltext { font: 700 14px var(--font-family-mono); fill: var(--kt-heading); }

.kt-agap__dot {
  fill: var(--kt-bad);
  transform-box: fill-box;
  transform-origin: center;
  animation: kt-agap-pulse 2.4s ease-in-out infinite;
}

@keyframes kt-agap-pulse {
  50% { opacity: 0.45; transform: scale(1.35); }
}
</style>
