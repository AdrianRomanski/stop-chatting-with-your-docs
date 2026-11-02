<script setup lang="ts">
import { useId } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * ai-coach as ports and adapters (ARCHITECTURE.md): a hexagon, "application" with the "domain"
 * hexagon inside it, holding the four coaching styles (feynman, socratic, cornell, devil; domain
 * coaching-style.ts). On the driving side, the terminal and "cli", the composition root, pointing
 * in. On the driven side, the four adapters, each with its logo or icon, plugging into the port it
 * implements (vault-mcp · NotesRepository, VaultFiling; ollama · SparringPartner; gemini · Judge;
 * local-state · PendingJudgements, Clock). Every arrow points inward. Then an arrow tries to point
 * out from the domain to an adapter, turns red with a ✕ and fades: "lint enforces it"
 * (@nx/enforce-module-boundaries). No props.
 */
const { at } = useTimeline(5.2)
const uid = useId()
const id = (name: string) => `kt-clayers-${name}-${uid}`

// flat-top hexagons around (CX, CY)
const CX = 380
const CY = 215
const R = 180
const RI = 100
const H = Math.sqrt(3) / 2
const hex = (r: number) =>
  [[r, 0], [r / 2, r * H], [-r / 2, r * H], [-r, 0], [-r / 2, -r * H], [r / 2, -r * H]]
    .map(([x, y]) => `${CX + x},${CY + y}`).join(' ')
// x of the outer hexagon's right edge at height y
const edgeX = (y: number) => CX + R - (Math.abs(y - CY) / (R * H)) * (R / 2)

// the coaching styles, as chips in a 2 × 2 grid inside the domain
const SW = 70
const styles = ['feynman', 'socratic', 'cornell', 'devil'].map((name, i) => ({
  name,
  x: CX - SW - 3 + (i % 2) * (SW + 6),
  y: 206 + Math.floor(i / 2) * 27,
  on: 0.9 + i * 0.12,
}))

const AX = 690
const AW = 200
const AH = 70
const adapters = [
  { name: 'vault-mcp', tech: 'kb-template', port: 'NotesRepository · VaultFiling', tone: 'local', logo: '/images/logos/pushbased-mark.png' },
  { name: 'ollama', tech: 'Gemma · offline', port: 'SparringPartner', tone: 'local', logo: '/images/logos/gemma-mark.png' },
  { name: 'gemini', tech: 'Argon · online', port: 'Judge', tone: 'cloud', logo: '/images/logos/gemini-mark.png' },
  { name: 'local-state', tech: 'queue · clock', port: 'PendingJudgements · Clock', tone: 'local', logo: '' },
].map((a, i) => {
  const cy = 84 + i * 84
  const ex = edgeX(cy)
  return { ...a, cy, y: cy - AH / 2, ex, lx: (ex + AX) / 2, on: 1.0 + i * 0.15 }
})
</script>

<template>
  <svg class="kt-clayers" viewBox="0 0 900 430" role="img"
    aria-label="Ports and adapters: the application hexagon with the domain inside, holding the four coaching styles: feynman, socratic, cornell, devil. On the driving side the terminal and the cli, the composition root. On the driven side four adapters plug into the application's ports: vault-mcp for kb-template, ollama for Gemma, gemini for Argon, local-state for the queue and the clock. Every arrow points inward; an arrow pointing out from the domain is rejected: lint enforces it.">
    <defs>
      <marker :id="id('head')" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M1 1 L 9 5 L 1 9" class="kt-clayers__head" />
      </marker>
      <marker :id="id('bad')" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M1 1 L 9 5 L 1 9" class="kt-clayers__head is-bad" />
      </marker>
    </defs>

    <!-- side labels -->
    <g class="kt-clayers__part" :class="{ 'is-on': at(0.7) }">
      <text x="95" y="24" text-anchor="middle" class="kt-clayers__side">driving side</text>
    </g>
    <g class="kt-clayers__part" :class="{ 'is-on': at(1.0) }">
      <text :x="AX + AW / 2" y="24" text-anchor="middle" class="kt-clayers__side">driven side</text>
    </g>

    <!-- application -->
    <g class="kt-clayers__part" :class="{ 'is-on': at(0.1) }">
      <polygon :points="hex(R)" class="kt-clayers__hex" />
      <solar-routing-2-bold-duotone :x="CX - 14" y="64" width="26" height="26" class="kt-clayers__icon is-good" />
      <text :x="CX" y="106" text-anchor="middle" class="kt-clayers__name">application</text>
      <text :x="CX" y="121" text-anchor="middle" class="kt-clayers__does">spar · judge · study · file</text>
    </g>

    <!-- domain -->
    <g class="kt-clayers__part" :class="{ 'is-on': at(0.4) }">
      <polygon :points="hex(RI)" class="kt-clayers__hex is-core" />
      <solar-lightbulb-bolt-bold-duotone :x="CX - 11" y="140" width="22" height="22" class="kt-clayers__icon is-good" />
      <text :x="CX" y="180" text-anchor="middle" class="kt-clayers__name is-sm">domain</text>
      <text :x="CX" y="196" text-anchor="middle" class="kt-clayers__does is-sm">rules of learning</text>
      <text :x="CX" y="276" text-anchor="middle" class="kt-clayers__does is-sm">no I/O</text>
    </g>
    <g v-for="st in styles" :key="st.name" class="kt-clayers__part" :class="{ 'is-on': at(st.on) }">
      <rect :x="st.x" :y="st.y" :width="SW" height="22" rx="11" class="kt-clayers__style" />
      <text :x="st.x + SW / 2" :y="st.y + 15" text-anchor="middle" class="kt-clayers__stylename">{{ st.name }}</text>
    </g>

    <!-- driving: terminal → cli → application -->
    <g class="kt-clayers__part" :class="{ 'is-on': at(0.7) }">
      <rect x="10" :y="CY - 45" width="170" height="90" rx="16" class="kt-clayers__box is-app" />
      <solar-file-terminal-bold-duotone x="81" :y="CY - 36" width="28" height="28" class="kt-clayers__icon" />
      <text x="95" :y="CY + 14" text-anchor="middle" class="kt-clayers__name">cli</text>
      <text x="95" :y="CY + 32" text-anchor="middle" class="kt-clayers__does">composition root</text>
    </g>
    <path :d="`M182 ${CY} H ${CX - R - 4}`" class="kt-clayers__wire kt-clayers__part" :class="{ 'is-on': at(0.85) }"
      :marker-end="`url(#${id('head')})`" />

    <!-- driven: each adapter → its port -->
    <g v-for="a in adapters" :key="a.name" class="kt-clayers__part" :class="{ 'is-on': at(a.on) }">
      <path :d="`M${AX - 2} ${a.cy} H ${a.ex + 6}`" class="kt-clayers__wire" :marker-end="`url(#${id('head')})`" />
      <circle :cx="a.ex" :cy="a.cy" r="5" class="kt-clayers__port" />
      <text :x="a.lx" :y="a.cy - 8" text-anchor="middle" class="kt-clayers__portname">{{ a.port }}</text>
      <rect :x="AX" :y="a.y" :width="AW" :height="AH" rx="14" class="kt-clayers__box" :class="`is-${a.tone}`" />
      <image v-if="a.logo" :href="a.logo" :x="AX + 14" :y="a.cy - 13" width="26" height="26" preserveAspectRatio="xMidYMid meet" />
      <solar-history-bold-duotone v-else :x="AX + 13" :y="a.cy - 14" width="28" height="28" class="kt-clayers__icon is-cool" />
      <text :x="AX + 52" :y="a.cy - 2" class="kt-clayers__aname">
        <tspan class="kt-clayers__pre">adapter-</tspan>{{ a.name }}
      </text>
      <text :x="AX + 52" :y="a.cy + 17" class="kt-clayers__tech" :class="`is-${a.tone}`">{{ a.tech }}</text>
    </g>

    <!-- an arrow that points the wrong way: rejected -->
    <g class="kt-clayers__wrong" :class="{ 'is-on': at(2.6), 'is-bad': at(3.0), 'is-gone': at(4.6) }">
      <path :d="`M${CX + RI + 4} ${CY} C ${CX + 200} ${CY}, ${AX - 80} ${CY - 6}, ${AX - 4} ${CY - 18}`"
        class="kt-clayers__up" :marker-end="`url(#${id('bad')})`" />
      <g :transform="`translate(${CX + 200} ${CY - 2})`">
        <circle r="13" class="kt-clayers__x" />
        <path d="M-5 -5 l10 10 M5 -5 l-10 10" class="kt-clayers__xmark" />
      </g>
    </g>

    <!-- lint enforces it -->
    <g class="kt-clayers__pop" :class="{ 'is-on': at(3.2) }">
      <rect :x="CX - 200" y="398" width="400" height="28" rx="14" class="kt-clayers__pill" />
      <solar-shield-check-bold-duotone :x="CX - 186" y="402" width="20" height="20" class="kt-clayers__icon is-good" />
      <text :x="CX + 12" y="417" text-anchor="middle" class="kt-clayers__pilltext">every arrow points in · lint enforces it</text>
    </g>
  </svg>
</template>

<style>
.kt-clayers {
  width: 100%;
  height: auto;
  overflow: visible;
  font-family: var(--font-family-sans);
}

.kt-clayers__part {
  opacity: 0;
  transition: opacity 0.45s;
}

.kt-clayers__part.is-on { opacity: 1; }

/* engine boxes, as in TwoTiers: primary = on the laptop, secondary = the cloud */
.kt-clayers__box { fill: var(--kt-code-bg); stroke: var(--kt-line-strong); stroke-width: 2.5; }
.kt-clayers__box.is-local { stroke: var(--kt-c-primary); }
.kt-clayers__box.is-cloud { stroke: var(--kt-c-secondary); }
.kt-clayers__box.is-app { stroke: var(--kt-heading); }

.kt-clayers__hex { fill: color-mix(in srgb, var(--kt-good) 6%, var(--kt-code-bg)); stroke: var(--kt-good); stroke-width: 2.5; stroke-linejoin: round; }
.kt-clayers__hex.is-core { fill: color-mix(in srgb, var(--kt-good) 16%, var(--kt-code-bg)); }

.kt-clayers__icon { color: var(--kt-heading); }
.kt-clayers__icon.is-good { color: var(--kt-good); }
.kt-clayers__icon.is-cool { color: var(--kt-cool); }

.kt-clayers__name { font-size: 20px; font-weight: 800; fill: var(--kt-heading); }
.kt-clayers__name.is-sm { font-size: 17px; }
.kt-clayers__does { font: 600 12px var(--font-family-mono); fill: var(--kt-muted); }
.kt-clayers__does.is-sm { font-size: 11px; }
.kt-clayers__pre { font: 600 11px var(--font-family-mono); fill: var(--kt-subtle); }
.kt-clayers__aname { font-size: 15px; font-weight: 800; fill: var(--kt-heading); }
.kt-clayers__tech { font: 700 12px var(--font-family-mono); fill: var(--kt-muted); }
.kt-clayers__tech.is-local { fill: var(--kt-cool); }
.kt-clayers__tech.is-cloud { fill: var(--kt-hot); }

.kt-clayers__style { fill: var(--kt-tint-success); stroke: var(--kt-good); stroke-width: 1.3; }
.kt-clayers__stylename { font: 700 11px var(--font-family-mono); fill: var(--kt-heading); }

.kt-clayers__side { font: 800 12px var(--font-family-mono); fill: var(--kt-muted); text-transform: uppercase; letter-spacing: 0.08em; }
.kt-clayers__port { fill: var(--kt-bg); stroke: var(--kt-good); stroke-width: 2.5; }
.kt-clayers__portname { font: 700 10.5px var(--font-family-mono); fill: var(--kt-good); }

.kt-clayers__wire {
  fill: none;
  stroke: var(--kt-line-strong);
  stroke-width: 2.2;
  stroke-dasharray: 6 5;
  animation: kt-clayers-flow 1.2s linear infinite;
}
.kt-clayers__head { fill: none; stroke: var(--kt-line-strong); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.kt-clayers__head.is-bad { stroke: var(--kt-bad); }

@keyframes kt-clayers-flow {
  to { stroke-dashoffset: -22; }
}

/* the wrong-way arrow */
.kt-clayers__wrong { opacity: 0; transition: opacity 0.45s; }
.kt-clayers__wrong.is-on { opacity: 1; }
.kt-clayers__wrong.is-on.is-gone { opacity: 0.25; }
.kt-clayers__up { fill: none; stroke: var(--kt-subtle); stroke-width: 2.2; stroke-dasharray: 6 5; transition: stroke 0.3s; }
.kt-clayers__wrong.is-bad .kt-clayers__up { stroke: var(--kt-bad); }
.kt-clayers__x { fill: var(--kt-bad); opacity: 0; transition: opacity 0.3s; }
.kt-clayers__xmark { stroke: var(--kt-bg); stroke-width: 2.8; stroke-linecap: round; opacity: 0; transition: opacity 0.3s; }
.kt-clayers__wrong.is-bad .kt-clayers__x,
.kt-clayers__wrong.is-bad .kt-clayers__xmark { opacity: 1; }

/* the pill */
.kt-clayers__pop {
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
  transform: scale(0.6);
  transition: opacity 0.2s, transform 0.4s cubic-bezier(0.3, 1.8, 0.5, 1);
}
.kt-clayers__pop.is-on { opacity: 1; transform: none; }
.kt-clayers__pill { fill: var(--kt-tint-success); stroke: var(--kt-good); stroke-width: 1.5; }
.kt-clayers__pilltext { font: 800 13px var(--font-family-mono); fill: var(--kt-good); }

@media (prefers-reduced-motion: reduce) {
  .kt-clayers__wire { animation: none !important; }
}
</style>
