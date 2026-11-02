<script setup lang="ts">
import { computed } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * kb-template's graph view (`coach view` at 127.0.0.1:4747, ADR-KI-0060 and ADR-KI-0061) as it
 * looks on the speaker's test vault, small, in a dark app window for the distill demo marker.
 * Left, the graph: the book as the app draws it (a green round node with a book icon and a
 * progress ring, "Building a Second Brain · 0/27"), its chapters as small squares on dashed
 * spokes, and the open chapter, "6. Distill (1/3)", with its eight pages (94–101) on a ring.
 * The pages turn blue when bolded, yellow when highlighted; the chapter turns green with a halo
 * once its summary is written, and the book reads 1/27. Then the concept note appears as the
 * app's diamond (blue, yellow outline), linked to the chapter. Right, the side panel: the
 * chapter, its page chips taking the same colours, the real chapter summary, "quoted by
 * 1 concept note". Colours follow the app: bold blue (--kt-info), highlight yellow, complete green.
 */
const { at } = useTimeline(5.2)

const book = { x: 160, y: 176 }
const r = 104
const n = 14
const openAt = 1 // index of the open chapter, just right of straight down
const chapters = Array.from({ length: n }, (_, i) => {
  const a = Math.PI / 2 - 0.42 - (i * 2 * Math.PI) / n
  // the open chapter is pulled out to the right, to make room for its pages
  if (i === openAt) return { i, x: 312, y: 226 }
  return { i, x: book.x + r * Math.cos(a), y: book.y + r * Math.sin(a) }
})
const ch = chapters[openAt]
const pageNums = [94, 95, 96, 97, 98, 99, 100, 101]
const pages = pageNums.map((num, i) => {
  const a = (i * 2 * Math.PI) / pageNums.length - Math.PI / 2
  return { num, x: ch.x + 30 * Math.cos(a), y: ch.y + 30 * Math.sin(a) }
})

const T = { open: 1.1, bold: 1.9, hl: 2.7, done: 3.5, concept: 4.3 }
const stage = computed(() => (at(T.done) ? 'done' : at(T.hl) ? 'hl' : at(T.bold) ? 'bold' : 'raw'))
const pageTone = computed(() => (stage.value === 'done' ? 'hl' : stage.value))
const concept = computed(() => at(T.concept))
const diamond = { x: 436, y: 104 }
</script>

<template>
  <svg class="kt-gdist" viewBox="0 0 780 320" role="img"
    aria-label="kb-template's graph view of the test vault: the book Building a Second Brain with its chapters on a ring. Chapter 6, Distill, opens with its eight pages; they turn blue as they are bolded and yellow as they are highlighted; the chapter turns green once its summary is written, and the book reads 1 of 27. Then the concept note appears as a diamond linked to the chapter, and the side panel says quoted by 1 concept note.">
    <!-- the app window -->
    <rect x="1" y="1" width="778" height="318" rx="14" class="kt-gdist__win" />
    <path d="M1 46 H 779" class="kt-gdist__rule" />
    <g class="kt-gdist__logo">
      <circle cx="26" cy="19" r="3.5" class="is-good" />
      <circle cx="20" cy="28" r="3.5" class="is-hot" />
      <rect x="27.5" y="24.5" width="7" height="7" rx="1" transform="rotate(45 31 28)" class="is-warn" />
    </g>
    <text x="46" y="21" class="kt-gdist__title">life-vault-test</text>
    <text x="46" y="36" class="kt-gdist__sub">graph view · 127.0.0.1:4747</text>
    <g class="kt-gdist__pill">
      <rect x="586" y="12" width="76" height="22" rx="7" />
      <text x="624" y="27" text-anchor="middle"><tspan class="is-num">1</tspan> book</text>
    </g>
    <g class="kt-gdist__pill">
      <rect x="670" y="12" width="96" height="22" rx="7" />
      <text x="718" y="27" text-anchor="middle"><tspan class="is-num">{{ concept ? 1 : 0 }}</tspan> concepts</text>
    </g>

    <!-- spokes from the book to its chapters -->
    <g class="kt-gdist__part" :class="{ 'is-on': at(0.5) }">
      <path v-for="c in chapters" :key="c.i" :d="`M${book.x} ${book.y} L${c.x} ${c.y}`" class="kt-gdist__spoke" />
    </g>

    <!-- the open chapter's pages on a dashed ring -->
    <g class="kt-gdist__part" :class="{ 'is-on': at(T.open) }">
      <circle :cx="ch.x" :cy="ch.y" r="30" class="kt-gdist__pagering" />
      <circle v-for="(p, i) in pages" :key="p.num" :cx="p.x" :cy="p.y" r="5.5" class="kt-gdist__page"
        :class="`is-${pageTone}`" :style="{ transitionDelay: `${i * 60}ms` }" />
    </g>

    <!-- chapters: small squares; the open one carries the stage -->
    <g v-for="c in chapters" :key="c.i" class="kt-gdist__part" :class="{ 'is-on': at(0.5 + c.i * 0.04) }">
      <circle v-if="c.i === openAt" :cx="c.x" :cy="c.y" r="15" class="kt-gdist__halo" :class="{ 'is-on': stage === 'done' }" />
      <rect :x="c.x - 7" :y="c.y - 7" width="14" height="14" rx="3" class="kt-gdist__ch"
        :class="c.i === openAt ? [`is-${stage}`, 'is-open'] : ''" />
    </g>
    <text :x="ch.x + 38" :y="ch.y + 22" class="kt-gdist__label kt-gdist__part" :class="{ 'is-on': at(T.open) }">6. Distill (1/3)</text>

    <!-- the book, as the app draws it -->
    <g class="kt-gdist__part" :class="{ 'is-on': at(0.2) }">
      <circle :cx="book.x" :cy="book.y" r="36" class="kt-gdist__glow" />
      <circle :cx="book.x" :cy="book.y" r="29" class="kt-gdist__track" />
      <path :d="`M${book.x} ${book.y - 29} A 29 29 0 0 1 ${book.x + 29 * Math.sin(0.5)} ${book.y - 29 * Math.cos(0.5)}`"
        class="kt-gdist__progress" :class="{ 'is-on': stage === 'done' }" />
      <rect :x="book.x - 15" :y="book.y - 15" width="30" height="30" rx="8" class="kt-gdist__booktile" />
      <path :d="`M${book.x} ${book.y - 7} v15 M${book.x - 9} ${book.y - 7} h7 a2 2 0 0 1 2 2 M${book.x + 9} ${book.y - 7} h-7 a2 2 0 0 0 -2 2 M${book.x - 9} ${book.y - 7} v14 h9 M${book.x + 9} ${book.y - 7} v14 h-9`"
        class="kt-gdist__bookicon" />
    </g>
    <text :x="book.x" y="302" text-anchor="middle" class="kt-gdist__booklabel kt-gdist__part" :class="{ 'is-on': at(0.2) }">
      Building a Second Brain · {{ stage === 'done' ? '1' : '0' }}/27
    </text>

    <!-- the concept note: the app's diamond, linked to the chapter -->
    <path :d="`M${ch.x + 6} ${ch.y - 8} C ${ch.x + 30} ${ch.y - 80}, ${diamond.x - 40} ${diamond.y + 30}, ${diamond.x - 12} ${diamond.y + 6}`"
      class="kt-gdist__link" :class="{ 'is-on': concept }" />
    <g class="kt-gdist__part" :class="{ 'is-on': concept }">
      <g class="kt-gdist__pop" :class="{ 'is-on': concept }">
        <rect :x="diamond.x - 11" :y="diamond.y - 11" width="22" height="22" rx="2"
          :transform="`rotate(45 ${diamond.x} ${diamond.y})`" class="kt-gdist__dframe" />
        <rect :x="diamond.x - 6" :y="diamond.y - 6" width="12" height="12" rx="1"
          :transform="`rotate(45 ${diamond.x} ${diamond.y})`" class="kt-gdist__dcore" />
      </g>
      <text :x="diamond.x - 22" :y="diamond.y + 5" text-anchor="end" class="kt-gdist__label is-strong">Distillation</text>
    </g>

    <!-- the side panel -->
    <rect x="474" y="58" width="292" height="250" rx="12" class="kt-gdist__panel" />
    <rect x="490" y="72" width="78" height="20" rx="10" class="kt-gdist__tagpill" />
    <circle cx="502" cy="82" r="3" class="kt-gdist__tagdot" />
    <text x="511" y="86" class="kt-gdist__tag">CHAPTER</text>
    <text x="490" y="116" class="kt-gdist__ptitle">Chapter 6: Distill—Find</text>
    <text x="490" y="135" class="kt-gdist__ptitle">the Essence (1 of 3)</text>

    <text x="490" y="162" class="kt-gdist__head">PAGES</text>
    <g v-for="(p, i) in pages" :key="`chip${p.num}`" class="kt-gdist__part" :class="{ 'is-on': at(T.open) }">
      <rect :x="490 + i * 33.5" y="170" width="30" height="22" rx="4" class="kt-gdist__chip"
        :class="`is-${pageTone}`" :style="{ transitionDelay: `${i * 60}ms` }" />
      <text :x="505 + i * 33.5" y="185" text-anchor="middle" class="kt-gdist__chipnum" :class="`is-${pageTone}`">{{ p.num }}</text>
    </g>

    <g class="kt-gdist__part" :class="{ 'is-on': stage === 'done' }">
      <rect x="490" y="206" width="260" height="58" rx="9" class="kt-gdist__summary" />
      <text x="502" y="224" class="kt-gdist__sumhead">CHAPTER SUMMARY</text>
      <text x="502" y="244" class="kt-gdist__sumtext">It's important to add notes every day.</text>
      <text x="502" y="259" class="kt-gdist__sumtext">Notes are like essence of the stories…</text>
    </g>

    <g class="kt-gdist__part" :class="{ 'is-on': concept }">
      <text x="490" y="290" class="kt-gdist__rowkey">Quoted by</text>
      <text x="750" y="290" text-anchor="end" class="kt-gdist__rowval">1 concept note</text>
    </g>
  </svg>
</template>

<style>
.kt-gdist {
  width: 760px;
  height: auto;
  overflow: visible;
  font-family: var(--font-family-sans);
}

.kt-gdist__part {
  opacity: 0;
  transition: opacity 0.4s;
}

.kt-gdist__part.is-on { opacity: 1; }

/* the app window: dark, whatever the slide's surface */
.kt-gdist__win { fill: var(--kt-code-bg); stroke: color-mix(in srgb, var(--kt-code-fg) 14%, transparent); stroke-width: 1.5; }
.kt-gdist__rule { stroke: color-mix(in srgb, var(--kt-code-fg) 12%, transparent); stroke-width: 1; }
.kt-gdist__logo .is-good { fill: var(--kt-good); }
.kt-gdist__logo .is-hot { fill: var(--kt-hot); }
.kt-gdist__logo .is-warn { fill: var(--kt-warn); }
.kt-gdist__title { font-size: 14px; font-weight: 700; fill: var(--kt-code-fg); }
.kt-gdist__sub { font: 11px var(--font-family-mono); fill: var(--kt-code-label); }
.kt-gdist__pill rect { fill: color-mix(in srgb, var(--kt-code-fg) 5%, transparent); stroke: color-mix(in srgb, var(--kt-code-fg) 16%, transparent); }
.kt-gdist__pill text { font-size: 12px; fill: var(--kt-code-label); }
.kt-gdist__pill .is-num { font-weight: 700; fill: var(--kt-code-fg); }

.kt-gdist__label { font-size: 13px; font-weight: 600; fill: var(--kt-code-fg); }
.kt-gdist__label.is-strong { font-weight: 700; }
.kt-gdist__booklabel { font-size: 14px; font-weight: 700; fill: var(--kt-code-fg); }

.kt-gdist__spoke { stroke: color-mix(in srgb, var(--kt-code-fg) 14%, transparent); stroke-width: 1.2; stroke-dasharray: 2 4; }
.kt-gdist__pagering { fill: none; stroke: color-mix(in srgb, var(--kt-code-fg) 22%, transparent); stroke-width: 1.2; stroke-dasharray: 2 4; }

/* the book node */
.kt-gdist__glow { fill: color-mix(in srgb, var(--kt-good) 10%, transparent); }
.kt-gdist__track { fill: color-mix(in srgb, var(--kt-good) 8%, var(--kt-code-bg)); stroke: color-mix(in srgb, var(--kt-good) 25%, transparent); stroke-width: 4; }
.kt-gdist__progress { fill: none; stroke: var(--kt-good); stroke-width: 4; stroke-linecap: round; opacity: 0; transition: opacity 0.5s; }
.kt-gdist__progress.is-on { opacity: 1; }
.kt-gdist__booktile { fill: var(--kt-good); }
.kt-gdist__bookicon { fill: none; stroke: var(--kt-code-bg); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

/* chapters and pages: untouched → bold (blue) → highlight (yellow) → complete (green), as the app colours them */
.kt-gdist__ch { fill: var(--kt-c-neutral); transition: fill 0.4s; }
.kt-gdist__ch.is-bold { fill: var(--kt-info); }
.kt-gdist__ch.is-hl { fill: var(--kt-warn); }
.kt-gdist__ch.is-done { fill: var(--kt-good); }

.kt-gdist__halo {
  fill: none;
  stroke: var(--kt-cool);
  stroke-width: 3;
  opacity: 0;
  transition: opacity 0.4s;
}

.kt-gdist__halo.is-on { opacity: 0.8; }

.kt-gdist__page { fill: var(--kt-c-neutral); transition: fill 0.4s; }
.kt-gdist__page.is-bold { fill: var(--kt-info); }
.kt-gdist__page.is-hl { fill: var(--kt-warn); }

/* the concept note: blue core, yellow frame */
.kt-gdist__dframe { fill: var(--kt-code-bg); stroke: var(--kt-warn); stroke-width: 2.5; }
.kt-gdist__dcore { fill: var(--kt-info); }

.kt-gdist__pop {
  transform-box: fill-box;
  transform-origin: center;
}

.kt-gdist__pop.is-on { animation: kt-gdist-pop 0.6s ease-out 1; }

@keyframes kt-gdist-pop {
  0% { transform: scale(0.2); }
  70% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

.kt-gdist__link {
  fill: none;
  stroke: color-mix(in srgb, var(--kt-code-fg) 40%, transparent);
  stroke-width: 1.5;
  opacity: 0;
  transition: opacity 0.45s;
}

.kt-gdist__link.is-on { opacity: 1; }

/* the side panel */
.kt-gdist__panel { fill: color-mix(in srgb, var(--kt-code-fg) 4%, transparent); stroke: color-mix(in srgb, var(--kt-code-fg) 14%, transparent); }
.kt-gdist__tagpill { fill: none; stroke: color-mix(in srgb, var(--kt-code-fg) 22%, transparent); }
.kt-gdist__tagdot { fill: var(--kt-good); }
.kt-gdist__tag { font: 700 11px var(--font-family-mono); letter-spacing: 0.08em; fill: var(--kt-code-label); }
.kt-gdist__ptitle { font-size: 16px; font-weight: 700; fill: var(--kt-code-fg); }
.kt-gdist__head { font: 700 11px var(--font-family-mono); letter-spacing: 0.1em; fill: var(--kt-code-label); }

.kt-gdist__chip { fill: var(--kt-c-neutral); transition: fill 0.4s; }
.kt-gdist__chip.is-bold { fill: var(--kt-info); }
.kt-gdist__chip.is-hl { fill: var(--kt-warn); }
.kt-gdist__chipnum { font: 700 11px var(--font-family-mono); fill: var(--kt-code-fg); }
.kt-gdist__chipnum.is-bold, .kt-gdist__chipnum.is-hl { fill: var(--kt-code-bg); }

.kt-gdist__summary { fill: color-mix(in srgb, var(--kt-good) 12%, transparent); stroke: color-mix(in srgb, var(--kt-good) 40%, transparent); }
.kt-gdist__sumhead { font: 700 11px var(--font-family-mono); letter-spacing: 0.08em; fill: var(--kt-good); }
.kt-gdist__sumtext { font-size: 12.5px; fill: var(--kt-code-fg); }
.kt-gdist__rowkey { font-size: 13px; fill: var(--kt-code-label); }
.kt-gdist__rowval { font-size: 13px; font-weight: 700; fill: var(--kt-code-fg); }

@media (prefers-reduced-motion: reduce) {
  .kt-gdist__pop.is-on { animation: none; }
}
</style>
