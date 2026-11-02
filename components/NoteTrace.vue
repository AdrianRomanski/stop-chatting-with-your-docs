<script setup lang="ts">
import { computed } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * One note through CODE and PARA, as four stations left to right. Each station shows the step,
 * the folder path the note lives in, and the note's state: the raw quote in the inbox, filed into
 * a project folder, distilled to bold rules, shipped as a kickoff doc and archived. The station
 * the trace has reached is outlined in the hot color. No props.
 */
const { at } = useTimeline(4.5)
const stations = [
  { c: 110, n: '1', step: 'Capture', path: '/Inbox', cap: "don't break the flow" },
  { c: 330, n: '2', step: 'Organize', path: '/Projects/MVP-Launch', cap: 'where will I use it?' },
  { c: 550, n: '3', step: 'Distill', path: '/Projects/MVP-Launch', cap: 'bold the essence' },
  { c: 770, n: '4', step: 'Express', path: '/Archives/MVP-Launch', cap: 'ship, then archive' },
]
const shownAt = (i: number) => 0.3 + i * 1
const current = computed(() => stations.reduce((acc, _, i) => (at(shownAt(i)) ? i : acc), -1))
</script>

<template>
  <svg class="kt-ntrace" viewBox="0 0 880 290" role="img"
    aria-label="A note captured to the inbox, filed into a project, distilled to bold rules, shipped and archived">
    <g v-for="(s, i) in stations" :key="s.n" class="kt-ntrace__part" :class="{ 'is-on': at(shownAt(i)) }">
      <text :x="s.c" y="22" text-anchor="middle" class="kt-ntrace__step"><tspan class="kt-ntrace__num">{{ s.n }}</tspan> {{ s.step }}</text>
      <rect :x="s.c - 88" y="36" width="176" height="28" rx="14" class="kt-ntrace__chip" />
      <text :x="s.c" y="55" text-anchor="middle" class="kt-ntrace__path">{{ s.path }}</text>
      <rect :x="s.c - 90" y="80" width="180" height="150" rx="12" class="kt-ntrace__card" :class="{ 'is-current': current === i }" />
      <text :x="s.c" y="270" text-anchor="middle" class="kt-ntrace__cap">{{ s.cap }}</text>
      <path v-if="i > 0" :d="`M${s.c - 128} 155 h30 m-8 -7 l8 7 -8 7`" class="kt-ntrace__arrow" />
    </g>

    <!-- 1 · the raw quote -->
    <g class="kt-ntrace__part" :class="{ 'is-on': at(shownAt(0)) }">
      <text x="38" y="104" class="kt-ntrace__file">note.md</text>
      <text x="38" y="138" class="kt-ntrace__raw">“Perfectionism is</text>
      <text x="38" y="162" class="kt-ntrace__raw">procrastination</text>
      <text x="38" y="186" class="kt-ntrace__raw">in a tuxedo.”</text>
    </g>

    <!-- 2 · filed into the project -->
    <g class="kt-ntrace__part" :class="{ 'is-on': at(shownAt(1)) }">
      <path d="M270 112 h36 l10 12 h74 v80 h-120z" class="kt-ntrace__fold" />
      <rect x="312" y="138" width="36" height="46" rx="4" class="kt-ntrace__doc" />
      <path d="M320 150 h20 M320 160 h20 M320 170 h14" class="kt-ntrace__lines" />
    </g>

    <!-- 3 · distilled to bold rules -->
    <g class="kt-ntrace__part" :class="{ 'is-on': at(shownAt(2)) }">
      <text x="478" y="104" class="kt-ntrace__file">note.md</text>
      <text x="478" y="134" class="kt-ntrace__bold">Perfectionism =</text>
      <text x="478" y="158" class="kt-ntrace__bold is-hot">procrastination</text>
      <text x="478" y="190" class="kt-ntrace__bold">momentum &gt;</text>
      <text x="478" y="214" class="kt-ntrace__bold is-hot">architecture</text>
    </g>

    <!-- 4 · shipped from three notes, then archived -->
    <g class="kt-ntrace__part" :class="{ 'is-on': at(shownAt(3)) }">
      <rect x="696" y="112" width="30" height="38" rx="3" class="kt-ntrace__doc is-small" />
      <rect x="704" y="126" width="30" height="38" rx="3" class="kt-ntrace__doc is-small" />
      <rect x="712" y="140" width="30" height="38" rx="3" class="kt-ntrace__doc" />
      <path d="M752 146 h18 m-7 -6 l7 6 -7 6" class="kt-ntrace__arrow is-in" />
      <rect x="780" y="112" width="58" height="76" rx="5" class="kt-ntrace__doc is-out" />
      <path d="M794 152 l9 10 18 -22" class="kt-ntrace__check" />
      <text x="770" y="216" text-anchor="middle" class="kt-ntrace__file">kickoff.md</text>
    </g>
  </svg>
</template>

<style>
.kt-ntrace {
  width: 880px;
  height: auto;
  font-family: var(--font-family-sans);
}

.kt-ntrace__part {
  opacity: 0;
  transition: opacity 0.45s;
}

.kt-ntrace__part.is-on { opacity: 1; }

.kt-ntrace__step { font-size: 19px; font-weight: 800; fill: var(--kt-heading); }
.kt-ntrace__num { fill: var(--kt-hot); }

.kt-ntrace__chip { fill: var(--kt-tint-neutral); stroke: var(--kt-line-strong); stroke-width: 1.5; }
.kt-ntrace__path { font: 13px var(--font-family-mono); fill: var(--kt-fg); }

.kt-ntrace__card {
  fill: var(--kt-card);
  stroke: var(--kt-line-strong);
  stroke-width: 2;
  transition: stroke 0.4s;
}

.kt-ntrace__card.is-current { stroke: var(--kt-hot); stroke-width: 2.5; }

.kt-ntrace__cap { font: 13px var(--font-family-mono); fill: var(--kt-subtle); }

.kt-ntrace__arrow {
  fill: none;
  stroke: var(--kt-c-primary-soft);
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.kt-ntrace__file { font: 12px var(--font-family-mono); fill: var(--kt-subtle); }
.kt-ntrace__raw { font-size: 16px; fill: var(--kt-fg); }
.kt-ntrace__bold { font-size: 16px; font-weight: 800; fill: var(--kt-heading); }
.kt-ntrace__bold.is-hot { fill: var(--kt-hot); }

.kt-ntrace__fold { fill: var(--kt-tint-primary); stroke: var(--kt-c-primary); stroke-width: 2; stroke-linejoin: round; }
.kt-ntrace__doc { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 1.5; }
.kt-ntrace__doc.is-small { opacity: 0.6; }
.kt-ntrace__doc.is-out { fill: var(--kt-tint-primary); stroke: var(--kt-c-primary); stroke-width: 2; }
.kt-ntrace__lines { stroke: var(--kt-subtle); stroke-width: 2.5; stroke-linecap: round; }

.kt-ntrace__check {
  fill: none;
  stroke: var(--kt-good);
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
