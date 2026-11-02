<script setup lang="ts">
import { useId } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * The ai-coach loop from its README ("How it works"), in the engine boxes of TwoTiers, in two
 * zones. Left, "knowledge base · second brain", with Obsidian and kb-template at its foot: the lead-in read → distill →
 * synthesize (each gets a green ✓, "you just saw them"). Right, "ai-coach": a ring
 * spar (offline) → judge (online) → study → review, and review back to spar. A dot runs the ring
 * in a calm loop. Under review, the review ladder (ai-coach DEFAULT_LADDER):
 * fail → tomorrow · tier 1 pass → 3 days · tier 2 pass → 7, 14, 30 … 365 days.
 * No props.
 */
const { at } = useTimeline(4.6)
const uid = useId()
const id = (name: string) => `kt-coachloop-${name}-${uid}`

const W = 112
const H = 56
const CY = 150
const lead = [
  { x: 4, name: 'read', does: 'a chapter' },
  { x: 140, name: 'distill', does: 'bold, highlight' },
  { x: 276, name: 'synthesize', does: 'concept note' },
].map((n, i) => ({ ...n, on: 0.1 + i * 0.25, done: 0.9 + i * 0.15 }))

// the ring: an ellipse through the centres of spar, judge, study and review
const C = { x: 670, y: 150, rx: 140, ry: 104 }
const ring = [
  { deg: 180, name: 'spar', does: 'offline', tone: 'local', logo: '/images/logos/gemma-mark.png' },
  { deg: 270, name: 'judge', does: 'online', tone: 'cloud', logo: '/images/logos/gemini-mark.png' },
  { deg: 360, name: 'study', does: 'what you missed', tone: 'plain', logo: '' },
  { deg: 450, name: 'review', does: 'when due', tone: 'plain', logo: '' },
].map((n, i) => {
  const r = (n.deg * Math.PI) / 180
  return { ...n, cx: C.x + C.rx * Math.cos(r), cy: C.y + C.ry * Math.sin(r), on: 1.6 + i * 0.3 }
})

const pt = (deg: number) => {
  const r = (deg * Math.PI) / 180
  return `${(C.x + C.rx * Math.cos(r)).toFixed(1)} ${(C.y + C.ry * Math.sin(r)).toFixed(1)}`
}
// one arc from each ring node to the next, clockwise, clear of the boxes
const arcs = ring.map((n, i) => ({
  d: `M${pt(n.deg + 28)} A ${C.rx} ${C.ry} 0 0 1 ${pt(n.deg + 90 - 30)}`,
  on: n.on + 0.25,
  back: i === ring.length - 1,
}))
const orbit = `M${C.x - C.rx} ${C.y} A ${C.rx} ${C.ry} 0 1 1 ${C.x + C.rx} ${C.y} A ${C.rx} ${C.ry} 0 1 1 ${C.x - C.rx} ${C.y}`

const ladder = [
  { when: 'fail', next: 'tomorrow', tone: 'bad' },
  { when: 'tier 1 pass', next: '3 days', tone: 'cool' },
  { when: 'tier 2 pass', next: '7, 14, 30 … 365 days', tone: 'good' },
].map((r, i) => ({ ...r, y: 326 + i * 23, on: 3.3 + i * 0.25 }))
</script>

<template>
  <svg class="kt-coachloop" viewBox="-8 -34 892 428" role="img"
    aria-label="One loop, seven steps. In the knowledge base, the second brain in Obsidian and kb-template: read, distill, synthesize: done. In ai-coach: Then spar offline, judge online, study what you missed, review when due, and back to spar. The review ladder: fail, tomorrow; tier 1 pass, 3 days; tier 2 pass, 7, 14, 30 up to 365 days.">
    <defs>
      <marker :id="id('head')" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M1 1 L 9 5 L 1 9" class="kt-coachloop__head" />
      </marker>
      <marker :id="id('headhot')" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M1 1 L 9 5 L 1 9" class="kt-coachloop__head is-hot" />
      </marker>
    </defs>

    <!-- the two zones: the second brain, then the coach -->
    <g class="kt-coachloop__part" :class="{ 'is-on': at(0.05) }">
      <rect x="-4" y="66" width="400" height="220" rx="18" class="kt-coachloop__zone is-kb" />
      <text x="12" y="88" class="kt-coachloop__zname is-kb">knowledge base · second brain</text>
    </g>
    <g class="kt-coachloop__part" :class="{ 'is-on': at(1.1) }">
      <path d="M12 244 H 380" class="kt-coachloop__zrule" />
      <image href="/images/logos/obsidian.webp" x="48" y="252" width="22" height="22" />
      <text x="78" y="268" class="kt-coachloop__ztool">Obsidian</text>
      <image href="/images/logos/kb-template-mark.png" x="214" y="253" width="14" height="20" />
      <text x="236" y="268" class="kt-coachloop__ztool">kb-template</text>
    </g>
    <g class="kt-coachloop__part" :class="{ 'is-on': at(1.5) }">
      <rect x="460" y="-30" width="420" height="422" rx="18" class="kt-coachloop__zone is-coach" />
      <text x="476" y="-8" class="kt-coachloop__zname is-coach">ai-coach</text>
    </g>

    <!-- the dot that runs the ring, under the boxes -->
    <g class="kt-coachloop__part" :class="{ 'is-on': at(3.0) }">
      <circle r="6" class="kt-coachloop__dot">
        <animateMotion dur="4.8s" repeatCount="indefinite" :path="orbit" />
      </circle>
    </g>

    <!-- the lead-in: read → distill → synthesize -->
    <template v-for="(n, i) in lead" :key="n.name">
      <path v-if="i < lead.length - 1" :d="`M${n.x + W + 2} ${CY} H ${lead[i + 1].x - 4}`" class="kt-coachloop__wire"
        :marker-end="`url(#${id('head')})`" :class="{ 'is-on': at(lead[i + 1].on) }" />
      <g class="kt-coachloop__part" :class="{ 'is-on': at(n.on) }">
        <rect :x="n.x" :y="CY - H / 2" :width="W" :height="H" rx="14" class="kt-coachloop__box is-lead" :class="{ 'is-done': at(n.done) }" />
        <text :x="n.x + W / 2" :y="CY - 3" text-anchor="middle" class="kt-coachloop__name">{{ n.name }}</text>
        <text :x="n.x + W / 2" :y="CY + 16" text-anchor="middle" class="kt-coachloop__does">{{ n.does }}</text>
      </g>
      <g :transform="`translate(${n.x + W - 6} ${CY - H / 2 + 2})`">
        <g class="kt-coachloop__tick" :class="{ 'is-on': at(n.done) }">
          <circle r="11" />
          <path d="M-5 0 l3.5 3.5 6.5 -7" />
        </g>
      </g>
    </template>
    <path :d="`M${lead[2].x + W + 2} ${CY} H ${ring[0].cx - W / 2 - 4}`" class="kt-coachloop__wire"
      :marker-end="`url(#${id('head')})`" :class="{ 'is-on': at(ring[0].on) }" />
    <g class="kt-coachloop__part" :class="{ 'is-on': at(1.3) }">
      <path :d="`M${lead[0].x + 4} ${CY + H / 2 + 14} v 8 H ${lead[2].x + W - 4} v -8`" class="kt-coachloop__bracket" />
      <text :x="(lead[0].x + lead[2].x + W) / 2" :y="CY + H / 2 + 44" text-anchor="middle" class="kt-coachloop__saw">✓ you just saw them</text>
    </g>

    <!-- the ring: spar → judge → study → review → spar -->
    <path v-for="(a, i) in arcs" :key="`arc${i}`" :d="a.d" class="kt-coachloop__wire" :class="{ 'is-on': at(a.on), 'is-back': a.back }"
      :marker-end="`url(#${id(a.back ? 'headhot' : 'head')})`" />
    <g v-for="n in ring" :key="n.name" class="kt-coachloop__part" :class="{ 'is-on': at(n.on) }">
      <rect :x="n.cx - W / 2" :y="n.cy - H / 2" :width="W" :height="H" rx="14" class="kt-coachloop__box" :class="`is-${n.tone}`" />
      <image v-if="n.logo" :href="n.logo" :x="n.cx - W / 2 + 9" :y="n.cy - 9" width="18" height="18" />
      <text :x="n.cx + (n.logo ? 8 : 0)" :y="n.cy - 3" text-anchor="middle" class="kt-coachloop__name">{{ n.name }}</text>
      <text :x="n.cx + (n.logo ? 8 : 0)" :y="n.cy + 16" text-anchor="middle" class="kt-coachloop__does" :class="`is-${n.tone}`">{{ n.does }}</text>
    </g>

    <!-- under review: the ladder -->
    <path :d="`M${ring[3].cx} ${ring[3].cy + H / 2 + 2} V 300`" class="kt-coachloop__wire" :class="{ 'is-on': at(3.2) }" />
    <g class="kt-coachloop__part" :class="{ 'is-on': at(3.2) }">
      <rect x="474" y="302" width="392" height="84" rx="12" class="kt-coachloop__ladder" />
    </g>
    <g v-for="r in ladder" :key="r.when" class="kt-coachloop__row" :class="{ 'is-on': at(r.on) }">
      <circle cx="494" :cy="r.y - 4" r="5" class="kt-coachloop__bullet" :class="`is-${r.tone}`" />
      <text x="508" :y="r.y" class="kt-coachloop__when">{{ r.when }}</text>
      <text x="612" :y="r.y" class="kt-coachloop__arrow">→</text>
      <text x="638" :y="r.y" class="kt-coachloop__next" :class="`is-${r.tone}`">{{ r.next }}</text>
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
.kt-coachloop__box.is-local { stroke: var(--kt-c-primary); }
.kt-coachloop__box.is-cloud { stroke: var(--kt-c-secondary); }
.kt-coachloop__box.is-plain { stroke: var(--kt-c-primary-soft); }
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
.kt-coachloop__when { font: 600 13px var(--font-family-mono); fill: var(--kt-muted); }
.kt-coachloop__arrow { font: 700 14px var(--font-family-mono); fill: var(--kt-subtle); }
.kt-coachloop__next { font-size: 15px; font-weight: 800; }
.kt-coachloop__next.is-bad { fill: var(--kt-bad); }
.kt-coachloop__next.is-cool { fill: var(--kt-cool); }
.kt-coachloop__next.is-good { fill: var(--kt-good); }

@media (prefers-reduced-motion: reduce) {
  .kt-coachloop__wire.is-on,
  .kt-coachloop__tick.is-on { animation: none !important; }
}
</style>
