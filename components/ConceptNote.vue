<script setup lang="ts">
import { computed, useId } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * The anatomy of a concept note (kb-template ADR-KI-0060, ai-coach ADR-0018 and ADR-0023), built
 * from the speaker's real marks on Building a Second Brain, p. 100, and their real concept note
 * "Distillation" (test vault, 25 Oct 2026). Left, slowly, the four layers as on DistillLayers:
 * 1 raw (the page as printed), 2 bold (the technique, four lines), 3 highlight (three phrases
 * inside the bold, one by one), 4 my summary on top, in my words. Right, the concept note fills
 * field by field, each fed from its source: core_assertions from my words, never from the book
 * (one of the six shown); forbidden_buzzwords suggested by Gemma, kept by me; source_passages
 * from the bolded passage, checked verbatim on every read. The judge grades the assertions.
 *
 * - `compact`: the recap after the distill demo. The author's quote (grey, p. 100) stays left;
 *   a copy crosses over and turns into one of my core assertions (hot); the diamond pulses once.
 */
const props = withDefaults(defineProps<{ compact?: boolean }>(), { compact: false })
const { at } = useTimeline(props.compact ? 3.4 : 16)
const uid = useId()
const arrow = `kt-cnote-arrow-${uid}`
const arrowGood = `kt-cnote-arrow-good-${uid}`
const quote = [
  '“you highlight the main points of a note,',
  'and then highlight the main points',
  'of those highlights”',
]
const assertion = ['Highlighting occurs within', 'the layer of bolded text.']
// the first passage of the real note, as quoted
const quoteFull = '“The technique is simple: you highlight the main points …”'
// three of the six real core assertions, one per layer on the left (bold, highlight, summary)
const assertions = [
  ['The learner identifies interesting', 'text by bolding it.'],
  ['The learner then highlights portions', 'of the bolded text.'],
  ['The learner creates a fourth layer', 'consisting of a summary.'],
]
// suggested by Gemma, kept by me: the words I'd hide behind instead of explaining the steps:
// the concept's own label, the author's phrase, and a vague stand-in
const buzzwords = ['distill', 'main points', 'important parts']
// the four layers, slowly: when each starts
const L = { raw: 0.4, bold: 2.6, hl: 4.8, sum: 7.4 }
const ladder = [
  { n: 1, label: 'raw', at: L.raw },
  { n: 2, label: 'bold', at: L.bold },
  { n: 3, label: 'highlight', at: L.hl },
  { n: 4, label: 'summary', at: L.sum },
]
const layer = computed(() => ladder.reduce((acc, l) => (at(l.at) ? l.n : acc), 0))
const C = 9.4 // the concept note starts filling
// the recap: the copy of the quote is crossing while 0.8 ≤ t < 2
const crossing = computed(() => at(0.8))
</script>

<template>
  <!-- the full anatomy -->
  <svg v-if="!compact" class="kt-cnote" viewBox="0 0 900 400" role="img"
    aria-label="Building a Second Brain, page 100, distilled in four layers: the raw page, then the technique in bold, then three phrases inside it highlighted: main points of a note, distilling the essence, layers. Then my summary on top: when I find something interesting I bold it, then I highlight parts of the bold, and at the end I add a summary. The concept note fills in: a core assertion from my words, never from the book: highlighting occurs within the layer of bolded text; forbidden buzzwords that Gemma suggests and I keep; the source passage, checked verbatim against page 100 on every read. The judge grades against the assertions.">
    <defs>
      <marker :id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M0 0 L10 5 L0 10 z" class="kt-cnote__head" />
      </marker>
      <marker :id="arrowGood" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M0 0 L10 5 L0 10 z" class="kt-cnote__head is-hot" />
      </marker>
    </defs>

    <!-- the ladder: one layer at a time, as on DistillLayers -->
    <g v-for="(l, i) in ladder" :key="l.n" class="kt-cnote__rung" :class="{ 'is-on': at(l.at), 'is-now': layer === l.n }">
      <rect :x="i * 101 + 1" y="1" width="94" height="28" rx="8" />
      <text :x="i * 101 + 11" y="20" class="kt-cnote__rung-n">{{ l.n }}</text>
      <text :x="i * 101 + 25" y="20" class="kt-cnote__rung-l">{{ l.label }}</text>
    </g>

    <!-- left · the author's page, the speaker's real marks -->
    <g class="kt-cnote__part is-on">
      <rect x="1" y="40" width="397" height="358" rx="12" class="kt-cnote__page" />
      <text x="22" y="64" class="kt-cnote__runhead">Distill—Find the Essence</text>
      <text x="377" y="64" text-anchor="end" class="kt-cnote__runhead">99–100</text>
      <path d="M22 74 H 377" class="kt-cnote__rule" />
    </g>
    <foreignObject x="12" y="80" width="374" height="314">
      <div xmlns="http://www.w3.org/1999/xhtml" class="kt-cnote__doc" :class="`is-l${layer}`">
        <div class="kt-cnote__sum">
          <span class="kt-cnote__sum-tag">&gt; [!summary]</span>
          When I find something interesting I bold it, then I highlight parts of the bold, and at the
          end I add a summary.
        </div>
        <p class="kt-cnote__head2">Highlighting 2.0: The Progressive Summarization Technique</p>
        <p class="kt-cnote__text is-unmarked">
          Progressive Summarization takes advantage of a tool and a habit that we are all intimately
          familiar with—highlighting—while leveraging the unique capabilities of technology to make
          those highlights far more useful than anything you did in school.
        </p>
        <p class="kt-cnote__text is-indent">
          <span class="kt-cnote__b">The technique is simple: you highlight the
          <span class="kt-cnote__h" :class="{ 'is-lit': at(L.hl) }">main points of a note</span>, and
          then highlight the main points of those highlights, and so on,
          <span class="kt-cnote__h" :class="{ 'is-lit': at(L.hl + 0.6) }">distilling the essence</span>
          of a note in several “<span class="kt-cnote__h" :class="{ 'is-lit': at(L.hl + 1.2) }">layers</span>.”
          Each of these layers uses a different kind of formatting so you can easily tell them
          apart.</span>
        </p>
      </div>
    </foreignObject>

    <!-- right · the concept note -->
    <g class="kt-cnote__part" :class="{ 'is-on': at(C) }">
      <rect x="500" y="40" width="398" height="358" rx="12" class="kt-cnote__card" />
      <rect x="516" y="56" width="16" height="16" rx="2" transform="rotate(45 524 64)" class="kt-cnote__diamond" />
      <text x="544" y="70" class="kt-cnote__title">concept · Distillation</text>
      <path d="M500 84 H 898" class="kt-cnote__rule" />
    </g>

    <!-- core_assertions ← my summary + my answers, one after another -->
    <path d="M398 104 C 440 104, 460 106, 498 106" pathLength="1" class="kt-cnote__feed is-hot"
      :class="{ 'is-on': at(C + 0.4) }" :marker-end="`url(#${arrowGood})`" />
    <g class="kt-cnote__part" :class="{ 'is-on': at(C + 0.4) }">
      <text x="449" y="134" text-anchor="middle" class="kt-cnote__src is-hot">my words</text>
      <text x="449" y="150" text-anchor="middle" class="kt-cnote__src is-hot">never from</text>
      <text x="449" y="165" text-anchor="middle" class="kt-cnote__src is-hot">the book</text>
      <text x="516" y="110" class="kt-cnote__key">core_assertions</text>
    </g>
    <g v-for="(lines, i) in assertions" :key="i" class="kt-cnote__item" :class="{ 'is-on': at(C + 0.8 + i * 0.7) }">
      <text x="516" :y="134 + i * 44" class="kt-cnote__bullet">{{ i + 1 }}</text>
      <text v-for="(line, j) in lines" :key="line" x="534" :y="134 + i * 44 + j * 19" class="kt-cnote__assert is-list">{{ line }}</text>
    </g>
    <g class="kt-cnote__part" :class="{ 'is-on': at(C + 3.0) }">
      <text x="534" y="262" class="kt-cnote__src">+ 3 more · 6 in all</text>
      <rect x="738" y="96" width="146" height="20" rx="10" class="kt-cnote__pill" />
      <text x="811" y="110" text-anchor="middle" class="kt-cnote__pill-text">the judge grades these</text>
    </g>

    <!-- forbidden_buzzwords ← Gemma suggests, I keep -->
    <g class="kt-cnote__part" :class="{ 'is-on': at(C + 3.5) }">
      <text x="449" y="254" text-anchor="middle" class="kt-cnote__src">Gemma suggests,</text>
      <text x="449" y="269" text-anchor="middle" class="kt-cnote__src">I keep</text>
      <path d="M449 280 l4 9 9 4 -9 4 -4 9 -4 -9 -9 -4 9 -4z" class="kt-cnote__spark" />
      <text x="516" y="290" class="kt-cnote__key">forbidden_buzzwords</text>
    </g>
    <path d="M466 293 H 498" pathLength="1" class="kt-cnote__feed" :class="{ 'is-on': at(C + 3.5) }" :marker-end="`url(#${arrow})`" />
    <g v-for="(w, c) in buzzwords" :key="w" class="kt-cnote__part" :class="{ 'is-on': at(C + 3.8 + c * 0.35) }">
      <rect :x="516 + [0, 94, 220][c]" y="300" :width="[86, 118, 150][c]" height="24" rx="12" class="kt-cnote__chip" />
      <text :x="516 + [0, 94, 220][c] + 24" y="317" class="kt-cnote__word">{{ w }}</text>
      <text :x="516 + [0, 94, 220][c] + 11" y="317" class="kt-cnote__no" :class="{ 'is-on': at(C + 4.1 + c * 0.35) }">✕</text>
    </g>

    <!-- source_passages ← the bolded passage, checked against the page -->
    <path d="M398 366 C 440 366, 460 344, 498 344" pathLength="1" class="kt-cnote__feed is-warn"
      :class="{ 'is-on': at(C + 5.0) }" :marker-end="`url(#${arrow})`" />
    <g class="kt-cnote__part" :class="{ 'is-on': at(C + 5.0) }">
      <text x="516" y="346" class="kt-cnote__key">source_passages</text>
    </g>
    <g class="kt-cnote__part" :class="{ 'is-on': at(C + 5.3) }">
      <text x="516" y="366" class="kt-cnote__quote">{{ quoteFull }}</text>
    </g>
    <g class="kt-cnote__part" :class="{ 'is-on': at(C + 5.7) }">
      <text x="516" y="388" class="kt-cnote__check">✓ p. 100 · verbatim, checked on every read</text>
    </g>
  </svg>

  <!-- compact · the recap: from the author's words to mine -->
  <svg v-else class="kt-cnote is-compact" viewBox="0 0 820 200" role="img"
    aria-label="The author's quote from page 100 stays on the left, checked against the page. A copy crosses into the concept note and becomes one of my core assertions: highlighting happens inside the bolded text.">
    <defs>
      <marker :id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M0 0 L10 5 L0 10 z" class="kt-cnote__head" />
      </marker>
    </defs>

    <!-- the author's words -->
    <g class="kt-cnote__part is-on">
      <text x="4" y="22" class="kt-cnote__file">the author · BASB p. 100</text>
      <rect x="2" y="34" width="346" height="112" rx="12" class="kt-cnote__page" />
      <text v-for="(line, i) in quote" :key="line" x="20" :y="72 + i * 24" class="kt-cnote__quote is-big">{{ line }}</text>
    </g>
    <g class="kt-cnote__part" :class="{ 'is-on': at(0.3) }">
      <text x="4" y="176" class="kt-cnote__check is-big">✓ checked against the page</text>
    </g>

    <!-- the copy that crosses over and turns into mine -->
    <g class="kt-cnote__ghost" :class="{ 'is-moving': crossing, 'is-gone': at(1.9) }">
      <text v-for="(line, i) in quote" :key="line" x="20" :y="72 + i * 24" class="kt-cnote__quote is-big">{{ line }}</text>
    </g>
    <path d="M356 90 H 456" class="kt-cnote__wire" :class="{ 'is-on': at(0.8) }" :marker-end="`url(#${arrow})`" />

    <!-- my concept note -->
    <g class="kt-cnote__part is-on">
      <text x="468" y="22" class="kt-cnote__file is-hot">mine</text>
      <rect x="466" y="34" width="350" height="146" rx="12" class="kt-cnote__card" />
      <g class="kt-cnote__pulse" :class="{ 'is-on': at(2.4) }">
        <rect x="484" y="50" width="16" height="16" rx="2" transform="rotate(45 492 58)" class="kt-cnote__diamond" />
      </g>
      <text x="512" y="64" class="kt-cnote__title">concept · Distillation</text>
      <path d="M466 78 H 816" class="kt-cnote__rule" />
      <text x="486" y="102" class="kt-cnote__key">core_assertions</text>
    </g>
    <g class="kt-cnote__part kt-cnote__mine" :class="{ 'is-on': at(1.6) }">
      <text v-for="(line, i) in assertion" :key="line" x="486" :y="134 + i * 26" class="kt-cnote__assert is-big">{{ line }}</text>
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

.kt-cnote.is-compact { width: 780px; }

.kt-cnote__part {
  opacity: 0;
  transition: opacity 0.45s;
}

.kt-cnote__part.is-on { opacity: 1; }

/* the document shapes: a page, a card */
.kt-cnote__page { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 2; }
.kt-cnote__card { fill: var(--kt-tint-primary); stroke: var(--kt-c-primary); stroke-width: 2.5; }
.kt-cnote__rule { stroke: var(--kt-line); stroke-width: 1.5; }
.kt-cnote__diamond { fill: var(--kt-hot); }

.kt-cnote__file { font: 12px var(--font-family-mono); fill: var(--kt-subtle); }
.kt-cnote__file.is-hot { fill: var(--kt-hot); font-weight: 700; }
.kt-cnote__title { font-size: 18px; font-weight: 800; fill: var(--kt-heading); }
.kt-cnote__key { font: 700 13px var(--font-family-mono); fill: var(--kt-cool); }
.kt-cnote__count { font-weight: 400; fill: var(--kt-subtle); }
.kt-cnote__src { font: 12px var(--font-family-mono); fill: var(--kt-subtle); }
.kt-cnote__src.is-hot { fill: var(--kt-hot); }

.kt-cnote__bars {
  fill: none;
  stroke: var(--kt-line-strong);
  stroke-width: 5;
  stroke-linecap: round;
  opacity: 0.7;
}

.kt-cnote__bars.is-hot { stroke: var(--kt-hot); opacity: 0.55; }

/* the author's sentence: raw → bold → highlight, as on DistillLayers */
.kt-cnote__text {
  margin: 0;
  font-size: 14px;
  line-height: 1.45;
  color: var(--kt-fg);
  transition: color 0.5s;
}

.kt-cnote__text span {
  border-radius: 3px;
  transition: color 0.5s, font-weight 0.3s, background-size 0.6s ease-out;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
}

.kt-cnote__h {
  background: linear-gradient(var(--kt-tint-warning), var(--kt-tint-warning)) no-repeat left / 0 100%;
}

.kt-cnote__text.is-b { color: var(--kt-subtle); }
.kt-cnote__text.is-b .kt-cnote__b { font-weight: 800; color: var(--kt-heading); }
.kt-cnote__text.is-h .kt-cnote__b { color: var(--kt-subtle); }
.kt-cnote__text.is-h .kt-cnote__h { background-size: 100% 100%; color: var(--kt-heading); }

/* the ladder, as on DistillLayers */
.kt-cnote__rung { opacity: 0; transition: opacity 0.4s; }
.kt-cnote__rung.is-on { opacity: 1; }
.kt-cnote__rung rect { fill: none; stroke: var(--kt-line); stroke-width: 2; transition: stroke 0.4s, fill 0.4s; }
.kt-cnote__rung.is-now rect { stroke: var(--kt-hot); fill: var(--kt-tint-secondary); }
.kt-cnote__rung-n { font: 700 13px var(--font-family-mono); fill: var(--kt-hot); }
.kt-cnote__rung-l { font: 12px var(--font-family-mono); fill: var(--kt-subtle); transition: fill 0.4s; }
.kt-cnote__rung.is-now .kt-cnote__rung-l { fill: var(--kt-heading); }

/* the page, layer by layer: 1 raw, 2 bold, 3 highlight inside the bold, 4 my summary on top */
.kt-cnote__doc { padding: 0 10px; font-family: Georgia, 'Times New Roman', serif; }
.kt-cnote__doc .kt-cnote__text { margin: 0; font-size: 14px; line-height: 1.45; text-align: justify; hyphens: manual; transition: color 0.6s, opacity 0.6s; }
.kt-cnote__doc .kt-cnote__text.is-indent { text-indent: 1.4em; }
/* layer 4: what was never marked folds away under the summary */
.kt-cnote__doc .kt-cnote__text.is-unmarked { max-height: 140px; overflow: hidden; transition: max-height 0.9s ease-in-out, opacity 0.6s, color 0.6s; }
.kt-cnote__doc.is-l4 .kt-cnote__text.is-unmarked { max-height: 0; opacity: 0; }
.kt-cnote__head2 { margin: 0 0 6px; font: 700 14.5px/1.3 Georgia, 'Times New Roman', serif; color: var(--kt-heading); transition: opacity 0.6s; }
.kt-cnote__doc.is-l2 .kt-cnote__head2, .kt-cnote__doc.is-l3 .kt-cnote__head2, .kt-cnote__doc.is-l4 .kt-cnote__head2 { opacity: 0.5; }
.kt-cnote__runhead { font: italic 12px Georgia, 'Times New Roman', serif; fill: var(--kt-subtle); }
.kt-cnote__doc .kt-cnote__b { transition: color 0.6s, font-weight 0.4s; }
.kt-cnote__doc .kt-cnote__h { transition: color 0.5s, background-size 0.7s ease-out; }
.kt-cnote__doc.is-l2 .kt-cnote__text,
.kt-cnote__doc.is-l3 .kt-cnote__text,
.kt-cnote__doc.is-l4 .kt-cnote__text { color: var(--kt-subtle); }
.kt-cnote__doc.is-l2 .kt-cnote__b { font-weight: 800; color: var(--kt-heading); }
.kt-cnote__doc.is-l3 .kt-cnote__b,
.kt-cnote__doc.is-l4 .kt-cnote__b { font-weight: 800; color: var(--kt-fg); }
.kt-cnote__doc .kt-cnote__h {
  background-image: linear-gradient(color-mix(in srgb, var(--kt-warn) 42%, transparent), color-mix(in srgb, var(--kt-warn) 42%, transparent));
}
.kt-cnote__doc .kt-cnote__h.is-lit { background-size: 100% 100%; color: var(--kt-heading); }
.kt-cnote__doc.is-l4 .kt-cnote__text { opacity: 0.6; }

.kt-cnote__sum {
  max-height: 0;
  overflow: hidden;
  margin: 0;
  padding: 0 12px;
  border-left: 4px solid var(--kt-hot);
  border-radius: 4px;
  background: var(--kt-tint-secondary);
  font: 700 14.5px/1.4 var(--font-family-sans);
  color: var(--kt-hot);
  opacity: 0;
  transition: max-height 0.9s ease-out, opacity 0.6s, padding 0.6s, margin 0.6s;
}

.kt-cnote__sum-tag { display: block; font: 400 11px var(--font-family-mono); }
.kt-cnote__doc.is-l4 .kt-cnote__sum { max-height: 120px; padding: 8px 12px; margin-bottom: 10px; opacity: 1; }

/* layer 4: the summary callout (compact) */
.kt-cnote__callout { fill: var(--kt-tint-secondary); }
.kt-cnote__callout-bar { stroke: var(--kt-hot); stroke-width: 4; }
.kt-cnote__callout-tag { font: 11px var(--font-family-mono); fill: var(--kt-hot); }
.kt-cnote__callout-text { font-size: 15px; font-weight: 800; fill: var(--kt-hot); }

/* the fields */
.kt-cnote__assert { font-size: 17px; font-weight: 800; fill: var(--kt-hot); }
.kt-cnote__assert.is-big { font-size: 21px; }
.kt-cnote__assert.is-list { font-size: 15.5px; }
.kt-cnote__bullet { font: 700 13px var(--font-family-mono); fill: var(--kt-hot); }
.kt-cnote__word { font: 12.5px var(--font-family-mono); fill: var(--kt-fg); }
.kt-cnote__no { font: 700 13px var(--font-family-mono); fill: var(--kt-bad); opacity: 0; transition: opacity 0.3s; }
.kt-cnote__no.is-on { opacity: 1; }

/* each assertion slides in from the feed */
.kt-cnote__item { opacity: 0; transform: translateX(-14px); transition: opacity 0.45s, transform 0.5s ease-out; }
.kt-cnote__item.is-on { opacity: 1; transform: none; }
.kt-cnote__pill { fill: none; stroke: var(--kt-hot); stroke-width: 1.5; }
.kt-cnote__pill-text { font: 10.5px var(--font-family-mono); fill: var(--kt-hot); }
.kt-cnote__spark { fill: var(--kt-cool); }
.kt-cnote__chip { fill: var(--kt-tint-neutral); stroke: var(--kt-bad); stroke-width: 1.5; stroke-opacity: 0.6; }
.kt-cnote__quote { font-size: 13px; font-style: italic; fill: var(--kt-subtle); }
.kt-cnote__quote.is-big { font-size: 17px; }
.kt-cnote__check { font: 600 12px var(--font-family-mono); fill: var(--kt-good); }
.kt-cnote__check.is-big { font-size: 14px; }

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
.kt-cnote__feed.is-warn { stroke: var(--kt-warn); }

.kt-cnote__head { fill: var(--kt-line-strong); }
.kt-cnote__head.is-hot { fill: var(--kt-hot); }

/* the dashed wire, as in ForgettingLoop */
.kt-cnote__wire {
  fill: none;
  stroke: var(--kt-line);
  stroke-width: 2.5;
  stroke-dasharray: 6 7;
  opacity: 0;
  transition: opacity 0.45s;
}

.kt-cnote__wire.is-on {
  opacity: 1;
  stroke: var(--kt-c-primary-soft);
  animation: kt-cnote-flow 1s linear infinite;
}

@keyframes kt-cnote-flow {
  to { stroke-dashoffset: -26; }
}

/* compact: the copy crosses over, greys into hot, and hands over to the assertion */
.kt-cnote__ghost {
  opacity: 0;
  visibility: hidden;
  transform: translate(0, 0);
}

.kt-cnote__ghost.is-moving {
  opacity: 0.9;
  visibility: visible;
  transform: translate(466px, 40px);
  transition: transform 1.1s ease-in-out, opacity 0.2s;
}

.kt-cnote__ghost .kt-cnote__quote { transition: fill 1s 0.1s; }
.kt-cnote__ghost.is-moving .kt-cnote__quote { fill: var(--kt-hot); }
.kt-cnote__ghost.is-gone {
  opacity: 0;
  visibility: hidden;
  transition: transform 1.1s ease-in-out, opacity 0.3s, visibility 0s 0.3s;
}

.kt-cnote__mine { transition: opacity 0.5s; }

.kt-cnote__pulse {
  transform-box: fill-box;
  transform-origin: center;
}

.kt-cnote__pulse.is-on { animation: kt-cnote-pulse 0.9s ease-in-out 1; }

@keyframes kt-cnote-pulse {
  50% { transform: scale(1.7); }
}

@media (prefers-reduced-motion: reduce) {
  .kt-cnote__wire.is-on, .kt-cnote__pulse.is-on { animation: none; }
}
</style>
