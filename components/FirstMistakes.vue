<script setup lang="ts">
import { computed } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * The first three mistakes, told one after the other. Left: over-structuring. An empty folder tree
 * keeps branching (folders for every someday) and the first note hovers above it, unsure where to
 * go. Middle: holding it all in your head. A strained head with notes swaying around it grows an arm
 * to a vault (the doc stack from LearningFlow), the notes fly into it, the brain lights up, and
 * body, arm and vault take the same tint: the vault is part of you now (Forte Ch. 2 p. 22n, the
 * body map grows to include the tool). Right: overthinking the note. The note types and erases its
 * lines ("is it worth saving?"); then a heart beats on it and sends out ripples, and the note
 * writes itself: keep what resonates, feeling over logic (Forte Ch. 3 p. 44–45). No props
 * but `still`, no numbers. `still` draws the end state with no motion, small (ExpressAssemble embeds it).
 */
const props = defineProps<{ still?: boolean }>()
const { at } = useTimeline(10.2, { enabled: !props.still })

// left: the folder tree
const folder = (x: number, y: number, w: number, h: number) =>
  `M${x} ${y + h} V${y + 4} q0 -4 4 -4 H${x + w * 0.38} l4 5 H${x + w - 4} q4 0 4 4 V${y + h} z`
const rows = [118, 168, 218, 268]
const subs = [0, 1, 2, 3]

// middle: the head, its notes, the vault
const HEAD = { x: 458, y: 156 }
const VAULT = { x: 632, y: 206 }
const notes = [
  { x: -80, y: -26, r: -10 },
  { x: -84, y: 42, r: 8 },
  { x: -40, y: -74, r: 6 },
  { x: 40, y: -76, r: -7 },
  { x: 82, y: -30, r: 9 },
]
const offloaded = computed(() => at(5.0))
const relaxed = computed(() => at(5.9))
const noteStyle = (n: typeof notes[number], i: number) => {
  const moved = offloaded.value
  return {
    transform: moved
      ? `translate(${VAULT.x}px, ${VAULT.y}px) scale(0.5)`
      : `translate(${HEAD.x + n.x}px, ${HEAD.y + n.y}px) rotate(${n.r}deg)`,
    opacity: moved ? 0 : 1,
    transitionDelay: moved ? `${i * 0.12}s` : '0s',
  }
}

// right: the note
const lines = [
  { y: 168, w: 92 },
  { y: 188, w: 76 },
  { y: 208, w: 92 },
  { y: 228, w: 60 },
  { y: 248, w: 84 },
]
const free = computed(() => at(9.2))
</script>

<template>
  <svg class="kt-fm" :class="{ 'is-relaxed': relaxed, 'is-free': free, 'is-still': still }" viewBox="0 0 1040 350" role="img"
    aria-label="Three mistakes. One: an empty folder tree for every someday, built before the first note. Two: a head holding all its notes; it grows an arm to a vault, offloads the notes and lights up with ideas, the vault now part of the body. Three: overthinking the note; the note keeps typing and erasing itself, until a heart beats and the note writes itself: keep what resonates, feeling over logic.">
    <!-- 1 · over-structuring -->
    <g class="kt-fm__part" :class="{ 'is-on': at(0.1) }">
      <text x="12" y="28" class="kt-fm__num">mistake 1</text>
      <text x="12" y="52" class="kt-fm__title">over-structuring</text>
    </g>

    <g class="kt-fm__part" :class="{ 'is-on': at(0.3) }">
      <path :d="folder(12, 72, 52, 36)" class="kt-fm__folder is-root" />
      <text x="76" y="98" class="kt-fm__path">vault/</text>
      <path d="M38 108 V 283" class="kt-fm__branch" />
    </g>

    <g v-for="(y, r) in rows" :key="r">
      <g class="kt-fm__part" :class="{ 'is-on': at(0.5 + r * 0.15) }">
        <path :d="`M38 ${y + 15} H 62`" class="kt-fm__branch" />
        <path :d="folder(62, y, 42, 30)" class="kt-fm__folder" />
        <path :d="`M104 ${y + 15} H 124`" class="kt-fm__branch" />
      </g>
      <g v-for="s in subs" :key="s" class="kt-fm__pop" :class="{ 'is-on': at(0.9 + r * 0.3 + s * 0.08) }">
        <path v-if="s > 0" :d="`M${118 + s * 38} ${y + 15} h 6`" class="kt-fm__branch" />
        <path :d="folder(124 + s * 38, y + 4, 28, 22)" class="kt-fm__folder is-sub" />
      </g>
    </g>

    <!-- the first note: still no idea where it goes -->
    <g class="kt-fm__part" :class="{ 'is-on': at(2.4) }">
      <g class="kt-fm__bob">
        <rect x="282" y="70" width="26" height="32" rx="3" class="kt-fm__ndoc is-first" />
        <path d="M289 80 h12 M289 86 h12 M289 92 h8" class="kt-fm__lines is-first" />
        <circle cx="314" cy="66" r="11" class="kt-fm__q" />
        <text x="314" y="71" text-anchor="middle" class="kt-fm__qtext">?</text>
      </g>
    </g>
    <text x="165" y="330" text-anchor="middle" class="kt-fm__tag is-warn kt-fm__part" :class="{ 'is-on': at(2.8) }">a folder for every someday</text>

    <path d="M340 16 V 334" class="kt-fm__split kt-fm__part" :class="{ 'is-on': at(0.1) }" />

    <!-- 2 · holding it all in your head -->
    <g class="kt-fm__part" :class="{ 'is-on': at(3.1) }">
      <text x="362" y="28" class="kt-fm__num">mistake 2</text>
      <text x="362" y="52" class="kt-fm__title">holding it all in your head</text>
    </g>

    <!-- the arm grows out to the vault: a new limb -->
    <path d="M524 262 C 560 262, 588 236, 612 214" pathLength="1" class="kt-fm__arm is-outline" :class="{ 'is-on': at(4.2) }" />
    <path d="M524 262 C 560 262, 588 236, 612 214" pathLength="1" class="kt-fm__arm" :class="{ 'is-on': at(4.2) }" />

    <!-- the vault -->
    <g class="kt-fm__part" :class="{ 'is-on': at(4.6) }">
      <rect x="590" y="150" width="64" height="80" rx="7" class="kt-fm__doc is-back" />
      <rect x="600" y="158" width="64" height="80" rx="7" class="kt-fm__doc is-back" />
      <rect x="610" y="166" width="64" height="80" rx="7" class="kt-fm__doc is-front" />
      <text x="620" y="190" class="kt-fm__hash">#</text>
      <path d="M636 184 h28 M620 206 h44 M620 220 h36 M620 234 h40" class="kt-fm__lines" />
      <text x="634" y="276" text-anchor="middle" class="kt-fm__name">second brain</text>
    </g>
    <text x="634" y="300" text-anchor="middle" class="kt-fm__tag is-hot kt-fm__part" :class="{ 'is-on': at(6.4) }">a new limb</text>

    <!-- the body: head and shoulders -->
    <g class="kt-fm__part" :class="{ 'is-on': at(3.3) }">
      <path :d="`M${HEAD.x - 74} 306 q0 -78 74 -78 q74 0 74 78z`" class="kt-fm__body" />
      <circle :cx="HEAD.x" :cy="HEAD.y" r="50" class="kt-fm__halo" />
      <circle :cx="HEAD.x" :cy="HEAD.y" r="46" class="kt-fm__head" />
      <g :transform="`translate(${HEAD.x} ${HEAD.y}) scale(0.95)`">
        <g class="kt-fm__strain">
          <path d="M0 -32 c-22 0 -38 14 -38 32 c0 18 16 32 38 32 c22 0 38 -14 38 -32 c0 -18 -16 -32 -38 -32z M0 -28 v56 M-22 -12 c8 4 8 12 0 16 M22 -12 c-8 4 -8 12 0 16" class="kt-fm__brain" />
        </g>
      </g>
    </g>
    <text :x="HEAD.x" y="330" text-anchor="middle" class="kt-fm__state kt-fm__part" :class="{ 'is-on': at(3.3), 'is-gone': relaxed }">holding</text>
    <text :x="HEAD.x" y="330" text-anchor="middle" class="kt-fm__state is-hot" :class="{ 'is-gone': !relaxed }">having ideas</text>

    <!-- the notes it's holding: they sway, then fly to the vault -->
    <g v-for="(n, i) in notes" :key="i" class="kt-fm__note" :class="{ 'is-on': at(3.5 + i * 0.12) }" :style="noteStyle(n, i)">
      <g class="kt-fm__sway" :style="{ animationDelay: `${i * -0.4}s` }">
        <rect x="-13" y="-16" width="26" height="32" rx="3" class="kt-fm__ndoc" />
        <path d="M-6 -6 h12 M-6 0 h12 M-6 6 h8" class="kt-fm__lines" />
      </g>
    </g>

    <!-- the spark: an idea -->
    <g class="kt-fm__spark" :class="{ 'is-on': at(6.1) }">
      <path :d="`M${HEAD.x + 52} ${HEAD.y - 92} l6 14 14 6 -14 6 -6 14 -6 -14 -14 -6 14 -6z`" class="kt-fm__star" />
      <path :d="`M${HEAD.x + 80} ${HEAD.y - 54} l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z`" class="kt-fm__star is-small" />
    </g>

    <path d="M694 16 V 334" class="kt-fm__split kt-fm__part" :class="{ 'is-on': at(0.1) }" />

    <!-- 3 · overthinking the note -->
    <g class="kt-fm__part" :class="{ 'is-on': at(7.0) }">
      <text x="716" y="28" class="kt-fm__num">mistake 3</text>
      <text x="716" y="52" class="kt-fm__title">overthinking the note</text>
    </g>

    <!-- the note: typing and erasing, then written -->
    <g class="kt-fm__part" :class="{ 'is-on': at(7.4) }">
      <rect x="814" y="122" width="128" height="156" rx="8" class="kt-fm__card" />
      <text x="830" y="148" class="kt-fm__path">note.md</text>
      <path v-for="(l, i) in lines" :key="i" :d="`M830 ${l.y} h${l.w}`" pathLength="1" class="kt-fm__type"
        :style="{ animationDelay: `${i * 0.22}s` }" />
    </g>
    <text x="878" y="104" text-anchor="middle" class="kt-fm__doubt" :class="{ 'is-on': at(8.1) && !free }">is it worth saving?</text>

    <!-- keep what resonates: a heartbeat and its ripples -->
    <circle v-for="r in 2" :key="r" cx="940" cy="124" r="14" class="kt-fm__ripple" :class="{ 'is-on': at(9.5) }" :style="{ animationDelay: `${(r - 1) * 0.6}s` }" />
    <path d="M940 135 c-10 -7 -14 -12 -14 -17 a6 6 0 0 1 14 -2 a6 6 0 0 1 14 2 c0 5 -4 10 -14 17z" class="kt-fm__heart" :class="{ 'is-on': at(9.5) }" />

    <text x="878" y="314" text-anchor="middle" class="kt-fm__state kt-fm__part" :class="{ 'is-on': at(8.1), 'is-gone': free }">overthinking</text>
    <text x="878" y="314" text-anchor="middle" class="kt-fm__state is-hot" :class="{ 'is-gone': !free }">keep what resonates</text>
    <text x="878" y="338" text-anchor="middle" class="kt-fm__tag is-hot kt-fm__part" :class="{ 'is-on': at(9.8) }">feeling over logic</text>
  </svg>
</template>

<style>
.kt-fm {
  width: 880px;
  height: auto;
  font-family: var(--font-family-sans);
}

/* still: the end state, no motion, as wide as its container */
.kt-fm.is-still { width: 100%; }
.kt-fm.is-still * { animation: none !important; transition: none !important; }

.kt-fm__part {
  opacity: 0;
  transition: opacity 0.45s;
}

.kt-fm__part.is-on { opacity: 1; }

.kt-fm__pop {
  opacity: 0;
  transform-box: fill-box;
  transform-origin: left center;
  transform: scale(0.4);
  transition: opacity 0.2s, transform 0.25s cubic-bezier(0.3, 1.6, 0.5, 1);
}

.kt-fm__pop.is-on { opacity: 1; transform: none; }

.kt-fm__num { font: 600 14px var(--font-family-mono); fill: var(--kt-warn); letter-spacing: 0.06em; }
.kt-fm__title { font-size: 21px; font-weight: 700; fill: var(--kt-heading); }
.kt-fm__tag { font: 15px var(--font-family-mono); fill: var(--kt-subtle); }
.kt-fm__tag.is-warn { fill: var(--kt-warn); }
.kt-fm__tag.is-hot { fill: var(--kt-hot); }
.kt-fm__path { font: 15px var(--font-family-mono); fill: var(--kt-subtle); }
.kt-fm__name { font-size: 18px; font-weight: 700; fill: var(--kt-heading); }

.kt-fm__split { stroke: var(--kt-line); stroke-width: 2; stroke-dasharray: 4 8; }

/* the tree: every folder empty */
.kt-fm__branch { fill: none; stroke: var(--kt-line-strong); stroke-width: 2; }
.kt-fm__folder {
  fill: none;
  stroke: var(--kt-line-strong);
  stroke-width: 2;
  stroke-dasharray: 5 4;
  stroke-linejoin: round;
}
.kt-fm__folder.is-root { fill: var(--kt-tint-neutral); stroke-dasharray: none; }
.kt-fm__folder.is-sub { stroke-width: 1.6; stroke-dasharray: 4 3; }

.kt-fm__bob { animation: kt-fm-bob 2s ease-in-out infinite; }

@keyframes kt-fm-bob {
  50% { transform: translateY(-6px); }
}

.kt-fm__q { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); stroke-width: 2; }
.kt-fm__qtext { font-size: 15px; font-weight: 800; fill: var(--kt-hot); }

.kt-fm__ndoc { fill: var(--kt-card); stroke: var(--kt-warn); stroke-width: 1.8; }
.kt-fm__ndoc.is-first { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); }
.kt-fm__lines { stroke: var(--kt-subtle); stroke-width: 3; stroke-linecap: round; }
.kt-fm__lines.is-first { stroke: var(--kt-hot); }

/* the body, the arm and the vault: neutral, then one tint when the vault becomes part of you */
.kt-fm__body,
.kt-fm__head {
  fill: var(--kt-tint-neutral);
  stroke: var(--kt-line-strong);
  stroke-width: 2.4;
  transition: fill 0.6s, stroke 0.6s;
}

.kt-fm.is-relaxed .kt-fm__body,
.kt-fm.is-relaxed .kt-fm__head { fill: var(--kt-tint-primary); stroke: var(--kt-c-primary-soft); }

.kt-fm__arm {
  fill: none;
  stroke: var(--kt-tint-neutral);
  stroke-width: 14;
  stroke-linecap: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  transition: stroke-dashoffset 0.6s ease-out, stroke 0.6s;
}

.kt-fm__arm.is-outline { stroke: var(--kt-line-strong); stroke-width: 19; }
.kt-fm__arm.is-on { stroke-dashoffset: 0; }
.kt-fm.is-relaxed .kt-fm__arm { stroke: var(--kt-tint-primary); }
.kt-fm.is-relaxed .kt-fm__arm.is-outline { stroke: var(--kt-c-primary-soft); }

.kt-fm__doc { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 2; transition: fill 0.6s, stroke 0.6s; }
.kt-fm__doc.is-back { opacity: 0.5; }
.kt-fm.is-relaxed .kt-fm__doc.is-front { fill: var(--kt-tint-primary); stroke: var(--kt-c-primary-soft); }
.kt-fm__hash { font: 700 17px var(--font-family-mono); fill: var(--kt-c-primary-soft); }

/* the brain: strained (warn), then relaxed and lit */
.kt-fm__brain {
  fill: var(--kt-tint-warning);
  stroke: var(--kt-warn);
  stroke-width: 2.4;
  stroke-linecap: round;
  transition: fill 0.6s, stroke 0.6s;
}

.kt-fm.is-relaxed .kt-fm__brain { fill: var(--kt-tint-primary); stroke: var(--kt-c-primary-soft); }

.kt-fm__strain { animation: kt-fm-strain 2.2s ease-in-out infinite; }
.kt-fm.is-relaxed .kt-fm__strain { animation: none; }

@keyframes kt-fm-strain {
  50% { transform: scale(1.05); }
}

.kt-fm__halo {
  fill: var(--kt-c-primary);
  opacity: 0;
  transition: opacity 0.6s;
  transform-box: fill-box;
  transform-origin: center;
}

.kt-fm.is-relaxed .kt-fm__halo { opacity: 0.18; animation: kt-fm-pulse 2.4s ease-in-out infinite; }

@keyframes kt-fm-pulse {
  50% { opacity: 0.36; transform: scale(1.12); }
}

.kt-fm__state {
  font: 600 16px var(--font-family-mono);
  fill: var(--kt-warn);
  transition: opacity 0.45s;
}

.kt-fm__state.is-hot { fill: var(--kt-hot); }
.kt-fm__state.is-gone { opacity: 0; }

.kt-fm__note {
  opacity: 0;
  transition: transform 0.7s ease-in-out, opacity 0.45s;
}

.kt-fm__note:not(.is-on) { opacity: 0 !important; }

.kt-fm__sway { animation: kt-fm-sway 2.4s ease-in-out infinite; }

@keyframes kt-fm-sway {
  0%, 100% { transform: translate(0, 0) rotate(0); }
  50% { transform: translate(0, -5px) rotate(4deg); }
}

.kt-fm__spark {
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
  transform: scale(0.4);
  transition: opacity 0.35s, transform 0.45s cubic-bezier(0.3, 1.6, 0.5, 1);
}

.kt-fm__spark.is-on { opacity: 1; transform: none; }
.kt-fm__star { fill: var(--kt-hot); }
.kt-fm__star.is-small { opacity: 0.7; }

/* 3 · the note */
.kt-fm__card { fill: var(--kt-card); stroke: var(--kt-warn); stroke-width: 2; transition: fill 0.6s, stroke 0.6s; }
.kt-fm.is-free .kt-fm__card { fill: var(--kt-tint-primary); stroke: var(--kt-c-primary-soft); }

/* each line types itself and gets erased again, until the note is for you */
.kt-fm__type {
  fill: none;
  stroke: var(--kt-warn);
  stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: kt-fm-retype 1.8s ease-in-out infinite;
  transition: stroke 0.5s;
}

.kt-fm.is-free .kt-fm__type { animation: none; stroke-dashoffset: 0; stroke: var(--kt-c-primary-soft); }

@keyframes kt-fm-retype {
  0% { stroke-dashoffset: 1; }
  40%, 60% { stroke-dashoffset: 0.3; }
  100% { stroke-dashoffset: 1; }
}

.kt-fm__doubt {
  font: 600 15px var(--font-family-mono);
  fill: var(--kt-warn);
  opacity: 0;
  transition: opacity 0.4s;
}

.kt-fm__doubt.is-on { opacity: 1; animation: kt-fm-jitter 0.5s steps(2) infinite; }

@keyframes kt-fm-jitter {
  50% { transform: translateX(2px); }
}

.kt-fm__heart {
  fill: var(--kt-hot);
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
  transition: opacity 0.35s;
}

.kt-fm__heart.is-on { opacity: 1; animation: kt-fm-beat 1.2s ease-in-out infinite; }

@keyframes kt-fm-beat {
  0%, 40%, 100% { transform: scale(1); }
  15% { transform: scale(1.25); }
  28% { transform: scale(1.1); }
}

.kt-fm__ripple {
  fill: none;
  stroke: var(--kt-hot);
  stroke-width: 2;
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
}

.kt-fm__ripple.is-on { animation: kt-fm-ripple 1.2s ease-out infinite; }

@keyframes kt-fm-ripple {
  0% { opacity: 0.7; transform: scale(1); }
  100% { opacity: 0; transform: scale(2.6); }
}
</style>
