<script setup lang="ts">
import { computed, useId } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * How you get from fluency to mastery, per Make It Stick, then the payoff of JuliaStory; plays once:
 * 1. I stand on a low ledge: FLUENCY (where FluencyIllusion left me)
 * 2. four steps rise out of the ground, each taller than the last (harder, stronger): Generate,
 *    Retrieve, Elaborate, Space; I hop onto each
 * 3. MASTERY, "you can draw it"; then one step higher: TEACH, explain it to others (the Protégé
 *    Effect; Feynman's way); I land on top: a flag, confetti
 * 4. the next group meeting: the stairs shrink into the corner, I glide to the whiteboard and draw
 *    the architecture with confidence, layer by layer, the marker riding each stroke; the team,
 *    in color now, is impressed and asks for guidelines, one at a time; Julia, the creator, last
 * No props.
 */
const { t, at } = useTimeline(21)
const uid = useId()
const face = `kt-mstairs-face-${uid}`
const feyn = `kt-mstairs-feyn-${uid}`

// --- the climb ---
const GROUND = 360
const STEP_W = 116
const COL = 124
const steps = [
  { name: 'Generate', lines: ['try before', 'you look'] },
  { name: 'Retrieve', lines: ['recall it,', 'no notes'] },
  { name: 'Elaborate', lines: ['in your', 'own words'] },
  { name: 'Space', lines: ['return after', 'a gap'] },
].map((s, i) => ({ ...s, x: 128 + i * COL, top: 296 - i * 44 }))
const MASTERY = { x: 128 + 4 * COL, top: 120 }
const SUMMIT = { x: 128 + 5 * COL, top: 76 }
const LEDGE = { x: 20, w: 100, top: 330 }
// block k rises at RISE(k), I hop onto it HOP_FOR later
const RISE = (k: number) => 0.9 + k * 1.45
const HOP = (k: number) => RISE(k) + 0.55
const HOP_FOR = 0.55
const stops = [
  { x: LEDGE.x + LEDGE.w / 2, y: LEDGE.top - 24 },
  ...steps.map(s => ({ x: s.x + STEP_W / 2, y: s.top - 24 })),
  { x: MASTERY.x + STEP_W / 2, y: MASTERY.top - 24 },
  { x: SUMMIT.x + STEP_W / 2 - 14, y: SUMMIT.top - 24 },
]
const TOP = stops.length - 1
const confetti = Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2
  return { dx: Math.cos(a) * (50 + (i % 3) * 18), dy: Math.sin(a) * (40 + (i % 4) * 12) - 30, r: (i * 47) % 360, hot: i % 3 === 0 }
})

// --- the next group meeting ---
const MEET_AT = HOP(5) + HOP_FOR + 0.9
const GLIDE_FOR = 0.9
const ME_AT_BOARD = { x: 290, y: 136, r: 36 }
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const me = computed(() => {
  let pos = { ...stops[0], r: 22 }
  let landed = 0
  for (let k = 0; k < stops.length - 1; k++) {
    const p = clamp01((t.value - HOP(k)) / HOP_FOR)
    if (p <= 0) break
    const a = stops[k]
    const b = stops[k + 1]
    pos = { x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p - 44 * Math.sin(Math.PI * p), r: 22 }
    if (p === 1) landed = k + 1
  }
  const g = clamp01((t.value - MEET_AT) / GLIDE_FOR)
  if (g > 0) {
    const e = g < 0.5 ? 2 * g * g : 1 - (-2 * g + 2) ** 2 / 2
    pos = {
      x: pos.x + (ME_AT_BOARD.x - pos.x) * e,
      y: pos.y + (ME_AT_BOARD.y - pos.y) * e - 60 * Math.sin(Math.PI * e),
      r: pos.r + (ME_AT_BOARD.r - pos.r) * e,
    }
  }
  return { ...pos, landed }
})
const landedOn = (k: number) => me.value.landed >= k + 1

// my drawing, stroke by stroke, the marker's tip riding along
type Pt = [number, number]
const BOARD_AT = MEET_AT + 0.5
const DRAW_AT = MEET_AT + 1.4
const layer = (y: number): Pt[] => [[400, y], [640, y], [640, y + 30], [400, y + 30], [400, y]]
const strokes: { pts: Pt[]; at: number; for: number; label?: string; good?: boolean }[] = [
  { pts: layer(194), at: 0, for: 0.5, label: 'tokens' },
  { pts: layer(154), at: 0.6, for: 0.5, label: 'primitives' },
  { pts: layer(114), at: 1.2, for: 0.5, label: 'components' },
  { pts: layer(74), at: 1.8, for: 0.5, label: 'patterns' },
  { pts: [[664, 214], [664, 84], [657, 94], [664, 84], [671, 94]], at: 2.5, for: 0.5 },
  { pts: [[690, 150], [702, 164], [730, 128]], at: 3.1, for: 0.35, good: true },
]
const len = (pts: Pt[]) => pts.slice(1).reduce((sum, p, i) => sum + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0)
function pointAt(pts: Pt[], p: number): Pt {
  let left = len(pts) * p
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1]
    const [bx, by] = pts[i]
    const seg = Math.hypot(bx - ax, by - ay)
    if (left <= seg) return [ax + ((bx - ax) * left) / seg, ay + ((by - ay) * left) / seg]
    left -= seg
  }
  return pts[pts.length - 1]
}
const progress = (k: { at: number; for: number }) => clamp01((t.value - DRAW_AT - k.at) / k.for)
const ink = computed(() => strokes.map(k => ({
  d: `M${k.pts.map(p => p.join(' ')).join(' L')}`,
  off: 1 - progress(k),
  good: k.good,
  label: k.label,
  y: k.pts[0][1] + 20,
  done: progress(k) === 1,
})))
// the pen: rides the stroke being drawn, then rests on the tray
const DONE = DRAW_AT + 3.6
const TRAY: Pt = [596, 240]
const HELD = -40
const pen = computed(() => {
  let tip = strokes[0].pts[0]
  for (const k of strokes) {
    if (t.value < DRAW_AT + k.at) break
    tip = pointAt(k.pts, progress(k))
  }
  const drop = clamp01((t.value - DONE) / 0.4)
  tip = [tip[0] + (TRAY[0] - tip[0]) * drop, tip[1] + (TRAY[1] - tip[1]) * drop]
  return { x: tip[0], y: tip[1], angle: HELD * (1 - drop) }
})

// the team, impressed: one at a time, the one talking lights up; Julia, the creator, last
const team = [
  { name: 'Julia', src: '/images/people/julia-rapczynska.webp' },
  { name: 'Kirill', src: '/images/people/kirill.webp' },
  { name: 'Szymon', src: '/images/people/szymon.webp' },
  { name: 'Hanna', src: '/images/people/hanna-skryl.jpg' },
]
const HEAD = (i: number) => 430 + i * 72
const TEAM_AT = MEET_AT + 0.7
const ASK_AT = DRAW_AT + 2.4
const questions = [
  { who: 1, w: 262, at: 0, until: 1.5, text: 'Wow, so that\'s how it works!' },
  { who: 2, w: 210, at: 1.6, until: 3.1, text: 'Can you teach us this?' },
  { who: 3, w: 226, at: 3.2, until: 4.7, text: 'Can you share guidelines?' },
  { who: 0, w: 262, at: 4.8, until: Infinity, text: 'Will you write our guidelines?' },
].map((q) => {
  const head = HEAD(q.who)
  const x = Math.min(872 - q.w, Math.max(372, head - q.w / 2))
  return { ...q, head, x }
})
const talking = (who: number) => questions.some(q => q.who === who && at(ASK_AT + q.at) && !at(ASK_AT + q.until))
const CLAP_AT = ASK_AT + 5.6
</script>

<template>
  <svg class="kt-mstairs" viewBox="0 0 880 380" role="img"
    aria-label="From fluency to mastery, per Make It Stick: generate (try before you look), retrieve (recall it, no notes), elaborate (in your own words), space (return after a gap), up to mastery, and one step higher: teach it to others, the Protégé Effect, Richard Feynman's way. Then the next group meeting: I draw the design system architecture layer by layer, and the team, Julia the creator included, asks me for guidelines.">
    <defs>
      <clipPath :id="face" clipPathUnits="objectBoundingBox"><circle cx="0.5" cy="0.5" r="0.5" /></clipPath>
      <!-- Feynman's face, cropped out of the blackboard photo -->
      <clipPath :id="feyn"><circle :cx="SUMMIT.x + STEP_W / 2" :cy="SUMMIT.top + 154" r="36" /></clipPath>
    </defs>

    <!-- the climb; at the meeting it shrinks into the corner -->
    <g class="kt-mstairs__climb" :class="{ 'is-small': at(MEET_AT) }">
      <path :d="`M10 ${GROUND} H 872`" class="kt-mstairs__ground" />
      <g class="kt-mstairs__rise" :class="{ 'is-on': at(0.1) }">
        <rect :x="LEDGE.x" :y="LEDGE.top" :width="LEDGE.w" :height="GROUND - LEDGE.top" rx="8" class="kt-mstairs__ledge" />
        <text :x="LEDGE.x + LEDGE.w / 2" :y="LEDGE.top + 20" text-anchor="middle" class="kt-mstairs__ledgename">FLUENCY</text>
      </g>
      <g v-for="(s, k) in steps" :key="s.name" class="kt-mstairs__rise" :class="{ 'is-on': at(RISE(k)) }">
        <rect :x="s.x" :y="s.top" :width="STEP_W" :height="GROUND - s.top" rx="10" class="kt-mstairs__step"
          :class="{ 'is-landed': landedOn(k) }" />
        <text :x="s.x + 11" :y="s.top + 23" class="kt-mstairs__name">{{ s.name }}</text>
        <text v-for="(l, j) in s.lines" :key="j" :x="s.x + 11" :y="s.top + 40 + j * 14" class="kt-mstairs__line">{{ l }}</text>
        <circle :cx="s.x + STEP_W / 2" :cy="s.top" r="12" class="kt-mstairs__thud" :class="{ 'is-on': landedOn(k) }" />
      </g>
      <g class="kt-mstairs__rise" :class="{ 'is-on': at(RISE(4)) }">
        <rect :x="MASTERY.x" :y="MASTERY.top" :width="STEP_W" :height="GROUND - MASTERY.top" rx="10" class="kt-mstairs__mastery"
          :class="{ 'is-landed': landedOn(4) }" />
        <text :x="MASTERY.x + 11" :y="MASTERY.top + 25" class="kt-mstairs__top">MASTERY</text>
        <text :x="MASTERY.x + 11" :y="MASTERY.top + 42" class="kt-mstairs__line">you can</text>
        <text :x="MASTERY.x + 11" :y="MASTERY.top + 56" class="kt-mstairs__line">draw it</text>
        <circle :cx="MASTERY.x + STEP_W / 2" :cy="MASTERY.top" r="12" class="kt-mstairs__thud is-good" :class="{ 'is-on': landedOn(4) }" />
      </g>
      <!-- one step higher: teach it -->
      <g class="kt-mstairs__rise" :class="{ 'is-on': at(RISE(5)) }">
        <rect :x="SUMMIT.x" :y="SUMMIT.top" :width="STEP_W" :height="GROUND - SUMMIT.top" rx="10" class="kt-mstairs__summit"
          :class="{ 'is-landed': landedOn(5) }" />
        <text :x="SUMMIT.x + 11" :y="SUMMIT.top + 25" class="kt-mstairs__top is-teach">TEACH</text>
        <text :x="SUMMIT.x + 11" :y="SUMMIT.top + 42" class="kt-mstairs__line">explain it</text>
        <text :x="SUMMIT.x + 11" :y="SUMMIT.top + 56" class="kt-mstairs__line">to others</text>
        <text :x="SUMMIT.x + 11" :y="SUMMIT.top + 80" class="kt-mstairs__effect">Protégé</text>
        <text :x="SUMMIT.x + 11" :y="SUMMIT.top + 93" class="kt-mstairs__effect">Effect</text>
        <!-- Feynman, the face of teaching to learn -->
        <image href="/images/people/richard-feynman.jpg" :x="SUMMIT.x + STEP_W / 2 - 72" :y="SUMMIT.top + 154 - 56" width="150" height="187"
          :clip-path="`url(#${feyn})`" class="kt-mstairs__feynman" />
        <circle :cx="SUMMIT.x + STEP_W / 2" :cy="SUMMIT.top + 154" r="36" class="kt-mstairs__feynring" />
        <text :x="SUMMIT.x + STEP_W / 2" :y="SUMMIT.top + 208" text-anchor="middle" class="kt-mstairs__effect">R. Feynman</text>
      </g>
      <g class="kt-mstairs__flag" :class="{ 'is-on': landedOn(5) }">
        <path :d="`M${SUMMIT.x + STEP_W - 18} ${SUMMIT.top} V ${SUMMIT.top - 52}`" class="kt-mstairs__pole" />
        <path :d="`M${SUMMIT.x + STEP_W - 18} ${SUMMIT.top - 52} l-30 10 l30 10z`" class="kt-mstairs__cloth" />
      </g>
      <rect v-for="(c, i) in confetti" :key="`c${i}`" :x="SUMMIT.x + STEP_W / 2 - 3" :y="SUMMIT.top - 30" width="6" height="10" rx="1.5"
        class="kt-mstairs__confetti" :class="{ 'is-on': landedOn(5), 'is-hot': c.hot }"
        :style="{ '--dx': `${c.dx}px`, '--dy': `${c.dy}px`, '--r': `${c.r}deg`, animationDelay: `${i * 0.015}s` }" />
    </g>

    <!-- the next group meeting -->
    <g class="kt-mstairs__caption" :class="{ 'is-on': at(MEET_AT + 0.3) }">
      <rect x="20" y="14" width="210" height="26" rx="4" />
      <text x="31" y="32">THE NEXT GROUP MEETING</text>
    </g>

    <g class="kt-mstairs__fade" :class="{ 'is-on': at(BOARD_AT) }">
      <rect x="380" y="40" width="380" height="200" rx="8" class="kt-mstairs__board" />
      <rect x="388" y="48" width="364" height="184" rx="4" class="kt-mstairs__surface" />
      <rect x="540" y="242" width="110" height="7" rx="2" class="kt-mstairs__tray" />
      <text x="400" y="66" class="kt-mstairs__boardq">how it works</text>
    </g>
    <path v-for="(k, i) in ink" :key="`k${i}`" :d="k.d" pathLength="1" :style="{ strokeDashoffset: k.off }"
      class="kt-mstairs__ink" :class="{ 'is-good': k.good }" />
    <template v-for="(k, i) in ink" :key="`l${i}`">
      <text v-if="k.label" x="520" :y="k.y" text-anchor="middle" class="kt-mstairs__layer" :class="{ 'is-on': k.done }">{{ k.label }}</text>
    </template>
    <text x="684" y="104" class="kt-mstairs__builds" :class="{ 'is-on': ink[4].done }">builds on</text>

    <!-- the pen -->
    <g class="kt-mstairs__fade" :class="{ 'is-on': at(DRAW_AT - 0.3) }">
      <g :transform="`translate(${pen.x} ${pen.y}) rotate(${pen.angle})`">
        <rect x="-30" y="-4.5" width="28" height="9" rx="2.5" class="kt-mstairs__marker" />
        <rect x="-30" y="-4.5" width="8" height="9" rx="2.5" class="kt-mstairs__cap" />
        <path d="M-2 -3 L 3 0 L -2 3z" class="kt-mstairs__nib" />
      </g>
    </g>

    <text x="290" y="196" text-anchor="middle" class="kt-mstairs__master" :class="{ 'is-on': at(DONE) }">you can draw it</text>

    <!-- the team, impressed -->
    <g v-for="(q, i) in questions" :key="`q${i}`" class="kt-mstairs__bubblewrap"
      :class="{ 'is-on': at(ASK_AT + q.at), 'is-gone': at(ASK_AT + q.until) }">
      <path :d="`M${q.head - 7} 280 L${q.head} 296 L${q.head + 7} 280z`" class="kt-mstairs__bubble" />
      <rect :x="q.x" y="254" :width="q.w" height="28" rx="14" class="kt-mstairs__bubble" />
      <path :d="`M${q.head - 6} 281 h12`" class="kt-mstairs__seam" />
      <text :x="q.x + q.w / 2" y="273" text-anchor="middle" class="kt-mstairs__ask">{{ q.text }}</text>
    </g>
    <g v-for="(p, i) in team" :key="p.name" class="kt-mstairs__pop" :class="{ 'is-on': at(TEAM_AT + i * 0.12) }">
      <g class="kt-mstairs__member" :class="{ 'is-talking': talking(i) }">
        <image :href="p.src" :x="HEAD(i) - 26" y="298" width="52" height="52" :clip-path="`url(#${face})`" preserveAspectRatio="xMidYMid slice" />
        <circle :cx="HEAD(i)" cy="324" r="26" class="kt-mstairs__teamring" />
        <text :x="HEAD(i)" y="368" text-anchor="middle" class="kt-mstairs__teamname">{{ p.name }}</text>
      </g>
    </g>
    <g class="kt-mstairs__creator" :class="{ 'is-on': at(ASK_AT + 4.8) }">
      <rect :x="HEAD(0) - 92" y="316" width="58" height="16" rx="8" />
      <text :x="HEAD(0) - 63" y="328" text-anchor="middle">creator</text>
    </g>
    <text x="790" y="336" text-anchor="middle" class="kt-mstairs__clap" :class="{ 'is-on': at(CLAP_AT) }">CLAP CLAP!</text>

    <!-- me: climbing, then at the board -->
    <g class="kt-mstairs__me" :class="{ 'is-on': at(0.3) }">
      <circle :cx="me.x" :cy="me.y" :r="me.r + 5" class="kt-mstairs__glow" :class="{ 'is-top': me.landed === TOP }" />
      <image href="/images/speaker.webp" :x="me.x - me.r" :y="me.y - me.r" :width="me.r * 2" :height="me.r * 2" :clip-path="`url(#${face})`"
        preserveAspectRatio="xMidYMid slice" />
      <circle :cx="me.x" :cy="me.y" :r="me.r" class="kt-mstairs__ring"
        :class="me.landed === TOP ? 'is-top' : me.landed > 0 ? 'is-climbing' : 'is-fluent'" />
    </g>
  </svg>
</template>

<style>
.kt-mstairs {
  width: 880px;
  height: auto;
  overflow: visible;
  font-family: var(--font-family-sans);
}

/* the climb, and how it shrinks into the corner at the meeting */
.kt-mstairs__climb { transition: transform 0.9s cubic-bezier(0.6, 0, 0.3, 1), opacity 0.9s; }
.kt-mstairs__climb.is-small { transform: translate(14px, 252px) scale(0.34); opacity: 0.55; }
.kt-mstairs__ground { stroke: var(--kt-line-strong); stroke-width: 2; }

/* blocks rise out of the ground; their text waits until they have */
.kt-mstairs__rise {
  opacity: 0;
  transform-box: fill-box;
  transform-origin: 50% 100%;
  transform: scaleY(0.05);
  transition: opacity 0.2s, transform 0.55s cubic-bezier(0.3, 1.4, 0.5, 1);
}
.kt-mstairs__rise.is-on { opacity: 1; transform: none; }
.kt-mstairs__rise text { opacity: 0; transition: opacity 0.3s; }
.kt-mstairs__rise.is-on text { opacity: 1; transition: opacity 0.3s 0.4s; }
/* shrunk into the corner, the climb is a thumbnail: blocks only, no unreadable text */
.kt-mstairs__climb.is-small .kt-mstairs__rise text { opacity: 0; transition: opacity 0.3s; }

.kt-mstairs__ledge { fill: color-mix(in srgb, var(--kt-warn) 16%, var(--kt-bg)); stroke: var(--kt-warn); stroke-width: 2; }
.kt-mstairs__ledgename { font: 800 12px var(--font-family-mono); letter-spacing: 0.08em; fill: var(--kt-warn); }

.kt-mstairs__step {
  fill: var(--kt-tint-primary);
  stroke: var(--kt-c-primary-soft);
  stroke-width: 2;
  transition: fill 0.35s, stroke 0.35s;
}
.kt-mstairs__step.is-landed { fill: color-mix(in srgb, var(--kt-c-primary) 32%, var(--kt-bg)); stroke: var(--kt-c-primary); }
.kt-mstairs__name { font-size: 16px; font-weight: 800; fill: var(--kt-heading); }
.kt-mstairs__line { font-size: 12px; fill: var(--kt-fg); }

/* landing: a ring bursts from the step's edge */
.kt-mstairs__thud { fill: none; stroke: var(--kt-c-primary-soft); stroke-width: 3; opacity: 0; transform-box: fill-box; transform-origin: center; }
.kt-mstairs__thud.is-on { animation: kt-mstairs-thud 0.6s ease-out forwards; }
@keyframes kt-mstairs-thud {
  0% { opacity: 1; transform: scale(0.4); }
  100% { opacity: 0; transform: scale(3.4); stroke-width: 0.5; }
}

.kt-mstairs__mastery {
  fill: color-mix(in srgb, var(--kt-good) 14%, var(--kt-bg));
  stroke: var(--kt-good);
  stroke-width: 2.5;
  transition: fill 0.4s;
}
.kt-mstairs__mastery.is-landed { fill: color-mix(in srgb, var(--kt-good) 28%, var(--kt-bg)); }
.kt-mstairs__summit {
  fill: color-mix(in srgb, var(--kt-warn) 14%, var(--kt-bg));
  stroke: var(--kt-warn);
  stroke-width: 2.5;
  transition: fill 0.4s;
}
.kt-mstairs__summit.is-landed { fill: color-mix(in srgb, var(--kt-warn) 28%, var(--kt-bg)); }
.kt-mstairs__top { font: 900 16px var(--font-family-mono); letter-spacing: 0.04em; fill: var(--kt-good); }
.kt-mstairs__top.is-teach { fill: var(--kt-warn); }
.kt-mstairs__effect { font: 700 11px var(--font-family-mono); fill: var(--kt-warn); }
.kt-mstairs__feynring { fill: none; stroke: var(--kt-warn); stroke-width: 2.5; }
/* like the text, his photo waits until the block has risen, and goes when the climb shrinks */
.kt-mstairs__feynman, .kt-mstairs__feynring { opacity: 0; transition: opacity 0.3s; }
.kt-mstairs__rise.is-on .kt-mstairs__feynman, .kt-mstairs__rise.is-on .kt-mstairs__feynring { opacity: 1; transition: opacity 0.4s 0.5s; }
.kt-mstairs__climb.is-small .kt-mstairs__feynman, .kt-mstairs__climb.is-small .kt-mstairs__feynring { opacity: 0; }
.kt-mstairs__thud.is-good { stroke: var(--kt-good); }

.kt-mstairs__flag { opacity: 0; transform-box: fill-box; transform-origin: 100% 100%; transform: scaleY(0); transition: opacity 0.15s, transform 0.45s cubic-bezier(0.3, 1.8, 0.5, 1); }
.kt-mstairs__flag.is-on { opacity: 1; transform: none; }
.kt-mstairs__pole { stroke: var(--kt-heading); stroke-width: 3; stroke-linecap: round; }
.kt-mstairs__cloth { fill: var(--kt-warn); }

.kt-mstairs__confetti { fill: var(--kt-warn); opacity: 0; transform-box: fill-box; transform-origin: center; }
.kt-mstairs__confetti.is-hot { fill: var(--kt-good); }
.kt-mstairs__confetti.is-on { animation: kt-mstairs-confetti 1.4s cubic-bezier(0.2, 0.7, 0.4, 1) forwards; }
@keyframes kt-mstairs-confetti {
  0% { opacity: 1; transform: translate(0, 0) rotate(0deg); }
  70% { opacity: 1; }
  100% { opacity: 0; transform: translate(var(--dx), calc(var(--dy) + 60px)) rotate(var(--r)); }
}

/* me */
.kt-mstairs__me { opacity: 0; transition: opacity 0.3s; }
.kt-mstairs__me.is-on { opacity: 1; }
.kt-mstairs__glow { fill: color-mix(in srgb, var(--kt-c-primary) 25%, transparent); transition: fill 0.4s; }
.kt-mstairs__glow.is-top { fill: color-mix(in srgb, var(--kt-good) 35%, transparent); animation: kt-mstairs-pulse 1.6s ease-in-out infinite; }
@keyframes kt-mstairs-pulse { 50% { opacity: 0.4; } }
.kt-mstairs__ring { fill: none; stroke-width: 3.5; transition: stroke 0.3s; }
.kt-mstairs__ring.is-fluent { stroke: var(--kt-warn); }
.kt-mstairs__ring.is-climbing { stroke: var(--kt-c-primary-soft); }
.kt-mstairs__ring.is-top { stroke: var(--kt-good); }

/* the meeting */
.kt-mstairs__caption { opacity: 0; transform: translateY(-6px); transition: opacity 0.3s, transform 0.3s; }
.kt-mstairs__caption.is-on { opacity: 1; transform: none; }
.kt-mstairs__caption rect { fill: color-mix(in srgb, var(--kt-warn) 16%, var(--kt-bg)); stroke: var(--kt-warn); stroke-width: 1.5; }
.kt-mstairs__caption text { font: 800 12px var(--font-family-mono); letter-spacing: 0.06em; fill: var(--kt-warn); }

.kt-mstairs__fade { opacity: 0; transition: opacity 0.4s; }
.kt-mstairs__fade.is-on { opacity: 1; }
.kt-mstairs__pop {
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
  transform: scale(0.6);
  transition: opacity 0.2s, transform 0.45s cubic-bezier(0.3, 1.7, 0.5, 1);
}
.kt-mstairs__pop.is-on { opacity: 1; transform: none; }

.kt-mstairs__board { fill: var(--kt-tint-neutral); stroke: var(--kt-line-strong); stroke-width: 2; }
.kt-mstairs__surface { fill: color-mix(in srgb, var(--kt-fg) 10%, var(--kt-bg)); stroke: var(--kt-line); stroke-width: 1; }
.kt-mstairs__tray { fill: var(--kt-line-strong); }
.kt-mstairs__boardq { font: 700 13px var(--font-family-mono); fill: var(--kt-muted); }
.kt-mstairs__ink {
  fill: none;
  stroke: var(--kt-c-primary-soft);
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 1;
}
.kt-mstairs__ink.is-good { stroke: var(--kt-good); stroke-width: 4; }
.kt-mstairs__layer { font: 700 13px var(--font-family-mono); fill: var(--kt-c-primary-soft); opacity: 0; transition: opacity 0.3s; }
.kt-mstairs__layer.is-on { opacity: 1; }
.kt-mstairs__builds { font: 600 11px var(--font-family-mono); fill: var(--kt-muted); opacity: 0; transition: opacity 0.3s; }
.kt-mstairs__builds.is-on { opacity: 1; }
.kt-mstairs__marker { fill: var(--kt-c-primary); }
.kt-mstairs__cap { fill: var(--kt-c-primary-soft); }
.kt-mstairs__nib { fill: var(--kt-c-primary-soft); }
.kt-mstairs__master { font: 800 14px var(--font-family-mono); fill: var(--kt-good); opacity: 0; transition: opacity 0.4s; }
.kt-mstairs__master.is-on { opacity: 1; }

/* the team: in color this time; the one talking lights up */
.kt-mstairs__member { transform-box: fill-box; transform-origin: 50% 40%; transition: transform 0.3s cubic-bezier(0.3, 1.6, 0.5, 1); }
.kt-mstairs__member.is-talking { transform: scale(1.12); }
.kt-mstairs__teamring { fill: none; stroke: var(--kt-line-strong); stroke-width: 2; transition: stroke 0.3s, stroke-width 0.3s; }
.kt-mstairs__member.is-talking .kt-mstairs__teamring { stroke: var(--kt-warn); stroke-width: 3; }
.kt-mstairs__teamname { font: 600 12px var(--font-family-mono); fill: var(--kt-muted); transition: fill 0.3s; }
.kt-mstairs__member.is-talking .kt-mstairs__teamname { fill: var(--kt-warn); }

.kt-mstairs__bubblewrap { opacity: 0; transform-box: fill-box; transform-origin: center; transform: scale(0.6); transition: opacity 0.2s, transform 0.45s cubic-bezier(0.3, 1.7, 0.5, 1); }
.kt-mstairs__bubblewrap.is-on { opacity: 1; transform: none; }
.kt-mstairs__bubblewrap.is-on.is-gone { opacity: 0; transform: translateY(-6px); transition: opacity 0.35s, transform 0.35s; }
.kt-mstairs__bubble { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 2; stroke-linejoin: round; }
.kt-mstairs__seam { stroke: var(--kt-card); stroke-width: 3; }
.kt-mstairs__ask { font: 700 13px var(--font-family-mono); fill: var(--kt-heading); }

.kt-mstairs__creator { opacity: 0; transform-box: fill-box; transform-origin: center; transform: scale(0.4); transition: opacity 0.2s, transform 0.4s cubic-bezier(0.3, 1.9, 0.5, 1); }
.kt-mstairs__creator.is-on { opacity: 1; transform: none; }
.kt-mstairs__creator rect { fill: var(--kt-warn); }
.kt-mstairs__creator text { font: 800 10px var(--font-family-mono); fill: var(--kt-bg); }

.kt-mstairs__clap { font: 900 18px var(--font-family-mono); fill: var(--kt-warn); opacity: 0; transform-box: fill-box; transform-origin: center; }
.kt-mstairs__clap.is-on { animation: kt-mstairs-clap 0.9s cubic-bezier(0.3, 1.9, 0.5, 1) forwards, kt-mstairs-shake 0.25s linear 0.5s 4; }
@keyframes kt-mstairs-clap {
  0% { opacity: 0; transform: scale(0.3) rotate(-8deg); }
  100% { opacity: 1; transform: rotate(-6deg); }
}
@keyframes kt-mstairs-shake {
  25% { translate: -2px 0; }
  75% { translate: 2px 0; }
}

@media (prefers-reduced-motion: reduce) {
  .kt-mstairs__thud.is-on,
  .kt-mstairs__confetti.is-on,
  .kt-mstairs__clap.is-on,
  .kt-mstairs__glow.is-top { animation: none !important; }
}
</style>
