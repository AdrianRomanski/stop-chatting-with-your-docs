<script setup lang="ts">
import { computed } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * D · Distill, one note in four layers (Forte's Progressive Summarization, Ch. 6): the captured
 * passage (Ch. 3, p. 44–45) as raw text, then its best phrases bold, then the best of the bold
 * highlighted while the rest fades, then a summary in your own words on top. The ladder on the
 * left lights the current layer. No props, no numbers.
 */
const { at } = useTimeline(5.2)
const layers = [
  { n: '4', label: 'your summary', at: 3.8 },
  { n: '3', label: 'highlight', at: 2.6 },
  { n: '2', label: 'bold', at: 1.4 },
  { n: '1', label: 'raw', at: 0.3 },
]
const layer = computed(() => layers.reduce((acc, l) => (at(l.at) && Number(l.n) > acc ? Number(l.n) : acc), 0))
</script>

<template>
  <div class="kt-dist" :class="`is-l${layer}`" role="img"
    aria-label="Progressive summarization of one note: raw text, then bold, then highlight, then a summary in your own words: feeling over logic, keep what resonates.">
    <!-- the ladder -->
    <ol class="kt-dist__ladder">
      <li v-for="l in layers" :key="l.n" class="kt-dist__step" :class="{ 'is-on': at(l.at), 'is-now': layer === Number(l.n) }">
        <b>{{ l.n }}</b> {{ l.label }}
      </li>
    </ol>

    <!-- the note -->
    <div class="kt-dist__note">
      <div class="kt-dist__file">note.md · BASB ch. 3</div>
      <div class="kt-dist__sum">Feeling over logic. Keep what resonates.</div>
      <p class="kt-dist__text">
        “<span class="is-b is-h">Don't make it an analytical decision</span>, and don't worry about why
        exactly it resonates—just look inside for <span class="is-b">a feeling of pleasure, curiosity,
        wonder, or excitement</span>, and <span class="is-b is-h">let that be your signal</span>.”
      </p>
    </div>

    <div class="kt-dist__tag" :class="{ 'is-on': at(4.5) }">distill when a project needs it, not on day one</div>
  </div>
</template>

<style>
.kt-dist {
  position: relative;
  display: flex;
  gap: 36px;
  align-items: flex-start;
  width: 880px;
  height: 330px;
  font-family: var(--font-family-sans);
}

.kt-dist__ladder {
  margin: 0;
  padding: 0;
  list-style: none;
  width: 200px;
  flex: none;
}

.kt-dist__step {
  margin-bottom: 14px;
  padding: 10px 14px;
  border: 2px solid var(--kt-line);
  border-radius: 10px;
  font: 16px var(--font-family-mono);
  color: var(--kt-subtle);
  opacity: 0;
  transition: opacity 0.4s, border-color 0.4s, color 0.4s, background 0.4s;
}

.kt-dist__step b { color: var(--kt-hot); margin-right: 6px; }
.kt-dist__step.is-on { opacity: 1; }
.kt-dist__step.is-now { border-color: var(--kt-hot); color: var(--kt-heading); background: var(--kt-tint-secondary); }

.kt-dist__note {
  flex: 1;
  padding: 20px 26px;
  border: 2px solid var(--kt-line-strong);
  border-radius: 12px;
  background: var(--kt-card);
}

.kt-dist__file { font: 13px var(--font-family-mono); color: var(--kt-subtle); }

/* layer 4: your own words, on top */
.kt-dist__sum {
  max-height: 0;
  margin: 0;
  overflow: hidden;
  border-left: 4px solid var(--kt-hot);
  padding: 0 14px;
  font-size: 24px;
  font-weight: 800;
  color: var(--kt-hot);
  opacity: 0;
  transition: max-height 0.6s ease-out, margin 0.6s, opacity 0.5s 0.2s;
}

.kt-dist.is-l4 .kt-dist__sum { max-height: 80px; margin: 14px 0 4px; opacity: 1; }

/* layer 1: raw */
.kt-dist__text {
  margin: 14px 0 0;
  font-size: 22px;
  line-height: 1.5;
  color: var(--kt-fg);
  transition: color 0.5s;
}

.kt-dist__text span {
  padding: 1px 2px;
  border-radius: 4px;
  transition: color 0.5s, background-size 0.6s ease-out;
  background: linear-gradient(var(--kt-tint-warning), var(--kt-tint-warning)) no-repeat left / 0 100%;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
}

/* layer 2: bold the best phrases */
.kt-dist.is-l2 .kt-dist__text .is-b,
.kt-dist.is-l3 .kt-dist__text .is-b,
.kt-dist.is-l4 .kt-dist__text .is-b { font-weight: 800; color: var(--kt-heading); }

/* layer 3: highlight the best of the bold; everything else steps back */
.kt-dist.is-l3 .kt-dist__text,
.kt-dist.is-l4 .kt-dist__text { color: var(--kt-subtle); }
.kt-dist.is-l3 .kt-dist__text .is-h,
.kt-dist.is-l4 .kt-dist__text .is-h { background-size: 100% 100%; color: var(--kt-heading); }

.kt-dist__tag {
  position: absolute;
  left: 236px;
  right: 0;
  bottom: 0;
  text-align: center;
  font: 600 16px var(--font-family-mono);
  color: var(--kt-hot);
  opacity: 0;
  transition: opacity 0.45s;
}

.kt-dist__tag.is-on { opacity: 1; }
</style>
