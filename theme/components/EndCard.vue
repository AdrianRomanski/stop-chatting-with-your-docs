<script setup lang="ts">
import { computed } from 'vue'
import { configs } from '@slidev/client'

/**
 * The last slide: thanks, how to reach you, and a QR code to the slides or the event page.
 * Falls back to `themeConfig.speaker` for name, handle, photo, roles and site.
 * - `qr`: the URL; `qrLabel`: the word under it (default "Slides")
 * - `tags`: topics under your name, e.g. ['JS', 'Performance', 'Architecture']
 * - slot: replaces the default thanks lines
 */
const props = withDefaults(defineProps<{
  title?: string
  thanks?: string
  ping?: string
  name?: string
  handle?: string
  photo?: string
  roles?: string[]
  site?: string
  tags?: string[]
  qr?: string
  qrLabel?: string
  zoom?: number
  origin?: string
}>(), { title: 'The end', thanks: 'Thanks for your time!', ping: 'Need help? Just ping me!', qrLabel: 'Slides' })

const s = computed(() => ((configs.themeConfig as any)?.speaker ?? {}) as Record<string, any>)
const name = computed(() => props.name ?? s.value.name)
const handle = computed(() => props.handle ?? s.value.handle)
const photo = computed(() => props.photo ?? s.value.photo)
const roles = computed(() => props.roles ?? s.value.roles ?? [])
const site = computed(() => props.site ?? s.value.site)
const initials = computed(() => (name.value ?? '').split(' ').map((p: string) => p[0]).join('').slice(0, 2))
const titleHtml = computed(() => props.title.replace(/(\S+)$/, '<span class="hot">$1</span>'))
</script>

<template>
  <div class="kt-end">
    <div class="kt-end__title" v-html="titleHtml" />
    <div class="kt-end__grid" :class="{ 'no-qr': !qr }">
      <Photo :src="photo" :size="176" :zoom="zoom ?? s.zoom ?? 1" :origin="origin ?? s.origin" :initials="initials" />
      <div>
        <slot>
          <div class="kt-end__thanks">{{ thanks }}</div>
          <div class="kt-end__ping">{{ ping }}</div>
        </slot>
        <div class="kt-end__name">{{ name }}<template v-if="handle"> · {{ handle }}</template></div>
        <div v-if="roles.length" class="kt-end__role">{{ roles.join(' / ') }}</div>
        <div v-if="site" class="kt-end__site">{{ site }}</div>
        <TagRow v-if="tags" :items="tags" class="kt-end__tags" />
      </div>
      <div v-if="qr" class="kt-end__qr">
        <QR :url="qr" :size="168" />
        <span>{{ qrLabel }}</span>
      </div>
    </div>
  </div>
</template>

<style>
.kt-end {
  width: 900px;
  text-align: left;
}

.kt-end__title {
  margin-bottom: 26px;
  text-align: center;
  font-size: 78px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--kt-heading);
}

.kt-end__grid {
  display: grid;
  grid-template-columns: 184px 1fr 190px;
  gap: 32px;
  align-items: center;
}

.kt-end__grid.no-qr { grid-template-columns: 184px 1fr; }

.kt-end__thanks {
  font-size: 40px;
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: var(--kt-heading);
}

.kt-end__ping {
  margin-top: 6px;
  font-size: 26px;
  font-weight: 600;
  color: var(--kt-fg);
}

.kt-end__name {
  margin-top: 22px;
  font-size: 20px;
  font-weight: 800;
  color: var(--kt-heading);
}

.kt-end__role {
  margin-top: 4px;
  font-size: 15px;
  color: var(--kt-muted);
}

.kt-end__site {
  margin-top: 2px;
  font: italic 600 15px var(--font-family-sans);
  color: var(--kt-cool);
}

.kt-end__tags { margin-top: 18px; }

.kt-end__qr {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.kt-end__qr span {
  font-size: 24px;
  font-weight: 800;
  color: var(--kt-hot);
}
</style>
