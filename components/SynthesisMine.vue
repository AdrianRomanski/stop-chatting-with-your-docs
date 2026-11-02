<script setup lang="ts">
import { computed, useId } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * Never outsource synthesis, shown as the shortcut first, then the rule.
 * Top strip, the counter-example: three articles; the prompt "find the concepts and the best
 * parts" types itself; the articles fly into the AI card one by one, its sparkle spins; out pop
 * three shiny concept diamonds and a "best parts" card, they slide to me (grey, "idle"); then the
 * diamonds go dull and a NOT MINE stamp slams over them.
 * Below, the rule. Distill, one source to its essence: bold, highlight, summary (the graph view's
 * colours: blue, yellow, green). Synthesize, ideas from different sources link into one new
 * concept, the diamond of ReadingFlow and GraphDistill, and a lock "mine" closes over it. The same
 * AI reaches for it ("do it for me"), bounces off with a red ✕, and is left asking "?".
 * No props.
 */
const { t, at } = useTimeline(33)
const uid = useId()
const id = (name: string) => `kt-smine-${name}-${uid}`

// the counter-example
const prompt = '“find the concepts and the best parts”'
const typed = computed(() => prompt.slice(0, Math.max(0, Math.floor((t.value - 4.0) * 20))))
const AI = { x: 470, y: 74 }
const articles = [
  { x: 40, y: 46, on: 6.4 },
  { x: 76, y: 52, on: 6.7 },
  { x: 112, y: 46, on: 7.0 },
].map(a => ({ ...a, dx: AI.x - (a.x + 22), dy: AI.y - (a.y + 28) }))
const busy = computed(() => at(7.3) && !at(9.0))
const outs = [{ x: 600, on: 9.0 }, { x: 644, on: 9.2 }, { x: 688, on: 9.4 }]

// the rule
const marks = [
  { x: 256, label: 'bold', tone: 'is-bold', on: 17.0 },
  { x: 344, label: 'highlight', tone: 'is-hl', on: 17.6 },
  { x: 482, label: 'summary', tone: 'is-sum', on: 18.2 },
]
const ideas = [
  { x: 60, y: 270, src: 'book' },
  { x: 60, y: 330, src: 'talk' },
  { x: 160, y: 260, src: 'project' },
  { x: 160, y: 340, src: 'note' },
]
const D = { x: 420, y: 300 }
</script>

<template>
  <svg class="kt-smine" viewBox="0 0 880 380" role="img"
    aria-label="The shortcut: three articles go into the AI with the prompt, find the concepts and the best parts. Out come shiny concepts and best parts, handed to me while I stay idle; they go dull and get stamped: not mine. The rule: distill, one source to its essence: bold, highlight, summary. Synthesize: ideas from a book, a talk, a project and a note link into one new concept, and a lock closes over it: mine. The AI reaches for the synthesis, do it for me, bounces off the lock, and is left asking a question.">
    <defs>
      <marker :id="id('head')" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0 0 L10 5 L0 10 z" class="kt-smine__head" />
      </marker>
      <clipPath :id="id('face')"><circle cx="826" cy="62" r="26" /></clipPath>
    </defs>

    <!-- the shortcut: articles in, "concepts" out -->
    <g class="kt-smine__part" :class="{ 'is-on': at(0.2) }">
      <rect x="10" y="8" width="860" height="118" rx="16" class="kt-smine__panel is-trap" />
      <text x="28" y="30" class="kt-smine__tag">✕ the shortcut</text>
    </g>
    <g v-for="(a, i) in articles" :key="`a${i}`" class="kt-smine__part" :class="{ 'is-on': at(2.0) }">
      <g class="kt-smine__fly" :class="{ 'is-gone': at(a.on) }"
        :style="at(a.on) ? { transform: `translate(${a.dx}px, ${a.dy}px) scale(0.2)` } : {}">
        <rect :x="a.x" :y="a.y" width="44" height="56" rx="5" class="kt-smine__doc" />
        <path :d="`M${a.x + 8} ${a.y + 12} h28 M${a.x + 8} ${a.y + 24} h22 M${a.x + 8} ${a.y + 34} h26 M${a.x + 8} ${a.y + 44} h18`" class="kt-smine__lines" />
      </g>
    </g>
    <text x="78" y="118" text-anchor="middle" class="kt-smine__part kt-smine__small" :class="{ 'is-on': at(2.0) && !at(7.0) }">articles</text>

    <g class="kt-smine__part" :class="{ 'is-on': at(4.0) }">
      <rect x="156" y="34" width="262" height="34" rx="17" class="kt-smine__bubble" />
      <text x="287" y="56" text-anchor="middle" class="kt-smine__prompt">{{ typed }}</text>
          </g>
    <path d="M160 86 H 410" class="kt-smine__part kt-smine__wire" :class="{ 'is-on': at(6.4) }" :marker-end="`url(#${id('head')})`" />

    <g class="kt-smine__part" :class="{ 'is-on': at(2.0) }">
      <rect :x="AI.x - 50" :y="AI.y - 32" width="100" height="64" rx="14" class="kt-smine__ai" :class="{ 'is-busy': busy }" />
      <g :transform="`translate(${AI.x - 24} ${AI.y})`">
        <path d="M0 -10 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" class="kt-smine__spark" :class="{ 'is-busy': busy }" />
      </g>
      <text :x="AI.x + 14" :y="AI.y + 8" text-anchor="middle" class="kt-smine__ainame">AI</text>
    </g>
    <path d="M524 74 H 572" class="kt-smine__part kt-smine__wire" :class="{ 'is-on': at(9.0) }" :marker-end="`url(#${id('head')})`" />

    <g v-for="o in outs" :key="`o${o.x}`" class="kt-smine__pop" :class="{ 'is-on': at(o.on) }">
      <g class="kt-smine__gem" :class="{ 'is-dull': at(12.4) }">
        <rect :x="o.x - 14" y="60" width="28" height="28" rx="4" :transform="`rotate(45 ${o.x} 74)`" class="kt-smine__dframe" />
        <rect :x="o.x - 7" y="67" width="14" height="14" rx="2" :transform="`rotate(45 ${o.x} 74)`" class="kt-smine__dcore" />
      </g>
    </g>
    <g class="kt-smine__pop" :class="{ 'is-on': at(9.0) && !at(12.4) }">
      <path d="M626 40 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z M712 98 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" class="kt-smine__shine" />
    </g>
    <text x="644" y="116" text-anchor="middle" class="kt-smine__part kt-smine__small" :class="{ 'is-on': at(9.4) }">concepts</text>
    <g class="kt-smine__pop" :class="{ 'is-on': at(9.6) }">
      <g class="kt-smine__gem" :class="{ 'is-dull': at(12.4) }">
        <rect x="722" y="48" width="44" height="54" rx="5" class="kt-smine__doc" />
        <path d="M730 60 h28 M730 72 h22 M730 84 h26" class="kt-smine__hl" />
      </g>
    </g>
    <text x="744" y="116" text-anchor="middle" class="kt-smine__part kt-smine__small" :class="{ 'is-on': at(9.6) }">best parts</text>
    <path d="M772 74 H 794" class="kt-smine__part kt-smine__wire" :class="{ 'is-on': at(10.6) }" :marker-end="`url(#${id('head')})`" />

    <g class="kt-smine__part" :class="{ 'is-on': at(10.6) }">
      <circle cx="826" cy="62" r="28" class="kt-smine__ring" />
      <image href="/images/speaker.webp" x="800" y="36" width="52" height="52" :clip-path="`url(#${id('face')})`"
        preserveAspectRatio="xMidYMid slice" class="kt-smine__me" />
      <text x="826" y="112" text-anchor="middle" class="kt-smine__idle">idle</text>
    </g>

    <g class="kt-smine__stamp" :class="{ 'is-on': at(12.8) }">
      <g transform="translate(672 78) rotate(-8)">
        <rect x="-88" y="-22" width="176" height="44" rx="6" class="kt-smine__stampbox" />
        <text y="10" text-anchor="middle" class="kt-smine__stamptext">NOT MINE</text>
      </g>
    </g>

    <!-- the rule: distill, one source, its essence -->
    <g class="kt-smine__part" :class="{ 'is-on': at(15.5) }">
      <rect x="10" y="140" width="600" height="76" rx="16" class="kt-smine__panel" />
      <text x="32" y="172" class="kt-smine__title">distill</text>
      <text x="32" y="196" class="kt-smine__what">one source → its essence</text>
    </g>
    <g v-for="m in marks" :key="m.label" class="kt-smine__part" :class="{ 'is-on': at(m.on) }">
      <rect :x="m.x" y="161" :width="m.label.length * 10 + 28" height="34" rx="17" class="kt-smine__chip" :class="m.tone" />
      <text :x="m.x + (m.label.length * 10 + 28) / 2" y="184" text-anchor="middle" class="kt-smine__chiptext">{{ m.label }}</text>
    </g>

    <!-- synthesize: many ideas, one new concept -->
    <g class="kt-smine__part" :class="{ 'is-on': at(20.0) }">
      <rect x="10" y="228" width="600" height="144" rx="16" class="kt-smine__panel is-mine" :class="{ 'is-locked': at(30.0) }" />
      <text x="470" y="258" class="kt-smine__title is-hot">synthesize</text>
      <text x="470" y="282" class="kt-smine__what">ideas →</text>
      <text x="470" y="302" class="kt-smine__what">a new concept</text>
    </g>
    <g v-for="(n, i) in ideas" :key="n.src" class="kt-smine__part" :class="{ 'is-on': at(21 + i * 0.4) }">
      <rect :x="n.x - 36" :y="n.y - 16" width="72" height="32" rx="8" class="kt-smine__idea" />
      <text :x="n.x" :y="n.y + 5" text-anchor="middle" class="kt-smine__src">{{ n.src }}</text>
    </g>
    <path v-for="(n, i) in ideas" :key="`l${i}`" :d="`M${n.x + 38} ${n.y} L${D.x - 30} ${D.y}`" pathLength="1"
      class="kt-smine__link" :class="{ 'is-on': at(22.8 + i * 0.3) }" />
    <g class="kt-smine__pop" :class="{ 'is-on': at(24.2) }">
      <rect :x="D.x - 20" :y="D.y - 20" width="40" height="40" rx="5" :transform="`rotate(45 ${D.x} ${D.y})`" class="kt-smine__dframe" />
      <rect :x="D.x - 10" :y="D.y - 10" width="20" height="20" rx="3" :transform="`rotate(45 ${D.x} ${D.y})`" class="kt-smine__dcore" />
    </g>
    <text :x="D.x" :y="D.y + 52" text-anchor="middle" class="kt-smine__part kt-smine__name" :class="{ 'is-on': at(24.2) }">concept</text>

    <!-- the lock: mine -->
    <g class="kt-smine__pop" :class="{ 'is-on': at(30.0) }" transform="translate(560 346)">
      <rect x="-40" y="-18" width="80" height="34" rx="17" class="kt-smine__lock" />
      <path d="M-26 -4 v-4 a6 6 0 0 1 12 0 v4" class="kt-smine__shackle" />
      <rect x="-29" y="-4" width="18" height="13" rx="2.5" class="kt-smine__body" />
      <text x="12" y="6" text-anchor="middle" class="kt-smine__locktext">mine</text>
    </g>

    <!-- the AI reaches in, bounces off, and may only ask -->
    <g class="kt-smine__part" :class="{ 'is-on': at(29.0) }">
      <rect x="720" y="264" width="120" height="72" rx="14" class="kt-smine__ai" />
      <path d="M750 286 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" class="kt-smine__spark" />
      <text x="800" y="306" text-anchor="middle" class="kt-smine__ainame">AI</text>
    </g>
    <g class="kt-smine__reach" :class="{ 'is-on': at(29.0), 'is-back': at(30.0) }">
      <path d="M712 300 H 624" class="kt-smine__wire" :marker-end="`url(#${id('head')})`" />
    </g>
    <text x="668" y="270" text-anchor="middle" class="kt-smine__part kt-smine__ask" :class="{ 'is-on': at(29.0) }">“do it for me”</text>
    <g class="kt-smine__pop" :class="{ 'is-on': at(30.0) }" transform="translate(668 300)">
      <circle r="15" class="kt-smine__x" />
      <path d="M-6 -6 L6 6 M6 -6 L-6 6" class="kt-smine__xmark" />
    </g>
    <g class="kt-smine__pop" :class="{ 'is-on': at(32.0) }" transform="translate(780 228)">
      <circle r="20" class="kt-smine__q" />
      <text y="7" text-anchor="middle" class="kt-smine__qtext">?</text>
    </g>
    <text x="780" y="364" text-anchor="middle" class="kt-smine__part kt-smine__may" :class="{ 'is-on': at(32.0) }">it may only ask</text>
  </svg>
</template>

<style>
.kt-smine {
  width: 880px;
  height: auto;
  font-family: var(--font-family-sans);
}

.kt-smine__part,
.kt-smine__reach {
  opacity: 0;
  transition: opacity 0.4s, transform 0.4s ease-out;
}

.kt-smine__part.is-on,
.kt-smine__reach.is-on { opacity: 1; }
.kt-smine__reach.is-back { opacity: 0.25; transform: translateX(30px); }

.kt-smine__pop > * {
  transform: scale(0);
  transform-box: fill-box;
  transform-origin: center;
  transition: transform 0.35s cubic-bezier(0.3, 1.6, 0.5, 1);
}

.kt-smine__pop.is-on > * { transform: scale(1); }

/* the articles fly into the AI */
.kt-smine__fly {
  transform-box: fill-box;
  transform-origin: center;
  transition: transform 0.5s cubic-bezier(0.5, 0, 0.8, 0.6), opacity 0.5s 0.15s;
}

.kt-smine__fly.is-gone { opacity: 0; }

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

.kt-smine__title {
  font: 700 16px var(--font-family-mono);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  fill: var(--kt-fg);
}

.kt-smine__title.is-hot { fill: var(--kt-hot); }
.kt-smine__what { font-size: 16px; fill: var(--kt-subtle); }
.kt-smine__small { font: 13px var(--font-family-mono); fill: var(--kt-subtle); }

.kt-smine__doc { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 1.5; }
.kt-smine__lines { stroke: var(--kt-subtle); stroke-width: 2.5; stroke-linecap: round; }
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
.kt-smine__shine { fill: var(--kt-warn); }

.kt-smine__ring { fill: none; stroke: var(--kt-line-strong); stroke-width: 2; }
.kt-smine__me { filter: grayscale(1); opacity: 0.7; }
.kt-smine__idle { font: 13px var(--font-family-mono); fill: var(--kt-bad); }

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

.kt-smine__chip { stroke-width: 2; }
.kt-smine__chip.is-bold { fill: color-mix(in srgb, var(--kt-info) 18%, transparent); stroke: var(--kt-info); }
.kt-smine__chip.is-hl { fill: color-mix(in srgb, var(--kt-warn) 18%, transparent); stroke: var(--kt-warn); }
.kt-smine__chip.is-sum { fill: color-mix(in srgb, var(--kt-good) 18%, transparent); stroke: var(--kt-good); }
.kt-smine__chiptext { font-size: 17px; font-weight: 700; fill: var(--kt-fg); }

.kt-smine__idea { fill: var(--kt-card); stroke: var(--kt-c-primary); stroke-width: 2; }
.kt-smine__src { font: 13px var(--font-family-mono); fill: var(--kt-fg); }

.kt-smine__link {
  fill: none;
  stroke: var(--kt-c-primary-soft);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  transition: stroke-dashoffset 0.5s ease-out;
}

.kt-smine__link.is-on { stroke-dashoffset: 0; }

.kt-smine__dframe { fill: var(--kt-code-bg); stroke: var(--kt-warn); stroke-width: 3; }
.kt-smine__dcore { fill: var(--kt-info); }
.kt-smine__name { font-size: 18px; font-weight: 700; fill: var(--kt-fg); }

.kt-smine__lock { fill: var(--kt-hot); }
.kt-smine__shackle { fill: none; stroke: var(--kt-bg); stroke-width: 2.5; }
.kt-smine__body { fill: var(--kt-bg); }
.kt-smine__locktext { font-size: 16px; font-weight: 800; fill: var(--kt-bg); }

.kt-smine__wire { fill: none; stroke: var(--kt-line-strong); stroke-width: 2; stroke-dasharray: 4 5; }
.kt-smine__head { fill: var(--kt-line-strong); }
.kt-smine__ask { font-size: 15px; font-weight: 600; fill: var(--kt-subtle); }

.kt-smine__x { fill: var(--kt-bg); stroke: var(--kt-bad); stroke-width: 2.5; }
.kt-smine__xmark { stroke: var(--kt-bad); stroke-width: 3; stroke-linecap: round; }

.kt-smine__q { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); stroke-width: 2.5; }
.kt-smine__qtext { font-size: 22px; font-weight: 800; fill: var(--kt-hot); }
.kt-smine__may { font-size: 15px; font-weight: 700; fill: var(--kt-cool); }
</style>
