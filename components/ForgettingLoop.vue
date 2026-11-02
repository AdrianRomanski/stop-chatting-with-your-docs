<script setup lang="ts">
import { useId } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * The summary loop, pulled: a stack of files → the AI wrapper → you. You ask "summarize this", the
 * summaries flow back and you think "I get it", but your brain sits idle. Under it, a trace of your
 * thinking stays flat the whole time. At the end, a dashed spike shows the challenge that never came:
 * understanding is built where something pushes back. The Make It Stick cover comes in beside it as
 * the source of that idea. No data, no time axis.
 * - `docs`: the label on the stack of files (default "50 × ADR.md")
 */
withDefaults(defineProps<{ docs?: string }>(), { docs: '50 × ADR.md' })
const { at } = useTimeline(4.8)
const uid = useId()
const arrow = `kt-forget-arrow-${uid}`
const wireOut = `kt-forget-out-${uid}`
const chips = [0, 1, 2]
</script>

<template>
  <svg class="kt-forget" viewBox="0 0 880 374" role="img" aria-label="You ask an AI wrapper to summarize your files and summaries flow back; you think you get it while your thinking stays flat; nothing challenged it">
    <defs>
      <marker :id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M0 0 L10 5 L0 10 z" class="kt-forget__head" />
      </marker>
    </defs>

    <g transform="translate(0 34)">
      <!-- 1 · hoard: a stack of files -->
      <g class="kt-forget__node" :class="{ 'is-on': at(0.2) }">
        <rect x="72" y="22" width="62" height="78" rx="6" class="kt-forget__doc is-back" />
        <rect x="80" y="30" width="62" height="78" rx="6" class="kt-forget__doc is-back" />
        <rect x="88" y="38" width="62" height="78" rx="6" class="kt-forget__doc" />
        <path d="M100 62 h38 M100 74 h30 M100 86 h34" class="kt-forget__lines" />
        <text x="110" y="146" text-anchor="middle" class="kt-forget__label">{{ docs }}</text>
      </g>
      <path d="M162 75 H 254" class="kt-forget__wire" :class="{ 'is-on': at(0.5) }" :marker-end="`url(#${arrow})`" />

      <!-- 2 · the AI wrapper -->
      <g class="kt-forget__node" :class="{ 'is-on': at(0.7) }">
        <rect x="262" y="40" width="136" height="70" rx="14" class="kt-forget__ai" />
        <path d="M310 63 l4 9 9 4 -9 4 -4 9 -4 -9 -9 -4 9 -4z M340 58 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" class="kt-forget__spark" />
        <text x="330" y="146" text-anchor="middle" class="kt-forget__label">AI wrapper</text>
      </g>

      <!-- 3 · you: the brain that thinks it got it -->
      <g class="kt-forget__node" :class="{ 'is-on': at(1) }">
        <path d="M770 42 c-22 0 -38 14 -38 32 c0 18 16 32 38 32 c22 0 38 -14 38 -32 c0 -18 -16 -32 -38 -32z M770 46 v56 M748 62 c8 4 8 12 0 16 M792 62 c-8 4 -8 12 0 16" class="kt-forget__brain" />
        <text x="770" y="146" text-anchor="middle" class="kt-forget__label">“I get it”</text>
      </g>
      <text x="770" y="166" text-anchor="middle" class="kt-forget__note is-muted kt-forget__tag" :class="{ 'is-on': at(2) }">idle</text>

      <!-- 4 · you pull: ask "summarize this", the summaries flow back -->
      <path d="M770 36 C 690 -18, 410 -18, 330 34" class="kt-forget__ask" :class="{ 'is-on': at(1.3) }" :marker-end="`url(#${arrow})`" />
      <text x="550" y="-12" text-anchor="middle" class="kt-forget__label kt-forget__tag" :class="{ 'is-on': at(1.3) }">“summarize this”</text>
      <path :id="wireOut" d="M400 75 H 722" class="kt-forget__wire" :class="{ 'is-on': at(1.6) }" :marker-end="`url(#${arrow})`" />
      <text x="560" y="50" text-anchor="middle" class="kt-forget__note is-muted kt-forget__tag" :class="{ 'is-on': at(1.6) }">pull summary</text>
      <g v-for="c in chips" :key="c" class="kt-forget__chip" :class="{ 'is-on': at(1.7 + c * 0.2) }">
        <rect x="-12" y="-15" width="24" height="30" rx="3" class="kt-forget__sum" />
        <path d="M-6 -6 h12 M-6 0 h12 M-6 6 h8" class="kt-forget__lines is-bullets" />
        <animateMotion dur="2.4s" :begin="`${c * 0.8}s`" repeatCount="indefinite">
          <mpath :href="`#${wireOut}`" />
        </animateMotion>
      </g>

      <!-- your thinking, step by step: flat, then the spike a challenge would have caused -->
      <g class="kt-forget__monitor" :class="{ 'is-on': at(2.2) }">
        <rect x="40" y="178" width="664" height="138" rx="14" class="kt-forget__screen" />
        <text x="62" y="206" class="kt-forget__label is-left">your thinking</text>
      </g>
      <path d="M62 272 H 560" class="kt-forget__curve" :class="{ 'is-on': at(2.5) }" />
      <circle v-if="at(3.8)" r="5" cy="272" class="kt-forget__sweep" />
      <g class="kt-forget__end" :class="{ 'is-on': at(3.8) }">
        <text x="550" y="252" text-anchor="end" class="kt-forget__zero">flat</text>
      </g>
      <g class="kt-forget__ghost" :class="{ 'is-on': at(4.2) }">
        <path d="M560 272 H 584 L 598 214 L 612 304 L 626 246 L 638 272 H 684" class="kt-forget__spike" />
        <text x="620" y="206" text-anchor="middle" class="kt-forget__note">the challenge</text>
        <path d="M690 248 H 724" class="kt-forget__wire is-on" :marker-end="`url(#${arrow})`" />
        <image href="/images/books/make-it-stick.jpg" x="736" y="178" width="96" height="138" preserveAspectRatio="xMidYMid slice" class="kt-forget__book" />
      </g>
    </g>
  </svg>
</template>

<style>
.kt-forget {
  width: 860px;
  height: auto;
  font-family: var(--font-family-sans);
}

.kt-forget__node,
.kt-forget__tag,
.kt-forget__chip,
.kt-forget__ask,
.kt-forget__monitor,
.kt-forget__end,
.kt-forget__ghost {
  opacity: 0;
  transition: opacity 0.4s;
}

.kt-forget__node.is-on,
.kt-forget__tag.is-on,
.kt-forget__chip.is-on,
.kt-forget__ask.is-on,
.kt-forget__monitor.is-on,
.kt-forget__end.is-on,
.kt-forget__ghost.is-on { opacity: 1; }

.kt-forget__doc {
  fill: var(--kt-card);
  stroke: var(--kt-line-strong);
  stroke-width: 2;
}

.kt-forget__doc.is-back { opacity: 0.55; }

.kt-forget__lines {
  stroke: var(--kt-subtle);
  stroke-width: 3;
  stroke-linecap: round;
}

.kt-forget__lines.is-bullets { stroke: var(--kt-c-primary-soft); }

.kt-forget__ai {
  fill: var(--kt-tint-primary);
  stroke: var(--kt-c-primary);
  stroke-width: 2;
}

.kt-forget__spark { fill: var(--kt-c-primary-soft); }

.kt-forget__brain {
  fill: var(--kt-tint-neutral);
  stroke: var(--kt-line-strong);
  stroke-width: 2.5;
  stroke-linecap: round;
}

.kt-forget__label {
  font-size: 17px;
  font-weight: 600;
  fill: var(--kt-heading);
}

.kt-forget__label.is-left { font-size: 14px; font-weight: 500; fill: var(--kt-subtle); }

.kt-forget__note {
  font: 13px var(--font-family-mono);
  fill: var(--kt-subtle);
}

.kt-forget__wire {
  fill: none;
  stroke: var(--kt-line);
  stroke-width: 2;
  stroke-dasharray: 6 6;
  transition: stroke 0.4s;
}

.kt-forget__wire.is-on {
  stroke: var(--kt-c-primary-soft);
  animation: kt-forget-flow 0.9s linear infinite;
}

@keyframes kt-forget-flow {
  to { stroke-dashoffset: -24; }
}

.kt-forget__head { fill: var(--kt-c-primary-soft); }

/* you asking: a quiet dotted loop back to the wrapper */
.kt-forget__ask {
  fill: none;
  stroke: var(--kt-line-strong);
  stroke-width: 2;
  stroke-dasharray: 3 6;
}

.kt-forget__sum {
  fill: var(--kt-card);
  stroke: var(--kt-line-strong);
  stroke-width: 1.5;
}

.kt-forget__screen {
  fill: var(--kt-tint-neutral);
  stroke: var(--kt-line);
  stroke-width: 2;
}


.kt-forget__curve {
  fill: none;
  stroke: var(--kt-bad);
  stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: 500;
  stroke-dashoffset: 500;
  transition: stroke-dashoffset 1.5s ease-in;
}

.kt-forget__curve.is-on { stroke-dashoffset: 0; }

.kt-forget__sweep {
  fill: var(--kt-bad);
  animation: kt-forget-sweep 2.4s linear infinite;
}

@keyframes kt-forget-sweep {
  from { transform: translateX(62px); }
  to { transform: translateX(560px); }
}

.kt-forget__spike {
  fill: none;
  stroke: var(--kt-c-primary-soft);
  stroke-width: 3;
  stroke-linejoin: round;
  stroke-dasharray: 6 6;
}

.kt-forget__note { fill: var(--kt-c-primary-soft); }
.kt-forget__note.is-muted { fill: var(--kt-subtle); }

.kt-forget__book { filter: drop-shadow(0 6px 14px rgb(0 0 0 / 0.35)); }

.kt-forget__zero {
  font-size: 30px;
  font-weight: 800;
  fill: var(--kt-bad);
}
</style>
