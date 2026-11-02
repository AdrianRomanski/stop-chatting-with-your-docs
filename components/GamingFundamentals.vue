<script setup lang="ts">
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * What gaming taught me: three game cards (Counter-Strike 1.6, League of Legends, World of
 * Warcraft), each ticking off the fundamentals that game is won on. Then two formulas: talent +
 * dedication levels off at "good", fundamentals + talent + dedication climbs to "world class".
 * Last, the banner that hands over to the next section: this talk's fundamental is an Organized
 * Second Brain. No props.
 */
const { at } = useTimeline(8)
const games = [
  { name: 'Counter-Strike 1.6', logo: '/images/games/counter-strike.webp', cover: true,
    basics: ['crosshair placement', 'spray control', 'economy'] },
  { name: 'League of Legends', logo: '/images/games/league-of-legends.webp', cover: false,
    basics: ['last hitting', 'map awareness', 'wave control'] },
  { name: 'World of Warcraft', logo: '/images/hobbies/world-of-warcraft.png', cover: false,
    basics: ['rotation', 'positioning', 'know your class'] },
]
const basicAt = (g: number, i: number) => 1.3 + g * 0.8 + i * 0.22
</script>

<template>
  <div class="kt-gf">
    <div class="kt-gf__games">
      <div v-for="(g, gi) in games" :key="g.name" class="kt-gf__game kt-gf__part" :class="{ 'is-on': at(0.15 + gi * 0.35) }">
        <div class="kt-gf__logo" :class="{ 'is-cover': g.cover }">
          <img :src="g.logo" :alt="g.name">
        </div>
        <ul class="kt-gf__basics">
          <li v-for="(b, i) in g.basics" :key="b" class="kt-gf__basic" :class="{ 'is-on': at(basicAt(gi, i)) }">
            <span class="kt-gf__tick">✓</span>{{ b }}
          </li>
        </ul>
      </div>
    </div>

    <div class="kt-gf__bottom">
      <div class="kt-gf__sums">
        <div class="kt-gf__sum kt-gf__part" :class="{ 'is-on': at(4.1) }">
          <span class="kt-gf__chip">talent</span><span class="kt-gf__op">+</span>
          <span class="kt-gf__chip">dedication</span><span class="kt-gf__op">→</span>
          <svg class="kt-gf__curve" viewBox="0 0 64 28" aria-hidden="true"><path d="M2 24 C 16 10, 24 8, 62 8" class="is-flat" /></svg>
          <span class="kt-gf__result is-warn">stuck at good</span>
        </div>
        <div class="kt-gf__sum kt-gf__part" :class="{ 'is-on': at(5.3) }">
          <span class="kt-gf__chip is-hot">fundamentals</span><span class="kt-gf__op">+</span>
          <span class="kt-gf__chip">talent</span><span class="kt-gf__op">+</span>
          <span class="kt-gf__chip">dedication</span><span class="kt-gf__op">→</span>
          <svg class="kt-gf__curve" viewBox="0 0 64 28" aria-hidden="true"><path d="M2 24 C 30 22, 44 14, 62 2" class="is-up" /></svg>
          <span class="kt-gf__result is-good">world class</span>
        </div>
      </div>

      <div class="kt-gf__banner kt-gf__pop" :class="{ 'is-on': at(6.6) }">
        <svg class="kt-gf__brain" viewBox="-40 -34 80 68" aria-hidden="true">
          <path d="M0 -32 c-22 0 -38 14 -38 32 c0 18 16 32 38 32 c22 0 38 -14 38 -32 c0 -18 -16 -32 -38 -32z M0 -28 v56 M-22 -12 c8 4 8 12 0 16 M22 -12 c-8 4 -8 12 0 16" />
        </svg>
        <div>
          <div class="kt-gf__tag">this talk's fundamental</div>
          <div class="kt-gf__big is-hot">Organized</div>
          <div class="kt-gf__big is-hot">Second Brain</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.kt-gf {
  width: 880px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  font-family: var(--font-family-sans);
}

.kt-gf__part {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.45s, transform 0.45s;
}

.kt-gf__part.is-on { opacity: 1; transform: none; }

.kt-gf__games {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.kt-gf__game {
  background: var(--kt-card);
  border: 1px solid var(--kt-card-line);
  border-radius: var(--kt-radius-card);
  overflow: hidden;
}

.kt-gf__logo {
  height: 84px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  background: var(--kt-code-bg);
  border-bottom: 1px solid var(--kt-card-line);
}

.kt-gf__logo img { max-width: 100%; max-height: 100%; object-fit: contain; }
.kt-gf__logo.is-cover { padding: 0; }
.kt-gf__logo.is-cover img { width: 100%; height: 100%; max-height: none; object-fit: cover; object-position: 0 32%; }

.kt-slide ul.kt-gf__basics {
  list-style: none;
  margin: 0;
  padding: 14px 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.kt-gf__basic {
  display: flex;
  align-items: center;
  gap: 10px;
  font: 15px var(--font-family-mono);
  color: var(--kt-fg);
  opacity: 0;
  transform: translateX(-8px);
  transition: opacity 0.35s, transform 0.35s;
}

.kt-gf__basic.is-on { opacity: 1; transform: none; }

/* the theme gives every slide list a square bullet; the tick is the bullet here */
.kt-slide ul > li.kt-gf__basic { margin: 0; padding-left: 0; }
.kt-slide ul > li.kt-gf__basic::before { content: none; }

.kt-gf__tick {
  display: inline-grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 700;
  color: var(--kt-good);
  background: var(--kt-tint-success);
}

.kt-gf__bottom {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 18px;
  align-items: stretch;
}

.kt-gf__sums { display: flex; flex-direction: column; justify-content: center; gap: 12px; }

.kt-gf__sum { display: flex; align-items: center; gap: 6px; }

.kt-gf__chip {
  padding: 4px 9px;
  border-radius: 999px;
  font: 600 13px var(--font-family-mono);
  color: var(--kt-pill-fg);
  background: var(--kt-pill-bg);
}

.kt-gf__chip.is-hot { color: var(--kt-heading); background: var(--kt-tint-primary); box-shadow: inset 0 0 0 1.5px var(--kt-hot); }

.kt-gf__op { font: 600 15px var(--font-family-mono); color: var(--kt-subtle); }

.kt-gf__curve { width: 44px; height: 22px; flex: none; }
.kt-gf__curve path { fill: none; stroke-width: 3; stroke-linecap: round; }
.kt-gf__curve path.is-flat { stroke: var(--kt-warn); }
.kt-gf__curve path.is-up { stroke: var(--kt-good); }

.kt-gf__result { font: 700 15px var(--font-family-mono); white-space: nowrap; }
.kt-gf__result.is-warn { color: var(--kt-warn); }
.kt-gf__result.is-good { color: var(--kt-good); }

.kt-gf__banner {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-radius: var(--kt-radius-card);
  background: var(--kt-tint-primary);
  border: 2px solid var(--kt-c-primary);
  box-shadow: 0 0 40px color-mix(in srgb, var(--kt-c-primary) 55%, transparent);
}

.kt-gf__pop {
  opacity: 0;
  transform: scale(0.92);
  transition: opacity 0.4s, transform 0.5s cubic-bezier(0.3, 1.6, 0.5, 1);
}

.kt-gf__pop.is-on { opacity: 1; transform: none; }

.kt-gf__brain { width: 60px; height: 52px; flex: none; }
.kt-gf__brain path {
  fill: var(--kt-tint-primary);
  stroke: var(--kt-c-primary-soft);
  stroke-width: 3;
  stroke-linecap: round;
}

.kt-gf__tag { margin-bottom: 4px; font: 15px var(--font-family-mono); color: var(--kt-subtle); }
.kt-gf__big { font-size: 34px; font-weight: 800; line-height: 1.05; white-space: nowrap; color: var(--kt-heading); }
.kt-gf__big.is-hot { color: var(--kt-hot); }
</style>
