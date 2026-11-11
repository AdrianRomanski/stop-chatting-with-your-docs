<script setup lang="ts">
import { computed } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * One sparring round, `coach spar`, in four columns, each under its beat in the bar on top:
 * concept → style → answer → check.
 * 1. concept: I pick the concept to be sparred on, from the book's concepts (as on GroupLayers):
 *    Distillation.
 * 2. style: I pick the coach's style, one of four (as on CoachStyles): socratic.
 * 3. answer: Gemma 4B, offline, asks (the socratic question of CoachStyles); my answer types in.
 * 4. check: Gemma 12B, offline, verifies: one core assertion at a time (as on ConceptNote), ticked
 *    only with my own words quoted as evidence. Covered ✓, pass.
 * No props.
 */
const { t, at } = useTimeline(10.5)

const B = { concept: 0.2, style: 2.4, answer: 4.0, check: 7.6 }
const CW = 211 // a column, and its beat above it
const col = (i: number) => i * (CW + 12)
const beats = [
  { n: 1, name: 'concept', at: B.concept },
  { n: 2, name: 'style', at: B.style },
  { n: 3, name: 'answer', at: B.answer },
  { n: 4, name: 'check', at: B.check },
].map((b, i) => ({ ...b, x: col(i) }))
const beat = computed(() => beats.reduce((n, b) => (at(b.at) ? b.n : n), 0))

const ROW = (i: number) => 88 + i * 40

// 1. the concepts of the book; the cursor runs down and stops on Distillation
const CX = col(0)
const concepts = ['Keep what resonates', 'PARA', 'Distillation', 'Hemingway bridge'].map((name, i) => ({
  name, i, y: ROW(i), lit: B.concept + 0.5 + i * 0.3,
}))
const PICK_C = 2
const PICKED_C = B.concept + 1.8

// 2. the four styles
const SX = col(1)
const styles = ['feynman', 'socratic', 'cornell', 'devil'].map((name, i) => ({
  name, i, y: ROW(i), lit: B.style + 0.2 + i * 0.2,
}))
const PICK_S = 1
const PICKED_S = B.style + 1.1

// 3. the question, and my answer typing in
const MX = col(2)
const question = ['Highlighting helps.', 'So why not highlight', 'half the page?']
const answer = ['Then nothing stands out.', 'Each layer keeps', '10–20% of the last.']
const TYPE: [number, number] = [B.answer + 0.9, B.answer + 3.1]
const total = answer.join(' ').length
const typed = computed(() => {
  let left = Math.round(total * Math.min(1, Math.max(0, (t.value - TYPE[0]) / (TYPE[1] - TYPE[0]))))
  return answer.map(l => {
    const s = l.slice(0, Math.max(0, left))
    left -= l.length + 1
    return s
  })
})

// 4. the check
const RX = col(3)
const C = { assertion: B.check + 0.4, evidence: B.check + 1.1, covered: B.check + 1.8, pass: B.check + 2.3 }
</script>

<template>
  <svg class="kt-spar" viewBox="0 0 880 344" role="img"
    aria-label="One sparring round, in four beats. One, concept: I pick the concept to be sparred on: Distillation. Two, style: I pick the coach's style, one of four: socratic. Three, answer: Gemma 4B, offline, asks: Highlighting helps. So why not highlight half the page? I answer: Then nothing stands out. Each layer keeps 10 to 20 percent of the last. Four, check: Gemma 12B, offline, verifies one core assertion at a time, against my own words: the learner then highlights portions of the bolded text; my words: each layer keeps 10 to 20 percent of the last. Covered. Pass.">
    <!-- the four beats, one over each column -->
    <g v-for="b in beats" :key="b.n" class="kt-spar__beat" :class="{ 'is-on': beat >= b.n, 'is-now': beat === b.n }">
      <rect :x="b.x" y="0" :width="CW" height="30" rx="15" class="kt-spar__beatbox" />
      <circle :cx="b.x + 16" cy="15" r="10" class="kt-spar__beatdot" />
      <text :x="b.x + 16" y="19" text-anchor="middle" class="kt-spar__beatnum">{{ b.n }}</text>
      <text :x="b.x + 34" y="20" class="kt-spar__beatname">{{ b.name }}</text>
    </g>

    <!-- 1. pick a concept -->
    <g class="kt-spar__fade" :class="{ 'is-on': at(B.concept) }">
      <rect :x="CX" y="42" :width="CW" height="298" rx="14" class="kt-spar__panel" />
      <text :x="CX + 14" y="68" class="kt-spar__label">pick a concept</text>
      <text :x="CX + 14" y="324" class="kt-spar__small">from the book's concepts</text>
    </g>
    <g v-for="c in concepts" :key="c.name" class="kt-spar__item"
      :class="{ 'is-on': at(B.concept + 0.2), 'is-lit': at(c.lit) && !at(c.lit + 0.3) && !at(PICKED_C), 'is-picked': c.i === PICK_C && at(PICKED_C), 'is-dim': c.i !== PICK_C && at(PICKED_C) }">
      <rect :x="CX + 10" :y="c.y" :width="CW - 20" height="30" rx="8" class="kt-spar__itembox" />
      <path :d="`M${CX + 24} ${c.y + 8} l 7 7 l -7 7 l -7 -7 z`" class="kt-spar__diamond" />
      <text :x="CX + 40" :y="c.y + 20" class="kt-spar__itemtext">{{ c.name }}</text>
    </g>

    <!-- 2. pick a style -->
    <g class="kt-spar__fade" :class="{ 'is-on': at(B.style) }">
      <rect :x="SX" y="42" :width="CW" height="298" rx="14" class="kt-spar__panel" />
      <text :x="SX + 14" y="68" class="kt-spar__label">pick the style</text>
      <text :x="SX + 14" y="324" class="kt-spar__small">how the coach pushes me</text>
    </g>
    <g v-for="s in styles" :key="s.name" class="kt-spar__chip"
      :class="{ 'is-on': at(s.lit - 0.1), 'is-picked': s.i === PICK_S && at(PICKED_S), 'is-dim': s.i !== PICK_S && at(PICKED_S) }">
      <rect :x="SX + 10" :y="s.y" :width="CW - 20" height="30" rx="15" class="kt-spar__chipbox" />
      <text :x="SX + CW / 2" :y="s.y + 19.5" text-anchor="middle" class="kt-spar__chiptext">{{ s.name }}</text>
    </g>

    <!-- 3. Gemma 4B asks, I answer -->
    <g class="kt-spar__fade" :class="{ 'is-on': at(B.answer) }">
      <rect :x="MX" y="42" :width="CW" height="298" rx="14" class="kt-spar__panel is-local" />
      <image href="/images/logos/gemma-mark.png" :x="MX + 14" y="56" width="16" height="16" />
      <text :x="MX + 36" y="69" class="kt-spar__who is-local">Gemma 4B · asks</text>
      <rect :x="MX + 10" y="84" :width="CW - 20" height="72" rx="12" class="kt-spar__q" />
      <text v-for="(l, i) in question" :key="l" :x="MX + 22" :y="105 + i * 18" class="kt-spar__qtext">{{ l }}</text>
    </g>
    <g class="kt-spar__fade" :class="{ 'is-on': at(TYPE[0] - 0.3) }">
      <text :x="MX + 14" y="182" class="kt-spar__who">me · my own words</text>
      <rect :x="MX + 10" y="192" :width="CW - 20" height="72" rx="12" class="kt-spar__a" :class="{ 'is-sent': at(TYPE[1] + 0.2) }" />
    </g>
    <text v-for="(l, i) in typed" :key="`a${i}`" :x="MX + 22" :y="213 + i * 18" class="kt-spar__atext">{{ l }}</text>
    <g class="kt-spar__fade" :class="{ 'is-on': at(B.answer) }">
      <text :x="MX + 14" y="306" class="kt-spar__small">offline · one question</text>
      <text :x="MX + 14" y="324" class="kt-spar__small">at a time, never the answer</text>
    </g>

    <!-- 4. Gemma 12B verifies -->
    <g class="kt-spar__fade" :class="{ 'is-on': at(B.check) }">
      <rect :x="RX" y="42" :width="CW" height="298" rx="14" class="kt-spar__panel is-check" />
      <image href="/images/logos/gemma-mark.png" :x="RX + 14" y="56" width="16" height="16" />
      <text :x="RX + 36" y="69" class="kt-spar__who is-check">Gemma 12B · verifies</text>
    </g>
    <g class="kt-spar__fade" :class="{ 'is-on': at(C.assertion) }">
      <rect :x="RX + 10" y="84" :width="CW - 20" height="80" rx="10" class="kt-spar__abox" />
      <text :x="RX + 22" y="102" class="kt-spar__key">core assertion</text>
      <text :x="RX + 22" y="121" class="kt-spar__btext">The learner then</text>
      <text :x="RX + 22" y="138" class="kt-spar__btext">highlights portions of</text>
      <text :x="RX + 22" y="155" class="kt-spar__btext">the bolded text.</text>
    </g>
    <g class="kt-spar__fade" :class="{ 'is-on': at(C.evidence) }">
      <rect :x="RX + 10" y="176" :width="CW - 20" height="64" rx="10" class="kt-spar__ebox" :class="{ 'is-ok': at(C.covered) }" />
      <text :x="RX + 22" y="194" class="kt-spar__key">quote from my words</text>
      <text :x="RX + 22" y="213" class="kt-spar__btext">“Each layer keeps</text>
      <text :x="RX + 22" y="230" class="kt-spar__btext">10–20% of the last.”</text>
    </g>
    <g class="kt-spar__fade" :class="{ 'is-on': at(C.covered) }">
      <circle :cx="RX + 24" cy="262" r="10" class="kt-spar__ok" />
      <path :d="`M${RX + 19} 262 l 3.5 3.5 6.5 -7`" class="kt-spar__oktick" />
      <text :x="RX + 42" y="267" class="kt-spar__covered">covered</text>
    </g>
    <g :transform="`translate(${RX + CW / 2} 290)`">
      <g class="kt-spar__stamp" :class="{ 'is-on': at(C.pass) }">
        <rect :x="-(CW - 20) / 2" y="-15" :width="CW - 20" height="30" rx="8" class="kt-spar__stampbox" />
        <text y="5" text-anchor="middle" class="kt-spar__stamptext">pass ✓</text>
      </g>
    </g>
    <g class="kt-spar__fade" :class="{ 'is-on': at(B.check) }">
      <text :x="RX + 14" y="324" class="kt-spar__small">one assertion at a time</text>
    </g>
  </svg>
</template>

<style>
.kt-spar { width: 880px; height: auto; overflow: visible; font-family: var(--font-family-sans); }
.kt-spar__fade { opacity: 0; transition: opacity 0.4s; }
.kt-spar__fade.is-on { opacity: 1; }

.kt-spar__beat { opacity: 0.35; transition: opacity 0.3s; }
.kt-spar__beat.is-on { opacity: 1; }
.kt-spar__beatbox { fill: var(--kt-code-bg); stroke: var(--kt-line-strong); stroke-width: 1.5; transition: stroke 0.3s, fill 0.3s; }
.kt-spar__beat.is-now .kt-spar__beatbox { stroke: var(--kt-hot); fill: color-mix(in srgb, var(--kt-hot) 14%, var(--kt-bg)); }
.kt-spar__beatdot { fill: var(--kt-line-strong); transition: fill 0.3s; }
.kt-spar__beat.is-on .kt-spar__beatdot { fill: var(--kt-c-primary); }
.kt-spar__beat.is-now .kt-spar__beatdot { fill: var(--kt-hot); }
.kt-spar__beatnum { font: 800 11px var(--font-family-mono); fill: var(--kt-bg); }
.kt-spar__beatname { font: 700 13px var(--font-family-mono); fill: var(--kt-heading); }

.kt-spar__panel { fill: var(--kt-code-bg); stroke: var(--kt-line-strong); stroke-width: 1.8; }
.kt-spar__panel.is-local { stroke: var(--kt-c-primary); }
.kt-spar__panel.is-check { stroke: var(--kt-good); }
.kt-spar__label { font: 700 11.5px var(--font-family-mono); fill: var(--kt-muted); letter-spacing: 0.04em; text-transform: uppercase; }
.kt-spar__small { font: 600 11px var(--font-family-mono); fill: var(--kt-muted); }
.kt-spar__key { font: 700 10.5px var(--font-family-mono); fill: var(--kt-muted); }

/* concepts */
.kt-spar__item { opacity: 0; transition: opacity 0.3s; }
.kt-spar__item.is-on { opacity: 1; }
.kt-spar__item.is-dim { opacity: 0.4; }
.kt-spar__itembox { fill: transparent; stroke: transparent; stroke-width: 1.5; transition: fill 0.2s, stroke 0.2s; }
.kt-spar__item.is-lit .kt-spar__itembox { fill: color-mix(in srgb, var(--kt-fg) 6%, transparent); stroke: var(--kt-line-strong); }
.kt-spar__item.is-picked .kt-spar__itembox { fill: color-mix(in srgb, var(--kt-hot) 16%, var(--kt-bg)); stroke: var(--kt-hot); }
.kt-spar__diamond { fill: color-mix(in srgb, var(--kt-hot) 30%, var(--kt-bg)); stroke: var(--kt-hot); stroke-width: 1.4; }
.kt-spar__itemtext { font-size: 14px; font-weight: 700; fill: var(--kt-fg); }
.kt-spar__item.is-picked .kt-spar__itemtext { fill: var(--kt-heading); font-weight: 800; }

/* styles */
.kt-spar__chip { opacity: 0; transition: opacity 0.3s; }
.kt-spar__chip.is-on { opacity: 1; }
.kt-spar__chip.is-dim { opacity: 0.4; }
.kt-spar__chipbox { fill: var(--kt-bg); stroke: var(--kt-line-strong); stroke-width: 1.5; transition: fill 0.25s, stroke 0.25s; }
.kt-spar__chiptext { font: 700 11.5px var(--font-family-mono); fill: var(--kt-fg); transition: fill 0.25s; }
.kt-spar__chip.is-picked .kt-spar__chipbox { fill: var(--kt-warn); stroke: var(--kt-warn); }
.kt-spar__chip.is-picked .kt-spar__chiptext { fill: var(--kt-bg); }

/* the chat */
.kt-spar__who { font: 700 11.5px var(--font-family-mono); fill: var(--kt-muted); }
.kt-spar__who.is-local { fill: var(--kt-cool); }
.kt-spar__who.is-check { fill: var(--kt-good); }
.kt-spar__q { fill: color-mix(in srgb, var(--kt-c-primary) 14%, var(--kt-bg)); stroke: var(--kt-c-primary); stroke-width: 1.4; }
.kt-spar__qtext { font-size: 14px; font-weight: 700; fill: var(--kt-heading); }
.kt-spar__a { fill: var(--kt-bg); stroke: var(--kt-c-primary-soft); stroke-width: 1.4; transition: stroke 0.3s; }
.kt-spar__a.is-sent { stroke: var(--kt-fg); }
.kt-spar__atext { font-size: 14px; font-weight: 600; fill: var(--kt-fg); }

/* the check */
.kt-spar__abox { fill: color-mix(in srgb, var(--kt-fg) 4%, var(--kt-bg)); stroke: var(--kt-card-line); stroke-width: 1.2; }
.kt-spar__ebox { fill: var(--kt-bg); stroke: var(--kt-line-strong); stroke-width: 1.4; transition: stroke 0.3s; }
.kt-spar__ebox.is-ok { stroke: var(--kt-good); }
.kt-spar__btext { font-size: 12.5px; font-weight: 700; fill: var(--kt-fg); }
.kt-spar__ok { fill: var(--kt-good); }
.kt-spar__oktick { fill: none; stroke: var(--kt-bg); stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
.kt-spar__covered { font: 800 13px var(--font-family-mono); fill: var(--kt-good); }
.kt-spar__stamp { opacity: 0; transform: scale(1.4); transform-box: fill-box; transform-origin: center; transition: opacity 0.25s, transform 0.3s cubic-bezier(0.3, 1.6, 0.5, 1); }
.kt-spar__stamp.is-on { opacity: 1; transform: none; }
.kt-spar__stampbox { fill: none; stroke: var(--kt-good); stroke-width: 2; }
.kt-spar__stamptext { font: 800 14px var(--font-family-mono); fill: var(--kt-good); }

</style>
