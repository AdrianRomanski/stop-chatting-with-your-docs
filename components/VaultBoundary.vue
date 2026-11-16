<script setup lang="ts">
import { useId } from 'vue'

/**
 * The whole ecosystem of ai-coach, on one static slide, with as little text as possible: names and
 * logos (ai-performance-coach ADR-AIC-0048, ARCHITECTURE.md, eslint.config.mjs; see
 * context/architecture.md). No motion at all.
 * Left, the coach: cli → the hexagon (application, domain inside) → vault-mcp, with an ADAPTER tab on its top edge and the MCP logo (no PushBased logo: everything here is ours); under the
 * hexagon Gemma (with the Ollama logo) and Argon (with the Google Cloud logo). vault-mcp, Gemma and
 * Argon are all adapters: the same violet box, each with an ADAPTER tab on its top edge. In the middle the wall, guarded by
 * Gandalf ("You shall not pass", the Nx logo on him: @nx/enforce-module-boundaries), with one gate,
 * MCP; a comic speech bubble from him: "YOU SHALL NOT PASS!". Right, the vault: coach-vault over the
 * vault engine over the climb board (the current Angular logo, from angular.dev's press kit). Far right, "Skills"
 * and the logos of five agents that run them (Antigravity, Claude, OpenAI Codex, Cursor, Kiro) reaching the same server, and Obsidian, the notes
 * the engine reads and writes; under it a credit pill: Kirill's photo, "vault engine by Kirill". Logos: Angular from Simple Icons, Antigravity, MCP, Ollama, OpenAI, Cursor and Claude
 * from LobeHub icons, ng-diagram from ngdiagram.dev; the Gandalf still is the classic frame from
 * The Fellowship of the Ring (imgflip template), cropped. 940 × 400, drawn at ~1:1. No props.
 */
const uid = useId()
const id = (name: string) => `kt-eco-${name}-${uid}`

const CX = 215
const CY = 150
const R = 86
const RI = 46
const H = Math.sqrt(3) / 2
const hex = (r: number) =>
  [[r, 0], [r / 2, r * H], [-r / 2, r * H], [-r, 0], [-r / 2, -r * H], [r / 2, -r * H]]
    .map(([x, y]) => `${CX + x},${CY + y}`).join(' ')

const WALL = 518
const GATE = { top: CY - 30, bottom: CY + 30 }
const V = { x: 540, w: 238 }
const A = { x: 790, w: 150 }
const GANDALF = { x: WALL - 60, y: -16, w: 120, h: 103 }
const M = { w: 196, left: CX - 8 - 196, right: CX + 8 }
const tabs = [
  { x: 408, y: CY - 34 },
  { x: M.left + M.w / 2, y: 290 },
  { x: M.right + M.w / 2, y: 290 },
]
const agents = [
  { src: '/images/logos/antigravity.svg', alt: 'Antigravity' },
  { src: '/images/logos/claude.svg', alt: 'Claude Code' },
  { src: '/images/logos/openai.svg', alt: 'Codex' },
  { src: '/images/logos/cursor.svg', alt: 'Cursor' },
  { src: '/images/logos/kiro.svg', alt: 'Kiro' },
]
</script>

<template>
  <svg class="kt-eco" viewBox="0 0 940 400" role="img"
    aria-label="The whole ecosystem. Left, the coach: the cli, the hexagon with application and domain, and vault-mcp, an adapter; under it Gemma on Ollama and Argon in the cloud. In the middle, a wall guarded by Gandalf with the Nx logo: you shall not pass. He says: you shall not pass. The only way through is the gate, MCP. Right, the vault: coach-vault over the vault engine over the climb board, built with Angular. The skills, in Antigravity, Claude Code, Codex, Cursor or Kiro, reach the same server, and the engine reads and writes the notes in Obsidian.">
    <defs>
      <marker :id="id('head')" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M1 1 L 9 5 L 1 9" class="kt-eco__head" />
      </marker>
      <marker :id="id('bad')" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M1 1 L 9 5 L 1 9" class="kt-eco__head is-bad" />
      </marker>
      <clipPath :id="id('kirill')">
        <circle :cx="A.x + 30" cy="361" r="23" />
      </clipPath>
      <clipPath :id="id('gandalf')">
        <rect :x="GANDALF.x" :y="GANDALF.y" :width="GANDALF.w" :height="GANDALF.h" rx="12" />
      </clipPath>
    </defs>


    <!-- the coach -->
    <rect x="0" :y="CY - 34" width="96" height="68" rx="14" class="kt-eco__box is-app" />
    <solar-file-terminal-bold-duotone x="34" :y="CY - 26" width="28" height="28" class="kt-eco__icon" />
    <text x="48" :y="CY + 24" text-anchor="middle" class="kt-eco__name">cli</text>
    <path :d="`M98 ${CY} H ${CX - R - 4}`" class="kt-eco__wire" :marker-end="`url(#${id('head')})`" />

    <polygon :points="hex(R)" class="kt-eco__hex" />
    <text :x="CX" :y="CY - 52" text-anchor="middle" class="kt-eco__label">application</text>
    <polygon :points="hex(RI)" class="kt-eco__hex is-core" />
    <text :x="CX" :y="CY + 7" text-anchor="middle" class="kt-eco__name">domain</text>

    <path :d="`M${CX + R + 4} ${CY} H 316`" class="kt-eco__wire" :marker-end="`url(#${id('head')})`" />
    <rect x="320" :y="CY - 34" width="176" height="68" rx="14" class="kt-eco__box is-local" />
    <image href="/images/logos/mcp.svg" x="338" :y="CY - 15" width="30" height="30" />
    <text x="378" :y="CY + 8" class="kt-eco__name">vault-mcp</text>


    <!-- the models -->
    <path :d="`M${CX - 26} ${CY + 78} L ${M.left + M.w / 2} 270`" class="kt-eco__wire" :marker-end="`url(#${id('head')})`" />
    <path :d="`M${CX + 26} ${CY + 78} L ${M.right + M.w / 2} 270`" class="kt-eco__wire" :marker-end="`url(#${id('head')})`" />
    <rect :x="M.left" y="290" :width="M.w" height="68" rx="14" class="kt-eco__box is-local" />
    <image href="/images/logos/gemma-mark.png" :x="M.left + 16" y="309" width="30" height="30" preserveAspectRatio="xMidYMid meet" />
    <text :x="M.left + 56" y="331" class="kt-eco__name">Gemma</text>
    <image href="/images/logos/ollama.svg" :x="M.left + M.w - 44" y="308" width="30" height="32" />
    <rect :x="M.right" y="290" :width="M.w" height="68" rx="14" class="kt-eco__box is-local" />
    <image href="/images/logos/gemini-mark.png" :x="M.right + 16" y="309" width="30" height="30" preserveAspectRatio="xMidYMid meet" />
    <text :x="M.right + 56" y="331" class="kt-eco__name">Argon</text>
    <image href="/images/logos/google-cloud.svg" :x="M.right + M.w - 48" y="306" width="36" height="36" preserveAspectRatio="xMidYMid meet" />

    <!-- the adapters: one ADAPTER tab on each box's top edge, all in the same violet -->
    <g v-for="t in tabs" :key="t.x">
      <rect :x="t.x - 56" :y="t.y - 13" width="112" height="26" rx="13" class="kt-eco__tab" />
      <solar-plug-circle-bold-duotone :x="t.x - 46" :y="t.y - 8" width="16" height="16" class="kt-eco__tabicon" />
      <text :x="t.x - 24" :y="t.y + 5" class="kt-eco__tabtext">adapter</text>
    </g>

    <!-- the wall, with one gate, and Gandalf on it -->
    <path :d="`M${WALL} ${GANDALF.y + GANDALF.h} V ${GATE.top} M${WALL} ${GATE.bottom} V 428`" class="kt-eco__wall" />
    <path :d="`M${WALL - 11} ${GATE.top} h22 M${WALL - 11} ${GATE.bottom} h22`" class="kt-eco__gate" />
    <path :d="`M498 ${CY} H ${V.x - 4}`" class="kt-eco__wire is-mcp" :marker-end="`url(#${id('head')})`" />
    <text :x="WALL - 14" :y="GATE.bottom + 24" text-anchor="end" class="kt-eco__gatename">MCP</text>

    <g class="kt-eco__bubble">
      <path d="M440.4 49.3 L 460 68 L 419.2 63.1 A 106 36 0 1 1 440.4 49.3 Z" class="kt-eco__bubblebg" />
      <text x="338" y="36" text-anchor="middle" class="kt-eco__bubbletext">YOU SHALL</text>
      <text x="338" y="60" text-anchor="middle" class="kt-eco__bubbletext">NOT PASS!</text>
    </g>

    <image href="/images/memes/gandalf-you-shall-not-pass.webp" :x="GANDALF.x" :y="GANDALF.y" :width="GANDALF.w" :height="GANDALF.h"
      preserveAspectRatio="xMidYMid slice" :clip-path="`url(#${id('gandalf')})`" />
    <rect :x="GANDALF.x" :y="GANDALF.y" :width="GANDALF.w" :height="GANDALF.h" rx="12" class="kt-eco__frame" />
    <rect :x="WALL - 30" :y="GANDALF.y + GANDALF.h - 16" width="60" height="30" rx="15" class="kt-eco__nxpill" />
    <image href="/images/logos/nx.svg" :x="WALL - 20" :y="GANDALF.y + GANDALF.h - 10" width="40" height="18" class="kt-eco__nxlogo" />

    <!-- the vault -->
    <rect :x="V.x" :y="CY - 34" :width="V.w" height="68" rx="14" class="kt-eco__box is-vault" />
    <solar-server-square-bold-duotone :x="V.x + 16" :y="CY - 15" width="30" height="30" class="kt-eco__icon is-cool" />
    <text :x="V.x + 58" :y="CY + 7" class="kt-eco__name">coach-vault</text>
    <path :d="`M${V.x + V.w / 2} ${CY + 36} V ${CY + 56}`" class="kt-eco__wire" :marker-end="`url(#${id('head')})`" />

    <rect :x="V.x" :y="CY + 60" :width="V.w" height="68" rx="14" class="kt-eco__box is-vault" />
    <solar-database-bold-duotone :x="V.x + 16" :y="CY + 79" width="30" height="30" class="kt-eco__icon is-cool" />
    <text :x="V.x + 58" :y="CY + 101" class="kt-eco__name">vault engine</text>
    <path :d="`M${V.x + V.w / 2} ${CY + 130} V ${CY + 150}`" class="kt-eco__wire" :marker-end="`url(#${id('head')})`" />

    <rect :x="V.x" :y="CY + 154" :width="V.w" height="68" rx="14" class="kt-eco__box is-vault" />
    <image href="/images/logos/angular.png" :x="V.x + 16" :y="CY + 172" width="30" height="32" preserveAspectRatio="xMidYMid meet" />
    <text :x="V.x + 58" :y="CY + 195" class="kt-eco__name">climb board</text>

    <!-- any agent, the second client -->
    <rect :x="A.x" y="26" :width="A.w" height="112" rx="16" class="kt-eco__notes" />
    <solar-cpu-bolt-bold-duotone :x="A.x + 14" y="40" width="26" height="26" class="kt-eco__icon is-hot" />
    <text :x="A.x + 48" y="60" class="kt-eco__name">Skills</text>
    <image v-for="(a, i) in agents" :key="a.alt" :href="a.src" :x="A.x + 9 + i * 27" y="88" width="24" height="24" preserveAspectRatio="xMidYMid meet">
      <title>{{ a.alt }}</title>
    </image>
    <path :d="`M${A.x - 2} 82 C ${V.x + 180} 82, ${V.x + 170} 90, ${V.x + 170} ${CY - 38}`" class="kt-eco__wire is-mcp" :marker-end="`url(#${id('head')})`" />

    <!-- the notes -->
    <path :d="`M${V.x + V.w + 2} ${CY + 94} H ${A.x - 4}`" class="kt-eco__wire" :marker-end="`url(#${id('head')})`" />
    <rect :x="A.x" y="186" :width="A.w" height="128" rx="16" class="kt-eco__notes" />
    <image href="/images/logos/obsidian.webp" :x="A.x + 14" y="200" width="26" height="26" />
    <text :x="A.x + 48" y="220" class="kt-eco__name">Obsidian</text>
    <rect :x="A.x + 44" y="238" width="40" height="52" rx="4" class="kt-eco__note is-back" />
    <rect :x="A.x + 54" y="246" width="40" height="52" rx="4" class="kt-eco__note" />
    <path :d="`M${A.x + 61} 260 h26 M${A.x + 61} 270 h20 M${A.x + 61} 280 h24`" class="kt-eco__text" />

    <!-- credit: the vault engine is Kirill's -->
    <rect :x="A.x" y="332" :width="A.w" height="58" rx="29" class="kt-eco__creditbox" />
    <image href="/images/people/kirill.webp" :x="A.x + 7" y="338" width="46" height="46" preserveAspectRatio="xMidYMid slice" :clip-path="`url(#${id('kirill')})`" />
    <circle :cx="A.x + 30" cy="361" r="23" class="kt-eco__creditring" />
    <text :x="A.x + 62" y="355" class="kt-eco__creditsmall">vault engine</text>
    <text :x="A.x + 62" y="377" class="kt-eco__creditname">by Kirill</text>
  </svg>
</template>

<style>
.kt-eco { width: 100%; height: auto; overflow: visible; font-family: var(--font-family-sans); }

.kt-eco__side { font: 800 14px var(--font-family-mono); fill: var(--kt-muted); text-transform: uppercase; letter-spacing: 0.08em; }

.kt-eco__box { fill: var(--kt-code-bg); stroke: var(--kt-line-strong); stroke-width: 2.5; }
.kt-eco__box.is-app { stroke: var(--kt-heading); }
.kt-eco__box.is-local { stroke: var(--kt-c-primary); }
.kt-eco__box.is-cloud { stroke: var(--kt-c-secondary); stroke-dasharray: 7 5; }
.kt-eco__box.is-vault { stroke: var(--kt-cool); }

.kt-eco__hex { fill: color-mix(in srgb, var(--kt-good) 6%, var(--kt-code-bg)); stroke: var(--kt-good); stroke-width: 2.5; stroke-linejoin: round; }
.kt-eco__hex.is-core { fill: color-mix(in srgb, var(--kt-good) 16%, var(--kt-code-bg)); }

.kt-eco__icon { color: var(--kt-heading); }
.kt-eco__icon.is-cool { color: var(--kt-cool); }
.kt-eco__icon.is-hot { color: var(--kt-hot); }

.kt-eco__name { font-size: 21px; font-weight: 800; fill: var(--kt-heading); }
.kt-eco__label { font: 700 15px var(--font-family-mono); fill: var(--kt-fg); }
.kt-eco__tab { fill: var(--kt-c-primary); }
.kt-eco__tabicon { color: var(--kt-heading); }
.kt-eco__tabtext { font: 800 13px var(--font-family-mono); fill: var(--kt-heading); letter-spacing: 0.06em; text-transform: uppercase; }
.kt-eco__pre { font: 600 14px var(--font-family-mono); fill: var(--kt-muted); }

.kt-eco__notes { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 2.5; }
.kt-eco__note { fill: var(--kt-code-bg); stroke: var(--kt-fg); stroke-width: 1.8; }
.kt-eco__note.is-back { stroke: var(--kt-line-strong); }
.kt-eco__text { stroke: var(--kt-muted); stroke-width: 2.2; stroke-linecap: round; }

.kt-eco__wall { stroke: var(--kt-heading); stroke-width: 6; stroke-linecap: round; }
.kt-eco__gate { stroke: var(--kt-good); stroke-width: 4; stroke-linecap: round; }
.kt-eco__gatename { font: 800 16px var(--font-family-mono); fill: var(--kt-good); }
.kt-eco__frame { fill: none; stroke: var(--kt-bad); stroke-width: 3; }
.kt-eco__nxpill { fill: var(--kt-bg); stroke: var(--kt-heading); stroke-width: 2; }
.kt-eco__nxlogo { filter: invert(1); }

.kt-eco__wire { fill: none; stroke: var(--kt-line-strong); stroke-width: 2.5; }
.kt-eco__wire.is-mcp { stroke: var(--kt-good); stroke-dasharray: 7 5; }
.kt-eco__head { fill: none; stroke: var(--kt-line-strong); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.kt-eco__head.is-bad { stroke: var(--kt-bad); }

.kt-eco__creditbox { fill: var(--kt-card); stroke: var(--kt-hot); stroke-width: 2; }
.kt-eco__creditring { fill: none; stroke: var(--kt-hot); stroke-width: 2.5; }
.kt-eco__creditsmall { font-size: 13px; font-weight: 600; fill: var(--kt-muted); }
.kt-eco__creditname { font-size: 17px; font-weight: 800; fill: var(--kt-heading); }
.kt-eco__credit-line { fill: none; stroke: var(--kt-hot); stroke-width: 2; stroke-dasharray: 4 4; }
.kt-eco__bubblebg { fill: #FFFFFF; stroke: #111111; stroke-width: 3; stroke-linejoin: round; }
.kt-eco__bubbletext { font: 900 21px var(--font-family-sans); fill: #111111; letter-spacing: 0.02em; }
</style>
