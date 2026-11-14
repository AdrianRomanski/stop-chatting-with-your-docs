<script setup lang="ts">
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * Space, the payoff of its two rounds: more styles passed, a higher rank. Four rungs, bottom to top,
 * one per number of styles with a passed spaced spar (each style adds one chip):
 * 1 style  · Unranked: Teach locked (ADR-0047 needs two)
 * 2 styles · Bronze: Teach opens
 * 3 styles · Silver
 * 4 styles · Gold: all four styles
 * The rungs land bottom up, then my face climbs to Bronze (feynman + socratic, the two rounds before)
 * and the two locks above stay dim, "next: cornell", "then: devil".
 * The two-style gate for Teach is in ai-performance-coach (ADR-0047, `TEACH_STYLES`); the rank names
 * are the speaker's design for the coach, not in the code yet (say so in the notes). No props.
 */
const { at } = useTimeline(6)

const rungs = [
  { n: 1, rank: 'Unranked', tone: 'none', styles: ['feynman'], note: 'Teach locked' },
  { n: 2, rank: 'Bronze', tone: 'bronze', styles: ['feynman', 'socratic'], note: 'Teach opens' },
  { n: 3, rank: 'Silver', tone: 'silver', styles: ['feynman', 'socratic', 'cornell'], note: 'next: cornell' },
  { n: 4, rank: 'Gold', tone: 'gold', styles: ['feynman', 'socratic', 'cornell', 'devil'], note: 'all four styles' },
].map((r, i) => ({ ...r, at: 0.3 + i * 0.45 }))
const ME = 2.6 // I climb onto Unranked, then Bronze
const HERE = 2 // the rung I reach
</script>

<template>
  <div class="kt-srank" role="img"
    aria-label="More styles, higher rank. Four rungs, by how many styles you passed a spaced spar in. One style, feynman: unranked, Teach locked. Two styles, feynman and socratic: Bronze, Teach opens. Three styles, plus cornell: Silver. Four styles, plus devil: Gold. I stand on Bronze: passed in feynman and socratic. Next: cornell.">
    <div class="kt-srank__ladder">
      <div v-for="r in [...rungs].reverse()" :key="r.n" class="kt-srank__rung" :class="[`is-${r.tone}`, { 'is-on': at(r.at), 'is-here': r.n === HERE && at(ME + 0.6), 'is-reached': r.n <= HERE && at(ME + (r.n - 1) * 0.6), 'is-ahead': r.n > HERE }]"
        :style="{ marginLeft: `${(r.n - 1) * 52}px` }">
        <div class="kt-srank__medal"><span>{{ r.n }}</span></div>
        <div class="kt-srank__name">{{ r.rank }}</div>
        <div class="kt-srank__chips">
          <i v-for="s in r.styles" :key="s" :class="`is-${s}`">{{ s }}</i>
        </div>
        <div class="kt-srank__note">{{ r.note }}</div>
        <img v-if="r.n === HERE" class="kt-srank__me" :class="{ 'is-on': at(ME + 0.6) }" src="/images/speaker.webp" alt="">
      </div>
    </div>
    <div class="kt-srank__foot" :class="{ 'is-on': at(ME + 1.6) }">one style shows you can explain it one way · every new style asks it from another side</div>
  </div>
</template>

<style>
.kt-srank { width: 900px; font-family: var(--font-family-sans); display: flex; flex-direction: column; gap: 18px; }
.kt-srank__ladder { display: flex; flex-direction: column; gap: 10px; }

.kt-srank__rung {
  --tone: var(--kt-line-strong);
  position: relative; display: flex; align-items: center; gap: 14px; width: 680px;
  padding: 10px 16px; border: 2px solid var(--kt-line-strong); border-radius: 14px; background: var(--kt-card);
  opacity: 0; transform: translateY(10px); transition: opacity 0.4s, transform 0.4s, border-color 0.3s, box-shadow 0.3s;
}
.kt-srank__rung.is-bronze { --tone: color-mix(in srgb, var(--kt-warn) 55%, var(--kt-hot)); }
.kt-srank__rung.is-silver { --tone: color-mix(in srgb, var(--kt-fg) 75%, var(--kt-bg)); }
.kt-srank__rung.is-gold { --tone: var(--kt-warn); }
.kt-srank__rung.is-on { opacity: 1; transform: none; }
.kt-srank__rung.is-ahead.is-on { opacity: 0.5; border-style: dashed; }
.kt-srank__rung.is-reached { border-color: var(--tone); }
.kt-srank__rung.is-here { box-shadow: 0 0 26px color-mix(in srgb, var(--tone) 40%, transparent); }

.kt-srank__medal { flex: none; display: grid; place-items: center; width: 40px; height: 40px; border-radius: 50%; background: color-mix(in srgb, var(--tone) 30%, var(--kt-bg)); border: 2px solid var(--tone); }
.kt-srank__medal span { font: 800 16px var(--font-family-mono); color: var(--kt-heading); }
.kt-srank__name { width: 112px; font-size: 22px; font-weight: 800; color: var(--tone); }
.kt-srank__rung.is-none .kt-srank__name { color: var(--kt-muted); }
.kt-srank__chips { display: flex; gap: 6px; flex: 1; }
.kt-srank__chips i { font: 700 11.5px var(--font-family-mono); font-style: normal; text-transform: uppercase; letter-spacing: 0.04em; padding: 2px 8px; border-radius: 999px; border: 1.5px solid currentColor; }
.kt-srank__chips i.is-feynman { color: var(--kt-info); }
.kt-srank__chips i.is-socratic { color: var(--kt-hot); }
.kt-srank__chips i.is-cornell { color: var(--kt-good); }
.kt-srank__chips i.is-devil { color: var(--kt-warn); }
.kt-srank__note { font: 700 13px var(--font-family-mono); color: var(--kt-muted); white-space: nowrap; }
.kt-srank__rung.is-here .kt-srank__note { color: var(--kt-good); }

.kt-srank__me { position: absolute; right: -58px; top: 50%; width: 42px; height: 42px; margin-top: -21px; border-radius: 50%; border: 3px solid var(--kt-warn); object-fit: cover; opacity: 0; transform: translateY(70px); transition: opacity 0.3s, transform 0.6s cubic-bezier(0.3, 1.4, 0.5, 1); }
.kt-srank__me.is-on { opacity: 1; transform: none; }

.kt-srank__foot { font: 600 15px var(--font-family-mono); color: var(--kt-muted); opacity: 0; transition: opacity 0.4s; }
.kt-srank__foot.is-on { opacity: 1; }

@media (prefers-reduced-motion: reduce) {
  .kt-srank * { transition: none !important; }
}
</style>
