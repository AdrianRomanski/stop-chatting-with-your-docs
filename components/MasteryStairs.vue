<script setup lang="ts">
import { computed, useId } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * How I got from fluency to mastery on Julia's architecture, per Make It Stick, then the payoff of
 * JuliaStory; plays once:
 * 1. I stand on the ground, left of the stairs (where FluencyIllusion left me)
 * 2. six steps rise out of the ground, each taller than the last (harder, stronger), and I hop
 *    onto each, done on the architecture doc; landed, a step takes the color of its book (Second Brain blue, Make It Stick green, Feynman yellow); the card in the top left
 *    shows what I do on it: Read (the raw material, writing down what matters), then the book's five techniques: Group (the doc into four
 *    layers: structure building), Generate (sketch it, then check), Retrieve (redraw it, docs
 *    closed), Elaborate ("why this way?", in my own words), Space (again tomorrow, next week, next
 *    month); under the climb, three books with their covers: Building a Second Brain under Read,
 *    Make It Stick under Group … Space, Richard Feynman's Mental Models under TEACH
 * 3. the top step: TEACH, explain it to others (the Protégé Effect, from Richard Feynman's Mental Models; Feynman's photo; not from the
 *    book); I land on top: a flag, confetti
 * 4. the next group meeting: the stairs shrink into the corner, their names kept on a diagonal
 *    above each block; I glide to the whiteboard and draw
 *    the architecture with confidence, layer by layer, the marker riding each stroke; the team,
 *    in color now, is impressed and asks for guidelines, one at a time; Julia, the creator, last
 * No props.
 */
const { t, at } = useTimeline(43.5)
const uid = useId()
const face = `kt-mstairs-face-${uid}`
const head = `kt-mstairs-head-${uid}`
const feyn = `kt-mstairs-feyn-${uid}`

// --- the climb ---
const GROUND = 316
const STEP_W = 102
const COL = 110
const steps = [
  { name: 'Read', lines: ['read the doc,', 'take notes'] },
  { name: 'Group', lines: ['the doc,', 'into layers'] },
  { name: 'Generate', lines: ['sketch first,', 'then check'] },
  { name: 'Retrieve', lines: ['redraw it,', 'docs closed'] },
  { name: 'Elaborate', lines: ['why this way?', 'my own words'] },
  { name: 'Space', lines: ['again, after', 'a gap'] },
].map((s, i) => ({ ...s, book: i === 0 ? 'basb' : 'mis', x: 104 + i * COL, top: 256 - i * 30 }))
const SUMMIT = { x: 104 + 6 * COL, top: 56 }
const START = { x: 54, y: GROUND - 24 } // on the ground, before the first step
// block k rises at RISE(k), I hop onto it HOP_FOR later; a step per beat of the narration
const STEP_DT = 4.5
const RISE = (k: number) => 0.9 + k * STEP_DT
const HOP = (k: number) => RISE(k) + 0.55
const HOP_FOR = 0.55
const stops = [
  START,
  ...steps.map(s => ({ x: s.x + STEP_W / 2, y: s.top - 24 })),
  { x: SUMMIT.x + STEP_W / 2 - 14, y: SUMMIT.top - 24 },
]
const TOP = stops.length - 1
const confetti = Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2
  return { dx: Math.cos(a) * (50 + (i % 3) * 18), dy: Math.sin(a) * (40 + (i % 4) * 12) - 30, r: (i * 47) % 360, hot: i % 3 === 0 }
})

// --- each block, once landed, in the colors of the books behind it, as vertical stripes (as on the later
// climb checkpoints): Building a Second Brain blue, Make It Stick green, the styles' books and Feynman's
// Mental Models yellow, Tomorrowmind white. Here colors only, no labels: the books come later in the talk.
const STRIPES = [
  ['basb', 'tm'], ['basb', 'mis', 'tm'], ['basb', 'mis', 'tm'],
  ['mis', 'style', 'tm'], ['mis', 'style', 'tm'], ['mis', 'style', 'tm'],
  ['teach', 'tm'],
].map(keys => keys.flatMap((k, j) => [{ k, o: j / keys.length }, { k, o: (j + 1) / keys.length }]))

// --- the three books under the climb: which steps each one gives ---
const books = [
  { key: 'basb', from: steps[0].x, to: steps[0].x + STEP_W, land: 0, cover: '/images/books/building-a-second-brain.webp',
    x: 40, title: ['Building a', 'Second Brain'], by: 'Tiago Forte' },
  { key: 'mis', from: steps[1].x, to: steps[5].x + STEP_W, land: 5, cover: '/images/books/make-it-stick.jpg',
    x: 380, title: ['Make It Stick'], by: 'Brown, Roediger, McDaniel' },
  { key: 'rfmm', from: SUMMIT.x, to: SUMMIT.x + STEP_W, land: 6, cover: '/images/books/richard-feynmans-mental-models.jpg',
    x: 742, title: ["Feynman's", 'Mental Models'], by: 'Peter Hollins' },
]
const COVER = { w: 42, h: 64, y: GROUND + 12 }

// --- the card: what I do on each step, on the architecture doc ---
const pages = Array.from({ length: 4 }, (_, i) => ({ x: 36 + i * 22 }))
const notes = [120, 96, 112, 70] // the lines I write down, in px
const LAYERS = ['patterns', 'components', 'primitives', 'tokens'] // top-down, as I draw them
const mini = (x: number, w: number) => LAYERS.map((name, i) => ({ name, x, w, y: 54 + i * 22 }))
const stacks = [...LAYERS].reverse().map((name, i) => ({ name, x: 34 + i * 92 }))
const later = [
  { when: 'tomorrow', x: 30 },
  { when: 'next week', x: 150 },
  { when: 'next month', x: 270 },
]

// --- the next group meeting ---
// 2.4s on the summit: time to see the Feynman book before the meeting
const MEET_AT = HOP(6) + HOP_FOR + 2.4
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
// the card shows the step I'm standing on; gone at the meeting
const scene = computed(() => (at(MEET_AT) ? -1 : Math.min(me.value.landed, steps.length + 1) - 1))

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
  <svg class="kt-mstairs" viewBox="0 0 880 396" role="img"
    aria-label="From fluency to mastery on the design system's architecture document. Three books combined. Read: the raw material, writing down what matters, from Building a Second Brain by Tiago Forte. Then five techniques from Make It Stick by Brown, Roediger and McDaniel. Group: I sort the document into four layers, tokens, primitives, components, patterns. Generate: I sketch the diagram before I look, then check it. Retrieve: I redraw it with the docs closed. Elaborate: why this way, in my own words. Space: I redraw it again tomorrow, next week, next month. The top step: teach it to others, the Protégé Effect, from the book Richard Feynman's Mental Models by Peter Hollins. Then the next group meeting: I draw the design system architecture layer by layer, and the team, Julia the creator included, asks me for guidelines.">
    <defs>
      <clipPath :id="face" clipPathUnits="objectBoundingBox"><circle cx="0.5" cy="0.5" r="0.5" /></clipPath>
      <clipPath :id="feyn"><circle :cx="SUMMIT.x + STEP_W / 2" :cy="SUMMIT.top + 140" r="32" /></clipPath>
      <linearGradient v-for="(g, i) in STRIPES" :id="`${face}-st${i}`" :key="`st${i}`" x1="0" y1="0" x2="1" y2="0">
        <stop v-for="(st, j) in g" :key="j" :offset="st.o" class="kt-mstairs__stop" :class="`is-${st.k}`" />
      </linearGradient>
      <marker :id="head" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto">
        <path d="M0 0 L10 5 L0 10 z" class="kt-mstairs__inkhead" />
      </marker>
    </defs>

    <!-- the climb; at the meeting it shrinks into the corner -->
    <g class="kt-mstairs__climb" :class="{ 'is-small': at(MEET_AT) }">
      <path :d="`M10 ${GROUND} H 872`" class="kt-mstairs__ground" />
      <g v-for="(s, k) in steps" :key="s.name" class="kt-mstairs__rise" :class="{ 'is-on': at(RISE(k)) }">
        <rect :x="s.x" :y="s.top" :width="STEP_W" :height="GROUND - s.top" rx="10" class="kt-mstairs__step"
          :class="[`is-${s.book}`, { 'is-landed': landedOn(k) }]" />
        <g class="kt-mstairs__striped" :class="{ 'is-on': landedOn(k) }">
          <rect :x="s.x" :y="s.top" :width="STEP_W" :height="GROUND - s.top" rx="10" :fill="`url(#${face}-st${k})`" class="kt-mstairs__stfill" />
          <rect :x="s.x" :y="s.top" :width="STEP_W" :height="GROUND - s.top" rx="10" fill="none" :stroke="`url(#${face}-st${k})`" class="kt-mstairs__stline" />
        </g>
        <text :x="s.x + 11" :y="s.top + 23" class="kt-mstairs__name">{{ s.name }}</text>
        <text v-for="(l, j) in s.lines" :key="j" :x="s.x + 11" :y="s.top + 40 + j * 14" class="kt-mstairs__line">{{ l }}</text>
        <circle :cx="s.x + STEP_W / 2" :cy="s.top" r="12" class="kt-mstairs__thud" :class="{ 'is-on': landedOn(k) }" />
      </g>
      <!-- one step higher: teach it -->
      <g class="kt-mstairs__rise" :class="{ 'is-on': at(RISE(6)) }">
        <rect :x="SUMMIT.x" :y="SUMMIT.top" :width="STEP_W" :height="GROUND - SUMMIT.top" rx="10" class="kt-mstairs__summit"
          :class="{ 'is-landed': landedOn(6) }" />
        <g class="kt-mstairs__striped" :class="{ 'is-on': landedOn(6) }">
          <rect :x="SUMMIT.x" :y="SUMMIT.top" :width="STEP_W" :height="GROUND - SUMMIT.top" rx="10" :fill="`url(#${face}-st6)`" class="kt-mstairs__stfill" />
          <rect :x="SUMMIT.x" :y="SUMMIT.top" :width="STEP_W" :height="GROUND - SUMMIT.top" rx="10" fill="none" :stroke="`url(#${face}-st6)`" class="kt-mstairs__stline" />
        </g>
        <text :x="SUMMIT.x + 11" :y="SUMMIT.top + 25" class="kt-mstairs__top is-teach">TEACH</text>
        <text :x="SUMMIT.x + 11" :y="SUMMIT.top + 42" class="kt-mstairs__line">explain it</text>
        <text :x="SUMMIT.x + 11" :y="SUMMIT.top + 56" class="kt-mstairs__line">to others</text>
        <text :x="SUMMIT.x + 11" :y="SUMMIT.top + 80" class="kt-mstairs__effect">Protégé</text>
        <text :x="SUMMIT.x + 11" :y="SUMMIT.top + 93" class="kt-mstairs__effect">Effect</text>
        <!-- Feynman, the face of teaching to learn -->
        <image href="/images/people/richard-feynman.jpg" :x="SUMMIT.x + STEP_W / 2 - 66" :y="SUMMIT.top + 140 - 50" width="134" height="167"
          :clip-path="`url(#${feyn})`" class="kt-mstairs__feynman" />
        <circle :cx="SUMMIT.x + STEP_W / 2" :cy="SUMMIT.top + 140" r="32" class="kt-mstairs__feynring" />
        <text :x="SUMMIT.x + STEP_W / 2" :y="SUMMIT.top + 190" text-anchor="middle" class="kt-mstairs__effect">R. Feynman</text>
      </g>
      <g class="kt-mstairs__flag" :class="{ 'is-on': landedOn(6) }">
        <path :d="`M${SUMMIT.x + STEP_W - 18} ${SUMMIT.top} V ${SUMMIT.top - 52}`" class="kt-mstairs__pole" />
        <path :d="`M${SUMMIT.x + STEP_W - 18} ${SUMMIT.top - 52} l-30 10 l30 10z`" class="kt-mstairs__cloth" />
      </g>
      <!-- three books, combined: under each, the steps it gives; it shows once I've climbed them -->
      <g v-for="b in books" :key="b.key" class="kt-mstairs__book" :class="{ 'is-on': landedOn(b.land) }">
        <path :d="`M${b.from + 4} ${GROUND + 5} H ${b.to - 4}`" class="kt-mstairs__bracket" :class="`is-${b.key}`" />
        <image :href="b.cover" :x="b.x" :y="COVER.y" :width="COVER.w" :height="COVER.h" preserveAspectRatio="xMidYMid slice" />
        <rect :x="b.x" :y="COVER.y" :width="COVER.w" :height="COVER.h" rx="2" class="kt-mstairs__coverline" />
        <text v-for="(l, j) in b.title" :key="l" :x="b.x + COVER.w + 8" :y="COVER.y + 18 + j * 15" class="kt-mstairs__booktitle">{{ l }}</text>
        <text :x="b.x + COVER.w + 8" :y="COVER.y + 22 + b.title.length * 15" class="kt-mstairs__booktext">{{ b.by }}</text>
      </g>
      <!-- shrunk into the corner, the names stay: on a diagonal above each block -->
      <text v-for="s in steps" :key="`n${s.name}`" :x="s.x + 30" :y="s.top - 12"
        :transform="`rotate(-40 ${s.x + 30} ${s.top - 12})`" class="kt-mstairs__thumbname">{{ s.name }}</text>
      <text :x="SUMMIT.x + 20" :y="SUMMIT.top - 12" :transform="`rotate(-40 ${SUMMIT.x + 20} ${SUMMIT.top - 12})`"
        class="kt-mstairs__thumbname is-teach">Teach</text>
      <rect v-for="(c, i) in confetti" :key="`c${i}`" :x="SUMMIT.x + STEP_W / 2 - 3" :y="SUMMIT.top - 30" width="6" height="10" rx="1.5"
        class="kt-mstairs__confetti" :class="{ 'is-on': landedOn(6), 'is-hot': c.hot }"
        :style="{ '--dx': `${c.dx}px`, '--dy': `${c.dy}px`, '--r': `${c.r}deg`, animationDelay: `${i * 0.015}s` }" />
    </g>

    <!-- the card: what I do on the step I'm standing on -->
    <g class="kt-mstairs__fade" :class="{ 'is-on': scene >= 0 }">
      <rect x="14" y="12" width="386" height="138" rx="10" class="kt-mstairs__card" />
    </g>

    <!-- Read: the raw material, cover to cover -->
    <g class="kt-mstairs__scene" :class="{ 'is-on': scene === 0 }">
      <text x="28" y="38" class="kt-mstairs__cardtitle">read the doc, write things down</text>
      <!-- the architecture doc, page after page -->
      <g v-for="(p, i) in pages" :key="`p${i}`" class="kt-mstairs__in" :style="{ transitionDelay: `${0.15 + i * 0.2}s` }">
        <rect :x="p.x" :y="54 + i * 4" width="46" height="62" rx="4" class="kt-mstairs__page" />
        <path :d="`M${p.x + 8} ${68 + i * 4} h30 M${p.x + 8} ${78 + i * 4} h24 M${p.x + 8} ${88 + i * 4} h28 M${p.x + 8} ${98 + i * 4} h18`" class="kt-mstairs__doclines" />
      </g>
      <text x="93" y="138" text-anchor="middle" class="kt-mstairs__minilabel kt-mstairs__in" style="transition-delay: 0.9s">architecture doc</text>
      <path d="M170 92 h34" class="kt-mstairs__drawline" pathLength="1" style="transition-delay: 1s" :marker-end="`url(#${head})`" />
      <!-- my notes, written as I read -->
      <g class="kt-mstairs__in" style="transition-delay: 1.2s">
        <rect x="222" y="52" width="160" height="80" rx="6" class="kt-mstairs__notepad" />
        <text x="232" y="68" class="kt-mstairs__minilabel is-strong">my notes</text>
      </g>
      <path v-for="(w, k) in notes" :key="`n${k}`" :d="`M234 ${84 + k * 13} h${w}`" pathLength="1"
        class="kt-mstairs__scribble" :style="{ transitionDelay: `${1.6 + k * 0.5}s` }" />
    </g>

    <!-- Group: the doc, in four groups -->
    <g class="kt-mstairs__scene" :class="{ 'is-on': scene === 1 }">
      <text x="28" y="38" class="kt-mstairs__cardtitle">the doc, in four groups</text>
      <g v-for="(g, i) in stacks" :key="`g${g.name}`">
        <rect v-for="j in 4" :key="j" :x="g.x + [0, 3, -2, 2][j - 1]" :y="112 - j * 9" width="64" height="7" rx="2"
          class="kt-mstairs__sheet kt-mstairs__in" :style="{ transitionDelay: `${0.15 + i * 0.25 + j * 0.06}s` }" />
        <text :x="g.x + 32" y="132" text-anchor="middle" class="kt-mstairs__minilabel kt-mstairs__in"
          :style="{ transitionDelay: `${0.4 + i * 0.25}s` }">{{ g.name }}</text>
      </g>
    </g>

    <!-- Generate: sketch it before I look, then check -->
    <g class="kt-mstairs__scene" :class="{ 'is-on': scene === 2 }">
      <text x="28" y="38" class="kt-mstairs__cardtitle">sketch it before I look</text>
      <template v-for="(l, i) in mini(30, 150)" :key="`s${l.name}`">
        <rect :x="l.x" :y="l.y" :width="l.w" height="18" rx="3" class="kt-mstairs__mini is-guess kt-mstairs__in"
          :style="{ transitionDelay: `${0.2 + (3 - i) * 0.2}s` }" />
        <text :x="l.x + l.w / 2" :y="l.y + 13" text-anchor="middle" class="kt-mstairs__minilabel kt-mstairs__in"
          :style="{ transitionDelay: `${0.3 + (3 - i) * 0.2}s` }">{{ l.name }}</text>
      </template>
      <g class="kt-mstairs__in" style="transition-delay: 1.2s">
        <circle cx="200" cy="87" r="10" class="kt-mstairs__q" />
        <text x="200" y="92" text-anchor="middle" class="kt-mstairs__qtext">?</text>
      </g>
      <g class="kt-mstairs__in" style="transition-delay: 1.6s">
        <text x="230" y="80" class="kt-mstairs__cardline is-strong">my guess first,</text>
        <text x="230" y="102" class="kt-mstairs__cardline">then check the docs</text>
        <text x="230" y="124" class="kt-mstairs__cardline">and fix what's wrong</text>
      </g>
    </g>

    <!-- Retrieve: redraw it, docs closed -->
    <g class="kt-mstairs__scene" :class="{ 'is-on': scene === 3 }">
      <text x="28" y="38" class="kt-mstairs__cardtitle">redraw it from memory</text>
      <g class="kt-mstairs__in" style="transition-delay: 0.1s">
        <rect x="40" y="56" width="52" height="62" rx="5" class="kt-mstairs__doc" />
        <path d="M50 72 h32 M50 84 h26 M50 96 h30 M50 108 h20" class="kt-mstairs__doclines" />
        <path d="M44 60 L88 114 M88 60 L44 114" class="kt-mstairs__cross" />
        <text x="66" y="138" text-anchor="middle" class="kt-mstairs__minilabel is-bad">docs closed</text>
      </g>
      <template v-for="(l, i) in mini(150, 170)" :key="`r${l.name}`">
        <rect :x="l.x" :y="l.y" :width="l.w" height="18" rx="3" pathLength="1" class="kt-mstairs__draw"
          :style="{ transitionDelay: `${0.5 + (3 - i) * 0.35}s` }" />
        <text :x="l.x + l.w / 2" :y="l.y + 13" text-anchor="middle" class="kt-mstairs__minilabel kt-mstairs__in"
          :style="{ transitionDelay: `${0.8 + (3 - i) * 0.35}s` }">{{ l.name }}</text>
      </template>
    </g>

    <!-- Elaborate: why this way? in my own words -->
    <g class="kt-mstairs__scene" :class="{ 'is-on': scene === 4 }">
      <text x="28" y="38" class="kt-mstairs__cardtitle">explain why, in my own words</text>
      <template v-for="l in mini(30, 140)" :key="`e${l.name}`">
        <rect :x="l.x" :y="l.y" :width="l.w" height="18" rx="3" class="kt-mstairs__mini" />
        <text :x="l.x + l.w / 2" :y="l.y + 13" text-anchor="middle" class="kt-mstairs__minilabel">{{ l.name }}</text>
      </template>
      <path v-for="k in 3" :key="`b${k}`" :d="`M186 ${54 + k * 22 + 14} V ${54 + k * 22 - 6}`" pathLength="1"
        class="kt-mstairs__drawline" :style="{ transitionDelay: `${0.2 + k * 0.25}s` }" :marker-end="`url(#${head})`" />
      <g class="kt-mstairs__in" style="transition-delay: 1.1s">
        <rect x="212" y="54" width="150" height="26" rx="13" class="kt-mstairs__bubble" />
        <text x="287" y="72" text-anchor="middle" class="kt-mstairs__ask">Why this way?</text>
      </g>
      <path v-for="(w, k) in [150, 118, 136]" :key="`w${k}`" :d="`M216 ${100 + k * 16} h${w}`" pathLength="1"
        class="kt-mstairs__scribble" :style="{ transitionDelay: `${1.6 + k * 0.45}s` }" />
    </g>

    <!-- Space: again, after a gap -->
    <g class="kt-mstairs__scene" :class="{ 'is-on': scene === 5 }">
      <text x="28" y="38" class="kt-mstairs__cardtitle">redraw it again, after a gap</text>
      <g v-for="(d, k) in later" :key="d.when" class="kt-mstairs__in" :style="{ transitionDelay: `${0.15 + k * 0.7}s` }">
        <rect :x="d.x" y="52" width="100" height="88" rx="8" class="kt-mstairs__day" />
        <text :x="d.x + 50" y="72" text-anchor="middle" class="kt-mstairs__minilabel is-strong">{{ d.when }}</text>
        <rect v-for="j in 4" :key="j" :x="d.x + 22" :y="72 + j * 10" width="56" height="7" rx="2" class="kt-mstairs__mini" />
        <g class="kt-mstairs__tick" :style="{ transitionDelay: `${0.5 + k * 0.7}s` }">
          <circle :cx="d.x + 86" cy="56" r="10" />
          <path :d="`M${d.x + 81} 56 l3.5 4 l6 -8`" />
        </g>
      </g>
    </g>

    <!-- Teach: I can draw it, and explain it to others -->
    <g class="kt-mstairs__scene" :class="{ 'is-on': scene === 6 }">
      <text x="28" y="38" class="kt-mstairs__cardtitle is-teach">teach it: explain it to others</text>
      <template v-for="l in mini(30, 180)" :key="`m${l.name}`">
        <rect :x="l.x" :y="l.y" :width="l.w" height="18" rx="3" class="kt-mstairs__mini is-good" />
        <text :x="l.x + l.w / 2" :y="l.y + 13" text-anchor="middle" class="kt-mstairs__minilabel">{{ l.name }}</text>
      </template>
      <path d="M228 138 V 60" class="kt-mstairs__arrow" :marker-end="`url(#${head})`" />
      <text x="244" y="100" text-anchor="middle" transform="rotate(-90 244 100)" class="kt-mstairs__minilabel">builds on</text>
      <g class="kt-mstairs__in" style="transition-delay: 0.3s">
        <circle cx="318" cy="96" r="30" class="kt-mstairs__bigtick" />
        <path d="M303 96 l10 11 l19 -23" class="kt-mstairs__bigtickmark" />
      </g>
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
.kt-mstairs__climb.is-small { transform: translate(14px, 267px) scale(0.34); opacity: 0.8; }
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


.kt-mstairs__step {
  fill: var(--kt-tint-primary);
  stroke: var(--kt-c-primary-soft);
  stroke-width: 2;
  transition: fill 0.35s, stroke 0.35s;
}
/* landed: done, in the color of the book the step comes from; TEACH (Feynman's) has its own block */
.kt-mstairs__step.is-landed.is-basb { fill: color-mix(in srgb, var(--kt-info) 22%, var(--kt-bg)); stroke: var(--kt-info); }
.kt-mstairs__step.is-landed.is-mis { fill: color-mix(in srgb, var(--kt-good) 22%, var(--kt-bg)); stroke: var(--kt-good); }
.kt-mstairs__name { font-size: 16px; font-weight: 800; fill: var(--kt-heading); }
.kt-mstairs__line { font-size: 12px; fill: var(--kt-fg); }

/* landing: a ring bursts from the step's edge */
.kt-mstairs__thud { fill: none; stroke: var(--kt-c-primary-soft); stroke-width: 3; opacity: 0; transform-box: fill-box; transform-origin: center; }
.kt-mstairs__thud.is-on { animation: kt-mstairs-thud 0.6s ease-out forwards; }
@keyframes kt-mstairs-thud {
  0% { opacity: 1; transform: scale(0.4); }
  100% { opacity: 0; transform: scale(3.4); stroke-width: 0.5; }
}

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
.kt-mstairs__climb.is-small .kt-mstairs__flag { opacity: 0; }

/* landed: the books' colors, in stripes */
.kt-mstairs__striped { opacity: 0; transition: opacity 0.35s; }
.kt-mstairs__striped.is-on { opacity: 1; }
.kt-mstairs__stfill { opacity: 0.42; }
.kt-mstairs__stline { stroke-width: 3; }
.kt-mstairs__stop.is-basb { stop-color: var(--kt-info); }
.kt-mstairs__stop.is-mis { stop-color: var(--kt-good); }
.kt-mstairs__stop.is-style, .kt-mstairs__stop.is-teach { stop-color: var(--kt-warn); }
.kt-mstairs__stop.is-tm { stop-color: var(--kt-heading); }

/* the three books under the climb */
.kt-mstairs__book { opacity: 0; transition: opacity 0.4s; }
.kt-mstairs__book.is-on { opacity: 1; }
.kt-mstairs__climb.is-small .kt-mstairs__book { opacity: 0; }
.kt-mstairs__bracket { fill: none; stroke-width: 3; stroke-linecap: round; }
.kt-mstairs__bracket.is-basb { stroke: var(--kt-info); }
.kt-mstairs__bracket.is-mis { stroke: var(--kt-good); }
.kt-mstairs__bracket.is-rfmm { stroke: var(--kt-warn); }
.kt-mstairs__coverline { fill: none; stroke: var(--kt-line-strong); stroke-width: 1; }
.kt-mstairs__booktitle { font-size: 13px; font-weight: 800; fill: var(--kt-heading); }
.kt-mstairs__booktext { font: 600 10px var(--font-family-mono); fill: var(--kt-muted); }

/* the names on the thumbnail: big in climb units, readable once scaled down */
.kt-mstairs__thumbname { font: 800 32px var(--font-family-sans); fill: var(--kt-heading); opacity: 0; transition: opacity 0.3s; }
.kt-mstairs__thumbname.is-teach { fill: var(--kt-warn); }
.kt-mstairs__climb.is-small .kt-mstairs__thumbname { opacity: 1; transition: opacity 0.4s 0.7s; }

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

/* the card: what I do on each step */
.kt-mstairs__card { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 1.5; }
.kt-mstairs__cardtitle { font: 800 14px var(--font-family-mono); fill: var(--kt-heading); }
.kt-mstairs__cardtitle.is-teach { fill: var(--kt-warn); }
.kt-mstairs__cardline { font-size: 13px; fill: var(--kt-fg); }
.kt-mstairs__cardline.is-strong { font-weight: 800; fill: var(--kt-heading); }
.kt-mstairs__scene { opacity: 0; transition: opacity 0.25s; }
.kt-mstairs__scene.is-on { opacity: 1; transition: opacity 0.35s 0.1s; }
/* inside a scene, parts come in one by one once it shows (the delay is set inline) */
.kt-mstairs__in { opacity: 0; transform: translateY(-5px); transition: opacity 0.3s, transform 0.3s; }
.kt-mstairs__scene.is-on .kt-mstairs__in { opacity: 1; transform: none; }
.kt-mstairs__scene:not(.is-on) .kt-mstairs__in { transition-delay: 0s !important; }
.kt-mstairs__sheet { fill: var(--kt-card); stroke: var(--kt-c-primary-soft); stroke-width: 1.5; }
.kt-mstairs__minilabel { font: 700 11px var(--font-family-mono); fill: var(--kt-heading); }
.kt-mstairs__minilabel.is-bad { fill: var(--kt-bad); }
.kt-mstairs__minilabel.is-strong { font-size: 12px; fill: var(--kt-c-primary-soft); }
.kt-mstairs__mini { fill: color-mix(in srgb, var(--kt-c-primary) 14%, transparent); stroke: var(--kt-c-primary-soft); stroke-width: 1.5; }
.kt-mstairs__mini.is-guess { fill: none; stroke-dasharray: 4 4; stroke: var(--kt-muted); }
.kt-mstairs__mini.is-good { fill: color-mix(in srgb, var(--kt-good) 16%, transparent); stroke: var(--kt-good); }
.kt-mstairs__q { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); stroke-width: 2; }
.kt-mstairs__qtext { font-size: 14px; font-weight: 800; fill: var(--kt-hot); }
.kt-mstairs__doc { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 1.5; opacity: 0.6; }
.kt-mstairs__doclines { stroke: var(--kt-subtle); stroke-width: 3; stroke-linecap: round; opacity: 0.6; }
.kt-mstairs__cross { stroke: var(--kt-bad); stroke-width: 4; stroke-linecap: round; }
/* drawn like marker strokes */
.kt-mstairs__draw, .kt-mstairs__drawline, .kt-mstairs__scribble {
  fill: none;
  stroke: var(--kt-c-primary-soft);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  opacity: 0;
  transition: stroke-dashoffset 0.45s ease-in-out, fill 0.3s, opacity 0.1s;
}
.kt-mstairs__scene.is-on .kt-mstairs__draw { opacity: 1; stroke-dashoffset: 0; fill: color-mix(in srgb, var(--kt-c-primary) 14%, transparent); }
.kt-mstairs__scene.is-on .kt-mstairs__drawline { opacity: 1; stroke-dashoffset: 0; }
.kt-mstairs__scribble { stroke: var(--kt-fg); stroke-width: 3; transition-duration: 0.5s; }
.kt-mstairs__scene.is-on .kt-mstairs__scribble { opacity: 0.7; stroke-dashoffset: 0; }
.kt-mstairs__scene:not(.is-on) :is(.kt-mstairs__draw, .kt-mstairs__drawline, .kt-mstairs__scribble) { transition-delay: 0s !important; }
.kt-mstairs__inkhead { fill: var(--kt-c-primary-soft); }
.kt-mstairs__arrow { fill: none; stroke: var(--kt-c-primary-soft); stroke-width: 2; }
.kt-mstairs__day { fill: var(--kt-tint-primary); stroke: var(--kt-line-strong); stroke-width: 1.5; }
.kt-mstairs__tick { opacity: 0; transform-box: fill-box; transform-origin: center; transform: scale(0.3); transition: opacity 0.2s, transform 0.35s cubic-bezier(0.3, 1.8, 0.5, 1); }
.kt-mstairs__scene.is-on .kt-mstairs__tick { opacity: 1; transform: none; }
.kt-mstairs__tick circle { fill: var(--kt-good); }
.kt-mstairs__tick path { fill: none; stroke: var(--kt-bg); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
.kt-mstairs__bigtick { fill: color-mix(in srgb, var(--kt-good) 20%, transparent); stroke: var(--kt-good); stroke-width: 3; }
.kt-mstairs__bigtickmark { fill: none; stroke: var(--kt-good); stroke-width: 5; stroke-linecap: round; stroke-linejoin: round; }

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
