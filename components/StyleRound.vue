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

const STYLES: Record<string, { does: string; banned?: string[]; turns: Turn[] }> = {
  feynman: {
    does: 'Bans buzzwords. You explain how the idea works in everyday words.',
    banned: ['Progressive Summarization', 'Distillation', 'Executive summary'],
    turns: [
      { who: 'coach', label: 'coach question', text: 'Without saying “Progressive Summarization”: how do you prep a long note so Future You finds the point in 10 seconds?' },
      { who: 'me', label: 'winning answer', win: true, text: 'Each visit I keep the best 10⁠–⁠20%: bold, then highlight the bold, then a two-line summary.' },
    ],
  },
  socratic: {
    does: 'Pushes your rule to the extreme to find where it breaks. You explain the boundary.',
    turns: [
      { who: 'me', label: 'you say', text: 'Distilling makes my notes faster to use.' },
      { who: 'coach', label: 'coach pushes back', text: 'Then why not distill every note down to one line?' },
      { who: 'me', label: 'winning answer', win: true, text: 'One line loses the context I need. Each layer keeps the best 10⁠–⁠20%, and I can drill back down.' },
    ],
  },
  cornell: {
    does: 'For books and big ideas. Skips the details: what’s the author’s argument, and why this story?',
    turns: [
      { who: 'coach', label: 'coach question', text: 'Why does the author say you write notes for a Future You who has lost today’s context?' },
      { who: 'me', label: 'winning answer', win: true, text: 'In six months the context is gone. Without notes I’d reread it all from the start. With them, I just read my own summary.' },
    ],
  },
  devil: {
    does: 'A skeptical teammate in a design review: fine on a sunny day, but what about a bad week?',
    turns: [
      { who: 'coach', label: 'coach question', text: 'Distilling works on a quiet Sunday. What happens in a crunch week, when you have no time for it?' },
      { who: 'me', label: 'winning answer', win: true, text: 'I distill only when a project needs it. In a crunch week I skip it and focus on the work. Notes are a marathon, not a sprint.' },
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
        <p class="kt-sround__does">{{ s.does }}</p>
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
.kt-sround__does { margin: 10px 0 0; font-size: 22px; line-height: 1.4; color: var(--kt-fg); }

/* the round */
.kt-sround__turns { display: flex; flex-direction: column; justify-content: center; gap: 12px; }
.kt-sround__turn { display: flex; align-items: flex-start; gap: 10px; }
.kt-sround__turn.is-me { flex-direction: row-reverse; }
.kt-sround__turn img { flex: none; width: 34px; height: 34px; margin-top: 6px; border-radius: 50%; object-fit: cover; }
.kt-sround__turn span { padding: 12px 18px; border-radius: 14px; font-size: 21px; line-height: 1.38; }
.kt-sround__turn small { display: block; margin-bottom: 4px; font: 700 12px var(--font-family-mono); text-transform: uppercase; letter-spacing: 0.06em; color: var(--kt-muted); }
.kt-sround__turn.is-coach span { border: 1.5px solid var(--tone); border-top-left-radius: 3px; background: color-mix(in srgb, var(--tone) 12%, transparent); color: var(--kt-heading); font-weight: 700; }
.kt-sround__turn.is-me span { border-top-right-radius: 3px; background: var(--kt-tint-secondary); color: var(--kt-fg); font-weight: 600; }
.kt-sround__turn.is-win span { border: 1.5px solid var(--kt-good); }
.kt-sround__turn.is-win small { color: var(--kt-good); }

</style>
