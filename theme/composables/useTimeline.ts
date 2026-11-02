import { onBeforeUnmount, onMounted, ref } from 'vue'
import { onSlideEnter, onSlideLeave } from '@slidev/client'

/**
 * The motion rule of the kit: an animation starts when its slide is shown, plays once, and starts
 * again the next time the slide is shown. No clicks. `t` is the time in seconds since the slide
 * was shown, `at(s)` tells whether second `s` has passed.
 *
 *   const { t, at } = useTimeline(4)        // runs for 4 s
 *   <g :class="{ 'is-on': at(1.2) }">        // appears after 1.2 s
 */
export function useTimeline(duration: number, options: { enabled?: boolean } = {}) {
  const enabled = options.enabled ?? true
  const t = ref(enabled ? 0 : Number.POSITIVE_INFINITY)
  let raf = 0
  let t0 = 0

  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  function tick(now: number) {
    t.value = (now - t0) / 1000
    if (t.value < duration) raf = requestAnimationFrame(tick)
  }

  function start() {
    if (!enabled) return
    cancelAnimationFrame(raf)
    if (reduced) {
      t.value = duration
      return
    }
    t0 = performance.now()
    t.value = 0
    raf = requestAnimationFrame(tick)
  }

  function stop() {
    cancelAnimationFrame(raf)
  }

  onMounted(start)
  onSlideEnter(start)
  onSlideLeave(stop)
  onBeforeUnmount(stop)

  return { t, at: (s: number) => t.value >= s, start }
}
