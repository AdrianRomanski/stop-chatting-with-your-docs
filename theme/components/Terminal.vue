<script setup lang="ts">
import { computed } from 'vue'
import { useTimeline } from '../composables/useTimeline'

/**
 * A terminal box, same chrome as the code box. `lines` is a list of commands and output:
 *   [{ cmd: 'npm run build' }, { out: '✔ done in 4.2 s', tone: 'good' }]
 * The first word of a command is the program (hot), the rest its arguments (cool).
 * - `label`: top-right, e.g. "terminal" or "project folder"
 * - `typing`: type commands and print output line by line when the slide is shown
 * - `size`: sm | md | lg
 */
type Line = { cmd?: string; out?: string; tone?: 'good' | 'bad' | 'dim' }
const props = withDefaults(defineProps<{
  lines: Line[]
  label?: string
  typing?: boolean
  size?: 'sm' | 'md' | 'lg'
  rows?: number
}>(), { label: 'terminal', typing: false, size: 'md' })

const TYPE = 0.6
const OUT = 0.22

// when each line starts, in seconds after the slide is shown
const starts: number[] = []
let clock = 0.3
for (const l of props.lines) {
  starts.push(clock)
  clock += l.cmd ? TYPE + 0.25 : OUT
}

const { t } = useTimeline(clock + 0.5, { enabled: props.typing })

const shown = computed(() => props.lines
  .map((l, i) => ({ ...l, i, at: starts[i] }))
  .filter(l => !props.typing || t.value >= l.at)
  .map(l => {
    if (!l.cmd) return l
    const typed = props.typing ? l.cmd.slice(0, Math.ceil(l.cmd.length * Math.min(1, (t.value - l.at) / TYPE))) : l.cmd
    const [program, ...args] = typed.split(' ')
    return { ...l, program, args: args.join(' '), typing: props.typing && t.value - l.at < TYPE }
  })
  .slice(props.rows ? -props.rows : 0))
</script>

<template>
  <div class="kt-term" :class="`kt-term--${size}`">
    <div class="kt-term__bar"><i /><i /><i /><span class="kt-term__label">{{ label }}</span></div>
    <div class="kt-term__body">
      <div v-for="l in shown" :key="l.i" class="kt-term__line" :class="l.cmd ? 'is-cmd' : `is-${l.tone ?? 'out'}`">
        <template v-if="l.cmd"><span class="kt-term__prompt">$</span> <span class="kt-term__program">{{ (l as any).program }}</span> <span class="kt-term__args">{{ (l as any).args }}</span><span v-if="(l as any).typing" class="kt-term__caret" /></template>
        <template v-else>{{ l.out }}</template>
      </div>
    </div>
  </div>
</template>

<style>
.kt-term__body {
  padding: 4px 22px 18px;
  font-family: var(--font-family-mono);
}

.kt-term__line {
  white-space: pre;
  overflow: hidden;
  text-overflow: ellipsis;
}

.kt-term--sm .kt-term__line { font-size: 13.5px; line-height: 1.6; }
.kt-term--md .kt-term__line { font-size: 16px; line-height: 1.6; }
.kt-term--lg .kt-term__line { font-size: 20px; line-height: 1.55; }

.kt-term__line.is-cmd { margin-top: 4px; font-weight: 600; }
.kt-term__prompt { color: var(--kt-code-label); }
.kt-scheme-dark .kt-term__program { color: var(--color-secondary-400); }
.kt-scheme-dark .kt-term__args { color: var(--color-primary-300); }
.kt-scheme-light .kt-term__program { color: var(--color-secondary-700); }
.kt-scheme-light .kt-term__args { color: var(--color-primary-700); }
.kt-term__line.is-out { color: var(--kt-code-fg); }
.kt-term__line.is-dim { color: var(--kt-code-label); }
.kt-scheme-dark .kt-term__line.is-good { color: var(--color-success-400); }
.kt-scheme-dark .kt-term__line.is-bad { color: var(--color-secondary-300); font-weight: 700; }
.kt-scheme-light .kt-term__line.is-good { color: var(--color-success-700); }
.kt-scheme-light .kt-term__line.is-bad { color: var(--color-secondary-700); font-weight: 700; }

.kt-term__caret {
  display: inline-block;
  width: 0.55em;
  height: 1.05em;
  margin-left: 2px;
  vertical-align: -0.15em;
  background: currentColor;
}
</style>
