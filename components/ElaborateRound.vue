<script setup lang="ts">
import { computed } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * Climb step 5, Elaborate, as `coach elaborate Distillation` runs it in the note's style, feynman
 * (ai-performance-coach ADR-0041, ADR-0046; domain elaborate.ts, application elaborating.ts, cli elaborate.ts).
 * Four beats, lit one by one in a bar on top: why → like → use → into the note.
 * Left, three cards, one per question. Each answer types in, then the code checks it (no model):
 * 1. why: a reason needs a causal word and what follows it: ✓ "because". Then one of the three fixed
 *    follow-ups, "What has to be true for that to work?", and my answer to it.
 * 2. like: the feynman connect question (the code's fixed wording). My first answer has no link: ✗, and the
 *    code's message: connect it to something outside this note. I link [[Executive summary]]: ✓ linked.
 * 3. use: the apply question. My answer links the talk's own project, under 1.Projects: ✓.
 * The questions on the cards are shortened from the code's wording (see context/elaborate.md).
 * 4. Right, the concept note: the three answers land under "## My elaborations", the links in the cool
 *    color; then "✓ Elaborate" on the climb, and "not graded · no review".
 * The answers are illustrative (no recorded elaborate session yet). No props.
 */
const { t, at } = useTimeline(17)

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const typer = (s: string, a: number, b: number) => computed(() => s.slice(0, Math.round(s.length * clamp01((t.value - a) / (b - a)))))

const B = { why: 0.2, like: 6.3, use: 11.0, note: 13.8 }
const beats = [
  { n: 1, name: 'why', at: B.why },
  { n: 2, name: 'like', at: B.like },
  { n: 3, name: 'use', at: B.use },
  { n: 4, name: 'into the note', at: B.note },
].map((b, i) => ({ ...b, x: i * 176 }))
const beat = computed(() => beats.reduce((n, b) => (at(b.at) ? b.n : n), 0))

// ── the cards, left ──
const CW = 540
const why = {
  y: 46, h: 124,
  q: 'Why distill a note in layers, not all at once?',
  a: ['Because I don’t know yet what a project will need,', 'so each visit keeps only what proved useful.'],
  fq: 'What has to be true for that to work?',
  fa: 'That I come back to the note for a real project.',
}
const WHY_T = { type: [B.why + 0.6, B.why + 3.0], ok: B.why + 3.3, fq: B.why + 4.1, fa: [B.why + 4.6, B.why + 5.8] }
const whyA0 = typer(why.a[0], WHY_T.type[0], WHY_T.type[0] + (WHY_T.type[1] - WHY_T.type[0]) * 0.52)
const whyA1 = typer(why.a[1], WHY_T.type[0] + (WHY_T.type[1] - WHY_T.type[0]) * 0.52, WHY_T.type[1])
const whyFa = typer(why.fa, WHY_T.fa[0], WHY_T.fa[1])

const like = {
  y: 180, h: 96,
  q: 'What everyday thing is Distillation like? No jargon.',
  a: 'A map with zoom levels: I zoom in only where I need to.',
  no: '✗ Connect it to something outside this note',
  link: 'Executive summary',
  rest: ' is the zoomed-out view.',
}
const LIKE_T = { type: [B.like + 0.5, B.like + 2.2], no: B.like + 2.5, link: [B.like + 3.6, B.like + 4.3], ok: B.like + 4.5 }
const likeA = typer(like.a, LIKE_T.type[0], LIKE_T.type[1])
const likeLink = typer(`+ [[${like.link}]]${like.rest}`, LIKE_T.link[0], LIKE_T.link[1])

const use = {
  y: 286, h: 70,
  q: 'Where would you use Distillation this month?',
  link: '[[Stop Chatting with Your Docs]]',
  rest: ': one key line per slide.',
}
const USE_T = { type: [B.use + 0.5, B.use + 2.0], ok: B.use + 2.3 }
const useA = typer(use.link + use.rest, USE_T.type[0], USE_T.type[1])
const useLink = computed(() => useA.value.slice(0, use.link.length))
const useRest = computed(() => useA.value.slice(use.link.length))

const badges = computed(() => [
  { y: why.y, on: at(WHY_T.ok), ok: true, text: '✓ because' },
  { y: like.y, on: at(LIKE_T.no), ok: at(LIKE_T.ok), text: at(LIKE_T.ok) ? '✓ linked' : '✗ no link' },
  { y: use.y, on: at(USE_T.ok), ok: true, text: '✓ 1.Projects' },
])

// ── the note, right ──
const NX = 564
const NW = 316
const rows = [
  { kind: 'why', parts: [{ s: 'because a project decides what stays' }] },
  { kind: 'like', parts: [{ s: 'map zoom → ' }, { s: '[[Executive summary]]', link: true }] },
  { kind: 'use', parts: [{ s: '→ ' }, { s: '[[Stop Chatting with Your Docs]]', link: true }] },
].map((r, i) => ({ ...r, i, y: 222 + i * 34, in: B.note + 0.5 + i * 0.4 }))
const DONE = B.note + 2.0
</script>

<template>
  <svg class="kt-elab" viewBox="0 0 880 360" role="img"
    aria-label="Elaborate, with coach elaborate on the Distillation concept note, in the feynman style, in four beats. One, why: why distill a note in layers, and not all at once? Because I don't know yet what a project will need, so each visit keeps only what proved useful. The code finds the reason: because. Follow-up: what has to be true for that to work? That I come back to the note for a real project. Two, like: what everyday thing is Distillation like? A map with zoom levels. The code refuses it: connect it to something outside this note. I link Executive summary, the zoomed-out view: linked. Three, use: where would you use Distillation in your own work this month? In the project Stop Chatting with Your Docs: one key line per slide, a link under 1.Projects: accepted. Four, into the note: the three answers are appended to the concept note under My elaborations, with their links. Elaborate is ticked on the climb. Not graded, no review.">
    <!-- the four beats -->
    <g v-for="b in beats" :key="b.n" class="kt-elab__beat" :class="{ 'is-on': beat >= b.n, 'is-now': beat === b.n }">
      <rect :x="b.x" y="0" width="168" height="30" rx="15" class="kt-elab__beatbox" />
      <circle :cx="b.x + 16" cy="15" r="10" class="kt-elab__beatdot" />
      <text :x="b.x + 16" y="19" text-anchor="middle" class="kt-elab__beatnum">{{ b.n }}</text>
      <text :x="b.x + 34" y="20" class="kt-elab__beatname">{{ b.name }}</text>
    </g>
    <text x="880" y="20" text-anchor="end" class="kt-elab__small">feynman style</text>

    <!-- ── why ── -->
    <g class="kt-elab__card" :class="{ 'is-on': at(B.why), 'is-now': beat === 1 }">
      <rect x="0" :y="why.y" :width="CW" :height="why.h" rx="12" class="kt-elab__cardbox" />
      <rect x="14" :y="why.y + 12" width="52" height="20" rx="10" class="kt-elab__chip" />
      <text x="40" :y="why.y + 26" text-anchor="middle" class="kt-elab__chiptext">why</text>
      <image href="/images/logos/gemma-mark.png" x="78" :y="why.y + 13" width="16" height="16" />
      <text x="100" :y="why.y + 26" class="kt-elab__q">{{ why.q }}</text>
      <text x="16" :y="why.y + 54" class="kt-elab__a">{{ whyA0 }}</text>
      <text x="16" :y="why.y + 73" class="kt-elab__a">{{ whyA1 }}</text>
      <g class="kt-elab__fade" :class="{ 'is-on': at(WHY_T.fq) }">
        <text x="16" :y="why.y + 98" class="kt-elab__fq">↳ {{ why.fq }}</text>
      </g>
      <text x="34" :y="why.y + 116" class="kt-elab__a is-small">{{ whyFa }}</text>
    </g>

    <!-- ── like ── -->
    <g class="kt-elab__card" :class="{ 'is-on': at(B.like), 'is-now': beat === 2 }">
      <rect x="0" :y="like.y" :width="CW" :height="like.h" rx="12" class="kt-elab__cardbox" />
      <rect x="14" :y="like.y + 12" width="52" height="20" rx="10" class="kt-elab__chip" />
      <text x="40" :y="like.y + 26" text-anchor="middle" class="kt-elab__chiptext">like</text>
      <text x="78" :y="like.y + 26" class="kt-elab__q">{{ like.q }}</text>
      <text x="16" :y="like.y + 54" class="kt-elab__a">{{ likeA }}</text>
      <text x="16" :y="like.y + 80" class="kt-elab__no kt-elab__fade" :class="{ 'is-on': at(LIKE_T.no) && !at(LIKE_T.link[0] - 0.1) }">{{ like.no }}</text>
      <text x="16" :y="like.y + 80" class="kt-elab__a is-link">{{ likeLink }}</text>
    </g>

    <!-- ── use ── -->
    <g class="kt-elab__card" :class="{ 'is-on': at(B.use), 'is-now': beat === 3 }">
      <rect x="0" :y="use.y" :width="CW" :height="use.h" rx="12" class="kt-elab__cardbox" />
      <rect x="14" :y="use.y + 12" width="52" height="20" rx="10" class="kt-elab__chip" />
      <text x="40" :y="use.y + 26" text-anchor="middle" class="kt-elab__chiptext">use</text>
      <text x="78" :y="use.y + 26" class="kt-elab__q">{{ use.q }}</text>
      <text x="16" :y="use.y + 54" class="kt-elab__a"><tspan class="kt-elab__link">{{ useLink }}</tspan>{{ useRest }}</text>
    </g>

    <!-- the code's check on each answer -->
    <g v-for="b in badges" :key="b.y" class="kt-elab__badge" :class="{ 'is-on': b.on, 'is-ok': b.ok }">
      <rect :x="CW - 112" :y="b.y + 12" width="98" height="20" rx="10" class="kt-elab__badgebox" />
      <text :x="CW - 63" :y="b.y + 26" text-anchor="middle" class="kt-elab__badgetext">{{ b.text }}</text>
    </g>

    <!-- ── the note, right ── -->
    <g class="kt-elab__fade" :class="{ 'is-on': at(B.why) }">
      <rect :x="NX" y="46" :width="NW" height="310" rx="12" class="kt-elab__note" :class="{ 'is-filling': at(B.note) }" />
      <path :d="`M${NX + 20} 58 l 9 10 l -9 10 l -9 -10 z`" class="kt-elab__diamond" />
      <text :x="NX + 38" y="74" class="kt-elab__ntitle">Distillation</text>
      <text :x="NX + NW - 14" y="73" text-anchor="end" class="kt-elab__small">concept note</text>
      <rect v-for="k in 4" :key="k" :x="NX + 20" :y="88 + k * 20" :width="k % 2 ? 250 : 190" height="8" rx="4" class="kt-elab__blur" />
      <text :x="NX + 20" y="200" class="kt-elab__small kt-elab__fade" :class="{ 'is-on': !at(B.note) }">the note, as synthesized</text>
    </g>
    <g class="kt-elab__fade" :class="{ 'is-on': at(B.note + 0.2) }">
      <text :x="NX + 20" y="206" class="kt-elab__h2">## My elaborations</text>
    </g>
    <g v-for="r in rows" :key="r.kind" class="kt-elab__row" :class="{ 'is-on': at(r.in) }">
      <rect :x="NX + 12" :y="r.y" :width="NW - 24" height="28" rx="8" class="kt-elab__rowbox" />
      <text :x="NX + 22" :y="r.y + 18.5" class="kt-elab__rowkind">{{ r.kind }}</text>
      <text :x="NX + 62" :y="r.y + 18.5" class="kt-elab__rowtext">
        <tspan v-for="p in r.parts" :key="p.s" :class="{ 'is-link': p.link }">{{ p.s }}</tspan>
      </text>
    </g>
    <g class="kt-elab__fade" :class="{ 'is-on': at(DONE) }">
      <rect :x="NX + 12" y="324" width="120" height="22" rx="6" class="kt-elab__stamp" />
      <text :x="NX + 72" y="339" text-anchor="middle" class="kt-elab__stamptext">✓ Elaborate</text>
      <text :x="NX + NW - 14" y="339" text-anchor="end" class="kt-elab__small">not graded · no review</text>
    </g>
  </svg>
</template>

<style>
.kt-elab { width: 880px; height: auto; overflow: visible; font-family: var(--font-family-sans); }
.kt-elab__fade { opacity: 0; transition: opacity 0.35s; }
.kt-elab__fade.is-on { opacity: 1; }
.kt-elab__small { font: 600 11px var(--font-family-mono); fill: var(--kt-muted); }

.kt-elab__beat { opacity: 0.35; transition: opacity 0.3s; }
.kt-elab__beat.is-on { opacity: 1; }
.kt-elab__beatbox { fill: var(--kt-code-bg); stroke: var(--kt-line-strong); stroke-width: 1.5; transition: stroke 0.3s, fill 0.3s; }
.kt-elab__beat.is-now .kt-elab__beatbox { stroke: var(--kt-hot); fill: color-mix(in srgb, var(--kt-hot) 14%, var(--kt-bg)); }
.kt-elab__beatdot { fill: var(--kt-line-strong); transition: fill 0.3s; }
.kt-elab__beat.is-on .kt-elab__beatdot { fill: var(--kt-c-primary); }
.kt-elab__beat.is-now .kt-elab__beatdot { fill: var(--kt-hot); }
.kt-elab__beatnum { font: 800 11px var(--font-family-mono); fill: var(--kt-bg); }
.kt-elab__beatname { font: 700 13px var(--font-family-mono); fill: var(--kt-heading); }

/* the cards */
.kt-elab__card { opacity: 0; transform: translateY(6px); transition: opacity 0.35s, transform 0.35s; }
.kt-elab__card.is-on { opacity: 1; transform: none; }
.kt-elab__cardbox { fill: var(--kt-code-bg); stroke: var(--kt-line-strong); stroke-width: 1.5; transition: stroke 0.3s; }
.kt-elab__card.is-now .kt-elab__cardbox { stroke: var(--kt-c-primary); }
.kt-elab__chip { fill: color-mix(in srgb, var(--kt-hot) 16%, var(--kt-bg)); stroke: var(--kt-hot); stroke-width: 1.2; }
.kt-elab__chiptext { font: 800 11px var(--font-family-mono); fill: var(--kt-hot); }
.kt-elab__q { font-size: 13px; font-weight: 600; fill: var(--kt-muted); }
.kt-elab__a { font-size: 15px; font-weight: 700; fill: var(--kt-heading); }
.kt-elab__a.is-small { font-size: 14px; }
.kt-elab__a.is-link { fill: var(--kt-cool); }
.kt-elab__link { fill: var(--kt-cool); font-family: var(--font-family-mono); font-size: 13.5px; }
.kt-elab__fq { font: 700 12.5px var(--font-family-mono); fill: var(--kt-cool); }
.kt-elab__no { font: 700 12.5px var(--font-family-mono); fill: var(--kt-bad); }

.kt-elab__badge { opacity: 0; transform: scale(1.3); transform-box: fill-box; transform-origin: center; transition: opacity 0.25s, transform 0.3s cubic-bezier(0.3, 1.6, 0.5, 1); }
.kt-elab__badge.is-on { opacity: 1; transform: none; }
.kt-elab__badgebox { fill: var(--kt-bad); transition: fill 0.3s; }
.kt-elab__badge.is-ok .kt-elab__badgebox { fill: var(--kt-good); }
.kt-elab__badgetext { font: 800 11px var(--font-family-mono); fill: var(--kt-bg); }

/* the note */
.kt-elab__note { fill: var(--kt-code-bg); stroke: var(--kt-line-strong); stroke-width: 1.8; transition: stroke 0.4s; }
.kt-elab__note.is-filling { stroke: var(--kt-hot); }
.kt-elab__diamond { fill: color-mix(in srgb, var(--kt-hot) 35%, var(--kt-bg)); stroke: var(--kt-hot); stroke-width: 1.6; }
.kt-elab__ntitle { font-size: 17px; font-weight: 800; fill: var(--kt-heading); }
.kt-elab__blur { fill: var(--kt-line-strong); opacity: 0.5; }
.kt-elab__h2 { font: 800 13px var(--font-family-mono); fill: var(--kt-hot); }
.kt-elab__row { opacity: 0; transform: translateX(-10px); transition: opacity 0.35s, transform 0.35s; }
.kt-elab__row.is-on { opacity: 1; transform: none; }
.kt-elab__rowbox { fill: color-mix(in srgb, var(--kt-fg) 4%, var(--kt-bg)); stroke: var(--kt-card-line); stroke-width: 1.2; }
.kt-elab__rowkind { font: 800 11px var(--font-family-mono); fill: var(--kt-hot); }
.kt-elab__rowtext { font-size: 12px; font-weight: 600; fill: var(--kt-fg); }
.kt-elab__rowtext .is-link { fill: var(--kt-cool); font-family: var(--font-family-mono); font-size: 11.5px; }
.kt-elab__stamp { fill: none; stroke: var(--kt-good); stroke-width: 1.6; }
.kt-elab__stamptext { font: 800 11.5px var(--font-family-mono); fill: var(--kt-good); }

@media (prefers-reduced-motion: reduce) {
  .kt-elab * { transition: none !important; }
}
</style>
