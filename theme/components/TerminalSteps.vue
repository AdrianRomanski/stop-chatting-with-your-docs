<script setup lang="ts">
import { computed } from 'vue'
import { useTimeline } from '../composables/useTimeline'

/**
 * A terminal session in steps (the NG Vienna leak hunt): the numbered steps on the left, the
 * terminal on the right. Each step types its commands and prints its output when the slide is
 * shown; the step list follows: the current step red, the finished ones green.
 * - `steps`: [{ name, lines: [{ cmd } | { out, tone: good | bad | dim }] }]
 * - `label`: top-right of the terminal, e.g. "leak hunt · local (simplified)"
 * - `rows`: lines the terminal shows before it scrolls (default 13)
 */
type Line = { cmd?: string; out?: string; tone?: 'good' | 'bad' | 'dim' }
type Step = { name: string; lines: Line[] }

const props = withDefaults(defineProps<{
  steps: Step[]
  label?: string
  rows?: number
}>(), { label: 'terminal', rows: 13 })

const TYPE = 0.55
const OUT = 0.18
const PAUSE = 0.35

/* one clock: when each line starts and when each step starts */
const timed: (Line & { at: number; key: string })[] = []
const stepAt: number[] = []
let clock = 0.3
props.steps.forEach((s, si) => {
  stepAt.push(clock)
  s.lines.forEach((l, li) => {
    timed.push({ ...l, at: clock, key: `${si}-${li}` })
    clock += l.cmd ? TYPE + 0.1 : OUT
  })
  clock += PAUSE
})
const END = clock

const { t } = useTimeline(END + 0.5)

const shown = computed(() => timed
  .filter(l => t.value >= l.at)
  .map((l) => {
    if (!l.cmd) return { ...l, text: l.out ?? '' }
    const typed = l.cmd.slice(0, Math.ceil(l.cmd.length * Math.min(1, (t.value - l.at) / TYPE)))
    const [program, ...args] = typed.split(' ')
    return { ...l, text: typed, program, args: args.join(' '), typing: t.value - l.at < TYPE }
  })
  .slice(-props.rows))

const current = computed(() => stepAt.filter(a => t.value >= a).length - 1)
const done = computed(() => t.value >= END)
</script>

<template>
  <div class="kt-tsteps">
    <ol class="kt-tsteps__list">
      <li
        v-for="(s, i) in steps"
        :key="s.name"
        :class="{ 'is-now': i === current && !done, 'is-done': i < current || done }"
      >
        <b>{{ i + 1 }}</b><span>{{ s.name }}</span>
      </li>
    </ol>
    <div class="kt-term kt-term--sm kt-tsteps__term">
      <div class="kt-term__bar"><i /><i /><i /><span class="kt-term__label">{{ label }}</span></div>
      <div class="kt-term__body" :style="{ height: `${rows * 21.6 + 22}px` }">
        <div v-for="l in shown" :key="l.key" class="kt-term__line" :class="l.cmd ? 'is-cmd' : `is-${l.tone ?? 'out'}`">
          <template v-if="l.cmd"><span class="kt-term__prompt">$</span> <span class="kt-term__program">{{ (l as any).program }}</span> <span class="kt-term__args">{{ (l as any).args }}</span><span v-if="(l as any).typing" class="kt-term__caret" /></template>
          <template v-else>{{ l.text }}</template>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.kt-tsteps {
  display: grid;
  grid-template-columns: 210px minmax(0, 1fr);
  gap: 24px;
  width: 100%;
  text-align: left;
}

.kt-tsteps__list {
  margin: 0;
  padding: 6px 0 0;
  list-style: none;
}

.kt-tsteps__list li {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 9px;
  padding: 0;
  opacity: 0.4;
  transition: opacity 0.3s;
}

.kt-tsteps__list li::marker { content: none; }

.kt-tsteps__list li b {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  font: 800 13px/1 var(--font-family-sans);
  color: var(--kt-fg);
  box-shadow: inset 0 0 0 1.5px var(--kt-c-primary-soft);
  transition: background 0.3s, color 0.3s;
}

.kt-tsteps__list li span {
  white-space: nowrap;
  font-size: 15px;
  font-weight: 700;
  color: var(--kt-fg);
}

.kt-tsteps__list li.is-done { opacity: 0.75; }

.kt-tsteps__list li.is-done b {
  color: #ffffff;
  background: var(--color-success-600);
  box-shadow: none;
}

.kt-tsteps__list li.is-now { opacity: 1; }

.kt-tsteps__list li.is-now b {
  color: #ffffff;
  background: var(--color-secondary-600);
  box-shadow: none;
}

/* the session's terminal: the code box chrome with the primary bar on top */
.kt-tsteps__term {
  box-shadow: var(--kt-shadow), inset 0 4px 0 var(--color-primary-500), inset 0 0 0 1px var(--kt-code-line);
}

.kt-tsteps__term .kt-term__body {
  overflow: hidden;
}
</style>
