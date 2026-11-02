<script setup lang="ts">
import { computed } from 'vue'
import { configs } from '@slidev/client'

/**
 * Who is talking. Left: photo, name, roles, site and the PushBased logo. Right: the slot — a few
 * big lines about you (wrap words in <span class="hot">). Falls back to `themeConfig.speaker`
 * for name, handle, photo, roles and site, so a talk sets them once.
 * - `variant`: lines (the NG Vienna intro) | compact (photo and name centered, no lines)
 */
const props = withDefaults(defineProps<{
  name?: string
  handle?: string
  photo?: string
  roles?: string[]
  site?: string
  zoom?: number
  origin?: string
  variant?: 'lines' | 'compact'
  logo?: boolean
}>(), { variant: 'lines', logo: true })

const s = computed(() => ((configs.themeConfig as any)?.speaker ?? {}) as Record<string, any>)
const name = computed(() => props.name ?? s.value.name)
const handle = computed(() => props.handle ?? s.value.handle)
const photo = computed(() => props.photo ?? s.value.photo)
const roles = computed(() => props.roles ?? s.value.roles ?? [])
const site = computed(() => props.site ?? s.value.site)
const initials = computed(() => (name.value ?? '').split(' ').map((p: string) => p[0]).join('').slice(0, 2))
</script>

<template>
  <div class="kt-me" :class="`kt-me--${variant}`">
    <div class="kt-me__left">
      <div class="kt-me__who">
        <Photo :src="photo" :size="variant === 'compact' ? 170 : 116" :zoom="zoom ?? s.zoom ?? 1" :origin="origin ?? s.origin" :initials="initials" />
        <div>
          <div class="kt-me__name">{{ name }}</div>
          <div v-if="handle" class="kt-me__handle">{{ handle }}</div>
          <div v-for="r in roles" :key="r" class="kt-me__role">{{ r }}</div>
          <div v-if="site" class="kt-me__site">{{ site }}</div>
        </div>
      </div>
      <Logo v-if="logo && variant === 'lines'" variant="wordmark" class="kt-me__logo" />
    </div>
    <div v-if="variant === 'lines'" class="kt-me__lines kt-stagger"><slot /></div>
  </div>
</template>

<style>
.kt-me {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 40px;
  align-items: center;
  width: 860px;
  text-align: left;
}

.kt-me--compact {
  grid-template-columns: 1fr;
  justify-items: center;
}

.kt-me__who {
  display: flex;
  align-items: center;
  gap: 22px;
}

.kt-me--compact .kt-me__who {
  flex-direction: column;
  text-align: center;
}

.kt-me__name {
  white-space: nowrap;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--kt-heading);
}

.kt-me__handle {
  margin-top: 2px;
  font: 600 15px var(--font-family-mono);
  color: var(--kt-cool);
}

.kt-me__role {
  margin-top: 6px;
  font-size: 15px;
  line-height: 1.35;
  color: var(--kt-muted);
}

.kt-me__site {
  margin-top: 6px;
  font: italic 600 15px var(--font-family-sans);
  color: var(--kt-cool);
}

.kt-me__logo {
  height: 44px;
  margin-top: 44px;
}

.kt-me__lines > * {
  margin: 0;
  white-space: nowrap;
  font-size: 32px;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.03em;
  color: var(--kt-heading);
}
</style>
