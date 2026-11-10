<script setup lang="ts">
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * Where the fluency illusion comes from: the book, open at the page, plays once:
 * 1. the Make It Stick cover slides in
 * 2. the definition, verbatim (ch. 5, p. 116; not on the slide): a highlighter sweeps "fluency with a text", a green
 *    underline draws under "mastery of its content"
 * 3. the next sentence: "a particularly lucid presentation of a difficult concept" gets marked
 *    and tagged "= my summary.md": the book describes the slide before
 * 4. the callback: fluency ("FINALLY I understand!") ≠ mastery (drawing it at the whiteboard)
 * Pays off JuliaStory. No props.
 */
const { at } = useTimeline(6.4)
</script>

<template>
  <div class="kt-fill" role="img"
    aria-label="Make It Stick: Fluency illusions result from our tendency to mistake fluency with a text for mastery of its content. If you read a particularly lucid presentation of a difficult concept, you can get the idea that it is actually pretty simple. That was my summary. Fluency is not mastery.">
    <div class="kt-fill__main">
      <!-- the book, open at the page -->
      <figure class="kt-fill__book" :class="{ 'is-on': at(0.1) }">
        <div class="kt-fill__cover">
          <img src="/images/books/make-it-stick.jpg" alt="Make It Stick, the book cover">
        </div>
      </figure>

      <!-- the definition, verbatim -->
      <div class="kt-fill__text">
        <blockquote class="kt-fill__quote" :class="{ 'is-on': at(1.1) }">
          Fluency illusions result from our tendency to mistake
          <mark class="kt-fill__mark is-fluency" :class="{ 'is-on': at(2) }">fluency with a text</mark>
          for
          <mark class="kt-fill__mark is-mastery" :class="{ 'is-on': at(2.8) }">mastery of its content</mark>.
        </blockquote>
        <p class="kt-fill__next" :class="{ 'is-on': at(3.6) }">
          “…if you read a
          <mark class="kt-fill__mark is-lucid" :class="{ 'is-on': at(4.3) }">particularly lucid presentation of a difficult concept</mark><span
            class="kt-fill__tag" :class="{ 'is-on': at(4.9) }">= my summary.md</span>,
          you can get the idea that it is actually pretty simple…”
        </p>
      </div>
    </div>

    <!-- the callback: what I felt ≠ what I had -->
    <div class="kt-fill__vs" :class="{ 'is-on': at(5.6) }">
      <div class="kt-fill__side is-felt">
        <span class="kt-fill__key">fluency</span>
        <span class="kt-fill__val">“FINALLY I understand!”</span>
      </div>
      <span class="kt-fill__neq">≠</span>
      <div class="kt-fill__side is-real">
        <span class="kt-fill__key">mastery</span>
        <span class="kt-fill__val">drawing it at the whiteboard</span>
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
  grid-template-columns: 196px 1fr;
  gap: 44px;
  align-items: center;
}

/* the book: slides in, tilted */
.kt-fill__book {
  margin: 0;
  opacity: 0;
  transform: translateX(-30px) rotate(-6deg);
  transition: opacity 0.4s, transform 0.6s cubic-bezier(0.3, 1.4, 0.5, 1);
}
.kt-fill__book.is-on { opacity: 1; transform: rotate(-3deg); }
.kt-fill__cover { position: relative; width: 180px; }
.kt-fill__cover img {
  position: relative;
  z-index: 1;
  display: block;
  width: 180px;
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
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.5s, transform 0.5s;
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
.kt-fill__quote.is-on,
.kt-fill__next.is-on { opacity: 1; transform: none; }

/* highlighter and underline: they sweep in left to right */
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
  background-image: linear-gradient(transparent 12%, color-mix(in srgb, var(--kt-warn) 42%, transparent) 12%, color-mix(in srgb, var(--kt-warn) 42%, transparent) 92%, transparent 92%);
}
.kt-fill__mark.is-mastery {
  background-image: linear-gradient(transparent 86%, var(--kt-good) 86%, var(--kt-good) 96%, transparent 96%);
}
.kt-fill__mark.is-lucid {
  background-image: linear-gradient(transparent 14%, color-mix(in srgb, var(--kt-hot) 30%, transparent) 14%, color-mix(in srgb, var(--kt-hot) 30%, transparent) 90%, transparent 90%);
}

.kt-fill__next {
  margin: 0;
  font-size: 19px;
  line-height: 1.5;
  color: var(--kt-fg);
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.5s, transform 0.5s;
}
.kt-fill__tag {
  display: inline-block;
  margin-left: 8px;
  padding: 1px 10px;
  border-radius: 999px;
  border: 2px solid var(--kt-hot);
  background: var(--kt-tint-secondary);
  color: var(--kt-hot);
  font: 800 14px var(--font-family-mono);
  vertical-align: 2px;
  opacity: 0;
  transform: scale(0.4) rotate(-6deg);
  transition: opacity 0.2s, transform 0.45s cubic-bezier(0.3, 1.9, 0.5, 1);
}
.kt-fill__tag.is-on { opacity: 1; transform: rotate(-3deg); }


/* the callback */
.kt-fill__vs {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 18px;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.5s, transform 0.5s;
}
.kt-fill__vs.is-on { opacity: 1; transform: none; }
.kt-fill__side {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 12px 18px;
  border-radius: 14px;
  border: 2px solid;
}
.kt-fill__side.is-felt { border-color: var(--kt-warn); background: color-mix(in srgb, var(--kt-warn) 10%, var(--kt-bg)); }
.kt-fill__side.is-real { border-color: var(--kt-good); background: color-mix(in srgb, var(--kt-good) 10%, var(--kt-bg)); }
.kt-fill__key { font: 800 13px var(--font-family-mono); text-transform: uppercase; letter-spacing: 0.08em; }
.kt-fill__side.is-felt .kt-fill__key { color: var(--kt-warn); }
.kt-fill__side.is-real .kt-fill__key { color: var(--kt-good); }
.kt-fill__val { font-size: 18px; font-weight: 700; color: var(--kt-heading); }
.kt-fill__neq { font-size: 44px; font-weight: 900; line-height: 1; color: var(--kt-hot); }
.kt-fill__vs.is-on .kt-fill__neq { animation: kt-fill-thump 0.5s cubic-bezier(0.3, 1.9, 0.5, 1) 0.2s both; }
@keyframes kt-fill-thump { from { transform: scale(0.3); } }

@media (prefers-reduced-motion: reduce) {
  .kt-fill__vs.is-on .kt-fill__neq { animation: none; }
}
</style>
