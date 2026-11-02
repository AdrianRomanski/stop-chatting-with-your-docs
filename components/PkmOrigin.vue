<script setup lang="ts">
import { useId } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * Where personal knowledge management began (Forte, Introduction, p. 2n): a student at an
 * Internet-connected library terminal, documents pouring out of the screen onto a pile that keeps
 * growing. The one note that matters (outlined hot) lands early and gets buried. Then a search for
 * it comes back with no match: Forte's discoverability paradox (Ch. 6), more notes, less findable.
 * Docs are drawn as in LearningFlow, the brain-free cousin of the vault. No props, no numbers.
 */
const { at } = useTimeline(4.6)
const uid = useId()
const wire = `kt-pkm-wire-${uid}`
// the pile, bottom-up: the key note is the second one, so everything after it covers it
const pile = [
  { x: 392, y: 236, r: -6 },
  { x: 430, y: 226, r: 5, key: true },
  { x: 404, y: 212, r: 9 },
  { x: 446, y: 200, r: -8 },
  { x: 398, y: 186, r: -3 },
  { x: 434, y: 172, r: 7 },
  { x: 410, y: 158, r: -10 },
  { x: 442, y: 144, r: 4 },
  { x: 402, y: 130, r: 8 },
  { x: 428, y: 116, r: -5 },
  { x: 414, y: 102, r: 2 },
]
const flyers = [0, 1, 2]
</script>

<template>
  <svg class="kt-pkm" viewBox="0 0 880 340" role="img"
    aria-label="A 1990s student at an Internet-connected library: documents pour in and pile up; a search for the one note that matters finds no match. More notes, less findable.">
    <!-- the library terminal, online -->
    <g class="kt-pkm__part" :class="{ 'is-on': at(0.1) }">
      <rect x="40" y="34" width="200" height="156" rx="16" class="kt-pkm__crt" />
      <rect x="58" y="50" width="164" height="114" rx="10" class="kt-pkm__screen" />
      <circle cx="140" cy="107" r="36" class="kt-pkm__globe" />
      <ellipse cx="140" cy="107" rx="15" ry="36" class="kt-pkm__globe" />
      <path d="M104 107 h72 M110 89 h60 M110 125 h60" class="kt-pkm__globe" />
      <path d="M112 190 h56 l12 20 h-80z" class="kt-pkm__stand" />
      <rect x="62" y="218" width="156" height="16" rx="5" class="kt-pkm__stand" />
      <path d="M78 226 h124" class="kt-pkm__keys" />
    </g>

    <!-- the student, seen from behind -->
    <g class="kt-pkm__part" :class="{ 'is-on': at(0.3) }">
      <circle cx="140" cy="262" r="17" class="kt-pkm__student" />
      <path d="M96 312 q0 -32 44 -32 q44 0 44 32z" class="kt-pkm__student" />
    </g>
    <text x="140" y="334" text-anchor="middle" class="kt-pkm__tag kt-pkm__part" :class="{ 'is-on': at(0.3) }">the library, online</text>

    <!-- documents pouring out of the screen -->
    <path :id="wire" d="M228 96 C 300 70, 360 64, 424 96" class="kt-pkm__wire" :class="{ 'is-on': at(0.5) }" />
    <g v-for="f in flyers" :key="f" class="kt-pkm__flyer" :class="{ 'is-on': at(0.6 + f * 0.2) && !at(3.2) }">
      <rect x="-11" y="-14" width="22" height="28" rx="3" class="kt-pkm__fdoc" />
      <path d="M-5 -5 h10 M-5 1 h10 M-5 7 h6" class="kt-pkm__lines" />
      <animateMotion dur="1.8s" :begin="`${f * 0.6}s`" repeatCount="indefinite">
        <mpath :href="`#${wire}`" />
      </animateMotion>
    </g>

    <!-- the pile grows; the note that matters gets buried -->
    <g v-for="(d, i) in pile" :key="i" class="kt-pkm__drop" :class="{ 'is-on': at(0.7 + i * 0.22) }">
      <g :transform="`translate(${d.x + 27} ${d.y + 34}) rotate(${d.r})`">
        <rect x="-27" y="-34" width="54" height="68" rx="5" class="kt-pkm__under" />
        <rect x="-27" y="-34" width="54" height="68" rx="5" class="kt-pkm__doc" :class="{ 'is-key': d.key }" />
        <path d="M-15 -16 h30 M-15 -6 h30 M-15 4 h22" class="kt-pkm__lines" :class="{ 'is-key': d.key }" />
      </g>
    </g>
    <path d="M360 304 H 520" class="kt-pkm__ground kt-pkm__part" :class="{ 'is-on': at(0.7) }" />
    <text x="440" y="334" text-anchor="middle" class="kt-pkm__tag kt-pkm__part" :class="{ 'is-on': at(1.6) }">more notes</text>

    <!-- a search for the one that matters -->
    <g class="kt-pkm__part" :class="{ 'is-on': at(3.0) }">
      <rect x="600" y="88" width="250" height="50" rx="25" class="kt-pkm__search" />
      <circle cx="628" cy="110" r="8" class="kt-pkm__glass" />
      <path d="M634 116 l7 7" class="kt-pkm__glass" />
      <text x="652" y="119" class="kt-pkm__query">that one note</text>
      <rect x="789" y="100" width="2.5" height="20" class="kt-pkm__caret" />
    </g>
    <g class="kt-pkm__part" :class="{ 'is-on': at(3.4) }">
      <rect x="600" y="152" width="250" height="104" rx="12" class="kt-pkm__results" />
      <path d="M622 178 h150 M622 204 h120 M622 230 h136" class="kt-pkm__noise" />
    </g>
    <g class="kt-pkm__stamp" :class="{ 'is-on': at(3.7) }">
      <g transform="translate(725 204) rotate(-6)">
        <rect x="-68" y="-18" width="136" height="36" rx="6" class="kt-pkm__stampbox" />
        <text y="7" text-anchor="middle" class="kt-pkm__stamptext">no match</text>
      </g>
    </g>

    <!-- it's in there, somewhere -->
    <g class="kt-pkm__part" :class="{ 'is-on': at(3.9) }">
      <path d="M600 236 C 560 260, 530 266, 498 262" class="kt-pkm__probe" />
      <circle cx="484" cy="262" r="15" class="kt-pkm__q" />
      <text x="484" y="268" text-anchor="middle" class="kt-pkm__qtext">?</text>
    </g>
    <text x="725" y="334" text-anchor="middle" class="kt-pkm__tag is-hot kt-pkm__part" :class="{ 'is-on': at(4.1) }">less findable</text>
  </svg>
</template>

<style>
.kt-pkm {
  width: 880px;
  height: auto;
  font-family: var(--font-family-sans);
}

.kt-pkm__part,
.kt-pkm__flyer,
.kt-pkm__wire {
  opacity: 0;
  transition: opacity 0.45s;
}

.kt-pkm__part.is-on,
.kt-pkm__flyer.is-on { opacity: 1; }

.kt-pkm__drop {
  opacity: 0;
  transform: translateY(-26px);
  transition: opacity 0.3s, transform 0.35s ease-in;
}

.kt-pkm__drop.is-on { opacity: 1; transform: none; }

.kt-pkm__crt { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 2.5; }
.kt-pkm__screen { fill: var(--kt-tint-primary); stroke: var(--kt-c-primary); stroke-width: 2.5; }
.kt-pkm__globe { fill: none; stroke: var(--kt-c-primary-soft); stroke-width: 2; }
.kt-pkm__stand { fill: var(--kt-tint-neutral); stroke: var(--kt-line-strong); stroke-width: 2; stroke-linejoin: round; }
.kt-pkm__keys { stroke: var(--kt-line-strong); stroke-width: 3; stroke-dasharray: 6 5; }
.kt-pkm__student { fill: var(--kt-tint-neutral); stroke: var(--kt-line-strong); stroke-width: 2.4; }

.kt-pkm__tag { font: 14px var(--font-family-mono); fill: var(--kt-subtle); }
.kt-pkm__tag.is-hot { fill: var(--kt-hot); }

.kt-pkm__wire {
  fill: none;
  stroke: var(--kt-c-primary-soft);
  stroke-width: 2.5;
  stroke-dasharray: 6 7;
}

.kt-pkm__wire.is-on {
  opacity: 1;
  animation: kt-pkm-flow 1s linear infinite;
}

@keyframes kt-pkm-flow {
  to { stroke-dashoffset: -26; }
}

.kt-pkm__fdoc { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 1.5; }

.kt-pkm__under { fill: var(--kt-bg); }
.kt-pkm__doc { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 2; }
.kt-pkm__doc.is-key { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); stroke-width: 2.5; }
.kt-pkm__lines { stroke: var(--kt-subtle); stroke-width: 3; stroke-linecap: round; }
.kt-pkm__lines.is-key { stroke: var(--kt-hot); }
.kt-pkm__ground { stroke: var(--kt-line-strong); stroke-width: 2.5; stroke-linecap: round; }

.kt-pkm__search { fill: var(--kt-card); stroke: var(--kt-c-primary-soft); stroke-width: 2; }
.kt-pkm__glass { fill: none; stroke: var(--kt-c-primary-soft); stroke-width: 2.5; stroke-linecap: round; }
.kt-pkm__query { font: 16px var(--font-family-mono); fill: var(--kt-fg); }
.kt-pkm__caret { fill: var(--kt-c-primary-soft); animation: kt-pkm-blink 1.2s steps(1) infinite; }

@keyframes kt-pkm-blink {
  50% { opacity: 0; }
}

.kt-pkm__results { fill: var(--kt-card); stroke: var(--kt-line); stroke-width: 2; }
.kt-pkm__noise { stroke: var(--kt-line-strong); stroke-width: 6; stroke-linecap: round; }

.kt-pkm__stamp {
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
  transform: scale(1.6);
  transition: opacity 0.25s, transform 0.25s ease-in;
}

.kt-pkm__stamp.is-on { opacity: 1; transform: none; }
.kt-pkm__stampbox { fill: var(--kt-bg); stroke: var(--kt-bad); stroke-width: 3; }
.kt-pkm__stamptext { font: 800 18px var(--font-family-mono); fill: var(--kt-bad); letter-spacing: 0.08em; }

.kt-pkm__probe {
  fill: none;
  stroke: var(--kt-hot);
  stroke-width: 2;
  stroke-dasharray: 3 6;
  stroke-linecap: round;
}

.kt-pkm__q { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); stroke-width: 2; }
.kt-pkm__qtext { font-size: 18px; font-weight: 800; fill: var(--kt-hot); }
</style>
