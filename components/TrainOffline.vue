<script setup lang="ts">
import { computed, useId } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * The workshop's origin story, plays once, one short thought cloud over the person:
 * 1. on the train, the book snaps shut into its real cover (Building a Second Brain): finished
 * 2. the laptop opens on the PKP Intercity Wi-Fi: "connecting…", then PKP Intercity "no internet", which stays
 *    on the screen to the end; the person: "I'm bored…"
 * 3. "ADHD won't let me sit still": the notes spray out of the laptop, then links draw between them
 * 4. the graph tangles: "Let's organize my notes"; the notes snap into the four PARA folders, P · A · R · A
 *    (Projects, Areas, Resources, Archives)
 * The person is drawn 1.8× from the feet, right of the folders; the cloud and the bulb sit high above the head.
 * 5. the lightbulb, the cloud turns amber: "A sparring partner, Matrix-style. Offline!", and the person's head
 *    and body fill with Matrix code rain (MATRIX letters, ones and zeros, falling for as long as the slide is up). The next slide
 *    (NeoGrind) tells the Matrix scene
 * Sets up the structure (PARA) and the plan (CODE) of "build the brain"; the bulb leads into the Matrix
 * storyboard (NeoGrind), the next slide, and pays off on "Airplane mode, on". No props.
 */
const { at } = useTimeline(11)
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
const IDEA_AT = 9.8 // the bulb, once the notes are filed
const BORED_AT = 2.9 // no internet: the person, and the first thought
// the thought: bored, then ADHD while the notes fly and link, then organize them, then the idea
const ADHD_AT = 4.3 // the notes are already flying: sitting still was never an option
// the Matrix rain in the person's head: the letters of MATRIX and ones and zeros, like the cover's;
// each column falls on its own CSS loop (speed and phase per column), so it rains for as long as the slide is up
const rainClip = `kt-train-rain-${useId()}`
const GLYPHS = 'MATRIX01'
const rain = Array.from({ length: 6 }, (_, c) => ({
  x: 806 + c * 6.4,
  chars: Array.from({ length: 12 }, (_, k) => GLYPHS[(c * 13 + k * k * 7 + k * 3 + ((c * k) % 5)) % GLYPHS.length]),
  dur: 1.4 + ((c * 37) % 9) / 10,
  delay: ((c * 53) % 20) / 10,
}))
const bodyClip = `kt-train-body-${useId()}`
const bodyRain = Array.from({ length: 14 }, (_, c) => ({
  x: 782 + c * 6.4,
  chars: Array.from({ length: 15 }, (_, k) => GLYPHS[(c * 11 + k * k * 5 + k * 7 + ((c * k) % 3)) % GLYPHS.length]),
  dur: 1.3 + ((c * 29) % 9) / 10,
  delay: ((c * 41) % 20) / 10,
}))
const thought = computed(() => (at(IDEA_AT) ? 'idea' : at(PILE_AT) ? 'organize' : at(ADHD_AT) ? 'adhd' : 'bored'))
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
</script>

<template>
  <svg class="kt-train" viewBox="0 0 880 340" role="img"
    aria-label="On the train: the book is finished. The laptop can't connect to the train Wi-Fi. I'm bored. ADHD won't let me sit still, so the notes pile up into a tangle. Let's organize my notes: they file into the four PARA folders, Projects, Areas, Resources, Archives. Then a lightbulb: a sparring partner, Matrix-style. Offline! The head and body fill with Matrix code rain.">
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

      <!-- PKP Intercity, no internet: stays on the screen to the end -->
      <g class="kt-train__state" :class="{ 'is-on': at(2.7) }">
        <rect x="330" y="76" width="210" height="44" rx="8" class="kt-train__plate" />
        <image href="/images/logos/pkp-intercity.png" x="340" y="85" width="190" height="24" />
        <circle cx="435" cy="158" r="22" class="kt-train__xring" />
        <path d="M426 149 l18 18 M444 149 l-18 18" class="kt-train__x" />
        <text x="435" y="208" text-anchor="middle" class="kt-train__screentext is-bad">no internet</text>
      </g>

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
        <circle :cx="x" cy="76" r="14" class="kt-train__stepdot" />
        <text :x="x" y="82" text-anchor="middle" class="kt-train__steptext">{{ para[i] }}</text>
      </g>
    </g>

    <!-- the person, up and to the right, clear of the notes -->
    <g transform="translate(28 -40)">
      <!-- the person, 1.8× from the feet, right of the folders: bored → let's organize → the idea -->
      <g transform="translate(808 352) scale(1.8) translate(-822 -352)">
      <g class="kt-train__part" :class="{ 'is-on': at(BORED_AT) }">
        <circle cx="822" cy="282" r="18" class="kt-train__person" />
        <path d="M778 352 q0 -46 44 -46 q44 0 44 46z" class="kt-train__person" />
      </g>
      <!-- the idea: the head fills with Matrix code rain, and it keeps falling -->
      <defs>
        <clipPath :id="rainClip"><circle cx="822" cy="282" r="16.5" /></clipPath>
        <clipPath :id="bodyClip"><path d="M779.5 351 q0 -44.5 42.5 -44.5 q42.5 0 42.5 44.5z" /></clipPath>
      </defs>
      <g class="kt-train__state" :class="{ 'is-on': at(IDEA_AT) }" :clip-path="`url(#${rainClip})`">
        <circle cx="822" cy="282" r="17" class="kt-train__rainbg" />
        <g v-for="c in rain" :key="c.x" class="kt-train__raincol" :style="{ animationDuration: `${c.dur}s`, animationDelay: `${-c.delay}s` }">
          <text v-for="(g, k) in c.chars" :key="k" :x="c.x" :y="k * 7" text-anchor="middle" class="kt-train__rain"
            :class="{ 'is-head': k === c.chars.length - 1 }" :style="{ opacity: 0.25 + 0.75 * (k / (c.chars.length - 1)) }">{{ g }}</text>
        </g>
      </g>
      <!-- …and the body too -->
      <g class="kt-train__state" :class="{ 'is-on': at(IDEA_AT) }" :clip-path="`url(#${bodyClip})`">
        <path d="M778 352 q0 -46 44 -46 q44 0 44 46z" class="kt-train__rainbg" />
        <g v-for="c in bodyRain" :key="c.x" class="kt-train__raincol is-body" :style="{ animationDuration: `${c.dur}s`, animationDelay: `${-c.delay}s` }">
          <text v-for="(g, k) in c.chars" :key="k" :x="c.x" :y="k * 7" text-anchor="middle" class="kt-train__rain"
            :class="{ 'is-head': k === c.chars.length - 1 }" :style="{ opacity: 0.25 + 0.75 * (k / (c.chars.length - 1)) }">{{ g }}</text>
        </g>
      </g>
      </g>
      <!-- one thought cloud, pushed up over the bigger head -->
      <g transform="translate(12 -84)">
      <g class="kt-train__think" :class="[`is-${thought}`, { 'is-on': at(BORED_AT) }]">
        <circle cx="806" cy="252" r="4" class="kt-train__thought" />
        <circle cx="796" cy="238" r="6" class="kt-train__thought" />
        <rect x="736" y="120" width="146" height="104" rx="26" class="kt-train__thought" />
        <g class="kt-train__word is-bored">
          <text x="809" y="178" text-anchor="middle" class="kt-train__thinktext">I'm bored…</text>
        </g>
        <g class="kt-train__word is-adhd">
          <text x="809" y="167" text-anchor="middle" class="kt-train__thinktext"><tspan class="kt-train__adhd">ADHD</tspan> won't let</text>
          <text x="809" y="189" text-anchor="middle" class="kt-train__thinktext">me sit still</text>
        </g>
        <g class="kt-train__word is-organize">
          <text x="809" y="167" text-anchor="middle" class="kt-train__thinktext">Let's organize</text>
          <text x="809" y="189" text-anchor="middle" class="kt-train__thinktext">my notes</text>
        </g>
        <g class="kt-train__word is-idea">
          <text x="809" y="147" text-anchor="middle" class="kt-train__thinktext">A sparring</text>
          <text x="809" y="167" text-anchor="middle" class="kt-train__thinktext">partner,</text>
          <text x="809" y="187" text-anchor="middle" class="kt-train__thinktext kt-train__matrix">Matrix-style.</text>
          <text x="809" y="207" text-anchor="middle" class="kt-train__thinktext kt-train__offline">Offline!</text>
        </g>
      </g>
      </g>
      <g transform="translate(1 -101)"> <!-- the bulb, over the cloud -->
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

/* the structure: four PARA folders, Archives cold like ParaBuckets', a green letter over each */
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
.kt-train__steptext { font: 800 17px var(--font-family-mono); fill: var(--kt-good); }

/* the person, unsure */
/* the thought cloud: fades in once, its words swap; amber when the idea lands */
.kt-train__think { opacity: 0; transition: opacity 0.3s; }
.kt-train__think.is-on { opacity: 1; }
.kt-train__thought { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 2; transition: stroke 0.3s, fill 0.3s; }
.kt-train__think.is-idea .kt-train__thought { stroke: var(--kt-warn); fill: color-mix(in srgb, var(--kt-warn) 12%, var(--kt-bg)); }
.kt-train__thinktext { font: 700 16px var(--font-family-mono); fill: var(--kt-heading); }
.kt-train__matrix { fill: var(--kt-good); }
.kt-train__adhd { fill: var(--kt-hot); font-weight: 900; }
.kt-train__offline { fill: var(--kt-warn); font-weight: 900; }
.kt-train__word { opacity: 0; transition: opacity 0.12s; }
.kt-train__think.is-bored .kt-train__word.is-bored,
.kt-train__think.is-adhd .kt-train__word.is-adhd,
.kt-train__think.is-organize .kt-train__word.is-organize,
.kt-train__think.is-idea .kt-train__word.is-idea { opacity: 1; transition: opacity 0.2s 0.14s; }
/* the Matrix rain in the head: black like the film (not a theme surface), light green glyphs, white heads */
.kt-train__rainbg { fill: black; }
.kt-train__rain { font: 700 7px var(--font-family-mono); fill: color-mix(in srgb, var(--kt-good) 70%, white); }
.kt-train__rain.is-head { fill: white; }
.kt-train__raincol { animation: kt-train-rain linear infinite; }
.kt-train__raincol.is-body { animation-name: kt-train-bodyrain; }
@keyframes kt-train-bodyrain { from { transform: translateY(200px); } to { transform: translateY(356px); } }
@keyframes kt-train-rain { from { transform: translateY(186px); } to { transform: translateY(304px); } }
@media (prefers-reduced-motion: reduce) { .kt-train__raincol { animation: none; transform: translateY(244px); } .kt-train__raincol.is-body { transform: translateY(300px); } }
.kt-train__person { fill: var(--kt-tint-neutral); stroke: var(--kt-c-primary-soft); stroke-width: 2.5; }
/* one word at a time: the old one fades out before the new one fades in, never text on text */

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
    .kt-train__notebody { animation: none !important; }
}
</style>
