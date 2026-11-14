<script setup lang="ts">
/**
 * Climb step 5, Elaborate, before the three rounds: what `coach elaborate <concept note>` asks.
 * Three boxes land one by one (kt-stagger), in the order the coach asks them: why, connect, apply.
 * Each box: the kind, the question (the code's fixed wording, ai-performance-coach `fallbackQuestions`;
 * connect in the feynman style), and what the code needs before it accepts an answer (domain
 * elaborate.ts; ADR-0041, ADR-0046). At the foot: not graded, no review; the answers go into the note.
 * No props.
 */
const boxes = [
  {
    kind: 'why',
    q: 'Why is it built this way? What would break if it were not?',
    needs: 'a reason: “because”, “so that”, “otherwise” …',
    plus: '+ up to two follow-ups',
  },
  {
    kind: 'connect',
    q: 'What everyday thing is it like? Explain it without jargon.',
    needs: 'a [[link]] to another note, or a thing from your own work',
    plus: 'the only question the style changes',
  },
  {
    kind: 'apply',
    q: 'Where would you use it in your own work this month?',
    needs: 'a real place: a project, a file, a team, or a link under 1.Projects',
    plus: '+ one follow-up',
  },
]
</script>

<template>
  <div class="kt-esteps" role="img"
    aria-label="Elaborate asks three questions, in this order. One, why: why is it built this way, what would break if it were not? The code needs a reason: because, so that, otherwise. Up to two follow-ups. Two, connect: what everyday thing is it like, explain it without jargon. The code needs a link to another note, or a thing from your own work. It's the only question the style changes. Three, apply: where would you use it in your own work this month? The code needs a real place: a project, a file, a team, or a link under 1.Projects. Not graded, no review: the answers go into the note, under My elaborations.">
    <div class="kt-esteps__row kt-stagger">
      <div v-for="(b, i) in boxes" :key="b.kind" class="kt-esteps__box">
        <div class="kt-esteps__head"><b>{{ i + 1 }}</b>{{ b.kind }}</div>
        <p class="kt-esteps__q">“{{ b.q }}”</p>
        <div class="kt-esteps__key">accepted only with</div>
        <p class="kt-esteps__needs">{{ b.needs }}</p>
        <div class="kt-esteps__plus">{{ b.plus }}</div>
      </div>
    </div>
    <div class="kt-esteps__foot kt-stagger"><span>checked in code · not graded · no review · the answers go under <code>## My elaborations</code></span></div>
  </div>
</template>

<style>
.kt-esteps { width: 900px; font-family: var(--font-family-sans); display: flex; flex-direction: column; gap: 22px; }
.kt-esteps__row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.kt-esteps__box {
  display: flex; flex-direction: column;
  padding: 18px 20px 16px;
  border: 2px solid var(--kt-hot);
  border-radius: 16px;
  background: var(--kt-card);
  box-shadow: 0 0 24px color-mix(in srgb, var(--kt-hot) 18%, transparent);
}
.kt-esteps__head { display: flex; align-items: center; gap: 10px; font: 700 26px var(--font-family-mono); text-transform: uppercase; letter-spacing: 0.06em; color: var(--kt-hot); }
.kt-esteps__head b { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 50%; background: var(--kt-hot); color: var(--kt-bg); font-size: 16px; letter-spacing: 0; }
.kt-esteps__q { margin: 14px 0 0; font-size: 19px; line-height: 1.38; font-weight: 700; color: var(--kt-heading); min-height: 104px; }
.kt-esteps__key { margin-top: 10px; font: 700 12px var(--font-family-mono); text-transform: uppercase; letter-spacing: 0.08em; color: var(--kt-good); }
.kt-esteps__needs { margin: 6px 0 0; font-size: 16px; line-height: 1.4; color: var(--kt-fg); flex: 1; }
.kt-esteps__plus { margin-top: 12px; font: 600 12.5px var(--font-family-mono); color: var(--kt-muted); }
.kt-esteps__foot { text-align: center; font: 600 14px var(--font-family-mono); color: var(--kt-muted); }
.kt-esteps__foot > span { animation-delay: 0.9s !important; }
.kt-esteps__foot code { color: var(--kt-hot); background: none !important; padding: 0 !important; font-size: inherit; }
</style>
