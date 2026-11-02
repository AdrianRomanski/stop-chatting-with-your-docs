<script setup lang="ts">
import { useId } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * The PushBased wordmark at the centre of a push: wires grow outward from it and events travel
 * away along them. Sets up the pull-vs-push joke. No props.
 */
const { at } = useTimeline(2.4)
const uid = useId()
const rays = [
  { d: 'M470 120 C 560 120, 600 50, 720 50' },
  { d: 'M470 140 H 740' },
  { d: 'M470 160 C 560 160, 600 230, 720 230' },
  { d: 'M290 120 C 200 120, 160 50, 40 50' },
  { d: 'M290 140 H 20' },
  { d: 'M290 160 C 200 160, 160 230, 40 230' },
].map((r, i) => ({ ...r, id: `kt-bpush-r${i}-${uid}`, dur: 2.6 + (i % 3) * 0.4, begin: 0.8 + i * 0.25 }))
</script>

<template>
  <div class="kt-bpush">
    <svg viewBox="0 0 760 280" aria-hidden="true">
      <path v-for="r in rays" :id="r.id" :key="r.id" :d="r.d" class="kt-bpush__ray" :class="{ 'is-on': at(0.5) }" />
      <g v-for="r in rays" :key="`p${r.id}`" class="kt-bpush__evt" :class="{ 'is-on': at(r.begin) }">
        <circle r="6" />
        <animateMotion :dur="`${r.dur}s`" repeatCount="indefinite">
          <mpath :href="`#${r.id}`" />
        </animateMotion>
      </g>
    </svg>
    <div class="kt-bpush__logo" :class="{ 'is-on': at(0.1) }"><Logo variant="wordmark" /></div>
  </div>
</template>

<style>
.kt-bpush {
  position: relative;
  width: 700px;
  height: 258px;
  margin: 0 auto;
}

.kt-bpush svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.kt-bpush__ray {
  fill: none;
  stroke: var(--kt-c-primary-soft);
  stroke-width: 2;
  stroke-dasharray: 6 7;
  opacity: 0;
  transition: opacity 0.5s;
}

.kt-bpush__ray.is-on {
  opacity: 0.6;
  animation: kt-bpush-flow 1.2s linear infinite;
}

@keyframes kt-bpush-flow {
  to { stroke-dashoffset: -26; }
}

.kt-bpush__evt {
  opacity: 0;
  transition: opacity 0.3s;
}

.kt-bpush__evt.is-on { opacity: 1; }
.kt-bpush__evt circle { fill: var(--kt-hot); }

.kt-bpush__logo {
  position: absolute;
  left: 50%;
  top: 50%;
  padding: 24px 28px;
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.92);
  transition: opacity 0.4s, transform 0.4s;
}

.kt-bpush__logo.is-on {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.kt-bpush .kt-bpush__logo .kt-logo { display: block; width: 150px; height: auto; }
.kt-bpush .kt-bpush__logo .kt-logo svg { display: block; width: 100%; height: auto; }
</style>
