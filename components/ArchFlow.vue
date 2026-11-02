<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * The architecture, played as one real session, step by step, once. The laptop (offline) holds the
 * "second brain" (notes, in Obsidian), kb-template's MCP vault server next to it, and "ai-coach"
 * (the coach CLI with its terminal, Ollama with Gemma 4B and 12B); ai-coach reaches over the
 * boundary into the cloud around Gemini 4 Argon (adapter-gemini). One boundary, a gate and a lock.
 * The map builds first (about 8 s), then one step per sentence of the narration (S below).
 * Only the step that plays moves; each actor gets its number badge when its turn comes, and keeps it.
 *   1  "$ coach spar" types; the concept note (the diamond) travels notes → kb-template → the coach
 *   2  the coach hands it to Gemma 4B, which glows and sends me a "?"
 *   3  a weak answer goes to Gemma 12B: ✕, "Tier 1 · failed"; 4B asks again, a good answer:
 *      ✓, "Tier 1 · completed"
 *   4  "$ coach judge" types; my answer and claims cross the gate to Argon, which sends back the
 *      verdict and the gaps: "Tier 2 · failed"
 *   5  "$ coach study" types; Gemma 4B turns "study partner" (blue): hint → my explanation, twice;
 *      "study · gaps closed" lands under me;
 *      then "$ coach judge" again: "Tier 2 · passed"
 *   after "Tier 2 · passed", the next reviews list under it: 7, 14, 30 … 365 days
 *   then a note tries to leave, bounces off the lock: notes stay private
 * No props.
 */
const { t, at } = useTimeline(68)
const uid = useId()
const id = (name: string) => `kt-arch-${name}-${uid}`

// paced to the narration: the map first, then one step per sentence; the actor stays lit until the next step
const S = { spar: 8, ask: 15, weak: 21, ask2: 27, good: 31, judge: 37, study: 46, judge2: 54, note: 63 }
const T = {
  spar: [S.spar, S.spar + 0.8], concept1: [S.spar + 1.0, S.spar + 2.6], concept2: [S.ask, S.ask + 0.8],
  ask4b: [[S.ask + 0.8, S.weak], [S.ask2, S.good]],
  ask: [[S.ask + 1.6, S.ask + 2.6], [S.ask2 + 0.6, S.ask2 + 1.6]],
  ans: [[S.weak, S.weak + 1.2], [S.good, S.good + 1.2]],
  check: [[S.weak + 1.2, S.ask2], [S.good + 1.2, S.judge]],
  tier1Fail: S.weak + 2.0, tier1Pass: S.good + 2.0,
  judgeCmd: [S.judge, S.judge + 0.8], judge2Cmd: [S.judge2, S.judge2 + 0.8], studyCmd: [S.study, S.study + 0.8],
  out: [[S.judge + 1.2, S.judge + 3.0], [S.judge2 + 1.2, S.judge2 + 3.0]],
  argon: [[S.judge + 3.0, S.study], [S.judge2 + 3.0, S.note]],
  back: [[S.judge + 4.4, S.judge + 6.0], [S.judge2 + 4.4, S.judge2 + 6.0]],
  study4b: [S.study + 1.0, S.judge2],
  hint: [[S.study + 1.6, S.study + 2.6], [S.study + 4.6, S.study + 5.6]],
  explain: [[S.study + 3.0, S.study + 4.0], [S.study + 6.0, S.study + 7.0]], studied: S.study + 7.2,
  note: [S.note, S.note + 1.2], lockHit: [S.note + 1.1, S.note + 2.2],
} as const
type Span = readonly [number, number]

const clamp = (v: number) => Math.min(1, Math.max(0, v))
const prog = ([a, b]: Span) => clamp((t.value - a) / (b - a))
const ease = (p: number) => p * p * (3 - 2 * p)
const during = ([a, b]: Span) => t.value >= a && t.value < b
const duringAny = (spans: readonly Span[]) => spans.some(during)
const typed = (text: string, span: Span) => text.slice(0, Math.round(text.length * prog(span)))

// the paths the tokens ride
const pConcept1 = ref<SVGPathElement>()
const pConcept2 = ref<SVGPathElement>()
const pAsk = ref<SVGPathElement>()
const pAns = ref<SVGPathElement>()
const pOut = ref<SVGPathElement>()
const pBack = ref<SVGPathElement>()
const pNote = ref<SVGPathElement>()
const at01 = (el: SVGPathElement | undefined, p: number) => {
  if (!el) return 'translate(-99 -99)'
  const q = el.getPointAtLength(el.getTotalLength() * p)
  return `translate(${q.x.toFixed(1)} ${q.y.toFixed(1)})`
}
// a token that rides a path once per span, and lingers `hold` seconds at the end
const ride = (spans: readonly Span[], path: () => SVGPathElement | undefined, hold: number, reverse = false) => {
  // the last ride that started: a token fades out where it arrived, still showing what it carried
  const i = spans.reduce((last, [a], k) => (t.value >= a ? k : last), -1)
  const on = i >= 0 && t.value < spans[i][1] + hold
  const p = i >= 0 ? ease(prog(spans[i])) : 0
  return { on, i, at: at01(path(), reverse ? 1 - p : p) }
}

const concept = computed(() => {
  if (during(T.concept1)) return { on: true, at: at01(pConcept1.value, ease(prog(T.concept1))) }
  if (t.value >= T.concept1[1] && t.value < T.concept2[0]) return { on: true, at: at01(pConcept1.value, 1) }
  if (during([T.concept2[0], T.concept2[1] + 0.2])) return { on: true, at: at01(pConcept2.value, ease(prog(T.concept2))) }
  return { on: false, at: at01(pConcept1.value, 0) }
})
const ask = computed(() => ride(T.ask, () => pAsk.value, 0.6))
const ans = computed(() => ride(T.ans, () => pAns.value, 0.2))
const out = computed(() => ride(T.out, () => pOut.value, 0.2))
const back = computed(() => ride(T.back, () => pBack.value, 0.8))
const hint = computed(() => ride(T.hint, () => pAsk.value, 0.4))
const explain = computed(() => ride(T.explain, () => pAsk.value, 0.2, true))
const studying = computed(() => during(T.study4b))
// the note runs to the lock, then slides back a little and fades
const note = computed(() => {
  const p = prog(T.note)
  const bounce = t.value > T.note[1] ? 0.95 - 0.06 * clamp((t.value - T.note[1]) / 0.4) : 0.95 * ease(p)
  return { on: during([T.note[0], T.note[1] + 0.9]), at: at01(pNote.value, bounce) }
})

// the two tiers: Tier 1 is Gemma 12B's check, Tier 2 is Argon's verdict
const tier1 = computed(() => (t.value >= T.tier1Pass ? 'pass' : t.value >= T.tier1Fail ? 'fail' : null))
const tier2 = computed(() => (t.value >= T.back[1][1] ? 'pass' : t.value >= T.back[0][1] ? 'fail' : null))
const checking = computed(() => T.check.findIndex(during))

const lines = computed(() => [
  { text: typed('$ coach spar', T.spar) },
  { text: t.value >= T.concept1[1] ? '◆ concept' : '', concept: true },
  { text: typed('$ coach judge', T.judgeCmd) },
  { text: typed('$ coach study', T.studyCmd) },
  { text: typed('$ coach judge', T.judge2Cmd) },
])
const cursorY = computed(() => {
  const n = [T.concept1[1], T.judgeCmd[0], T.studyCmd[0], T.judge2Cmd[0]].filter(at).length
  return 182 + n * 24
})

const badges = computed(() => [
  { n: 1, x: 208, y: 96, on: at(T.spar[0]), now: during([T.spar[0], S.ask]) },
  { n: 2, x: 350, y: 112, on: at(T.ask4b[0][0]), now: duringAny(T.ask4b) },
  { n: 3, x: 350, y: 232, on: at(T.check[0][0]), now: duringAny(T.check) },
  { n: 4, x: 692, y: 124, on: at(T.argon[0][0]), now: duringAny(T.argon) },
  { n: 5, x: 470, y: 112, on: at(T.study4b[0]), now: during(T.study4b) },
])
</script>

<template>
  <svg class="kt-arch" viewBox="-24 0 928 456" role="img"
    aria-label="The architecture, as one session. On the laptop, offline: the second brain, my notes in Obsidian; kb-template's MCP vault server next to it, the only way to the notes; and ai-coach: the coach CLI, and on Ollama Gemma 4B and Gemma 12B. In the cloud, still part of ai-coach: Gemini 4 Argon, the judge. Step 1: coach spar; the concept note travels from my notes through kb-template to the coach. Step 2: the coach hands it to Gemma 4B, which asks me a question. Step 3: my answer goes to Gemma 12B, which checks it. Step 4: coach judge; my answer and claims cross the boundary to Argon, which sends back a verdict and the gaps. Step 5: coach study; Gemma 4B gives me a hint on a gap. Then a note tries to leave and is stopped at the lock: notes stay private.">
    <defs>
      <clipPath :id="id('face')" clipPathUnits="objectBoundingBox"><circle cx="0.5" cy="0.5" r="0.5" /></clipPath>
      <marker :id="id('head')" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M1 1 L 9 5 L 1 9" class="kt-arch__head" />
      </marker>
    </defs>

    <!-- zones: the laptop and the cloud -->
    <g class="kt-arch__part" :class="{ 'is-on': at(0.1) }">
      <rect x="-20" y="4" width="644" height="448" rx="14" class="kt-arch__zone is-local" />
      <text x="-2" y="32" class="kt-arch__zonename is-local">laptop · offline</text>
      <rect x="664" y="4" width="236" height="448" rx="14" class="kt-arch__zone is-cloud" />
      <text x="682" y="32" class="kt-arch__zonename is-cloud">cloud</text>
    </g>

    <!-- the second brain: my notes, in Obsidian -->
    <g class="kt-arch__part" :class="{ 'is-on': at(0.3) }">
      <rect x="14" y="50" width="172" height="236" rx="14" class="kt-arch__home is-kb" />
      <text x="28" y="72" class="kt-arch__homename is-kb">second brain</text>
      <rect x="66" y="96" width="52" height="64" rx="5" class="kt-arch__note is-back" />
      <rect x="74" y="104" width="52" height="64" rx="5" class="kt-arch__note is-back" />
      <rect x="82" y="112" width="52" height="64" rx="5" class="kt-arch__note" />
      <path d="M90 130 h36 M90 141 h28 M90 152 h34 M90 163 h24" class="kt-arch__text" />
      <text x="100" y="210" text-anchor="middle" class="kt-arch__name is-big">notes</text>
      <image href="/images/logos/obsidian.webp" x="54" y="246" width="20" height="20" />
      <text x="80" y="262" class="kt-arch__tool">Obsidian</text>
    </g>

    <!-- kb-template: outside the second brain, the only way in -->
    <g class="kt-arch__part" :class="{ 'is-on': at(0.45) }">
      <path d="M100 290 V 314" class="kt-arch__wire" :class="{ 'is-live': during(T.concept1) }"
        :marker-start="`url(#${id('head')})`" :marker-end="`url(#${id('head')})`" />
      <rect x="24" y="318" width="152" height="64" rx="14" class="kt-arch__engine" />
      <image href="/images/logos/kb-template-mark.png" x="38" y="331" width="12" height="17" />
      <text x="56" y="345" class="kt-arch__name">kb-template</text>
      <text x="100" y="368" text-anchor="middle" class="kt-arch__does">MCP vault server</text>
    </g>

    <!-- ai-coach: the laptop part, and the arm over the boundary around the judge -->
    <g class="kt-arch__part" :class="{ 'is-on': at(0.6) }">
      <path d="M212 50 H 878 Q 892 50 892 64 V 236 Q 892 250 878 250 H 684 Q 670 250 670 236 V 96 Q 670 82 656 82
        H 494 Q 480 82 480 96 V 384 Q 480 398 466 398 H 212 Q 198 398 198 384 V 64 Q 198 50 212 50 Z" class="kt-arch__home is-coach" />
      <text x="212" y="72" class="kt-arch__homename is-coach">ai-coach</text>
      <path d="M176 350 H 204" class="kt-arch__wire" :class="{ 'is-live': during(T.concept1) }"
        :marker-start="`url(#${id('head')})`" :marker-end="`url(#${id('head')})`" />
      <text x="190" y="338" text-anchor="middle" class="kt-arch__label is-mcp">MCP</text>

      <!-- the coach: a CLI in my terminal; the commands type as the session goes -->
      <rect x="208" y="96" width="126" height="290" rx="14" class="kt-arch__engine is-local"
        :class="{ 'is-busy': during([T.spar[0], T.concept2[1]]) || during([T.judgeCmd[0], T.out[0][1]]) || during(T.studyCmd) || during([T.judge2Cmd[0], T.out[1][1]]) }" />
      <text x="271" y="124" text-anchor="middle" class="kt-arch__name">coach</text>
      <text x="271" y="142" text-anchor="middle" class="kt-arch__does">CLI</text>
      <rect x="216" y="154" width="110" height="222" rx="8" class="kt-arch__term" />
      <circle cx="227" cy="166" r="2.8" class="kt-arch__dot is-r" />
      <circle cx="237" cy="166" r="2.8" class="kt-arch__dot is-y" />
      <circle cx="247" cy="166" r="2.8" class="kt-arch__dot is-g" />
      <text v-for="(l, i) in lines" :key="i" x="224" :y="194 + i * 24" class="kt-arch__cmd" :class="{ 'is-concept': l.concept }">{{ l.text }}</text>
      <rect x="224" :y="cursorY" width="8" height="14" class="kt-arch__cursor" />
    </g>

    <!-- Ollama: who creates the questions, who checks the answers -->
    <g class="kt-arch__part" :class="{ 'is-on': at(0.8) }">
      <path d="M334 320 H 346" class="kt-arch__wire" :class="{ 'is-live': during(T.concept2) }" :marker-end="`url(#${id('head')})`" />
      <rect x="342" y="96" width="132" height="290" rx="14" class="kt-arch__group" />
      <text x="408" y="372" text-anchor="middle" class="kt-arch__ollama">Ollama</text>
      <rect x="350" y="112" width="116" height="64" rx="14" class="kt-arch__engine is-local"
        :class="{ 'is-ask': duringAny(T.ask4b), 'is-study': during(T.study4b) }" />
      <image href="/images/logos/gemma-mark.png" x="360" y="126" width="17" height="17" />
      <text x="381" y="140" class="kt-arch__name">Gemma 4B</text>
      <text x="408" y="162" text-anchor="middle" class="kt-arch__does is-tight" :class="studying ? 'is-studytext' : 'is-ask'">{{ studying ? 'study partner' : 'creates questions' }}</text>
      <rect x="350" y="232" width="116" height="64" rx="14" class="kt-arch__engine is-local" :class="{ 'is-check': checking === 1, 'is-fail': checking === 0 }" />
      <image href="/images/logos/gemma-mark.png" x="355" y="246" width="17" height="17" />
      <text x="375" y="260" class="kt-arch__name">Gemma 12B</text>
      <text x="408" y="282" text-anchor="middle" class="kt-arch__does is-check">checks answers</text>
      <!-- Tier 1: Gemma 12B's check -->
      <g class="kt-arch__pop" :class="{ 'is-on': tier1 }" transform="translate(464 234)">
        <circle r="11" class="kt-arch__verdict" :class="`is-${tier1}`" />
        <path v-if="tier1 === 'pass'" d="M-5 0 l3.5 3.5 6.5 -7" class="kt-arch__verdicttick" />
        <path v-else d="M-4 -4 L4 4 M4 -4 L-4 4" class="kt-arch__verdicttick" />
      </g>
      <g class="kt-arch__pop" :class="{ 'is-on': tier1 }" transform="translate(408 318)">
        <rect x="-64" y="-14" width="128" height="28" rx="14" class="kt-arch__tier" :class="`is-${tier1}`" />
        <text y="5" text-anchor="middle" class="kt-arch__tiertext" :class="`is-${tier1}`">{{ tier1 === 'pass' ? 'Tier 1 · completed' : 'Tier 1 · failed' }}</text>
      </g>
    </g>

    <!-- me -->
    <g class="kt-arch__part" :class="{ 'is-on': at(1.0) }">
      <circle cx="556" cy="144" r="36" class="kt-arch__glow" />
      <image href="/images/speaker.webp" x="526" y="114" width="60" height="60" :clip-path="`url(#${id('face')})`"
        preserveAspectRatio="xMidYMid slice" />
      <circle cx="556" cy="144" r="30" class="kt-arch__ring" />
      <text x="556" y="202" text-anchor="middle" class="kt-arch__name is-big">you</text>
      <path ref="pAsk" d="M468 140 H 522" class="kt-arch__wire is-ask" :class="{ 'is-live': duringAny(T.ask) || duringAny(T.hint) || duringAny(T.explain), 'is-study': studying }" />
      <path ref="pAns" d="M534 174 C 520 220 504 264 470 264" class="kt-arch__wire is-ans" :class="{ 'is-live': duringAny(T.ans) }" />
    </g>
    <!-- the study session's outcome -->
    <g class="kt-arch__pop" :class="{ 'is-on': at(T.studied) }" transform="translate(556 99)">
      <rect x="-66" y="-12" width="132" height="24" rx="14" class="kt-arch__tier is-study" />
      <text y="4" text-anchor="middle" class="kt-arch__tiertext is-study">study · gaps closed</text>
    </g>
    <text x="496" y="300" class="kt-arch__part kt-arch__label is-ans" :class="{ 'is-on': at(T.ans[0][0]) }">my answer</text>

    <!-- the judge -->
    <g class="kt-arch__part" :class="{ 'is-on': at(1.2) }">
      <rect x="692" y="124" width="180" height="66" rx="14" class="kt-arch__engine is-cloud" :class="{ 'is-judge': duringAny(T.argon) }" />
      <!-- Tier 2: Argon's verdict -->
      <g class="kt-arch__pop" :class="{ 'is-on': tier2 }" transform="translate(830 214)">
        <rect x="-56" y="-14" width="112" height="28" rx="14" class="kt-arch__tier" :class="`is-${tier2}`" />
        <text y="5" text-anchor="middle" class="kt-arch__tiertext" :class="`is-${tier2}`">{{ tier2 === 'pass' ? 'Tier 2 · passed' : 'Tier 2 · failed' }}</text>
      </g>
      <image href="/images/logos/gemini-mark.png" x="702" y="140" width="18" height="18" />
      <text x="790" y="153" text-anchor="middle" class="kt-arch__name">Gemini 4 Argon</text>
      <text x="790" y="174" text-anchor="middle" class="kt-arch__does">judge</text>
    </g>

    <!-- after Tier 2 passed: the next reviews, ai-coach's review ladder (DEFAULT_LADDER, as on CoachLoop) -->
    <g class="kt-arch__part" :class="{ 'is-on': tier2 === 'pass' }">
      <rect x="776" y="300" width="112" height="140" rx="12" class="kt-arch__ladder" />
      <text x="832" y="322" text-anchor="middle" class="kt-arch__laddertitle">next review</text>
    </g>
    <g v-for="(r, i) in ['7 days', '14 days', '30 days', '… 365 days']" :key="r" class="kt-arch__rung"
      :class="{ 'is-on': tier2 === 'pass' && t >= T.back[1][1] + 0.5 + i * 0.35, 'is-next': i === 0 }">
      <circle cx="794" :cy="346 + i * 24" r="4.5" class="kt-arch__rungdot" />
      <text x="806" :y="351 + i * 24" class="kt-arch__rungtext">{{ r }}</text>
    </g>

    <!-- the boundary: a gate where my answer passes, a lock where the notes stop -->
    <g class="kt-arch__part" :class="{ 'is-on': at(1.4) }">
      <path d="M644 0 V 362 M644 398 V 406 M644 446 V 456" class="kt-arch__boundary" />
      <path d="M635 362 h18 M635 398 h18" class="kt-arch__gate" />
      <path ref="pOut" d="M586 146 H 590 Q 600 146 600 156 V 380 Q 600 390 610 390 H 752 Q 762 390 762 380 V 192"
        class="kt-arch__wire is-out" :class="{ 'is-live': duringAny(T.out) }" />
      <path ref="pBack" d="M742 192 V 360 Q 742 370 732 370 H 626 Q 616 370 616 360 V 174 Q 616 164 606 164 H 588"
        class="kt-arch__wire is-back" :class="{ 'is-live': duringAny(T.back) }" />
      <path ref="pNote" d="M66 140 H 30 Q 20 140 20 150 V 416 Q 20 426 30 426 H 626" class="kt-arch__wire is-note"
        :class="{ 'is-live': during(T.note) }" />
      <g transform="translate(644 426)">
        <circle r="18" class="kt-arch__lockbg" />
        <circle r="18" class="kt-arch__lockhit" :class="{ 'is-on': during(T.lockHit) }" />
        <path d="M-6 -3 v-5 a6 6 0 0 1 12 0 v5" class="kt-arch__shackle" />
        <rect x="-9" y="-3" width="18" height="13" rx="2.5" class="kt-arch__lockbody" />
      </g>
    </g>
    <text x="734" y="316" text-anchor="end" class="kt-arch__part kt-arch__label is-back" :class="{ 'is-on': at(T.back[0][0]) }">
      <tspan x="734">verdict</tspan><tspan x="734" dy="18">+ gaps</tspan>
    </text>
    <text x="112" y="414" text-anchor="middle" class="kt-arch__part kt-arch__private" :class="{ 'is-on': at(T.lockHit[0]) }">🔒 notes stay private</text>

    <!-- the concept ride (step 1, 2): notes → kb-template → coach, then coach → Gemma 4B -->
    <path ref="pConcept1" d="M100 196 V 350 H 214" class="kt-arch__route" />
    <path ref="pConcept2" d="M334 320 H 336 Q 346 320 346 310 V 154 Q 346 144 356 144" class="kt-arch__route" />

    <!-- the tokens: only the step that plays moves -->
    <g class="kt-arch__token" :class="{ 'is-on': concept.on }" :transform="concept.at">
      <path d="M0 -11 L11 0 L0 11 L-11 0 Z" class="kt-arch__cframe" />
      <path d="M0 -5 L5 0 L0 5 L-5 0 Z" class="kt-arch__ccore" />
    </g>
    <g class="kt-arch__token" :class="{ 'is-on': ask.on }" :transform="ask.at">
      <circle r="10" class="kt-arch__q" />
      <text y="5" text-anchor="middle" class="kt-arch__qtext">?</text>
    </g>
    <g class="kt-arch__token" :class="{ 'is-on': hint.on }" :transform="hint.at">
      <rect x="-22" y="-11" width="44" height="22" rx="11" class="kt-arch__hint" />
      <text y="4" text-anchor="middle" class="kt-arch__hinttext">hint</text>
    </g>
    <g class="kt-arch__token" :class="{ 'is-on': explain.on }" :transform="explain.at">
      <rect x="-9" y="-11" width="18" height="22" rx="3" class="kt-arch__ans is-study" />
      <path d="M-5 -5 h10 M-5 0 h10 M-5 5 h6" class="kt-arch__anslines" />
    </g>
    <g class="kt-arch__token" :class="[{ 'is-on': ans.on }, { 'is-weak': ans.i === 0 }]" :transform="ans.at">
      <rect x="-9" y="-11" width="18" height="22" rx="3" class="kt-arch__ans" />
      <path d="M-5 -5 h10 M-5 0 h10 M-5 5 h6" class="kt-arch__anslines" />
    </g>
    <g class="kt-arch__token" :class="{ 'is-on': out.on }" :transform="out.at">
      <rect x="-32" y="-14" width="64" height="28" rx="8" class="kt-arch__packet" />
      <text x="-19" y="5" text-anchor="middle" class="kt-arch__ptext">?</text>
      <path d="M-8 -5 h14 M-8 1 h14 M-8 7 h9" class="kt-arch__plines" />
      <path d="M20 -7 l7 7 -7 7 -7 -7z" class="kt-arch__claim" />
    </g>
    <g class="kt-arch__token" :class="[{ 'is-on': back.on }, back.i === 0 ? 'is-fail' : 'is-pass']" :transform="back.at">
      <rect x="-30" y="-14" width="60" height="28" rx="8" class="kt-arch__reply" />
      <path v-if="back.i === 0" d="M-21 -4 L-13 4 M-13 -4 L-21 4" class="kt-arch__replytick" />
      <path v-else d="M-20 0 l4 4 8 -9" class="kt-arch__replytick" />
      <path d="M0 -5 h18 M0 1 h18 M0 7 h11" class="kt-arch__replylines" />
    </g>
    <g class="kt-arch__token" :class="{ 'is-on': note.on }" :transform="note.at">
      <rect x="-13" y="-16" width="26" height="32" rx="4" class="kt-arch__note" />
      <path d="M-7 -7 h14 M-7 -1 h10 M-7 5 h13" class="kt-arch__text is-thin" />
    </g>

    <!-- the step badges: the order of a real session -->
    <g v-for="b in badges" :key="b.n" class="kt-arch__pop" :class="{ 'is-on': b.on }" :transform="`translate(${b.x} ${b.y})`">
      <circle r="12" class="kt-arch__badge" :class="{ 'is-now': b.now }" />
      <text y="5" text-anchor="middle" class="kt-arch__badgen">{{ b.n }}</text>
    </g>
  </svg>
</template>

<style>
.kt-arch {
  width: 888px;
  margin: 0 -24px;
  /* the viewBox is 48 units wider than the 840px diagram it grew from: one dot more on each side */
  height: auto;
  overflow: visible;
  font-family: var(--font-family-sans);
}

.kt-arch__part,
.kt-arch__token {
  opacity: 0;
  transition: opacity 0.45s;
}

.kt-arch__part.is-on { opacity: 1; }
.kt-arch__token { transition: opacity 0.25s; }
.kt-arch__token.is-on { opacity: 1; }

.kt-arch__pop > * {
  transform: scale(0);
  transform-box: fill-box;
  transform-origin: center;
  transition: transform 0.35s cubic-bezier(0.3, 1.6, 0.5, 1);
}

.kt-arch__pop.is-on > * { transform: scale(1); }

/* zones */
.kt-arch__zone { stroke-width: 2.5; }
.kt-arch__zone.is-local { fill: color-mix(in srgb, var(--kt-c-primary) 8%, transparent); stroke: var(--kt-c-primary); }
.kt-arch__zone.is-cloud { fill: color-mix(in srgb, var(--kt-c-secondary) 8%, transparent); stroke: var(--kt-c-secondary); }
.kt-arch__zonename { font: 800 13px var(--font-family-mono); letter-spacing: 0.12em; text-transform: uppercase; }
.kt-arch__zonename.is-local { fill: var(--kt-cool); }
.kt-arch__zonename.is-cloud { fill: var(--kt-hot); }

/* homes, as on CoachLoop */
.kt-arch__home { stroke-width: 2.5; stroke-dasharray: 8 6; }
.kt-arch__home.is-kb { fill: color-mix(in srgb, var(--kt-good) 12%, transparent); stroke: var(--kt-good); }
.kt-arch__home.is-coach { fill: color-mix(in srgb, var(--kt-warn) 5%, transparent); stroke: var(--kt-warn); }
.kt-arch__homename { font: 800 13px var(--font-family-mono); text-transform: uppercase; letter-spacing: 0.08em; }
.kt-arch__homename.is-kb { fill: var(--kt-good); }
.kt-arch__homename.is-coach { fill: var(--kt-warn); }
.kt-arch__tool { font-size: 12px; font-weight: 700; fill: var(--kt-fg); }
.kt-arch__group {
  fill: color-mix(in srgb, var(--kt-heading) 5%, transparent);
  stroke: var(--kt-heading);
  stroke-width: 2.5;
  stroke-dasharray: 7 5;
}
.kt-arch__ollama { font-size: 16px; font-weight: 800; fill: var(--kt-heading); }

/* notes, boxes, names */
.kt-arch__note { fill: var(--kt-card); stroke: var(--kt-c-primary-soft); stroke-width: 1.5; }
.kt-arch__note.is-back { opacity: 0.5; }
.kt-arch__text { stroke: var(--kt-subtle); stroke-width: 3; stroke-linecap: round; }
.kt-arch__text.is-thin { stroke-width: 2.2; }
.kt-arch__engine { fill: var(--kt-code-bg); stroke: var(--kt-line-strong); stroke-width: 2.5; transition: stroke 0.3s, filter 0.3s; }
.kt-arch__engine.is-local { stroke: var(--kt-c-primary); }
.kt-arch__engine.is-cloud { stroke: var(--kt-c-secondary); }
.kt-arch__engine.is-busy { stroke: var(--kt-warn); filter: drop-shadow(0 0 10px var(--kt-warn)); }
.kt-arch__engine.is-ask { stroke: var(--kt-hot); filter: drop-shadow(0 0 10px var(--kt-hot)); }
.kt-arch__engine.is-fail { stroke: var(--kt-bad); filter: drop-shadow(0 0 10px var(--kt-bad)); }
.kt-arch__engine.is-check { stroke: var(--kt-good); filter: drop-shadow(0 0 10px var(--kt-good)); }
.kt-arch__engine.is-study { stroke: var(--kt-info); filter: drop-shadow(0 0 10px var(--kt-info)); }
.kt-arch__engine.is-judge { stroke: var(--kt-hot); filter: drop-shadow(0 0 12px var(--kt-hot)); }
.kt-arch__name { font-size: 15px; font-weight: 800; fill: var(--kt-heading); }
.kt-arch__name.is-big { font-size: 18px; }
.kt-arch__does { font: 600 11.5px var(--font-family-mono); fill: var(--kt-muted); }
.kt-arch__does.is-ask { fill: var(--kt-hot); font-weight: 800; }
.kt-arch__does.is-check { fill: var(--kt-good); font-weight: 800; }

/* the coach's terminal */
.kt-arch__term { fill: var(--kt-bg); stroke: var(--kt-line); stroke-width: 1.2; }
.kt-arch__dot.is-r { fill: var(--kt-bad); }
.kt-arch__dot.is-y { fill: var(--kt-warn); }
.kt-arch__dot.is-g { fill: var(--kt-good); }
.kt-arch__cmd { font: 600 12px var(--font-family-mono); fill: var(--kt-code-fg); white-space: pre; }
.kt-arch__cmd.is-concept { fill: var(--kt-warn); font-weight: 800; }
.kt-arch__cursor { fill: var(--kt-code-fg); animation: kt-arch-blink 1s steps(1) infinite; }

@keyframes kt-arch-blink {
  50% { opacity: 0; }
}

/* me */
.kt-arch__ring { fill: none; stroke: var(--kt-good); stroke-width: 3; }
.kt-arch__glow { fill: color-mix(in srgb, var(--kt-good) 24%, transparent); }

/* wires: static, and the one that plays lights up and flows */
.kt-arch__wire {
  fill: none;
  stroke: var(--kt-line-strong);
  stroke-width: 2.5;
  stroke-dasharray: 6 5;
  opacity: 0.55;
  transition: opacity 0.3s, stroke-width 0.3s;
}
.kt-arch__wire.is-ask { stroke: var(--kt-hot); }
.kt-arch__wire.is-ans { stroke: var(--kt-good); }
.kt-arch__wire.is-out { stroke: var(--kt-hot); }
.kt-arch__wire.is-back { stroke: var(--kt-good); }
.kt-arch__wire.is-live { opacity: 1; stroke-width: 3; animation: kt-arch-flow 1s linear infinite; }
.kt-arch__head { fill: none; stroke: var(--kt-line-strong); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.kt-arch__route { fill: none; stroke: none; }

@keyframes kt-arch-flow {
  to { stroke-dashoffset: -22; }
}

/* labels on the wires: a halo so a line never runs through them */
.kt-arch__label {
  font: 800 14px var(--font-family-mono);
  paint-order: stroke;
  stroke: var(--kt-bg);
  stroke-width: 5px;
  stroke-linejoin: round;
}
.kt-arch__label.is-mcp { font-size: 12px; fill: var(--kt-fg); }
.kt-arch__label.is-ans,
.kt-arch__label.is-back { fill: var(--kt-good); }
.kt-arch__private { font: 800 14px var(--font-family-mono); fill: var(--kt-fg); }

/* the boundary */
.kt-arch__boundary { fill: none; stroke: var(--kt-heading); stroke-width: 3; stroke-linecap: round; stroke-dasharray: 2 9; }
.kt-arch__gate { stroke: var(--kt-heading); stroke-width: 3; stroke-linecap: round; }
.kt-arch__lockbg { fill: var(--kt-bg); stroke: var(--kt-heading); stroke-width: 2.5; }
.kt-arch__lockhit { fill: var(--kt-tint-secondary); stroke: var(--kt-bad); stroke-width: 3.5; opacity: 0; transition: opacity 0.2s; }
.kt-arch__lockhit.is-on { opacity: 1; }
.kt-arch__shackle { fill: none; stroke: var(--kt-heading); stroke-width: 2.5; stroke-linecap: round; }
.kt-arch__lockbody { fill: var(--kt-heading); }

/* tokens */
.kt-arch__cframe { fill: var(--kt-code-bg); stroke: var(--kt-warn); stroke-width: 2.5; stroke-linejoin: round; }
.kt-arch__ccore { fill: var(--kt-info); }
.kt-arch__q { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); stroke-width: 2; }
.kt-arch__qtext { font: 900 13px var(--font-family-sans); fill: var(--kt-hot); }
.kt-arch__ans { fill: var(--kt-card); stroke: var(--kt-good); stroke-width: 1.8; }
.kt-arch__token.is-weak .kt-arch__ans { stroke: var(--kt-bad); stroke-dasharray: 3 2; }
.kt-arch__anslines { stroke: var(--kt-heading); stroke-width: 1.8; stroke-linecap: round; }
.kt-arch__packet { fill: var(--kt-bg); stroke: var(--kt-hot); stroke-width: 2.5; }
.kt-arch__ptext { font: 900 15px var(--font-family-sans); fill: var(--kt-hot); }
.kt-arch__plines { stroke: var(--kt-hot); stroke-width: 2; stroke-linecap: round; }
.kt-arch__claim { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); stroke-width: 2; stroke-linejoin: round; }
.kt-arch__reply { fill: var(--kt-bg); stroke: var(--kt-good); stroke-width: 2.5; }
.kt-arch__token.is-fail .kt-arch__reply { stroke: var(--kt-bad); }
.kt-arch__token.is-fail .kt-arch__replytick,
.kt-arch__token.is-fail .kt-arch__replylines { stroke: var(--kt-bad); }
.kt-arch__replytick { fill: none; stroke: var(--kt-good); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
.kt-arch__replylines { stroke: var(--kt-good); stroke-width: 2; stroke-linecap: round; }
.kt-arch__verdict { fill: var(--kt-good); }
.kt-arch__verdict.is-fail { fill: var(--kt-bad); }
.kt-arch__tier { fill: var(--kt-bg); stroke-width: 2.2; }
.kt-arch__ladder { fill: var(--kt-bg); stroke: color-mix(in srgb, var(--kt-good) 55%, transparent); stroke-width: 1.5; }
.kt-arch__laddertitle { font: 800 11px var(--font-family-mono); text-transform: uppercase; letter-spacing: 0.06em; fill: var(--kt-good); }
.kt-arch__rung { opacity: 0; transform: translateX(-8px); transition: opacity 0.35s, transform 0.4s ease-out; }
.kt-arch__rung.is-on { opacity: 1; transform: none; }
.kt-arch__rungdot { fill: color-mix(in srgb, var(--kt-good) 55%, transparent); }
.kt-arch__rungtext { font: 700 12px var(--font-family-mono); fill: var(--kt-muted); }
.kt-arch__rung.is-next .kt-arch__rungdot { fill: var(--kt-good); }
.kt-arch__rung.is-next .kt-arch__rungtext { fill: var(--kt-good); font-weight: 800; }
.kt-arch__tier.is-pass { stroke: var(--kt-good); }
.kt-arch__tier.is-fail { stroke: var(--kt-bad); }
.kt-arch__tiertext { font: 800 11px var(--font-family-mono); letter-spacing: -0.02em; }
.kt-arch__tiertext.is-pass { fill: var(--kt-good); }
.kt-arch__tiertext.is-fail { fill: var(--kt-bad); }
.kt-arch__tier.is-study { stroke: var(--kt-info); }
.kt-arch__tiertext.is-study { fill: var(--kt-info); }
.kt-arch__does.is-studytext { fill: var(--kt-info); font-weight: 800; }
.kt-arch__ans.is-study { stroke: var(--kt-info); }
.kt-arch__wire.is-ask.is-study { stroke: var(--kt-info); }
.kt-arch__does.is-tight { font-size: 10.5px; letter-spacing: -0.02em; }
.kt-arch__hint { fill: var(--kt-bg); stroke: var(--kt-info); stroke-width: 2.2; }
.kt-arch__hinttext { font: 800 11px var(--font-family-mono); fill: var(--kt-info); }
.kt-arch__verdicttick { fill: none; stroke: var(--kt-bg); stroke-width: 2.6; stroke-linecap: round; stroke-linejoin: round; }

/* step badges */
.kt-arch__badge { fill: var(--kt-bg); stroke: var(--kt-warn); stroke-width: 2.5; transition: fill 0.3s; }
.kt-arch__badge.is-now { fill: var(--kt-warn); }
.kt-arch__badgen { font: 900 13px var(--font-family-mono); fill: var(--kt-heading); }
.kt-arch__badge.is-now + .kt-arch__badgen { fill: var(--kt-bg); }

@media (prefers-reduced-motion: reduce) {
  .kt-arch__wire.is-live,
  .kt-arch__cursor { animation: none !important; }
}
</style>
