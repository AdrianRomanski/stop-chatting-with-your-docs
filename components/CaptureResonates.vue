<script setup lang="ts">
import { computed } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * C · Capture, by hand. Left, the source: a page of Building a Second Brain (Ch. 3, p. 44–45), the
 * real text around the passage (the speaker's test vault, 0.Raw), an article behind it ("a book or
 * an article"). The page is readable first; then everything but the "keep what resonates" passage
 * fades, the passage lights up and a heart beats beside it (the motif from FirstMistakes, reused on ReadingFlow). Middle, a sheet of
 * paper: a pen writes the passage out by hand, line by line, the important parts only (an ellipsis
 * where I skipped). Right, that evening: the page is typed into today's daily note, the bridge to
 * Organize. The bold and highlight layers come later, on DistillLayers. No props, no numbers.
 */
const { t, at } = useTimeline(12.2)

// the handwriting: one line at a time, the pen riding the end of the ink
const lines = [
  '“Don\'t make it an',
  'analytical decision …',
  'just look inside for a',
  'feeling of pleasure, curiosity,',
  'wonder, or excitement,',
  'and let that be your signal.”',
]
const WRITE = 3.6
const PER = 0.95
const progress = (i: number) => Math.min(1, Math.max(0, (t.value - WRITE - i * PER) / (PER - 0.15)))
const writing = computed(() => t.value >= WRITE && t.value < WRITE + lines.length * PER)
const current = computed(() => Math.min(lines.length - 1, Math.max(0, Math.floor((t.value - WRITE) / PER))))
const done = computed(() => at(WRITE + lines.length * PER))
</script>

<template>
  <div class="kt-cap" role="img"
    aria-label="Capture by hand: in a book, or an article, a passage resonates and a heart beats. I write the important parts out on paper with a pen: don't make it an analytical decision, just look inside for a feeling of pleasure, curiosity, wonder, or excitement, and let that be your signal. That evening, the page is typed into today's daily note.">
    <!-- the source: a book page, an article behind it -->
    <div class="kt-cap__article kt-cap__part" :class="{ 'is-on': at(0.4) }">
      <div class="kt-cap__src">article</div>
      <i class="kt-cap__bar" style="width: 80%" />
      <i class="kt-cap__bar" style="width: 64%" />
    </div>
    <div class="kt-cap__page kt-cap__part" :class="{ 'is-on': at(0.2), 'is-dim': at(2.0) }">
      <div class="kt-cap__src">Building a Second Brain · ch. 3</div>
      <p class="kt-cap__text">
        … You might email yourself a quick note, brainstorm some ideas in a document, or highlight quotes in a book you’re reading, but
        that information probably remains disconnected and scattered. The insights you uncovered through
        serious mental effort remain hidden in forgotten folders or drifting in the cloud.
      </p>
      <p class="kt-cap__text">
        The solution is to keep only what resonates in a trusted place that you control, and to leave the
        rest aside.
      </p>
      <p class="kt-cap__text">
        When something resonates, it moves you on an intuitive level. Often, the ideas that resonate are
        the ones that are most unusual, counterintuitive, interesting, or potentially useful.
        <span class="kt-cap__passage" :class="{ 'is-hit': at(2.0) }">Don’t make it an analytical decision,
        and don’t worry about why exactly it resonates—just look inside for a feeling of pleasure,
        curiosity, wonder, or excitement, and let that be your signal</span> for when it’s time to capture a
        passage, an image, a quote, or a fact.
      </p>
    </div>

    <!-- it resonates: a heartbeat -->
    <div class="kt-cap__heart" :class="{ 'is-on': at(2.3) }">
      <i class="kt-cap__ripple" />
      <i class="kt-cap__ripple is-late" />
      <svg viewBox="0 -5 28 28"><path d="M14 22 c-10 -7 -14 -12 -14 -17 a6 6 0 0 1 14 -2 a6 6 0 0 1 14 2 c0 5 -4 10 -14 17z" /></svg>
    </div>

    <!-- the paper: written out by hand -->
    <div class="kt-cap__paper" :class="{ 'is-on': at(3.0) }">
      <div class="kt-cap__margin" />
      <div v-for="(l, i) in lines" :key="i" class="kt-cap__line">
        <span class="kt-cap__ink" :style="{ clipPath: `inset(0 ${(1 - progress(i)) * 100}% 0 0)` }">{{ l }}</span>
        <svg v-if="writing && current === i" class="kt-cap__pen" :style="{ left: `calc(${progress(i) * 100}% - 4px)` }"
          viewBox="0 0 40 40">
          <path d="M4 36 L8 26 L30 4 L36 10 L14 32 Z" class="kt-cap__penbody" />
          <path d="M4 36 L8 26 L14 32 Z" class="kt-cap__pentip" />
        </svg>
      </div>
      <div class="kt-cap__sig" :class="{ 'is-on': done }">BASB · ch. 3</div>
    </div>

    <!-- that evening: typed into today's daily note -->
    <svg class="kt-cap__arrow kt-cap__part" :class="{ 'is-on': at(10.0) }" viewBox="0 0 40 20">
      <path d="M2 10 h32 m-8 -7 l8 7 -8 7" />
    </svg>
    <div class="kt-cap__daily kt-cap__part" :class="{ 'is-on': at(10.0) }">
      <div class="kt-cap__file">daily note · today</div>
      <i class="kt-cap__bar is-short" />
      <div class="kt-cap__typed" :class="{ 'is-on': at(10.6) }">
        <i v-for="w in [96, 88, 100, 72]" :key="w" class="kt-cap__bar is-hot" :style="{ width: `${w}%` }" />
      </div>
    </div>

    <div class="kt-cap__tag is-paper kt-cap__part" :class="{ 'is-on': done }"><b>keep what resonates</b> · by hand</div>
    <div class="kt-cap__tag is-daily kt-cap__part" :class="{ 'is-on': at(11.0) }">typed in that evening</div>
  </div>
</template>

<style>
.kt-cap {
  position: relative;
  width: 840px;
  height: 372px;
  font-family: var(--font-family-sans);
}

.kt-cap__part {
  opacity: 0;
  transition: opacity 0.45s;
}

.kt-cap__part.is-on { opacity: 1; }

/* the source */
.kt-cap__page,
.kt-cap__article {
  position: absolute;
  padding: 14px 18px;
  border: 2px solid var(--kt-line-strong);
  border-radius: 12px;
  background: linear-gradient(var(--kt-card), var(--kt-card)), var(--kt-bg);
  box-sizing: border-box;
}

.kt-cap__page {
  left: 0;
  top: 24px;
  width: 346px;
  padding: 10px 16px;
}

.kt-cap__article {
  left: 22px;
  top: -6px;
  width: 290px;
  height: 80px;
  padding-top: 6px;
  transform: rotate(-2deg);
  border-color: var(--kt-line);
}

.kt-cap__src,
.kt-cap__file {
  font: 12px var(--font-family-mono);
  color: var(--kt-subtle);
  margin-bottom: 8px;
}

.kt-cap__bar {
  display: block;
  height: 7px;
  margin: 9px 0;
  border-radius: 4px;
  background: var(--kt-line);
  transition: opacity 0.6s;
}

.kt-cap__bar.is-short { width: 46%; }
.kt-cap__bar.is-hot { background: color-mix(in srgb, var(--kt-hot) 55%, transparent); }

.kt-cap__text {
  margin: 0 0 6px;
  font-size: 11px;
  line-height: 1.4;
  color: var(--kt-fg);
  transition: color 0.6s;
}

.kt-cap__passage {
  padding: 1px 2px;
  border-radius: 3px;
  transition: color 0.5s, background 0.5s;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
}

/* everything but what resonates steps back */
.kt-cap__page.is-dim .kt-cap__text { color: color-mix(in srgb, var(--kt-subtle) 45%, transparent); }
.kt-cap__page.is-dim .kt-cap__src { opacity: 0.3; }
.kt-cap__passage.is-hit { color: var(--kt-heading); font-weight: 600; background: var(--kt-tint-secondary); }

.kt-cap__heart {
  position: absolute;
  left: 326px;
  top: 214px;
  width: 44px;
  height: 44px;
  opacity: 0;
  transition: opacity 0.35s;
}

.kt-cap__heart.is-on { opacity: 1; }

.kt-cap__heart svg {
  position: absolute;
  inset: 8px;
  fill: var(--kt-hot);
}

.kt-cap__heart.is-on svg { animation: kt-cap-beat 1.2s ease-in-out infinite; }

.kt-cap__ripple {
  position: absolute;
  inset: 4px;
  border: 2px solid var(--kt-hot);
  border-radius: 50%;
  opacity: 0;
}

.kt-cap__heart.is-on .kt-cap__ripple { animation: kt-cap-ripple 1.2s ease-out infinite; }
.kt-cap__heart.is-on .kt-cap__ripple.is-late { animation-delay: 0.6s; }

@keyframes kt-cap-beat {
  0%, 40%, 100% { transform: scale(1); }
  15% { transform: scale(1.25); }
  28% { transform: scale(1.1); }
}

@keyframes kt-cap-ripple {
  0% { opacity: 0.7; transform: scale(1); }
  100% { opacity: 0; transform: scale(2.4); }
}

/* the paper: lined, a red margin, slightly turned, slides in */
.kt-cap__paper {
  position: absolute;
  left: 380px;
  top: 30px;
  width: 286px;
  height: 286px;
  padding: 25px 10px 0 42px;
  box-sizing: border-box;
  border-radius: 6px;
  background:
    repeating-linear-gradient(transparent 0 33px, color-mix(in srgb, var(--kt-info) 35%, transparent) 33px 34px)
    0 26px / 100% calc(100% - 26px) no-repeat,
    color-mix(in srgb, var(--kt-warn) 8%, var(--kt-card));
  box-shadow: 0 10px 28px color-mix(in srgb, var(--kt-bg) 60%, transparent);
  opacity: 0;
  transform: translateY(24px) rotate(-4deg);
  transition: opacity 0.5s, transform 0.6s cubic-bezier(0.2, 0.9, 0.3, 1.1);
}

.kt-cap__paper.is-on { opacity: 1; transform: rotate(-1.5deg); }

.kt-cap__margin {
  position: absolute;
  left: 32px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: color-mix(in srgb, var(--kt-bad) 55%, transparent);
}

.kt-cap__line {
  position: relative;
  width: fit-content;
  height: 34px;
  white-space: nowrap;
}

.kt-cap__ink {
  display: inline-block;
  font-size: 16px;
  font-style: italic;
  font-weight: 600;
  line-height: 34px;
  color: var(--kt-heading);
}

.kt-cap__pen {
  position: absolute;
  bottom: 6px;
  width: 34px;
  height: 34px;
  transform-origin: 4px 36px;
  animation: kt-cap-scribble 0.18s ease-in-out infinite alternate;
}

.kt-cap__penbody { fill: var(--kt-c-primary); }
.kt-cap__pentip { fill: var(--kt-heading); }

@keyframes kt-cap-scribble {
  from { transform: translateY(0) rotate(0deg); }
  to { transform: translateY(-3px) rotate(-6deg); }
}

.kt-cap__sig {
  position: absolute;
  right: 18px;
  bottom: 8px;
  font-size: 14px;
  font-style: italic;
  color: var(--kt-subtle);
  opacity: 0;
  transition: opacity 0.5s;
}

.kt-cap__sig.is-on { opacity: 1; }

/* that evening */
.kt-cap__arrow {
  position: absolute;
  left: 680px;
  top: 130px;
  width: 30px;
  fill: none;
  stroke: var(--kt-c-primary-soft);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.kt-cap__daily {
  position: absolute;
  left: 714px;
  top: 66px;
  width: 122px;
  padding: 14px 16px;
  border: 2px solid var(--kt-c-primary);
  border-radius: 12px;
  background: var(--kt-tint-primary);
  box-sizing: border-box;
}

.kt-cap__typed {
  opacity: 0;
  transform: translateX(-40px);
  transition: opacity 0.4s, transform 0.6s cubic-bezier(0.2, 0.9, 0.3, 1.1);
}

.kt-cap__typed.is-on { opacity: 1; transform: none; }

.kt-cap__tag {
  position: absolute;
  bottom: 0;
  text-align: center;
  font: 600 15px var(--font-family-mono);
  color: var(--kt-subtle);
}

.kt-cap__tag.is-hot { color: var(--kt-hot); }
.kt-cap__tag.is-paper { left: 380px; width: 286px; bottom: 2px; color: var(--kt-fg); }
.kt-cap__tag b { color: var(--kt-hot); }
.kt-cap__tag.is-daily { left: 714px; width: 122px; top: 222px; bottom: auto; font-size: 13px; }
</style>
