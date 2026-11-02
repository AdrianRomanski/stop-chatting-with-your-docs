<script setup lang="ts">
import { useId } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * Two architectures for your notes, and who does the synthesis; two comic panels, plays once:
 * 1. PULL BASED ARCHITECTURE: five notes drop into the AI one by one, you ask "summarize", gears
 *    turn (the AI does the synthesis), a summary comes out to you; you're grey: idle
 * 2. PUSH BASED ARCHITECTURE: you read the same five notes and distill them with Tiago Forte's
 *    Progressive Summarization (as on SecondBrain): layer 1, collect the notes (they fly in); layer 2, bold the key lines; layer 3, highlight
 *    the best of the bold; you send what you distilled to the mind coach; it pushes back, "Why is that the key idea?"; you answer: you're in color: under load
 * Sets up AccessRevoked (pull-based, at PushBased?) and #push (the shapes reused in #arch).
 * No props.
 */
const { at } = useTimeline(12)
const uid = useId()
const id = (name: string) => `kt-pp-${name}-${uid}`
const PUSH_X = 448
const PUSH_AT = 4.6

// five notes, the same in both panels: four lines of text each
const notes = [0, 1, 2, 3, 4].map(i => ({ x: 22 + i * 78, widths: [36, 28, 34, 24].map((w, j) => w + ((i + j) % 3) * 4) }))
const NOTE_Y = 64
const lineY = (j: number) => NOTE_Y + 18 + j * 11

// pull: each note drops into the AI box (centre 215, 196)
const drop = (i: number) => ({ '--dx': `${215 - (notes[i].x + 26)}px`, '--dy': `${196 - (NOTE_Y + 30)}px`, transitionDelay: `${i * 0.15}s` })

// push: Progressive Summarization, per note: layer 2 bolds two lines, layer 3 highlights the best of them
const marks = [
  { bold: [0, 2], hl: 2 },
  { bold: [1, 3], hl: 1 },
  { bold: [0, 1], hl: 0 },
  { bold: [2, 3], hl: 3 },
  { bold: [1, 2], hl: 1 },
]
const BOLD_AT = PUSH_AT + 0.9
const HL_AT = PUSH_AT + 2
const WRITE_AT = PUSH_AT + 3.4
const SEND_AT = PUSH_AT + 4.1
const ASK_AT = PUSH_AT + 4.8
const LOAD_AT = PUSH_AT + 5.6
</script>

<template>
  <svg class="kt-pp" viewBox="0 0 880 372" role="img"
    aria-label="Pull Based Architecture: you drop five notes into an AI and ask it to summarize; the AI does the synthesis and you read the result, idle. Push Based Architecture: you read the five notes yourself and distill them with Progressive Summarization: bold the key lines, highlight the best of the bold, and send it to a mind coach, which pushes back a question; you answer, under load.">
    <defs>
      <clipPath :id="id('face')" clipPathUnits="objectBoundingBox"><circle cx="0.5" cy="0.5" r="0.5" /></clipPath>
    </defs>

    <!-- ============ PULL ============ -->
    <g class="kt-pp__panel is-pull" :class="{ 'is-on': at(0.1) }">
      <rect x="2" y="2" width="428" height="368" rx="14" class="kt-pp__frame" />
      <g class="kt-pp__title">
        <rect x="14" y="14" width="236" height="28" rx="5" />
        <text x="26" y="33">PULL BASED ARCHITECTURE</text>
      </g>
      <text x="260" y="33" class="kt-pp__sub">you outsource synthesis</text>
    </g>

    <!-- the five notes drop into the AI -->
    <g v-for="(n, i) in notes" :key="`pn${i}`" class="kt-pp__in" :class="{ 'is-on': at(0.4 + i * 0.08) }">
      <g class="kt-pp__drop" :class="{ 'is-dropped': at(1.8) }" :style="drop(i)">
        <rect :x="n.x" :y="NOTE_Y" width="52" height="64" rx="5" class="kt-pp__note" />
        <path v-for="(w, j) in n.widths" :key="j" :d="`M${n.x + 8} ${lineY(j)} h${w}`" class="kt-pp__text" />
      </g>
    </g>
    <text x="215" y="152" text-anchor="middle" class="kt-pp__label kt-pp__in" :class="{ 'is-on': at(0.6), 'is-gone': at(2.4) }">5 notes</text>

    <g class="kt-pp__in" :class="{ 'is-on': at(0.8) }">
      <rect x="150" y="168" width="130" height="58" rx="14" class="kt-pp__engine" />
      <path d="M166 186 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" class="kt-pp__spark" />
      <text x="228" y="194" text-anchor="middle" class="kt-pp__name">AI wrapper</text>
      <text x="228" y="213" text-anchor="middle" class="kt-pp__does">summarizes</text>
      <g class="kt-pp__gears" :class="{ 'is-on': at(2.9) }">
        <circle cx="168" cy="214" r="6" class="kt-pp__gear" />
        <circle cx="179" cy="219" r="4" class="kt-pp__gear is-small" />
      </g>
    </g>

    <!-- you ask, the summary comes back -->
    <g class="kt-pp__in" :class="{ 'is-on': at(2.6) }">
      <path d="M372 166 C 360 128, 300 130, 270 164" class="kt-pp__ask" />
      <path d="M264 156 L 270 166 L 279 159" class="kt-pp__ask" />
      <text x="326" y="128" text-anchor="middle" class="kt-pp__said">“summarize”</text>
    </g>
    <path d="M282 197 H 340" class="kt-pp__wire kt-pp__in" :class="{ 'is-on': at(3.2) }" />
    <g class="kt-pp__summary" :class="{ 'is-on': at(3.4) }">
      <rect x="288" y="182" width="28" height="32" rx="3" class="kt-pp__sum" />
      <path d="M294 192 h16 M294 199 h16 M294 206 h11" class="kt-pp__text is-sum" />
    </g>
    <g class="kt-pp__in" :class="{ 'is-on': at(0.9) }">
      <image href="/images/speaker.webp" x="350" y="168" width="58" height="58" :clip-path="`url(#${id('face')})`"
        preserveAspectRatio="xMidYMid slice" class="kt-pp__me is-grey" />
      <circle cx="379" cy="197" r="29" class="kt-pp__ring is-grey" />
    </g>
    <text x="379" y="246" text-anchor="middle" class="kt-pp__state is-idle kt-pp__in" :class="{ 'is-on': at(3.7) }">idle</text>
    <g class="kt-pp__in" :class="{ 'is-on': at(3.7) }">
      <path d="M150 296 H 410" class="kt-pp__flat" />
      <text x="24" y="300" class="kt-pp__label">your thinking</text>
    </g>
    <text x="216" y="330" text-anchor="middle" class="kt-pp__line kt-pp__in" :class="{ 'is-on': at(3.8) }">The AI does the synthesis.</text>
    <text x="216" y="352" text-anchor="middle" class="kt-pp__line is-dim kt-pp__in" :class="{ 'is-on': at(3.8) }">You read the result.</text>

    <!-- ============ PUSH ============ -->
    <g :transform="`translate(${PUSH_X} 0)`">
      <g class="kt-pp__panel is-push" :class="{ 'is-on': at(PUSH_AT) }">
        <rect x="2" y="2" width="428" height="368" rx="14" class="kt-pp__frame" />
        <g class="kt-pp__title">
          <rect x="14" y="14" width="240" height="28" rx="5" />
          <text x="26" y="33">PUSH BASED ARCHITECTURE</text>
        </g>
        <text x="264" y="33" class="kt-pp__sub">you do the synthesis</text>
      </g>

      <!-- you read the same five notes, and distill them in layers -->
      <g v-for="(n, i) in notes" :key="`sn${i}`" class="kt-pp__collect" :class="{ 'is-on': at(PUSH_AT + 0.3 + i * 0.16) }">
        <rect :x="n.x" :y="NOTE_Y" width="52" height="64" rx="5" class="kt-pp__note is-read" />
        <rect :x="n.x + 5" :y="lineY(marks[i].hl) - 5" :width="n.widths[marks[i].hl] + 6" height="10" rx="2"
          class="kt-pp__hl" :class="{ 'is-on': at(HL_AT + i * 0.12) }" />
        <path v-for="(w, j) in n.widths" :key="j" :d="`M${n.x + 8} ${lineY(j)} h${w}`" class="kt-pp__text"
          :class="{ 'is-bold': marks[i].bold.includes(j) && at(BOLD_AT + i * 0.12) }" />
      </g>

      <!-- the layers, named -->
      <g class="kt-pp__pop" :class="{ 'is-on': at(PUSH_AT + 0.4) }">
        <rect x="22" y="140" width="92" height="22" rx="11" class="kt-pp__tag is-collect" />
        <text x="68" y="155" text-anchor="middle" class="kt-pp__tagtext is-collect">1 · collect</text>
      </g>
      <g class="kt-pp__pop" :class="{ 'is-on': at(BOLD_AT) }">
        <rect x="120" y="140" width="72" height="22" rx="11" class="kt-pp__tag is-bold" />
        <text x="156" y="155" text-anchor="middle" class="kt-pp__tagtext is-bold">2 · bold</text>
      </g>
      <g class="kt-pp__pop" :class="{ 'is-on': at(HL_AT) }">
        <rect x="198" y="140" width="108" height="22" rx="11" class="kt-pp__tag is-a" />
        <text x="252" y="155" text-anchor="middle" class="kt-pp__tagtext is-a">3 · highlight</text>
      </g>
      <g class="kt-pp__in" :class="{ 'is-on': at(PUSH_AT + 0.4) }">
        <text x="316" y="148" class="kt-pp__method">Progressive</text>
        <text x="316" y="161" class="kt-pp__method">Summarization</text>
      </g>

      <!-- what you distilled goes to the coach -->
      <g class="kt-pp__in" :class="{ 'is-on': at(WRITE_AT - 0.3) }">
        <circle cx="46" cy="200" r="33" class="kt-pp__glow" :class="{ 'is-on': at(LOAD_AT) }" />
        <image href="/images/speaker.webp" x="18" y="172" width="56" height="56" :clip-path="`url(#${id('face')})`"
          preserveAspectRatio="xMidYMid slice" class="kt-pp__me" />
        <circle cx="46" cy="200" r="28" class="kt-pp__ring" :class="{ 'is-load': at(LOAD_AT) }" />
      </g>
      <path d="M84 200 H 280" class="kt-pp__wire kt-pp__in" :class="{ 'is-on': at(SEND_AT) }" />
      <path d="M272 194 L 281 200 L 272 206" class="kt-pp__arrow kt-pp__in" :class="{ 'is-on': at(SEND_AT) }" />
      <g class="kt-pp__in" :class="{ 'is-on': at(SEND_AT - 0.2) }">
        <rect x="284" y="172" width="130" height="58" rx="14" class="kt-pp__engine is-coach" />
        <path d="M300 190 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" class="kt-pp__spark" />
        <text x="360" y="198" text-anchor="middle" class="kt-pp__name">mind coach</text>
        <text x="360" y="217" text-anchor="middle" class="kt-pp__does">asks</text>
      </g>

      <!-- it pushes back -->
      <g class="kt-pp__bubblewrap" :class="{ 'is-on': at(ASK_AT) }">
        <path d="M346 232 L 352 246 L 362 232z" class="kt-pp__bubble" />
        <rect x="156" y="244" width="258" height="32" rx="16" class="kt-pp__bubble" />
        <path d="M347 233 h14" class="kt-pp__seam" />
        <circle cx="178" cy="260" r="10" class="kt-pp__q" />
        <text x="178" y="265" text-anchor="middle" class="kt-pp__qtext">?</text>
        <text x="196" y="265" class="kt-pp__asktext">Why is that the key idea?</text>
      </g>
      <text x="46" y="254" text-anchor="middle" class="kt-pp__state is-load kt-pp__in" :class="{ 'is-on': at(LOAD_AT) }">under load</text>
      <g class="kt-pp__in" :class="{ 'is-on': at(LOAD_AT) }">
        <path d="M150 296 H 196 L 206 282 L 216 304 L 226 286 H 256 L 266 280 L 278 306 L 290 288 H 320 L 330 282 L 342 302 L 352 296 H 410"
          pathLength="1" class="kt-pp__spike" />
        <text x="24" y="300" class="kt-pp__label">your thinking</text>
      </g>
      <text x="216" y="330" text-anchor="middle" class="kt-pp__line kt-pp__in" :class="{ 'is-on': at(LOAD_AT + 0.3) }">You do the synthesis.</text>
      <text x="216" y="352" text-anchor="middle" class="kt-pp__line is-hot kt-pp__in" :class="{ 'is-on': at(LOAD_AT + 0.3) }">The AI spars with it.</text>
    </g>
  </svg>
</template>

<style>
.kt-pp {
  width: 880px;
  height: auto;
  overflow: visible;
  font-family: var(--font-family-sans);
}

/* panels and titles */
.kt-pp__panel { opacity: 0; transition: opacity 0.4s; }
.kt-pp__panel.is-on { opacity: 1; }
.kt-pp__frame { fill: color-mix(in srgb, var(--kt-fg) 3%, transparent); stroke: var(--kt-line-strong); stroke-width: 2.5; }
.kt-pp__panel.is-push .kt-pp__frame { stroke: var(--kt-c-primary); fill: color-mix(in srgb, var(--kt-c-primary) 8%, transparent); }
.kt-pp__title rect { stroke-width: 1.5; }
.kt-pp__title text { font: 900 13px var(--font-family-mono); letter-spacing: 0.06em; }
.kt-pp__panel.is-pull .kt-pp__title rect { fill: color-mix(in srgb, var(--kt-hot) 14%, var(--kt-bg)); stroke: var(--kt-hot); }
.kt-pp__panel.is-pull .kt-pp__title text { fill: var(--kt-hot); }
.kt-pp__panel.is-push .kt-pp__title rect { fill: color-mix(in srgb, var(--kt-good) 14%, var(--kt-bg)); stroke: var(--kt-good); }
.kt-pp__panel.is-push .kt-pp__title text { fill: var(--kt-good); }
.kt-pp__sub { font: 600 11px var(--font-family-mono); fill: var(--kt-muted); }

/* entrances */
.kt-pp__in { opacity: 0; transition: opacity 0.35s; }
.kt-pp__in.is-on { opacity: 1; }
.kt-pp__in.is-on.is-gone { opacity: 0; }
.kt-pp__pop { opacity: 0; transform-box: fill-box; transform-origin: center; transform: scale(0.5); transition: opacity 0.2s, transform 0.4s cubic-bezier(0.3, 1.8, 0.5, 1); }
.kt-pp__pop.is-on { opacity: 1; transform: none; }

/* notes */
.kt-pp__note { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 1.5; }
.kt-pp__note.is-read { stroke: var(--kt-c-primary-soft); }
.kt-pp__text { stroke: var(--kt-subtle); stroke-width: 3; stroke-linecap: round; transition: stroke 0.3s; }
.kt-pp__text.is-sum { stroke: var(--kt-c-primary-soft); stroke-width: 2.5; }
.kt-pp__label { font: 600 11px var(--font-family-mono); fill: var(--kt-muted); }

/* pull: the notes drop into the AI */
.kt-pp__drop { transform-box: fill-box; transform-origin: center; transition: transform 0.6s cubic-bezier(0.6, 0, 0.8, 0.5), opacity 0.4s 0.3s; }
.kt-pp__drop.is-dropped { transform: translate(var(--dx), var(--dy)) scale(0.15); opacity: 0; }

.kt-pp__engine { fill: var(--kt-code-bg); stroke: var(--kt-line-strong); stroke-width: 2.5; }
.kt-pp__engine.is-coach { stroke: var(--kt-c-primary); }
.kt-pp__spark { fill: var(--kt-warn); }
.kt-pp__name { font-size: 15px; font-weight: 800; fill: var(--kt-heading); }
.kt-pp__does { font: 600 11px var(--font-family-mono); fill: var(--kt-muted); }
.kt-pp__gears { opacity: 0; transition: opacity 0.3s; }
.kt-pp__gears.is-on { opacity: 1; }
.kt-pp__gear {
  fill: none;
  stroke: var(--kt-warn);
  stroke-width: 3.5;
  stroke-dasharray: 3 2.5;
  transform-box: fill-box;
  transform-origin: center;
  animation: kt-pp-spin 2.4s linear infinite;
}
.kt-pp__gear.is-small { animation-direction: reverse; animation-duration: 1.6s; stroke-width: 2.5; }
@keyframes kt-pp-spin { to { transform: rotate(360deg); } }

.kt-pp__ask { fill: none; stroke: var(--kt-hot); stroke-width: 2.5; stroke-dasharray: 6 5; stroke-linecap: round; stroke-linejoin: round; }
.kt-pp__said { font: 700 13px var(--font-family-mono); fill: var(--kt-hot); }
.kt-pp__wire { fill: none; stroke: var(--kt-line-strong); stroke-width: 2.5; stroke-dasharray: 6 5; }
.kt-pp__arrow { fill: none; stroke: var(--kt-line-strong); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
.kt-pp__summary { opacity: 0; transform: translateX(-30px); transition: opacity 0.3s, transform 0.6s cubic-bezier(0.3, 1.3, 0.5, 1); }
.kt-pp__summary.is-on { opacity: 1; transform: none; }
.kt-pp__sum { fill: var(--kt-card); stroke: var(--kt-c-primary-soft); stroke-width: 1.5; }

/* you */
.kt-pp__me.is-grey { filter: grayscale(1) brightness(0.75); }
.kt-pp__ring { fill: none; stroke: var(--kt-c-primary-soft); stroke-width: 3; transition: stroke 0.3s; }
.kt-pp__ring.is-grey { stroke: var(--kt-line-strong); }
.kt-pp__ring.is-load { stroke: var(--kt-good); }
.kt-pp__glow { fill: color-mix(in srgb, var(--kt-good) 24%, transparent); opacity: 0; transition: opacity 0.4s; }
.kt-pp__glow.is-on { opacity: 1; animation: kt-pp-pulse 1.4s ease-in-out infinite; }
@keyframes kt-pp-pulse { 50% { opacity: 0.4; } }
.kt-pp__state { font: 800 12px var(--font-family-mono); letter-spacing: 0.04em; }
.kt-pp__state.is-idle { fill: var(--kt-hot); }
.kt-pp__state.is-load { fill: var(--kt-good); }
.kt-pp__flat { stroke: var(--kt-line-strong); stroke-width: 3; stroke-linecap: round; }
.kt-pp__spike {
  fill: none;
  stroke: var(--kt-good);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  transition: stroke-dashoffset 1s ease-in-out;
}
.kt-pp__in.is-on .kt-pp__spike { stroke-dashoffset: 0; }

/* push: marking the common parts */
.kt-pp__hl { fill: color-mix(in srgb, var(--kt-warn) 45%, transparent); transform-box: fill-box; transform-origin: 0% 50%; transform: scaleX(0); transition: transform 0.35s ease-out; }
.kt-pp__hl.is-on { transform: none; }
.kt-pp__text { transition: stroke 0.3s, stroke-width 0.3s; }
.kt-pp__text.is-bold { stroke: var(--kt-heading); stroke-width: 5; }
.kt-pp__method { font: 800 10.5px var(--font-family-mono); fill: var(--kt-muted); }
/* layer 1: the notes get collected, flying in one by one */
.kt-pp__collect { opacity: 0; transform: translate(60px, -40px) rotate(12deg) scale(0.6); transition: opacity 0.25s, transform 0.5s cubic-bezier(0.3, 1.4, 0.5, 1); }
.kt-pp__collect.is-on { opacity: 1; transform: none; }
.kt-pp__tag { stroke-width: 1.5; }
.kt-pp__tag.is-a { fill: color-mix(in srgb, var(--kt-warn) 18%, var(--kt-bg)); stroke: var(--kt-warn); }
.kt-pp__tag.is-bold { fill: var(--kt-card); stroke: var(--kt-heading); }
.kt-pp__tag.is-collect { fill: color-mix(in srgb, var(--kt-c-primary) 20%, var(--kt-bg)); stroke: var(--kt-c-primary-soft); }
.kt-pp__tagtext { font: 800 12px var(--font-family-mono); }
.kt-pp__tagtext.is-a { fill: var(--kt-warn); }
.kt-pp__tagtext.is-bold { fill: var(--kt-heading); font-weight: 900; }
.kt-pp__tagtext.is-collect { fill: var(--kt-c-primary-soft); }

/* the coach pushes back */
.kt-pp__bubblewrap { opacity: 0; transform-box: fill-box; transform-origin: 80% 0%; transform: scale(0.6); transition: opacity 0.2s, transform 0.45s cubic-bezier(0.3, 1.7, 0.5, 1); }
.kt-pp__bubblewrap.is-on { opacity: 1; transform: none; }
.kt-pp__bubble { fill: var(--kt-card); stroke: var(--kt-hot); stroke-width: 2; stroke-linejoin: round; }
.kt-pp__seam { stroke: var(--kt-card); stroke-width: 3; }
.kt-pp__q { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); stroke-width: 2; }
.kt-pp__qtext { font: 900 13px var(--font-family-sans); fill: var(--kt-hot); }
.kt-pp__asktext { font: 700 13px var(--font-family-mono); fill: var(--kt-heading); }

/* the lines under each panel */
.kt-pp__line { font-size: 15px; font-weight: 800; fill: var(--kt-heading); }
.kt-pp__line.is-dim { fill: var(--kt-muted); font-weight: 600; }
.kt-pp__line.is-hot { fill: var(--kt-good); }

@media (prefers-reduced-motion: reduce) {
  .kt-pp__gear,
  .kt-pp__glow.is-on { animation: none !important; }
}
</style>
