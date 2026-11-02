<script setup lang="ts">
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * Why the check needs the bigger model: verification asymmetry in general (Jason Wei, "Asymmetry of
 * verification and verifier's law"). Left, the classic kind: hard to solve, easy to check (math,
 * code with tests, a schedule): a long "solve" bar, a short "check" bar. Right, the inverted kind:
 * easy to generate, hard to check (an essay, a security audit, a design review, and last, lit up,
 * "my answer"): the bars flip. Under both, the verifier's law: AI gets good at what's easy to
 * verify. Then the conclusion: my answer is the hard kind, so the check gets the strongest model
 * I can run offline, Gemma 12B. No props, no numbers: the bar lengths are only "short" and "long".
 */
const { at } = useTimeline(7)

const easy = [
  { name: 'math', icon: 'calc' },
  { name: 'code + tests', icon: 'code' },
  { name: 'a schedule', icon: 'cal' },
]
const hard = [
  { name: 'an essay', icon: 'doc' },
  { name: 'a security audit', icon: 'shield' },
  { name: 'a design review', icon: 'pen' },
  { name: 'my answer', icon: 'me', mine: true },
]
</script>

<template>
  <div class="kt-vlaw" role="img"
    aria-label="Verification asymmetry. The classic kind: hard to solve, easy to check, like math, code with tests or a schedule. The inverted kind: easy to generate, hard to check, like an essay, a security audit, a design review, and my answer. The verifier's law, Jason Wei: AI gets good at what is easy to verify. My answer is the hard kind, so the check gets the bigger model, Gemma 12B, still offline.">
    <div class="kt-vlaw__panels">
      <!-- classic: hard to solve, easy to check -->
      <div class="kt-vlaw__panel is-easy" :class="{ 'is-on': at(0.2) }">
        <div class="kt-vlaw__kind">classic</div>
        <div class="kt-vlaw__title">hard to solve, <b>easy to check</b></div>
        <div class="kt-vlaw__bars" :class="{ 'is-grown': at(0.8) }">
          <div class="kt-vlaw__bar"><span>solve</span><i style="--w: 92%" /></div>
          <div class="kt-vlaw__bar is-check"><span>check</span><i style="--w: 18%" /></div>
        </div>
        <div class="kt-vlaw__chips">
          <div v-for="(e, i) in easy" :key="e.name" class="kt-vlaw__chip" :class="{ 'is-on': at(1.3 + i * 0.2) }">
            <solar-calculator-bold-duotone v-if="e.icon === 'calc'" />
            <solar-code-bold-duotone v-else-if="e.icon === 'code'" />
            <solar-calendar-bold-duotone v-else />
            {{ e.name }}
          </div>
        </div>
      </div>

      <!-- inverted: easy to generate, hard to check -->
      <div class="kt-vlaw__panel is-hard" :class="{ 'is-on': at(2.0) }">
        <div class="kt-vlaw__kind">inverted</div>
        <div class="kt-vlaw__title">easy to generate, <b>hard to check</b></div>
        <div class="kt-vlaw__bars" :class="{ 'is-grown': at(2.6) }">
          <div class="kt-vlaw__bar"><span>generate</span><i style="--w: 18%" /></div>
          <div class="kt-vlaw__bar is-check"><span>check</span><i style="--w: 92%" /></div>
        </div>
        <div class="kt-vlaw__chips">
          <div v-for="(h, i) in hard" :key="h.name" class="kt-vlaw__chip"
            :class="{ 'is-on': at(3.1 + i * 0.2), 'is-mine': h.mine, 'is-lit': h.mine && at(4.2) }">
            <solar-document-text-bold-duotone v-if="h.icon === 'doc'" />
            <solar-shield-warning-bold-duotone v-else-if="h.icon === 'shield'" />
            <solar-ruler-pen-bold-duotone v-else-if="h.icon === 'pen'" />
            <solar-user-speak-bold-duotone v-else />
            {{ h.name }}
          </div>
        </div>
      </div>
    </div>

    <!-- the verifier's law -->
    <div class="kt-vlaw__law" :class="{ 'is-on': at(5.0) }">
      <solar-scale-bold-duotone class="kt-vlaw__lawicon" />
      <div>
        <div class="kt-vlaw__lawname">verifier’s law · Jason Wei</div>
        <div class="kt-vlaw__lawtext">AI gets good at what’s <b>easy to verify</b></div>
      </div>
    </div>

    <!-- so: the check gets the bigger model -->
    <div class="kt-vlaw__then" :class="{ 'is-on': at(5.8) }">
      <span>my answer is the hard kind →</span>
      <img src="/images/logos/gemma-mark.png" alt="">
      <b>the check gets Gemma 12B</b>
      <em>still offline</em>
    </div>
  </div>
</template>

<style>
.kt-vlaw {
  width: 880px;
  font-family: var(--font-family-sans);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.kt-vlaw__panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.kt-vlaw__panel {
  --tone: var(--kt-good);
  padding: 16px 18px;
  border: 2px solid color-mix(in srgb, var(--tone) 60%, transparent);
  border-radius: 16px;
  background: color-mix(in srgb, var(--tone) 7%, var(--kt-card));
  opacity: 0;
  transform: translateY(14px);
  transition: opacity 0.4s, transform 0.5s cubic-bezier(0.2, 0.9, 0.3, 1.2);
}

.kt-vlaw__panel.is-on { opacity: 1; transform: none; }
.kt-vlaw__panel.is-hard { --tone: var(--kt-hot); }

.kt-vlaw__kind {
  font: 700 12px var(--font-family-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--tone);
}

.kt-vlaw__title { margin-top: 4px; font-size: 21px; font-weight: 700; color: var(--kt-fg); }
.kt-vlaw__title b { color: var(--kt-heading); font-weight: 800; }

.kt-vlaw__bars { margin-top: 14px; display: flex; flex-direction: column; gap: 8px; }

.kt-vlaw__bar {
  display: grid;
  grid-template-columns: 76px 1fr;
  align-items: center;
  gap: 8px;
}

.kt-vlaw__bar span { font: 600 12px var(--font-family-mono); color: var(--kt-muted); }

.kt-vlaw__bar i {
  display: block;
  height: 14px;
  width: 0;
  border-radius: 7px;
  background: var(--kt-line-strong);
  transition: width 0.9s cubic-bezier(0.3, 0.9, 0.3, 1);
}

.kt-vlaw__bar.is-check i { background: var(--tone); }
.kt-vlaw__bars.is-grown i { width: var(--w); }

.kt-vlaw__chips { margin-top: 14px; display: flex; flex-wrap: wrap; gap: 8px; }

.kt-vlaw__chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 11px;
  border: 1.5px solid var(--kt-line);
  border-radius: 999px;
  background: var(--kt-card);
  font: 600 13px var(--font-family-mono);
  color: var(--kt-fg);
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 0.3s, transform 0.4s cubic-bezier(0.3, 1.8, 0.5, 1), border-color 0.4s, box-shadow 0.4s, color 0.4s;
}

.kt-vlaw__chip svg { width: 16px; height: 16px; color: var(--tone); }
.kt-vlaw__chip.is-on { opacity: 1; transform: none; }
.kt-vlaw__chip.is-lit {
  border-color: var(--kt-hot);
  color: var(--kt-heading);
  box-shadow: 0 0 18px color-mix(in srgb, var(--kt-hot) 45%, transparent);
}

.kt-vlaw__law {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border: 2px solid var(--kt-c-primary);
  border-radius: 16px;
  background: var(--kt-tint-primary);
  opacity: 0;
  transition: opacity 0.45s;
}

.kt-vlaw__law.is-on { opacity: 1; }
.kt-vlaw__lawicon { flex: none; width: 36px; height: 36px; color: var(--kt-cool); }
.kt-vlaw__lawname { font: 700 12px var(--font-family-mono); letter-spacing: 0.06em; text-transform: uppercase; color: var(--kt-cool); }
.kt-vlaw__lawtext { margin-top: 2px; font-size: 19px; font-weight: 600; color: var(--kt-fg); }
.kt-vlaw__lawtext b { color: var(--kt-heading); font-weight: 800; }

.kt-vlaw__then {
  align-self: center;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 2px solid var(--kt-good);
  border-radius: 14px;
  background: var(--kt-tint-success);
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.4s, transform 0.5s cubic-bezier(0.2, 0.9, 0.3, 1.2);
}

.kt-vlaw__then.is-on { opacity: 1; transform: none; }
.kt-vlaw__then span { font: 600 14px var(--font-family-mono); color: var(--kt-muted); }
.kt-vlaw__then img { width: 24px; height: 24px; }
.kt-vlaw__then b { font-size: 20px; font-weight: 800; color: var(--kt-heading); white-space: nowrap; }
.kt-vlaw__then em { font: normal 600 13px var(--font-family-mono); color: var(--kt-good); }
</style>
