<script setup lang="ts">
import { useId } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * Every change ships with its why (ai-performance-coach ADR-AIC-0001, ADR-AIC-0049; kb/README.md;
 * see context/architecture.md). Real data: commit f3fafd4 (2026-11-15) moved the vault server in
 * and carried its decision, ADR-0048, now ADR-AIC-0048. Three columns:
 * - the commit: hash, subject, three of its files, then the decision record lights up: same commit.
 * - kb/, a kb-kit knowledge base: two initiatives, "ai-coach · AIC" (the counter goes 48 → 49 when
 *   the record lands; 49 is the real count on 2026-11-16 with ADR-AIC-0049, the kb itself) and
 *   "vault · KI" (ADR-KI-0058–0071 + RFC-KI-0042, the vault's reasons, copied from kb-template).
 *   Under them the lifecycle: draft → accepted → superseded, never rewritten.
 * - an agent asks the ai-coach-kb MCP server (docs-mcp serve in kb/) "why is the vault behind MCP?";
 *   `search` answers ADR-AIC-0048. Its write path, `upsert_document`, gives a new record its ID, and
 *   `docs-mcp check` ticks green.
 * Foot: "kb-kit + docs-mcp · by Kirill". The record card flies from the commit into the stack. No props.
 */
const { at } = useTimeline(5)
const uid = useId()
const id = (name: string) => `kt-dtrail-${name}-${uid}`

const files = [
  { path: 'packages/vault-server/…', on: 0.4 },
  { path: 'ARCHITECTURE.md', on: 0.55 },
  { path: 'coach.config.example.json', on: 0.7 },
]
const STACK = { x: 352, y: 112 }
const tools = ['search', 'read_document', 'upsert_document']
</script>

<template>
  <svg class="kt-dtrail" viewBox="0 0 900 420" role="img"
    aria-label="Every change ships with its why. Commit f3fafd4, build vault: run the imported vault server from this workspace, changes the vault server, the architecture page and the example config, and carries its decision record, ADR-AIC-0048, in the same commit. The record lands in kb, a kb-kit knowledge base with two initiatives: ai-coach, now 49 decisions, and vault, 14 decisions and one proposal copied from kb-template. A record goes from draft to accepted to superseded and is never rewritten. An agent asks the ai-coach-kb MCP server why the vault is behind MCP, and search answers ADR-AIC-0048. New records are written through upsert_document, and docs-mcp check passes. kb-kit and docs-mcp are by Kirill.">
    <defs>
      <marker :id="id('head')" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M1 1 L 9 5 L 1 9" class="kt-dtrail__head" />
      </marker>
    </defs>

    <!-- the commit -->
    <g class="kt-dtrail__part" :class="{ 'is-on': at(0.1) }">
      <text x="20" y="40" class="kt-dtrail__side">the commit</text>
      <rect x="14" y="54" width="290" height="250" rx="16" class="kt-dtrail__box" />
      <solar-code-square-bold-duotone x="28" y="68" width="22" height="22" class="kt-dtrail__icon" />
      <text x="58" y="84" class="kt-dtrail__hash">f3fafd4</text>
      <text x="240" y="84" text-anchor="end" class="kt-dtrail__date">2026-11-15</text>
      <text x="28" y="116" class="kt-dtrail__subject"><tspan class="is-type">build(vault):</tspan> run the imported</text>
      <text x="28" y="136" class="kt-dtrail__subject">vault server from this workspace</text>
      <path d="M28 152 H 290" class="kt-dtrail__rule" />
    </g>
    <g v-for="(f, i) in files" :key="f.path" class="kt-dtrail__part" :class="{ 'is-on': at(f.on) }">
      <text x="28" :y="178 + i * 24" class="kt-dtrail__file"><tspan class="is-mod">M</tspan> {{ f.path }}</text>
    </g>
    <g class="kt-dtrail__part" :class="{ 'is-on': at(0.9) }">
      <rect x="22" y="246" width="274" height="34" rx="9" class="kt-dtrail__adrrow" />
      <text x="34" y="268" class="kt-dtrail__file is-adr"><tspan class="is-add">A</tspan> ADR-AIC-0048</text>
      <text x="284" y="268" text-anchor="end" class="kt-dtrail__same">same commit</text>
    </g>

    <!-- kb/ -->
    <g class="kt-dtrail__part" :class="{ 'is-on': at(1.2) }">
      <text :x="STACK.x" y="40" class="kt-dtrail__side">kb/ · kb-kit</text>
      <rect :x="STACK.x - 8" y="54" width="216" height="250" rx="16" class="kt-dtrail__box is-kb" />
      <text :x="STACK.x + 8" y="84" class="kt-dtrail__init">ai-coach · AIC</text>
      <text :x="STACK.x + 194" y="86" text-anchor="end" class="kt-dtrail__count" :class="{ 'is-up': at(2.2) }">{{ at(2.2) ? 49 : 48 }}</text>
      <rect :x="STACK.x + 22" :y="STACK.y - 6" width="146" height="34" rx="8" class="kt-dtrail__card is-back" />
      <rect :x="STACK.x + 18" :y="STACK.y" width="146" height="34" rx="8" class="kt-dtrail__card is-back" />
      <rect :x="STACK.x + 14" :y="STACK.y + 6" width="146" height="34" rx="8" class="kt-dtrail__card" />
      <text :x="STACK.x + 26" :y="STACK.y + 28" class="kt-dtrail__cardid is-dim">ADR-AIC-0047</text>
      <text :x="STACK.x + 8" y="206" class="kt-dtrail__init">vault · KI</text>
      <text :x="STACK.x + 194" y="208" text-anchor="end" class="kt-dtrail__count is-sm">14 + 1</text>
      <text :x="STACK.x + 8" y="226" class="kt-dtrail__note">from kb-template</text>
      <text :x="STACK.x + 8" y="284" class="kt-dtrail__life">draft → <tspan class="is-good">accepted</tspan> → superseded</text>
    </g>

    <!-- the record flies into kb/ -->
    <g class="kt-dtrail__fly" :class="{ 'is-on': at(1.6), 'is-landed': at(2.2) }"
      :style="{ transform: at(1.6) ? `translate(${STACK.x + 10}px, ${STACK.y + 12}px)` : 'translate(34px, 246px)' }">
      <rect width="146" height="34" rx="8" class="kt-dtrail__solid" />
      <rect width="146" height="34" rx="8" class="kt-dtrail__card is-new" />
      <text x="12" y="22" class="kt-dtrail__cardid">ADR-AIC-0048</text>
    </g>

    <!-- the agent asks the knowledge base -->
    <g class="kt-dtrail__part" :class="{ 'is-on': at(2.6) }">
      <text x="600" y="40" class="kt-dtrail__side">your agent · MCP</text>
      <rect x="596" y="54" width="290" height="56" rx="14" class="kt-dtrail__box is-app" />
      <solar-magic-stick-3-bold-duotone x="610" y="70" width="24" height="24" class="kt-dtrail__icon is-hot" />
      <text x="644" y="88" class="kt-dtrail__ask">why is the vault behind MCP?</text>
      <path d="M741 112 V 140" class="kt-dtrail__wire" :marker-end="`url(#${id('head')})`" />
      <rect x="596" y="144" width="290" height="96" rx="14" class="kt-dtrail__box is-kb" />
      <solar-server-square-bold-duotone x="610" y="158" width="22" height="22" class="kt-dtrail__icon is-cool" />
      <text x="640" y="174" class="kt-dtrail__init">ai-coach-kb</text>
      <text x="872" y="174" text-anchor="end" class="kt-dtrail__note">docs-mcp serve</text>
    </g>
    <g v-for="(t, i) in tools" :key="t" class="kt-dtrail__part" :class="{ 'is-on': at(2.8 + i * 0.12) }">
      <rect :x="610 + [0, 62, 164][i]" y="194" :width="[56, 96, 110][i]" height="26" rx="13" class="kt-dtrail__tool" :class="{ 'is-hit': i === 0 && at(3.1) }" />
      <text :x="610 + [0, 62, 164][i] + [56, 96, 110][i] / 2" y="211" text-anchor="middle" class="kt-dtrail__toolname">{{ t }}</text>
    </g>
    <g class="kt-dtrail__part" :class="{ 'is-on': at(3.4) }">
      <path :d="`M594 210 C 570 210, 570 ${STACK.y + 30}, ${STACK.x + 160} ${STACK.y + 30}`" class="kt-dtrail__wire is-live" :marker-end="`url(#${id('head')})`" />
      <rect x="610" y="252" width="276" height="34" rx="9" class="kt-dtrail__answer" />
      <text x="622" y="274" class="kt-dtrail__file is-adr">→ ADR-AIC-0048</text>
      <text x="874" y="274" text-anchor="end" class="kt-dtrail__same">accepted</text>
    </g>

    <!-- the check -->
    <g class="kt-dtrail__pop" :class="{ 'is-on': at(3.9) }">
      <circle cx="372" cy="352" r="13" class="kt-dtrail__ok" />
      <path d="M366 352 l4 4 l8 -9" class="kt-dtrail__tick" />
      <text x="394" y="358" class="kt-dtrail__check">docs-mcp check</text>
      <text x="556" y="358" class="kt-dtrail__note">every record's fields, IDs and links</text>
    </g>
    <g class="kt-dtrail__part" :class="{ 'is-on': at(4.2) }">
      <text x="450" y="404" text-anchor="middle" class="kt-dtrail__credit">kb-kit + docs-mcp · by Kirill</text>
    </g>
  </svg>
</template>

<style>
.kt-dtrail {
  width: 100%;
  height: auto;
  overflow: visible;
  font-family: var(--font-family-sans);
}

.kt-dtrail__part { opacity: 0; transition: opacity 0.45s; }
.kt-dtrail__part.is-on { opacity: 1; }

.kt-dtrail__side { font: 800 12px var(--font-family-mono); fill: var(--kt-muted); text-transform: uppercase; letter-spacing: 0.08em; }
.kt-dtrail__box { fill: var(--kt-code-bg); stroke: var(--kt-line-strong); stroke-width: 2.2; }
.kt-dtrail__box.is-kb { stroke: var(--kt-cool); }
.kt-dtrail__box.is-app { stroke: var(--kt-heading); }
.kt-dtrail__icon { color: var(--kt-heading); }
.kt-dtrail__icon.is-cool { color: var(--kt-cool); }
.kt-dtrail__icon.is-hot { color: var(--kt-hot); }

.kt-dtrail__hash { font: 800 16px var(--font-family-mono); fill: var(--kt-heading); }
.kt-dtrail__date { font: 600 11px var(--font-family-mono); fill: var(--kt-subtle); }
.kt-dtrail__subject { font: 700 14px var(--font-family-mono); fill: var(--kt-fg); }
.kt-dtrail__subject .is-type { fill: var(--kt-good); }
.kt-dtrail__rule { stroke: var(--kt-line); stroke-width: 1.5; }
.kt-dtrail__file { font: 600 12.5px var(--font-family-mono); fill: var(--kt-muted); }
.kt-dtrail__file .is-mod { fill: var(--kt-warn); font-weight: 800; }
.kt-dtrail__file .is-add { fill: var(--kt-good); font-weight: 800; }
.kt-dtrail__file.is-adr { fill: var(--kt-heading); font-weight: 800; }
.kt-dtrail__adrrow { fill: var(--kt-tint-success); stroke: var(--kt-good); stroke-width: 1.8; }
.kt-dtrail__same { font: 800 10.5px var(--font-family-mono); fill: var(--kt-good); text-transform: uppercase; letter-spacing: 0.06em; }

.kt-dtrail__init { font-size: 15px; font-weight: 800; fill: var(--kt-heading); }
.kt-dtrail__count { font: 800 26px var(--font-family-mono); fill: var(--kt-muted); transition: fill 0.3s; }
.kt-dtrail__count.is-up { fill: var(--kt-good); }
.kt-dtrail__count.is-sm { font-size: 18px; }
.kt-dtrail__note { font: 600 11px var(--font-family-mono); fill: var(--kt-subtle); }
.kt-dtrail__life { font: 700 10.5px var(--font-family-mono); fill: var(--kt-muted); }
.kt-dtrail__life .is-good { fill: var(--kt-good); }

.kt-dtrail__card { fill: var(--kt-card); stroke: var(--kt-line-strong); stroke-width: 1.5; }
.kt-dtrail__card.is-back { opacity: 0.6; }
.kt-dtrail__solid { fill: var(--kt-code-bg); }
.kt-dtrail__card.is-new { fill: var(--kt-tint-success); stroke: var(--kt-good); stroke-width: 2; }
.kt-dtrail__cardid { font: 800 13px var(--font-family-mono); fill: var(--kt-heading); }
.kt-dtrail__cardid.is-dim { fill: var(--kt-muted); }

.kt-dtrail__fly { opacity: 0; transition: opacity 0.3s, transform 0.6s cubic-bezier(0.5, 0, 0.2, 1); }
.kt-dtrail__fly.is-on { opacity: 1; }

.kt-dtrail__ask { font: 700 13px var(--font-family-mono); fill: var(--kt-fg); }
.kt-dtrail__tool { fill: var(--kt-bg); stroke: var(--kt-line-strong); stroke-width: 1.5; transition: fill 0.3s, stroke 0.3s; }
.kt-dtrail__tool.is-hit { fill: var(--kt-tint-success); stroke: var(--kt-good); }
.kt-dtrail__toolname { font: 700 10.5px var(--font-family-mono); fill: var(--kt-heading); }
.kt-dtrail__answer { fill: var(--kt-tint-success); stroke: var(--kt-good); stroke-width: 1.8; }

.kt-dtrail__wire { fill: none; stroke: var(--kt-line-strong); stroke-width: 2.2; }
.kt-dtrail__wire.is-live { stroke-dasharray: 6 5; animation: kt-dtrail-flow 1.2s linear infinite; }
.kt-dtrail__head { fill: none; stroke: var(--kt-line-strong); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
@keyframes kt-dtrail-flow {
  to { stroke-dashoffset: -22; }
}

.kt-dtrail__pop {
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
  transform: scale(0.6);
  transition: opacity 0.2s, transform 0.4s cubic-bezier(0.3, 1.8, 0.5, 1);
}
.kt-dtrail__pop.is-on { opacity: 1; transform: none; }
.kt-dtrail__ok { fill: var(--kt-good); }
.kt-dtrail__tick { fill: none; stroke: var(--kt-bg); stroke-width: 2.6; stroke-linecap: round; stroke-linejoin: round; }
.kt-dtrail__check { font: 800 17px var(--font-family-mono); fill: var(--kt-heading); }
.kt-dtrail__credit { font: 600 12px var(--font-family-mono); fill: var(--kt-subtle); }

@media (prefers-reduced-motion: reduce) {
  .kt-dtrail__wire.is-live { animation: none !important; }
}
</style>
