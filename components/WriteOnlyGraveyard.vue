<script setup lang="ts">
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * The fatal flaw of a Second Brain with "chat with your docs" bolted on. The CODE cards from
 * SecondBrain, small, split in Forte's two halves (Ch. 8): Capture and Organize are divergence,
 * done by you; an AI box takes over Distill and Express, the convergence, and the brain under them
 * is stamped "bypassed". Below, the result: notes go in (on disk, until you search), a tombstone
 * "write-only", summaries come out. No props.
 */
const { at } = useTimeline(4.5)
const stages = [
  { x: 30, letter: 'C', word: 'Capture' },
  { x: 240, letter: 'O', word: 'Organize' },
  { x: 450, letter: 'D', word: 'Distill' },
  { x: 660, letter: 'E', word: 'Express' },
]
</script>

<template>
  <svg class="kt-grave" viewBox="0 0 880 340" role="img"
    aria-label="AI takes over distill and express; your brain is bypassed. Notes go in, summaries come out: a write-only graveyard.">
    <!-- the CODE cards, small -->
    <g v-for="(s, i) in stages" :key="s.letter" class="kt-grave__part" :class="{ 'is-on': at(0.1 + i * 0.2) }">
      <rect :x="s.x" y="10" width="190" height="72" rx="12" class="kt-grave__card" />
      <text :x="s.x + 18" y="60" class="kt-grave__letter">{{ s.letter }}</text>
      <text :x="s.x + 54" y="54" class="kt-grave__word">{{ s.word }}</text>
    </g>
    <!-- divergence: you -->
    <g class="kt-grave__part" :class="{ 'is-on': at(0.9) }">
      <path d="M36 96 v8 h388 v-8 M230 104 v8" class="kt-grave__brace" />
      <text x="230" y="134" text-anchor="middle" class="kt-grave__half"><tspan class="kt-grave__halfname">divergence</tspan> · you</text>
    </g>

    <!-- AI takes over D and E -->
    <g class="kt-grave__part" :class="{ 'is-on': at(1.3) }">
      <rect x="440" y="2" width="420" height="88" rx="16" class="kt-grave__ai" />
      <path d="M446 96 v8 h408 v-8 M650 104 v8" class="kt-grave__brace is-hot" />
      <path d="M538 116 l4 9 9 4 -9 4 -4 9 -4 -9 -9 -4 9 -4z" class="kt-grave__spark" />
      <text x="660" y="134" text-anchor="middle" class="kt-grave__half"><tspan class="kt-grave__halfname is-hot">convergence</tspan> · AI</text>
    </g>

    <!-- your brain, bypassed -->
    <g class="kt-grave__part" :class="{ 'is-on': at(1.9) }">
      <g transform="translate(596 184) scale(1.15)">
        <path d="M0 -32 c-22 0 -38 14 -38 32 c0 18 16 32 38 32 c22 0 38 -14 38 -32 c0 -18 -16 -32 -38 -32z M0 -28 v56 M-22 -12 c8 4 8 12 0 16 M22 -12 c-8 4 -8 12 0 16" class="kt-grave__brain" />
      </g>
    </g>
    <g class="kt-grave__stamp" :class="{ 'is-on': at(2.3) }">
      <g transform="translate(704 198) rotate(-8)">
        <rect x="-74" y="-18" width="148" height="36" rx="6" class="kt-grave__stampbox" />
        <text y="8" text-anchor="middle" class="kt-grave__stamptext">bypassed</text>
      </g>
    </g>

    <!-- the result -->
    <g class="kt-grave__part" :class="{ 'is-on': at(2.8) }">
      <rect x="104" y="214" width="60" height="76" rx="6" class="kt-grave__doc is-back" />
      <rect x="114" y="222" width="60" height="76" rx="6" class="kt-grave__doc is-back" />
      <rect x="124" y="230" width="60" height="76" rx="6" class="kt-grave__doc" />
      <text x="134" y="254" class="kt-grave__hash">#</text>
      <path d="M134 270 h40 M134 282 h30 M134 294 h36" class="kt-grave__lines" />
      <text x="144" y="332" text-anchor="middle" class="kt-grave__tag">on disk, until you search</text>
      <path d="M210 266 h150 m-9 -8 l9 8 -9 8" class="kt-grave__flow" />
      <text x="282" y="252" text-anchor="middle" class="kt-grave__tag">notes go in</text>
    </g>

    <g class="kt-grave__part" :class="{ 'is-on': at(3.2) }">
      <path d="M384 310 V 238 a56 56 0 0 1 112 0 V 310z" class="kt-grave__stone" />
      <text x="440" y="250" text-anchor="middle" class="kt-grave__rip">write</text>
      <text x="440" y="278" text-anchor="middle" class="kt-grave__rip">only</text>
      <path d="M350 312 H 530" class="kt-grave__ground" />
    </g>

    <g class="kt-grave__part" :class="{ 'is-on': at(3.6) }">
      <path d="M520 266 h150 m-9 -8 l9 8 -9 8" class="kt-grave__flow" />
      <text x="596" y="252" text-anchor="middle" class="kt-grave__tag">summaries come out</text>
      <rect x="700" y="232" width="56" height="70" rx="5" class="kt-grave__doc is-sum" />
      <path d="M712 252 h32 M712 264 h32 M712 276 h22" class="kt-grave__lines" />
      <path d="M770 232 l4 9 9 4 -9 4 -4 9 -4 -9 -9 -4 9 -4z" class="kt-grave__spark" />
    </g>
  </svg>
</template>

<style>
.kt-grave {
  width: 880px;
  height: auto;
  font-family: var(--font-family-sans);
}

.kt-grave__part {
  opacity: 0;
  transition: opacity 0.45s;
}

.kt-grave__part.is-on { opacity: 1; }

.kt-grave__card { fill: var(--kt-tint-primary); stroke: var(--kt-c-primary); stroke-width: 2.5; }
.kt-grave__letter { font-size: 36px; font-weight: 800; fill: var(--kt-hot); }
.kt-grave__word { font-size: 20px; font-weight: 800; fill: var(--kt-heading); }
.kt-grave__tag { font: 14px var(--font-family-mono); fill: var(--kt-subtle); }

.kt-grave__ai {
  fill: none;
  stroke: var(--kt-hot);
  stroke-width: 2.5;
  stroke-dasharray: 8 6;
}

.kt-grave__spark { fill: var(--kt-hot); }
.kt-grave__brace { fill: none; stroke: var(--kt-c-primary-soft); stroke-width: 2; stroke-linejoin: round; }
.kt-grave__brace.is-hot { stroke: var(--kt-hot); }
.kt-grave__half { font-size: 20px; font-weight: 800; fill: var(--kt-heading); }
.kt-grave__halfname { font-family: var(--font-family-mono); letter-spacing: 0.12em; text-transform: uppercase; fill: var(--kt-c-primary-soft); }
.kt-grave__halfname.is-hot { fill: var(--kt-hot); }

.kt-grave__brain {
  fill: var(--kt-tint-neutral);
  stroke: var(--kt-line-strong);
  stroke-width: 2.4;
  stroke-linecap: round;
}

.kt-grave__stamp {
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
  transform: scale(1.6);
  transition: opacity 0.25s, transform 0.25s ease-in;
}

.kt-grave__stamp.is-on { opacity: 1; transform: none; }

.kt-grave__stampbox { fill: var(--kt-bg); stroke: var(--kt-bad); stroke-width: 3; }
.kt-grave__stamptext { font: 800 20px var(--font-family-mono); fill: var(--kt-bad); letter-spacing: 0.08em; }

.kt-grave__doc { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 2; }
.kt-grave__doc.is-back { opacity: 0.5; }
.kt-grave__doc.is-sum { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); }
.kt-grave__hash { font: 700 16px var(--font-family-mono); fill: var(--kt-c-primary-soft); }
.kt-grave__lines { stroke: var(--kt-subtle); stroke-width: 3; stroke-linecap: round; }

.kt-grave__flow {
  fill: none;
  stroke: var(--kt-line-strong);
  stroke-width: 2.5;
  stroke-dasharray: 6 7;
  stroke-linecap: round;
  animation: kt-grave-flow 1s linear infinite;
}

@keyframes kt-grave-flow {
  to { stroke-dashoffset: -26; }
}

.kt-grave__stone { fill: var(--kt-tint-neutral); stroke: var(--kt-line-strong); stroke-width: 2.5; }
.kt-grave__rip { font-size: 20px; font-weight: 800; fill: var(--kt-subtle); }
.kt-grave__ground { stroke: var(--kt-line-strong); stroke-width: 2.5; stroke-linecap: round; }
</style>
