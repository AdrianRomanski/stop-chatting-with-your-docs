<script setup lang="ts">
import { computed } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * One question of climb step 5, Elaborate, up close: one slide per kind after ElaborateSteps, on the
 * concept the talk follows, Distillation (`coach elaborate Distillation`, feynman style).
 * On top, the three kinds (why · connect · apply), the current one lit. Below, the round as a chat:
 * Gemma's question, my answer, and the code's check on it (a badge on the answer; no model checks).
 * - why: the fixed question, my answer (✓ a reason: "because", "otherwise"); then the follow-up
 *   "What has to be true for that to work?" and my answer (✓ "so that").
 * Links to other notes show as pills (🔗 + the note's name, no brackets, no folder path).
 * - connect: the feynman question; my first try, the soup, links to nothing: the code refuses it
 *   with its fixed message; the second try links [[Executive summary]] and [[Fluency illusion]]: ✓.
 * - apply: the fixed question; my answer links the talk's own project under 1.Projects: ✓.
 * Questions and refusal: the code's fixed wording (ai-performance-coach `fallbackQuestions`, domain
 * elaborate.ts, ADR-0041, ADR-0046). The answers are the speaker's (written 2026-11-14), not a
 * recorded session.
 * - `kind`: why | connect | apply
 */
const props = defineProps<{ kind: 'why' | 'connect' | 'apply' }>()

type Turn = { who: 'coach' | 'me' | 'code'; label: string; text: string; check?: string; bad?: boolean; at: number }

const ROUNDS: Record<string, { dur: number; turns: Turn[] }> = {
  why: {
    dur: 9,
    turns: [
      { who: 'coach', label: 'why', text: 'Why is Distillation built this way? What would break if it were not?', at: 0.3 },
      { who: 'me', label: 'my answer', check: '✓ a reason', text: 'We mark in thin layers because Future Me opening a note under a deadline has ten seconds, not ten minutes. Otherwise a three-page wall of text gets skipped, and I might as well never have saved it.', at: 2.2 },
      { who: 'coach', label: 'follow-up', text: 'What has to be true for that to work?', at: 5.6 },
      { who: 'me', label: 'my answer', check: '✓ so that', text: 'Each pass keeps only 10–20% of the layer before it, so that the yellow marks actually pop out when I scan the page.', at: 7.0 },
    ],
  },
  connect: {
    dur: 10,
    turns: [
      { who: 'coach', label: 'connect', text: 'What everyday thing is Distillation like? Explain it without jargon.', at: 0.3 },
      { who: 'me', label: '1st try', check: '✗ no link', bad: true, text: 'It is like boiling a pot of soup down into a rich sauce, so only the flavor stays.', at: 2.0 },
      { who: 'code', label: 'refused · by the code', bad: true, text: 'Connect it to something outside this note: link another note, or name a thing from your own work. A link to this note does not count.', at: 4.0 },
      { who: 'me', label: '2nd try', check: '✓ linked', text: 'Like boiling sap into syrup, or how an [[Executive summary]] gives you the main decision on page one. Except, unlike an AI summary that causes the [[Fluency illusion]], I boiled the layers down myself.', at: 6.6 },
    ],
  },
  apply: {
    dur: 6,
    turns: [
      { who: 'coach', label: 'apply', text: 'Where would you use Distillation in your own work this month?', at: 0.3 },
      { who: 'me', label: 'my answer', check: '✓ 1.Projects', text: 'In [[1.Projects/Stop Chatting with Your Docs]], when I turn my raw chapter notes from five books into the slides for this talk, without re-reading 1,200 pages the night before DevFest Wrocław.', at: 2.2 },
    ],
  },
}

const { at } = useTimeline(ROUNDS[props.kind].dur)
const r = computed(() => ROUNDS[props.kind])
const KINDS = ['why', 'connect', 'apply']
const CHECK_AFTER = 1.4

// a [[link]] shows as a pill with the note's name only: no brackets, no folder path
const parts = (s: string) => s.split(/(\[\[[^\]]+\]\])/).filter(Boolean).map(p => p.startsWith('[[')
  ? { s: p.slice(2, -2).split('/').pop()!, link: true }
  : { s: p, link: false })
const label = computed(() => `Elaborate, ${props.kind}. ${r.value.turns.map(t => `${t.label}: ${t.text}${t.check ? ` (${t.check.replace(/[✓✗] ?/, '')})` : ''}`).join(' ')}`)
</script>

<template>
  <div class="kt-eturn" role="img" :aria-label="label">
    <div class="kt-eturn__kinds">
      <span v-for="(k, i) in KINDS" :key="k" :class="{ 'is-now': k === kind, 'is-done': KINDS.indexOf(kind) > i }"><b>{{ i + 1 }}</b>{{ k }}</span>
      <em>coach elaborate Distillation · feynman</em>
    </div>
    <div class="kt-eturn__turns">
      <div v-for="tn in r.turns" :key="tn.text" class="kt-eturn__turn" :class="[`is-${tn.who}`, { 'is-on': at(tn.at), 'is-bad': tn.bad }]">
        <img v-if="tn.who === 'me'" src="/images/speaker.webp" alt="">
        <img v-else-if="tn.who === 'coach'" src="/images/logos/gemma-mark.png" alt="">
        <i v-else>{ }</i>
        <span>
          <small>{{ tn.label }}<b v-if="tn.check" class="kt-eturn__check" :class="{ 'is-on': at(tn.at + CHECK_AFTER), 'is-bad': tn.bad }">{{ tn.check }}</b></small>
          <template v-for="p in parts(tn.text)" :key="p.s"><span v-if="p.link" class="kt-eturn__link">{{ p.s }}</span><template v-else>{{ p.s }}</template></template>
        </span>
      </div>
    </div>
  </div>
</template>

<style>
.kt-eturn { width: 920px; font-family: var(--font-family-sans); display: flex; flex-direction: column; gap: 10px; }

.kt-eturn__kinds { display: flex; align-items: center; gap: 10px; }
.kt-eturn__kinds span { display: flex; align-items: center; gap: 8px; padding: 3px 14px 3px 4px; border-radius: 999px; border: 1.5px solid var(--kt-line-strong); font: 700 14px var(--font-family-mono); text-transform: uppercase; letter-spacing: 0.06em; color: var(--kt-muted); }
.kt-eturn__kinds span b { display: grid; place-items: center; width: 22px; height: 22px; border-radius: 50%; background: var(--kt-line-strong); color: var(--kt-bg); font-size: 12px; }
.kt-eturn__kinds span.is-done { color: var(--kt-good); border-color: var(--kt-good); }
.kt-eturn__kinds span.is-done b { background: var(--kt-good); }
.kt-eturn__kinds span.is-now { color: var(--kt-hot); border-color: var(--kt-hot); background: color-mix(in srgb, var(--kt-hot) 14%, transparent); }
.kt-eturn__kinds span.is-now b { background: var(--kt-hot); }
.kt-eturn__kinds em { margin-left: auto; font: 600 13px var(--font-family-mono); font-style: normal; color: var(--kt-muted); }

.kt-eturn__turns { display: flex; flex-direction: column; gap: 8px; }
.kt-eturn__turn { display: flex; align-items: flex-start; gap: 10px; opacity: 0; transform: translateY(8px); transition: opacity 0.4s, transform 0.4s; }
.kt-eturn__turn.is-on { opacity: 1; transform: none; }
.kt-eturn__turn.is-me { flex-direction: row-reverse; padding-left: 40px; }
.kt-eturn__turn.is-coach, .kt-eturn__turn.is-code { padding-right: 40px; }
.kt-eturn__turn img, .kt-eturn__turn i { flex: none; width: 34px; height: 34px; margin-top: 4px; border-radius: 50%; object-fit: cover; }
.kt-eturn__turn i { display: grid; place-items: center; border: 1.5px solid var(--kt-bad); font: 800 12px var(--font-family-mono); font-style: normal; color: var(--kt-bad); }
.kt-eturn__turn span { padding: 7px 15px 8px; border-radius: 14px; font-size: 17px; line-height: 1.36; }
.kt-eturn__turn small { display: flex; align-items: center; gap: 10px; margin-bottom: 2px; font: 700 12px var(--font-family-mono); text-transform: uppercase; letter-spacing: 0.06em; color: var(--kt-muted); }
.kt-eturn__turn.is-coach span { border: 1.5px solid var(--kt-hot); border-top-left-radius: 3px; background: color-mix(in srgb, var(--kt-hot) 12%, transparent); color: var(--kt-heading); font-weight: 700; }
.kt-eturn__turn.is-coach small { color: var(--kt-hot); }
.kt-eturn__turn.is-code span { border: 1.5px dashed var(--kt-bad); border-top-left-radius: 3px; background: color-mix(in srgb, var(--kt-bad) 10%, transparent); color: var(--kt-fg); font: 600 14.5px/1.4 var(--font-family-mono); }
.kt-eturn__turn.is-code small { color: var(--kt-bad); }
.kt-eturn__turn.is-me span { border-top-right-radius: 3px; background: var(--kt-tint-secondary); color: var(--kt-fg); font-weight: 600; border: 1.5px solid transparent; transition: border-color 0.3s; }
.kt-eturn__turn.is-me:has(.kt-eturn__check.is-on) span { border-color: var(--kt-good); }
.kt-eturn__turn.is-me.is-bad:has(.kt-eturn__check.is-on) span { border-color: var(--kt-bad); }
/* a link to another note: a pill with a chain mark, so it reads as a link at a glance */
.kt-eturn__turn span.kt-eturn__link { display: inline-flex; align-items: center; gap: 5px; padding: 0 10px 0 8px; margin: 0 1px; border-radius: 999px; border: 1.5px solid var(--kt-cool) !important; background: color-mix(in srgb, var(--kt-cool) 18%, transparent) !important; color: var(--kt-cool) !important; font-size: 0.92em; font-weight: 700; line-height: 1.3; white-space: nowrap; vertical-align: baseline; }
.kt-eturn__turn span.kt-eturn__link::before { content: '🔗'; font-size: 0.8em; }

.kt-eturn__check { padding: 1px 9px; border-radius: 999px; background: var(--kt-good); color: var(--kt-bg); letter-spacing: 0.04em; opacity: 0; transform: scale(1.3); transition: opacity 0.25s, transform 0.3s cubic-bezier(0.3, 1.6, 0.5, 1); }
.kt-eturn__check.is-bad { background: var(--kt-bad); }
.kt-eturn__check.is-on { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  .kt-eturn * { transition: none !important; }
}
</style>
