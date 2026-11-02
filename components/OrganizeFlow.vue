<script setup lang="ts">
import { computed } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * O · Organize, the PARA method as one routing flow (Forte Ch. 5, p. 101–3), every step animated.
 * It opens on the idea from TrainOffline: the same person, the yellow thought "I Need OFFLINE
 * Sparring Partner" and its bulb; the thought turns into today's daily note and the person makes
 * way for the Dewey shelf ("by topic"), struck out. The flow comes in: project? → area? →
 * resource? → else Archives, all folders empty. Then three things travel it, stopping at every
 * question until one says yes (green): the idea → Projects (this talk); a second note, "I want to
 * find my voice on stage and mature as a speaker" → Areas (public speaking); the five books behind
 * this talk, from the left → Resources. Last, my last talk shows up in Archives: project finished.
 * Replaces DeweyShelf and ParaBuckets on stage. No props, no numbers.
 */
const { t, at } = useTimeline(13)
const steps = [
  { cx: 250, q: 'project?', name: 'Projects', rule: 'has a deadline', ex: 'this talk', catchAt: 5.6, fileAt: 6.3 },
  { cx: 440, q: 'area?', name: 'Areas', rule: 'no end date', ex: 'public speaking', catchAt: 8.4, fileAt: 9.1 },
  { cx: 630, q: 'resource?', name: 'Resources', rule: 'might be useful', ex: '', catchAt: 11.1, fileAt: 11.7 },
  { cx: 800, q: '', name: 'Archives', rule: 'inactive', ex: 'my last talk', why: 'project finished', catchAt: 99, fileAt: 12.3 },
]
const idea = ['I Need', 'OFFLINE', 'Sparring', 'Partner']
const voice = ['I want to find', 'my voice on', 'stage and', 'mature as', 'a speaker']
const shownAt = (i: number) => 3.0 + i * 0.4
const noted = computed(() => at(1.8))

// a stop on the way: [second, x, y]; between stops the traveller moves in a straight line
type Stop = [number, number, number]
const along = (stops: Stop[]) => {
  const now = t.value
  if (now <= stops[0][0]) return { x: stops[0][1], y: stops[0][2] }
  for (let i = 1; i < stops.length; i++) {
    const [t1, x1, y1] = stops[i]
    if (now < t1) {
      const [t0, x0, y0] = stops[i - 1]
      const k = (now - t0) / (t1 - t0)
      const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2
      return { x: x0 + (x1 - x0) * e, y: y0 + (y1 - y0) * e }
    }
  }
  const last = stops[stops.length - 1]
  return { x: last[1], y: last[2] }
}
const place = (stops: Stop[], scale = 1) => {
  const p = along(stops)
  return `translate(${p.x} ${p.y}) scale(${scale})`
}

// the idea: project? yes
const ideaStops: Stop[] = [[5.0, 85, 78], [5.5, 250, 82], [5.9, 250, 82], [6.3, 250, 292]]
// the second note: project? no, area? yes
const voiceStops: Stop[] = [[7.6, 85, 78], [8.0, 250, 82], [8.2, 250, 82], [8.6, 440, 82], [8.8, 440, 82], [9.1, 440, 292]]
// the books, in from the left: project? no, area? no, resource? yes
const books = [
  { href: '/images/books/building-a-second-brain.webp', w: 30, r: -6, fx: 588 },
  { href: '/images/books/make-it-stick.jpg', w: 30, r: 3, fx: 609 },
  { href: '/images/books/richard-feynmans-mental-models.jpg', w: 30, r: -2, fx: 630 },
  { href: '/images/books/the-socratic-method.jpg', w: 30, r: 4, fx: 651 },
  { href: '/images/books/tomorrowmind.webp', w: 30, r: -4, fx: 672 },
]
const bookStep = 0.2
const bookStops = (i: number, fx: number): Stop[] => {
  const d = i * bookStep
  return [[9.7 + d, -30, 82], [10.1 + d, 85, 82], [10.4 + d, 250, 82], [10.7 + d, 440, 82], [11.0 + d, 630, 82], [11.4 + d, fx, 264]]
}
</script>

<template>
  <svg class="kt-org" :class="{ 'is-noted': noted }" viewBox="0 0 880 340" role="img"
    aria-label="PARA as a flow. The idea from the train, I need an offline sparring partner, becomes today's daily note. Not by topic like a library shelf. Is it a project? an area? a resource? If none, archive it. The idea is a project: this talk. I want to find my voice on stage is an area: public speaking. The books behind this talk are resources. My last talk is archived: project finished.">
    <defs>
      <radialGradient id="kt-org-bulbglow">
        <stop offset="0%" class="kt-org__glow-in" />
        <stop offset="100%" class="kt-org__glow-out" />
      </radialGradient>
    </defs>

    <!-- the person from the train, with the idea -->
    <g class="kt-org__part kt-org__who" :class="{ 'is-on': at(0.2) }">
      <circle cx="48" cy="190" r="16" class="kt-org__person" />
      <path d="M10 250 q0 -40 38 -40 q38 0 38 40z" class="kt-org__person" />
      <circle cx="62" cy="160" r="4" class="kt-org__thought is-dot" />
      <circle cx="72" cy="146" r="6" class="kt-org__thought is-dot" />
    </g>

    <!-- the thought becomes today's daily note; its notes leave one by one -->
    <g class="kt-org__part" :class="{ 'is-on': at(0.2) }">
      <rect x="10" y="20" width="150" height="116" class="kt-org__daily" />
      <text x="24" y="40" class="kt-org__file">daily note</text>
      <g class="kt-org__entry" :class="{ 'is-gone': at(5.0) }">
        <text v-for="(w, i) in idea" :key="w" x="85" :y="62 + i * 20" text-anchor="middle" class="kt-org__idea">{{ w }}</text>
      </g>
      <g class="kt-org__entry is-later" :class="{ 'is-in': at(6.9), 'is-gone': at(7.6) }">
        <text v-for="(w, i) in voice" :key="w" x="85" :y="60 + i * 17" text-anchor="middle" class="kt-org__voice">{{ w }}</text>
      </g>
      <text x="85" y="94" text-anchor="middle" class="kt-org__entry is-later kt-org__done" :class="{ 'is-in': at(12.0) }">all filed ✓</text>
    </g>

    <g class="kt-org__bulb" :class="{ 'is-on': at(0.8) }">
      <circle cx="152" cy="22" r="34" fill="url(#kt-org-bulbglow)" />
      <path d="M152 2 a18 18 0 0 1 11 32 v7 h-22 v-7 a18 18 0 0 1 11 -32z" class="kt-org__bulbglass" />
      <path d="M144 46 h16 M146 51 h12" class="kt-org__socket" />
      <path d="M147 26 l5 -6 l5 6" class="kt-org__filament" />
    </g>

    <!-- not by topic: the Dewey shelf, struck out -->
    <g class="kt-org__part" :class="{ 'is-on': at(2.3) }">
      <rect x="34" y="170" width="18" height="76" rx="2" class="kt-org__spine" />
      <rect x="56" y="180" width="16" height="66" rx="2" class="kt-org__spine" />
      <rect x="76" y="166" width="20" height="80" rx="2" class="kt-org__spine" />
      <rect x="100" y="176" width="16" height="70" rx="2" class="kt-org__spine" />
      <path d="M24 248 h112" class="kt-org__shelf" />
      <text x="80" y="272" text-anchor="middle" class="kt-org__dewey">150 · Psychology</text>
    </g>
    <g class="kt-org__part" :class="{ 'is-on': at(2.7) }">
      <path d="M28 166 L132 252 M132 166 L28 252" class="kt-org__strike" />
      <text x="80" y="296" text-anchor="middle" class="kt-org__no">not by topic</text>
    </g>

    <!-- the questions, the folders: empty until something lands -->
    <g v-for="(s, i) in steps" :key="s.name" class="kt-org__part" :class="{ 'is-on': at(shownAt(i)), 'is-caught': at(s.catchAt), 'is-filed': at(s.fileAt) }">
      <path v-if="i === 0" d="M162 82 H 182 m-8 -7 l8 7 -8 7" class="kt-org__arrow" />
      <template v-if="s.q">
        <rect :x="s.cx - 65" y="62" width="130" height="40" rx="20" class="kt-org__q" />
        <text :x="s.cx" y="88" text-anchor="middle" class="kt-org__qtext">{{ s.q }}</text>
        <path :d="`M${s.cx} 104 V 152 m-7 -8 l7 8 7 -8`" class="kt-org__arrow is-yes" />
        <text :x="s.cx + 10" y="134" class="kt-org__yn is-yes">yes</text>
      </template>
      <path v-if="i > 0 && i < 3" :d="`M${steps[i - 1].cx + 67} 82 H ${s.cx - 69} m-8 -7 l8 7 -8 7`" class="kt-org__arrow" />
      <text v-if="i > 0 && i < 3" :x="(steps[i - 1].cx + s.cx) / 2" y="72" text-anchor="middle" class="kt-org__yn">no</text>
      <template v-if="i === 3">
        <path d="M697 82 H 800 V 152 m-7 -8 l7 8 7 -8" class="kt-org__arrow" />
        <text x="742" y="72" text-anchor="middle" class="kt-org__yn">no</text>
      </template>

      <path :d="`M${s.cx - 75} 160 h45 l10 12 h95 v134 h-150z`" class="kt-org__fold" :class="{ 'is-cold': i === 3 }" />
      <text :x="s.cx" y="204" text-anchor="middle" class="kt-org__name">{{ s.name }}</text>
      <text :x="s.cx" y="226" text-anchor="middle" class="kt-org__rule">{{ s.rule }}</text>
      <text v-if="s.ex" :x="s.cx" y="266" text-anchor="middle" class="kt-org__ex" :class="{ 'is-cold': i === 3 }">{{ s.ex }}</text>
      <text v-if="s.why" :x="s.cx" y="288" text-anchor="middle" class="kt-org__ex kt-org__why">{{ s.why }}</text>
    </g>

    <!-- the travellers -->
    <g class="kt-org__note" :class="{ 'is-on': at(5.0), 'is-filed': at(6.3) }" :transform="place(ideaStops, 0.7)">
      <rect x="-13" y="-16" width="26" height="32" rx="3" class="kt-org__ndoc" />
      <path d="M-6 -6 h12 M-6 0 h12 M-6 6 h8" class="kt-org__nlines" />
    </g>
    <g class="kt-org__note is-voice" :class="{ 'is-on': at(7.6), 'is-filed': at(9.1) }" :transform="place(voiceStops, 0.7)">
      <rect x="-13" y="-16" width="26" height="32" rx="3" class="kt-org__ndoc" />
      <path d="M-6 -6 h12 M-6 0 h12 M-6 6 h8" class="kt-org__nlines" />
    </g>
    <g v-for="(b, i) in books" :key="b.href" class="kt-org__book" :class="{ 'is-on': at(9.7 + i * bookStep) }" :transform="place(bookStops(i, b.fx))">
      <image :href="b.href" :x="-b.w / 2" y="-22" :width="b.w" height="44" preserveAspectRatio="xMidYMid slice" :transform="`rotate(${b.r})`" />
    </g>

    <text x="440" y="332" text-anchor="middle" class="kt-org__tag kt-org__part" :class="{ 'is-on': at(12.6) }">where it's going, not where it came from</text>
  </svg>
</template>

<style>
.kt-org {
  width: 880px;
  height: auto;
  font-family: var(--font-family-sans);
}

.kt-org__part {
  opacity: 0;
  transition: opacity 0.45s;
}

.kt-org__part.is-on { opacity: 1; }

/* the idea, drawn like TrainOffline's: person, yellow thought, bulb */
.kt-org__person { fill: var(--kt-tint-neutral); stroke: var(--kt-c-primary-soft); stroke-width: 2.5; }
.kt-org__thought { fill: color-mix(in srgb, var(--kt-warn) 12%, var(--kt-bg)); stroke: var(--kt-warn); stroke-width: 2; }
.kt-org.is-noted .kt-org__who { opacity: 0; }

.kt-org__bulb {
  opacity: 0;
  transform-box: fill-box;
  transform-origin: 50% 70%;
  transform: scale(0.3);
  transition: opacity 0.2s, transform 0.45s cubic-bezier(0.3, 1.8, 0.5, 1);
}

.kt-org__bulb.is-on { opacity: 1; transform: none; }
.kt-org.is-noted .kt-org__bulb { opacity: 0; transition: opacity 0.45s; }
.kt-org__glow-in { stop-color: var(--kt-warn); stop-opacity: 0.55; }
.kt-org__glow-out { stop-color: var(--kt-warn); stop-opacity: 0; }
.kt-org__bulbglass { fill: color-mix(in srgb, var(--kt-warn) 30%, var(--kt-bg)); stroke: var(--kt-warn); stroke-width: 2.5; stroke-linejoin: round; }
.kt-org__socket { stroke: var(--kt-line-strong); stroke-width: 2.5; stroke-linecap: round; }
.kt-org__filament { fill: none; stroke: var(--kt-warn); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

/* the thought cloud squares off into a note */
.kt-org__daily {
  rx: 26px;
  fill: color-mix(in srgb, var(--kt-warn) 12%, var(--kt-bg));
  stroke: var(--kt-warn);
  stroke-width: 2;
  transition: rx 0.5s, fill 0.5s, stroke 0.5s;
}

.kt-org.is-noted .kt-org__daily { rx: 8px; fill: var(--kt-tint-primary); stroke: var(--kt-c-primary); }

.kt-org__file { font: 12px var(--font-family-mono); fill: var(--kt-subtle); opacity: 0; transition: opacity 0.45s 0.3s; }
.kt-org.is-noted .kt-org__file { opacity: 1; }
.kt-org__idea { font: 700 14px var(--font-family-mono); fill: var(--kt-warn); }
.kt-org__voice { font: 700 12.5px var(--font-family-mono); fill: var(--kt-heading); }
.kt-org__done { font: 700 14px var(--font-family-mono); fill: var(--kt-good); }

/* the daily note's entries: in, then gone when they set off */
.kt-org__entry { transition: opacity 0.35s; }
.kt-org__entry.is-gone { opacity: 0; }
.kt-org__entry.is-later { opacity: 0; }
.kt-org__entry.is-in { opacity: 1; }
.kt-org__entry.is-in.is-gone { opacity: 0; }

.kt-org__spine { fill: var(--kt-tint-neutral); stroke: var(--kt-line-strong); stroke-width: 1.5; }
.kt-org__shelf { stroke: var(--kt-line-strong); stroke-width: 3; stroke-linecap: round; }
.kt-org__dewey { font: 13px var(--font-family-mono); fill: var(--kt-subtle); }
.kt-org__strike { stroke: var(--kt-warn); stroke-width: 4; stroke-linecap: round; }
.kt-org__no { font: 600 15px var(--font-family-mono); fill: var(--kt-warn); }

.kt-org__q {
  fill: var(--kt-card);
  stroke: var(--kt-line-strong);
  stroke-width: 2;
  transition: fill 0.4s, stroke 0.4s;
}

/* the catch: the idea is a project, green all the way down */
.is-caught > .kt-org__q { fill: var(--kt-tint-success); stroke: var(--kt-good); }
.kt-org__qtext { font: 600 16px var(--font-family-mono); fill: var(--kt-heading); }

.kt-org__arrow {
  fill: none;
  stroke: var(--kt-c-primary-soft);
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: stroke 0.4s;
}

.is-caught > .kt-org__arrow.is-yes { stroke: var(--kt-good); }

.kt-org__yn { font: 13px var(--font-family-mono); fill: var(--kt-subtle); transition: fill 0.4s; }
.is-caught > .kt-org__yn.is-yes { fill: var(--kt-good); }

.kt-org__fold {
  fill: var(--kt-tint-primary);
  stroke: var(--kt-c-primary);
  stroke-width: 2.5;
  stroke-linejoin: round;
  transition: fill 0.4s, stroke 0.4s;
}

.kt-org__fold.is-cold { fill: var(--kt-tint-neutral); stroke: var(--kt-line-strong); }
.is-caught.is-filed > .kt-org__fold { fill: var(--kt-tint-success); stroke: var(--kt-good); }

.kt-org__name { font-size: 21px; font-weight: 800; fill: var(--kt-heading); }
.kt-org__rule { font: 13px var(--font-family-mono); fill: var(--kt-hot); }
.kt-org__ex { font-size: 15px; font-weight: 700; fill: var(--kt-good); opacity: 0; transition: opacity 0.4s; }
.kt-org__ex.is-cold { font-weight: 400; fill: var(--kt-fg); }
.is-filed > .kt-org__ex { opacity: 1; }
.kt-org__why { font: 12px var(--font-family-mono); fill: var(--kt-subtle); }

/* the travellers: the idea (yellow), the second note, the books */
.kt-org__note,
.kt-org__book { opacity: 0; transition: opacity 0.3s; }
.kt-org__note.is-on,
.kt-org__book.is-on { opacity: 1; }

.kt-org__ndoc { fill: color-mix(in srgb, var(--kt-warn) 12%, var(--kt-bg)); stroke: var(--kt-warn); stroke-width: 2; transition: fill 0.4s, stroke 0.4s; }
.kt-org__nlines { stroke: var(--kt-warn); stroke-width: 2.5; stroke-linecap: round; transition: stroke 0.4s; }
.kt-org__note.is-voice .kt-org__ndoc { fill: var(--kt-card); stroke: var(--kt-c-primary-soft); }
.kt-org__note.is-voice .kt-org__nlines { stroke: var(--kt-c-primary-soft); }
.kt-org__note.is-filed .kt-org__ndoc { fill: var(--kt-tint-success); stroke: var(--kt-good); }
.kt-org__note.is-filed .kt-org__nlines { stroke: var(--kt-good); }

.kt-org__tag { font: 600 16px var(--font-family-mono); fill: var(--kt-hot); }
</style>
