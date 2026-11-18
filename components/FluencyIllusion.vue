<script setup lang="ts">
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * Where the fluency illusion comes from: the book, open at the page. The book and the quote show at
 * once; then the fluency underline draws, then the mastery underline:
 * - the Make It Stick cover
 * - the definition, verbatim (ch. 5, p. 116; not on the slide): "fluency with a text" underlined
 *   amber, "mastery of its content" underlined green
 * What fluency and mastery mean is said, not shown (speaker notes).
 * Pays off JuliaStory. No props.
 */
const FLUENCY_AT = 0.6 // each underline sweeps for 0.8 s
const MASTERY_AT = 2.4
const { at } = useTimeline(MASTERY_AT + 1)
</script>

<template>
  <div class="kt-fill" role="img"
    aria-label="Make It Stick: Fluency illusions result from our tendency to mistake fluency with a text for mastery of its content.">
    <div class="kt-fill__main">
      <!-- the book, open at the page -->
      <figure class="kt-fill__book">
        <div class="kt-fill__cover">
          <img src="/images/books/make-it-stick.jpg" alt="Make It Stick, the book cover">
        </div>
      </figure>

      <!-- the definition, verbatim -->
      <div class="kt-fill__text">
        <blockquote class="kt-fill__quote">
          Fluency illusions result from our tendency to mistake
          <mark class="kt-fill__mark is-fluency" :class="{ 'is-on': at(FLUENCY_AT) }">fluency with a text</mark>
          for
          <mark class="kt-fill__mark is-mastery" :class="{ 'is-on': at(MASTERY_AT) }">mastery of its content</mark>.
        </blockquote>
      </div>
    </div>
  </div>
</template>

<style>
.kt-fill {
  width: 880px;
  font-family: var(--font-family-sans);
}

.kt-fill__main {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 44px;
  align-items: center;
}

/* the book, tilted */
.kt-fill__book {
  margin: 0;
  transform: rotate(-3deg);
}
.kt-fill__cover { position: relative; width: 124px; }
.kt-fill__cover img {
  position: relative;
  z-index: 1;
  display: block;
  width: 124px;
  border-radius: 4px 8px 8px 4px;
  box-shadow: 0 18px 40px color-mix(in srgb, var(--kt-bg) 70%, transparent), 0 0 0 1px var(--kt-line);
}

/* the quote */
.kt-fill__text { display: grid; gap: 18px; }
.kt-fill__quote {
  position: relative;
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 31px;
  font-weight: 800;
  line-height: 1.32;
  color: var(--kt-heading);
}
.kt-fill__quote::before {
  content: '“';
  position: absolute;
  left: -34px;
  top: -18px;
  font-size: 72px;
  line-height: 1;
  color: var(--kt-hot);
}
/* the closing mark: same size and color as the opening one, inline after the last word */
.kt-fill__quote::after {
  content: '”';
  margin-left: 4px;
  font-size: 72px;
  line-height: 0;
  vertical-align: -0.42em;
  color: var(--kt-hot);
}

/* the two underlines: same stroke, fluency amber, mastery green; each sweeps in left to right */
.kt-fill__mark {
  color: inherit;
  background-color: transparent;
  background-repeat: no-repeat;
  background-size: 0% 100%;
  transition: background-size 0.8s ease-in-out;
  border-radius: 3px;
  padding: 0 2px;
}
.kt-fill__mark.is-on { background-size: 100% 100%; }
.kt-fill__mark.is-fluency {
  background-image: linear-gradient(transparent 86%, var(--kt-warn) 86%, var(--kt-warn) 96%, transparent 96%);
}
.kt-fill__mark.is-mastery {
  background-image: linear-gradient(transparent 86%, var(--kt-good) 86%, var(--kt-good) 96%, transparent 96%);
}

@media (prefers-reduced-motion: reduce) {
  .kt-fill__mark { transition: none; }
}
</style>
