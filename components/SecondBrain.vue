<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { onSlideEnter } from '@slidev/client'

/**
 * Tiago Forte's CODE pipeline: four stage cards, Capture, Organize, Distill, Express, each with its
 * rule. Static: no animation. The card style is reused, small, by WriteOnlyGraveyard.
 * Props: `step` (capture | organize | distill | express) draws the compact strip instead, for the
 * top of each stage's slide: C · O · D · E, the current stage lit and named. With `halves` the strip
 * also names Forte's two halves, set up on the Vico slide (ConsumeCreate): C · O divergence,
 * D · E convergence; the current stage's half is lit. Each name is centered between its two letters,
 * not over the lit pill's word (measured once the fonts are in).
 */
defineProps<{ step?: 'capture' | 'organize' | 'distill' | 'express'; halves?: boolean }>()
const half = (k?: string) => (k === 'capture' || k === 'organize' ? 'divergence' : 'convergence')
const stages = [
  { x: 30, key: 'capture', letter: 'C', word: 'Capture', sub: 'keep what resonates' },
  { x: 240, key: 'organize', letter: 'O', word: 'Organize', sub: 'by actionability' },
  { x: 450, key: 'distill', letter: 'D', word: 'Distill', sub: 'summarize in layers' },
  { x: 660, key: 'express', letter: 'E', word: 'Express', sub: 'assemble from notes' },
]
const groups = [
  { name: 'divergence', stages: stages.slice(0, 2) },
  { name: 'convergence', stages: stages.slice(2) },
]

// shift each half's name so it sits on the midpoint between its two letters
const groupEls = ref<HTMLElement[]>([])
const shift = ref([0, 0])
function centerNames() {
  shift.value = groupEls.value.map((g, i) => {
    // slides are mounted ahead of time, hidden: measure only when this one is laid out
    if (!g.offsetWidth || !g.getBoundingClientRect().width) return shift.value[i]
    const box = g.getBoundingClientRect()
    const scale = box.width / g.offsetWidth || 1 // the slide is scaled to the window
    const mids = [...g.querySelectorAll('.kt-sbrain-strip__stage b')].map((b) => {
      const r = b.getBoundingClientRect()
      return (r.left + r.width / 2 - box.left) / scale
    })
    return mids.length === 2 ? (mids[0] + mids[1]) / 2 - g.offsetWidth / 2 : 0
  })
}
async function measure() {
  await nextTick()
  await document.fonts?.ready
  centerNames()
  requestAnimationFrame(centerNames)
}
onMounted(measure)
onSlideEnter(measure)
</script>

<template>
  <div v-if="step" class="kt-sbrain-strip" role="img"
    :aria-label="`CODE, stage: ${step}${halves ? `, ${half(step)}` : ''}`">
    <!-- with halves: two groups, each named on top -->
    <template v-if="halves">
      <template v-for="(g, gi) in groups" :key="g.name">
        <span v-if="gi" class="kt-sbrain-strip__sep" />
        <div ref="groupEls" class="kt-sbrain-strip__group">
          <span class="kt-sbrain-strip__half" :class="{ 'is-on': half(step) === g.name }">
            <span class="kt-sbrain-strip__name" :style="{ transform: `translateX(${shift[gi]}px)` }">{{ g.name }}</span>
          </span>
          <div class="kt-sbrain-strip__row">
            <template v-for="(s, i) in g.stages" :key="s.key">
              <span v-if="i" class="kt-sbrain-strip__dot">·</span>
              <span class="kt-sbrain-strip__stage" :class="{ 'is-on': s.key === step }">
                <b>{{ s.letter }}</b><span v-if="s.key === step">{{ s.word }}</span>
              </span>
            </template>
          </div>
        </div>
      </template>
    </template>
    <template v-for="(s, i) in stages" v-else :key="s.key">
      <span v-if="i" class="kt-sbrain-strip__dot">·</span>
      <span class="kt-sbrain-strip__stage" :class="{ 'is-on': s.key === step }">
        <b>{{ s.letter }}</b><span v-if="s.key === step">{{ s.word }}</span>
      </span>
    </template>
  </div>
  <svg v-else class="kt-sbrain" viewBox="0 0 880 260" role="img"
    aria-label="CODE: capture, keep what resonates; organize, by actionability; distill, summarize in layers; express, assemble from notes.">
    <g v-for="s in stages" :key="s.letter">
      <rect :x="s.x" y="10" width="190" height="240" rx="18" class="kt-sbrain__card" />
      <text :x="s.x + 95" y="122" text-anchor="middle" class="kt-sbrain__letter">{{ s.letter }}</text>
      <text :x="s.x + 95" y="172" text-anchor="middle" class="kt-sbrain__word">{{ s.word }}</text>
      <text :x="s.x + 95" y="206" text-anchor="middle" class="kt-sbrain__sub">{{ s.sub }}</text>
    </g>
  </svg>
</template>

<style>
.kt-sbrain {
  width: 880px;
  height: auto;
  font-family: var(--font-family-sans);
}

.kt-sbrain__card {
  fill: var(--kt-tint-primary);
  stroke: var(--kt-c-primary);
  stroke-width: 2.5;
}

.kt-sbrain__letter { font-size: 92px; font-weight: 800; fill: var(--kt-hot); }
.kt-sbrain__word { font-size: 27px; font-weight: 800; fill: var(--kt-heading); }
.kt-sbrain__sub { font: 15px var(--font-family-mono); fill: var(--kt-subtle); }

/* the compact strip, above a stage's headline */
.kt-sbrain-strip {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-family: var(--font-family-sans);
}
.kt-sbrain-strip__dot { color: var(--kt-subtle); font-weight: 700; }
.kt-sbrain-strip__stage {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  padding: 2px 10px;
  border-radius: 10px;
  border: 2px solid var(--kt-line);
  color: var(--kt-subtle);
  font-size: 15px;
  line-height: 22px;
}
.kt-sbrain-strip__stage b { font-size: 18px; font-weight: 800; }
.kt-sbrain-strip__stage.is-on {
  border-color: var(--kt-c-primary);
  background: var(--kt-tint-primary);
  color: var(--kt-heading);
  font-weight: 800;
}
.kt-sbrain-strip__stage.is-on b { color: var(--kt-hot); }

/* the two halves (with `halves`): each pair grouped, its name on top, the current half lit */
.kt-sbrain-strip__group { display: flex; flex-direction: column; align-items: stretch; gap: 5px; }
.kt-sbrain-strip__row { display: flex; align-items: center; justify-content: center; gap: 8px; }
/* the name sits on a bracket that spans its pair */
.kt-sbrain-strip__half {
  padding-bottom: 3px;
  border-bottom: 2px solid var(--kt-line);
  text-align: center;
  font: 600 12px var(--font-family-mono);
  line-height: 13px;
  letter-spacing: 0.04em;
  color: var(--kt-subtle);
}
.kt-sbrain-strip__half.is-on { color: var(--kt-hot); font-weight: 800; border-color: var(--kt-hot); }
.kt-sbrain-strip__name { display: inline-block; }
.kt-sbrain-strip__sep { align-self: stretch; width: 2px; margin: 0 8px; background: var(--kt-line); }
.kt-sbrain-strip:has(.kt-sbrain-strip__group) { align-items: stretch; margin-bottom: 0; }
</style>
