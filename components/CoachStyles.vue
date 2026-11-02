<script setup lang="ts">
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * The four coaching styles of ai-coach (README "Coaching styles", ADR-0019), all asked by the same
 * Gemma 4B on Ollama, offline (the kicker says so). Four cards land one by one, each with
 * what it pushes you to and, on one note (Building a Second Brain, "Distill", pp. 115–121), the
 * question Gemma asks in that style and my answer; under the cornell answer, Picasso's The Bull
 * (1945–46), first state → last state: from the full bull to a few lines. Then the cards take
 * turns glowing, round and round (CSS, after the reveal). Bottom: how
 * a style is picked (--style, the note's frontmatter, the config, or Gemma reads the note).
 * - `compact`: the four cards only, still taking turns; the recap after the coach demo.
 */
withDefaults(defineProps<{ compact?: boolean }>(), { compact: false })
const { at } = useTimeline(5.2)

const styles = [
  {
    name: 'feynman',
    push: 'explain it in plain words, no jargon',
    q: 'Explain it to a beginner. No “distill”, no “main points”.',
    a: 'Cut a note down until future you gets it at a glance.',
  },
  {
    name: 'socratic',
    push: 'defend a claim against a counterexample',
    q: 'Highlighting helps. So why not highlight half the page?',
    a: 'Then nothing stands out. Each layer keeps 10–20% of the last.',
  },
  {
    name: 'cornell',
    push: 'state the author’s thesis and how they argue it',
    q: 'What’s the thesis? How is it argued?',
    a: 'Forgetting on purpose: Picasso’s bull.',
    bull: true,
  },
  {
    name: 'devil',
    push: 'name failure modes, trade-offs, where it breaks',
    q: 'When is distilling a waste of time?',
    a: 'When nothing’s being made. Distill when you’re about to create.',
  },
]
</script>

<template>
  <div class="kt-styles" :class="{ 'is-compact': compact, 'is-cycling': at(compact ? 1.6 : 3.4) }" role="img"
    aria-label="One local model, Gemma 4B on Ollama, offline, questions you in four styles, each shown with one question and answer on the Distill chapter of Building a Second Brain. Feynman: explain it in plain words, no jargon. Socratic: defend a claim against a counterexample. Cornell: state the author's thesis and how they argue it. Devil: name failure modes, trade-offs, where it breaks. The style comes from --style, the note's frontmatter, the config, or Gemma picks it by reading the note.">
    <div class="kt-styles__row">
      <div v-for="(s, i) in styles" :key="s.name" class="kt-styles__card" :class="[`is-${s.name}`, { 'is-on': at(0.6 + i * 0.5) }]"
        :style="{ '--i': i }">
        <div class="kt-styles__name">{{ s.name }}</div>
        <div class="kt-styles__push">{{ s.push }}</div>

        <!-- one round on the Distill chapter: Gemma asks, I answer -->
        <template v-if="!compact">
          <div class="kt-styles__q"><img src="/images/logos/gemma-mark.png" alt=""><span>{{ s.q }}</span></div>
          <div class="kt-styles__a"><span>{{ s.a }}</span><img src="/images/speaker.webp" alt=""></div>
          <div v-if="s.bull" class="kt-styles__bull">
            <img src="/images/art/picasso-bull-1.webp" alt="Picasso's bull, first state: a full, shaded bull">
            <b>→</b>
            <img src="/images/art/picasso-bull-8.webp" alt="the last state: the same bull in a few lines">
          </div>
        </template>
      </div>
    </div>

    <div v-if="!compact" class="kt-styles__pick kt-styles__part" :class="{ 'is-on': at(4.2) }">
      picked per note: <b>--style</b> · <b>frontmatter</b> · <b>config</b> · or Gemma reads the note
    </div>
  </div>
</template>

<style>
.kt-styles {
  position: relative;
  width: 840px;
  font-family: var(--font-family-sans);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.kt-styles__part {
  opacity: 0;
  transition: opacity 0.45s;
}

.kt-styles__part.is-on { opacity: 1; }

.kt-styles__row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  width: 100%;
}

.kt-styles__card {
  --tone: var(--kt-c-primary);
  position: relative;
  min-height: 150px;
  padding: 12px 14px 12px;
  border: 2px solid var(--kt-line);
  border-radius: 14px;
  background: var(--kt-card);
  box-sizing: border-box;
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.4s, transform 0.5s cubic-bezier(0.2, 0.9, 0.3, 1.2), border-color 0.3s;
}

.kt-styles__card.is-on { opacity: 1; transform: none; }
.kt-styles__card.is-feynman { --tone: var(--kt-info); }
.kt-styles__card.is-socratic { --tone: var(--kt-hot); }
.kt-styles__card.is-cornell { --tone: var(--kt-good); }
.kt-styles__card.is-devil { --tone: var(--kt-warn); }

.kt-styles__name {
  font: 700 17px var(--font-family-mono);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--tone);
}

.kt-styles__push {
  margin-top: 4px;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--kt-heading);
}

/* the round: Gemma's question on the left, my answer on the right */
.kt-styles__q,
.kt-styles__a {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-top: 8px;
  font-size: 12.5px;
  line-height: 1.35;
}

.kt-styles__q span,
.kt-styles__a span {
  padding: 6px 9px;
  border-radius: 10px;
}

.kt-styles__q span {
  border: 1.5px solid var(--tone);
  border-top-left-radius: 3px;
  background: color-mix(in srgb, var(--tone) 12%, transparent);
  color: var(--kt-heading);
}

.kt-styles__a { justify-content: flex-end; margin-left: 8px; }

.kt-styles__a span {
  border-top-right-radius: 3px;
  background: var(--kt-tint-secondary);
  color: var(--kt-fg);
}

.kt-styles__q img,
.kt-styles__a img { flex: none; width: 20px; height: 20px; margin-top: 3px; }
.kt-styles__a img { border-radius: 50%; object-fit: cover; }

/* Picasso's bull, distilled */
.kt-styles__bull {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 8px;
}

.kt-styles__bull img {
  width: 72px;
  height: auto;
  border-radius: 5px;
  border: 1.5px solid var(--kt-line);
}

.kt-styles__bull img:last-child { border-color: var(--tone); }
.kt-styles__bull b { font-size: 15px; color: var(--tone); }

/* the cards take turns asking: a glow */
.kt-styles.is-cycling .kt-styles__card { animation: kt-styles-turn 6.4s ease-in-out infinite; animation-delay: calc(var(--i) * 1.6s); }

@keyframes kt-styles-turn {
  0%, 26%, 100% { border-color: var(--kt-line); box-shadow: none; }
  4%, 20% {
    border-color: var(--tone);
    box-shadow: 0 0 22px color-mix(in srgb, var(--tone) 45%, transparent);
  }
}



.kt-styles__pick { font: 13px var(--font-family-mono); color: var(--kt-subtle); }
.kt-styles__pick b { color: var(--kt-fg); font-weight: 600; }

/* compact: the recap after the coach demo */
.kt-styles.is-compact .kt-styles__card { min-height: 0; }
</style>
