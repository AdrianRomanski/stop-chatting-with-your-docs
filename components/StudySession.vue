<script setup lang="ts">
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * One study session, `coach study`, right after SparRound failed with one gap (ai-performance-coach
 * ADR-AIC-0017, ADR-AIC-0020; domain study-round.ts). Same look as SparRound: four columns, each
 * under its beat: gap → guide → try 1 → try 2.
 * 1. gap: the open gap from the failed round, the core assertion I missed: "The learner then
 *    highlights portions of the bolded text." Offline, nothing is recorded.
 * 2. guide: Gemma asks one guiding question that points at the gap without stating it.
 * 3. try 1: my explanation; the check calls a miss. On the first miss the coach shows the passage
 *    to reread, in the author's words with its page: Building a Second Brain p. 119 (real text,
 *    from the speaker's vault, "07 Distill—Find the Essence (3 of 3)", trimmed with "…").
 * 4. try 2: my explanation in my own words (no six words in a row from the book); closed ✓.
 *    Two tries per gap. Then the next spar is the test: spar again → pass ✓.
 * The explanations are illustrative, as on StyleRound and SparRound. No props.
 */
const { at } = useTimeline(10)

const B = { gap: 0.2, guide: 1.8, try1: 3.6, try2: 6.6 }
const CW = 211
const col = (i: number) => i * (CW + 12)
const beats = [
  { n: 1, name: 'gap', at: B.gap },
  { n: 2, name: 'guide', at: B.guide },
  { n: 3, name: 'try 1', at: B.try1 },
  { n: 4, name: 'try 2', at: B.try2 },
].map((b, i) => ({ ...b, x: col(i) }))
const beat = (n: number) => beats.reduce((m, b) => (at(b.at) ? b.n : m), 0) >= n
const now = (n: number) => beats.reduce((m, b) => (at(b.at) ? b.n : m), 0) === n

const GX = col(0)
const QX = col(1)
const TX = col(2)
const RX = col(3)
</script>

<template>
  <svg class="kt-study" viewBox="0 0 880 344" role="img"
    aria-label="One study session, coach study, on the gap from the failed round. One, the gap: the learner then highlights portions of the bolded text; offline, nothing recorded. Two, Gemma guides: after you bold, what do you do with only the bold? It points, never answers. Three, my first try: I highlight what matters. Miss. The coach shows the passage to reread, in the author's words, Building a Second Brain page 119: Now read through only the bolded passages, and highlight the best of the best passages. Four, my second try: I reread only my bold, and mark the best few lines of it. Closed. Then spar again: pass.">
    <g v-for="b in beats" :key="b.n" class="kt-study__beat" :class="{ 'is-on': beat(b.n), 'is-now': now(b.n) }">
      <rect :x="b.x" y="0" :width="CW" height="30" rx="15" class="kt-study__beatbox" />
      <circle :cx="b.x + 16" cy="15" r="10" class="kt-study__beatdot" />
      <text :x="b.x + 16" y="19" text-anchor="middle" class="kt-study__beatnum">{{ b.n }}</text>
      <text :x="b.x + 34" y="20" class="kt-study__beatname">{{ b.name }}</text>
    </g>

    <!-- 1. the gap from the failed round -->
    <g class="kt-study__fade" :class="{ 'is-on': at(B.gap) }">
      <rect :x="GX" y="42" :width="CW" height="298" rx="14" class="kt-study__panel is-bad" />
      <text :x="GX + 14" y="68" class="kt-study__label">the gap</text>
      <text :x="GX + 14" y="92" class="kt-study__small">from the failed round</text>
      <rect :x="GX + 10" y="104" :width="CW - 20" height="98" rx="10" class="kt-study__gapbox" />
      <text :x="GX + 22" y="124" class="kt-study__key is-bad">open · core assertion</text>
      <text :x="GX + 22" y="146" class="kt-study__btext">The learner then</text>
      <text :x="GX + 22" y="166" class="kt-study__btext">highlights portions of</text>
      <text :x="GX + 22" y="186" class="kt-study__btext">the bolded text.</text>
      <rect :x="GX + 10" y="218" :width="CW - 20" height="30" rx="15" class="kt-study__cmd" />
      <text :x="GX + CW / 2" y="238" text-anchor="middle" class="kt-study__cmdtext">$ coach study</text>
      <text :x="GX + 14" y="306" class="kt-study__small">offline · nothing recorded</text>
      <text :x="GX + 14" y="324" class="kt-study__small">two tries per gap</text>
    </g>

    <!-- 2. Gemma guides -->
    <g class="kt-study__fade" :class="{ 'is-on': at(B.guide) }">
      <rect :x="QX" y="42" :width="CW" height="298" rx="14" class="kt-study__panel is-local" />
      <image href="/images/logos/gemma-mark.png" :x="QX + 14" y="56" width="16" height="16" />
      <text :x="QX + 36" y="69" class="kt-study__who is-local">Gemma 4B · guides</text>
      <rect :x="QX + 10" y="84" :width="CW - 20" height="72" rx="12" class="kt-study__q" />
      <text :x="QX + 22" y="105" class="kt-study__qtext">After you bold,</text>
      <text :x="QX + 22" y="123" class="kt-study__qtext">what do you do with</text>
      <text :x="QX + 22" y="141" class="kt-study__qtext">only the bold?</text>
      <text :x="QX + 14" y="306" class="kt-study__small">points at the gap,</text>
      <text :x="QX + 14" y="324" class="kt-study__small">never the answer</text>
    </g>

    <!-- 3. try 1: a miss, then the author's words -->
    <g class="kt-study__fade" :class="{ 'is-on': at(B.try1) }">
      <rect :x="TX" y="42" :width="CW" height="298" rx="14" class="kt-study__panel" />
      <text :x="TX + 14" y="68" class="kt-study__who">me · my own words</text>
      <rect :x="TX + 10" y="80" :width="CW - 20" height="40" rx="10" class="kt-study__a is-miss" />
      <text :x="TX + 22" y="105" class="kt-study__atext">I highlight what matters.</text>
    </g>
    <g class="kt-study__fade" :class="{ 'is-on': at(B.try1 + 0.8) }">
      <circle :cx="TX + 24" cy="138" r="9" class="kt-study__missdot" />
      <path :d="`M${TX + 20.5} 134.5 l 7 7 M${TX + 27.5} 134.5 l -7 7`" class="kt-study__mark" />
      <text :x="TX + 40" y="143" class="kt-study__missed">miss · reread this</text>
    </g>
    <g class="kt-study__fade" :class="{ 'is-on': at(B.try1 + 1.6) }">
      <rect :x="TX + 10" y="156" :width="CW - 20" height="168" rx="10" class="kt-study__quote" />
      <text :x="TX + 22" y="176" class="kt-study__key">the author's words · p. 119</text>
      <text :x="TX + 22" y="200" class="kt-study__qt">“Now read through</text>
      <text :x="TX + 22" y="219" class="kt-study__qt">only the bolded</text>
      <text :x="TX + 22" y="238" class="kt-study__qt">passages, and</text>
      <text :x="TX + 22" y="257" class="kt-study__qt">highlight … the best</text>
      <text :x="TX + 22" y="276" class="kt-study__qt">of the best passages.”</text>
      <text :x="TX + 22" y="306" class="kt-study__small">Building a Second Brain</text>
    </g>

    <!-- 4. try 2: closed, then spar again -->
    <g class="kt-study__fade" :class="{ 'is-on': at(B.try2) }">
      <rect :x="RX" y="42" :width="CW" height="298" rx="14" class="kt-study__panel is-good" />
      <text :x="RX + 14" y="68" class="kt-study__who">me · my own words</text>
      <rect :x="RX + 10" y="80" :width="CW - 20" height="78" rx="10" class="kt-study__a is-ok" />
      <text :x="RX + 22" y="102" class="kt-study__atext">I reread only my bold,</text>
      <text :x="RX + 22" y="122" class="kt-study__atext">and mark the best few</text>
      <text :x="RX + 22" y="142" class="kt-study__atext">lines of it.</text>
    </g>
    <g class="kt-study__fade" :class="{ 'is-on': at(B.try2 + 0.9) }">
      <circle :cx="RX + 24" cy="178" r="9" class="kt-study__okdot" />
      <path :d="`M${RX + 19.5} 178 l 3 3 6 -6.5`" class="kt-study__mark" />
      <text :x="RX + 40" y="183" class="kt-study__closed">gap closed</text>
    </g>
    <g class="kt-study__fade" :class="{ 'is-on': at(B.try2 + 1.8) }">
      <path :d="`M${RX + CW / 2} 198 V 222`" class="kt-study__arrow" />
      <rect :x="RX + 10" y="226" :width="CW - 20" height="30" rx="15" class="kt-study__cmd" />
      <text :x="RX + CW / 2" y="246" text-anchor="middle" class="kt-study__cmdtext">$ coach spar</text>
    </g>
    <g :transform="`translate(${RX + CW / 2} 286)`">
      <g class="kt-study__stamp" :class="{ 'is-on': at(B.try2 + 2.6) }">
        <rect :x="-(CW - 20) / 2" y="-15" :width="CW - 20" height="30" rx="8" class="kt-study__stampbox" />
        <text y="5" text-anchor="middle" class="kt-study__stamptext">pass ✓</text>
      </g>
    </g>
    <g class="kt-study__fade" :class="{ 'is-on': at(B.try2) }">
      <text :x="RX + 14" y="324" class="kt-study__small">the next spar is the test</text>
    </g>
  </svg>
</template>

<style>
.kt-study { width: 880px; height: auto; overflow: visible; font-family: var(--font-family-sans); }
.kt-study__fade { opacity: 0; transition: opacity 0.4s; }
.kt-study__fade.is-on { opacity: 1; }

.kt-study__beat { opacity: 0.35; transition: opacity 0.3s; }
.kt-study__beat.is-on { opacity: 1; }
.kt-study__beatbox { fill: var(--kt-code-bg); stroke: var(--kt-line-strong); stroke-width: 1.5; transition: stroke 0.3s, fill 0.3s; }
.kt-study__beat.is-now .kt-study__beatbox { stroke: var(--kt-hot); fill: color-mix(in srgb, var(--kt-hot) 14%, var(--kt-bg)); }
.kt-study__beatdot { fill: var(--kt-line-strong); transition: fill 0.3s; }
.kt-study__beat.is-on .kt-study__beatdot { fill: var(--kt-c-primary); }
.kt-study__beat.is-now .kt-study__beatdot { fill: var(--kt-hot); }
.kt-study__beatnum { font: 800 11px var(--font-family-mono); fill: var(--kt-bg); }
.kt-study__beatname { font: 700 13px var(--font-family-mono); fill: var(--kt-heading); }

.kt-study__panel { fill: var(--kt-code-bg); stroke: var(--kt-line-strong); stroke-width: 1.8; }
.kt-study__panel.is-local { stroke: var(--kt-c-primary); }
.kt-study__panel.is-bad { stroke: var(--kt-bad); }
.kt-study__panel.is-good { stroke: var(--kt-good); }
.kt-study__label { font: 700 11.5px var(--font-family-mono); fill: var(--kt-muted); letter-spacing: 0.04em; text-transform: uppercase; }
.kt-study__small { font: 600 11px var(--font-family-mono); fill: var(--kt-muted); }
.kt-study__key { font: 700 10.5px var(--font-family-mono); fill: var(--kt-muted); }
.kt-study__key.is-bad { fill: var(--kt-bad); }
.kt-study__who { font: 700 11.5px var(--font-family-mono); fill: var(--kt-muted); }
.kt-study__who.is-local { fill: var(--kt-cool); }

.kt-study__gapbox { fill: color-mix(in srgb, var(--kt-bad) 10%, var(--kt-bg)); stroke: var(--kt-bad); stroke-width: 1.4; }
.kt-study__btext { font-size: 13.5px; font-weight: 700; fill: var(--kt-fg); }
.kt-study__cmd { fill: var(--kt-bg); stroke: var(--kt-line-strong); stroke-width: 1.4; }
.kt-study__cmdtext { font: 700 12.5px var(--font-family-mono); fill: var(--kt-heading); }

.kt-study__q { fill: color-mix(in srgb, var(--kt-c-primary) 14%, var(--kt-bg)); stroke: var(--kt-c-primary); stroke-width: 1.4; }
.kt-study__qtext { font-size: 14px; font-weight: 700; fill: var(--kt-heading); }

.kt-study__a { fill: var(--kt-bg); stroke: var(--kt-fg); stroke-width: 1.4; }
.kt-study__a.is-miss { stroke: var(--kt-bad); }
.kt-study__a.is-ok { stroke: var(--kt-good); }
.kt-study__atext { font-size: 14px; font-weight: 600; fill: var(--kt-fg); }
.kt-study__missdot { fill: var(--kt-bad); }
.kt-study__okdot { fill: var(--kt-good); }
.kt-study__mark { fill: none; stroke: var(--kt-bg); stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
.kt-study__missed { font: 800 12.5px var(--font-family-mono); fill: var(--kt-bad); }
.kt-study__closed { font: 800 13px var(--font-family-mono); fill: var(--kt-good); }

.kt-study__quote { fill: color-mix(in srgb, var(--kt-warn) 8%, var(--kt-bg)); stroke: var(--kt-warn); stroke-width: 1.4; }
.kt-study__qt { font-size: 14px; font-weight: 600; font-style: italic; fill: var(--kt-heading); }

.kt-study__arrow { stroke: var(--kt-line-strong); stroke-width: 2; }
.kt-study__stamp { opacity: 0; transform: scale(1.4); transform-box: fill-box; transform-origin: center; transition: opacity 0.25s, transform 0.3s cubic-bezier(0.3, 1.6, 0.5, 1); }
.kt-study__stamp.is-on { opacity: 1; transform: none; }
.kt-study__stampbox { fill: none; stroke: var(--kt-good); stroke-width: 2; }
.kt-study__stamptext { font: 800 14px var(--font-family-mono); fill: var(--kt-good); }
</style>
