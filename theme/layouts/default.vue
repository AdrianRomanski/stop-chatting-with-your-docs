<script setup lang="ts">
import { useSurface, type Scheme, type Surface } from '../composables/useSurface'

/**
 * The master layout: every slide that isn't a cover, a split or a full-bleed image.
 * - `align`: `top` for content slides (title top-left), `center` for statements and big numbers,
 *   `left` for a left-aligned statement.
 * - `surface`: base (follows the mode) | soft (circle gradients) | accent-1 (purple) | accent-2 (red) | inverse.
 * - `scheme`: override the talk's mode for this one slide.
 * - `kicker` sits top-left, `caption` bottom-left (a source line), the frame in the bottom corners.
 * - A `::bg::` slot draws behind the content.
 */
const props = withDefaults(defineProps<{
  surface?: Surface
  scheme?: Scheme
  align?: 'top' | 'center' | 'left'
  kicker?: string
  caption?: string
  frame?: boolean
  texture?: 'auto' | 'dots' | 'none'
}>(), { surface: 'base', scheme: 'auto', align: 'top', frame: true, texture: 'auto' })

const { classes, showFrame } = useSurface(props)
</script>

<template>
  <div class="slidev-layout" :class="[...classes, `kt-align-${align}`]">
    <div class="kt-slide__bg"><slot name="bg" /></div>
    <div v-if="kicker" class="kt-kicker">{{ kicker }}</div>
    <div class="kt-slide__body"><slot /></div>
    <div v-if="caption" class="kt-caption">{{ caption }}</div>
    <KitFrame v-if="showFrame" />
  </div>
</template>
