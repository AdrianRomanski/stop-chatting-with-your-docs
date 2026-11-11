<script setup lang="ts">
import { useId } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * From distilled notes to a concept (kb-template ADR-KI-0058, ADR-KI-0060, ADR-KI-0061, ai-coach
 * ADR-0018 and ADR-0023), on the speaker's real material: Building a Second Brain, p. 100, and their
 * real concept note "Distillation" (test vault, 25 Oct 2026). Replaces ReadingFlow + the old
 * four-layer ConceptNote: the layers were shown on DistillLayers, so here they're already done.
 * Left, already there: a group of six distilled notes, stacked; on top, my note on p. 100: its summary in my words on top, the passage
 * as I marked it under it (bold, three highlights; how is on DistillLayers).
 * Middle, the process: synthesize (the CLI command under it, `$ coach synthesize`), one idea, with Gemma's help (its mark rides the arrow and glows
 * while the note fills), but from my own core assertions.
 * Right, the concept note fills field by field, each from its source: core_assertions from my
 * words, never from the book (three of mine, tagged "my words"); forbidden_buzzwords. No props.
 */
const { at } = useTimeline(7.2)
const uid = useId()
const arrowHot = `kt-cnote-arrow-hot-${uid}`

const summary = [
  'When I find something interesting',
  'I bold it, then I highlight parts',
  'of the bold, and at the end I add',
  'a summary.',
]
// three of my real core assertions
const assertions = [
  ['The learner identifies interesting', 'text by bolding it.'],
  ['The learner then highlights portions', 'of the bolded text.'],
  ['The learner creates a fourth layer', 'consisting of a summary.'],
]
// suggested by Gemma, kept by me: the concept's own label, the author's phrase, a vague stand-in
const buzzwords = ['distill', 'main points', 'important parts']

const SYN = 1.2 // synthesize
// Gemma, on the arrow's midpoint; it works while the note fills
const C = 1.9 // the concept note starts filling
</script>

<template>
  <svg class="kt-cnote" viewBox="0 30 900 384" role="img"
    aria-label="Already there: a group of six distilled notes; on top, my note on Building a Second Brain, page 100, its summary in my words: when I find something interesting I bold it, then I highlight parts of the bold, and at the end I add a summary; under it the passage as I marked it, in bold, with main points of a note, distilling the essence and layers highlighted. Then I synthesize one idea into a concept note, Distillation, with Gemma's help but from my own core assertions, in my words, never from the book; and forbidden buzzwords.">
    <defs>
      <marker :id="arrowHot" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M0 0 L10 5 L0 10 z" class="kt-cnote__head is-hot" />
      </marker>
        </defs>

    <!-- ===== left · already there ===== -->
    <!-- my note, already distilled: my summary on top, the passage as I marked it under it -->
    <!-- a group of distilled notes: five more under the one on top -->
    <!-- the card colours are see-through: each card sits on an opaque backing -->
    <g v-for="k in [5, 4, 3, 2, 1]" :key="`st${k}`" class="kt-cnote__part" :class="{ 'is-on': at(0.05 * k) }">
      <rect :x="1 + k * 6" :y="40 + k * 6" width="330" height="250" rx="12" class="kt-cnote__backing" />
      <rect :x="1 + k * 6" :y="40 + k * 6" width="330" height="250" rx="12" class="kt-cnote__page is-under" />
    </g>
    <text x="196" y="342" text-anchor="middle" class="kt-cnote__part kt-cnote__src" :class="{ 'is-on': at(0.3) }">a group of 6 distilled notes</text>
    <g class="kt-cnote__part" :class="{ 'is-on': at(0.1) }">
      <rect x="1" y="40" width="330" height="250" rx="12" class="kt-cnote__backing" />
      <rect x="1" y="40" width="330" height="250" rx="12" class="kt-cnote__page" />
      <rect x="18" y="54" width="296" height="120" rx="6" class="kt-cnote__callout" />
      <path d="M20 56 V 172" class="kt-cnote__callout-bar" />
      <text x="32" y="74" class="kt-cnote__callout-tag">&gt; [!summary] · my words</text>
      <text v-for="(line, i) in summary" :key="line" x="32" :y="98 + i * 20" class="kt-cnote__callout-text">{{ line }}</text>
    </g>
    <foreignObject x="14" y="184" width="304" height="100" class="kt-cnote__part" :class="{ 'is-on': at(0.1) }">
      <p xmlns="http://www.w3.org/1999/xhtml" class="kt-cnote__marked">
        The technique is simple: you highlight the <mark>main points of a note</mark>, and then
        highlight the main points of those highlights, and so on, <mark>distilling the essence</mark>
        of a note in several “<mark>layers</mark>.”
      </p>
    </foreignObject>

    <!-- ===== middle · the process: synthesize ===== -->
    <path d="M364 154 C 430 154, 440 106, 496 106" pathLength="1" class="kt-cnote__feed is-hot is-thick"
      :class="{ 'is-on': at(SYN) }" :marker-end="`url(#${arrowHot})`" />
    <!-- Gemma helps: its mark rides the arrow and glows while the note fills -->
    <g class="kt-cnote__pop" :class="{ 'is-on': at(SYN + 0.3) }">
      <g class="kt-cnote__gemma" :class="{ 'is-busy': at(C) && !at(C + 3.6) }">
        <circle cx="434" cy="130" r="28" class="kt-cnote__gemmaglow" />
        <rect x="414" y="110" width="40" height="40" rx="10" class="kt-cnote__badge" />
        <image href="/images/logos/gemma-mark.png" x="417" y="113" width="34" height="34" class="kt-cnote__logo" />
      </g>
    </g>
    <g class="kt-cnote__part" :class="{ 'is-on': at(SYN) }">
      <text x="430.5" y="184" text-anchor="middle" class="kt-cnote__synth">Gemma assisted</text>
      <text x="430.5" y="204" text-anchor="middle" class="kt-cnote__synth">Synthesis</text>
    </g>

    <!-- the CLI command that runs it, centered in the gap between the stack (its back page ends at 361) and the card (500) -->
    <g class="kt-cnote__part" :class="{ 'is-on': at(SYN) }">
      <rect x="316.5" y="370" width="228" height="36" rx="10" class="kt-cnote__term" />
      <text x="430.5" y="394" text-anchor="middle" class="kt-cnote__cmd"><tspan class="is-dollar">$ </tspan><tspan class="is-prog">coach</tspan> synthesize</text>
    </g>

    <!-- ===== right · the concept note ===== -->
    <g class="kt-cnote__part" :class="{ 'is-on': at(C) }">
      <rect x="500" y="40" width="398" height="282" rx="12" class="kt-cnote__card" />
      <rect x="516" y="56" width="16" height="16" rx="2" transform="rotate(45 524 64)" class="kt-cnote__diamond" />
      <text x="544" y="70" class="kt-cnote__title">concept · Distillation</text>
      <path d="M500 84 H 898" class="kt-cnote__rule" />
    </g>

    <!-- core_assertions ← my words -->
    <g class="kt-cnote__part" :class="{ 'is-on': at(C + 0.3) }">
      <text x="516" y="110" class="kt-cnote__key">core_assertions</text>
    </g>
    <g v-for="(lines, i) in assertions" :key="i" class="kt-cnote__item" :class="{ 'is-on': at(C + 0.6 + i * 0.6) }">
      <text x="516" :y="134 + i * 44" class="kt-cnote__bullet">{{ i + 1 }}</text>
      <text v-for="(line, j) in lines" :key="line" x="534" :y="134 + i * 44 + j * 19" class="kt-cnote__assert">{{ line }}</text>
    </g>
    <g class="kt-cnote__part" :class="{ 'is-on': at(C + 0.3) }">
      <rect x="806" y="96" width="78" height="20" rx="10" class="kt-cnote__pill" />
      <text x="845" y="110" text-anchor="middle" class="kt-cnote__pill-text">my words</text>
    </g>

    <!-- forbidden_buzzwords -->
    <g class="kt-cnote__part" :class="{ 'is-on': at(C + 3.0) }">
      <text x="516" y="266" class="kt-cnote__key">forbidden_buzzwords</text>
    </g>
    <g v-for="(w, c) in buzzwords" :key="w" class="kt-cnote__part" :class="{ 'is-on': at(C + 3.3 + c * 0.3) }">
      <rect :x="516 + [0, 94, 220][c]" y="276" :width="[86, 118, 150][c]" height="24" rx="12" class="kt-cnote__chip" />
      <text :x="516 + [0, 94, 220][c] + 24" y="293" class="kt-cnote__word">{{ w }}</text>
      <text :x="516 + [0, 94, 220][c] + 11" y="293" class="kt-cnote__no">✕</text>
    </g>

  </svg>
</template>

<style>
.kt-cnote {
  width: 880px;
  height: auto;
  overflow: visible;
  font-family: var(--font-family-sans);
}

.kt-cnote__part {
  opacity: 0;
  transition: opacity 0.45s;
}

.kt-cnote__part.is-on { opacity: 1; }

/* the document shapes: my note, the raw book, the concept card */
.kt-cnote__page { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 2; }
.kt-cnote__backing { fill: var(--kt-bg); }
.kt-cnote__page.is-under { fill: color-mix(in srgb, var(--kt-card) 70%, var(--kt-bg)); stroke: var(--kt-line); stroke-width: 1.5; }
.kt-cnote__card { fill: var(--kt-tint-primary); stroke: var(--kt-c-primary); stroke-width: 2.5; }
.kt-cnote__rule { stroke: var(--kt-line); stroke-width: 1.5; }
.kt-cnote__diamond { fill: var(--kt-hot); }

.kt-cnote__title { font-size: 18px; font-weight: 800; fill: var(--kt-heading); }
.kt-cnote__key { font: 700 13px var(--font-family-mono); fill: var(--kt-cool); }
.kt-cnote__src { font: 12px var(--font-family-mono); fill: var(--kt-subtle); }
.kt-cnote__src.is-hot { fill: var(--kt-hot); }
.kt-cnote__synth { font-size: 15px; font-weight: 800; fill: var(--kt-hot); }

/* already distilled: my summary, and under it the passage as I marked it (bold, highlights) */
.kt-cnote__marked {
  margin: 0;
  font: 700 13.5px/1.45 Georgia, 'Times New Roman', serif;
  color: var(--kt-heading);
}
.kt-cnote__marked mark {
  padding: 0 2px;
  border-radius: 3px;
  background: color-mix(in srgb, var(--kt-warn) 42%, transparent);
  color: var(--kt-heading);
}
.kt-cnote__callout { fill: var(--kt-tint-secondary); }
.kt-cnote__callout-bar { stroke: var(--kt-hot); stroke-width: 4; stroke-linecap: round; }
.kt-cnote__callout-tag { font: 11px var(--font-family-mono); fill: var(--kt-hot); }
.kt-cnote__callout-text { font-size: 15px; font-weight: 800; fill: var(--kt-hot); }

/* the fields */
.kt-cnote__assert { font-size: 15.5px; font-weight: 800; fill: var(--kt-hot); }
.kt-cnote__bullet { font: 700 13px var(--font-family-mono); fill: var(--kt-hot); }
.kt-cnote__word { font: 12.5px var(--font-family-mono); fill: var(--kt-fg); }
.kt-cnote__no { font: 700 13px var(--font-family-mono); fill: var(--kt-bad); }

/* each assertion slides in from the feed */
.kt-cnote__item { opacity: 0; transform: translateX(-14px); transition: opacity 0.45s, transform 0.5s ease-out; }
.kt-cnote__item.is-on { opacity: 1; transform: none; }
.kt-cnote__pill { fill: none; stroke: var(--kt-hot); stroke-width: 1.5; }
.kt-cnote__pill-text { font: 700 11px var(--font-family-mono); fill: var(--kt-hot); }
/* Gemma on the synthesize arrow, as the cover's mark: a badge that glows while it works */
.kt-cnote__pop > * { transform: scale(0); transform-box: fill-box; transform-origin: center; transition: transform 0.4s cubic-bezier(0.3, 1.6, 0.5, 1); }
.kt-cnote__pop.is-on > * { transform: scale(1); }
.kt-cnote__badge { fill: var(--kt-tint-primary); stroke: var(--kt-c-primary-soft); stroke-width: 2; transition: stroke 0.3s, fill 0.3s; }
.kt-cnote__gemma.is-busy .kt-cnote__badge { fill: color-mix(in srgb, var(--kt-c-primary) 30%, var(--kt-bg)); stroke: var(--kt-c-primary); }
.kt-cnote__gemmaglow { fill: var(--kt-c-primary); opacity: 0; transition: opacity 0.4s; }
.kt-cnote__gemma.is-busy .kt-cnote__gemmaglow { animation: kt-cnote-glow 1.2s ease-in-out infinite; }
@keyframes kt-cnote-glow { 0%, 100% { opacity: 0.08; } 50% { opacity: 0.32; } }
.kt-cnote__logo { filter: brightness(1.35) saturate(1.1); }
.kt-scheme-light .kt-cnote__logo { filter: brightness(0.72) saturate(1.4); }
.kt-cnote__src.is-cool { fill: var(--kt-cool); }
.kt-cnote__chip { fill: var(--kt-tint-neutral); stroke: var(--kt-bad); stroke-width: 1.5; stroke-opacity: 0.6; }

/* the feeding arrows draw themselves */
.kt-cnote__feed {
  fill: none;
  stroke: var(--kt-line-strong);
  stroke-width: 2;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  opacity: 0;
  transition: stroke-dashoffset 0.6s ease-out, opacity 0.2s;
}

.kt-cnote__feed.is-on { stroke-dashoffset: 0; opacity: 1; }
.kt-cnote__feed.is-hot { stroke: var(--kt-hot); }
.kt-cnote__feed.is-thick { stroke-width: 3.5; }

.kt-cnote__head { fill: var(--kt-line-strong); }
.kt-cnote__head.is-hot { fill: var(--kt-hot); }

@media (prefers-reduced-motion: reduce) {
  .kt-cnote__gemma.is-busy .kt-cnote__gemmaglow { animation: none; opacity: 0.2; }
}
.kt-cnote__term { fill: var(--kt-code-bg); stroke: var(--kt-line-strong); stroke-width: 1.5; }
.kt-cnote__cmd { font: 600 18px var(--font-family-mono); fill: var(--kt-fg); }
.kt-cnote__cmd .is-dollar { fill: var(--kt-muted); }
.kt-cnote__cmd .is-prog { fill: var(--kt-hot); font-weight: 800; }
</style>
