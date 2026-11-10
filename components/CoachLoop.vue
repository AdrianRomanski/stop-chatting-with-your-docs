<script setup lang="ts">
import { useId } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * The ai-coach loop (README "How it works") with the climb's seven steps placed on it
 * (docs/guide/the-climb.md), each with its step number. Engine boxes as in TwoTiers.
 * Top left, "knowledge base · second brain" with Obsidian and kb-template: read (1) → distill →
 * synthesize (the bridge, in hot as on ClimbCheckpoint), each with a green ✓ (seen in phases 2 and 3).
 * The rest is "ai-coach", an L-shaped zone: before the loop, on a book's concepts, group (2) and
 * generate (3); then the ring spar → judge → study → review → spar, a dot running it. Spar, judge
 * and study are step 4, Retrieve (the label in the ring's middle); review is step 6, Space.
 * Off the ring, to the left: elaborate (5), after a round, and teach (7), after a spaced pass.
 * Under them, the review ladder (domain review-ladder.ts, DEFAULT_LADDER):
 * fail → tomorrow · first pass → tomorrow · tier 1 pass → 3 days · tier 2 pass → 7, 14, 30 … 365 days.
 * No props.
 */
const { at } = useTimeline(5.4)
const uid = useId()
const id = (name: string) => `kt-coachloop-${name}-${uid}`

const W = 112
const H = 56
const CY = 36 // the top row
type AI = 'none' | 'gemma' | 'argon'
type Box = { name: string; does: string; x: number; cy: number; step?: number; on: number; tone?: string; logo?: string; ai: AI; style?: boolean }

const lead: (Box & { bridge?: boolean; done: number })[] = [
  { name: 'read', does: 'a chapter', x: 8, cy: CY, step: 1, on: 0.1, done: 0.9, ai: 'none' },
  { name: 'distill', does: 'bold, highlight', x: 144, cy: CY, on: 0.35, done: 1.05, ai: 'none' },
  { name: 'synthesize', does: 'concept notes', x: 280, cy: CY, on: 0.6, done: 1.2, bridge: true, ai: 'gemma' },
]
const before: Box[] = [
  { name: 'group', does: 'layers I name', x: 432, cy: CY, step: 2, on: 1.35, tone: 'plain', ai: 'gemma' },
  { name: 'generate', does: 'guess first', x: 590, cy: CY, step: 3, on: 1.6, tone: 'plain', ai: 'gemma' },
]

// the ring: an ellipse through the centres of spar (top), judge, study and review, clockwise
const C = { x: 646, y: 262, rx: 156, ry: 88 }
const ring = [
  { deg: 270, name: 'spar', does: 'offline', tone: 'local', step: 4, ai: 'gemma' as AI, style: true },
  { deg: 360, name: 'judge', does: 'online', tone: 'cloud', step: 4, ai: 'argon' as AI, style: true },
  { deg: 450, name: 'study', does: 'what you missed', tone: 'plain', step: 4, ai: 'gemma' as AI, style: true },
  { deg: 540, name: 'review', does: 'Space · when due', tone: 'plain', step: 6, ai: 'none' as AI, style: false },
].map((n, i) => {
  const r = (n.deg * Math.PI) / 180
  const cx = C.x + C.rx * Math.cos(r)
  return { ...n, cx, x: cx - W / 2, cy: C.y + C.ry * Math.sin(r), on: 1.9 + i * 0.3 }
})
const pt = (deg: number) => {
  const r = (deg * Math.PI) / 180
  return `${(C.x + C.rx * Math.cos(r)).toFixed(1)} ${(C.y + C.ry * Math.sin(r)).toFixed(1)}`
}
// one arc from each ring node to the next, clockwise, clear of the boxes
const arcs = ring.map((n, i) => ({
  d: `M${pt(n.deg + 30)} A ${C.rx} ${C.ry} 0 0 1 ${pt(n.deg + 90 - 32)}`,
  on: n.on + 0.25,
  back: i === ring.length - 1,
}))
const orbit = `M${C.x - C.rx} ${C.y} A ${C.rx} ${C.ry} 0 1 1 ${C.x + C.rx} ${C.y} A ${C.rx} ${C.ry} 0 1 1 ${C.x - C.rx} ${C.y}`

// off the ring, to the left
const SX = 186
const off: (Box & { from: (typeof ring)[number]; when: string })[] = [
  { name: 'elaborate', does: 'why · link · use', x: SX, cy: ring[0].cy, step: 5, on: 3.3, tone: 'plain', from: ring[0], when: 'after a round', ai: 'gemma', style: true },
  { name: 'teach', does: 'a student', x: SX, cy: ring[3].cy, step: 7, on: 3.6, tone: 'teach', from: ring[3], when: 'spaced pass', ai: 'gemma' },
]

const ladder = [
  { when: 'fail', next: 'tomorrow', tone: 'bad' },
  { when: 'first pass', next: 'tomorrow', tone: 'cool' },
  { when: 'tier 1 pass', next: '3 days', tone: 'cool' },
  { when: 'tier 2 pass', next: '7, 14, 30 … 365 days', tone: 'good' },
].map((r, i) => ({ ...r, y: 324 + i * 18, on: 4.0 + i * 0.2 }))
const LX = 8

// the tags under each box: which model, and whether it questions in the note's coaching style
const tags = [...lead, ...before, ...ring, ...off].map(b => ({
  ...b,
  pw: b.ai === 'none' ? 50 : b.style ? 102 : 70,
}))
</script>

<template>
  <svg class="kt-coachloop" viewBox="-8 -34 892 428" role="img"
    aria-label="The loop inside the climb, with the seven climb steps on it. In the knowledge base, the second brain in Obsidian and kb-template: step 1 read, distill, and synthesize, the bridge that makes concept notes: done. In ai-coach, before the loop, on a book's concepts: step 2 group, into layers I name; step 3 generate, guess first. Then the loop: spar offline, judge online, study what you missed: together step 4, Retrieve; review when due is step 6, Space, and back to spar. Off the loop: step 5 elaborate, after a round; step 7 teach, after a spaced pass. The review ladder: fail, tomorrow; first pass, tomorrow; tier 1 pass, 3 days; tier 2 pass, 7, 14, 30 up to 365 days.">
    <defs>
      <marker :id="id('head')" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M1 1 L 9 5 L 1 9" class="kt-coachloop__head" />
      </marker>
      <marker :id="id('headhot')" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M1 1 L 9 5 L 1 9" class="kt-coachloop__head is-hot" />
      </marker>
    </defs>

    <!-- the two zones: the second brain, then the coach around it -->
    <g class="kt-coachloop__part" :class="{ 'is-on': at(0.05) }">
      <rect x="-4" y="-30" width="404" height="150" rx="18" class="kt-coachloop__zone is-kb" />
      <text x="12" y="-9" class="kt-coachloop__zname is-kb">knowledge base · second brain</text>
      <path d="M12 82 H 384" class="kt-coachloop__zrule" />
      <image href="/images/logos/obsidian.webp" x="48" y="89" width="20" height="20" />
      <text x="76" y="104" class="kt-coachloop__ztool">Obsidian</text>
      <image href="/images/logos/kb-template-mark.png" x="214" y="90" width="13" height="19" />
      <text x="234" y="104" class="kt-coachloop__ztool">kb-template</text>
    </g>
    <g class="kt-coachloop__part" :class="{ 'is-on': at(1.25) }">
      <path d="M430 -30 H 866 Q 884 -30 884 -12 V 376 Q 884 394 866 394 H 14 Q -4 394 -4 376 V 152 Q -4 134 14 134 H 394 Q 412 134 412 116 V -12 Q 412 -30 430 -30 Z"
        class="kt-coachloop__zone is-coach" />
      <text x="428" y="-9" class="kt-coachloop__zname is-coach">ai-coach</text>
    </g>

    <!-- the dot that runs the ring, under the boxes -->
    <g class="kt-coachloop__part" :class="{ 'is-on': at(3.0) }">
      <circle r="6" class="kt-coachloop__dot">
        <animateMotion dur="4.8s" repeatCount="indefinite" :path="orbit" />
      </circle>
    </g>

    <!-- wires: read → distill → synthesize → group → generate ↓ spar -->
    <path v-for="(n, i) in [...lead, ...before].slice(0, -1)" :key="`w${n.name}`"
      :d="`M${n.x + W + 2} ${CY} H ${[...lead, ...before][i + 1].x - 4}`" class="kt-coachloop__wire"
      :class="{ 'is-on': at([...lead, ...before][i + 1].on) }" :marker-end="`url(#${id('head')})`" />
    <path :d="`M${before[1].x + W / 2} ${CY + H / 2 + 2} V ${ring[0].cy - H / 2 - 4}`" class="kt-coachloop__wire"
      :class="{ 'is-on': at(ring[0].on) }" :marker-end="`url(#${id('head')})`" />

    <!-- the boxes before the ring -->
    <g v-for="n in [...lead, ...before]" :key="n.name" class="kt-coachloop__part" :class="{ 'is-on': at(n.on) }">
      <rect :x="n.x" :y="n.cy - H / 2" :width="W" :height="H" rx="14" class="kt-coachloop__box"
        :class="[n.tone ? `is-${n.tone}` : 'is-lead', { 'is-done': 'done' in n && at((n as any).done), 'is-bridge': (n as any).bridge }]" />
      <text :x="n.x + W / 2" :y="n.cy - 7" text-anchor="middle" class="kt-coachloop__name">{{ n.name }}</text>
      <text :x="n.x + W / 2" :y="n.cy + 11" text-anchor="middle" class="kt-coachloop__does">{{ n.does }}</text>
      <text v-if="(n as any).bridge" :x="n.x + W / 2" :y="n.cy - H / 2 - 7" text-anchor="middle" class="kt-coachloop__bridge">bridge</text>
    </g>
    <g v-for="n in lead" :key="`t${n.name}`" :transform="`translate(${n.x + W - 6} ${CY - H / 2 + 2})`">
      <g class="kt-coachloop__tick" :class="{ 'is-on': at(n.done) }">
        <circle r="11" />
        <path d="M-5 0 l3.5 3.5 6.5 -7" />
      </g>
    </g>

    <!-- the ring: spar → judge → study → review → spar -->
    <path v-for="(a, i) in arcs" :key="`arc${i}`" :d="a.d" class="kt-coachloop__wire" :class="{ 'is-on': at(a.on), 'is-back': a.back }"
      :marker-end="`url(#${id(a.back ? 'headhot' : 'head')})`" />
    <g v-for="n in ring" :key="n.name" class="kt-coachloop__part" :class="{ 'is-on': at(n.on) }">
      <rect :x="n.x" :y="n.cy - H / 2" :width="W" :height="H" rx="14" class="kt-coachloop__box" :class="`is-${n.tone}`" />
      <text :x="n.cx" :y="n.cy - 7" text-anchor="middle" class="kt-coachloop__name">{{ n.name }}</text>
      <text :x="n.cx" :y="n.cy + 11" text-anchor="middle" class="kt-coachloop__does" :class="`is-${n.tone}`">{{ n.does }}</text>
    </g>
    <g class="kt-coachloop__part" :class="{ 'is-on': at(3.0) }">
      <text :x="C.x" :y="C.y - 4" text-anchor="middle" class="kt-coachloop__step">Retrieve</text>
      <text :x="C.x" :y="C.y + 14" text-anchor="middle" class="kt-coachloop__stepsub">spar · judge · study</text>
    </g>

    <!-- off the ring: elaborate after a round, teach after a spaced pass -->
    <g v-for="n in off" :key="n.name" class="kt-coachloop__part" :class="{ 'is-on': at(n.on) }">
      <path :d="`M${n.from.x - 2} ${n.cy} H ${n.x + W + 4}`" class="kt-coachloop__wire is-on" :marker-end="`url(#${id('head')})`" />
      <text :x="(n.from.x + n.x + W) / 2" :y="n.cy - 8" text-anchor="middle" class="kt-coachloop__when2">{{ n.when }}</text>
      <rect :x="n.x" :y="n.cy - H / 2" :width="W" :height="H" rx="14" class="kt-coachloop__box" :class="`is-${n.tone}`" />
      <text :x="n.x + W / 2" :y="n.cy - 7" text-anchor="middle" class="kt-coachloop__name">{{ n.name }}</text>
      <text :x="n.x + W / 2" :y="n.cy + 11" text-anchor="middle" class="kt-coachloop__does">{{ n.does }}</text>
    </g>

    <!-- which model each step uses, and whether it speaks in the note's style -->
    <g v-for="n in tags" :key="`ai${n.name}`" class="kt-coachloop__part" :class="{ 'is-on': at(n.on + 0.2) }">
      <rect :x="n.x + W / 2 - n.pw / 2" :y="n.cy + H / 2 - 9" :width="n.pw" height="18" rx="9" class="kt-coachloop__ai" :class="`is-${n.ai}`" />
      <image v-if="n.ai !== 'none'" :href="n.ai === 'argon' ? '/images/logos/gemini-mark.png' : '/images/logos/gemma-mark.png'"
        :x="n.x + W / 2 - n.pw / 2 + 6" :y="n.cy + H / 2 - 6" width="12" height="12" />
      <text :x="n.x + W / 2 - n.pw / 2 + (n.ai === 'none' ? n.pw / 2 : 22)" :y="n.cy + H / 2 + 4" :text-anchor="n.ai === 'none' ? 'middle' : 'start'"
        class="kt-coachloop__aitext" :class="`is-${n.ai}`">{{ n.ai === 'none' ? 'no AI' : n.ai === 'argon' ? 'Argon' : 'Gemma' }}<tspan v-if="n.style" class="kt-coachloop__style"> · style</tspan></text>
    </g>
    <g class="kt-coachloop__part" :class="{ 'is-on': at(4.6) }">
      <text x="10" y="166" class="kt-coachloop__legendhead">on each step</text>
      <image href="/images/logos/gemma-mark.png" x="10" y="178" width="13" height="13" />
      <text x="30" y="189" class="kt-coachloop__legend">Gemma · offline</text>
      <image href="/images/logos/gemini-mark.png" x="10" y="200" width="13" height="13" />
      <text x="30" y="211" class="kt-coachloop__legend">Argon · online</text>
      <text x="10" y="236" class="kt-coachloop__legend"><tspan class="kt-coachloop__style">· style</tspan>: feynman,</text>
      <text x="10" y="252" class="kt-coachloop__legend">socratic, cornell, devil</text>
      <text x="10" y="276" class="kt-coachloop__legend is-muted">no AI: code only</text>
    </g>

    <!-- the step numbers -->
    <g v-for="n in [...lead, ...before, ...ring, ...off].filter(b => b.step)" :key="`s${n.name}`"
      class="kt-coachloop__part" :class="{ 'is-on': at(n.on + 0.15) }" :transform="`translate(${n.x + 4} ${n.cy - H / 2 + 2})`">
      <circle r="11" class="kt-coachloop__badge" :class="{ 'is-teach': n.step === 7 }" />
      <text y="4.5" text-anchor="middle" class="kt-coachloop__badgenum">{{ n.step }}</text>
    </g>

    <!-- under the side steps: the ladder, fed by review -->
    <path :d="`M${ring[3].cx} ${ring[3].cy + H / 2 + 2} V 344 H ${LX + 392}`" class="kt-coachloop__wire" :class="{ 'is-on': at(3.9) }" />
    <g class="kt-coachloop__part" :class="{ 'is-on': at(3.9) }">
      <rect :x="LX" y="304" width="390" height="80" rx="12" class="kt-coachloop__ladder" />
    </g>
    <g v-for="r in ladder" :key="r.when" class="kt-coachloop__row" :class="{ 'is-on': at(r.on) }">
      <circle :cx="LX + 18" :cy="r.y - 4" r="4.5" class="kt-coachloop__bullet" :class="`is-${r.tone}`" />
      <text :x="LX + 32" :y="r.y" class="kt-coachloop__when">{{ r.when }}</text>
      <text :x="LX + 134" :y="r.y" class="kt-coachloop__arrow">→</text>
      <text :x="LX + 158" :y="r.y" class="kt-coachloop__next" :class="`is-${r.tone}`">{{ r.next }}</text>
    </g>
  </svg>
</template>

<style>
.kt-coachloop {
  width: 770px;
  height: auto;
  overflow: visible;
  font-family: var(--font-family-sans);
}

.kt-coachloop__part,
.kt-coachloop__wire {
  opacity: 0;
  transition: opacity 0.45s;
}

.kt-coachloop__part.is-on,
.kt-coachloop__wire.is-on { opacity: 1; }

/* engine boxes, as in TwoTiers and PullPush */
.kt-coachloop__box { fill: var(--kt-code-bg); stroke: var(--kt-line-strong); stroke-width: 2.5; transition: stroke 0.4s; }
.kt-coachloop__box.is-lead.is-done { stroke: var(--kt-good); }
.kt-coachloop__box.is-lead.is-done.is-bridge { stroke: var(--kt-hot); }
.kt-coachloop__bridge { font: 800 11px var(--font-family-mono); letter-spacing: 0.06em; fill: var(--kt-hot); }
.kt-coachloop__step { font-size: 17px; font-weight: 800; fill: var(--kt-heading); }
.kt-coachloop__stepsub { font: 600 11px var(--font-family-mono); fill: var(--kt-muted); }
.kt-coachloop__box.is-local { stroke: var(--kt-c-primary); }
.kt-coachloop__box.is-cloud { stroke: var(--kt-c-secondary); }
.kt-coachloop__box.is-plain { stroke: var(--kt-c-primary-soft); }
.kt-coachloop__box.is-teach { stroke: var(--kt-warn); }
.kt-coachloop__ai { fill: var(--kt-bg); stroke-width: 1.5; }
.kt-coachloop__ai.is-none { stroke: var(--kt-line-strong); }
.kt-coachloop__ai.is-gemma { stroke: var(--kt-c-primary); }
.kt-coachloop__ai.is-argon { stroke: var(--kt-c-secondary); }
.kt-coachloop__aitext { font: 700 10px var(--font-family-mono); fill: var(--kt-fg); }
.kt-coachloop__aitext.is-none { fill: var(--kt-muted); }
.kt-coachloop__style { fill: var(--kt-warn); font-weight: 800; }
.kt-coachloop__legendhead { font: 700 10.5px var(--font-family-mono); fill: var(--kt-muted); text-transform: uppercase; letter-spacing: 0.08em; }
.kt-coachloop__legend { font: 600 11px var(--font-family-mono); fill: var(--kt-fg); }
.kt-coachloop__legend.is-muted { fill: var(--kt-muted); }
.kt-coachloop__badge { fill: var(--kt-c-primary); stroke: var(--kt-bg); stroke-width: 2; }
.kt-coachloop__badge.is-teach { fill: var(--kt-warn); }
.kt-coachloop__badgenum { font: 800 12px var(--font-family-mono); fill: var(--kt-bg); }
.kt-coachloop__when2 { font: 600 11px var(--font-family-mono); fill: var(--kt-muted); }
.kt-coachloop__name { font-size: 17px; font-weight: 800; fill: var(--kt-heading); }
.kt-coachloop__does { font: 600 11px var(--font-family-mono); fill: var(--kt-muted); }
.kt-coachloop__does.is-local { fill: var(--kt-cool); font-weight: 800; }
.kt-coachloop__does.is-cloud { fill: var(--kt-hot); font-weight: 800; }

.kt-coachloop__tick {
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
  transition: opacity 0.25s;
}
.kt-coachloop__tick.is-on { opacity: 1; animation: kt-coachloop-pop 0.45s cubic-bezier(0.3, 1.8, 0.5, 1); }
.kt-coachloop__tick circle { fill: var(--kt-good); }
.kt-coachloop__tick path { fill: none; stroke: var(--kt-bg); stroke-width: 2.6; stroke-linecap: round; stroke-linejoin: round; }

@keyframes kt-coachloop-pop {
  from { transform: scale(0.4); }
}

.kt-coachloop__bracket { fill: none; stroke: var(--kt-good); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.kt-coachloop__saw { font: 800 13px var(--font-family-mono); fill: var(--kt-good); }

.kt-coachloop__wire {
  fill: none;
  stroke: var(--kt-line-strong);
  stroke-width: 2.5;
  stroke-dasharray: 6 5;
}
.kt-coachloop__wire.is-on { animation: kt-coachloop-flow 1.2s linear infinite; }
.kt-coachloop__wire.is-back { stroke: var(--kt-hot); }
.kt-coachloop__head { fill: none; stroke: var(--kt-line-strong); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.kt-coachloop__head.is-hot { stroke: var(--kt-hot); }

@keyframes kt-coachloop-flow {
  to { stroke-dashoffset: -22; }
}

.kt-coachloop__dot { fill: var(--kt-c-primary-soft); }

/* the zones */
.kt-coachloop__zone { stroke-width: 2; stroke-dasharray: 8 6; }
.kt-coachloop__zone.is-kb { fill: color-mix(in srgb, var(--kt-good) 12%, transparent); stroke: var(--kt-good); stroke-width: 2.5; }
.kt-coachloop__zone.is-coach { fill: color-mix(in srgb, var(--kt-warn) 5%, transparent); stroke: var(--kt-warn); stroke-width: 2.5; }
.kt-coachloop__zname { font: 700 13px var(--font-family-mono); text-transform: uppercase; letter-spacing: 0.08em; }
.kt-coachloop__zname.is-kb { fill: var(--kt-good); }
.kt-coachloop__zname.is-coach { fill: var(--kt-warn); }
.kt-coachloop__zrule { stroke: color-mix(in srgb, var(--kt-good) 30%, transparent); stroke-width: 1.5; }
.kt-coachloop__ztool { font-size: 15px; font-weight: 700; fill: var(--kt-fg); }

/* the ladder */
.kt-coachloop__ladder { fill: var(--kt-card); stroke: var(--kt-card-line); stroke-width: 1.5; }
.kt-coachloop__row {
  opacity: 0;
  transform: translateX(-12px);
  transition: opacity 0.35s, transform 0.45s ease-out;
}
.kt-coachloop__row.is-on { opacity: 1; transform: none; }
.kt-coachloop__bullet.is-bad { fill: var(--kt-bad); }
.kt-coachloop__bullet.is-cool { fill: var(--kt-cool); }
.kt-coachloop__bullet.is-good { fill: var(--kt-good); }
.kt-coachloop__when { font: 600 12px var(--font-family-mono); fill: var(--kt-muted); }
.kt-coachloop__arrow { font: 700 14px var(--font-family-mono); fill: var(--kt-subtle); }
.kt-coachloop__next { font-size: 14px; font-weight: 800; }
.kt-coachloop__next.is-bad { fill: var(--kt-bad); }
.kt-coachloop__next.is-cool { fill: var(--kt-cool); }
.kt-coachloop__next.is-good { fill: var(--kt-good); }

@media (prefers-reduced-motion: reduce) {
  .kt-coachloop__wire.is-on,
  .kt-coachloop__tick.is-on { animation: none !important; }
}
</style>
