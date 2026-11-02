import { computed } from 'vue'
import { configs, useDarkMode } from '@slidev/client'

export type Surface = 'base' | 'soft' | 'accent-1' | 'accent-2' | 'inverse'
export type Scheme = 'auto' | 'light' | 'dark'

/**
 * The classes every layout puts on its root: which scheme the slide renders in (the talk's mode,
 * a per-slide `scheme:`, or the opposite one for `surface: inverse`), which background it sits on,
 * and whether that background is dark (logos, textures and images read `kt-tone-dark`).
 */
export function useSurface(props: { surface?: Surface; scheme?: Scheme; texture?: 'auto' | 'dots' | 'none'; frame?: boolean }) {
  const { isDark } = useDarkMode()

  const schemeDark = computed(() => {
    let dark = props.scheme === 'dark' ? true : props.scheme === 'light' ? false : isDark.value
    if (props.surface === 'inverse') dark = !dark
    return dark
  })

  const accent = computed(() => props.surface === 'accent-1' || props.surface === 'accent-2')
  const toneDark = computed(() => accent.value || schemeDark.value)

  const classes = computed(() => [
    'kt-slide',
    schemeDark.value ? 'kt-scheme-dark' : 'kt-scheme-light',
    `kt-surface-${props.surface === 'inverse' || !props.surface ? 'base' : props.surface}`,
    toneDark.value ? 'kt-tone-dark' : 'kt-tone-light',
    { 'kt-texture': props.texture === 'dots' || ((props.texture ?? 'auto') === 'auto' && toneDark.value) },
  ])

  // the frame (logo bottom-left, event logo bottom-right) is on unless the talk or the slide turns it off
  const showFrame = computed(() => props.frame !== false && (configs.themeConfig as any)?.frame !== false)

  return { classes, schemeDark, toneDark, showFrame }
}
