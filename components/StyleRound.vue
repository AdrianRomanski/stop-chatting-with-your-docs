<script setup lang="ts">
import { computed } from 'vue'

/**
 * One sparring style up close, one slide per style after the "Question Asking Styles" slide.
 * Top left: the style's card, what it does. Top right: the round, the coach's question (Gemma 4B)
 * and the winning answer (me); socratic shows it as three turns: my claim, the push-back, the answer.
 * The parts land one by one (kt-stagger) when the slide is shown.
 * - `name`: the style: feynman | socratic | cornell | devil
 */
const props = defineProps<{ name: 'feynman' | 'socratic' | 'cornell' | 'devil' }>()

type Turn = { who: 'me' | 'coach'; label: string; text: string; win?: boolean }

// Keep it short: the slide shows keywords, the speaker says the rest (the notes).
// size: the card text's font size in px, tuned so the text fills its card
const STYLES: Record<string, { does: string; size: number; banned?: string[]; turns: Turn[] }> = {
  feynman: {
    size: 28,
    does: 'No buzzwords. Everyday words.',
    banned: ['Progressive Summarization', 'Distillation', 'Executive summary'],
    turns: [
      { who: 'coach', label: 'coach question', text: 'In plain words: how do you compress a note?' },
      { who: 'me', label: 'winning answer', win: true, text: 'Bold 10⁠–⁠20% of text, highlight the best. Sum it up.' },
    ],
  },
  socratic: {
    size: 32,
    does: 'Pushes your rule to the extreme.',
    turns: [
      { who: 'me', label: 'you say', text: 'Marking makes notes easier.' },
      { who: 'coach', label: 'coach pushes back', text: 'So mark 70%?' },
      { who: 'me', label: 'winning answer', win: true, text: 'Then nothing stands out.' },
    ],
  },
  cornell: {
    size: 32,
    does: 'The author’s argument, not the details.',
    turns: [
      { who: 'coach', label: 'coach question', text: 'What’s the author’s main claim about distilling?' },
      { who: 'me', label: 'winning answer', win: true, text: 'Notes are for Future You, not for today.' },
    ],
  },
  devil: {
    size: 32,
    does: 'Fine on a sunny day. And on a bad week?',
    turns: [
      { who: 'coach', label: 'coach question', text: 'Crunch week, no time. Now what?' },
      { who: 'me', label: 'winning answer', win: true, text: 'I distill only when a project needs it.' },
    ],
  },
}

const s = computed(() => STYLES[props.name])
const label = computed(() => `The ${props.name} sparring style. ${s.value.does} ${s.value.banned ? `Banned: ${s.value.banned.join(', ')}.` : ''} ${s.value.turns.map(t => `${t.label}: ${t.text}`).join(' ')}`)
</script>

<template>
  <div class="kt-sround" :class="`is-${name}`" role="img" :aria-label="label">
    <div class="kt-sround__grid kt-stagger">
      <!-- the style's card -->
      <div class="kt-sround__card">
        <div class="kt-sround__name">{{ name }}</div>
        <div class="kt-sround__key">what this sparring style does</div>
        <p class="kt-sround__does" :style="{ fontSize: `${s.size}px` }">{{ s.does }}</p>
        <div v-if="s.banned" class="kt-sround__banned">
          <span v-for="w in s.banned" :key="w"><solar-forbidden-circle-bold />{{ w }}</span>
        </div>
      </div>

      <!-- the round: the coach's question, the winning answer -->
      <div class="kt-sround__turns">
        <div v-for="tn in s.turns" :key="tn.text" class="kt-sround__turn" :class="[`is-${tn.who}`, { 'is-win': tn.win }]">
          <img :src="tn.who === 'me' ? '/images/speaker.webp' : '/images/logos/gemma-mark.png'" alt="">
          <span><small>{{ tn.label }}</small>{{ tn.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.kt-sround {
  --tone: var(--kt-c-primary);
  width: 920px;
  font-family: var(--font-family-sans);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.kt-sround.is-feynman { --tone: var(--kt-info); }
.kt-sround.is-socratic { --tone: var(--kt-hot); }
.kt-sround.is-cornell { --tone: var(--kt-good); }
.kt-sround.is-devil { --tone: var(--kt-warn); }

.kt-sround__grid { display: grid; grid-template-columns: 330px 1fr; gap: 12px 22px; align-items: stretch; }

.kt-sround__card {
  padding: 18px 20px;
  border: 2px solid var(--tone);
  border-radius: 16px;
  background: var(--kt-card);
  box-shadow: 0 0 24px color-mix(in srgb, var(--tone) 25%, transparent);
}
.kt-sround__name { font: 700 28px var(--font-family-mono); text-transform: uppercase; letter-spacing: 0.06em; color: var(--tone); }
.kt-sround__key { margin-top: 16px; font: 700 12.5px var(--font-family-mono); text-transform: uppercase; letter-spacing: 0.08em; color: var(--tone); }
.kt-sround__banned { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
.kt-sround__banned span { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px 4px 8px; border-radius: 999px; border: 1.5px solid var(--kt-bad); background: color-mix(in srgb, var(--kt-bad) 14%, transparent); color: var(--kt-heading); font-size: 16px; font-weight: 700; white-space: nowrap; }
.kt-sround__banned svg { flex: none; width: 18px; height: 18px; color: var(--kt-bad); }
.kt-sround__does { margin: 10px 0 0; line-height: 1.32; color: var(--kt-fg); text-wrap: pretty; }

/* the round */
.kt-sround__turns { display: flex; flex-direction: column; justify-content: center; gap: 12px; }
.kt-sround__turn { display: flex; align-items: flex-start; gap: 10px; }
.kt-sround__turn.is-me { flex-direction: row-reverse; }
.kt-sround__turn img { flex: none; width: 34px; height: 34px; margin-top: 6px; border-radius: 50%; object-fit: cover; }
.kt-sround__turn span { padding: 12px 18px; border-radius: 14px; font-size: 26px; line-height: 1.3; text-wrap: pretty; }
.kt-sround__turn small { display: block; margin-bottom: 4px; font: 700 12px var(--font-family-mono); text-transform: uppercase; letter-spacing: 0.06em; color: var(--kt-muted); }
.kt-sround__turn.is-coach span { border: 1.5px solid var(--tone); border-top-left-radius: 3px; background: color-mix(in srgb, var(--tone) 12%, transparent); color: var(--kt-heading); font-weight: 700; }
.kt-sround__turn.is-me span { border-top-right-radius: 3px; background: var(--kt-tint-secondary); color: var(--kt-fg); font-weight: 600; }
.kt-sround__turn.is-win span { border: 1.5px solid var(--kt-good); }
.kt-sround__turn.is-win small { color: var(--kt-good); }

</style>
