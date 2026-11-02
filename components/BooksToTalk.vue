<script setup lang="ts">
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * The whole pipeline behind this talk, from what I read to what you just saw. Top: the five books
 * land one by one (Building a Second Brain, Make It Stick, Richard Feynman's Mental Models, The
 * Socratic Method, Tomorrowmind), each with one line on what it gave the talk. Their lines run together into one pipeline: notes → distill →
 * concepts → this talk, each step lighting up in turn; "this talk" glows last. No props, no numbers.
 */
const { at } = useTimeline(5)

const books = [
  { src: '/images/books/building-a-second-brain.webp', alt: 'Building a Second Brain, Tiago Forte', r: -4, gave: 'notes as a resource' },
  { src: '/images/books/make-it-stick.jpg', alt: 'Make It Stick, Brown, Roediger, McDaniel', r: 3, gave: 'recall beats rereading' },
  { src: '/images/books/richard-feynmans-mental-models.jpg', alt: 'Richard Feynman’s Mental Models, Peter Hollins', r: -2, gave: 'explain it plainly' },
  { src: '/images/books/the-socratic-method.jpg', alt: 'The Socratic Method, Ward Farnsworth', r: 4, gave: 'claim, why, counter' },
  { src: '/images/books/tomorrowmind.webp', alt: 'Tomorrowmind, Kellerman and Seligman', r: -3, gave: 'resilience, not offloading' },
]
// x of each cover's centre in the 880-wide stage
const bx = books.map((_, i) => 120 + i * 160)

const steps = [
  { name: 'notes', does: 'highlights in Obsidian', icon: 'pen' },
  { name: 'distill', does: 'bold · highlight · summary', icon: 'filter' },
  { name: 'concepts', does: 'one idea, in my words', icon: 'bulb' },
  { name: 'this talk', does: 'built from the concepts', icon: 'talk' },
]
</script>

<template>
  <div class="kt-b2t" role="img"
    aria-label="Five books, Building a Second Brain, Make It Stick, Richard Feynman's Mental Models, The Socratic Method and Tomorrowmind, run together into one pipeline: notes, distill, concepts, and this talk.">
    <div class="kt-b2t__books">
      <figure v-for="(b, i) in books" :key="b.src" class="kt-b2t__fig" :class="{ 'is-on': at(0.2 + i * 0.25) }">
        <img :src="b.src" :alt="b.alt" class="kt-b2t__book" :style="{ '--r': `${b.r}deg` }">
        <figcaption>{{ b.gave }}</figcaption>
      </figure>
    </div>

    <svg class="kt-b2t__funnel" :class="{ 'is-on': at(1.6) }" viewBox="0 0 880 56" aria-hidden="true">
      <path v-for="x in bx" :key="x" :d="`M${x} 2 C ${x} 32, 96 26, 96 54`" class="kt-b2t__line" />
    </svg>

    <div class="kt-b2t__steps">
      <template v-for="(s, i) in steps" :key="s.name">
        <div v-if="i > 0" class="kt-b2t__arrow" :class="{ 'is-on': at(2.0 + i * 0.5) }">→</div>
        <div class="kt-b2t__step" :class="[`is-${s.icon}`, { 'is-on': at(2.0 + i * 0.5), 'is-glow': s.icon === 'talk' && at(4.0) }]">
          <solar-pen-new-square-bold-duotone v-if="s.icon === 'pen'" class="kt-b2t__icon" />
          <solar-filter-bold-duotone v-else-if="s.icon === 'filter'" class="kt-b2t__icon" />
          <solar-lightbulb-bolt-bold-duotone v-else-if="s.icon === 'bulb'" class="kt-b2t__icon" />
          <solar-presentation-graph-bold-duotone v-else class="kt-b2t__icon" />
          <b>{{ s.name }}</b>
          <span>{{ s.does }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<style>
.kt-b2t {
  width: 880px;
  font-family: var(--font-family-sans);
}

.kt-b2t__books {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
}

.kt-b2t__fig {
  margin: 0;
  width: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  opacity: 0;
  transform: translateY(-24px);
  transition: opacity 0.4s, transform 0.55s cubic-bezier(0.2, 0.9, 0.3, 1.2);
}

.kt-b2t__fig.is-on { opacity: 1; transform: none; }

.kt-b2t__book {
  width: 90px;
  height: 133px;
  object-fit: cover;
  border-radius: 6px;
  box-shadow: var(--kt-shadow-lg);
  transform: rotate(var(--r));
}

.kt-b2t__fig figcaption {
  font: 700 12.5px var(--font-family-mono);
  line-height: 1.3;
  text-align: center;
  color: var(--kt-cool);
}

.kt-b2t__funnel {
  display: block;
  width: 880px;
  height: 56px;
  opacity: 0;
  transition: opacity 0.5s;
}

.kt-b2t__funnel.is-on { opacity: 1; }

.kt-b2t__line {
  fill: none;
  stroke: var(--kt-c-primary-soft);
  stroke-width: 2.2;
  stroke-dasharray: 6 5;
  animation: kt-b2t-flow 1.2s linear infinite;
}

@keyframes kt-b2t-flow {
  to { stroke-dashoffset: -22; }
}

.kt-b2t__steps {
  display: flex;
  align-items: stretch;
  gap: 10px;
}

.kt-b2t__step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 14px 10px;
  border: 2px solid var(--kt-c-primary);
  border-radius: 14px;
  background: var(--kt-card);
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.4s, transform 0.5s cubic-bezier(0.2, 0.9, 0.3, 1.2), box-shadow 0.5s;
}

.kt-b2t__step.is-on { opacity: 1; transform: none; }
.kt-b2t__step.is-talk { border-color: var(--kt-hot); background: color-mix(in srgb, var(--kt-hot) 10%, var(--kt-card)); }
.kt-b2t__step.is-glow { box-shadow: 0 0 28px color-mix(in srgb, var(--kt-hot) 50%, transparent); }

.kt-b2t__icon { width: 34px; height: 34px; color: var(--kt-cool); }
.kt-b2t__step.is-talk .kt-b2t__icon { color: var(--kt-hot); }

.kt-b2t__step b { font-size: 22px; font-weight: 800; color: var(--kt-heading); }
.kt-b2t__step span { font: 600 12.5px var(--font-family-mono); color: var(--kt-muted); text-align: center; }

.kt-b2t__arrow {
  align-self: center;
  font-size: 24px;
  font-weight: 800;
  color: var(--kt-c-primary-soft);
  opacity: 0;
  transition: opacity 0.4s;
}

.kt-b2t__arrow.is-on { opacity: 1; }

@media (prefers-reduced-motion: reduce) {
  .kt-b2t__line { animation: none !important; }
}
</style>
