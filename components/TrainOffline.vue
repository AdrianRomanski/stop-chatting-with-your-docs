<script setup lang="ts">
import { computed } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * The talk's origin story, as a gag in five beats, plays once:
 * 1. on the train, the book snaps shut into its real cover (Building a Second Brain): finished
 * 2. the laptop opens on the PKP Intercity Wi-Fi: "connecting…", then "no internet" and a #@%&!
 * 3. so the notes start: they spray out of the laptop, then links draw between them, a note graph
 * 4. the graph tangles, the person beside it thinks "Organize that CHAOS using PARA"; the notes snap into
 *    the four PARA folders, P · A · R · A (Projects, Areas, Resources, Archives): "Finally Structured"
 * 5. still unsure: "How can I know that I understand it?"; the doubt turns into the idea, a lightbulb over the
 *    thought: "I Need OFFLINE Sparring Partner"
 * Sets up the structure (PARA) and the plan (CODE) of "build the brain"; the bulb pays off on
 * "Airplane mode, on". No props.
 */
const { at } = useTimeline(12)
const poles = [0, 1, 2]
// where the spammed notes land: x, y, rotation
const notes = [
  [612, 84, -10], [690, 70, 7], [652, 142, 9], [724, 130, -6], [606, 200, 5],
  [684, 208, -9], [632, 272, 8], [710, 280, -5], [600, 330, -4], [738, 336, 6],
]
const NOTE_AT = 3.4
const NOTE_STEP = 0.12
// the links the person draws between them, in order
const links = [[0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [2, 5], [3, 5], [4, 6], [5, 7], [6, 7], [6, 8], [7, 9]]
const LINK_AT = 4.8
const LINK_STEP = 0.16
// then everything links to everything: the graph tangles
const tangle = [[0, 9], [1, 8], [3, 6], [4, 9], [1, 4], [8, 3]]
const PILE_AT = 7
// the fix: the notes file into the four PARA folders, Projects, Areas, Resources, Archives
const columns = [600, 644, 688, 732]
const para = ['P', 'A', 'R', 'A']
const ordered = notes.map((_, i) => [columns[i % 4], 128 + Math.floor(i / 4) * 52, 0])
const ORDER_AT = 8.4
const DOUBT_AT = 9.8
const IDEA_AT = 11
// a folder per column, drawn like ParaBuckets': tab top left, the notes sit inside
const folder = (x: number) => `M${x - 19} 98 h14 l5 6 h19 v154 h-38z`
// a note sits where it landed until the folders are out, then they pull it in, a few at a time
function place(i: number) {
  const [x, y, r] = at(ORDER_AT) ? ordered[i] : notes[i]
  return {
    '--x': `${x}px`, '--y': `${y}px`, '--r': `${r}deg`, '--s': at(ORDER_AT) ? 0.85 : 1,
    transitionDelay: at(ORDER_AT) ? `${0.35 + i * 0.04}s` : '0s',
  }
}
const thought = computed(() =>
  at(IDEA_AT) ? 'idea' : at(DOUBT_AT) ? 'doubt' : at(ORDER_AT) ? 'plan' : 'pile')
</script>

<template>
  <svg class="kt-train" viewBox="0 0 880 340" role="img"
    aria-label="On the train: the book is finished. The laptop can't connect to the train Wi-Fi. So the notes pile up into a tangle: organize that chaos using PARA. They file into the four PARA folders, Projects, Areas, Resources, Archives: finally structured. How can I know that I understand it? An idea lights up: I need an offline sparring partner.">
    <defs>
      <clipPath id="kt-train-window">
        <rect x="20" y="40" width="250" height="200" rx="30" />
      </clipPath>
      <radialGradient id="kt-train-bulbglow">
        <stop offset="0%" class="kt-train__glow-in" />
        <stop offset="100%" class="kt-train__glow-out" />
      </radialGradient>
    </defs>

    <!-- beat 1: the train window, the book snaps shut -->
    <g class="kt-train__part" :class="{ 'is-on': at(0.1) }">
      <rect x="20" y="40" width="250" height="200" rx="30" class="kt-train__window" />
      <g clip-path="url(#kt-train-window)">
        <g class="kt-train__hills">
          <path d="M0 210 q 60 -50 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 V 260 H 0 z" class="kt-train__hill" />
        </g>
        <g v-for="p in poles" :key="p" class="kt-train__pole" :style="{ animationDelay: `${-p * 1.1}s` }">
          <path d="M300 90 v 160 M290 100 h 20" />
        </g>
      </g>
      <g class="kt-train__book" :class="{ 'is-shut': at(0.9) }">
        <g class="kt-train__open">
          <path d="M145 116 C 128 106, 104 106, 92 112 V 176 C 104 170, 128 170, 145 180 Z" class="kt-train__page" />
          <path d="M145 116 C 162 106, 186 106, 198 112 V 176 C 186 170, 162 170, 145 180 Z" class="kt-train__page" />
          <path d="M102 126 h30 M102 138 h34 M102 150 h28 M156 126 h32 M156 138 h26 M156 150 h30" class="kt-train__lines" />
        </g>
        <g class="kt-train__closed">
          <rect x="101" y="66" width="88" height="136" rx="4" class="kt-train__cover" />
          <image href="/images/books/building-a-second-brain.webp" x="103" y="68" width="84" height="132" preserveAspectRatio="xMidYMid slice" />
        </g>
      </g>
    </g>
    <g class="kt-train__chip" :class="{ 'is-on': at(1.1) }">
      <rect x="85" y="256" width="120" height="32" rx="16" class="kt-train__pill is-good" />
      <path d="M102 272 l5 5 l10 -11" class="kt-train__tick" />
      <text x="124" y="278" class="kt-train__pilltext is-good">finished</text>
    </g>

    <!-- beat 2: the laptop and the train Wi-Fi -->
    <g class="kt-train__part" :class="{ 'is-on': at(1.4) }">
      <rect x="310" y="56" width="250" height="170" rx="12" class="kt-train__screen" />
      <path d="M290 226 h 290 l -18 18 h -254 z" class="kt-train__base" />

      <!-- connecting… -->
      <g class="kt-train__state" :class="{ 'is-on': at(1.5) && !at(2.7) }">
        <rect x="330" y="76" width="210" height="44" rx="8" class="kt-train__plate" />
        <image href="/images/logos/pkp-intercity.png" x="340" y="85" width="190" height="24" />
        <text x="435" y="156" text-anchor="middle" class="kt-train__screentext">Wi-Fi: connecting<tspan class="kt-train__dots">…</tspan></text>
        <circle cx="435" cy="190" r="14" class="kt-train__spinner" />
      </g>

      <!-- no internet -->
      <g class="kt-train__state" :class="{ 'is-on': at(2.7) && !at(3.4) }">
        <circle cx="435" cy="122" r="28" class="kt-train__xring" />
        <path d="M423 110 l24 24 M447 110 l-24 24" class="kt-train__x" />
        <text x="435" y="186" text-anchor="middle" class="kt-train__screentext is-bad">no internet</text>
      </g>

      <!-- …so: notes.md, typing like mad -->
      <g class="kt-train__state" :class="{ 'is-on': at(3.4) }">
        <text x="330" y="84" class="kt-train__file">notes.md</text>
        <path v-for="(w, i) in [150, 110, 170, 90, 140, 160, 120]" :key="i" :d="`M330 ${104 + i * 16} h${w}`"
          class="kt-train__typed" :class="{ 'is-on': at(NOTE_AT + i * 0.22) }" />
      </g>
    </g>

    <!-- the rage bubble -->
    <g class="kt-train__rage" :class="{ 'is-on': at(2.85) && !at(3.9) }">
      <path d="M520 14 h86 a14 14 0 0 1 14 14 v20 a14 14 0 0 1 -14 14 h-56 l-14 14 l2 -14 h-18 a14 14 0 0 1 -14 -14 v-20 a14 14 0 0 1 14 -14z" class="kt-train__bubble" />
      <text x="563" y="45" text-anchor="middle" class="kt-train__ragetext">#@%&amp;!</text>
    </g>

    <!-- beat 3: the notes spam, then the links between them -->
    <!-- the notes sit high, clear of the person -->
    <g transform="translate(0 -40)">
      <g class="kt-train__graph" :class="{ 'is-tangled': at(PILE_AT), 'is-gone': at(ORDER_AT) }">
        <path v-for="([a, b], i) in links" :key="`l${i}`" pathLength="1"
          :d="`M${notes[a][0]} ${notes[a][1]} L${notes[b][0]} ${notes[b][1]}`"
          class="kt-train__link" :class="{ 'is-on': at(LINK_AT + i * LINK_STEP) }" />
        <path v-for="([a, b], i) in tangle" :key="`t${i}`" pathLength="1"
          :d="`M${notes[a][0]} ${notes[a][1]} L${notes[b][0]} ${notes[b][1]}`"
          class="kt-train__link" :class="{ 'is-on': at(PILE_AT + i * 0.1) }" />
      </g>

      <!-- beat 4: the four PARA folders open behind the pile, the notes drop in -->
      <path v-for="(x, i) in columns" :key="`f${i}`" :d="folder(x)" class="kt-train__folder"
        :class="{ 'is-on': at(ORDER_AT + i * 0.08), 'is-cold': i === 3 }" />

      <g v-for="(_, i) in notes" :key="i" class="kt-train__note" :class="{ 'is-on': at(NOTE_AT + i * NOTE_STEP) }"
        :style="place(i)">
        <g class="kt-train__notebody" :class="{ 'is-messy': at(PILE_AT) && !at(ORDER_AT) }" :style="{ animationDelay: `${-i * 0.07}s` }">
          <rect x="-17" y="-21" width="34" height="42" rx="4" class="kt-train__notecard" />
          <path d="M-10 -10 h20 M-10 -2 h16 M-10 6 h18" class="kt-train__notelines" />
        </g>
      </g>

      <!-- the folder labels: P · A · R · A -->
      <g v-for="(x, i) in columns" :key="`c${i}`" class="kt-train__step" :class="{ 'is-on': at(ORDER_AT + i * 0.08) }">
        <circle :cx="x" cy="76" r="14" class="kt-train__stepdot" :class="{ 'is-cold': i === 3 }" />
        <text :x="x" y="82" text-anchor="middle" class="kt-train__steptext" :class="{ 'is-cold': i === 3 }">{{ para[i] }}</text>
      </g>
    </g>

    <!-- the person, up and to the right, clear of the notes -->
    <g transform="translate(28 -40)">
      <!-- the person, unsure: pile → plan → doubt → idea -->
      <g class="kt-train__part" :class="{ 'is-on': at(LINK_AT) }">
        <circle cx="822" cy="282" r="18" class="kt-train__person" />
        <path d="M778 352 q0 -46 44 -46 q44 0 44 46z" class="kt-train__person" />
      </g>
      <g class="kt-train__think" :class="[`is-${thought}`, { 'is-on': at(PILE_AT) }]">
        <circle cx="806" cy="252" r="4" class="kt-train__thought" />
        <circle cx="796" cy="238" r="6" class="kt-train__thought" />
        <g class="kt-train__cloud">
          <rect x="740" y="120" width="138" height="104" rx="26" class="kt-train__thought" />
          <g class="kt-train__word is-pile">
            <text x="809" y="157" text-anchor="middle" class="kt-train__thinktext">Organize</text>
            <text x="809" y="177" text-anchor="middle" class="kt-train__thinktext">that <tspan class="kt-train__q">CHAOS</tspan></text>
            <text x="809" y="197" text-anchor="middle" class="kt-train__thinktext">using PARA</text>
          </g>
          <g class="kt-train__word is-plan">
            <text x="809" y="167" text-anchor="middle" class="kt-train__thinktext">Finally</text>
            <text x="809" y="187" text-anchor="middle" class="kt-train__thinktext">Structured</text>
          </g>
          <g class="kt-train__word is-doubt">
            <text x="809" y="147" text-anchor="middle" class="kt-train__thinktext">How can I</text>
            <text x="809" y="167" text-anchor="middle" class="kt-train__thinktext">know that I</text>
            <text x="809" y="187" text-anchor="middle" class="kt-train__thinktext">understand</text>
            <text x="809" y="207" text-anchor="middle" class="kt-train__thinktext">it<tspan class="kt-train__q">?</tspan></text>
          </g>
          <g class="kt-train__word is-idea">
            <text x="809" y="147" text-anchor="middle" class="kt-train__thinktext">I Need</text>
            <text x="809" y="167" text-anchor="middle" class="kt-train__thinktext">OFFLINE</text>
            <text x="809" y="187" text-anchor="middle" class="kt-train__thinktext">Sparring</text>
            <text x="809" y="207" text-anchor="middle" class="kt-train__thinktext">Partner</text>
          </g>
        </g>
      </g>
      <g transform="translate(-5 -30)">
        <g class="kt-train__idea" :class="{ 'is-on': at(IDEA_AT) }">
          <circle cx="820" cy="80" r="60" fill="url(#kt-train-bulbglow)" class="kt-train__glow" />
          <path d="M820 48 a30 30 0 0 1 18 54 v12 h-36 v-12 a30 30 0 0 1 18 -54z" class="kt-train__bulb" />
          <path d="M806 122 h28 M808 130 h24" class="kt-train__socket" />
          <path d="M812 92 l8 -10 l8 10" class="kt-train__filament" />
          <path d="M820 32 v-10 M790 44 l-7 -6 M850 44 l7 -6 M780 74 h-9 M860 74 h9" class="kt-train__rays" />
        </g>
      </g>
    </g>
  </svg>
</template>

<style>
.kt-train {
  width: 880px;
  height: auto;
  overflow: visible;
  font-family: var(--font-family-sans);
}

.kt-train__part,
.kt-train__chip,
.kt-train__state {
  opacity: 0;
  transition: opacity 0.3s;
}

.kt-train__part.is-on,
.kt-train__chip.is-on,
.kt-train__state.is-on { opacity: 1; }

/* the train */
.kt-train__window { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 3; }
.kt-train__hill { fill: var(--kt-tint-primary); stroke: var(--kt-line); stroke-width: 2; }
.kt-train__hills { animation: kt-train-slide 6s linear infinite; }
.kt-train__pole { animation: kt-train-pole 3.3s linear infinite; }
.kt-train__pole path { fill: none; stroke: var(--kt-line-strong); stroke-width: 3; stroke-linecap: round; }

@keyframes kt-train-slide { to { transform: translateX(-240px); } }
@keyframes kt-train-pole { from { transform: translateX(0); } to { transform: translateX(-340px); } }

/* the book: open → shut, with a little bounce */
.kt-train__page { fill: var(--kt-card); stroke: var(--kt-c-primary-soft); stroke-width: 2; stroke-linejoin: round; }
.kt-train__lines { stroke: var(--kt-subtle); stroke-width: 3; stroke-linecap: round; }
.kt-train__cover { fill: var(--kt-tint-primary); stroke: var(--kt-c-primary-soft); stroke-width: 2.5; }
.kt-train__spine { stroke: var(--kt-c-primary-soft); stroke-width: 2; }
.kt-train__end { font: 800 13px var(--font-family-mono); letter-spacing: 0.1em; fill: var(--kt-heading); }
.kt-train__open { transform-box: fill-box; transform-origin: center; transition: opacity 0.15s, transform 0.2s ease-in; }
.kt-train__closed { opacity: 0; transform-box: fill-box; transform-origin: center; transform: scale(1.3); transition: opacity 0.12s 0.15s, transform 0.35s cubic-bezier(0.3, 1.8, 0.5, 1) 0.15s; }
.kt-train__book.is-shut .kt-train__open { opacity: 0; transform: scaleX(0.3); }
.kt-train__book.is-shut .kt-train__closed { opacity: 1; transform: none; }

/* pills */
.kt-train__pill { stroke-width: 2; }
.kt-train__pill.is-good { fill: var(--kt-tint-success, var(--kt-tint-primary)); stroke: var(--kt-good); }
.kt-train__tick { fill: none; stroke: var(--kt-good); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
.kt-train__pilltext { font: 700 15px var(--font-family-mono); }
.kt-train__pilltext.is-good { fill: var(--kt-good); }

/* the laptop */
.kt-train__screen { fill: var(--kt-code-bg); stroke: var(--kt-line-strong); stroke-width: 2.5; }
.kt-train__base { fill: var(--kt-tint-neutral); stroke: var(--kt-line-strong); stroke-width: 2; }
.kt-train__plate { fill: var(--kt-fg); }
.kt-train__screentext { font: 600 16px var(--font-family-mono); fill: var(--kt-muted); }
.kt-train__screentext.is-bad { font-weight: 800; fill: var(--kt-hot); }
.kt-train__dots { animation: kt-train-blink 0.8s steps(2) infinite; }
@keyframes kt-train-blink { 50% { opacity: 0; } }
.kt-train__spinner {
  fill: none;
  stroke: var(--kt-c-primary-soft);
  stroke-width: 3.5;
  stroke-linecap: round;
  stroke-dasharray: 22 66;
  transform-box: fill-box;
  transform-origin: center;
  animation: kt-train-spin 0.9s linear infinite;
}
@keyframes kt-train-spin { to { transform: rotate(360deg); } }
.kt-train__xring { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); stroke-width: 3; }
.kt-train__x { stroke: var(--kt-hot); stroke-width: 4; stroke-linecap: round; }
.kt-train__file { font: 700 13px var(--font-family-mono); fill: var(--kt-c-primary-soft); }
.kt-train__typed {
  stroke: var(--kt-subtle);
  stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
  transition: stroke-dashoffset 0.25s linear;
}
.kt-train__typed.is-on { stroke-dashoffset: 0; }

/* the rage bubble: pops, shakes */
.kt-train__rage { opacity: 0; transform-box: fill-box; transform-origin: 20% 100%; transform: scale(0.4); transition: opacity 0.15s, transform 0.3s cubic-bezier(0.3, 1.9, 0.5, 1); }
.kt-train__rage.is-on { opacity: 1; transform: none; animation: kt-train-shake 0.18s linear 0.3s 4; }
@keyframes kt-train-shake { 25% { transform: translateX(-3px) rotate(-2deg); } 75% { transform: translateX(3px) rotate(2deg); } }
.kt-train__bubble { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); stroke-width: 2.5; }
.kt-train__ragetext { font: 900 20px var(--font-family-mono); fill: var(--kt-hot); }

/* the spam: notes fly out of the laptop and land at an angle */
.kt-train__note {
  opacity: 0;
  transform: translate(435px, 150px) scale(0.2);
  transition: opacity 0.15s, transform 0.45s cubic-bezier(0.25, 1.5, 0.5, 1);
}
.kt-train__note.is-on { opacity: 1; transform: translate(var(--x), var(--y)) rotate(var(--r)) scale(var(--s)); }
.kt-train__notecard { fill: color-mix(in srgb, var(--kt-fg) 8%, var(--kt-bg)); stroke: var(--kt-c-primary-soft); stroke-width: 2; }
.kt-train__notelines { stroke: var(--kt-subtle); stroke-width: 2.5; stroke-linecap: round; }

/* the graph: links draw in between the notes */
.kt-train__link {
  fill: none;
  stroke: var(--kt-c-primary-soft);
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  transition: stroke-dashoffset 0.3s ease-out;
}
.kt-train__link.is-on { stroke-dashoffset: 0; }

/* the pile: the graph tangles and turns hot, the notes jitter; then it clears for the columns */
.kt-train__graph { transition: opacity 0.3s; }
.kt-train__graph .kt-train__link { transition: stroke-dashoffset 0.3s ease-out, stroke 0.3s; }
.kt-train__graph.is-tangled .kt-train__link { stroke: var(--kt-hot); }
.kt-train__graph.is-gone { opacity: 0; }
.kt-train__notebody.is-messy { animation: kt-train-jitter 0.22s linear infinite; }
@keyframes kt-train-jitter { 25% { transform: translate(-1.5px, 1px) rotate(-3deg); } 75% { transform: translate(1.5px, -1px) rotate(3deg); } }

/* the structure: four PARA folders, Archives cold like ParaBuckets', a letter over each */
.kt-train__folder {
  opacity: 0;
  fill: var(--kt-tint-primary);
  stroke: var(--kt-c-primary);
  stroke-width: 2;
  stroke-linejoin: round;
  transform-box: fill-box;
  transform-origin: 50% 100%;
  transform: scaleY(0.2);
  transition: opacity 0.2s, transform 0.35s cubic-bezier(0.3, 1.6, 0.5, 1);
}
.kt-train__folder.is-on { opacity: 1; transform: none; }
.kt-train__folder.is-cold { fill: var(--kt-tint-neutral); stroke: var(--kt-line-strong); }
.kt-train__step { opacity: 0; transform-box: fill-box; transform-origin: center; transform: scale(0.5); transition: opacity 0.2s, transform 0.35s cubic-bezier(0.3, 1.8, 0.5, 1); }
.kt-train__step.is-on { opacity: 1; transform: none; }
.kt-train__stepdot { fill: var(--kt-tint-success, var(--kt-tint-primary)); stroke: var(--kt-good); stroke-width: 2.5; }
.kt-train__stepdot.is-cold { fill: var(--kt-tint-neutral); stroke: var(--kt-line-strong); }
.kt-train__steptext { font: 800 17px var(--font-family-mono); fill: var(--kt-good); }
.kt-train__steptext.is-cold { fill: var(--kt-muted); }

/* the person, unsure */
.kt-train__person { fill: var(--kt-tint-neutral); stroke: var(--kt-c-primary-soft); stroke-width: 2.5; }
.kt-train__think { opacity: 0; transition: opacity 0.3s; }
.kt-train__think.is-on { opacity: 1; }
.kt-train__thought { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 2; transition: stroke 0.3s, fill 0.3s; }
.kt-train__think.is-idea .kt-train__thought { stroke: var(--kt-warn); fill: color-mix(in srgb, var(--kt-warn) 12%, var(--kt-bg)); }
.kt-train__cloud { transform-box: fill-box; transform-origin: 40% 100%; }
.kt-train__think.is-plan .kt-train__thought { stroke: var(--kt-good); fill: color-mix(in srgb, var(--kt-good) 12%, var(--kt-bg)); }
.kt-train__think.is-on:is(.is-pile, .is-doubt) .kt-train__cloud { animation: kt-train-wobble 1.6s ease-in-out infinite; }
@keyframes kt-train-wobble { 25% { transform: rotate(-2.5deg); } 75% { transform: rotate(2.5deg); } }
.kt-train__thinktext { font: 700 15px var(--font-family-mono); fill: var(--kt-heading); }
.kt-train__q { fill: var(--kt-hot); font-weight: 900; }
/* one word at a time: the old one fades out before the new one fades in, never text on text */
.kt-train__word { opacity: 0; transition: opacity 0.12s; }
.kt-train__think.is-pile .kt-train__word.is-pile,
.kt-train__think.is-plan .kt-train__word.is-plan,
.kt-train__think.is-doubt .kt-train__word.is-doubt,
.kt-train__think.is-idea .kt-train__word.is-idea { opacity: 1; transition: opacity 0.2s 0.14s; }

/* the idea */
.kt-train__idea { opacity: 0; transform-box: fill-box; transform-origin: 50% 70%; transform: scale(0.3); transition: opacity 0.2s, transform 0.45s cubic-bezier(0.3, 1.8, 0.5, 1); }
.kt-train__idea.is-on { opacity: 1; transform: none; }
.kt-train__glow-in { stop-color: var(--kt-warn); stop-opacity: 0.55; }
.kt-train__glow-out { stop-color: var(--kt-warn); stop-opacity: 0; }
.kt-train__glow { animation: kt-train-pulse 2.4s ease-in-out 0.5s infinite; }
@keyframes kt-train-pulse { 50% { opacity: 0.55; } }
.kt-train__bulb { fill: color-mix(in srgb, var(--kt-warn) 30%, var(--kt-bg)); stroke: var(--kt-warn); stroke-width: 3; stroke-linejoin: round; }
.kt-train__socket { stroke: var(--kt-line-strong); stroke-width: 3; stroke-linecap: round; }
.kt-train__filament { fill: none; stroke: var(--kt-warn); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
.kt-train__rays { stroke: var(--kt-warn); stroke-width: 3; stroke-linecap: round; }

@media (prefers-reduced-motion: reduce) {
  .kt-train__hills,
  .kt-train__pole,
  .kt-train__spinner,
  .kt-train__dots,
  .kt-train__glow,
  .kt-train__cloud,
  .kt-train__notebody { animation: none !important; }
}
</style>
