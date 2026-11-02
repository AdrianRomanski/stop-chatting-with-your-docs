<script setup lang="ts">
/**
 * A meme as a story beat: set it up, show it, pay it off on the next slide.
 * - `variant`: reaction (a GIF or still, framed, at its own ratio)
 *   | macro (classic image macro: top and bottom text on the picture)
 *   | polaroid (a white frame with a hand-written-style caption under it)
 * - `top`, `bottom`: the macro texts; `caption`: the polaroid line
 * - `height` in px (default 300); `ratio` (e.g. "6/5") crops the picture to that shape, `position`
 *   says which part stays (e.g. "center top" to cut text printed at the bottom of the picture)
 * Check the rights of an image before a talk is published; prefer your own illustrations.
 */
withDefaults(defineProps<{
  src: string
  alt?: string
  variant?: 'reaction' | 'macro' | 'polaroid'
  top?: string
  bottom?: string
  caption?: string
  height?: number
  ratio?: string
  position?: string
  tilt?: number
}>(), { alt: '', variant: 'reaction', height: 300, position: 'center', tilt: 0 })
</script>

<template>
  <figure class="kt-meme" :class="`kt-meme--${variant}`" :style="{ '--kt-tilt': `${tilt}deg` }">
    <div class="kt-meme__frame" :style="ratio ? { height: `${height}px`, aspectRatio: ratio } : undefined">
      <img
        :src="src"
        :alt="alt"
        :class="{ 'is-cropped': ratio }"
        :style="ratio ? { objectPosition: position } : { height: `${height}px` }"
      >
      <template v-if="variant === 'macro'">
        <span v-if="top" class="kt-meme__macro is-top">{{ top }}</span>
        <span v-if="bottom" class="kt-meme__macro is-bottom">{{ bottom }}</span>
      </template>
    </div>
    <figcaption v-if="variant === 'polaroid' && caption">{{ caption }}</figcaption>
  </figure>
</template>

<style>
.kt-meme {
  margin: 0 auto;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  transform: rotate(var(--kt-tilt));
}

.kt-meme__frame {
  position: relative;
  overflow: hidden;
  line-height: 0;
}

.kt-meme img {
  display: block;
  width: auto;
}

.kt-meme--reaction .kt-meme__frame,
.kt-meme--macro .kt-meme__frame {
  border-radius: 14px;
  box-shadow: var(--kt-shadow);
}

.kt-meme img.is-cropped {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* macro: dark scrims behind the two texts, so white text reads on any picture */
.kt-meme--macro .kt-meme__frame::before,
.kt-meme--macro .kt-meme__frame::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 42%;
  pointer-events: none;
}

.kt-meme--macro .kt-meme__frame::before {
  top: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.62), transparent);
}

.kt-meme--macro .kt-meme__frame::after {
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.62), transparent);
}

/* the classic white text with a black outline, drawn with shadows so the letters keep their weight */
.kt-meme__macro {
  position: absolute;
  z-index: 1;
  left: 5%;
  right: 5%;
  font-family: var(--font-family-sans);
  font-size: 34px;
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: 0;
  text-align: center;
  text-transform: uppercase;
  color: #ffffff;
  text-shadow:
    2px 2px 0 #000, -2px 2px 0 #000, 2px -2px 0 #000, -2px -2px 0 #000,
    0 3px 0 #000, 0 -3px 0 #000, 3px 0 0 #000, -3px 0 0 #000,
    0 4px 14px rgba(0, 0, 0, 0.7);
}

.kt-meme__macro.is-top { top: 16px; }
.kt-meme__macro.is-bottom { bottom: 16px; }

.kt-meme--polaroid {
  padding: 14px 14px 0;
  background: #ffffff;
  box-shadow: var(--kt-shadow);
}

.kt-meme--polaroid figcaption {
  padding: 14px 6px 16px;
  font: italic 600 20px var(--font-family-sans);
  color: var(--color-neutral-800);
}
</style>
