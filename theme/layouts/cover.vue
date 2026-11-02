<script setup lang="ts">
import { computed } from 'vue'
import { configs } from '@slidev/client'
import { useSurface, type Scheme, type Surface } from '../composables/useSurface'

/**
 * The cover. The title is the slide's markdown (an h1; wrap words in `<span class="hot">` for the
 * second color). Everything else comes from frontmatter, falling back to `themeConfig.speaker`:
 *   subtitle, speaker, handle, partner (logo path), partnerLabel, event.
 * The partner line shows only when `partner` is set; `partnerLabel: ''` shows the logo alone.
 * `::bg::` takes an optional animated background (e.g. <CoverStream />).
 */
const props = withDefaults(defineProps<{
  surface?: Surface
  scheme?: Scheme
  subtitle?: string
  speaker?: string
  handle?: string
  partner?: string
  partnerLabel?: string
  event?: string
  frame?: boolean
  texture?: 'auto' | 'dots' | 'none'
}>(), { surface: 'base', scheme: 'auto', partnerLabel: 'in cooperation with', frame: true, texture: 'auto' })

const { classes, showFrame } = useSurface(props)
const speakerConfig = computed(() => ((configs.themeConfig as any)?.speaker ?? {}) as { name?: string; handle?: string })
const name = computed(() => props.speaker ?? speakerConfig.value.name)
const handle = computed(() => props.handle ?? speakerConfig.value.handle)
</script>

<template>
  <div class="slidev-layout kt-cover" :class="classes">
    <div class="kt-slide__bg"><slot name="bg" /></div>
    <div class="kt-cover__body">
      <div v-if="event" class="kt-cover__event">{{ event }}</div>
      <div class="kt-cover__title"><slot /></div>
      <div v-if="subtitle" class="kt-cover__sub">{{ subtitle }}</div>
      <div v-if="name" class="kt-cover__by">
        <Logo variant="symbol" class="kt-cover__logo" />
        <span>{{ name }}<template v-if="handle"> · {{ handle }}</template></span>
      </div>
      <div v-if="partner" class="kt-cover__partner">
        <span v-if="partnerLabel">{{ partnerLabel }}</span>
        <img :src="partner" alt="partner logo">
      </div>
    </div>
    <KitFrame v-if="showFrame" :symbol="false" />
  </div>
</template>

<style>
.slidev-layout.kt-cover {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 56px var(--kt-gutter);
}

.kt-cover__body {
  position: relative;
  z-index: 1;
  max-width: 860px;
}

.kt-cover__event {
  margin-bottom: 18px;
  font: 600 13px var(--font-family-mono);
  letter-spacing: var(--kt-track-label);
  text-transform: uppercase;
  color: var(--kt-cool);
}

.kt-cover__title h1 {
  margin: 0;
  font-size: 72px;
  font-weight: 800;
  line-height: 1.02;
  letter-spacing: -0.035em;
  color: var(--kt-heading);
}

.kt-scheme-light.kt-surface-base .kt-cover__title h1,
.kt-scheme-light.kt-surface-soft .kt-cover__title h1 {
  color: var(--color-primary-700);
}

.kt-cover__sub {
  margin-top: 22px;
  font-size: 26px;
  font-weight: 600;
  color: var(--kt-muted);
}

.kt-cover__by {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 44px;
  font: 600 15px var(--font-family-mono);
  color: var(--kt-muted);
}

.kt-cover__logo {
  height: 30px;
}

.kt-cover__partner {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 18px;
  font: 600 13px var(--font-family-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--kt-subtle);
}

.kt-cover__partner img {
  height: 24px;
}
</style>
