<script setup lang="ts">
import { computed, useId } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * The closing meme, drawn: Code Monkey vs Gigachad, two panels.
 * Left (the trap, secondary): an AI box pours finished summaries into a monkey's open mouth;
 * the "read" bar fills up, the "recalled" bar stays empty: nothing (no numbers, it's a gag).
 * Then the flip: the monkey's panel greys out, a VS badge pops in the middle.
 * Right (primary): the Gigachad photo (public/images/memes/giga-chad.webp, Sleek'N'Tears) in a
 * circle; the AI fires "?" challenges at him, a ring of connections links up around his head one
 * node at a time, the panel glows, sparks twinkle and pixel "deal with it" shades drop on.
 * Last, the payoff of "Never outsource synthesis" (slide 7) lands under both: "Don't outsource
 * your understanding".
 */
const { t, at } = useTimeline(5)
const uid = useId()
const pour = `kt-mchad-pour-${uid}`
const ask = `kt-mchad-ask-${uid}`
// the read bar fills while the summaries pour in (0 → 1 between 0.6 s and 1.6 s)
const read = computed(() => Math.min(1, Math.max(0, (t.value - 0.6) / 1.0)))
const sparks = [
  { x: 520, y: 70, d: 0 }, { x: 772, y: 160, d: 0.6 }, { x: 510, y: 236, d: 1.1 },
  { x: 790, y: 236, d: 0.3 }, { x: 640, y: 30, d: 0.9 },
]
const chips = [0, 1, 2]
const ring = [
  { x: 556, y: 206 }, { x: 536, y: 150 }, { x: 552, y: 88 }, { x: 598, y: 50 },
  { x: 682, y: 50 }, { x: 728, y: 88 }, { x: 744, y: 150 }, { x: 724, y: 206 },
]
const links = ring.slice(1).map((n, i) => `M${ring[i].x} ${ring[i].y} L${n.x} ${n.y}`)
</script>

<template>
  <div class="kt-mchadwrap">
  <svg class="kt-mchad" :class="{ 'is-flip': at(1.7), 'is-chad': at(3.4) }" viewBox="0 0 880 340" role="img"
    aria-label="Code Monkey: an AI pours summaries into a monkey; read fills up, recalled stays at nothing. Versus Gigachad: the AI fires questions at him, connections link up around his head and sunglasses drop on. Don't outsource your understanding.">
    <defs>
      <clipPath :id="`kt-mchad-face-${uid}`">
        <circle cx="640" cy="140" r="80" />
      </clipPath>
      <linearGradient :id="`kt-mchad-glow-${uid}`" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" class="kt-mchad__g1" />
        <stop offset="100%" class="kt-mchad__g2" />
      </linearGradient>
    </defs>

    <!-- ── left: the code monkey (greys out at the flip) ── -->
    <g class="kt-mchad__side is-trap">
    <rect x="10" y="10" width="414" height="320" rx="16" class="kt-mchad__panel is-trap" />
    <text x="30" y="40" class="kt-mchad__title is-trap">code monkey</text>

    <!-- ── left: the code monkey ── -->
    <path :id="pour" d="M132 80 C 190 66, 232 70, 232 110" class="kt-mchad__wire is-trap" :class="{ 'is-on': at(0.5) }" />
    <g class="kt-mchad__in" :class="{ 'is-on': at(0.1) }">
      <rect x="40" y="60" width="84" height="48" rx="12" class="kt-mchad__ai is-trap" />
      <path d="M58 76 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" class="kt-mchad__spark is-trap" />
      <text x="96" y="91" text-anchor="middle" class="kt-mchad__ainame">AI</text>
    </g>

    <g class="kt-mchad__in" :class="{ 'is-on': at(0.3) }">
      <!-- ears -->
      <circle cx="166" cy="186" r="24" class="kt-mchad__fur" />
      <circle cx="294" cy="186" r="24" class="kt-mchad__fur" />
      <circle cx="166" cy="186" r="12" class="kt-mchad__skin" />
      <circle cx="294" cy="186" r="12" class="kt-mchad__skin" />
      <!-- head, tuft -->
      <circle cx="230" cy="190" r="62" class="kt-mchad__fur" />
      <!-- face -->
      <circle cx="212" cy="178" r="23" class="kt-mchad__skin" />
      <circle cx="248" cy="178" r="23" class="kt-mchad__skin" />
      <ellipse cx="230" cy="216" rx="40" ry="28" class="kt-mchad__skin" />
      <!-- eyes: wide, looking up at the next summary -->
      <circle cx="212" cy="176" r="9" class="kt-mchad__eye" />
      <circle cx="248" cy="176" r="9" class="kt-mchad__eye" />
      <circle cx="214" cy="171" r="4" class="kt-mchad__pupil" />
      <circle cx="246" cy="171" r="4" class="kt-mchad__pupil" />
      <circle cx="224" cy="204" r="2.5" class="kt-mchad__pupil" />
      <circle cx="236" cy="204" r="2.5" class="kt-mchad__pupil" />
      <!-- mouth agape -->
      <ellipse cx="230" cy="224" rx="15" ry="10" class="kt-mchad__mouth" />
      <!-- the funnel on top -->
      <path d="M200 110 L264 110 L240 134 L240 142 L224 142 L224 134 Z" class="kt-mchad__funnel" />
    </g>

    <!-- summaries, poured in, forever -->
    <g v-for="c in chips" :key="`s${c}`" class="kt-mchad__chip" :class="{ 'is-on': at(0.6 + c * 0.2) }">
      <g>
        <rect x="-12" y="-15" width="24" height="30" rx="3" class="kt-mchad__sum" />
        <path d="M-6 -6 h12 M-6 0 h12 M-6 6 h8" class="kt-mchad__lines" />
        <animateMotion dur="1.2s" :begin="`${c * 0.4}s`" repeatCount="indefinite">
          <mpath :href="`#${pour}`" />
        </animateMotion>
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.75;1" dur="1.2s" :begin="`${c * 0.4}s`" repeatCount="indefinite" />
      </g>
    </g>

    <!-- read fills, recalled stays empty -->
    <g class="kt-mchad__in" :class="{ 'is-on': at(0.6) }">
      <text x="336" y="146" class="kt-mchad__label">read</text>
      <rect x="336" y="156" width="70" height="12" rx="6" class="kt-mchad__track" />
      <rect x="336" y="156" :width="Math.max(12, 70 * read)" height="12" rx="6" class="kt-mchad__fill" />
      <text x="336" y="210" class="kt-mchad__label">recalled</text>
      <rect x="336" y="220" width="70" height="12" rx="6" class="kt-mchad__track" />
      <text x="336" y="256" class="kt-mchad__nothing" :class="{ 'is-on': at(1.3) }">nothing</text>
    </g>

    <text x="217" y="304" text-anchor="middle" class="kt-mchad__cap is-trap" :class="{ 'is-on': at(1.2) }">AI produces conclusions for you</text>
    </g>

    <!-- VS -->
    <g class="kt-mchad__vs" :class="{ 'is-on': at(1.8) }">
      <circle cx="440" cy="170" r="30" :fill="`url(#kt-mchad-glow-${uid})`" />
      <text x="440" y="179" text-anchor="middle" class="kt-mchad__vstext">VS</text>
    </g>

    <!-- ── right: the gigachad ── -->
    <rect x="456" y="10" width="414" height="320" rx="16" class="kt-mchad__panel is-good" />
    <text x="476" y="40" class="kt-mchad__title is-good">gigachad</text>

    <circle cx="640" cy="150" r="86" class="kt-mchad__halo" :class="{ 'is-on': at(3.2) }" />

    <path v-for="(d, i) in links" :key="`l${i}`" :d="d" class="kt-mchad__link" :class="{ 'is-on': at(2.4 + i * 0.3) }" />
    <g v-for="(n, i) in ring" :key="`n${i}`" class="kt-mchad__in" :class="{ 'is-on': at(2.2 + i * 0.3) }">
      <circle :cx="n.x" :cy="n.y" r="10" class="kt-mchad__node" />
    </g>

    <!-- the chad: the Gigachad photo in the ring -->
    <g class="kt-mchad__in kt-mchad__me" :class="{ 'is-on': at(1.6) }">
      <circle cx="640" cy="140" r="84" class="kt-mchad__photoring" />
      <image href="/images/memes/giga-chad.webp" x="496" y="32" width="288" height="332" :clip-path="`url(#kt-mchad-face-${uid})`" />
    </g>

    <!-- deal with it: the shades drop once the connections are made -->
    <g transform="translate(613 121) rotate(-15) scale(0.62)">
      <g class="kt-mchad__shades" :class="{ 'is-on': at(3.5) }">
        <rect x="-50" y="-9" width="100" height="6" class="kt-mchad__shade" />
        <rect x="-48" y="-4" width="40" height="17" class="kt-mchad__shade" />
        <rect x="8" y="-4" width="40" height="17" class="kt-mchad__shade" />
        <rect x="-8" y="-4" width="16" height="5" class="kt-mchad__shade" />
        <rect x="-42" y="0" width="6" height="4" class="kt-mchad__glint" />
        <rect x="-36" y="4" width="6" height="4" class="kt-mchad__glint" />
        <rect x="14" y="0" width="6" height="4" class="kt-mchad__glint" />
        <rect x="20" y="4" width="6" height="4" class="kt-mchad__glint" />
      </g>
    </g>

    <path :id="ask" d="M786 108 C 768 116, 748 116, 728 118" class="kt-mchad__wire is-good" :class="{ 'is-on': at(2) }" />
    <g class="kt-mchad__in" :class="{ 'is-on': at(1.8) }">
      <rect x="770" y="60" width="84" height="48" rx="12" class="kt-mchad__ai is-good" />
      <path d="M788 76 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" class="kt-mchad__spark is-good" />
      <text x="826" y="91" text-anchor="middle" class="kt-mchad__ainame">AI</text>
    </g>
    <g v-for="c in [0, 1]" :key="`q${c}`" class="kt-mchad__chip" :class="{ 'is-on': at(2) }">
      <g>
        <circle r="14" class="kt-mchad__q" />
        <text y="6" text-anchor="middle" class="kt-mchad__qtext">?</text>
        <animateMotion dur="2s" :begin="`${c}s`" repeatCount="indefinite">
          <mpath :href="`#${ask}`" />
        </animateMotion>
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.2;0.75;1" dur="2s" :begin="`${c}s`" repeatCount="indefinite" />
      </g>
    </g>

    <!-- sparks, once the connections are made -->
    <g v-for="(sp, i) in sparks" :key="`sp${i}`" :transform="`translate(${sp.x} ${sp.y})`">
      <g class="kt-mchad__spk" :class="{ 'is-on': at(3.4) }" :style="{ animationDelay: `${sp.d}s` }">
        <path d="M0 -9 L2.2 -2.2 L9 0 L2.2 2.2 L0 9 L-2.2 2.2 L-9 0 L-2.2 -2.2 Z" class="kt-mchad__star" />
      </g>
    </g>

    <text x="663" y="296" text-anchor="middle" class="kt-mchad__cap is-good" :class="{ 'is-on': at(3.6) }">AI stores, retrieves and tests</text>
    <text x="663" y="320" text-anchor="middle" class="kt-mchad__cap is-good is-sub" :class="{ 'is-on': at(3.9) }">your brain builds the connections</text>
  </svg>

  <!-- the payoff -->
  <div class="kt-mchad__punch" :class="{ 'is-on': at(4.6) }">
    Don't outsource your <span>understanding</span>
  </div>
  </div>
</template>

<style>
.kt-mchadwrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.kt-mchad {
  width: 800px;
  height: auto;
  overflow: visible;
  font-family: var(--font-family-sans);
}

/* the flip: the monkey's side greys out */
.kt-mchad__side { transition: opacity 0.7s, filter 0.7s; }
.kt-mchad.is-flip .kt-mchad__side.is-trap { opacity: 0.42; filter: grayscale(1); }

.kt-mchad__panel { stroke-width: 2; }
.kt-mchad__panel.is-trap { fill: var(--kt-tint-secondary); stroke: var(--kt-c-secondary); stroke-opacity: 0.5; }
.kt-mchad__panel.is-good {
  fill: var(--kt-tint-primary);
  stroke: var(--kt-c-primary);
  transition: filter 0.8s, stroke-width 0.8s;
}
.kt-mchad.is-chad .kt-mchad__panel.is-good {
  stroke-width: 3;
  filter: drop-shadow(0 0 18px color-mix(in srgb, var(--kt-c-primary) 70%, transparent));
}

/* VS */
.kt-mchad__g1 { stop-color: var(--kt-hot); }
.kt-mchad__g2 { stop-color: var(--kt-c-primary); }
.kt-mchad__vs {
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
  transform: scale(0.2) rotate(-30deg);
  transition: opacity 0.2s, transform 0.55s cubic-bezier(0.3, 1.8, 0.5, 1);
}
.kt-mchad__vs.is-on { opacity: 1; transform: none; filter: drop-shadow(0 0 14px color-mix(in srgb, var(--kt-hot) 60%, transparent)); }
.kt-mchad__vstext { font-size: 22px; font-weight: 900; letter-spacing: 0.04em; fill: var(--kt-heading); }

/* read fills, recalled stays empty */
.kt-mchad__track { fill: var(--kt-tint-neutral); stroke: var(--kt-line-strong); stroke-width: 1.5; }
.kt-mchad__fill { fill: var(--kt-fg); }
.kt-mchad__nothing { font: 800 16px var(--font-family-mono); fill: var(--kt-bad); opacity: 0; transition: opacity 0.3s; }
.kt-mchad__nothing.is-on { opacity: 1; }

/* sparks */
.kt-mchad__spk { opacity: 0; transform-box: fill-box; transform-origin: center; }
.kt-mchad__spk.is-on { animation: kt-mchad-twinkle 1.8s ease-in-out infinite; }
.kt-mchad__star { fill: var(--kt-warn); }

@keyframes kt-mchad-twinkle {
  0%, 100% { opacity: 0; transform: scale(0.4); }
  50% { opacity: 1; transform: scale(1); }
}

/* the payoff */
.kt-mchad__punch {
  font-size: 38px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--kt-heading);
  opacity: 0;
  transform: translateY(14px) scale(0.96);
  transition: opacity 0.5s, transform 0.7s cubic-bezier(0.2, 0.9, 0.3, 1.2);
}
.kt-mchad__punch.is-on { opacity: 1; transform: none; }
.kt-mchad__punch span {
  background: linear-gradient(90deg, var(--kt-hot), var(--kt-c-primary-soft));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.kt-mchad__title {
  font: 15px var(--font-family-mono);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.kt-mchad__title.is-trap { fill: var(--kt-bad); }
.kt-mchad__title.is-good { fill: var(--kt-cool); }

.kt-mchad__in,
.kt-mchad__chip,
.kt-mchad__cap {
  opacity: 0;
  transition: opacity 0.4s;
}

.kt-mchad__in.is-on,
.kt-mchad__cap.is-on { opacity: 1; }
.kt-mchad__chip { visibility: hidden; }
.kt-mchad__chip.is-on { visibility: visible; opacity: 1; }

/* the AI boxes */
.kt-mchad__ai { stroke-width: 2; }
.kt-mchad__ai.is-trap { fill: var(--kt-tint-neutral); stroke: var(--kt-line-strong); }
.kt-mchad__ai.is-good { fill: var(--kt-tint-primary); stroke: var(--kt-c-primary); }
.kt-mchad__spark.is-trap { fill: var(--kt-subtle); }
.kt-mchad__spark.is-good { fill: var(--kt-c-primary-soft); }
.kt-mchad__ainame { font-size: 20px; font-weight: 800; fill: var(--kt-heading); }

.kt-mchad__wire {
  fill: none;
  stroke-width: 2.5;
  stroke-dasharray: 6 7;
  opacity: 0;
  transition: opacity 0.4s;
}

.kt-mchad__wire.is-on { opacity: 1; animation: kt-mchad-flow 1s linear infinite; }
.kt-mchad__wire.is-trap { stroke: var(--kt-line-strong); }
.kt-mchad__wire.is-good { stroke: var(--kt-hot); }

@keyframes kt-mchad-flow {
  to { stroke-dashoffset: -26; }
}

/* the monkey */
.kt-mchad__fur { fill: color-mix(in srgb, var(--kt-c-secondary) 22%, var(--kt-bg)); stroke: var(--kt-c-secondary); stroke-width: 3; }
.kt-mchad__skin { fill: color-mix(in srgb, var(--kt-fg) 30%, color-mix(in srgb, var(--kt-c-secondary) 30%, var(--kt-bg))); stroke: none; }
.kt-mchad__funnel { fill: color-mix(in srgb, var(--kt-fg) 18%, var(--kt-bg)); stroke: var(--kt-line-strong); stroke-width: 2.5; stroke-linejoin: round; }
.kt-mchad__stroke { fill: none; stroke: var(--kt-c-secondary); stroke-width: 3; stroke-linecap: round; }
.kt-mchad__eye { fill: var(--kt-heading); }
.kt-mchad__pupil { fill: var(--kt-bg); }
.kt-mchad__mouth { fill: var(--kt-bg); stroke: var(--kt-c-secondary); stroke-width: 2.5; transform-origin: 230px 224px; transform-box: view-box; }

.kt-mchad__sum { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 1.5; }
.kt-mchad__lines { stroke: var(--kt-subtle); stroke-width: 2.5; stroke-linecap: round; }

.kt-mchad__label { font: 13px var(--font-family-mono); fill: var(--kt-subtle); text-transform: uppercase; letter-spacing: 0.08em; }

/* the chad: me */
.kt-mchad__photoring { fill: var(--kt-card); stroke: var(--kt-c-primary); stroke-width: 4; }
.kt-mchad__shades {
  opacity: 0;
  transform: translateY(-150px);
  transition: opacity 0.15s, transform 0.9s cubic-bezier(0.5, 0, 0.6, 1);
}
.kt-mchad__shades.is-on { opacity: 1; transform: none; }
.kt-mchad__shade { fill: var(--kt-bg); }
.kt-mchad__glint { fill: var(--kt-heading); }

.kt-mchad__halo {
  fill: var(--kt-c-primary);
  opacity: 0;
  transition: opacity 0.6s;
  transform-origin: 640px 150px;
  transform-box: view-box;
}

.kt-mchad__halo.is-on { opacity: 0.16; animation: kt-mchad-pulse 2.6s ease-in-out infinite; }

@keyframes kt-mchad-pulse {
  50% { opacity: 0.3; transform: scale(1.06); }
}

.kt-mchad__node { fill: color-mix(in srgb, var(--kt-c-primary) 25%, var(--kt-bg)); stroke: var(--kt-c-primary); stroke-width: 3; }

.kt-mchad__link {
  stroke: var(--kt-c-primary-soft);
  stroke-width: 3.5;
  stroke-linecap: round;
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  transition: stroke-dashoffset 0.4s ease-out;
}

.kt-mchad__link.is-on { stroke-dashoffset: 0; }

.kt-mchad__q { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); stroke-width: 2; }
.kt-mchad__qtext { font-size: 18px; font-weight: 800; fill: var(--kt-hot); }

.kt-mchad__cap { font-size: 19px; font-weight: 700; }
.kt-mchad__cap.is-trap { fill: var(--kt-bad); }
.kt-mchad__cap.is-good { fill: var(--kt-good); }
.kt-mchad__cap.is-sub { fill: var(--kt-heading); font-weight: 600; }

@media (prefers-reduced-motion: reduce) {
  .kt-mchad__wire.is-on,
  .kt-mchad__halo.is-on,
  .kt-mchad__spk.is-on { animation: none; opacity: 1; }
}
</style>
