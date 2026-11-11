<script setup lang="ts">
import { useTimeline } from '../theme/composables/useTimeline'
import FirstMistakes from './FirstMistakes.vue'

/**
 * E · Express, the example is this talk: three intermediate packets (distilled notes from Building
 * a Second Brain, Ch. 5, Ch. 1 epigraph, Ch. 3) fly one by one into an empty slide frame and fill
 * its three panels of a still, miniature FirstMistakes: slide 13, "The first three mistakes", which the audience saw a few minutes
 * earlier. Each packet stays, dimmed and ticked, while a copy of it flies. All three packets look
 * the same: none is special.
 * The third packet is the note captured, organized and distilled on the slides before.
 * No props, no numbers.
 */
const { at } = useTimeline(5.6)
const packets = [
  { from: 'BASB · ch. 5', text: '“not get a PhD in notetaking”' },
  { from: 'BASB · ch. 1', text: '“Your mind is for having ideas, not holding them”' },
  { from: 'my note · ch. 3', text: 'Feeling over logic. Keep what resonates.' },
]
const flyAt = (i: number) => 1.6 + i * 0.7
// the three panels of FirstMistakes (viewBox 1040 wide, splits at 340 and 694)
const slots = [
  { left: '0%', width: '32.7%' },
  { left: '32.7%', width: '34%' },
  { left: '66.7%', width: '33.3%' },
]
</script>

<template>
  <div class="kt-expr" role="img"
    aria-label="Express: three distilled notes are assembled into a slide of this talk, The first three mistakes, instead of writing it from a blank page.">
    <!-- the packets -->
    <template v-for="(p, i) in packets" :key="i">
      <div class="kt-expr__packet" :class="{ 'is-on': at(0.2 + i * 0.3), 'is-used': at(flyAt(i)) }"
        :style="{ top: `${i * 96}px` }">
        <span class="kt-expr__from">{{ p.from }}</span>
        <span class="kt-expr__text">{{ p.text }}</span>
        <svg class="kt-expr__tick" viewBox="0 0 20 20"><path d="M3 10 l5 5 9 -11" /></svg>
      </div>
      <div class="kt-expr__packet is-ghost" :class="{ 'is-flying': at(flyAt(i)) }"
        :style="{ top: `${i * 96}px`, '--dx': `${346 + i * 149}px`, '--dy': `${110 - i * 96}px` }">
        <span class="kt-expr__from">{{ p.from }}</span>
        <span class="kt-expr__text">{{ p.text }}</span>
      </div>
    </template>

    <svg class="kt-expr__arrow" :class="{ 'is-on': at(1.3) }" viewBox="0 0 60 20">
      <path d="M2 10 h52 m-9 -8 l9 8 -9 8" />
    </svg>

    <!-- the slide they become -->
    <div class="kt-expr__slide" :class="{ 'is-on': at(0.8), 'is-done': at(4.0) }">
      <div class="kt-expr__kicker">before the first note</div>
      <div class="kt-expr__title">The first three <span>mistakes</span></div>
      <div class="kt-expr__mini">
        <FirstMistakes still />
        <!-- empty slots over each panel, uncovered as its packet lands -->
        <div v-for="(s, i) in slots" :key="i" class="kt-expr__slot" :class="{ 'is-filled': at(flyAt(i) + 0.3) }"
          :style="{ left: s.left, width: s.width }" />
      </div>
      <div class="kt-expr__stamp" :class="{ 'is-on': at(4.0) }">slide 13</div>
    </div>

    <div class="kt-expr__tag kt-expr__fade" :class="{ 'is-on': at(4.6) }">assembled, not written from a blank page</div>
  </div>
</template>

<style>
.kt-expr {
  position: relative;
  width: 880px;
  height: 330px;
  font-family: var(--font-family-sans);
}

.kt-expr__fade {
  opacity: 0;
  transition: opacity 0.45s;
}

.kt-expr__fade.is-on { opacity: 1; }

.kt-expr__packet {
  position: absolute;
  left: 0;
  width: 290px;
  height: 80px;
  padding: 10px 14px;
  box-sizing: border-box;
  border: 2px solid var(--kt-c-primary);
  border-radius: 10px;
  background: var(--kt-tint-primary);
  opacity: 0;
  transform: translateX(-20px);
  transition: opacity 0.4s, transform 0.6s cubic-bezier(0.5, 0, 0.6, 1), border-color 0.4s, background 0.4s;
}

.kt-expr__packet.is-on { opacity: 1; transform: none; }
.kt-expr__packet.is-used { opacity: 0.45; }

/* the copy that flies into its slot */
.kt-expr__packet.is-ghost { transition: none; }
.kt-expr__packet.is-ghost.is-flying { animation: kt-expr-fly 0.6s cubic-bezier(0.5, 0, 0.6, 1) forwards; }

@keyframes kt-expr-fly {
  0% { opacity: 1; transform: none; }
  100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(0.45); }
}

.kt-expr__tick {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 20px;
  fill: none;
  stroke: var(--kt-good);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0;
  transition: opacity 0.3s;
}

.kt-expr__packet.is-used .kt-expr__tick { opacity: 1; }

.kt-expr__from { display: block; font: 12px var(--font-family-mono); color: var(--kt-subtle); }
.kt-expr__text { display: block; margin-top: 4px; font-size: 16px; font-weight: 600; line-height: 1.3; color: var(--kt-heading); transition: color 0.4s; }

.kt-expr__arrow {
  position: absolute;
  left: 306px;
  top: 126px;
  width: 60px;
  fill: none;
  stroke: var(--kt-c-primary-soft);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0;
  transition: opacity 0.45s;
}

.kt-expr__arrow.is-on { opacity: 1; }

/* a 16:9 slide frame, drawn like the deck itself */
.kt-expr__slide {
  position: absolute;
  right: 0;
  top: 0;
  width: 480px;
  height: 270px;
  padding: 20px 22px;
  box-sizing: border-box;
  border: 2px solid var(--kt-line-strong);
  border-radius: 12px;
  background: var(--kt-bg);
  opacity: 0;
  transition: opacity 0.45s, border-color 0.5s, box-shadow 0.5s;
}

.kt-expr__slide.is-on { opacity: 1; }
.kt-expr__slide.is-done { border-color: var(--kt-hot); box-shadow: 0 0 0 6px var(--kt-tint-secondary); }

.kt-expr__kicker { font: 11px var(--font-family-mono); letter-spacing: 0.14em; text-transform: uppercase; color: var(--kt-subtle); }
.kt-expr__title { margin-top: 4px; font-size: 24px; font-weight: 800; color: var(--kt-heading); }
.kt-expr__title span { color: var(--kt-hot); }

.kt-expr__mini {
  position: relative;
  margin-top: 14px;
}

.kt-expr__mini .kt-fm { display: block; }

.kt-expr__slot {
  position: absolute;
  top: -4px;
  bottom: -4px;
  box-sizing: border-box;
  border: 2px dashed var(--kt-line);
  border-radius: 8px;
  background: var(--kt-bg);
  transition: opacity 0.4s;
}

.kt-expr__slot.is-filled { opacity: 0; }

.kt-expr__stamp {
  position: absolute;
  right: -14px;
  top: -16px;
  padding: 4px 12px;
  border-radius: 999px;
  background: var(--kt-hot);
  font: 700 14px var(--font-family-mono);
  color: var(--kt-bg);
  opacity: 0;
  transform: scale(1.6) rotate(-6deg);
  transition: opacity 0.25s, transform 0.35s cubic-bezier(0.3, 1.6, 0.5, 1);
}

.kt-expr__stamp.is-on { opacity: 1; transform: rotate(-6deg); }

.kt-expr__tag {
  position: absolute;
  right: 0;
  width: 480px;
  bottom: 12px;
  text-align: center;
  font: 600 16px var(--font-family-mono);
  color: var(--kt-hot);
}
</style>
