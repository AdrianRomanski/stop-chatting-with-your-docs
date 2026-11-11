<script setup lang="ts">
import { computed, useId } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * Never outsource synthesis, on one source: Julia's design system architecture, ~200 pages of docs
 * (JuliaStory's pile). Plays once, in three parts:
 * Left top, the pull-based architecture (AI at the wheel): the pile flies into the AI, its sparkle
 * spins, out pops summary.md, pulled to me (grey, idle); it goes dull, and the panel's header
 * reads "fluency illusion" (the slide before). (This and the next panel used to be PullPush, slide "Pull a summary, or get pushed".)
 * Left bottom, the push-based architecture (me at the wheel): the same pile, me in color; I
 * synthesize the concepts into my diagram, layer by layer, bottom-up, with a "builds on" arrow; the
 * AI pushes back, "why this way?", a "?" lands on the diagram, I answer and it becomes a tick; the
 * panel's header reads "mastering concepts".
 * Right, the payoff, the next group meeting: I draw it on the whiteboard, the team, in color, asks
 * for it one at a time; Julia, the creator, last; CLAP CLAP.
 * The layer names are the ones I draw in JuliaStory. Sets up AccessRevoked ("Pull-based? At
 * PushBased?"). No props.
 */
const uid = useId()
const id = (name: string) => `kt-smine-${name}-${uid}`

// ---- left top: procrastination
const AI = { x: 180, y: 100 }
const jitter = [0, 4, -3, 3, -4, 2, -2, 4]
const topPile = jitter.map((dx, i) => {
  const x = 26 + dx
  const y = 124 - i * 7
  return { x, y, on: 1.6 + (7 - i) * 0.15, dx: AI.x - (x + 30), dy: AI.y - y }
})
const BUSY_AT = 2.9
const SUMMARY_AT = 4.2
const IDLE_AT = 4.8
const DULL_AT = 6.2
const STAMP_AT = 6.6

// ---- left bottom: proactive
const MINE_AT = 7.4
const layers = ['tokens', 'primitives', 'components', 'patterns'].map((name, k) => ({ name, y: 330 - k * 28, on: MINE_AT + 1.4 + k * 0.5 }))
const ARROW_AT = MINE_AT + 3.5
const ASK_AT = ARROW_AT + 0.7 // the AI pushes back
const ANSWER_AT = ASK_AT + 1.6 // I answer
const DONE_AT = ANSWER_AT + 1.2

// ---- right: the next group meeting
const MEET_AT = DONE_AT + 1.0
const DRAW_AT = MEET_AT + 0.9
type Pt = [number, number]
const box = (y: number): Pt[] => [[540, y], [760, y], [760, y + 26], [540, y + 26], [540, y]]
const strokes: { pts: Pt[]; at: number; label?: string; good?: boolean }[] = [
  { pts: box(182), at: 0, label: 'tokens' },
  { pts: box(148), at: 0.6, label: 'primitives' },
  { pts: box(114), at: 1.2, label: 'components' },
  { pts: box(80), at: 1.8, label: 'patterns' },
  { pts: [[790, 206], [790, 84], [783, 94], [790, 84], [797, 94]], at: 2.5 },
  { pts: [[808, 148], [818, 160], [842, 130]], at: 3.1, good: true },
].map(k => ({ ...k, at: DRAW_AT + k.at }))
const ink = strokes.map(k => ({ ...k, d: `M${k.pts.map(p => p.join(' ')).join(' L')}`, y: k.pts[0][1] + 18 }))
const team = [
  { name: 'Julia', src: '/images/people/julia-rapczynska.webp' },
  { name: 'Kirill', src: '/images/people/kirill.webp' },
  { name: 'Szymon', src: '/images/people/szymon.webp' },
  { name: 'Hanna', src: '/images/people/hanna-skryl.jpg' },
]
const HEAD = (i: number) => 540 + i * 66
const TEAM_AT = MEET_AT + 0.5
const ASKS_AT = DRAW_AT + 3.8
const questions = [
  { who: 1, w: 226, at: 0, until: 1.5, text: 'Wow, so that\'s how it works!' },
  { who: 2, w: 182, at: 1.6, until: 3.1, text: 'Can you teach us this?' },
  { who: 3, w: 204, at: 3.2, until: 4.7, text: 'Can you share guidelines?' },
  { who: 0, w: 240, at: 4.8, until: Infinity, text: 'Will you write our guidelines?' },
].map((q) => {
  const head = HEAD(q.who)
  return { ...q, head, x: Math.min(868 - q.w, Math.max(452, head - q.w / 2)) }
})
const CLAP_AT = ASKS_AT + 5.6

const { at } = useTimeline(CLAP_AT + 0.5)
const busy = computed(() => at(BUSY_AT) && !at(SUMMARY_AT))
const asking = computed(() => at(ASK_AT) && !at(ASK_AT + 0.9))
const talking = (who: number) => questions.some(q => q.who === who && at(ASKS_AT + q.at) && !at(ASKS_AT + q.until))
</script>

<template>
  <svg class="kt-smine" viewBox="0 0 880 380" role="img"
    aria-label="Pull-based architecture, the AI at the wheel: the 200 pages of the design system architecture go into the AI, out comes summary.md, handed to me while I stay idle; it goes dull: the fluency illusion. Push-based architecture, me at the wheel: I synthesize the concepts into my own diagram, layer on layer, tokens, primitives, components, patterns, and the AI pushes back: why this way? I answer, and the question becomes a tick: mastering concepts. Then the next group meeting: I draw it on the whiteboard, and the team asks: wow, so that's how it works; can you teach us this; can you share guidelines; and Julia, the creator: will you write our guidelines?">
    <defs>
      <marker :id="id('head')" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0 0 L10 5 L0 10 z" class="kt-smine__head" />
      </marker>
      <marker :id="id('ink')" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto">
        <path d="M0 0 L10 5 L0 10 z" class="kt-smine__inkhead" />
      </marker>
      <marker :id="id('back')" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0 0 L10 5 L0 10 z" class="kt-smine__backhead" />
      </marker>
      <marker :id="id('push')" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0 0 L10 5 L0 10 z" class="kt-smine__pushhead" />
      </marker>
      <clipPath :id="id('face')" clipPathUnits="objectBoundingBox"><circle cx="0.5" cy="0.5" r="0.5" /></clipPath>
    </defs>

    <!-- ============ left top: the pull-based architecture, the AI at the wheel ============ -->
    <g class="kt-smine__part" :class="{ 'is-on': at(0.2) }">
      <rect x="10" y="8" width="420" height="172" rx="16" class="kt-smine__panel is-trap" />
      <text x="28" y="32" class="kt-smine__tag">✕ pull-based architecture</text>
    </g>
    <g v-for="(s, i) in topPile" :key="`f${i}`" class="kt-smine__part" :class="{ 'is-on': at(0.6) }">
      <rect class="kt-smine__sheet kt-smine__fly" :class="{ 'is-gone': at(s.on) }" :x="s.x" :y="s.y" width="60" height="6" rx="2"
        :style="at(s.on) ? { transform: `translate(${s.dx}px, ${s.dy}px) scale(0.3)` } : {}" />
    </g>
    <text x="56" y="152" text-anchor="middle" class="kt-smine__part kt-smine__small" :class="{ 'is-on': at(0.6) && !at(BUSY_AT) }">~200 pages</text>
    <path d="M96 100 H 132" class="kt-smine__part kt-smine__wire" :class="{ 'is-on': at(1.4) }" :marker-end="`url(#${id('head')})`" />

    <g class="kt-smine__part" :class="{ 'is-on': at(0.6) }">
      <rect :x="AI.x - 40" :y="AI.y - 28" width="80" height="56" rx="14" class="kt-smine__ai" :class="{ 'is-busy': busy }" />
      <g :transform="`translate(${AI.x - 18} ${AI.y})`">
        <path d="M0 -9 l3 6 6 3 -6 3 -3 6 -3 -6 -6 -3 6 -3z" class="kt-smine__spark" :class="{ 'is-busy': busy }" />
      </g>
      <text :x="AI.x + 12" :y="AI.y + 8" text-anchor="middle" class="kt-smine__ainame">AI</text>
    </g>
    <path d="M224 100 H 250" class="kt-smine__part kt-smine__wire" :class="{ 'is-on': at(SUMMARY_AT) }" :marker-end="`url(#${id('head')})`" />

    <g class="kt-smine__pop" :class="{ 'is-on': at(SUMMARY_AT) }">
      <g class="kt-smine__gem" :class="{ 'is-dull': at(DULL_AT) }">
        <rect x="256" y="74" width="40" height="52" rx="5" class="kt-smine__doc" />
        <path d="M264 86 h24 M264 97 h18 M264 108 h22 M264 118 h14" class="kt-smine__hl" />
      </g>
    </g>
    <text x="276" y="152" text-anchor="middle" class="kt-smine__part kt-smine__small" :class="{ 'is-on': at(SUMMARY_AT) }">summary.md</text>
    <path d="M304 100 H 334" class="kt-smine__part kt-smine__wire" :class="{ 'is-on': at(IDLE_AT) }" :marker-end="`url(#${id('head')})`" />

    <g class="kt-smine__part" :class="{ 'is-on': at(IDLE_AT) }">
      <circle cx="372" cy="100" r="26" class="kt-smine__ring" />
      <image href="/images/speaker.webp" x="348" y="76" width="48" height="48" :clip-path="`url(#${id('face')})`"
        preserveAspectRatio="xMidYMid slice" class="kt-smine__me is-idle" />
      <text x="372" y="152" text-anchor="middle" class="kt-smine__idle">idle</text>
    </g>

    <!-- the outcome, in the header row, opposite the name -->
    <g class="kt-smine__verdict" :class="{ 'is-on': at(STAMP_AT) }">
      <rect x="270" y="17" width="146" height="22" rx="11" class="kt-smine__verdictbox is-bad" />
      <text x="343" y="32" text-anchor="middle" class="kt-smine__verdicttext is-bad">fluency illusion</text>
    </g>

    <!-- ============ left bottom: the push-based architecture, me at the wheel ============ -->
    <g class="kt-smine__part" :class="{ 'is-on': at(MINE_AT) }">
      <rect x="10" y="194" width="420" height="178" rx="16" class="kt-smine__panel is-mine" />
      <text x="28" y="218" class="kt-smine__tag is-good">✓ push-based architecture</text>
    </g>
    <g class="kt-smine__part" :class="{ 'is-on': at(MINE_AT + 0.4) }">
      <rect v-for="(dx, i) in jitter" :key="`s${i}`" :x="26 + dx" :y="300 - i * 7" width="60" height="6" rx="2" class="kt-smine__sheet" />
      <text x="56" y="320" text-anchor="middle" class="kt-smine__small">~200 pages</text>
    </g>
    <g class="kt-smine__part" :class="{ 'is-on': at(MINE_AT + 0.8) }">
      <circle cx="122" cy="290" r="24" class="kt-smine__ring is-on" />
      <image href="/images/speaker.webp" x="100" y="268" width="44" height="44" :clip-path="`url(#${id('face')})`"
        preserveAspectRatio="xMidYMid slice" class="kt-smine__me" />
      <text x="122" y="344" text-anchor="middle" class="kt-smine__busy">synthesizing</text>
    </g>

    <!-- my diagram, bottom-up -->
    <rect x="166" y="232" width="146" height="132" rx="8" class="kt-smine__part kt-smine__board" :class="{ 'is-on': at(MINE_AT + 1.1) }" />
    <g v-for="l in layers" :key="`d${l.name}`">
      <rect x="176" :y="l.y" width="104" height="22" rx="4" pathLength="1" class="kt-smine__layer" :class="{ 'is-on': at(l.on) }" />
      <text x="228" :y="l.y + 15" text-anchor="middle" class="kt-smine__part kt-smine__layername" :class="{ 'is-on': at(l.on + 0.4) }">{{ l.name }}</text>
    </g>
    <path d="M296 352 V 246" pathLength="1" class="kt-smine__builds" :class="{ 'is-on': at(ARROW_AT) }" :marker-end="`url(#${id('ink')})`" />

    <!-- the AI pushes back: its question lands on my diagram; I answer, the "?" becomes a tick -->
    <g class="kt-smine__pop" :class="{ 'is-on': at(ASK_AT + 0.7) && !at(ANSWER_AT + 0.4) }" transform="translate(296 298)">
      <circle r="10" class="kt-smine__q" />
      <text y="5" text-anchor="middle" class="kt-smine__qtext">?</text>
    </g>
    <g class="kt-smine__pop" :class="{ 'is-on': at(ANSWER_AT + 0.4) }" transform="translate(296 298)">
      <circle r="10" class="kt-smine__fixed" />
      <path d="M-5 0 l3.5 4 l6.5 -8" class="kt-smine__fixedmark" />
    </g>
    <g class="kt-smine__part" :class="{ 'is-on': at(ASK_AT + 0.3) }">
      <rect x="320" y="234" width="104" height="26" rx="13" class="kt-smine__bubble is-push" />
      <text x="372" y="252" text-anchor="middle" class="kt-smine__prompt">why this way?</text>
    </g>
    <path d="M336 290 H 312" class="kt-smine__part kt-smine__wire is-push" :class="{ 'is-on': at(ASK_AT + 0.4) }" :marker-end="`url(#${id('push')})`" />
    <g class="kt-smine__part" :class="{ 'is-on': at(ASK_AT) }">
      <rect x="336" y="272" width="72" height="40" rx="12" class="kt-smine__ai" :class="{ 'is-busy': asking }" />
      <g transform="translate(356 292)">
        <path d="M0 -8 l2.5 5.5 5.5 2.5 -5.5 2.5 -2.5 5.5 -2.5 -5.5 -5.5 -2.5 5.5 -2.5z" class="kt-smine__spark" :class="{ 'is-busy': asking }" />
      </g>
      <text x="384" y="299" text-anchor="middle" class="kt-smine__ainame is-small">AI</text>
    </g>
    <!-- my answer goes back -->
    <path d="M312 306 H 334" class="kt-smine__part kt-smine__wire is-back" :class="{ 'is-on': at(ANSWER_AT) }" :marker-end="`url(#${id('back')})`" />

    <!-- the outcome, in the header row, opposite the name -->
    <g class="kt-smine__verdict" :class="{ 'is-on': at(DONE_AT) }">
      <rect x="262" y="203" width="154" height="22" rx="11" class="kt-smine__verdictbox is-good" />
      <text x="339" y="218" text-anchor="middle" class="kt-smine__verdicttext is-good">mastering concepts</text>
    </g>

    <!-- ============ right: the next group meeting ============ -->
    <g class="kt-smine__part" :class="{ 'is-on': at(MEET_AT) }">
      <rect x="452" y="8" width="210" height="26" rx="4" class="kt-smine__caption" />
      <text x="463" y="26" class="kt-smine__captiontext">THE NEXT GROUP MEETING</text>
    </g>
    <g class="kt-smine__part" :class="{ 'is-on': at(MEET_AT + 0.3) }">
      <rect x="520" y="44" width="346" height="186" rx="8" class="kt-smine__wb" />
      <rect x="528" y="52" width="330" height="170" rx="4" class="kt-smine__surface" />
      <text x="540" y="70" class="kt-smine__boardq">how it works</text>
    </g>
    <g class="kt-smine__part" :class="{ 'is-on': at(MEET_AT + 0.3) }">
      <circle cx="480" cy="140" r="30" class="kt-smine__ring is-on" />
      <image href="/images/speaker.webp" x="452" y="112" width="56" height="56" :clip-path="`url(#${id('face')})`"
        preserveAspectRatio="xMidYMid slice" class="kt-smine__me" />
    </g>
    <path v-for="(k, i) in ink" :key="`k${i}`" :d="k.d" pathLength="1" class="kt-smine__ink"
      :class="{ 'is-on': at(k.at), 'is-good': k.good }" />
    <template v-for="(k, i) in ink" :key="`l${i}`">
      <text v-if="k.label" x="650" :y="k.y" text-anchor="middle" class="kt-smine__part kt-smine__inklabel" :class="{ 'is-on': at(k.at + 0.5) }">{{ k.label }}</text>
    </template>

    <!-- the team, impressed: one at a time, the one talking lights up; Julia, the creator, last -->
    <g v-for="(q, i) in questions" :key="`q${i}`" class="kt-smine__say"
      :class="{ 'is-on': at(ASKS_AT + q.at), 'is-gone': at(ASKS_AT + q.until) }">
      <path :d="`M${q.head - 7} 270 L${q.head} 284 L${q.head + 7} 270z`" class="kt-smine__bubble" />
      <rect :x="q.x" y="244" :width="q.w" height="27" rx="13.5" class="kt-smine__bubble" />
      <path :d="`M${q.head - 6} 271 h12`" class="kt-smine__seam" />
      <text :x="q.x + q.w / 2" y="262" text-anchor="middle" class="kt-smine__ask">{{ q.text }}</text>
    </g>
    <g v-for="(p, i) in team" :key="p.name" class="kt-smine__pop" :class="{ 'is-on': at(TEAM_AT + i * 0.12) }">
      <g class="kt-smine__member" :class="{ 'is-talking': talking(i) }">
        <image :href="p.src" :x="HEAD(i) - 24" y="290" width="48" height="48" :clip-path="`url(#${id('face')})`" preserveAspectRatio="xMidYMid slice" />
        <circle :cx="HEAD(i)" cy="314" r="24" class="kt-smine__teamring" />
        <text :x="HEAD(i)" y="356" text-anchor="middle" class="kt-smine__teamname">{{ p.name }}</text>
      </g>
    </g>
    <g class="kt-smine__pop" :class="{ 'is-on': at(ASKS_AT + 4.8) }">
      <g>
        <rect :x="HEAD(0) - 86" y="306" width="56" height="16" rx="8" class="kt-smine__creator" />
        <text :x="HEAD(0) - 58" y="318" text-anchor="middle" class="kt-smine__creatortext">creator</text>
      </g>
    </g>
    <text x="818" y="320" text-anchor="middle" class="kt-smine__part kt-smine__clap" :class="{ 'is-on': at(CLAP_AT) }">CLAP CLAP!</text>
  </svg>
</template>

<style>
/* 844 wide (364 tall): with the headline that is what fits the slide */
.kt-smine {
  display: block;
  width: 844px;
  height: auto;
  font-family: var(--font-family-sans);
}

.kt-smine__part {
  opacity: 0;
  transition: opacity 0.4s, transform 0.4s ease-out;
}

.kt-smine__part.is-on { opacity: 1; }

.kt-smine__pop > * {
  transform: scale(0);
  transform-box: fill-box;
  transform-origin: center;
  transition: transform 0.35s cubic-bezier(0.3, 1.6, 0.5, 1);
}

.kt-smine__pop.is-on > * { transform: scale(1); }

/* the pages: a hand-stacked pile, as in JuliaStory */
.kt-smine__sheet { fill: var(--kt-card); stroke: var(--kt-c-primary-soft); stroke-width: 1.5; }

/* procrastination: the pages fly into the AI and are gone */
.kt-smine__fly {
  transform-box: fill-box;
  transform-origin: center;
  transition: transform 0.5s cubic-bezier(0.5, 0, 0.8, 0.6), opacity 0.5s 0.15s;
}

.kt-smine__fly.is-gone { opacity: 0; }

.kt-smine__panel { fill: var(--kt-tint-neutral); stroke: var(--kt-line); stroke-width: 2; transition: stroke 0.4s, fill 0.4s; }
.kt-smine__panel.is-trap { fill: var(--kt-tint-secondary); stroke: var(--kt-bad); stroke-opacity: 0.5; }
.kt-smine__panel.is-mine { fill: var(--kt-tint-primary); stroke: var(--kt-c-primary); }

.kt-smine__tag {
  font: 700 13px var(--font-family-mono);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  fill: var(--kt-bad);
}

.kt-smine__tag.is-good { fill: var(--kt-good); }
.kt-smine__small { font: 12px var(--font-family-mono); fill: var(--kt-subtle); }

.kt-smine__doc { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 1.5; }
.kt-smine__hl { stroke: var(--kt-warn); stroke-width: 5; stroke-linecap: round; stroke-opacity: 0.8; }

.kt-smine__bubble { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 1.5; stroke-linejoin: round; }
.kt-smine__prompt { font: 600 13px var(--font-family-sans); fill: var(--kt-fg); }

.kt-smine__ai { fill: var(--kt-tint-neutral); stroke: var(--kt-line-strong); stroke-width: 2; transition: stroke 0.3s, filter 0.3s; }
.kt-smine__ai.is-busy { stroke: var(--kt-warn); filter: drop-shadow(0 0 10px color-mix(in srgb, var(--kt-warn) 60%, transparent)); }
.kt-smine__spark { fill: var(--kt-subtle); transform-box: fill-box; transform-origin: center; }
.kt-smine__spark.is-busy { fill: var(--kt-warn); animation: kt-smine-spin 0.4s linear infinite; }
.kt-smine__ainame { font-size: 20px; font-weight: 800; fill: var(--kt-fg); }
.kt-smine__ainame.is-small { font-size: 17px; }

@keyframes kt-smine-spin {
  to { transform: rotate(360deg); }
}

.kt-smine__gem { transition: opacity 0.5s, filter 0.5s; }
.kt-smine__gem:not(.is-dull) { filter: drop-shadow(0 0 8px color-mix(in srgb, var(--kt-warn) 70%, transparent)); }
.kt-smine__gem.is-dull { opacity: 0.35; filter: grayscale(1); }

.kt-smine__ring { fill: none; stroke: var(--kt-line-strong); stroke-width: 2; }
.kt-smine__ring.is-on { stroke: var(--kt-good); stroke-width: 3; filter: drop-shadow(0 0 8px color-mix(in srgb, var(--kt-good) 60%, transparent)); }
.kt-smine__me.is-idle { filter: grayscale(1); opacity: 0.7; }
.kt-smine__idle { font: 12px var(--font-family-mono); fill: var(--kt-bad); }
.kt-smine__busy { font: 600 12px var(--font-family-mono); fill: var(--kt-good); }


/* the outcome of each architecture, a pill in its header row: fluency illusion / mastering concepts (the slide before) */
.kt-smine__verdict { opacity: 0; transform: translateX(8px); transition: opacity 0.35s, transform 0.35s; }
.kt-smine__verdict.is-on { opacity: 1; transform: none; }
.kt-smine__verdictbox { stroke-width: 1.5; }
.kt-smine__verdictbox.is-bad { fill: color-mix(in srgb, var(--kt-bad) 14%, var(--kt-bg)); stroke: var(--kt-bad); }
.kt-smine__verdictbox.is-good { fill: color-mix(in srgb, var(--kt-good) 14%, var(--kt-bg)); stroke: var(--kt-good); }
.kt-smine__verdicttext { font: 800 12px var(--font-family-mono); }
.kt-smine__verdicttext.is-bad { fill: var(--kt-bad); }
.kt-smine__verdicttext.is-good { fill: var(--kt-good); }

/* my diagram: a board, the layers drawn like marker strokes */
.kt-smine__board { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 1.5; }
.kt-smine__layer,
.kt-smine__builds {
  fill: none;
  stroke: var(--kt-c-primary-soft);
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  opacity: 0;
  transition: stroke-dashoffset 0.55s ease-in-out, fill 0.3s 0.4s, opacity 0.1s;
}

.kt-smine__layer.is-on { opacity: 1; stroke-dashoffset: 0; fill: color-mix(in srgb, var(--kt-c-primary) 14%, transparent); }
.kt-smine__builds.is-on { opacity: 1; stroke-dashoffset: 0; }
.kt-smine__inkhead { fill: var(--kt-c-primary-soft); }
.kt-smine__layername { font: 700 12px var(--font-family-mono); fill: var(--kt-heading); }

.kt-smine__q { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); stroke-width: 2.5; }
.kt-smine__qtext { font-size: 14px; font-weight: 800; fill: var(--kt-hot); }
.kt-smine__fixed { fill: var(--kt-good); }
.kt-smine__fixedmark { fill: none; stroke: var(--kt-bg); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }


.kt-smine__wire { fill: none; stroke: var(--kt-line-strong); stroke-width: 2; stroke-dasharray: 4 5; }
.kt-smine__wire.is-back { stroke: var(--kt-info); }
.kt-smine__head { fill: var(--kt-line-strong); }
.kt-smine__backhead { fill: var(--kt-info); }
/* the AI pushes back: its question and arrow in hot */
.kt-smine__wire.is-push { stroke: var(--kt-hot); stroke-dasharray: none; stroke-width: 2.5; }
.kt-smine__pushhead { fill: var(--kt-hot); }
.kt-smine__bubble.is-push { stroke: var(--kt-hot); stroke-width: 2; }

/* the meeting (MasteryStairs' visual language) */
.kt-smine__caption { fill: color-mix(in srgb, var(--kt-warn) 16%, var(--kt-bg)); stroke: var(--kt-warn); stroke-width: 1.5; }
.kt-smine__captiontext { font: 800 12px var(--font-family-mono); letter-spacing: 0.06em; fill: var(--kt-warn); }
.kt-smine__wb { fill: var(--kt-tint-neutral); stroke: var(--kt-line-strong); stroke-width: 2; }
.kt-smine__surface { fill: color-mix(in srgb, var(--kt-fg) 10%, var(--kt-bg)); stroke: var(--kt-line); stroke-width: 1; }
.kt-smine__boardq { font: 700 12px var(--font-family-mono); fill: var(--kt-muted); }
.kt-smine__ink {
  fill: none;
  stroke: var(--kt-c-primary-soft);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  transition: stroke-dashoffset 0.5s ease-in-out;
}
.kt-smine__ink.is-on { stroke-dashoffset: 0; }
.kt-smine__ink.is-good { stroke: var(--kt-good); stroke-width: 4; }
.kt-smine__inklabel { font: 700 13px var(--font-family-mono); fill: var(--kt-c-primary-soft); }

.kt-smine__say { opacity: 0; transform: translateY(6px); transition: opacity 0.25s, transform 0.25s; }
.kt-smine__say.is-on { opacity: 1; transform: none; }
.kt-smine__say.is-gone { opacity: 0; }
.kt-smine__seam { stroke: var(--kt-card); stroke-width: 2.5; }
.kt-smine__ask { font: 700 12px var(--font-family-mono); fill: var(--kt-heading); }
.kt-smine__teamring { fill: none; stroke: var(--kt-line-strong); stroke-width: 2; transition: stroke 0.3s, stroke-width 0.3s; }
.kt-smine__member.is-talking .kt-smine__teamring { stroke: var(--kt-warn); stroke-width: 3; }
.kt-smine__teamname { font: 600 12px var(--font-family-mono); fill: var(--kt-muted); transition: fill 0.3s; }
.kt-smine__member.is-talking .kt-smine__teamname { fill: var(--kt-warn); }
.kt-smine__creator { fill: var(--kt-warn); }
.kt-smine__creatortext { font: 800 10px var(--font-family-mono); fill: var(--kt-bg); }
.kt-smine__clap { font: 900 16px var(--font-family-mono); fill: var(--kt-warn); }

@media (prefers-reduced-motion: reduce) {
  .kt-smine__spark.is-busy { animation: none; }
}
</style>
