<script setup lang="ts">
import { useId } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * One real book, from the first page to a concept the coach can spar (kb-template ADR-KI-0058,
 * ADR-KI-0060, ADR-KI-0061). Top row, while reading: what resonates (CaptureResonates' heart)
 * goes on paper (my pick) or into 0.Inbox (SecondBrain's tray), before PARA. After the last page:
 * the book's text lands in 3.Resources/0.Raw, reference only and never sparred, and my notes link
 * to it. Bottom row, the book's steps in kb-template, coloured as the graph view colours them
 * (GraphDistill): read · notes · bold · highlight · summary, then synthesize into a concept note,
 * the diamond, the only thing that is sparred. Over the five steps, a blue bracket: climb step 1, Read (blue,
 * Building a Second Brain, as on ClimbCheckpoint); under synthesize, "bridge" (hot, as there).
 */
const { at } = useTimeline(7.6)
const uid = useId()
const arrow = `kt-rflow-arrow-${uid}`
const arrowHot = `kt-rflow-arrow-hot-${uid}`

const steps = [
  { n: 1, name: 'read', tone: 'read' },
  { n: 2, name: 'notes', tone: 'notes' },
  { n: 3, name: 'bold', tone: 'bold' },
  { n: 4, name: 'highlight', tone: 'hl' },
  { n: 5, name: 'summary', tone: 'done' },
]
const stepX = (i: number) => 64 + i * 128
</script>

<template>
  <svg class="kt-rflow" viewBox="0 0 900 340" role="img"
    aria-label="Climb step 1, Read. While reading, what resonates goes on paper, my pick, or into the inbox, before PARA. After the last page, the book's text goes to 3.Resources/0.Raw, reference only and never sparred, and my notes link to it. In kb-template the book moves through read, notes, bold, highlight and summary, then I synthesize it into a concept note, the only thing the coach spars.">
    <defs>
      <marker :id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M0 0 L10 5 L0 10 z" class="kt-rflow__head" />
      </marker>
      <marker :id="arrowHot" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M0 0 L10 5 L0 10 z" class="kt-rflow__head is-hot" />
      </marker>
    </defs>

    <!-- while reading -->
    <text x="4" y="14" class="kt-rflow__phase kt-rflow__part is-on">while reading · every day</text>
    <g class="kt-rflow__part" :class="{ 'is-on': at(0.2) }">
      <rect x="8" y="34" width="76" height="96" rx="6" class="kt-rflow__book" />
      <path d="M20 34 V 130" class="kt-rflow__spine" />
      <path d="M32 58 h40 M32 72 h32 M32 86 h38" class="kt-rflow__bars" />
      <text x="46" y="152" text-anchor="middle" class="kt-rflow__tag">the book</text>
    </g>
    <g class="kt-rflow__heart" :class="{ 'is-on': at(0.6) }">
      <path d="M90 48 c-10 -7 -14 -12 -14 -17 a6 6 0 0 1 14 -2 a6 6 0 0 1 14 2 c0 5 -4 10 -14 17z" />
    </g>

    <!-- my pick: a page of paper, typed into the inbox the same day, crossed out, thrown away -->
    <path d="M110 52 C 124 50, 132 46, 142 46" pathLength="1" class="kt-rflow__feed is-hot"
      :class="{ 'is-on': at(0.9) }" :marker-end="`url(#${arrowHot})`" />
    <g class="kt-rflow__toss" :class="{ 'is-on': at(0.9), 'is-tossed': at(2.4) }">
      <rect x="148" y="24" width="52" height="44" rx="4" class="kt-rflow__paper" />
      <path d="M156 36 h36 M156 46 h28 M156 56 h32" class="kt-rflow__ink" />
      <path v-for="(d, i) in ['M153 36 h42', 'M153 46 h34', 'M153 56 h38']" :key="d" :d="d" pathLength="1"
        class="kt-rflow__strike" :class="{ 'is-on': at(1.3 + i * 0.2) }" />
    </g>
    <g class="kt-rflow__part" :class="{ 'is-on': at(0.9) }">
      <text x="212" y="38" class="kt-rflow__name">on paper</text>
      <rect x="212" y="46" width="62" height="18" rx="9" class="kt-rflow__pill is-hot" />
      <text x="243" y="59" text-anchor="middle" class="kt-rflow__pilltext is-hot">my pick</text>
    </g>
    <g class="kt-rflow__part" :class="{ 'is-on': at(1.3) }">
      <text x="212" y="82" class="kt-rflow__tag">type it in, cross it out,</text>
      <text x="212" y="96" class="kt-rflow__tag">throw the page away</text>
    </g>

    <!-- the inbox, where the notes wait -->
    <path d="M174 72 C 174 108, 180 124, 202 124" pathLength="1" class="kt-rflow__feed is-hot"
      :class="{ 'is-on': at(1.9) }" :marker-end="`url(#${arrowHot})`" />
    <g class="kt-rflow__part" :class="{ 'is-on': at(1.9) }">
      <path d="M208 112 h52 v22 a6 6 0 0 1 -6 6 h-40 a6 6 0 0 1 -6 -6z M208 124 h14 l5 7 h14 l5 -7 h14" class="kt-rflow__tray" />
      <text x="272" y="124" class="kt-rflow__name">0.Inbox</text>
      <text x="272" y="140" class="kt-rflow__tag">waiting, before PARA</text>
    </g>

    <!-- the alternative: straight into the inbox -->
    <path d="M88 118 C 120 150, 170 146, 202 134" pathLength="1" class="kt-rflow__feed is-alt"
      :class="{ 'is-on': at(2.7) }" :marker-end="`url(#${arrow})`" />
    <text x="118" y="168" class="kt-rflow__tag kt-rflow__part" :class="{ 'is-on': at(2.7) }">or straight in</text>

    <!-- after the last page -->
    <path d="M420 4 V 170" class="kt-rflow__divider kt-rflow__part" :class="{ 'is-on': at(3.1) }" />
    <text x="440" y="14" class="kt-rflow__phase kt-rflow__part" :class="{ 'is-on': at(3.1) }">after the last page</text>

    <!-- the book's text: reference only -->
    <g class="kt-rflow__part" :class="{ 'is-on': at(3.3) }">
      <rect x="440" y="26" width="250" height="42" rx="8" class="kt-rflow__file is-raw" />
      <rect x="452" y="34" width="20" height="26" rx="3" class="kt-rflow__book" />
      <path d="M457 34 V 60" class="kt-rflow__spine" />
      <text x="482" y="45" class="kt-rflow__path">3.Resources/0.Raw</text>
      <text x="482" y="60" class="kt-rflow__tag">the book's text · reference</text>
    </g>
    <g class="kt-rflow__part" :class="{ 'is-on': at(3.6) }">
      <path d="M706 40 l12 12 M718 40 l-12 12" class="kt-rflow__cross" />
      <text x="728" y="51" class="kt-rflow__never">never sparred</text>
    </g>

    <!-- the inbox notes, linked to the book: the first ideas that resonated -->
    <path d="M640 70 V 94" class="kt-rflow__link kt-rflow__part"
      :class="{ 'is-on': at(4.2) }" />
    <path d="M370 124 H 434" pathLength="1" class="kt-rflow__feed is-hot"
      :class="{ 'is-on': at(3.9) }" :marker-end="`url(#${arrowHot})`" />
    <g class="kt-rflow__part" :class="{ 'is-on': at(3.9) }">
      <rect x="440" y="96" width="250" height="56" rx="8" class="kt-rflow__file is-mine" />
      <text x="456" y="116" class="kt-rflow__path is-hot">my notes</text>
      <text x="456" y="132" class="kt-rflow__tag">the first ideas that resonated</text>
      <text x="456" y="146" class="kt-rflow__tag">linked to the book</text>
    </g>

    <!-- in kb-template: the book's steps, coloured as in the graph view -->
    <text x="4" y="196" class="kt-rflow__phase kt-rflow__part" :class="{ 'is-on': at(4.5) }">in kb-template</text>
    <path :d="`M${stepX(0)} 246 H ${stepX(4)}`" class="kt-rflow__track kt-rflow__part" :class="{ 'is-on': at(4.5) }" />
    <g v-for="(s, i) in steps" :key="s.name" class="kt-rflow__part" :class="{ 'is-on': at(4.7 + i * 0.3) }">
      <circle :cx="stepX(i)" cy="246" r="22" class="kt-rflow__step" :class="`is-${s.tone}`" />
      <text :x="stepX(i)" y="252" text-anchor="middle" class="kt-rflow__num">{{ s.n }}</text>
      <text :x="stepX(i)" y="292" text-anchor="middle" class="kt-rflow__name">{{ s.name }}</text>
    </g>
    <!-- the climb: all of this is step 1, Read; synthesize is the bridge out of it -->
    <g class="kt-rflow__part" :class="{ 'is-on': at(6.2) }">
      <path :d="`M${stepX(0) - 22} 216 V 210 H ${stepX(4) + 22} V 216`" class="kt-rflow__climb" />
      <text :x="(stepX(0) + stepX(4)) / 2" y="202" text-anchor="middle" class="kt-rflow__climbtext">climb step 1 · Read</text>
    </g>
    <text :x="(stepX(4) + 772) / 2" y="266" text-anchor="middle" class="kt-rflow__bridge kt-rflow__part" :class="{ 'is-on': at(6.6) }">bridge</text>
    <text :x="(stepX(2) + stepX(4)) / 2" y="316" text-anchor="middle" class="kt-rflow__tag kt-rflow__part"
      :class="{ 'is-on': at(6.1) }">progressive summarization</text>

    <!-- synthesize: one idea becomes the concept note -->
    <path :d="`M${stepX(4) + 28} 246 H 744`" pathLength="1" class="kt-rflow__feed is-hot is-thick"
      :class="{ 'is-on': at(6.4) }" :marker-end="`url(#${arrowHot})`" />
    <text :x="(stepX(4) + 772) / 2" y="234" text-anchor="middle" class="kt-rflow__distil kt-rflow__part"
      :class="{ 'is-on': at(6.4) }">synthesize</text>
    <g class="kt-rflow__pulse" :class="{ 'is-on': at(6.8) }">
      <rect x="760" y="228" width="36" height="36" rx="4" transform="rotate(45 778 246)" class="kt-rflow__diamond" />
    </g>
    <g class="kt-rflow__part" :class="{ 'is-on': at(6.8) }">
      <text x="778" y="300" text-anchor="middle" class="kt-rflow__name is-strong">concept</text>
    </g>
    <g class="kt-rflow__part" :class="{ 'is-on': at(7.2) }">
      <text x="778" y="320" text-anchor="middle" class="kt-rflow__sparred">✓ sparred</text>
    </g>
  </svg>
</template>

<style>
.kt-rflow {
  width: 880px;
  height: auto;
  overflow: visible;
  font-family: var(--font-family-sans);
}

.kt-rflow__part {
  opacity: 0;
  transition: opacity 0.45s;
}

.kt-rflow__part.is-on { opacity: 1; }

.kt-rflow__phase { font: 700 12px var(--font-family-mono); letter-spacing: 0.12em; text-transform: uppercase; fill: var(--kt-subtle); }
.kt-rflow__name { font: 15px var(--font-family-mono); fill: var(--kt-fg); }
.kt-rflow__name.is-strong { font-weight: 700; fill: var(--kt-heading); }
.kt-rflow__tag { font: 12px var(--font-family-mono); fill: var(--kt-subtle); }
.kt-rflow__path { font: 700 14px var(--font-family-mono); fill: var(--kt-fg); }
.kt-rflow__path.is-hot { fill: var(--kt-hot); }

/* the book, as on CaptureResonates: a page of grey bars */
.kt-rflow__book { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 2; }
.kt-rflow__spine { stroke: var(--kt-line-strong); stroke-width: 2; }

.kt-rflow__bars {
  fill: none;
  stroke: var(--kt-line-strong);
  stroke-width: 5;
  stroke-linecap: round;
  opacity: 0.7;
}

/* it resonates: CaptureResonates' heartbeat */
.kt-rflow__heart {
  opacity: 0;
  transition: opacity 0.35s;
  transform-box: fill-box;
  transform-origin: center;
  fill: var(--kt-hot);
}

.kt-rflow__heart.is-on { opacity: 1; animation: kt-rflow-beat 1.2s ease-in-out infinite; }

@keyframes kt-rflow-beat {
  0%, 40%, 100% { transform: scale(1); }
  15% { transform: scale(1.25); }
  28% { transform: scale(1.1); }
}

/* capture targets */
.kt-rflow__paper { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); stroke-width: 2; }
.kt-rflow__ink { stroke: var(--kt-hot); stroke-width: 2; stroke-linecap: round; opacity: 0.8; }
.kt-rflow__tray { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 2; stroke-linejoin: round; }
.kt-rflow__pill { fill: none; stroke-width: 1.5; }
.kt-rflow__pill.is-hot { stroke: var(--kt-hot); }
.kt-rflow__pilltext { font: 11px var(--font-family-mono); }
.kt-rflow__pilltext.is-hot { fill: var(--kt-hot); }

/* the paper: each line crossed out once it is typed in, then the page goes */
.kt-rflow__toss { opacity: 0; transform-box: fill-box; transform-origin: center; transition: opacity 0.45s, transform 0.6s ease-in; }
.kt-rflow__toss.is-on { opacity: 1; }
.kt-rflow__toss.is-tossed { opacity: 0.35; transform: translate(0, 6px) rotate(-6deg); }

.kt-rflow__strike {
  fill: none;
  stroke: var(--kt-heading);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  transition: stroke-dashoffset 0.35s ease-out;
}

.kt-rflow__strike.is-on { stroke-dashoffset: 0; }

.kt-rflow__link { fill: none; stroke: var(--kt-line-strong); stroke-width: 2; stroke-dasharray: 3 5; }

.kt-rflow__divider { stroke: var(--kt-line); stroke-width: 2; stroke-dasharray: 4 6; }

/* the two files after the last page */
.kt-rflow__file { stroke-width: 2; }
.kt-rflow__file.is-raw { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-dasharray: 5 5; }
.kt-rflow__file.is-mine { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); }
.kt-rflow__cross { stroke: var(--kt-bad); stroke-width: 3; stroke-linecap: round; }
.kt-rflow__never { font: 700 13px var(--font-family-mono); fill: var(--kt-bad); }

/* the steps, in the graph view's colours (GraphDistill) */
.kt-rflow__track { stroke: var(--kt-line); stroke-width: 3; }
.kt-rflow__step { stroke: var(--kt-card); stroke-width: 3; }
.kt-rflow__step.is-read { fill: var(--kt-c-neutral); }
.kt-rflow__step.is-notes { fill: var(--kt-hot); }
.kt-rflow__step.is-bold { fill: var(--kt-cool); }
.kt-rflow__step.is-hl { fill: var(--kt-warn); }
.kt-rflow__step.is-done { fill: var(--kt-good); }
.kt-rflow__num { font: 800 17px var(--font-family-mono); fill: var(--kt-bg); }

.kt-rflow__distil { font: 700 15px var(--font-family-mono); fill: var(--kt-hot); }
.kt-rflow__diamond { fill: var(--kt-hot); }
.kt-rflow__sparred { font: 700 13px var(--font-family-mono); fill: var(--kt-good); }

.kt-rflow__pulse {
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
  transition: opacity 0.3s;
}

.kt-rflow__pulse.is-on { opacity: 1; animation: kt-rflow-pulse 0.9s ease-in-out 1; }

@keyframes kt-rflow-pulse {
  50% { transform: scale(1.35); }
}

/* arrows draw themselves */
.kt-rflow__feed {
  fill: none;
  stroke: var(--kt-line-strong);
  stroke-width: 2;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  opacity: 0;
  transition: stroke-dashoffset 0.6s ease-out, opacity 0.2s;
}

.kt-rflow__feed.is-on { stroke-dashoffset: 0; opacity: 1; }
.kt-rflow__feed.is-hot { stroke: var(--kt-hot); }
.kt-rflow__feed.is-alt { stroke: var(--kt-line-strong); }
.kt-rflow__feed.is-thick { stroke-width: 3; }

.kt-rflow__head { fill: var(--kt-line-strong); }
.kt-rflow__head.is-hot { fill: var(--kt-hot); }

@media (prefers-reduced-motion: reduce) {
  .kt-rflow__heart.is-on, .kt-rflow__pulse.is-on { animation: none; }
}
.kt-rflow__climb { fill: none; stroke: var(--kt-info); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
.kt-rflow__climbtext { font: 800 13px var(--font-family-mono); fill: var(--kt-info); letter-spacing: 0.04em; }
.kt-rflow__bridge { font: 800 11px var(--font-family-mono); fill: var(--kt-hot); letter-spacing: 0.06em; }
</style>
