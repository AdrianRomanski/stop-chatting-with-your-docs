<script setup lang="ts">
import { computed } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * The bookend to TrainOffline, in three beats on the same PKP Intercity laptop:
 * 1. offline: "no internet"; Gemma 4B asks "Why does highlighting go inside the bold?", I answer
 *    in my own words, "covered · offline"
 * 2. the train Wi-Fi comes back, a green chip counting down from 5 minutes; the chat dims, Argon
 *    judges ("judging…"), then "pass ✓ · next review in 7 days" (the ladder's first Tier 2 step)
 * 3. the Wi-Fi drops again ("no internet. again."): I was already judged
 * Beside it, the doubt from slide 4, "How can I know that I understand it?", is struck through and
 * answered: "I explain it." A dramatization of the loop, not a recorded session. Plays once.
 */
const { t, at } = useTimeline(8)
const poles = [0, 1, 2]

const WIFI_ON = 3.4
const WIFI_OFF = 5.9
const online = computed(() => at(WIFI_ON) && !at(WIFI_OFF))
// the train Wi-Fi's five minutes, running fast
const left = computed(() => {
  const s = Math.max(0, Math.round(300 - Math.max(0, t.value - WIFI_ON) * 48))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
})
</script>

<template>
  <svg class="kt-btrain" viewBox="0 0 880 320" role="img"
    aria-label="Back on the train, no internet. Gemma 4B asks offline: why does highlighting go inside the bold? I answer: each layer keeps only the best of the one before. Covered, offline. Then the train Wi-Fi comes back for five minutes: Argon judges, pass, next review in 7 days. The Wi-Fi drops again. The question from the start, how can I know that I understand it, is answered: I explain it.">
    <defs>
      <clipPath id="kt-btrain-window">
        <rect x="10" y="40" width="230" height="200" rx="30" />
      </clipPath>
    </defs>

    <!-- the train window, rolling -->
    <g class="kt-btrain__part" :class="{ 'is-on': at(0.1) }">
      <rect x="10" y="40" width="230" height="200" rx="30" class="kt-btrain__window" />
      <g clip-path="url(#kt-btrain-window)">
        <g class="kt-btrain__hills">
          <path d="M0 210 q 60 -50 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 V 260 H 0 z" class="kt-btrain__hill" />
        </g>
        <g v-for="p in poles" :key="p" class="kt-btrain__pole" :style="{ animationDelay: `${-p * 1.1}s` }">
          <path d="M280 90 v 160 M270 100 h 20" />
        </g>
      </g>
      <rect x="25" y="252" width="200" height="32" rx="8" class="kt-btrain__plate" />
      <image href="/images/logos/pkp-intercity.png" x="35" y="256" width="180" height="24" />
    </g>

    <!-- the laptop -->
    <g class="kt-btrain__part" :class="{ 'is-on': at(0.3) }">
      <rect x="268" y="30" width="340" height="230" rx="12" class="kt-btrain__screen" />
      <path d="M248 260 h 380 l -18 18 h -344 z" class="kt-btrain__base" />
    </g>

    <!-- the connection chip: no internet → Wi-Fi, 5 minutes → no internet. again. -->
    <g class="kt-btrain__state" :class="{ 'is-on': at(0.6) && !at(WIFI_ON) }">
      <rect x="286" y="44" width="124" height="26" rx="13" class="kt-btrain__nonet" />
      <path d="M299 51 l12 12 M311 51 l-12 12" class="kt-btrain__x" />
      <text x="320" y="62" class="kt-btrain__nonettext">no internet</text>
    </g>
    <g class="kt-btrain__state" :class="{ 'is-on': online }">
      <rect x="286" y="44" width="150" height="26" rx="13" class="kt-btrain__wifi" />
      <path d="M298 55 a 11 11 0 0 1 16 0 M301 59 a 6 6 0 0 1 10 0" class="kt-btrain__arc" />
      <circle cx="306" cy="63" r="2" class="kt-btrain__arcdot" />
      <text x="322" y="62" class="kt-btrain__wifitext">Wi-Fi · {{ left }}</text>
    </g>
    <g class="kt-btrain__state" :class="{ 'is-on': at(WIFI_OFF) }">
      <rect x="286" y="44" width="176" height="26" rx="13" class="kt-btrain__nonet" />
      <path d="M299 51 l12 12 M311 51 l-12 12" class="kt-btrain__x" />
      <text x="320" y="62" class="kt-btrain__nonettext">no internet. again.</text>
    </g>
    <g class="kt-btrain__state" :class="{ 'is-on': at(0.6) && !at(WIFI_ON) }">
      <image href="/images/logos/gemma-mark.png" x="502" y="47" width="18" height="18" />
      <text x="526" y="61" class="kt-btrain__model">Gemma 4B</text>
    </g>

    <!-- beat 1: sparring, offline (dims when the judge takes over) -->
    <g class="kt-btrain__chat" :class="{ 'is-dim': at(WIFI_ON + 0.3) }">
      <g class="kt-btrain__pop" :class="{ 'is-on': at(1.0) }">
        <rect x="286" y="84" width="250" height="52" rx="12" class="kt-btrain__ask" />
        <text x="300" y="106" class="kt-btrain__asktext">Why does highlighting go</text>
        <text x="300" y="125" class="kt-btrain__asktext">inside the bold?</text>
      </g>
      <g class="kt-btrain__pop" :class="{ 'is-on': at(1.9) }">
        <rect x="340" y="148" width="250" height="52" rx="12" class="kt-btrain__me" />
        <text x="354" y="170" class="kt-btrain__metext">Each layer keeps only the</text>
        <text x="354" y="189" class="kt-btrain__metext">best of the one before.</text>
      </g>
      <g class="kt-btrain__pop" :class="{ 'is-on': at(2.6) }">
        <rect x="286" y="214" width="190" height="30" rx="15" class="kt-btrain__ok" />
        <path d="M302 229 l5 5 l10 -11" class="kt-btrain__tick" />
        <text x="324" y="234" class="kt-btrain__oktext">covered · offline</text>
      </g>
    </g>

    <!-- beat 2: five minutes of Wi-Fi, the judge -->
    <g class="kt-btrain__pop" :class="{ 'is-on': at(WIFI_ON + 0.4) }">
      <rect x="306" y="96" width="264" height="124" rx="14" class="kt-btrain__judge" />
      <image href="/images/logos/gemini-mark.png" x="324" y="112" width="24" height="24" />
      <text x="356" y="130" class="kt-btrain__judgename">Argon</text>
      <text x="554" y="130" text-anchor="end" class="kt-btrain__judgeby">blind judge</text>
      <text x="324" y="172" class="kt-btrain__judging" :class="{ 'is-gone': at(WIFI_ON + 1.4) }">judging<tspan class="kt-btrain__dots">…</tspan></text>
      <g class="kt-btrain__verdict" :class="{ 'is-on': at(WIFI_ON + 1.4) }">
        <text x="324" y="172" class="kt-btrain__pass">pass ✓</text>
        <text x="324" y="200" class="kt-btrain__next">next review in 7 days</text>
      </g>
    </g>

    <!-- the doubt from the start, answered -->
    <g class="kt-btrain__part" :class="{ 'is-on': at(6.3) }">
      <text x="760" y="92" text-anchor="middle" class="kt-btrain__doubt">How can I know</text>
      <text x="760" y="116" text-anchor="middle" class="kt-btrain__doubt">that I understand it?</text>
      <path d="M680 85 H 842" class="kt-btrain__strike" :class="{ 'is-on': at(6.9) }" />
      <path d="M664 109 H 856" class="kt-btrain__strike" :class="{ 'is-on': at(6.9) }" />
    </g>
    <g class="kt-btrain__pop" :class="{ 'is-on': at(7.3) }">
      <text x="760" y="176" text-anchor="middle" class="kt-btrain__answer">I explain it.</text>
      <text x="760" y="210" text-anchor="middle" class="kt-btrain__offline">offline, then judged</text>
    </g>
  </svg>
</template>

<style>
.kt-btrain {
  width: 880px;
  height: auto;
  overflow: visible;
  font-family: var(--font-family-sans);
}

.kt-btrain__part {
  opacity: 0;
  transition: opacity 0.4s;
}

.kt-btrain__part.is-on { opacity: 1; }

.kt-btrain__state { opacity: 0; transition: opacity 0.25s; }
.kt-btrain__state.is-on { opacity: 1; }

.kt-btrain__chat { transition: opacity 0.5s; }
.kt-btrain__chat.is-dim { opacity: 0.12; }

/* Wi-Fi, five minutes */
.kt-btrain__wifi { fill: var(--kt-tint-success); stroke: var(--kt-good); stroke-width: 1.5; }
.kt-btrain__arc { fill: none; stroke: var(--kt-good); stroke-width: 2.2; stroke-linecap: round; }
.kt-btrain__arcdot { fill: var(--kt-good); }
.kt-btrain__wifitext { font: 700 12px var(--font-family-mono); fill: var(--kt-good); font-variant-numeric: tabular-nums; }

/* the judge */
.kt-btrain__judge {
  fill: var(--kt-code-bg);
  stroke: var(--kt-c-secondary);
  stroke-width: 2;
  filter: drop-shadow(0 0 16px color-mix(in srgb, var(--kt-c-secondary) 45%, transparent));
}
.kt-btrain__judgename { font-size: 19px; font-weight: 800; fill: var(--kt-heading); }
.kt-btrain__judgeby { font: 600 11px var(--font-family-mono); fill: var(--kt-muted); }
.kt-btrain__judging { font: 700 18px var(--font-family-mono); fill: var(--kt-muted); transition: opacity 0.2s; }
.kt-btrain__judging.is-gone { opacity: 0; }
.kt-btrain__dots { animation: kt-btrain-blink 0.8s steps(2) infinite; }
@keyframes kt-btrain-blink { 50% { opacity: 0; } }
.kt-btrain__verdict { opacity: 0; transition: opacity 0.3s; }
.kt-btrain__verdict.is-on { opacity: 1; }
.kt-btrain__pass { font-size: 26px; font-weight: 800; fill: var(--kt-good); }
.kt-btrain__next { font: 600 13px var(--font-family-mono); fill: var(--kt-cool); }

.kt-btrain__pop {
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
  transform: translateY(8px);
  transition: opacity 0.35s, transform 0.45s cubic-bezier(0.2, 0.9, 0.3, 1.2);
}

.kt-btrain__pop.is-on { opacity: 1; transform: none; }

/* the train, as in TrainOffline */
.kt-btrain__window { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 3; }
.kt-btrain__hill { fill: var(--kt-tint-primary); stroke: var(--kt-line); stroke-width: 2; }
.kt-btrain__hills { animation: kt-btrain-slide 6s linear infinite; }
.kt-btrain__pole { animation: kt-btrain-pole 3.3s linear infinite; }
.kt-btrain__pole path { fill: none; stroke: var(--kt-line-strong); stroke-width: 3; stroke-linecap: round; }

@keyframes kt-btrain-slide { to { transform: translateX(-240px); } }
@keyframes kt-btrain-pole { from { transform: translateX(0); } to { transform: translateX(-340px); } }

/* the laptop */
.kt-btrain__plate { fill: var(--kt-fg); }
.kt-btrain__screen { fill: var(--kt-code-bg); stroke: var(--kt-line-strong); stroke-width: 2.5; }
.kt-btrain__base { fill: var(--kt-tint-neutral); stroke: var(--kt-line-strong); stroke-width: 2; }
.kt-btrain__nonet { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); stroke-width: 1.5; }
.kt-btrain__x { stroke: var(--kt-hot); stroke-width: 2.5; stroke-linecap: round; }
.kt-btrain__nonettext { font: 700 12px var(--font-family-mono); fill: var(--kt-hot); }
.kt-btrain__model { font: 700 12px var(--font-family-mono); fill: var(--kt-cool); }

.kt-btrain__ask { fill: var(--kt-tint-primary); stroke: var(--kt-c-primary); stroke-width: 1.5; }
.kt-btrain__asktext { font-size: 15px; font-weight: 700; fill: var(--kt-heading); }
.kt-btrain__me { fill: var(--kt-tint-secondary); stroke: var(--kt-line-strong); stroke-width: 1.5; }
.kt-btrain__metext { font-size: 15px; font-weight: 600; fill: var(--kt-fg); }

.kt-btrain__ok { fill: var(--kt-tint-success); stroke: var(--kt-good); stroke-width: 1.5; }
.kt-btrain__tick { fill: none; stroke: var(--kt-good); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
.kt-btrain__oktext { font: 700 13px var(--font-family-mono); fill: var(--kt-good); }

/* the doubt, struck; the answer */
.kt-btrain__doubt { font-size: 21px; font-weight: 700; fill: var(--kt-muted); }
.kt-btrain__strike {
  stroke: var(--kt-hot);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 180;
  stroke-dashoffset: 180;
  transition: stroke-dashoffset 0.4s ease-out;
}
.kt-btrain__strike.is-on { stroke-dashoffset: 0; }
.kt-btrain__answer { font-size: 34px; font-weight: 800; fill: var(--kt-heading); }
.kt-btrain__offline { font: 800 16px var(--font-family-mono); letter-spacing: 0.08em; fill: var(--kt-good); }

@media (prefers-reduced-motion: reduce) {
  .kt-btrain__hills,
  .kt-btrain__pole { animation: none !important; }
}
</style>
