<script setup lang="ts">
import { computed, useId } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * My first fluency trap, as a three-panel comic strip. The empty panels are there from the
 * start; each scene waits for its part of the narration (SCENE_2, SCENE_3, NOT_ENOUGH_AT):
 * 1. "A while ago…": Julia Rapczynska's design system architecture, its docs pile up to ~200
 *    pages, THUD: a HARDCORE stamp; short on time; I read all of it (pages fly into me, the
 *    counter runs to 200) and I'm lost: "?"
 * 2. "One prompt later…": "I don't get it. Summarize this" types itself and flies into the LLM; my
 *    photo and an "AI agent" card slide in and meet; at the touch a shockwave and a glow, a
 *    summary.md comes down; the thought "Damn. FINALLY I understand!"
 * 3. "The group meeting": me at the whiteboard, the whole team watching (Julia, Kirill, Szymon,
 *    Hanna); I draw one serious box, "tokens", then random stuff with very confident layer names:
 *    a house (components), a sun (patterns), a stick man (primitives), while they ask "why this
 *    way?", "do you really understand it?", "why is there a sun?"; then a scribble and a "?". GULP, feeling
 *    totally stupid. The strip dims, a NOT ENOUGH stamp slams onto the summary (it wasn't wrong, it
 *    just wasn't enough), panel 2 drains to grey.
 * Sets up FluencyIllusion (it has a name, from Make It Stick). No props.
 */
const SCENE_2 = 5.5
const SCENE_3 = 11
const NOT_ENOUGH_AT = SCENE_3 + 11.5
const { t, at } = useTimeline(NOT_ENOUGH_AT + 1.5)
const uid = useId()
const id = (name: string) => `kt-jstory-${name}-${uid}`

// scene 1: the pile
const PAGES = 200
const SHEETS = 14
const PILE_AT = 0.6
const PILE_FOR = 1
const STAMP_AT = PILE_AT + PILE_FOR + 0.15
const pages = computed(() => {
  const p = Math.min(1, Math.max(0, (t.value - PILE_AT) / PILE_FOR))
  return Math.round(PAGES * (1 - (1 - p) ** 3))
})
const sheets = computed(() => Math.ceil((pages.value / PAGES) * SHEETS))
// a little jitter, so the pile looks stacked by hand
const offsets = [0, 5, -3, 3, -6, 4, -2, 6, -4, 2, -5, 3, -1, 4]
// then I read all of it: pages fly from the pile into me, the counter runs to 200; and I'm lost
const READ_AT = 2.6
const READ_FOR = 1.7
const READ_DONE = READ_AT + READ_FOR
const LOST_AT = READ_DONE + 0.3
const read = computed(() => Math.round(PAGES * Math.min(1, Math.max(0, (t.value - READ_AT) / READ_FOR))))
const reading = computed(() => at(READ_AT) && !at(READ_DONE))

// scene 2: the prompt types itself, flies into the LLM, the LLM and I touch
const PROMPT = "I don't get it. Summarize this"
const TYPE_AT = SCENE_2 + 0.4
const TYPE_STEP = 0.05
const typed = computed(() => PROMPT.slice(0, Math.max(0, Math.floor((t.value - TYPE_AT) / TYPE_STEP))))
const SEND_AT = TYPE_AT + PROMPT.length * TYPE_STEP + 0.4
const REACH_AT = SEND_AT + 0.5
const TOUCH_AT = REACH_AT + 0.8
const rays = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4)
const sparkles = [[386, 92, 0], [478, 78, 0.6], [470, 150, 1.1], [392, 146, 1.6]]

// scene 3: the whiteboard, the team watching
const team = [
  { name: 'Julia', src: '/images/people/julia-rapczynska.webp' },
  { name: 'Kirill', src: '/images/people/kirill.webp' },
  { name: 'Szymon', src: '/images/people/szymon.webp' },
  { name: 'Hanna', src: '/images/people/hanna-skryl.jpg' },
]
const BOARD_AT = SCENE_3 + 0.4
const ME_AT = SCENE_3 + 1.6
// my attempt, stroke by stroke, until it falls apart: each stroke is a polyline, drawn over `for`
// seconds from `at`; the marker's tip rides along the stroke being drawn
type Pt = [number, number]
// the ring of points around a centre: a head (r, r) or a sun's spikes (alternating radii)
const ring = (cx: number, cy: number, radii: number[], n: number): Pt[] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2
    const r = radii[i % radii.length]
    return [Math.round(cx + Math.cos(a) * r), Math.round(cy + Math.sin(a) * r)]
  })
// the scribble: everything crossed out, in one angry zigzag
const scribble: Pt[] = [[730, 140], [744, 108], [756, 142], [770, 106], [784, 142], [798, 108], [812, 142], [826, 106],
  [840, 140], [852, 112]]
const SCRIBBLE = 9.9
// the architecture, as I "remember" it: one serious box, then random stuff, each with a very
// confident layer name: a house (components), a sun (patterns), a stick man (primitives)
const strokes: { pts: Pt[]; at: number; for: number; hot?: boolean; label?: string; lx?: number; ly?: number }[] = [
  { pts: [[728, 150], [784, 150], [784, 166], [728, 166], [728, 150]], at: 2.4, for: 0.9, label: 'tokens', lx: 756, ly: 162 },
  { pts: [[798, 166], [798, 146], [834, 146], [834, 166]], at: 3.6, for: 0.6 },
  { pts: [[794, 148], [816, 130], [838, 148]], at: 4.2, for: 0.4, label: 'components', lx: 816, ly: 126 },
  { pts: ring(842, 92, [7, 13], 16), at: 5.0, for: 0.9, label: 'patterns', lx: 800, ly: 96 },
  { pts: ring(748, 98, [6], 10), at: 6.3, for: 0.4 },
  { pts: [[748, 104], [748, 121]], at: 6.8, for: 0.2 },
  { pts: [[739, 111], [757, 111]], at: 7.05, for: 0.2 },
  { pts: [[741, 132], [748, 121], [755, 132]], at: 7.3, for: 0.3, label: 'primitives', lx: 759, ly: 144 },
  { pts: scribble, at: SCRIBBLE, for: 0.8, hot: true },
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
const progress = (k: { at: number; for: number }) => Math.min(1, Math.max(0, (t.value - SCENE_3 - k.at) / k.for))
const ink = computed(() => strokes.map(k => ({
  d: `M${k.pts.map(p => p.join(' ')).join(' L')}`,
  hot: k.hot,
  off: 1 - progress(k),
  label: k.label,
  x: k.lx,
  y: k.ly,
  done: progress(k) === 1,
})))
// the pen: on the stroke being drawn, resting where the last one ended, held at a writing angle;
// after the scribble it drops onto the tray: I give up
const GIVE_UP: Pt = [806, 181]
const HELD = -40
const pen = computed(() => {
  let tip = strokes[0].pts[0]
  for (const k of strokes) {
    if (t.value < SCENE_3 + k.at) break
    tip = pointAt(k.pts, progress(k))
  }
  const drop = Math.min(1, Math.max(0, (t.value - SCENE_3 - SCRIBBLE - 1.1) / 0.4))
  tip = [tip[0] + (GIVE_UP[0] - tip[0]) * drop, tip[1] + (GIVE_UP[1] - tip[1]) * drop]
  return { x: tip[0], y: tip[1], angle: HELD * (1 - drop) }
})
// while I draw, the team asks, one at a time: the one talking lights up, the bubble points at them,
// then fades; the last question stays
const questions = [
  { who: 1, w: 176, at: 2.4, until: 4.4, before: 'Wait, why this way?', hot: '', after: '' },
  { who: 2, w: 244, at: 4.6, until: 6.6, before: 'Do you ', hot: 'really', after: ' understand it?' },
  { who: 3, w: 222, at: 6.8, until: 8.6, before: 'Why is there a sun?', hot: '', after: '' },
  { who: 0, w: 222, at: 8.8, until: Infinity, before: 'Can you explain it again?', hot: '', after: '' },
].map((q) => {
  const head = 650 + q.who * 58
  const x = Math.min(866 - q.w, Math.max(612, head - q.w / 2))
  return { ...q, head, x }
})
const talking = (who: number) => questions.some(q => q.who === who && at(SCENE_3 + q.at) && !at(SCENE_3 + q.until))
const SCRIBBLE_AT = SCENE_3 + SCRIBBLE
const STUPID_AT = SCENE_3 + 10.6
</script>

<template>
  <svg class="kt-jstory" viewBox="0 0 880 396" role="img"
    aria-label="A three-panel comic. A while ago: Julia Rapczynska's design system architecture, about 200 pages of hardcore docs, and I'm short on time. I read all of it and still don't get it. One prompt later: I ask AI to summarize it, the AI agent and I meet, and I think: finally I understand. The group meeting: at the whiteboard, the whole team watching, I try to draw the architecture and draw random stuff instead: a box called tokens, a house called components, a sun called patterns, a stick man called primitives; the team asks why this way, and why there is a sun; I feel totally stupid. The summary was not wrong; it just was not enough for me to understand it.">
    <defs>
      <clipPath :id="id('julia')"><circle cx="60" cy="86" r="32" /></clipPath>
      <clipPath :id="id('reader')"><circle cx="212" cy="194" r="28" /></clipPath>
      <clipPath :id="id('me')"><circle cx="668" cy="118" r="34" /></clipPath>
      <clipPath :id="id('face')" clipPathUnits="objectBoundingBox"><circle cx="0.5" cy="0.5" r="0.5" /></clipPath>
      <clipPath :id="id('me2')"><circle cx="357" cy="207" r="34" /></clipPath>
      <clipPath :id="id('panel2')"><rect x="274" y="-22" width="318" height="382" rx="14" /></clipPath>
      <radialGradient :id="id('halo')">
        <stop offset="0" class="kt-jstory__light-in" />
        <stop offset="1" class="kt-jstory__light-out" />
      </radialGradient>
      <radialGradient :id="id('spot')">
        <stop offset="0" class="kt-jstory__spot-in" />
        <stop offset="1" class="kt-jstory__spot-out" />
      </radialGradient>
    </defs>

    <!-- the strip: three empty panels from the start -->
    <rect x="4" y="8" width="258" height="382" rx="14" class="kt-jstory__panel" />
    <rect x="274" y="8" width="318" height="382" rx="14" class="kt-jstory__panel" />
    <rect x="604" y="8" width="272" height="382" rx="14" class="kt-jstory__panel" />

    <!-- panel 1: a while ago… -->
    <g class="kt-jstory__scene" :class="{ 'is-dim': at(SCENE_3 + 0.8) }">
      <g class="kt-jstory__caption" :class="{ 'is-on': at(0.1) }">
        <rect x="14" y="18" width="116" height="24" rx="4" />
        <text x="24" y="35">A WHILE AGO…</text>
      </g>
      <g transform="translate(0 16)">
      <g class="kt-jstory__pop" :class="{ 'is-on': at(0.4) }">
        <image href="/images/people/julia-rapczynska.webp" x="28" y="54" width="64" height="64" :clip-path="`url(#${id('julia')})`"
          preserveAspectRatio="xMidYMid slice" />
        <circle cx="60" cy="86" r="32" class="kt-jstory__ring" />
      </g>
      <g class="kt-jstory__fade" :class="{ 'is-on': at(0.6) }">
        <text x="102" y="84" class="kt-jstory__name">Julia Rapczynska</text>
        <text x="102" y="104" class="kt-jstory__sub">DS &amp; AI Team Leader</text>
        <text x="18" y="146" class="kt-jstory__dsa">Design System Architecture</text>
      </g>
      <rect v-for="i in sheets" :key="i" :x="22 + offsets[i - 1]" :y="286 - i * 9" width="96" height="7" rx="2"
        class="kt-jstory__sheet" />
      <g class="kt-jstory__fade" :class="{ 'is-on': at(PILE_AT) }">
        <text x="150" y="250" class="kt-jstory__count">~{{ pages }}</text>
        <text x="150" y="272" class="kt-jstory__sub">pages</text>
      </g>
      <g class="kt-jstory__stamp is-hardcore" :class="{ 'is-on': at(STAMP_AT) }">
        <rect x="-60" y="-16" width="120" height="32" rx="5" />
        <text y="6" text-anchor="middle">HARDCORE</text>
      </g>
      <text x="160" y="214" text-anchor="middle" class="kt-jstory__sfx is-thud" :class="{ 'is-on': at(STAMP_AT + 0.1) }">THUD!</text>
      <g class="kt-jstory__fade" :class="{ 'is-on': at(STAMP_AT + 0.6) }">
        <rect x="18" y="318" width="178" height="30" rx="15" class="kt-jstory__pill" />
        <circle cx="36" cy="333" r="8" class="kt-jstory__watch" />
        <path d="M36 333 V 327" class="kt-jstory__watchhand" />
        <text x="52" y="338" class="kt-jstory__pilltext">short on time</text>
      </g>

      <!-- I read all of it -->
      <rect v-for="d in 3" :key="`f${d}`" x="58" y="166" width="24" height="8" rx="2" class="kt-jstory__flying"
        :class="{ 'is-on': reading }" :style="{ animationDelay: `${d * 0.18}s` }" />
      <g class="kt-jstory__pop" :class="{ 'is-on': at(READ_AT - 0.2) }">
        <image href="/images/speaker.webp" x="184" y="166" width="56" height="56" :clip-path="`url(#${id('reader')})`"
          preserveAspectRatio="xMidYMid slice" />
        <circle cx="212" cy="194" r="28" class="kt-jstory__ring is-me" :class="{ 'is-hot': at(LOST_AT) }" />
      </g>
      <text x="150" y="296" class="kt-jstory__read" :class="{ 'is-on': at(READ_AT), 'is-done': at(READ_DONE) }">{{ at(READ_DONE) ? '✓ all 200 read' : `reading ${read}…` }}</text>
      <text x="244" y="174" class="kt-jstory__huh" :class="{ 'is-on': at(LOST_AT) }">?</text>
      <text x="248" y="220" class="kt-jstory__huh is-small" :class="{ 'is-on': at(LOST_AT + 0.2) }">?</text>
      <text x="170" y="176" class="kt-jstory__huh is-small" :class="{ 'is-on': at(LOST_AT + 0.35) }">?</text>
      </g>
    </g>

    <!-- panel 2: one prompt later… -->
    <g class="kt-jstory__scene" :class="{ 'is-dim': at(SCENE_3 + 0.8) && !at(NOT_ENOUGH_AT), 'is-short': at(NOT_ENOUGH_AT) }">
      <g class="kt-jstory__caption" :class="{ 'is-on': at(SCENE_2) }">
        <rect x="284" y="18" width="156" height="24" rx="4" />
        <text x="294" y="35">ONE PROMPT LATER…</text>
      </g>
      <g transform="translate(0 30)">
      <g :clip-path="`url(#${id('panel2')})`">
        <circle cx="433" cy="108" r="74" :fill="`url(#${id('halo')})`" class="kt-jstory__beam" :class="{ 'is-on': at(TOUCH_AT + 0.3) }" />
        <circle cx="433" cy="207" r="70" :fill="`url(#${id('halo')})`" class="kt-jstory__beam" :class="{ 'is-on': at(TOUCH_AT) }" />

        <!-- me, from the left -->
        <g class="kt-jstory__reach is-mine" :class="{ 'is-on': at(REACH_AT), 'is-touch': at(TOUCH_AT) }">
          <image href="/images/speaker.webp" x="323" y="173" width="68" height="68" :clip-path="`url(#${id('me2')})`"
            preserveAspectRatio="xMidYMid slice" />
          <circle cx="357" cy="207" r="34" class="kt-jstory__ring is-me" />
        </g>
        <!-- the LLM, from the right -->
        <g class="kt-jstory__reach is-ai" :class="{ 'is-on': at(SCENE_2 + 0.2), 'is-touch': at(TOUCH_AT) }">
          <rect x="468" y="171" width="122" height="72" rx="10" class="kt-jstory__llm" />
          <path d="M468 191 h122" class="kt-jstory__llmbar" />
          <circle v-for="d in 3" :key="d" :cx="472 + d * 9" cy="181" r="2.5" class="kt-jstory__llmdot" />
          <path d="M492 206 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" class="kt-jstory__spark" />
          <text x="508" y="221" class="kt-jstory__llmname">AI agent</text>
          <circle v-for="d in 3" :key="`t${d}`" :cx="513 + d * 9" cy="232" r="2.2" class="kt-jstory__thinking"
            :style="{ animationDelay: `${d * 0.15}s` }" />
        </g>
      </g>

      <!-- the prompt types itself, then flies into the LLM -->
      <g class="kt-jstory__prompt" :class="{ 'is-on': at(TYPE_AT - 0.3), 'is-sent': at(SEND_AT) }">
        <rect x="286" y="52" width="268" height="30" rx="15" class="kt-jstory__chip" />
        <path d="M304 59 l2.5 5.5 5.5 2.5 -5.5 2.5 -2.5 5.5 -2.5 -5.5 -5.5 -2.5 5.5 -2.5z" class="kt-jstory__spark" />
        <text x="318" y="72" class="kt-jstory__prompttext">{{ typed }}<tspan class="kt-jstory__caret">▍</tspan></text>
      </g>

      <!-- the touch -->
      <circle cx="433" cy="207" r="16" class="kt-jstory__shock" :class="{ 'is-on': at(TOUCH_AT) }" />
      <g class="kt-jstory__flash" :class="{ 'is-on': at(TOUCH_AT), 'is-gone': at(NOT_ENOUGH_AT) }">
        <circle cx="433" cy="207" r="12" class="kt-jstory__burst" />
        <path v-for="(a, i) in rays" :key="i"
          :d="`M${433 + Math.cos(a) * 17} ${207 + Math.sin(a) * 17} L${433 + Math.cos(a) * 28} ${207 + Math.sin(a) * 28}`"
          class="kt-jstory__ray" />
      </g>

      <!-- the summary comes down in the light -->
      <g class="kt-jstory__summary" :class="{ 'is-on': at(TOUCH_AT + 0.4) }">
        <text x="433" y="64" text-anchor="middle" class="kt-jstory__file">summary.md</text>
        <rect x="401" y="72" width="64" height="76" rx="6" class="kt-jstory__doc" />
        <path d="M412 90 h5 M423 90 h32 M412 106 h5 M423 106 h26 M412 122 h5 M423 122 h30 M412 138 h5 M423 138 h20"
          class="kt-jstory__lines" />
      </g>
      <path v-for="([x, y, d], i) in sparkles" :key="`s${i}`"
        :d="`M${x} ${y - 7} l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z`"
        class="kt-jstory__twinkle" :class="{ 'is-on': at(TOUCH_AT + 0.6) && !at(NOT_ENOUGH_AT) }" :style="{ animationDelay: `${d}s` }" />
      </g>
    </g>

    <!-- the thought sits outside panel 2's grey-out: its strike stays hot -->
    <g class="kt-jstory__scene" :class="{ 'is-dim': at(SCENE_3 + 0.8) && !at(NOT_ENOUGH_AT) }">
      <g transform="translate(0 44)">
      <g class="kt-jstory__think" :class="{ 'is-on': at(TOUCH_AT + 1.2), 'is-short': at(NOT_ENOUGH_AT) }">
        <circle cx="306" cy="256" r="4" class="kt-jstory__thought" />
        <circle cx="318" cy="266" r="6" class="kt-jstory__thought" />
        <rect x="296" y="276" width="274" height="42" rx="21" class="kt-jstory__thought" />
        <text x="433" y="302" text-anchor="middle" class="kt-jstory__thinktext">Damn. <tspan class="kt-jstory__finally">FINALLY</tspan> I understand!</text>
        <path d="M312 297 H 554" pathLength="1" class="kt-jstory__strike" />
      </g>
      </g>
    </g>

    <!-- panel 3: the group meeting -->
    <g class="kt-jstory__scene">
      <g class="kt-jstory__caption" :class="{ 'is-on': at(SCENE_3) }">
        <rect x="614" y="18" width="160" height="24" rx="4" />
        <text x="624" y="35">THE GROUP MEETING</text>
      </g>

      <!-- the whiteboard: the question, then my attempt -->
      <g class="kt-jstory__fade" :class="{ 'is-on': at(BOARD_AT) }">
        <rect x="716" y="50" width="150" height="132" rx="6" class="kt-jstory__board" />
        <rect x="722" y="56" width="138" height="120" rx="3" class="kt-jstory__surface" />
        <rect x="756" y="184" width="70" height="6" rx="2" class="kt-jstory__tray" />
        <text x="728" y="74" class="kt-jstory__boardq">how does it work?</text>
      </g>
      <path v-for="(k, i) in ink" :key="`k${i}`" :d="k.d" pathLength="1" :style="{ strokeDashoffset: k.off }"
        class="kt-jstory__ink" :class="{ 'is-scribble': k.hot }" />
      <template v-for="(k, i) in ink" :key="`l${i}`">
        <text v-if="k.label" :x="k.x" :y="k.y" text-anchor="middle" class="kt-jstory__layer" :class="{ 'is-on': k.done }">{{ k.label }}</text>
      </template>
      <text x="792" y="138" text-anchor="middle" class="kt-jstory__lost" :class="{ 'is-on': at(SCRIBBLE_AT + 0.3) }">?</text>

      <!-- me, in the spotlight -->
      <circle cx="668" cy="118" r="64" :fill="`url(#${id('spot')})`" class="kt-jstory__spot" :class="{ 'is-on': at(STUPID_AT) }" />
      <g class="kt-jstory__pop" :class="{ 'is-on': at(ME_AT) }">
        <image href="/images/speaker.webp" x="634" y="84" width="68" height="68" :clip-path="`url(#${id('me')})`"
          preserveAspectRatio="xMidYMid slice" />
        <circle cx="668" cy="118" r="34" class="kt-jstory__ring is-me" :class="{ 'is-hot': at(STUPID_AT) }" />
      </g>

      <!-- the pen, on the board -->
      <g class="kt-jstory__fade" :class="{ 'is-on': at(ME_AT) }">
        <g :transform="`translate(${pen.x} ${pen.y}) rotate(${pen.angle})`">
          <rect x="-30" y="-4.5" width="28" height="9" rx="2.5" class="kt-jstory__marker" />
          <rect x="-30" y="-4.5" width="8" height="9" rx="2.5" class="kt-jstory__cap" />
          <path d="M-2 -3 L 3 0 L -2 3z" class="kt-jstory__nib" />
        </g>
      </g>
      <g class="kt-jstory__fade" :class="{ 'is-on': at(STUPID_AT) }">
        <path d="M706 94 q4 7 0 10 q-4 -3 0 -10z M712 112 q4 7 0 10 q-4 -3 0 -10z" class="kt-jstory__sweat" />
        <text x="740" y="214" text-anchor="middle" class="kt-jstory__stupid">feeling totally stupid</text>
      </g>
      <text x="632" y="68" text-anchor="middle" class="kt-jstory__sfx is-gulp" :class="{ 'is-on': at(STUPID_AT + 0.2) }">GULP</text>

      <!-- the team asks: do I really understand it? -->
      <g v-for="(q, i) in questions" :key="`q${i}`" class="kt-jstory__pop"
        :class="{ 'is-on': at(SCENE_3 + q.at), 'is-gone': at(SCENE_3 + q.until) }">
        <path :d="`M${q.head - 7} 284 L${q.head} 302 L${q.head + 7} 284z`" class="kt-jstory__bubble" />
        <rect :x="q.x" y="258" :width="q.w" height="28" rx="14" class="kt-jstory__bubble" />
        <path :d="`M${q.head - 6} 285 h12`" class="kt-jstory__seam" />
        <text :x="q.x + q.w / 2" y="277" text-anchor="middle" class="kt-jstory__ask">{{ q.before }}<tspan class="kt-jstory__really">{{ q.hot }}</tspan>{{ q.after }}</text>
      </g>

      <!-- the whole team, watching -->
      <g v-for="(p, i) in team" :key="p.name" class="kt-jstory__pop" :class="{ 'is-on': at(SCENE_3 + 0.5 + i * 0.15) }">
        <g class="kt-jstory__member" :class="{ 'is-talking': talking(i) }">
        <image :href="p.src" :x="626 + i * 58" y="314" width="48" height="48" :clip-path="`url(#${id('face')})`"
          preserveAspectRatio="xMidYMid slice" class="kt-jstory__face" />
        <circle :cx="650 + i * 58" cy="338" r="24" class="kt-jstory__ring is-team" />
        <text :x="650 + i * 58" y="381" text-anchor="middle" class="kt-jstory__teamname">{{ p.name }}</text>
        </g>
      </g>
    </g>

    <!-- the punchline -->
    <g class="kt-jstory__stamp is-short" :class="{ 'is-on': at(NOT_ENOUGH_AT) }">
      <rect x="-76" y="-18" width="152" height="36" rx="5" />
      <text y="7" text-anchor="middle">NOT ENOUGH</text>
    </g>
  </svg>
</template>

<style>
.kt-jstory {
  width: 880px;
  height: auto;
  overflow: visible;
  font-family: var(--font-family-sans);
}

/* the strip */
.kt-jstory__panel { fill: color-mix(in srgb, var(--kt-fg) 3%, transparent); stroke: var(--kt-line-strong); stroke-width: 2.5; }
.kt-jstory__scene { transition: opacity 0.6s, filter 0.6s; }
.kt-jstory__scene.is-dim { opacity: 0.4; }
.kt-jstory__scene.is-short { filter: grayscale(1) brightness(0.8); animation: kt-jstory-shake 0.32s linear; }
@keyframes kt-jstory-shake {
  20% { transform: translate(-4px, 2px); }
  40% { transform: translate(4px, -2px); }
  60% { transform: translate(-3px, -1px); }
  80% { transform: translate(2px, 1px); }
}

/* comic caption boxes */
.kt-jstory__caption { opacity: 0; transform: translateY(-6px); transition: opacity 0.3s, transform 0.3s; }
.kt-jstory__caption.is-on { opacity: 1; transform: none; }
.kt-jstory__caption rect { fill: color-mix(in srgb, var(--kt-warn) 16%, var(--kt-bg)); stroke: var(--kt-warn); stroke-width: 1.5; }
.kt-jstory__caption text { font: 800 12px var(--font-family-mono); letter-spacing: 0.06em; fill: var(--kt-warn); }

/* entrances */
.kt-jstory__fade { opacity: 0; transition: opacity 0.4s; }
.kt-jstory__fade.is-on { opacity: 1; }
.kt-jstory__pop {
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
  transform: scale(0.6);
  transition: opacity 0.2s, transform 0.45s cubic-bezier(0.3, 1.7, 0.5, 1);
}
.kt-jstory__pop.is-on { opacity: 1; transform: none; }

/* panel 1 */
.kt-jstory__ring { fill: none; stroke: var(--kt-c-primary); stroke-width: 3; }
.kt-jstory__ring.is-team { stroke: var(--kt-line-strong); stroke-width: 2; }
.kt-jstory__ring.is-me { stroke: var(--kt-c-primary-soft); transition: stroke 0.3s; }
.kt-jstory__ring.is-me.is-hot { stroke: var(--kt-hot); animation: kt-jstory-alarm 0.9s ease-in-out infinite; }
@keyframes kt-jstory-alarm { 50% { stroke-width: 6; } }
.kt-jstory__name { font-size: 16px; font-weight: 800; fill: var(--kt-heading); }
.kt-jstory__sub { font: 12px var(--font-family-mono); fill: var(--kt-muted); }
.kt-jstory__dsa { font-size: 15px; font-weight: 800; fill: var(--kt-c-primary-soft); }
.kt-jstory__sheet {
  fill: var(--kt-card);
  stroke: var(--kt-c-primary-soft);
  stroke-width: 1.5;
  animation: kt-jstory-drop 0.25s ease-out;
}
@keyframes kt-jstory-drop { from { transform: translateY(-14px); opacity: 0; } }
.kt-jstory__count { font: 800 26px var(--font-family-mono); fill: var(--kt-heading); }

/* reading: pages fly from the pile into me */
.kt-jstory__flying { fill: var(--kt-card); stroke: var(--kt-c-primary-soft); stroke-width: 1.5; opacity: 0; transform-box: fill-box; transform-origin: center; }
.kt-jstory__flying.is-on { animation: kt-jstory-fly 0.55s ease-in infinite; }
@keyframes kt-jstory-fly {
  0% { opacity: 0; transform: translate(0, 0) rotate(0deg); }
  20% { opacity: 1; }
  100% { opacity: 0; transform: translate(140px, 24px) rotate(25deg) scale(0.4); }
}
.kt-jstory__read { font: 700 12px var(--font-family-mono); fill: var(--kt-muted); opacity: 0; transition: opacity 0.3s, fill 0.3s; }
.kt-jstory__read.is-on { opacity: 1; }
.kt-jstory__read.is-done { fill: var(--kt-good); }
.kt-jstory__huh { font: 900 22px var(--font-family-sans); fill: var(--kt-hot); opacity: 0; transform-box: fill-box; transform-origin: center; transform: scale(0.3); transition: opacity 0.2s, transform 0.4s cubic-bezier(0.3, 1.9, 0.5, 1); }
.kt-jstory__huh.is-small { font-size: 15px; }
.kt-jstory__huh.is-on { opacity: 1; transform: none; animation: kt-jstory-wobble 1.2s ease-in-out 0.4s infinite; }
@keyframes kt-jstory-wobble { 25% { transform: rotate(-12deg); } 75% { transform: rotate(12deg); } }

.kt-jstory__pill { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); stroke-width: 2; }
.kt-jstory__pilltext { font: 700 14px var(--font-family-mono); fill: var(--kt-hot); }
.kt-jstory__watch { fill: none; stroke: var(--kt-hot); stroke-width: 2; }
.kt-jstory__watchhand {
  stroke: var(--kt-hot);
  stroke-width: 2.5;
  stroke-linecap: round;
  transform-origin: 36px 333px;
  animation: kt-jstory-spin 0.7s linear infinite;
}
@keyframes kt-jstory-spin { to { transform: rotate(360deg); } }

/* stamps slam down from above the page */
.kt-jstory__stamp { opacity: 0; transition: opacity 0.1s, transform 0.28s cubic-bezier(0.5, 0, 0.6, 1.6); }
.kt-jstory__stamp.is-hardcore { transform: translate(70px, 226px) rotate(-12deg) scale(2.4); }
.kt-jstory__stamp.is-hardcore.is-on { opacity: 1; transform: translate(70px, 226px) rotate(-12deg); }
.kt-jstory__stamp.is-short { transform: translate(433px, 140px) rotate(-14deg) scale(2.8); }
.kt-jstory__stamp.is-short.is-on { opacity: 1; transform: translate(433px, 140px) rotate(-14deg); }
.kt-jstory__stamp rect { fill: color-mix(in srgb, var(--kt-hot) 16%, var(--kt-bg)); stroke: var(--kt-hot); stroke-width: 3; }
.kt-jstory__stamp text { font: 900 17px var(--font-family-mono); letter-spacing: 0.08em; fill: var(--kt-hot); }
.kt-jstory__stamp.is-short rect { stroke-width: 4; }
.kt-jstory__stamp.is-short text { font-size: 19px; letter-spacing: 0.08em; }

/* comic sound effects: pop, hang, fade */
.kt-jstory__sfx { opacity: 0; font: 900 16px var(--font-family-mono); fill: var(--kt-hot); transform-box: fill-box; transform-origin: center; }
.kt-jstory__sfx.is-thud { transform: rotate(10deg); }
.kt-jstory__sfx.is-gulp { fill: var(--kt-warn); transform: rotate(-10deg); }
.kt-jstory__sfx.is-on { animation: kt-jstory-sfx 1.6s ease-out forwards; }
.kt-jstory__sfx.is-gulp.is-on { animation-duration: 2.4s; }
@keyframes kt-jstory-sfx {
  0% { opacity: 0; scale: 0.3; }
  15% { opacity: 1; scale: 1.25; }
  30% { scale: 1; }
  75% { opacity: 1; }
  100% { opacity: 0; }
}

/* panel 2: the prompt */
.kt-jstory__prompt { opacity: 0; transition: opacity 0.25s, transform 0.55s cubic-bezier(0.6, 0, 0.8, 0.4); }
.kt-jstory__prompt.is-on { opacity: 1; }
.kt-jstory__prompt.is-sent { opacity: 0; transform: translate(130px, 140px) scale(0.2); transition: opacity 0.3s 0.3s, transform 0.55s cubic-bezier(0.6, 0, 0.8, 0.4); }
.kt-jstory__chip { fill: var(--kt-code-bg); stroke: var(--kt-c-primary-soft); stroke-width: 2; }
.kt-jstory__prompttext { font: 700 12px var(--font-family-mono); fill: var(--kt-heading); }
.kt-jstory__caret { fill: var(--kt-c-primary-soft); animation: kt-jstory-blink 0.8s steps(2) infinite; }
@keyframes kt-jstory-blink { 50% { opacity: 0; } }

.kt-jstory__llm { fill: var(--kt-code-bg); stroke: var(--kt-c-primary); stroke-width: 3; }
.kt-jstory__llmbar { stroke: var(--kt-line); stroke-width: 1.5; }
.kt-jstory__llmdot { fill: var(--kt-line-strong); }
.kt-jstory__llmname { font: 800 14px var(--font-family-mono); fill: var(--kt-heading); }
.kt-jstory__thinking { fill: var(--kt-c-primary-soft); animation: kt-jstory-think 1s ease-in-out infinite; }
@keyframes kt-jstory-think { 50% { opacity: 0.25; transform: translateY(-2px); } }
.kt-jstory__spark { fill: var(--kt-warn); }

/* me and the LLM slide in from the panel edges, then close the last gap */
.kt-jstory__reach { opacity: 0; transition: opacity 0.3s, transform 0.8s cubic-bezier(0.3, 0.8, 0.4, 1); }
.kt-jstory__reach.is-mine { transform: translateX(-60px); }
.kt-jstory__reach.is-ai { transform: translateX(60px); }
.kt-jstory__reach.is-on { opacity: 1; transform: none; }
.kt-jstory__reach.is-mine.is-touch { transform: translateX(14px); }
.kt-jstory__reach.is-ai.is-touch { transform: translateX(-14px); }

/* the touch: light, a shockwave, a flash */
.kt-jstory__light-in { stop-color: var(--kt-warn); stop-opacity: 0.5; }
.kt-jstory__light-out { stop-color: var(--kt-warn); stop-opacity: 0; }
.kt-jstory__beam { opacity: 0; transition: opacity 0.8s; }
.kt-jstory__beam.is-on { opacity: 1; }
.kt-jstory__shock { fill: none; stroke: var(--kt-warn); stroke-width: 3; opacity: 0; transform-box: fill-box; transform-origin: center; }
.kt-jstory__shock.is-on { animation: kt-jstory-shock 0.9s ease-out forwards; }
@keyframes kt-jstory-shock {
  0% { opacity: 1; transform: scale(0.4); }
  100% { opacity: 0; transform: scale(5); stroke-width: 0.5; }
}
.kt-jstory__flash { opacity: 0; transform-box: fill-box; transform-origin: center; transform: scale(0.3); transition: opacity 0.3s, transform 0.4s cubic-bezier(0.3, 1.8, 0.5, 1); }
.kt-jstory__flash.is-on { opacity: 1; transform: none; animation: kt-jstory-pulse 1.8s ease-in-out 0.5s infinite; }
.kt-jstory__flash.is-gone { opacity: 0.15; animation: none; }
@keyframes kt-jstory-pulse { 50% { opacity: 0.55; } }
.kt-jstory__burst { fill: color-mix(in srgb, var(--kt-warn) 40%, transparent); stroke: var(--kt-warn); stroke-width: 2; }
.kt-jstory__ray { stroke: var(--kt-warn); stroke-width: 2.5; stroke-linecap: round; }

/* the summary, descending */
.kt-jstory__summary { opacity: 0; transform: translateY(-36px); transition: opacity 0.5s, transform 1.1s cubic-bezier(0.2, 0.8, 0.3, 1); }
.kt-jstory__summary.is-on { opacity: 1; transform: none; }
.kt-jstory__doc { fill: var(--kt-card); stroke: var(--kt-warn); stroke-width: 2.5; }
.kt-jstory__lines { stroke: var(--kt-c-primary-soft); stroke-width: 3; stroke-linecap: round; }
.kt-jstory__file { font: 700 13px var(--font-family-mono); fill: var(--kt-warn); }
.kt-jstory__twinkle { fill: var(--kt-warn); opacity: 0; transform-box: fill-box; transform-origin: center; transition: opacity 0.3s; }
.kt-jstory__twinkle.is-on { animation: kt-jstory-twinkle 1.6s ease-in-out infinite; }
@keyframes kt-jstory-twinkle {
  0%, 100% { opacity: 0; transform: scale(0.3) rotate(0deg); }
  50% { opacity: 1; transform: scale(1) rotate(45deg); }
}

/* the thought: golden, until NOT ENOUGH strikes it through */
.kt-jstory__think { opacity: 0; transform-box: fill-box; transform-origin: 0% 0%; transform: scale(0.6); transition: opacity 0.2s, transform 0.45s cubic-bezier(0.3, 1.6, 0.5, 1); }
.kt-jstory__think.is-on { opacity: 1; transform: none; }
.kt-jstory__thought { fill: color-mix(in srgb, var(--kt-warn) 12%, var(--kt-bg)); stroke: var(--kt-warn); stroke-width: 2; }
.kt-jstory__thinktext { font: 700 15px var(--font-family-mono); fill: var(--kt-heading); }
.kt-jstory__finally { fill: var(--kt-warn); font-weight: 900; }
.kt-jstory__strike { stroke: var(--kt-hot); stroke-width: 3; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 0.4s ease-out 0.3s; }
.kt-jstory__think.is-short .kt-jstory__strike { stroke-dashoffset: 0; }
.kt-jstory__think.is-short .kt-jstory__thought { stroke: var(--kt-hot); fill: var(--kt-tint-secondary); transition: stroke 0.3s, fill 0.3s; }
.kt-jstory__think.is-short .kt-jstory__thinktext,
.kt-jstory__think.is-short .kt-jstory__finally { fill: var(--kt-muted); transition: fill 0.3s; }

/* panel 3: the whiteboard */
.kt-jstory__board { fill: var(--kt-tint-neutral); stroke: var(--kt-line-strong); stroke-width: 2; }
.kt-jstory__surface { fill: color-mix(in srgb, var(--kt-fg) 10%, var(--kt-bg)); stroke: var(--kt-line); stroke-width: 1; }
.kt-jstory__tray { fill: var(--kt-line-strong); }
.kt-jstory__boardq { font: 600 11px var(--font-family-mono); fill: var(--kt-muted); }
.kt-jstory__ink {
  fill: none;
  stroke: var(--kt-c-primary-soft);
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 1;
}
.kt-jstory__layer { font: 700 10px var(--font-family-mono); fill: var(--kt-c-primary-soft); opacity: 0; transition: opacity 0.3s; }
.kt-jstory__layer.is-on { opacity: 1; }
.kt-jstory__ink.is-scribble { stroke: var(--kt-hot); stroke-width: 3; }
.kt-jstory__lost { font: 900 34px var(--font-family-sans); fill: var(--kt-hot); opacity: 0; transform-box: fill-box; transform-origin: center; transform: scale(0.3); transition: opacity 0.2s, transform 0.4s cubic-bezier(0.3, 1.9, 0.5, 1); }
.kt-jstory__lost.is-on { opacity: 1; transform: none; }

/* me */
.kt-jstory__spot-in { stop-color: var(--kt-hot); stop-opacity: 0.4; }
.kt-jstory__spot-out { stop-color: var(--kt-hot); stop-opacity: 0; }
.kt-jstory__spot { opacity: 0; transition: opacity 0.6s; }
.kt-jstory__spot.is-on { opacity: 1; animation: kt-jstory-pulse 1.6s ease-in-out 0.6s infinite; }
.kt-jstory__marker { fill: var(--kt-c-primary); }
.kt-jstory__cap { fill: var(--kt-c-primary-soft); }
.kt-jstory__nib { fill: var(--kt-c-primary-soft); }
.kt-jstory__sweat { fill: var(--kt-c-primary-soft); animation: kt-jstory-drip 1.1s ease-in infinite; }
@keyframes kt-jstory-drip { 70% { opacity: 1; } 100% { opacity: 0; transform: translateY(10px); } }
.kt-jstory__stupid { font: 800 13px var(--font-family-mono); fill: var(--kt-hot); }

/* the team, watching */
.kt-jstory__face { filter: grayscale(1) contrast(1.05); transition: filter 0.3s; }
.kt-jstory__member { transform-box: fill-box; transform-origin: 50% 40%; transition: transform 0.3s cubic-bezier(0.3, 1.6, 0.5, 1); }
.kt-jstory__member.is-talking { transform: scale(1.12); }
.kt-jstory__member.is-talking .kt-jstory__face { filter: none; }
.kt-jstory__member.is-talking .kt-jstory__ring.is-team { stroke: var(--kt-warn); stroke-width: 3; }
.kt-jstory__member.is-talking .kt-jstory__teamname { fill: var(--kt-warn); }
.kt-jstory__ring.is-team, .kt-jstory__teamname { transition: stroke 0.3s, fill 0.3s; }
.kt-jstory__pop.is-on.is-gone { opacity: 0; transform: translateY(-6px); transition: opacity 0.35s, transform 0.35s; }
.kt-jstory__seam { stroke: var(--kt-card); stroke-width: 3; }
.kt-jstory__bubble { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 2; stroke-linejoin: round; }
.kt-jstory__ask { font: 700 13px var(--font-family-mono); fill: var(--kt-heading); }
.kt-jstory__really { fill: var(--kt-hot); font-weight: 900; }
.kt-jstory__teamname { font: 600 11px var(--font-family-mono); fill: var(--kt-muted); }

@media (prefers-reduced-motion: reduce) {
  .kt-jstory__sheet,
  .kt-jstory__watchhand,
  .kt-jstory__sweat,
  .kt-jstory__caret,
  .kt-jstory__twinkle,
  .kt-jstory__flying,
  .kt-jstory__huh,
  .kt-jstory__thinking,
  .kt-jstory__ring,
  .kt-jstory__spot,
  .kt-jstory__scene,
  .kt-jstory__flash.is-on { animation: none !important; }
}
</style>
