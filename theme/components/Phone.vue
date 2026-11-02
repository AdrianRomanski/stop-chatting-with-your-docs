<script setup lang="ts">
import { computed } from 'vue'
import { useTimeline } from '../composables/useTimeline'

/**
 * A phone (the NG Vienna `Phone`). With `paintAt`, the screen stays blank and the page loads until
 * that second, with a clock under the phone: put two side by side for a race, good vs bad.
 * - `paintAt`: second at which the page paints; leave it out for a phone that shows its page at once
 * - `label` under the clock, `tone`: good | bad | neutral (the clock's color once painted)
 * - `url` in the address bar, `width` in px (default 190; the phone is 1:2)
 * Slot: the page. Without one, the phone shows a sample app.
 */
const props = withDefaults(defineProps<{
  paintAt?: number
  label?: string
  tone?: 'good' | 'bad' | 'neutral'
  url?: string
  width?: number
}>(), { tone: 'neutral', url: 'example.com', width: 190 })

const race = computed(() => props.paintAt !== undefined)
const { t } = useTimeline((props.paintAt ?? 0) + 0.3, { enabled: race.value })

const painted = computed(() => !race.value || t.value >= (props.paintAt ?? 0))
const elapsed = computed(() => Math.min(t.value, props.paintAt ?? 0))
/* the browser's progress bar: fast at first, then crawling, like the real one */
const loading = computed(() => (painted.value ? 0 : 4 + 84 * (1 - Math.exp(-t.value / Math.max(1, (props.paintAt ?? 1) / 2.5)))))

const rows = [
  { title: 'Order #4821', sub: 'arrives today', value: '€ 42' },
  { title: 'Order #4818', sub: 'on its way', value: '€ 19' },
  { title: 'Order #4807', sub: 'delivered', value: '€ 86' },
  { title: 'Order #4799', sub: 'delivered', value: '€ 23' },
]
</script>

<template>
  <div class="kt-phone" :class="`kt-phone--${tone}`">
    <div class="kt-phone__box" :style="{ width: `${width}px`, height: `${width * 2}px` }">
      <div class="kt-phone__device" :style="{ transform: `scale(${width / 190})` }">
        <div class="kt-phone__camera" />
        <div class="kt-phone__screen">
          <div class="kt-phone__url">
            <span class="kt-phone__lock">●</span> {{ url }}
            <span v-if="race && !painted" class="kt-phone__progress" :style="{ width: `${loading}%` }" />
          </div>
          <div v-if="painted" class="kt-phone__page">
            <slot>
              <div class="kt-app">
                <div class="kt-app__bar"><span class="kt-app__logo" /><span class="kt-app__pill">Log in</span></div>
                <div class="kt-app__hero">
                  <div class="kt-app__tag">This month</div>
                  <div class="kt-app__big">€ 1,284</div>
                  <div class="kt-app__chips"><span>Orders</span><span>Returns</span><span>Saved</span></div>
                </div>
                <div v-for="r in rows" :key="r.title" class="kt-app__row">
                  <div><b>{{ r.title }}</b><span>{{ r.sub }}</span></div>
                  <em>{{ r.value }}</em>
                </div>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </div>
    <div v-if="race" class="kt-phone__clock" :class="{ 'is-done': painted }">{{ elapsed.toFixed(1) }} s</div>
    <div v-if="label" class="kt-phone__label">{{ label }}</div>
  </div>
</template>

<style>
.kt-phone {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.kt-phone__box {
  position: relative;
  flex: none;
}

/* drawn at 190 × 380 and scaled, so every size keeps the proportions */
.kt-phone__device {
  position: absolute;
  top: 0;
  left: 0;
  width: 190px;
  height: 380px;
  padding: 10px;
  border-radius: 30px;
  background: #16181d;
  box-shadow: 0 18px 40px rgba(13, 18, 28, 0.35), inset 0 0 0 2px #2a2e36;
  transform-origin: top left;
}

.kt-phone__camera {
  position: absolute;
  z-index: 2;
  top: 14px;
  left: 50%;
  width: 10px;
  height: 10px;
  margin-left: -5px;
  border-radius: 50%;
  background: #000000;
}

.kt-phone__screen {
  position: relative;
  height: 100%;
  overflow: hidden;
  border-radius: 22px;
  background: #ffffff;
  text-align: left;
}

.kt-phone__url {
  position: relative;
  height: 34px;
  padding: 16px 12px 0;
  overflow: hidden;
  white-space: nowrap;
  font: 8.5px var(--font-family-sans);
  color: var(--color-neutral-500);
  background: var(--color-neutral-100);
}

.kt-phone__lock {
  font-size: 7px;
  color: var(--color-success-600);
}

.kt-phone__progress {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  background: var(--color-primary-500);
}

.kt-phone__page {
  position: absolute;
  inset: 34px 0 0;
  overflow: hidden;
  animation: kt-phone-paint 0.15s ease-out;
}

@keyframes kt-phone-paint {
  from { opacity: 0; }
}

.kt-phone__page > img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: left top;
}

.kt-phone__clock {
  font: 700 34px/1.1 var(--font-family-mono);
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  color: var(--kt-subtle);
}

.kt-phone--good .kt-phone__clock.is-done { color: var(--kt-good); }
.kt-phone--bad .kt-phone__clock.is-done { color: var(--kt-bad); }
.kt-phone--neutral .kt-phone__clock.is-done { color: var(--kt-fg); }

.kt-phone__label {
  font-size: 15px;
  font-weight: 700;
  color: var(--kt-muted);
}

/* the sample app: a finished page, never skeletons */
.kt-app {
  height: 100%;
  padding-bottom: 8px;
  background: var(--color-neutral-900);
}

.kt-app__bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 30px;
  padding: 0 10px;
  background: var(--color-neutral-950);
}

.kt-app__logo {
  width: 58px;
  height: 10px;
  border-radius: 3px;
  background: var(--color-primary-400);
}

.kt-app__pill {
  padding: 3px 7px;
  border-radius: 10px;
  font-size: 8px;
  font-weight: 700;
  color: var(--color-neutral-950);
  background: var(--color-primary-300);
}

.kt-app__hero {
  margin: 8px;
  padding: 10px;
  border-radius: 10px;
  color: #ffffff;
  background: linear-gradient(135deg, var(--color-primary-700), var(--color-secondary-700));
}

.kt-app__tag {
  font-size: 7px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-secondary-100);
}

.kt-app__big {
  margin: 4px 0 8px;
  font-size: 18px;
  font-weight: 800;
}

.kt-app__chips {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
}

.kt-app__chips span {
  padding: 5px 0;
  border-radius: 5px;
  font-size: 8px;
  font-weight: 700;
  text-align: center;
  background: rgba(255, 255, 255, 0.16);
}

.kt-app__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 8px 6px;
  padding: 7px 8px;
  border-radius: 8px;
  background: var(--color-neutral-800);
}

.kt-app__row b,
.kt-app__row span {
  display: block;
  font-size: 8.5px;
  line-height: 1.35;
  white-space: nowrap;
}

.kt-app__row b { font-weight: 700; color: var(--color-neutral-50); }
.kt-app__row span { color: var(--color-neutral-400); }

.kt-app__row em {
  font-style: normal;
  font-size: 9px;
  font-weight: 700;
  color: var(--color-primary-200);
}
</style>
