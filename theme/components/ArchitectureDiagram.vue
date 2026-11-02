<script setup lang="ts">
/**
 * An example architecture diagram (the NG Vienna "what the sketch became" slide): the request path
 * on top, the work that happens in the background in a dashed lane below, every dimension of the
 * platform as chips. Requests, lookups and answers move as dots along the wires.
 *
 * Like FlowDiagram, this is a starting point: copy it into the talk's components/ and change the
 * boxes, wires and labels. The recipe: one SVG with a fixed viewBox; boxes are rects with a name
 * and a mono line under it; a stack of rects behind a box means "many of these"; wires are paths
 * and the dots run along the same paths with <animateMotion>; colors only from the classes below.
 */
const phones = [
  { x: 22, y: 44, cc: 'BR' }, { x: 56, y: 44, cc: 'AT' }, { x: 90, y: 44, cc: 'US' },
  { x: 22, y: 100, cc: 'DE' }, { x: 56, y: 100, cc: 'CO' }, { x: 90, y: 100, cc: 'ZA' },
]

const chipW = (t: string) => Math.round(t.length * 6.4 + 18)

function row(items: string[], x0: number, gap: number, shrink = 0) {
  let x = x0
  return items.map((t) => {
    const w = chipW(t) - shrink
    const chip = { t, x, w }
    x += w + gap
    return chip
  })
}

const tabs = row(['home', 'shop', 'search', 'login', 'account'], 272, 4, 4)
const dims = row(['50 brands', '5 products', 'Android · iOS', '33 countries', 'prod · beta · preview', '2 versions live'], 168, 8)

const cols = 10
const cells = Array.from({ length: cols * 5 }, (_, i) => ({
  i,
  x: 526 + (i % cols) * 18,
  y: 250 + Math.floor(i / cols) * 16,
  d: ((i * 37) % 23) / 10,
}))

const fan = Array.from({ length: 14 }, (_, i) => {
  const c = cells[(i * 7 + 3) % cells.length]
  return { i, path: `M518 281 L ${c.x + 7} ${c.y + 5} L 716 290`, begin: (i * 0.19) % 2.4 }
})

const req = Array.from({ length: 8 }, (_, i) => ({ i, begin: i * 0.25 }))
const back = Array.from({ length: 8 }, (_, i) => ({ i, begin: 0.6 + i * 0.25 }))
const src = Array.from({ length: 4 }, (_, i) => ({ i, begin: i * 0.4 }))

const keyChip = 'page:{device}:{version}:{geo}:{url}'
const config = 'static config'
const discovery = 'RUM discovery · every 5 min'
</script>

<template>
  <svg class="kt-arch" viewBox="0 0 900 400" role="img" aria-label="An example architecture: the request path through CDN, app and cache, and the background work that keeps the cache warm">
    <!-- the background lane -->
    <rect x="150" y="206" width="740" height="186" rx="16" class="kt-arch__lane" />
    <text x="170" y="228" class="kt-arch__kicker">in the background</text>

    <g class="kt-arch__chip is-src">
      <rect x="168" y="252" :width="chipW(config)" height="22" rx="11" />
      <text :x="168 + chipW(config) / 2" y="267" text-anchor="middle">{{ config }}</text>
    </g>
    <g class="kt-arch__chip is-src">
      <rect x="168" y="284" :width="chipW(discovery)" height="22" rx="11" />
      <text :x="168 + chipW(discovery) / 2" y="299" text-anchor="middle">{{ discovery }}</text>
    </g>
    <path :d="`M${168 + chipW(config)} 263 L 392 276`" class="kt-arch__wire" />
    <path :d="`M${168 + chipW(discovery)} 295 L 392 286`" class="kt-arch__wire" />
    <circle v-for="d in src" :key="`s${d.i}`" r="3" class="kt-arch__dot is-warm">
      <animateMotion :path="d.i % 2 ? `M${168 + chipW(discovery)} 295 L 392 286` : `M${168 + chipW(config)} 263 L 392 276`" dur="1.6s" :begin="`${d.begin}s`" repeatCount="indefinite" />
    </circle>

    <g class="kt-arch__box is-bg">
      <rect x="386" y="256" width="132" height="50" rx="10" />
      <text x="452" y="278" text-anchor="middle" class="kt-arch__name is-sm">Refresher</text>
      <text x="452" y="296" text-anchor="middle" class="kt-arch__small">just one pod</text>
    </g>

    <text x="602" y="242" text-anchor="middle" class="kt-arch__note">494 page variants kept warm</text>
    <rect v-for="c in cells" :key="c.i" :x="c.x" :y="c.y" width="14" height="10" rx="2" class="kt-arch__cell" :style="{ animationDelay: `${c.d}s` }" />
    <circle v-for="f in fan" :key="`f${f.i}`" r="3" class="kt-arch__dot is-warm">
      <animateMotion :path="f.path" dur="2.4s" :begin="`${f.begin}s`" repeatCount="indefinite" />
    </circle>

    <g class="kt-arch__box is-bg">
      <rect v-for="k in [4, 3, 2, 1]" :key="k" :x="716 + k * 4" :y="250 - k * 5" width="130" height="80" rx="10" class="is-stack" />
      <rect x="716" y="250" width="130" height="80" rx="10" />
      <text x="781" y="272" text-anchor="middle" class="kt-arch__name is-sm">Render fleet</text>
      <text x="781" y="290" text-anchor="middle" class="kt-arch__small">~200 pods</text>
      <text x="781" y="305" text-anchor="middle" class="kt-arch__small">5 regions</text>
      <text x="781" y="321" text-anchor="middle" class="kt-arch__small is-good">~2 M renders a day</text>
    </g>

    <g v-for="d in dims" :key="d.t" class="kt-arch__chip is-dim">
      <rect :x="d.x" y="350" :width="d.w" height="22" rx="11" />
      <text :x="d.x + d.w / 2" y="365" text-anchor="middle">{{ d.t }}</text>
    </g>

    <path d="M752 250 V 132" class="kt-arch__wire" />
    <text x="762" y="168" class="kt-arch__note">write HTML</text>
    <text x="762" y="183" class="kt-arch__small">every 10 s – 30 min</text>
    <circle v-for="d in src" :key="`w${d.i}`" r="3.5" class="kt-arch__dot is-warm">
      <animateMotion path="M752 250 V 132" dur="1.6s" :begin="`${d.begin}s`" repeatCount="indefinite" />
    </circle>

    <!-- the request path -->
    <text x="16" y="30" class="kt-arch__small">phones · 33 countries</text>
    <g v-for="p in phones" :key="p.cc" class="kt-arch__phone">
      <rect :x="p.x" :y="p.y" width="26" height="44" rx="5" />
      <rect :x="p.x + 4" :y="p.y + 5" width="18" height="30" rx="2" class="is-screen" />
      <text :x="p.x + 13" :y="p.y + 24" text-anchor="middle">{{ p.cc }}</text>
    </g>

    <path d="M120 92 H 280" class="kt-arch__wire" />
    <path d="M450 90 H 620" class="kt-arch__wire" />
    <path d="M620 108 H 450" class="kt-arch__wire" />
    <path d="M365 130 V 188 H 70 V 146" class="kt-arch__wire" />

    <circle v-for="d in req" :key="`r${d.i}`" r="4" class="kt-arch__dot is-req">
      <animateMotion path="M120 92 H 280" dur="2s" :begin="`${d.begin}s`" repeatCount="indefinite" />
    </circle>
    <circle v-for="d in req" :key="`l${d.i}`" r="3.5" class="kt-arch__dot is-lookup">
      <animateMotion path="M450 90 H 620" dur="0.8s" :begin="`${d.begin}s`" repeatCount="indefinite" />
    </circle>
    <circle v-for="d in back" :key="`b${d.i}`" r="5" class="kt-arch__dot is-hit">
      <animateMotion path="M365 130 V 188 H 70 V 146" dur="2s" :begin="`${d.begin}s`" repeatCount="indefinite" />
    </circle>

    <g class="kt-arch__box">
      <rect x="150" y="72" width="76" height="40" rx="10" />
      <text x="188" y="97" text-anchor="middle" class="kt-arch__name is-sm">CDN</text>
    </g>

    <g v-for="t in tabs" :key="t.t" class="kt-arch__chip is-tab">
      <rect :x="t.x" y="44" :width="t.w" height="18" rx="9" />
      <text :x="t.x + t.w / 2" y="57" text-anchor="middle">{{ t.t }}</text>
    </g>
    <g class="kt-arch__box is-key">
      <rect x="288" y="74" width="170" height="64" rx="12" class="is-stack" />
      <rect x="284" y="70" width="170" height="64" rx="12" class="is-stack" />
      <rect x="280" y="66" width="170" height="64" rx="12" />
      <text x="365" y="93" text-anchor="middle" class="kt-arch__name">app</text>
      <text x="365" y="113" text-anchor="middle" class="kt-arch__small">100+ brands · own config</text>
    </g>

    <g class="kt-arch__chip is-key">
      <rect x="590" y="14" :width="chipW(keyChip)" height="20" rx="10" />
      <text :x="590 + chipW(keyChip) / 2" y="28" text-anchor="middle">{{ keyChip }}</text>
    </g>
    <g class="kt-arch__box is-key">
      <rect v-for="k in [4, 3, 2, 1]" :key="k" :x="620 + k * 6" :y="66 - k * 6" width="150" height="64" rx="12" class="is-stack" />
      <rect x="620" y="66" width="150" height="64" rx="12" />
      <text x="695" y="93" text-anchor="middle" class="kt-arch__name">Cache</text>
      <text x="695" y="113" text-anchor="middle" class="kt-arch__small">× 5 regions</text>
    </g>
    <text x="535" y="82" text-anchor="middle" class="kt-arch__note">1 lookup</text>

    <text x="220" y="180" text-anchor="middle" class="kt-arch__out">HTML with content</text>
  </svg>
</template>

<style>
.kt-arch {
  display: block;
  width: 100%;
  height: auto;
  font-family: var(--font-family-sans);
}

.kt-scheme-dark .kt-arch {
  --kt-arch-box: color-mix(in srgb, var(--color-primary-950) 92%, transparent);
  --kt-arch-box-line: color-mix(in srgb, #ffffff 40%, transparent);
  --kt-arch-key: var(--color-primary-400);
  --kt-arch-bg-box: var(--color-primary-900);
  --kt-arch-bg-line: var(--color-primary-500);
  --kt-arch-stack: color-mix(in srgb, var(--color-primary-900) 80%, var(--color-neutral-950));
  --kt-arch-chip: color-mix(in srgb, var(--color-primary-600) 35%, transparent);
  --kt-arch-chip-line: color-mix(in srgb, var(--color-primary-300) 55%, transparent);
  --kt-arch-chip-text: #ffffff;
  --kt-arch-tab: color-mix(in srgb, var(--color-secondary-400) 22%, transparent);
  --kt-arch-tab-line: color-mix(in srgb, var(--color-secondary-300) 70%, transparent);
  --kt-arch-src: color-mix(in srgb, #ffffff 8%, transparent);
  --kt-arch-src-line: color-mix(in srgb, #ffffff 30%, transparent);
  --kt-arch-wire: color-mix(in srgb, #ffffff 16%, transparent);
  --kt-arch-warm: var(--color-primary-300);
  --kt-arch-cell: var(--color-primary-500);
}

.kt-scheme-light .kt-arch {
  --kt-arch-box: #ffffff;
  --kt-arch-box-line: var(--color-neutral-300);
  --kt-arch-key: var(--color-primary-500);
  --kt-arch-bg-box: var(--color-primary-50);
  --kt-arch-bg-line: var(--color-primary-400);
  --kt-arch-stack: var(--color-primary-100);
  --kt-arch-chip: var(--color-primary-50);
  --kt-arch-chip-line: var(--color-primary-300);
  --kt-arch-chip-text: var(--color-primary-800);
  --kt-arch-tab: var(--color-secondary-50);
  --kt-arch-tab-line: var(--color-secondary-300);
  --kt-arch-src: var(--color-neutral-100);
  --kt-arch-src-line: var(--color-neutral-300);
  --kt-arch-wire: var(--color-neutral-300);
  --kt-arch-warm: var(--color-primary-500);
  --kt-arch-cell: var(--color-primary-500);
}

.kt-arch__box rect {
  fill: var(--kt-arch-box);
  stroke: var(--kt-arch-box-line);
  stroke-width: 1.5;
}

.kt-arch__box.is-key rect {
  stroke: var(--kt-arch-key);
  stroke-width: 2;
}

.kt-arch__box.is-bg rect {
  fill: var(--kt-arch-bg-box);
  stroke: var(--kt-arch-bg-line);
}

.kt-arch__box rect.is-stack {
  fill: var(--kt-arch-stack);
  stroke-width: 1.2;
}

.kt-arch__name {
  font-size: 19px;
  font-weight: 800;
  fill: var(--kt-heading);
}

.kt-arch__name.is-sm { font-size: 15px; }

.kt-arch__small {
  font: 11px var(--font-family-mono);
  fill: var(--kt-muted);
}

.kt-arch__small.is-good {
  font-weight: 700;
  fill: var(--kt-good);
}

.kt-arch__kicker {
  font: 600 11px var(--font-family-mono);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  fill: var(--kt-cool);
}

.kt-arch__note {
  font: 700 12px var(--font-family-mono);
  fill: var(--kt-cool);
}

.kt-arch__lane {
  fill: var(--kt-tint-primary);
  stroke: var(--kt-arch-chip-line);
  stroke-width: 1.5;
  stroke-dasharray: 6 6;
}

.kt-arch__wire {
  fill: none;
  stroke: var(--kt-arch-wire);
  stroke-width: 2;
}

.kt-arch__dot.is-req { fill: var(--kt-fg); }
.kt-arch__dot.is-lookup { fill: var(--kt-arch-key); }
.kt-arch__dot.is-warm { fill: var(--kt-arch-warm); }
.kt-arch__dot.is-hit { fill: var(--kt-good); }

/* phones are devices: the same in both modes */
.kt-arch__phone rect {
  fill: var(--color-neutral-900);
  stroke: var(--color-neutral-400);
  stroke-width: 1.3;
}

.kt-arch__phone rect.is-screen {
  fill: var(--color-neutral-50);
  stroke: none;
}

.kt-arch__phone text {
  font: 700 9px var(--font-family-mono);
  fill: var(--color-neutral-900);
}

.kt-arch__chip rect {
  fill: var(--kt-arch-chip);
  stroke: var(--kt-arch-chip-line);
  stroke-width: 1;
}

.kt-arch__chip text {
  font: 600 11px var(--font-family-mono);
  fill: var(--kt-arch-chip-text);
}

.kt-arch__chip.is-tab rect {
  fill: var(--kt-arch-tab);
  stroke: var(--kt-arch-tab-line);
}

.kt-arch__chip.is-tab text {
  font-size: 10px;
  fill: var(--kt-fg);
}

.kt-arch__chip.is-key rect {
  fill: var(--kt-arch-box);
  stroke: var(--kt-arch-key);
}

.kt-arch__chip.is-key text {
  font-size: 10.5px;
  fill: var(--kt-cool);
}

.kt-arch__chip.is-src rect {
  fill: var(--kt-arch-src);
  stroke: var(--kt-arch-src-line);
}

.kt-arch__chip.is-src text { fill: var(--kt-fg); }

.kt-arch__cell {
  fill: var(--kt-arch-cell);
  opacity: 0.35;
  animation: kt-arch-twinkle 2.3s ease-in-out infinite;
}

@keyframes kt-arch-twinkle {
  50% { opacity: 0.95; }
}

.kt-arch__out {
  font: 700 14px var(--font-family-mono);
  fill: var(--kt-good);
}

@media (prefers-reduced-motion: reduce) {
  .kt-arch__cell { animation: none; }
}
</style>
