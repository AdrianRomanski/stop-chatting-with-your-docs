<script setup lang="ts">
/**
 * The code box of the design guide's snippet generator: traffic lights, file name top-right,
 * rounded, light or dark with the slide. Put a fenced code block inside.
 * - `file`: the file name (add "(simplified)" when the code is trimmed)
 * - `where`: where the code runs — both (browser + server) | server | browser,
 *   or its layer in a hexagonal app — domain | adapter | app
 * - `tone`: a 3 px top bar — primary | good | bad
 * - `size`: sm (14 px) | md (17 px, default) | lg (20 px)
 * Mark words with a first line `// @hl word other` (see setup/shiki.ts).
 */
withDefaults(defineProps<{
  file?: string
  where?: 'both' | 'server' | 'browser' | 'domain' | 'adapter' | 'app'
  tone?: 'primary' | 'good' | 'bad'
  size?: 'sm' | 'md' | 'lg'
}>(), { size: 'md' })

const WHERE = {
  both: 'browser + server', server: 'server only', browser: 'browser only',
  domain: 'domain · no I/O', adapter: 'adapter', app: 'app · composition root',
}
</script>

<template>
  <div class="kt-code" :class="[tone && `kt-code--${tone}`, `kt-code--${size}`]">
    <div class="kt-code__bar">
      <i /><i /><i />
      <span v-if="where" class="kt-code__where" :class="`is-${where}`">{{ WHERE[where] }}</span>
      <span v-if="file" class="kt-code__file">{{ file }}</span>
    </div>
    <div class="kt-code__body"><slot /></div>
  </div>
</template>
