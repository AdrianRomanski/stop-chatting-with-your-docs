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

const STYLES: Record<string, { does: string; turns: Turn[] }> = {
  feynman: {
    does: 'It stops you from hiding behind fancy buzzwords. Often we think we understand a concept just because we know its name. Feynman mode bans the main keywords from your note and asks you to explain how the idea works in simple, everyday language.',
    turns: [
      { who: 'coach', label: 'coach question', text: 'Without using the phrase “Progressive Summarization”, how do you prepare a long note today so that Future You can find the main point in 10 seconds, six months from now?' },
      { who: 'me', label: 'winning answer', win: true, text: 'Each time I revisit the note, I mark only the best 10⁠–⁠20% of what’s there: first I bold key sentences, then I highlight the best of the bold, and finally I write a two-sentence takeaway at the top, in my own words, so I never have to reread the whole page.' },
    ],
  },
  socratic: {
    does: 'Instead of asking “what is X?”, it tests the limits of your statement. Give a general rule that sounds right on the surface, and the coach pushes your own logic to an extreme to see where it breaks, forcing you to explain the exact boundary or rule that makes it work.',
    turns: [
      { who: 'me', label: 'you say', text: 'Highlighting helps me spot the important parts faster.' },
      { who: 'coach', label: 'coach pushes back', text: 'If highlighting makes things easier to find, what happens if you highlight half the page? Does that still help?' },
      { who: 'me', label: 'winning answer', win: true, text: 'No: if half the page is highlighted, nothing stands out and my eyes still have to read everything. It only saves time if each layer compresses the previous one to about 10⁠–⁠20%, trading full detail for fast scanning.' },
    ],
  },
  cornell: {
    does: 'Built for non-technical books, essays and big ideas. Instead of nitpicking tiny mechanical details, it focuses on the big picture: what is the author’s main argument, and why did they use this specific story or metaphor to prove it?',
    turns: [
      { who: 'coach', label: 'coach question', text: 'Why does the author argue you should treat “Future You” like an impatient stranger, and how does that change the way you save a note today?' },
      { who: 'me', label: 'winning answer', win: true, text: 'Because six months from now, I won’t remember the context I have in my head today. If I just save a raw 30-page article, Future Me won’t have time to re-read it under a deadline, so I have to highlight the core takeaway now, as a gift to my future self.' },
    ],
  },
  devil: {
    does: 'Acts like a skeptical teammate in a design review. It assumes your idea works fine on a sunny day, and immediately asks what happens when things go wrong in real life: when you’re busy, stressed, or dealing with massive scale.',
    turns: [
      { who: 'coach', label: 'coach question', text: 'This note-taking system sounds great when you have free time on Sunday, but where does it break during a chaotic crunch week at work, and how do you recover?' },
      { who: 'me', label: 'winning answer', win: true, text: 'It breaks if I bold and summarize every article the moment I save it: that’s unpaid homework. The fix is just-in-time: I only compress a note when I open it again for a real project, and if my inbox overflows, I archive the batch and start fresh.' },
    ],
  },
}

const s = computed(() => STYLES[props.name])
const label = computed(() => `The ${props.name} sparring style. ${s.value.does} ${s.value.turns.map(t => `${t.label}: ${t.text}`).join(' ')}`)
</script>

<template>
  <div class="kt-sround" :class="`is-${name}`" role="img" :aria-label="label">
    <div class="kt-sround__grid kt-stagger">
      <!-- the style's card -->
      <div class="kt-sround__card">
        <div class="kt-sround__name">{{ name }}</div>
        <div class="kt-sround__key">what this sparring style does</div>
        <p class="kt-sround__does">{{ s.does }}</p>
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
.kt-sround__key { margin-top: 12px; font: 700 12.5px var(--font-family-mono); text-transform: uppercase; letter-spacing: 0.08em; color: var(--tone); }
.kt-sround__does { margin: 6px 0 0; font-size: 17px; line-height: 1.45; color: var(--kt-fg); }

/* the round */
.kt-sround__turns { display: flex; flex-direction: column; justify-content: center; gap: 12px; }
.kt-sround__turn { display: flex; align-items: flex-start; gap: 10px; }
.kt-sround__turn.is-me { flex-direction: row-reverse; }
.kt-sround__turn img { flex: none; width: 34px; height: 34px; margin-top: 6px; border-radius: 50%; object-fit: cover; }
.kt-sround__turn span { padding: 10px 16px; border-radius: 14px; font-size: 17.5px; line-height: 1.42; }
.kt-sround__turn small { display: block; margin-bottom: 4px; font: 700 12px var(--font-family-mono); text-transform: uppercase; letter-spacing: 0.06em; color: var(--kt-muted); }
.kt-sround__turn.is-coach span { border: 1.5px solid var(--tone); border-top-left-radius: 3px; background: color-mix(in srgb, var(--tone) 12%, transparent); color: var(--kt-heading); font-weight: 700; }
.kt-sround__turn.is-me span { border-top-right-radius: 3px; background: var(--kt-tint-secondary); color: var(--kt-fg); font-weight: 600; }
.kt-sround__turn.is-win span { border: 1.5px solid var(--kt-good); }
.kt-sround__turn.is-win small { color: var(--kt-good); }

</style>
