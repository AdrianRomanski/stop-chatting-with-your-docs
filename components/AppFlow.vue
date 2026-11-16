<script setup lang="ts">
/**
 * The whole application, one idea from start to finish, after "Ports and adapters".
 * The laptop and the cloud were drawn on the two slides before (Ports and adapters, VaultBoundary),
 * so this slide is only the steps. Each card is toned by its tag: INPUT and PREP blue,
 * PRACTICE green, EXAM red (the two steps that reach the cloud, like OFF | ONLINE under them and
 * the red ring on Argon), OUTPUT gold (like ON SITE under Teach).
 * Offline is white, online is red, everywhere: Gemma's ring and OFFLINE / OFF are white, Argon's
 * ring and ONLINE are red (green means PRACTICE only).
 * Gemma and Argon sit on dark discs: the Gemma mark's thin blue lines vanish on a white one.
 * - the steps, one card each, chevrons between: Read, the bridge Synthesize (◆: it makes the
 *   concept note, it isn't a climb step), then the climb, Group to Teach. A card: the number, the
 *   step, a tag (INPUT, PREP, PRACTICE for Group, Generate and Elaborate, EXAM for Retrieve and Space,
 *   brighter: questioned in one style, then in more, OUTPUT for Teach), two or three
 *   words on what I do, and the helper's mark at the foot (NO AI for Read and Teach, Gemma, Gemma + Argon in a red ring;
 *   Argon uses gemini-mark-centered.png, the mark cropped so the star sits in the middle).
 * - under each card: OFFLINE, ON SITE for Teach (in front of people, like this talk), or
 *   OFF | ONLINE for Retrieve and Space (spar offline, then the judge online).
 * Motion: none, the whole flow is there when the slide is shown.
 * Source: ai-performance-coach docs/guide/the-climb.md (steps, who does what), ADR-0047. No props.
 */
type Who = 'you' | 'gemma' | 'judge'
const steps: { n: string; name: string; you: string; who: Who; bridge?: boolean; tag: string }[] = [
  { n: '1', name: 'Read', you: 'note what resonates', who: 'you', tag: 'input' },
  { n: '◆', name: 'Synthesize', you: 'bold, highlight, summarize', who: 'gemma', bridge: true, tag: 'prep' },
  { n: '2', name: 'Group', you: 'concepts into areas', who: 'gemma', tag: 'practice' },
  { n: '3', name: 'Generate', you: 'write what I know', who: 'gemma', tag: 'practice' },
  { n: '4', name: 'Retrieve', you: 'one style', who: 'judge', tag: 'exam' },
  { n: '5', name: 'Elaborate', you: 'why · like · use', who: 'gemma', tag: 'practice' },
  { n: '6', name: 'Space', you: 'multiple styles', who: 'judge', tag: 'exam' },
  { n: '7', name: 'Teach', you: 'inspire others', who: 'you', tag: 'output' },
]
</script>

<template>
  <div class="kt-appflow" role="img"
    aria-label="The application flow. On the laptop, offline: 1, Read, note what resonates, no AI. The bridge, Synthesize, bold, highlight, summarize, with Gemma. 2, Group, concepts sorted into areas, with Gemma. 3, Generate, write what I know, with Gemma. 4, Retrieve, an exam, asked in one style, with Gemma, then Argon in the cloud, blind. 5, Elaborate, why, like, use, with Gemma. 6, Space, the exam again, in multiple styles, with Gemma, then Argon in the cloud, blind. 7, Teach, inspire others, no AI: on site, in front of people. Six steps run fully offline. Retrieve and Space spar offline, then reach the cloud for the judge, and only with my answer, never my notes.">
    <!-- the steps -->
    <div class="kt-appflow__grid kt-appflow__steps">
      <div v-for="s in steps" :key="s.name" class="kt-appflow__step" :class="`is-${s.tag}`" >
        <b class="kt-appflow__n">{{ s.n }}</b>
        <div class="kt-appflow__name">{{ s.name }}</div>
        <span class="kt-appflow__tag">{{ s.tag }}</span>
        <div class="kt-appflow__you">{{ s.you }}</div>
        <div class="kt-appflow__who">
          <span v-if="s.who === 'you'" class="is-none">no AI</span>
          <img v-if="s.who !== 'you'" src="/images/logos/gemma-mark.png" alt="Gemma">
          <img v-if="s.who === 'judge'" src="/images/logos/gemini-mark-centered.png" alt="Argon" class="is-cloud">
        </div>
      </div>
    </div>

    <!-- offline or online, per step -->
    <div class="kt-appflow__grid kt-appflow__net">
      <div v-for="s in steps" :key="s.name">
        <span v-if="s.name === 'Teach'" class="is-gold">on site</span>
        <span v-else-if="s.who !== 'judge'" class="is-off">offline</span>
        <span v-else class="is-both"><b>off</b><i>online</i></span>
      </div>
    </div>

  </div>
</template>

<style>
.kt-appflow { --gap: 14px; width: 940px; font-family: var(--font-family-sans); display: flex; flex-direction: column; gap: 16px; }
.kt-appflow__grid { display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); gap: var(--gap); }

/* the step cards, a chevron in every gap */
.kt-appflow__step {
  --tone: var(--kt-c-primary);
  position: relative; display: flex; flex-direction: column; align-items: center; text-align: center;
  height: 250px; padding: 16px 6px 16px;
  border: 2px solid color-mix(in srgb, var(--tone) 75%, transparent); border-radius: 16px;
  background: linear-gradient(180deg, color-mix(in srgb, var(--tone) 22%, var(--kt-card)), var(--kt-card) 65%);
}
.kt-appflow__step.is-input { --tone: var(--kt-info); }
.kt-appflow__step.is-prep { --tone: var(--kt-info); }
.kt-appflow__step.is-practice { --tone: var(--kt-good); }
.kt-appflow__step.is-exam { --tone: var(--kt-c-secondary); }
.kt-appflow__step.is-output { --tone: var(--kt-c-warning); }
.kt-appflow__step + .kt-appflow__step::before { content: '›'; position: absolute; left: calc(var(--gap) / -2 - 5px); top: 34px; font-size: 22px; font-weight: 800; line-height: 1; color: var(--kt-muted); }
.kt-appflow__n { flex: none; display: grid; place-items: center; width: 34px; height: 34px; border-radius: 50%; background: var(--tone); color: var(--kt-bg); font-size: 16px; font-weight: 800; }
.kt-appflow__name { margin-top: 10px; font-size: 16px; font-weight: 800; letter-spacing: -0.02em; color: var(--kt-heading); }
.kt-appflow__tag { margin-top: 5px; padding: 1px 8px; border-radius: 999px; border: 1.5px solid var(--tone); background: color-mix(in srgb, var(--tone) 18%, transparent); color: color-mix(in srgb, var(--tone) 60%, var(--kt-heading)); font-size: 10.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }
.kt-appflow__you { margin-top: 8px; font-size: 14.5px; line-height: 1.3; font-weight: 600; color: var(--kt-muted); }
.kt-appflow__who { margin-top: auto; display: flex; align-items: center; justify-content: center; gap: 6px; height: 44px; }
.kt-appflow__who img { box-sizing: border-box; width: 40px; height: 40px; padding: 3px; border-radius: 50%; object-fit: contain; background: var(--kt-code-bg); border: 2px solid var(--kt-fg); box-shadow: 0 0 0 3px color-mix(in srgb, var(--kt-fg) 15%, transparent); }
.kt-appflow__step.is-exam .kt-appflow__who img { width: 34px; height: 34px; padding: 3px; }
.kt-appflow__step .kt-appflow__who img.is-cloud { padding: 5px; border-color: var(--kt-bad); box-shadow: 0 0 0 3px color-mix(in srgb, var(--kt-bad) 25%, transparent); }
.kt-appflow__who .is-none { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: var(--kt-muted); }

/* offline or online, under each card: six steps fully offline, Retrieve and Space spar offline, then the judge online */
.kt-appflow__net > div { display: flex; justify-content: center; }
.kt-appflow__net span { flex: none; display: flex; align-items: center; height: 24px; border-radius: 999px; font-size: 11.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; white-space: nowrap; overflow: hidden; }
.kt-appflow__net .is-off { border: 1.5px solid var(--kt-fg); color: var(--kt-fg); background: color-mix(in srgb, var(--kt-fg) 8%, transparent); }
.kt-appflow__net .is-off, .kt-appflow__net .is-gold { box-sizing: border-box; width: 100%; justify-content: center; }
.kt-appflow__net .is-gold { border: 1.5px solid var(--kt-warn); color: var(--kt-bg); background: var(--kt-warn); }
.kt-appflow__net .is-both { overflow: visible; display: grid; grid-template-columns: 1fr 1fr; box-sizing: border-box; width: 100%; font-size: 10px; }
.kt-appflow__net .is-both b, .kt-appflow__net .is-both i { display: flex; align-items: center; height: 100%; justify-content: center; padding: 0; letter-spacing: 0; font-style: normal; font-weight: 800; }
.kt-appflow__net .is-both b { box-sizing: border-box; color: var(--kt-fg); background: color-mix(in srgb, var(--kt-fg) 8%, transparent); border: 1.5px solid var(--kt-fg); border-right: none; border-radius: 999px 0 0 999px; }
.kt-appflow__net .is-both i { box-sizing: border-box; color: var(--kt-bg); background: var(--kt-bad); border: 1.5px solid var(--kt-bad); border-radius: 0 999px 999px 0; }

</style>
