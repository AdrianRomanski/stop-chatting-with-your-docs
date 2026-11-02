<script setup lang="ts">
import { computed } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * The library way of filing (Forte, Ch. 3, p. 45 and Ch. 5, p. 86): a shelf in three bays with
 * Dewey call numbers. A fresh note (the same quote NoteTrace follows) is filed by topic under
 * 150 Psychology, onto a stack of dusty notes, and fades in with them. The question that matters,
 * "where will I use it?", stays unanswered. Sets up the PARA slide. No props.
 */
const { at } = useTimeline(4.4)
const bays = [
  { x: 30, num: '005', name: 'Programming' },
  { x: 310, num: '150', name: 'Psychology', target: true },
  { x: 590, num: '658', name: 'Management' },
]
// spines: offset from the bay's left edge, width, height
const spines = [
  [[24, 26, 112], [52, 20, 96], [74, 30, 120], [106, 22, 104], [130, 28, 116], [160, 18, 92], [180, 26, 110], [208, 30, 118]],
  [[24, 24, 108], [50, 30, 118], [82, 20, 98], [104, 26, 112]],
  [[24, 30, 116], [56, 22, 100], [80, 26, 112], [108, 20, 94], [130, 30, 120], [162, 24, 106], [188, 28, 114], [218, 18, 96]],
]
// the dusty notes on the Psychology shelf, bottom-up
const dusty = [0, 1, 2, 3, 4, 5]
const filed = computed(() => at(2.2))
const faded = computed(() => at(3.1))
</script>

<template>
  <svg class="kt-dewey" viewBox="0 0 880 340" role="img"
    aria-label="A library shelf sorted by Dewey call numbers. A new note is filed under 150 Psychology among dusty notes and fades. Where will I use it? stays unanswered.">
    <!-- the bays -->
    <g v-for="(b, i) in bays" :key="b.num" class="kt-dewey__part" :class="{ 'is-on': at(0.1 + i * 0.2) }">
      <rect :x="b.x" y="112" width="260" height="194" rx="10" class="kt-dewey__bay" :class="{ 'is-target': b.target && filed && !faded }" />
      <rect :x="b.x + 18" y="126" width="224" height="34" rx="6" class="kt-dewey__plate" />
      <text :x="b.x + 34" y="149" class="kt-dewey__num">{{ b.num }}</text>
      <text :x="b.x + 80" y="149" class="kt-dewey__name">{{ b.name }}</text>
      <rect v-for="(s, j) in spines[i]" :key="j" :x="b.x + s[0]" :y="296 - s[2]" :width="s[1]" :height="s[2]" rx="3" class="kt-dewey__spine" />
      <path :d="`M${b.x - 4} 299 H ${b.x + 264}`" class="kt-dewey__board" />
    </g>

    <!-- the dusty notes on the Psychology shelf -->
    <g class="kt-dewey__part" :class="{ 'is-on': at(0.7) }">
      <rect v-for="d in dusty" :key="d" :x="452 + (d % 2) * 6" :y="284 - d * 11" width="96" height="10" rx="2" class="kt-dewey__sheet" />
      <circle v-for="k in 5" :key="k" :cx="456 + k * 16" :cy="206 - (k % 3) * 8" r="1.8" class="kt-dewey__dust" :style="{ animationDelay: `${k * -0.5}s` }" />
    </g>

    <!-- the fresh note, then filed by topic -->
    <g class="kt-dewey__note" :class="{ 'is-on': at(1.2), 'is-filed': filed, 'is-faded': faded }">
      <rect x="0" y="0" width="300" height="88" rx="10" class="kt-dewey__card" />
      <text x="18" y="26" class="kt-dewey__file">note.md · new</text>
      <text x="18" y="52" class="kt-dewey__quote">“Perfectionism is procrastination</text>
      <text x="18" y="74" class="kt-dewey__quote">in a tuxedo.”</text>
    </g>
    <text x="440" y="334" text-anchor="middle" class="kt-dewey__tag kt-dewey__part" :class="{ 'is-on': at(2.9) }">filed by topic</text>

    <!-- the question that matters, unanswered -->
    <g class="kt-dewey__part" :class="{ 'is-on': at(3.4) }">
      <path d="M598 62 C 572 96, 584 160, 552 200" class="kt-dewey__probe" />
      <rect x="590" y="30" width="260" height="48" rx="24" class="kt-dewey__ask" />
      <circle cx="618" cy="54" r="14" class="kt-dewey__q" />
      <text x="618" y="60" text-anchor="middle" class="kt-dewey__qtext">?</text>
      <text x="642" y="60" class="kt-dewey__asktext">where will I use it?</text>
    </g>
  </svg>
</template>

<style>
.kt-dewey {
  width: 880px;
  height: auto;
  font-family: var(--font-family-sans);
}

.kt-dewey__part {
  opacity: 0;
  transition: opacity 0.45s;
}

.kt-dewey__part.is-on { opacity: 1; }

.kt-dewey__bay {
  fill: var(--kt-tint-neutral);
  stroke: var(--kt-line-strong);
  stroke-width: 2;
  transition: stroke 0.4s;
}

.kt-dewey__bay.is-target { stroke: var(--kt-hot); }

.kt-dewey__plate { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 1.5; }
.kt-dewey__num { font: 700 16px var(--font-family-mono); fill: var(--kt-hot); }
.kt-dewey__name { font-size: 17px; font-weight: 700; fill: var(--kt-heading); }

.kt-dewey__spine { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 1.5; }
.kt-dewey__board { stroke: var(--kt-line-strong); stroke-width: 5; stroke-linecap: round; }

.kt-dewey__sheet { fill: var(--kt-tint-neutral); stroke: var(--kt-line); stroke-width: 1.5; }
.kt-dewey__dust { fill: var(--kt-subtle); opacity: 0.5; animation: kt-dewey-dust 3s ease-in-out infinite; }

@keyframes kt-dewey-dust {
  50% { transform: translateY(-6px); opacity: 0.15; }
}

/* the note: top left, then dropped onto the dusty stack, then faded with it */
.kt-dewey__note {
  opacity: 0;
  transform: translate(30px, 10px);
  transition: opacity 0.6s, transform 0.9s ease-in-out;
}

.kt-dewey__note.is-on { opacity: 1; }
.kt-dewey__note.is-filed { transform: translate(450px, 195px) scale(0.36); }
.kt-dewey__note.is-faded { opacity: 0.35; }
/* once filed on the shelf the note is a thumbnail: its text goes, the card stays */
.kt-dewey__note text { transition: opacity 0.4s; }
.kt-dewey__note.is-filed text { opacity: 0; }

.kt-dewey__card { fill: var(--kt-tint-primary); stroke: var(--kt-c-primary); stroke-width: 2.5; transition: fill 0.6s, stroke 0.6s; }
.kt-dewey__note.is-faded .kt-dewey__card { fill: var(--kt-tint-neutral); stroke: var(--kt-line-strong); }
.kt-dewey__file { font: 13px var(--font-family-mono); fill: var(--kt-subtle); }
.kt-dewey__quote { font-size: 17px; font-weight: 600; fill: var(--kt-heading); }

.kt-dewey__tag { font: 14px var(--font-family-mono); fill: var(--kt-subtle); }

.kt-dewey__probe {
  fill: none;
  stroke: var(--kt-hot);
  stroke-width: 2;
  stroke-dasharray: 3 6;
  stroke-linecap: round;
}

.kt-dewey__ask { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); stroke-width: 1.5; }
.kt-dewey__q { fill: var(--kt-bg); stroke: var(--kt-hot); stroke-width: 2; animation: kt-dewey-q 2.4s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.kt-dewey__qtext { font-size: 17px; font-weight: 800; fill: var(--kt-hot); }
.kt-dewey__asktext { font-size: 17px; font-weight: 600; fill: var(--kt-heading); }

@keyframes kt-dewey-q {
  50% { transform: scale(1.15); }
}
</style>
