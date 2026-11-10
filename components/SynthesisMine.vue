<script setup lang="ts">
import { computed, useId } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * Never outsource synthesis, on one source: Julia's design system architecture, ~200 pages of docs
 * (JuliaStory's pile), twice. Plays once.
 * Top strip, procrastination: the pile; the prompt "find most important parts" types itself; the
 * pages fly into the AI card one by one, its sparkle spins; out pops summary.md, it slides to me
 * (grey, "idle"); it goes dull and a NOT MINE stamp slams over it.
 * Bottom panel, proactive: the same pile, me in color. 1 · find concepts: concept diamonds pop
 * out of the pages. 2 · group them: each concept moves into its group, tokens, primitives,
 * components, patterns. 3 · draw the diagram: the groups become layers on a board, drawn bottom-up,
 * components and primitives the wrong way round, and a "builds on" arrow. 4 · ask where I'm stuck:
 * a "?" lands on the arrow, I ask the AI "why this way?", it answers with a clarification; the
 * clarification goes back into my diagram: the two layers swap into place, the "?" becomes a tick.
 * A lock "mine" closes over the panel.
 * The layer names are the ones I draw in JuliaStory and MasteryStairs. No props.
 */
const { t, at } = useTimeline(30)
const uid = useId()
const id = (name: string) => `kt-smine-${name}-${uid}`

// a little jitter, so the piles look stacked by hand (as in JuliaStory)
const jitter = [0, 5, -3, 4, -5, 2, -2, 5]

// procrastination: the pile flies into the AI
const AI = { x: 480, y: 92 }
const prompt = '“find most important parts”'
const typed = computed(() => prompt.slice(0, Math.max(0, Math.floor((t.value - 2.4) * 20))))
const topPile = jitter.map((dx, i) => {
  const x = 40 + dx
  const y = 112 - i * 7
  return { x, y, on: 4.4 + (7 - i) * 0.18, dx: AI.x - 40 - (x + 48), dy: AI.y - y }
})
const busy = computed(() => at(5.6) && !at(7.2))

// proactive, 1: while I read, I find the concepts: they pop out of the pages
const FIND_AT = 15.0
const cloud: [number, number][] = [[160, 236], [214, 244], [186, 272], [236, 280], [156, 304], [210, 314], [180, 340], [234, 346]]
// proactive, 2: I group the concepts: each one moves into its group's row
const GROUP_AT = 18.2
const groups = ['tokens', 'primitives', 'components', 'patterns'].map((name, g) => ({ name, y: 240 + g * 32 }))
const concepts = cloud.map(([x, y], i) => {
  const g = i % 4
  const slot = Math.floor(i / 4)
  return { x, y, on: FIND_AT + i * 0.3, move: GROUP_AT + i * 0.2, dx: 276 + slot * 20 - x, dy: groups[g].y - y }
})
const grouped = (g: number) => at(GROUP_AT + g * 0.2 + 0.4)

// proactive, 3: the groups become layers, drawn bottom-up; I get two of them the wrong way round
const DRAW_AT = 20.8
const layers = [
  { name: 'tokens', y: 322, swap: 0 },
  { name: 'components', y: 290, swap: -32 },
  { name: 'primitives', y: 258, swap: 32 },
  { name: 'patterns', y: 226, swap: 0 },
].map((l, k) => ({ ...l, on: DRAW_AT + k * 0.5 }))
const ARROW_AT = DRAW_AT + 2.1

// proactive, 4: ask only where I'm stuck; the clarification goes back into my diagram: the two
// layers swap into place and the "?" becomes a tick
const ASK_AT = 23.8
const asking = computed(() => at(ASK_AT + 0.9) && !at(ASK_AT + 2.1))
const FIX_AT = ASK_AT + 3.0
const LOCK_AT = 28.6
</script>

<template>
  <svg class="kt-smine" viewBox="0 0 880 380" role="img"
    aria-label="Procrastination: the 200 pages of the design system architecture go into the AI with the prompt, find most important parts. Out comes summary.md, handed to me while I stay idle; it goes dull and gets stamped: not mine. Proactive: I find the concepts in the pages myself, group them into tokens, primitives, components and patterns, draw the diagram, layer on layer, and ask the AI only where I'm stuck: why this way? It answers with a clarification, and I fix my diagram: two layers swap into place. A lock closes over it: mine.">
    <defs>
      <marker :id="id('head')" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0 0 L10 5 L0 10 z" class="kt-smine__head" />
      </marker>
      <marker :id="id('ink')" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto">
        <path d="M0 0 L10 5 L0 10 z" class="kt-smine__inkhead" />
      </marker>
      <clipPath :id="id('idle')"><circle cx="720" cy="86" r="26" /></clipPath>
      <marker :id="id('back')" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0 0 L10 5 L0 10 z" class="kt-smine__backhead" />
      </marker>
      <clipPath :id="id('me')"><circle cx="66" cy="320" r="22" /></clipPath>
    </defs>

    <!-- procrastination: 200 pages in, summary.md out -->
    <g class="kt-smine__part" :class="{ 'is-on': at(0.2) }">
      <rect x="10" y="8" width="860" height="142" rx="16" class="kt-smine__panel is-trap" />
      <text x="28" y="32" class="kt-smine__tag">✕ procrastination</text>
    </g>
    <g v-for="(s, i) in topPile" :key="`f${i}`" class="kt-smine__part" :class="{ 'is-on': at(1.0) }">
      <rect class="kt-smine__sheet kt-smine__fly" :class="{ 'is-gone': at(s.on) }" :x="s.x" :y="s.y" width="96" height="6" rx="2"
        :style="at(s.on) ? { transform: `translate(${s.dx}px, ${s.dy}px) scale(0.3)` } : {}" />
    </g>
    <text x="88" y="140" text-anchor="middle" class="kt-smine__part kt-smine__small" :class="{ 'is-on': at(1.0) && !at(5.6) }">~200 pages</text>
    <text x="88" y="52" text-anchor="middle" class="kt-smine__part kt-smine__dsa" :class="{ 'is-on': at(1.0) && !at(5.6) }">architecture docs</text>

    <g class="kt-smine__part" :class="{ 'is-on': at(2.4) }">
      <rect x="272" y="18" width="276" height="32" rx="16" class="kt-smine__bubble" />
      <text x="410" y="39" text-anchor="middle" class="kt-smine__prompt">{{ typed }}</text>
    </g>
    <path d="M262 92 H 420" class="kt-smine__part kt-smine__wire" :class="{ 'is-on': at(4.4) }" :marker-end="`url(#${id('head')})`" />

    <g class="kt-smine__part" :class="{ 'is-on': at(1.0) }">
      <rect :x="AI.x - 50" :y="AI.y - 32" width="100" height="64" rx="14" class="kt-smine__ai" :class="{ 'is-busy': busy }" />
      <g :transform="`translate(${AI.x - 24} ${AI.y})`">
        <path d="M0 -10 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" class="kt-smine__spark" :class="{ 'is-busy': busy }" />
      </g>
      <text :x="AI.x + 14" :y="AI.y + 8" text-anchor="middle" class="kt-smine__ainame">AI</text>
    </g>
    <path d="M534 92 H 566" class="kt-smine__part kt-smine__wire" :class="{ 'is-on': at(7.2) }" :marker-end="`url(#${id('head')})`" />

    <g class="kt-smine__pop" :class="{ 'is-on': at(7.2) }">
      <g class="kt-smine__gem" :class="{ 'is-dull': at(10.4) }">
        <rect x="576" y="62" width="48" height="60" rx="5" class="kt-smine__doc" />
        <path d="M585 76 h30 M585 88 h24 M585 100 h28 M585 112 h18" class="kt-smine__hl" />
      </g>
    </g>
    <text x="600" y="140" text-anchor="middle" class="kt-smine__part kt-smine__small" :class="{ 'is-on': at(7.2) }">summary.md</text>
    <path d="M634 92 H 682" class="kt-smine__part kt-smine__wire" :class="{ 'is-on': at(8.0) }" :marker-end="`url(#${id('head')})`" />

    <g class="kt-smine__part" :class="{ 'is-on': at(8.0) }">
      <circle cx="720" cy="86" r="28" class="kt-smine__ring" />
      <image href="/images/speaker.webp" x="694" y="60" width="52" height="52" :clip-path="`url(#${id('idle')})`"
        preserveAspectRatio="xMidYMid slice" class="kt-smine__me is-idle" />
      <text x="720" y="136" text-anchor="middle" class="kt-smine__idle">idle</text>
    </g>

    <g class="kt-smine__stamp" :class="{ 'is-on': at(10.8) }">
      <g transform="translate(652 92) rotate(-8)">
        <rect x="-88" y="-22" width="176" height="44" rx="6" class="kt-smine__stampbox" />
        <text y="10" text-anchor="middle" class="kt-smine__stamptext">NOT MINE</text>
      </g>
    </g>

    <!-- proactive: the same 200 pages, worked through by me -->
    <g class="kt-smine__part" :class="{ 'is-on': at(13.0) }">
      <rect x="10" y="164" width="860" height="208" rx="16" class="kt-smine__panel is-mine" :class="{ 'is-locked': at(LOCK_AT) }" />
      <text x="28" y="188" class="kt-smine__tag is-good">✓ proactive</text>
    </g>
    <g class="kt-smine__part" :class="{ 'is-on': at(13.5) }">
      <rect v-for="(dx, i) in jitter" :key="`s${i}`" :x="26 + dx" :y="256 - i * 7" width="80" height="6" rx="2" class="kt-smine__sheet" />
      <text x="66" y="280" text-anchor="middle" class="kt-smine__small">~200 pages</text>
    </g>
    <g class="kt-smine__part" :class="{ 'is-on': at(14.2) }">
      <circle cx="66" cy="320" r="24" class="kt-smine__ring is-on" />
      <image href="/images/speaker.webp" x="44" y="298" width="44" height="44" :clip-path="`url(#${id('me')})`"
        preserveAspectRatio="xMidYMid slice" class="kt-smine__me" />
      <text x="66" y="362" text-anchor="middle" class="kt-smine__busy">doing the work</text>
    </g>

    <!-- 1 · find concepts -->
    <text x="190" y="206" text-anchor="middle" class="kt-smine__part kt-smine__step" :class="{ 'is-on': at(FIND_AT - 0.4) }">1 · find concepts</text>
    <!-- where each concept was found stays marked once it has moved on -->
    <path v-for="(c, i) in concepts" :key="`h${i}`" :d="`M${c.x} ${c.y - 9} l9 9 -9 9 -9 -9z`"
      class="kt-smine__part kt-smine__ghost" :class="{ 'is-on': at(c.move) }" />
    <g v-for="(c, i) in concepts" :key="`c${i}`" class="kt-smine__pop" :class="{ 'is-on': at(c.on) }">
      <g>
        <g class="kt-smine__move" :style="at(c.move) ? { transform: `translate(${c.dx}px, ${c.dy}px)` } : {}">
          <path :d="`M${c.x} ${c.y - 9} l9 9 -9 9 -9 -9z`" class="kt-smine__diamond" />
          <path :d="`M${c.x} ${c.y - 4} l4 4 -4 4 -4 -4z`" class="kt-smine__dcore" />
        </g>
      </g>
    </g>

    <!-- 2 · group them -->
    <text x="330" y="206" text-anchor="middle" class="kt-smine__part kt-smine__step" :class="{ 'is-on': at(GROUP_AT - 0.4) }">2 · group them</text>
    <text v-for="(g, k) in groups" :key="g.name" x="310" :y="g.y + 5" class="kt-smine__part kt-smine__group"
      :class="{ 'is-on': grouped(k) }">{{ g.name }}</text>

    <!-- 3 · draw the diagram -->
    <text x="490" y="206" text-anchor="middle" class="kt-smine__part kt-smine__step" :class="{ 'is-on': at(DRAW_AT - 0.4) }">3 · draw the diagram</text>
    <rect x="402" y="214" width="176" height="146" rx="8" class="kt-smine__part kt-smine__board" :class="{ 'is-on': at(DRAW_AT - 0.4) }" />
    <g v-for="l in layers" :key="`d${l.name}`" class="kt-smine__swap" :class="{ 'is-fixed': l.swap && at(FIX_AT) }"
      :style="l.swap && at(FIX_AT) ? { transform: `translateY(${l.swap}px)` } : {}">
      <rect x="414" :y="l.y" width="128" height="26" rx="4" pathLength="1" class="kt-smine__layer" :class="{ 'is-on': at(l.on) }" />
      <text x="478" :y="l.y + 18" text-anchor="middle" class="kt-smine__part kt-smine__layername" :class="{ 'is-on': at(l.on + 0.4) }">{{ l.name }}</text>
    </g>
    <path d="M558 346 V 230" pathLength="1" class="kt-smine__builds" :class="{ 'is-on': at(ARROW_AT) }" :marker-end="`url(#${id('ink')})`" />
    <text x="570" y="332" text-anchor="middle" transform="rotate(-90 570 332)" class="kt-smine__part kt-smine__small is-tight"
      :class="{ 'is-on': at(ARROW_AT + 0.5) }">builds on</text>

    <!-- 4 · ask where I'm stuck, then fix the diagram -->
    <g class="kt-smine__pop" :class="{ 'is-on': at(ASK_AT) && !at(FIX_AT) }" transform="translate(558 286)">
      <circle r="11" class="kt-smine__q" />
      <text y="5" text-anchor="middle" class="kt-smine__qtext">?</text>
    </g>
    <g class="kt-smine__pop" :class="{ 'is-on': at(FIX_AT + 0.4) }" transform="translate(558 272)">
      <circle r="11" class="kt-smine__fixed" />
      <path d="M-5 0 l3.5 4 l6.5 -8" class="kt-smine__fixedmark" />
    </g>
    <text x="700" y="206" text-anchor="middle" class="kt-smine__part kt-smine__step" :class="{ 'is-on': at(ASK_AT) }">4 · ask where I'm stuck</text>
    <g class="kt-smine__part" :class="{ 'is-on': at(ASK_AT + 0.6) }">
      <rect x="626" y="214" width="148" height="28" rx="14" class="kt-smine__bubble" />
      <text x="700" y="233" text-anchor="middle" class="kt-smine__prompt">“why this way?”</text>
    </g>
    <path d="M572 278 H 642" class="kt-smine__part kt-smine__wire" :class="{ 'is-on': at(ASK_AT + 0.6) && !at(FIX_AT) }" :marker-end="`url(#${id('head')})`" />
    <g class="kt-smine__part" :class="{ 'is-on': at(ASK_AT) }">
      <rect x="650" y="252" width="100" height="50" rx="12" class="kt-smine__ai" :class="{ 'is-busy': asking }" />
      <g transform="translate(678 277)">
        <path d="M0 -9 l3 6 6 3 -6 3 -3 6 -3 -6 -6 -3 6 -3z" class="kt-smine__spark" :class="{ 'is-busy': asking }" />
      </g>
      <text x="714" y="284" text-anchor="middle" class="kt-smine__ainame">AI</text>
    </g>
    <path d="M700 306 V 318" class="kt-smine__part kt-smine__wire" :class="{ 'is-on': at(ASK_AT + 2.1) }" :marker-end="`url(#${id('head')})`" />
    <g class="kt-smine__pop" :class="{ 'is-on': at(ASK_AT + 2.1) }">
      <rect x="636" y="324" width="128" height="34" rx="8" class="kt-smine__answer" />
    </g>
    <text x="700" y="346" text-anchor="middle" class="kt-smine__part kt-smine__answertext" :class="{ 'is-on': at(ASK_AT + 2.3) }">clarification</text>
    <!-- the clarification goes back into my diagram -->
    <path d="M632 341 H 588" class="kt-smine__part kt-smine__wire is-back" :class="{ 'is-on': at(FIX_AT - 0.4) }" :marker-end="`url(#${id('back')})`" />

    <!-- the lock: mine -->
    <g class="kt-smine__pop" :class="{ 'is-on': at(LOCK_AT) }" transform="translate(816 290)">
      <rect x="-46" y="-20" width="92" height="40" rx="20" class="kt-smine__lock" />
      <path d="M-31 -5 v-5 a7 7 0 0 1 14 0 v5" class="kt-smine__shackle" />
      <rect x="-34" y="-5" width="20" height="15" rx="2.5" class="kt-smine__body" />
      <text x="14" y="7" text-anchor="middle" class="kt-smine__locktext">mine</text>
    </g>
  </svg>
</template>

<style>
.kt-smine {
  width: 880px;
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
.kt-smine__dsa { font-size: 13px; font-weight: 800; fill: var(--kt-c-primary-soft); }

/* procrastination: the pages fly into the AI and are gone */
.kt-smine__fly {
  transform-box: fill-box;
  transform-origin: center;
  transition: transform 0.5s cubic-bezier(0.5, 0, 0.8, 0.6), opacity 0.5s 0.15s;
}

.kt-smine__fly.is-gone { opacity: 0; }

/* proactive: the concepts move, one by one, into their group */
.kt-smine__move { transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1); }
.kt-smine__diamond { fill: var(--kt-code-bg); stroke: var(--kt-warn); stroke-width: 2.5; stroke-linejoin: round; }
.kt-smine__dcore { fill: var(--kt-info); }
.kt-smine__ghost { fill: none; stroke: var(--kt-warn); stroke-width: 1.5; stroke-dasharray: 3 3; }
.kt-smine__part.kt-smine__ghost.is-on { opacity: 0.45; }

/* the fix: two layers swap into place */
.kt-smine__swap { transition: transform 0.6s cubic-bezier(0.5, 0, 0.3, 1.3); }
.kt-smine__swap.is-fixed .kt-smine__layer { stroke: var(--kt-good); fill: color-mix(in srgb, var(--kt-good) 16%, transparent); }
.kt-smine__fixed { fill: var(--kt-good); }
.kt-smine__fixedmark { fill: none; stroke: var(--kt-bg); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
.kt-smine__wire.is-back { stroke: var(--kt-info); }
.kt-smine__backhead { fill: var(--kt-info); }

.kt-smine__panel { fill: var(--kt-tint-neutral); stroke: var(--kt-line); stroke-width: 2; transition: stroke 0.4s, fill 0.4s; }
.kt-smine__panel.is-trap { fill: var(--kt-tint-secondary); stroke: var(--kt-bad); stroke-opacity: 0.5; }
.kt-smine__panel.is-mine { fill: var(--kt-tint-primary); stroke: var(--kt-c-primary); }
.kt-smine__panel.is-locked { stroke: var(--kt-hot); stroke-width: 3; }

.kt-smine__tag {
  font: 700 13px var(--font-family-mono);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  fill: var(--kt-bad);
}

.kt-smine__tag.is-good { fill: var(--kt-good); }
.kt-smine__small { font: 13px var(--font-family-mono); fill: var(--kt-subtle); }
.kt-smine__small.is-tight { font-size: 11px; }
.kt-smine__step { font: 700 13px var(--font-family-mono); fill: var(--kt-fg); }
.kt-smine__group { font: 700 13px var(--font-family-mono); fill: var(--kt-c-primary-soft); }

.kt-smine__doc { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 1.5; }
.kt-smine__hl { stroke: var(--kt-warn); stroke-width: 5; stroke-linecap: round; stroke-opacity: 0.8; }

.kt-smine__bubble { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 1.5; }
.kt-smine__prompt { font-size: 14px; font-weight: 600; fill: var(--kt-fg); }

.kt-smine__ai { fill: var(--kt-tint-neutral); stroke: var(--kt-line-strong); stroke-width: 2; transition: stroke 0.3s, filter 0.3s; }
.kt-smine__ai.is-busy { stroke: var(--kt-warn); filter: drop-shadow(0 0 10px color-mix(in srgb, var(--kt-warn) 60%, transparent)); }
.kt-smine__spark { fill: var(--kt-subtle); transform-box: fill-box; transform-origin: center; }
.kt-smine__spark.is-busy { fill: var(--kt-warn); animation: kt-smine-spin 0.4s linear infinite; }
.kt-smine__ainame { font-size: 22px; font-weight: 800; fill: var(--kt-fg); }

@keyframes kt-smine-spin {
  to { transform: rotate(360deg); }
}

.kt-smine__gem { transition: opacity 0.5s, filter 0.5s; }
.kt-smine__gem:not(.is-dull) { filter: drop-shadow(0 0 8px color-mix(in srgb, var(--kt-warn) 70%, transparent)); }
.kt-smine__gem.is-dull { opacity: 0.35; filter: grayscale(1); }

.kt-smine__ring { fill: none; stroke: var(--kt-line-strong); stroke-width: 2; }
.kt-smine__ring.is-on { stroke: var(--kt-good); stroke-width: 3; filter: drop-shadow(0 0 8px color-mix(in srgb, var(--kt-good) 60%, transparent)); }
.kt-smine__me.is-idle { filter: grayscale(1); opacity: 0.7; }
.kt-smine__idle { font: 13px var(--font-family-mono); fill: var(--kt-bad); }
.kt-smine__busy { font: 600 12px var(--font-family-mono); fill: var(--kt-good); }

.kt-smine__stamp {
  opacity: 0;
  transform: scale(1.8);
  transform-box: fill-box;
  transform-origin: center;
  transition: opacity 0.15s, transform 0.25s cubic-bezier(0.5, 0, 0.7, 1.4);
}

.kt-smine__stamp.is-on { opacity: 1; transform: scale(1); }
.kt-smine__stampbox { fill: color-mix(in srgb, var(--kt-bg) 70%, transparent); stroke: var(--kt-bad); stroke-width: 3.5; }
.kt-smine__stamptext { font: 900 26px var(--font-family-mono); letter-spacing: 0.1em; fill: var(--kt-bad); }

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
.kt-smine__layername { font: 700 13px var(--font-family-mono); fill: var(--kt-heading); }

.kt-smine__q { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); stroke-width: 2.5; }
.kt-smine__qtext { font-size: 15px; font-weight: 800; fill: var(--kt-hot); }

.kt-smine__answer { fill: color-mix(in srgb, var(--kt-info) 16%, transparent); stroke: var(--kt-info); stroke-width: 2; }
.kt-smine__answertext { font: 600 14px var(--font-family-mono); fill: var(--kt-fg); }

.kt-smine__lock { fill: var(--kt-hot); }
.kt-smine__shackle { fill: none; stroke: var(--kt-bg); stroke-width: 2.5; }
.kt-smine__body { fill: var(--kt-bg); }
.kt-smine__locktext { font-size: 18px; font-weight: 800; fill: var(--kt-bg); }

.kt-smine__wire { fill: none; stroke: var(--kt-line-strong); stroke-width: 2; stroke-dasharray: 4 5; }
.kt-smine__head { fill: var(--kt-line-strong); }

@media (prefers-reduced-motion: reduce) {
  .kt-smine__spark.is-busy { animation: none; }
}
</style>
