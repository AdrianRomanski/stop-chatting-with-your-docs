<script setup lang="ts">
/**
 * The whole application, one idea from start to finish, after "Ports and adapters".
 * Three bands, top to bottom:
 * - cloud · online: empty, except Argon over the two steps that go online, Retrieve and Space,
 *   each joined to its step by a dashed line ("blind": it sees my answer, never my notes).
 * - the steps, one card each, chevrons between: Read, the bridge Synthesize (dashed: it makes the
 *   concept note, it isn't a climb step), then the climb, Group to Teach. A card: the number, the
 *   step, an EXAM tag on Retrieve and Space (questioned in one style, then in more), two or three words on what I do, and the helper's mark at the foot (none, Gemma, Gemma + Argon).
 * - under each card: OFFLINE (five steps), ON SITE for Teach (in front of people, like this talk), or OFF | ONLINE for Retrieve and Space (spar offline, then the judge online).
 * - laptop · offline: my notes in Obsidian, kb-template over MCP, Gemma on Ollama.
 * Motion: none, the whole flow is there when the slide is shown.
 * Source: ai-performance-coach docs/guide/the-climb.md (steps, who does what), ADR-0047. No props.
 */
type Who = 'you' | 'gemma' | 'judge'
const steps: { n: string; name: string; you: string; who: Who; bridge?: boolean; exam?: boolean }[] = [
  { n: '1', name: 'Read', you: 'raw text → notes that resonate', who: 'you' },
  { n: '◆', name: 'Synthesize', you: 'bold, highlight, summarize', who: 'gemma', bridge: true },
  { n: '2', name: 'Group', you: 'concepts into areas', who: 'gemma' },
  { n: '3', name: 'Generate', you: 'write what I know, unasked', who: 'gemma' },
  { n: '4', name: 'Retrieve', you: 'one style', who: 'judge', exam: true },
  { n: '5', name: 'Elaborate', you: 'why · like · use', who: 'gemma' },
  { n: '6', name: 'Space', you: 'day · week · month later', who: 'judge', exam: true },
  { n: '7', name: 'Teach', you: 'inspire others', who: 'gemma' },
]
</script>

<template>
  <div class="kt-appflow" role="img"
    aria-label="The application flow. On the laptop, offline: 1, Read, raw material into notes that resonate, no AI. The bridge, Synthesize, bold, highlight, summarize, with Gemma. 2, Group, concepts sorted into areas, with Gemma. 3, Generate, write what I know about the concept without being asked, with Gemma. 4, Retrieve, an exam, asked in one style, with Gemma, then Argon in the cloud, blind. 5, Elaborate, why, like, use, with Gemma. 6, Space, the exam again: a day, a week or a month later, in more and more styles, with Gemma, then Argon in the cloud, blind. 7, Teach, inspire others, with Gemma: on site, in front of people. The laptop holds my notes in Obsidian, kb-template over MCP, and Gemma on Ollama. Six steps run fully offline. Retrieve and Space spar offline, then reach the cloud for the judge, and only with my answer, never my notes.">
    <!-- cloud · online -->
    <div class="kt-appflow__band is-cloud">
      <span class="kt-appflow__where">cloud · online</span>
      <div class="kt-appflow__grid">
        <div v-for="s in steps" :key="s.name" class="kt-appflow__slot">
          <span v-if="s.who === 'judge'" class="kt-appflow__argon"><img src="/images/logos/gemini-mark.png" alt="">Argon<em>blind</em></span>
        </div>
      </div>
    </div>

    <!-- the steps -->
    <div class="kt-appflow__grid kt-appflow__steps">
      <div v-for="s in steps" :key="s.name" class="kt-appflow__step" :class="[`is-${s.who}`, { 'is-bridge': s.bridge }]">
        <b class="kt-appflow__n">{{ s.n }}</b>
        <div class="kt-appflow__name">{{ s.name }}</div>
        <span v-if="s.exam" class="kt-appflow__exam">exam</span>
        <div class="kt-appflow__you">{{ s.you }}</div>
        <div class="kt-appflow__who">
          <span v-if="s.who === 'you'" class="is-none">no AI</span>
          <img v-if="s.who !== 'you'" src="/images/logos/gemma-mark.png" alt="Gemma">
          <img v-if="s.who === 'judge'" src="/images/logos/gemini-mark.png" alt="Argon">
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

    <!-- laptop · offline -->
    <div class="kt-appflow__band is-laptop">
      <span class="kt-appflow__where">laptop · offline</span>
      <span class="kt-appflow__item"><img src="/images/logos/obsidian.webp" alt="">my notes · Obsidian</span>
      <span class="kt-appflow__item"><img src="/images/logos/kb-template-mark.png" alt="">kb-template · MCP</span>
      <span class="kt-appflow__item"><img src="/images/logos/gemma-mark.png" alt="">Gemma · Ollama</span>
    </div>
  </div>
</template>

<style>
.kt-appflow { --gap: 14px; width: 940px; font-family: var(--font-family-sans); display: flex; flex-direction: column; gap: 12px; }
.kt-appflow__grid { display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); gap: var(--gap); }

/* the two bands */
.kt-appflow__band { position: relative; display: flex; align-items: center; gap: 28px; padding: 0 18px; border-radius: 14px; }
.kt-appflow__where { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; white-space: nowrap; }
.kt-appflow__band.is-cloud { height: 50px; padding: 0; border: 1.5px dashed color-mix(in srgb, var(--kt-bad) 60%, transparent); background: color-mix(in srgb, var(--kt-bad) 6%, transparent); }
.kt-appflow__band.is-cloud .kt-appflow__where { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: color-mix(in srgb, var(--kt-bad) 80%, var(--kt-fg)); }
.kt-appflow__band.is-cloud .kt-appflow__grid { width: 100%; }
.kt-appflow__band.is-laptop { height: 52px; border: 1.5px solid color-mix(in srgb, var(--kt-c-primary) 70%, transparent); background: color-mix(in srgb, var(--kt-c-primary) 10%, transparent); justify-content: space-between; }
.kt-appflow__band.is-laptop .kt-appflow__where { color: var(--kt-c-primary-soft); }
.kt-appflow__item { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 700; color: var(--kt-heading); white-space: nowrap; }
.kt-appflow__item img { box-sizing: border-box; width: 30px; height: 30px; padding: 5px; border-radius: 50%; object-fit: contain; background: color-mix(in srgb, var(--kt-fg) 92%, transparent); }

/* Argon, over Retrieve and Space, a dashed line down into the step */
.kt-appflow__slot { position: relative; display: flex; align-items: center; justify-content: center; }
.kt-appflow__argon { position: relative; flex: none; display: flex; align-items: center; gap: 6px; height: 32px; padding: 0 12px; border-radius: 999px; border: 1.5px solid var(--kt-bad); background: var(--kt-card); font-size: 14px; font-weight: 800; color: var(--kt-heading); white-space: nowrap; }
.kt-appflow__argon img { width: 18px; height: 18px; }
.kt-appflow__argon em { font-style: normal; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--kt-bad); }
.kt-appflow__argon::after { content: ''; position: absolute; left: 50%; top: 31px; height: 22px; border-left: 2px dashed var(--kt-bad); }

/* the step cards, a chevron in every gap */
.kt-appflow__step {
  --tone: var(--kt-c-primary);
  position: relative; display: flex; flex-direction: column; align-items: center; text-align: center;
  height: 204px; padding: 12px 6px 12px;
  border: 2px solid color-mix(in srgb, var(--tone) 75%, transparent); border-radius: 16px;
  background: linear-gradient(180deg, color-mix(in srgb, var(--tone) 14%, var(--kt-card)), var(--kt-card) 60%);
}
.kt-appflow__step + .kt-appflow__step::before { content: '›'; position: absolute; left: calc(var(--gap) / -2 - 5px); top: 30px; font-size: 22px; font-weight: 800; line-height: 1; color: var(--kt-muted); }
.kt-appflow__step.is-bridge { --tone: var(--kt-hot); border-style: dashed; }
.kt-appflow__step.is-judge { --tone: var(--kt-bad); }
.kt-appflow__n { flex: none; display: grid; place-items: center; width: 30px; height: 30px; border-radius: 50%; background: var(--tone); color: var(--kt-bg); font-size: 14px; font-weight: 800; }
.kt-appflow__name { margin-top: 8px; font-size: 15px; font-weight: 800; letter-spacing: -0.01em; color: var(--kt-heading); }
.kt-appflow__exam { margin-top: 5px; padding: 1px 8px; border-radius: 999px; background: var(--kt-bad); color: var(--kt-bg); font-size: 10.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; }
.kt-appflow__you { margin-top: 4px; font-size: 13.5px; line-height: 1.3; font-weight: 600; color: var(--kt-muted); }
.kt-appflow__who { margin-top: auto; display: flex; align-items: center; justify-content: center; gap: 6px; height: 34px; }
.kt-appflow__who img { box-sizing: border-box; width: 34px; height: 34px; padding: 6px; border-radius: 50%; background: color-mix(in srgb, var(--kt-fg) 92%, transparent); }
.kt-appflow__who .is-none { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: var(--kt-muted); }

/* offline or online, under each card: six steps fully offline, Retrieve and Space spar offline, then the judge online */
.kt-appflow__net > div { display: flex; justify-content: center; }
.kt-appflow__net span { flex: none; display: flex; align-items: center; height: 24px; border-radius: 999px; font-size: 11.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; white-space: nowrap; overflow: hidden; }
.kt-appflow__net .is-off { padding: 0 12px; border: 1.5px solid var(--kt-good); color: var(--kt-good); background: color-mix(in srgb, var(--kt-good) 12%, transparent); }
.kt-appflow__net .is-gold { padding: 0 9px; border: 1.5px solid var(--kt-warn); color: var(--kt-bg); background: var(--kt-warn); font-size: 11px; letter-spacing: 0; }
.kt-appflow__net .is-both { border: 1.5px solid var(--kt-bad); }
.kt-appflow__net .is-both b, .kt-appflow__net .is-both i { display: flex; align-items: center; height: 100%; padding: 0 8px; letter-spacing: 0.03em; font-style: normal; font-weight: 800; }
.kt-appflow__net .is-both b { color: var(--kt-good); background: color-mix(in srgb, var(--kt-good) 12%, transparent); }
.kt-appflow__net .is-both i { color: var(--kt-bg); background: var(--kt-bad); }

</style>
