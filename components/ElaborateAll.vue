<script setup lang="ts">
/**
 * Climb step 5, Elaborate, on one static slide: replaces ElaborateSteps and the three ElaborateTurn
 * slides. Three columns in the order `coach elaborate Distillation` asks them: why, connect, apply.
 * Each column: the kind, Gemma's question (the code's fixed wording, ai-performance-coach
 * `fallbackQuestions`, connect in the feynman style), my answer, shortened from the speaker's answers
 * on the old ElaborateTurn slides (written 2026-11-14, not a recorded session), with the code's check
 * as a badge and links as pills; under it, what the code needs before it accepts an answer (domain
 * elaborate.ts; ADR-AIC-0041, ADR-AIC-0046). The columns share
 * one subgrid, so the questions, answers, badges and rules line up across all three. No motion. No props.
 */
type Part = { s: string; link?: boolean }
const cols: { kind: string; q: string; a: Part[]; check: string; needs: string }[] = [
  {
    kind: 'why',
    q: 'Why is it built this way? What would break if it were not?',
    a: [{ s: 'Thin layers, because Future Me has ten seconds, not ten minutes. Otherwise the note gets skipped.' }],
    check: '✓ a reason',
    needs: 'because · so that · otherwise',
  },
  {
    kind: 'connect',
    q: 'What everyday thing is it like? No jargon.',
    a: [{ s: 'Like reducing a sauce: simmer it down until only the flavor is left, the way an ' }, { s: 'Executive summary', link: true }, { s: ' keeps one decision.' }],
    check: '✓ linked',
    needs: 'note · project · area',
  },
  {
    kind: 'apply',
    q: 'Where would you use it in your own work this month?',
    a: [{ s: 'In ' }, { s: 'Stop Chatting with Your Docs', link: true }, { s: ': five books of notes become this talk.' }],
    check: '✓ 1.Projects',
    needs: 'a project',
  },
]
</script>

<template>
  <div class="kt-eall" role="img"
    aria-label="Elaborate on Distillation, three questions in order. One, why: why is it built this way, what would break if it were not? My answer: thin layers, because Future Me has ten seconds, not ten minutes; otherwise the note gets skipped. Accepted: a reason. Two, connect: what everyday thing is it like, no jargon? My answer: like reducing a sauce: simmer it down until only the flavor is left, the way an Executive summary keeps one decision. Accepted: linked, to any note, project or area. Three, apply: where would you use it in your own work this month? My answer: in Stop Chatting with Your Docs, five books of notes become this talk. Accepted: a project.">
    <div class="kt-eall__row">
      <div v-for="(c, i) in cols" :key="c.kind" class="kt-eall__col">
        <div class="kt-eall__head"><b>{{ i + 1 }}</b>{{ c.kind }}</div>
        <div class="kt-eall__q">
          <img src="/images/logos/gemma-mark.png" alt="">
          <span>{{ c.q }}</span>
        </div>
        <div class="kt-eall__a">
          <img src="/images/speaker.webp" alt="">
          <span>
            <template v-for="p in c.a" :key="p.s"><span v-if="p.link" class="kt-eall__link">{{ p.s }}</span><template v-else>{{ p.s }}</template></template>
          </span>
        </div>
        <div class="kt-eall__check">{{ c.check }}</div>
        <div class="kt-eall__needs"><small>accepted only with</small>{{ c.needs }}</div>
      </div>
    </div>
  </div>
</template>

<style>
.kt-eall { width: 920px; font-family: var(--font-family-sans); display: flex; flex-direction: column; gap: 10px; }
.kt-eall__row { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-template-rows: auto auto 1fr auto auto; column-gap: 16px; }
.kt-eall__col {
  display: grid; grid-template-rows: subgrid; grid-row: span 5; row-gap: 8px;
  padding: 12px 14px 10px;
  border: 2px solid var(--kt-hot);
  border-radius: 16px;
  background: var(--kt-card);
}
.kt-eall__head { display: flex; align-items: center; gap: 10px; font: 700 20px var(--font-family-mono); text-transform: uppercase; letter-spacing: 0.06em; color: var(--kt-hot); }
.kt-eall__head b { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; background: var(--kt-hot); color: var(--kt-bg); font-size: 15px; letter-spacing: 0; }

.kt-eall__q, .kt-eall__a { display: flex; gap: 10px; align-items: flex-start; padding: 8px 10px; border-radius: 12px; font-size: 15px; line-height: 1.28; }
.kt-eall__q img, .kt-eall__a img { width: 24px; height: 24px; flex: none; border-radius: 50%; object-fit: cover; margin-top: 1px; }
.kt-eall__q { background: color-mix(in srgb, var(--kt-c-primary) 14%, var(--kt-bg)); border: 1.5px solid var(--kt-c-primary); color: var(--kt-heading); font-weight: 700; }
.kt-eall__a { background: var(--kt-bg); border: 1.5px solid var(--kt-good); color: var(--kt-fg); font-weight: 600; }
.kt-eall__link { display: inline; padding: 0 5px; -webkit-box-decoration-break: clone; box-decoration-break: clone; border-radius: 999px; background: color-mix(in srgb, var(--kt-info) 22%, var(--kt-bg)); color: var(--kt-heading); font-weight: 700; }
.kt-eall__check { justify-self: center; align-self: start; padding: 3px 10px; border-radius: 999px; background: var(--kt-good); color: var(--kt-bg); font: 800 13px var(--font-family-mono); }
.kt-eall__needs { text-align: center; white-space: nowrap; font: 700 12.5px var(--font-family-mono); color: var(--kt-fg); }
.kt-eall__needs small { display: block; font-size: 11px; font-weight: 600; color: var(--kt-muted); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 2px; }
</style>
