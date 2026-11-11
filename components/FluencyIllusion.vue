<script setup lang="ts">
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * Where the fluency illusion comes from: the book, open at the page. The book and the quote show at
 * once; then, in pairs: the fluency underline draws and the fluency box comes in, then the mastery
 * underline draws and the ≠ and the mastery box come in:
 * - the Make It Stick cover
 * - the definition, verbatim (ch. 5, p. 116; not on the slide): "fluency with a text" underlined
 *   amber, "mastery of its content" underlined green
 * - the callback: fluency ≠ mastery, each with what it means: precise, in the industry's terms ≠
 *   clear to a child or an executive
 * Pays off JuliaStory. No props.
 */
const FLUENCY_AT = 0.6 // the underline sweeps for 0.8 s, then its box
const MASTERY_AT = 2.4
const { at } = useTimeline(MASTERY_AT + 1.5)
</script>

<template>
  <div class="kt-fill" role="img"
    aria-label="Make It Stick: Fluency illusions result from our tendency to mistake fluency with a text for mastery of its content. Fluency: you explain complex concepts with precision, using standard industry terminology that technical colleagues easily follow. Mastery: you make those same ideas instantly clear to a child or an executive using simple words and vivid analogies. Fluency is not mastery.">
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

    <!-- the callback: fluency ≠ mastery -->
    <div class="kt-fill__vs">
      <div class="kt-fill__side is-felt" :class="{ 'is-on': at(FLUENCY_AT + 0.9) }">
        <span class="kt-fill__key">fluency</span>
        <p class="kt-fill__def">You explain complex concepts with precision, using standard industry terminology that technical colleagues easily follow.</p>
      </div>
      <span class="kt-fill__neq" :class="{ 'is-on': at(MASTERY_AT + 0.9) }">≠</span>
      <div class="kt-fill__side is-real" :class="{ 'is-on': at(MASTERY_AT + 0.9) }">
        <span class="kt-fill__key">mastery</span>
        <p class="kt-fill__def">You make those same ideas instantly clear to a child or an executive using simple words and vivid analogies.</p>
      </div>
    </div>
  </div>
</template>

<style>
.kt-fill {
  width: 880px;
  display: grid;
  gap: 26px;
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

/* the callback */
.kt-fill__vs {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: stretch;
  gap: 18px;
}
.kt-fill__side {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 18px;
  border-radius: 14px;
  border: 2px solid;
  text-align: center;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.5s, transform 0.5s;
}
.kt-fill__side.is-on { opacity: 1; transform: none; }
.kt-fill__side.is-felt { border-color: var(--kt-warn); background: color-mix(in srgb, var(--kt-warn) 10%, var(--kt-bg)); }
.kt-fill__side.is-real { border-color: var(--kt-good); background: color-mix(in srgb, var(--kt-good) 10%, var(--kt-bg)); }
.kt-fill__def { margin: 0; font-size: 16px; line-height: 1.4; color: var(--kt-fg); }
.kt-fill__key { font: 800 13px var(--font-family-mono); text-transform: uppercase; letter-spacing: 0.08em; }
.kt-fill__side.is-felt .kt-fill__key { color: var(--kt-warn); }
.kt-fill__side.is-real .kt-fill__key { color: var(--kt-good); }
.kt-fill__neq { align-self: center; font-size: 44px; font-weight: 900; line-height: 1; color: var(--kt-hot); opacity: 0; }
.kt-fill__neq.is-on { opacity: 1; animation: kt-fill-thump 0.5s cubic-bezier(0.3, 1.9, 0.5, 1) both; }
@keyframes kt-fill-thump { from { transform: scale(0.3); } }

@media (prefers-reduced-motion: reduce) {
  .kt-fill__neq.is-on { animation: none; }
}
</style>
