<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * The application, played as one story up the climb, Read to Space, through the architecture.
 * The map builds first (about 8 s): the laptop (offline) with the "second brain" (notes, in Obsidian),
 * kb-template's MCP vault server, and "ai-coach" (the coach CLI and its terminal, Ollama with Gemma 4B
 * and 12B), reaching over the boundary into the cloud around Gemini 4 Argon. One boundary, a gate, a lock.
 * Then one command after another types into the terminal; a chip names the climb step, only the parts
 * the command uses light up (composition.ts), tokens ride the wires, and a status pill over me says what
 * came out:
 *   read        a page, notes → kb-template → coach; my notes and summary back. No AI.
 *   synthesize  my marks to Gemma 4B; it asks, I answer; a concept note (◆) back to the vault
 *   group       the book's concepts to 4B; it asks about my layers; the structure note back
 *   generate    the title only; my guess, checked by Gemma 12B
 *   spar        4B asks, a weak answer, a follow-up, a better answer; 12B checks the round: Tier 1 passed
 *   judge       answer + claims over the gate to Argon: Tier 2 failed, the gaps
 *   study       4B, study partner: a hint, my explanation: gaps closed
 *   judge       again: Tier 2 passed
 *   elaborate   4B asks why; my answer goes into the note
 *   due · spar · judge   a day later the vault brings it back: Space; passed, the next reviews 7, 14, 30 … 365
 * Then a note tries to leave and stops at the lock: notes stay private.
 * Timed to the narration in the slide's notes (STEPS below).
 * No props.
 */
const uid = useId()
const id = (name: string) => `kt-arch-${name}-${uid}`

type PathKey = 'c1' | 'c2' | 'ask' | 'ans' | 'out' | 'back' | 'note'
type Token = 'page' | 'notes' | 'concept' | 'q' | 'ans' | 'weak' | 'hint' | 'explain' | 'packet' | 'fail' | 'pass' | 'layers' | 'leak'
type Part = 'vault' | 'coach' | '4b' | '12b' | 'argon'
type Ride = { token: Token; path: PathKey; a: number; b: number; reverse: boolean }
type Span = readonly [number, number]

const rides: Ride[] = []
const glows: { part: Part; span: Span; tone: string }[] = []
const statuses: { text: string; tone: string; span: Span }[] = []
const cmds: { text: string; at: number }[] = []
const chips: { text: string; at: number }[] = []
const roles: { text: string; at: number }[] = []

const ride = (token: Token, path: PathKey, a: number, dur = 1.0, reverse = false) => rides.push({ token, path, a, b: a + dur, reverse })
const glow = (part: Part, a: number, b: number, tone = 'pass') => glows.push({ part, span: [a, b], tone })
const status = (text: string, tone: string, a: number, b: number) => statuses.push({ text, tone, span: [a, b] })
const cmd = (text: string, a: number) => { cmds.push({ text, at: a }); glow('coach', a, a + 1.2, 'busy') }
// to the vault and back: notes → kb-template → coach, then on to Gemma 4B
const fromVault = (token: Token, a: number, to4b = false) => { ride(token, 'c1', a, 1.2); if (to4b) ride(token, 'c2', a + 1.2, 0.7) }
const toVault = (token: Token, a: number, from4b = false) => { if (from4b) ride(token, 'c2', a, 0.7, true); ride(token, 'c1', a + (from4b ? 0.7 : 0), 1.2, true) }

// the story, step by step; each starts on its sentence of the narration
const S = { read: 8, synth: 15, group: 23, generate: 30, spar: 36, judge: 45, study: 51, judge2: 56, elaborate: 61, due: 67, lock: 79 }

// 1 · Read: no AI
cmd('coach read', S.read); chips.push({ text: '1 · Read', at: S.read })
glow('vault', S.read + 0.6, S.read + 6.4)
fromVault('page', S.read + 0.8)
status('notes + summary · no AI', 'plain', S.read + 2.4, S.read + 4.4)
toVault('notes', S.read + 4.4)
status('✓ Read', 'pass', S.read + 5.6, S.synth)

// bridge · Synthesize: Gemma groups my marks, asks, drafts from my words
cmd('coach synthesize', S.synth); chips.push({ text: 'bridge · Synthesize', at: S.synth }); roles.push({ text: 'groups my marks', at: S.synth })
glow('vault', S.synth + 0.6, S.synth + 7.6)
fromVault('page', S.synth + 0.8, true)
glow('4b', S.synth + 2.6, S.synth + 5.6)
ride('q', 'ask', S.synth + 3.0, 0.8)
ride('ans', 'ask', S.synth + 4.2, 0.8, true)
toVault('concept', S.synth + 5.4, true)
status('◆ concept note', 'hot', S.synth + 7.0, S.group)

// 2 · Group: the concepts to Gemma, which asks about my layers
cmd('coach group', S.group); chips.push({ text: '2 · Group', at: S.group }); roles.push({ text: 'asks about layers', at: S.group })
glow('vault', S.group + 0.6, S.group + 6.6)
fromVault('concept', S.group + 0.8, true)
glow('4b', S.group + 2.6, S.group + 4.8)
ride('q', 'ask', S.group + 2.8, 0.8)
ride('layers', 'ask', S.group + 3.8, 0.8, true)
toVault('layers', S.group + 4.6, true)
status('✓ 4 layers I named', 'pass', S.group + 6.2, S.generate)

// 3 · Generate: the title only, my guess, Gemma 12B checks my "got it"s
cmd('coach generate', S.generate); chips.push({ text: '3 · Generate', at: S.generate })
glow('vault', S.generate + 0.6, S.generate + 2.2)
fromVault('concept', S.generate + 0.8)
status('title only, guess first', 'plain', S.generate + 2.0, S.generate + 3.6)
ride('ans', 'ans', S.generate + 3.0, 1.0)
glow('12b', S.generate + 4.0, S.generate + 5.6, 'check')
status('✓ checked · not graded', 'pass', S.generate + 4.6, S.spar)

// 4 · Retrieve: spar, then judge, study, judge
cmd('coach spar', S.spar); chips.push({ text: '4 · Retrieve', at: S.spar }); roles.push({ text: 'creates questions', at: S.spar })
glow('vault', S.spar + 0.6, S.spar + 2.6)
fromVault('concept', S.spar + 0.8, true)
glow('4b', S.spar + 2.4, S.spar + 6.0, 'ask')
ride('q', 'ask', S.spar + 2.6, 0.8)
ride('weak', 'ask', S.spar + 3.6, 0.8, true)
status('weak answer → follow-up', 'fail', S.spar + 4.2, S.spar + 6.4)
ride('q', 'ask', S.spar + 4.6, 0.8)
ride('ans', 'ans', S.spar + 5.8, 1.0)
glow('12b', S.spar + 6.8, S.spar + 8.6, 'check')
status('Tier 1 · passed', 'pass', S.spar + 7.4, S.judge)

cmd('coach judge', S.judge)
ride('packet', 'out', S.judge + 0.8, 1.8)
glow('argon', S.judge + 2.6, S.judge + 4.2, 'judge')
ride('fail', 'back', S.judge + 3.4, 1.6)
status('Tier 2 · failed · gaps', 'fail', S.judge + 5.0, S.study)

cmd('coach study', S.study); roles.push({ text: 'study partner', at: S.study })
glow('4b', S.study + 0.6, S.study + 4.4, 'study')
ride('hint', 'ask', S.study + 0.8, 0.9)
ride('explain', 'ask', S.study + 2.0, 0.9, true)
status('study · gaps closed', 'study', S.study + 3.2, S.judge2)

cmd('coach judge', S.judge2)
ride('packet', 'out', S.judge2 + 0.6, 1.6)
glow('argon', S.judge2 + 2.2, S.judge2 + 3.6, 'judge')
ride('pass', 'back', S.judge2 + 2.8, 1.4)
status('Tier 2 · passed', 'pass', S.judge2 + 4.2, S.elaborate)

// 5 · Elaborate: Gemma asks why; my answer goes into the note
cmd('coach elaborate', S.elaborate); chips.push({ text: '5 · Elaborate', at: S.elaborate }); roles.push({ text: 'asks why', at: S.elaborate })
glow('4b', S.elaborate + 0.6, S.elaborate + 3.4, 'ask')
ride('q', 'ask', S.elaborate + 0.8, 0.8)
ride('ans', 'ask', S.elaborate + 2.0, 0.8, true)
toVault('notes', S.elaborate + 3.0, true)
glow('vault', S.elaborate + 3.6, S.elaborate + 5.2)
status('why · link · use → note', 'pass', S.elaborate + 4.4, S.due)

// 6 · Space: a day later, due; spar and judge again; the gap grows
cmd('coach due', S.due); chips.push({ text: '6 · Space', at: S.due }); roles.push({ text: 'creates questions', at: S.due })
status('a day later: due today', 'plain', S.due + 0.4, S.due + 2.8)
glow('vault', S.due + 0.6, S.due + 2.6)
fromVault('concept', S.due + 0.8, true)
cmd('coach spar', S.due + 2.6)
glow('4b', S.due + 3.0, S.due + 4.8, 'ask')
ride('q', 'ask', S.due + 3.0, 0.7)
ride('ans', 'ans', S.due + 4.0, 0.9)
glow('12b', S.due + 4.9, S.due + 6.0, 'check')
cmd('coach judge', S.due + 6.0)
ride('packet', 'out', S.due + 6.4, 1.4)
glow('argon', S.due + 7.8, S.due + 8.8, 'judge')
ride('pass', 'back', S.due + 8.2, 1.2)
status('passed · back in 7 days', 'pass', S.due + 9.4, S.lock + 4)
const LADDER = S.due + 9.8

// the lock
ride('leak', 'note', S.lock, 1.2)
const LOCK_HIT: Span = [S.lock + 1.1, S.lock + 2.2]

const { t, at } = useTimeline(S.lock + 4)
const during = ([a, b]: Span) => t.value >= a && t.value < b
const clamp = (v: number) => Math.min(1, Math.max(0, v))
const ease = (p: number) => p * p * (3 - 2 * p)

// the paths the tokens ride
const pC1 = ref<SVGPathElement>()
const pC2 = ref<SVGPathElement>()
const pAsk = ref<SVGPathElement>()
const pAns = ref<SVGPathElement>()
const pOut = ref<SVGPathElement>()
const pBack = ref<SVGPathElement>()
const pNote = ref<SVGPathElement>()
const pathOf: Record<PathKey, typeof pC1> = { c1: pC1, c2: pC2, ask: pAsk, ans: pAns, out: pOut, back: pBack, note: pNote }
const pointAt = (el: SVGPathElement | undefined, p: number) => {
  if (!el) return 'translate(-99 -99)'
  const q = el.getPointAtLength(el.getTotalLength() * p)
  return `translate(${q.x.toFixed(1)} ${q.y.toFixed(1)})`
}
const live = computed(() => rides
  .filter(r => t.value >= r.a && t.value < r.b + 0.25)
  .map(r => {
    const p = ease(clamp((t.value - r.a) / (r.b - r.a)))
    return { ...r, key: `${r.token}${r.a}`, at: pointAt(pathOf[r.path].value, r.reverse ? 1 - p : p) }
  }))
const wireLive = (path: PathKey) => rides.some(r => r.path === path && during([r.a, r.b]))
const lit = (part: Part) => glows.find(g => g.part === part && during(g.span))?.tone ?? ''
const latest = <T extends { at: number }>(list: T[]) => list.reduce<T | null>((cur, x) => (t.value >= x.at ? x : cur), null)
const chip = computed(() => latest(chips))
const role = computed(() => latest(roles)?.text ?? 'creates questions')
const now = computed(() => statuses.find(s => during(s.span)) ?? null)

// the terminal: the last nine commands, the newest typing
const typed = (text: string, a: number) => text.slice(0, Math.round(text.length * clamp((t.value - a) / 0.5)))
const lines = computed(() => cmds.filter(c => t.value >= c.at).slice(-9).map((c, i, all) => ({
  text: typed(c.text, c.at),
  now: i === all.length - 1,
})))
</script>

<template>
  <svg class="kt-arch" viewBox="-24 0 928 456" role="img"
    aria-label="The application, one story up the climb through the architecture. On the laptop, offline: the second brain, my notes in Obsidian; kb-template's MCP vault server, the only way to the notes; and ai-coach: the coach CLI, and on Ollama Gemma 4B and Gemma 12B. In the cloud, still part of ai-coach: Gemini 4 Argon, the judge. Step 1, Read: coach read; a page comes from the vault, my notes and summary go back; no AI. The bridge, Synthesize: my marks go to Gemma 4B, it asks, I answer, a concept note goes back to the vault. Step 2, Group: the concepts go to Gemma 4B, it asks about my layers, the structure goes back. Step 3, Generate: the title only; my guess, checked by Gemma 12B. Step 4, Retrieve: coach spar; Gemma 4B asks, my weak answer gets a follow-up, my better answer is checked by Gemma 12B: Tier 1 passed. coach judge: my answer and claims cross to Argon: Tier 2 failed, the gaps. coach study: a hint, my explanation, gaps closed. coach judge again: Tier 2 passed. Step 5, Elaborate: Gemma asks why, my answer goes into the note. Step 6, Space: a day later the concept is due; spar and judge again; passed, back in 7 days, then 14, 30, up to 365. Then a note tries to leave and is stopped at the lock: notes stay private.">
    <defs>
      <clipPath :id="id('face')" clipPathUnits="objectBoundingBox"><circle cx="0.5" cy="0.5" r="0.5" /></clipPath>
      <marker :id="id('head')" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M1 1 L 9 5 L 1 9" class="kt-arch__head" />
      </marker>
    </defs>

    <!-- zones: the laptop and the cloud -->
    <g class="kt-arch__part" :class="{ 'is-on': at(0.1) }">
      <rect x="-20" y="4" width="644" height="448" rx="14" class="kt-arch__zone is-local" />
      <text x="-2" y="32" class="kt-arch__zonename is-local">laptop · offline</text>
      <rect x="664" y="4" width="236" height="448" rx="14" class="kt-arch__zone is-cloud" />
      <text x="682" y="32" class="kt-arch__zonename is-cloud">cloud</text>
    </g>

    <!-- the second brain: my notes, in Obsidian -->
    <g class="kt-arch__part" :class="{ 'is-on': at(0.3) }">
      <rect x="14" y="50" width="172" height="236" rx="14" class="kt-arch__home is-kb" />
      <text x="28" y="72" class="kt-arch__homename is-kb">second brain</text>
      <rect x="66" y="96" width="52" height="64" rx="5" class="kt-arch__note is-back" />
      <rect x="74" y="104" width="52" height="64" rx="5" class="kt-arch__note is-back" />
      <rect x="82" y="112" width="52" height="64" rx="5" class="kt-arch__note" />
      <path d="M90 130 h36 M90 141 h28 M90 152 h34 M90 163 h24" class="kt-arch__text" />
      <text x="100" y="210" text-anchor="middle" class="kt-arch__name is-big">notes</text>
      <image href="/images/logos/obsidian.webp" x="54" y="246" width="20" height="20" />
      <text x="80" y="262" class="kt-arch__tool">Obsidian</text>
    </g>

    <!-- kb-template: outside the second brain, the only way in -->
    <g class="kt-arch__part" :class="{ 'is-on': at(0.45) }">
      <path d="M100 290 V 314" class="kt-arch__wire" :class="{ 'is-live': wireLive('c1') }"
        :marker-start="`url(#${id('head')})`" :marker-end="`url(#${id('head')})`" />
      <rect x="24" y="318" width="152" height="64" rx="14" class="kt-arch__engine" :class="lit('vault') && 'is-pass'" />
      <image href="/images/logos/kb-template-mark.png" x="38" y="331" width="12" height="17" />
      <text x="56" y="345" class="kt-arch__name">kb-template</text>
      <text x="100" y="368" text-anchor="middle" class="kt-arch__does">MCP vault server</text>
    </g>

    <!-- ai-coach: the laptop part, and the arm over the boundary around the judge -->
    <g class="kt-arch__part" :class="{ 'is-on': at(0.6) }">
      <path d="M212 50 H 878 Q 892 50 892 64 V 236 Q 892 250 878 250 H 684 Q 670 250 670 236 V 96 Q 670 82 656 82
        H 494 Q 480 82 480 96 V 384 Q 480 398 466 398 H 212 Q 198 398 198 384 V 64 Q 198 50 212 50 Z" class="kt-arch__home is-coach" />
      <text x="212" y="72" class="kt-arch__homename is-coach">ai-coach</text>
      <path d="M176 350 H 204" class="kt-arch__wire" :class="{ 'is-live': wireLive('c1') }"
        :marker-start="`url(#${id('head')})`" :marker-end="`url(#${id('head')})`" />
      <text x="190" y="338" text-anchor="middle" class="kt-arch__label is-mcp">MCP</text>

      <!-- the coach: a CLI in my terminal; the commands type as the story goes -->
      <rect x="208" y="96" width="126" height="290" rx="14" class="kt-arch__engine is-local" :class="lit('coach') && 'is-busy'" />
      <text x="271" y="124" text-anchor="middle" class="kt-arch__name">coach</text>
      <text x="271" y="142" text-anchor="middle" class="kt-arch__does">CLI</text>
      <rect x="216" y="154" width="110" height="222" rx="8" class="kt-arch__term" />
      <circle cx="227" cy="166" r="2.8" class="kt-arch__dot is-r" />
      <circle cx="237" cy="166" r="2.8" class="kt-arch__dot is-y" />
      <circle cx="247" cy="166" r="2.8" class="kt-arch__dot is-g" />
      <text v-for="(l, i) in lines" :key="i" x="224" :y="192 + i * 20" class="kt-arch__passcmd" :class="{ 'is-now': l.now }">{{ l.text }}</text>
    </g>

    <!-- the climb step that plays -->
    <g class="kt-arch__pop" :class="{ 'is-on': chip }" transform="translate(372 64)">
      <rect x="-70" y="-13" width="140" height="26" rx="13" class="kt-arch__chip" />
      <text y="4.5" text-anchor="middle" class="kt-arch__chiptext">{{ chip?.text }}</text>
    </g>

    <!-- Ollama: Gemma 4B in its part of the moment, Gemma 12B the checker -->
    <g class="kt-arch__part" :class="{ 'is-on': at(0.8) }">
      <path d="M334 320 H 346" class="kt-arch__wire" :class="{ 'is-live': wireLive('c2') }" :marker-end="`url(#${id('head')})`" />
      <rect x="342" y="96" width="132" height="290" rx="14" class="kt-arch__group" />
      <text x="408" y="372" text-anchor="middle" class="kt-arch__ollama">Ollama</text>
      <rect x="350" y="112" width="116" height="64" rx="14" class="kt-arch__engine is-local" :class="lit('4b') && `is-${lit('4b')}`" />
      <image href="/images/logos/gemma-mark.png" x="360" y="126" width="17" height="17" />
      <text x="381" y="140" class="kt-arch__name">Gemma 4B</text>
      <text x="408" y="162" text-anchor="middle" class="kt-arch__does is-tight" :class="role === 'study partner' ? 'is-studytext' : 'is-ask'">{{ role }}</text>
      <rect x="350" y="232" width="116" height="64" rx="14" class="kt-arch__engine is-local" :class="lit('12b') && `is-${lit('12b')}`" />
      <image href="/images/logos/gemma-mark.png" x="355" y="246" width="17" height="17" />
      <text x="375" y="260" class="kt-arch__name">Gemma 12B</text>
      <text x="408" y="282" text-anchor="middle" class="kt-arch__does is-check">checks answers</text>
    </g>

    <!-- me -->
    <g class="kt-arch__part" :class="{ 'is-on': at(1.0) }">
      <circle cx="556" cy="144" r="36" class="kt-arch__glow" />
      <image href="/images/speaker.webp" x="526" y="114" width="60" height="60" :clip-path="`url(#${id('face')})`"
        preserveAspectRatio="xMidYMid slice" />
      <circle cx="556" cy="144" r="30" class="kt-arch__ring" />
      <text x="556" y="202" text-anchor="middle" class="kt-arch__name is-big">you</text>
      <path ref="pAsk" d="M468 140 H 522" class="kt-arch__wire is-ask" :class="{ 'is-live': wireLive('ask') }" />
      <path ref="pAns" d="M534 174 C 520 220 504 264 470 264" class="kt-arch__wire is-ans" :class="{ 'is-live': wireLive('ans') }" />
    </g>
    <!-- what came out of the step -->
    <g class="kt-arch__pop" :class="{ 'is-on': now }" transform="translate(556 94)">
      <rect x="-84" y="-12" width="168" height="24" rx="12" class="kt-arch__tier" :class="`is-${now?.tone}`" />
      <text y="4" text-anchor="middle" class="kt-arch__tiertext" :class="`is-${now?.tone}`">{{ now?.text }}</text>
    </g>

    <!-- the judge -->
    <g class="kt-arch__part" :class="{ 'is-on': at(1.2) }">
      <rect x="692" y="124" width="180" height="66" rx="14" class="kt-arch__engine is-cloud" :class="lit('argon') && 'is-judge'" />
      <image href="/images/logos/gemini-mark.png" x="702" y="140" width="18" height="18" />
      <text x="790" y="153" text-anchor="middle" class="kt-arch__name">Gemini 4 Argon</text>
      <text x="790" y="174" text-anchor="middle" class="kt-arch__does">judge</text>
    </g>

    <!-- Space: the next reviews, ai-coach's review ladder (DEFAULT_LADDER) -->
    <g class="kt-arch__part" :class="{ 'is-on': at(LADDER) }">
      <rect x="776" y="300" width="112" height="140" rx="12" class="kt-arch__ladder" />
      <text x="832" y="322" text-anchor="middle" class="kt-arch__laddertitle">next review</text>
    </g>
    <g v-for="(r, i) in ['7 days', '14 days', '30 days', '… 365 days']" :key="r" class="kt-arch__rung"
      :class="{ 'is-on': at(LADDER + 0.4 + i * 0.35), 'is-next': i === 0 }">
      <circle cx="794" :cy="346 + i * 24" r="4.5" class="kt-arch__rungdot" />
      <text x="806" :y="351 + i * 24" class="kt-arch__rungtext">{{ r }}</text>
    </g>

    <!-- the boundary: a gate where my answer passes, a lock where the notes stop -->
    <g class="kt-arch__part" :class="{ 'is-on': at(1.4) }">
      <path d="M644 0 V 362 M644 398 V 406 M644 446 V 456" class="kt-arch__boundary" />
      <path d="M635 362 h18 M635 398 h18" class="kt-arch__gate" />
      <path ref="pOut" d="M586 146 H 590 Q 600 146 600 156 V 380 Q 600 390 610 390 H 752 Q 762 390 762 380 V 192"
        class="kt-arch__wire is-out" :class="{ 'is-live': wireLive('out') }" />
      <path ref="pBack" d="M742 192 V 360 Q 742 370 732 370 H 626 Q 616 370 616 360 V 174 Q 616 164 606 164 H 588"
        class="kt-arch__wire is-back" :class="{ 'is-live': wireLive('back') }" />
      <path ref="pNote" d="M66 140 H 30 Q 20 140 20 150 V 416 Q 20 426 30 426 H 626" class="kt-arch__wire is-note"
        :class="{ 'is-live': wireLive('note') }" />
      <g transform="translate(644 426)">
        <circle r="18" class="kt-arch__lockbg" />
        <circle r="18" class="kt-arch__lockhit" :class="{ 'is-on': during(LOCK_HIT) }" />
        <path d="M-6 -3 v-5 a6 6 0 0 1 12 0 v5" class="kt-arch__shackle" />
        <rect x="-9" y="-3" width="18" height="13" rx="2.5" class="kt-arch__lockbody" />
      </g>
    </g>
    <text x="112" y="414" text-anchor="middle" class="kt-arch__part kt-arch__private" :class="{ 'is-on': at(LOCK_HIT[0]) }">🔒 notes stay private</text>

    <!-- the routes: notes → kb-template → coach, then coach → Gemma 4B -->
    <path ref="pC1" d="M100 196 V 350 H 214" class="kt-arch__route" />
    <path ref="pC2" d="M334 320 H 336 Q 346 320 346 310 V 154 Q 346 144 356 144" class="kt-arch__route" />

    <!-- the tokens: what each step carries -->
    <g v-for="r in live" :key="r.key" class="kt-arch__token is-on" :class="{ 'is-weak': r.token === 'weak', 'is-fail': r.token === 'fail', 'is-pass': r.token === 'pass' }" :transform="r.at">
      <template v-if="r.token === 'concept'">
        <path d="M0 -11 L11 0 L0 11 L-11 0 Z" class="kt-arch__cframe" />
        <path d="M0 -5 L5 0 L0 5 L-5 0 Z" class="kt-arch__ccore" />
      </template>
      <template v-else-if="r.token === 'q'">
        <circle r="10" class="kt-arch__q" />
        <text y="5" text-anchor="middle" class="kt-arch__qtext">?</text>
      </template>
      <template v-else-if="r.token === 'hint'">
        <rect x="-22" y="-11" width="44" height="22" rx="11" class="kt-arch__hint" />
        <text y="4" text-anchor="middle" class="kt-arch__hinttext">hint</text>
      </template>
      <template v-else-if="r.token === 'ans' || r.token === 'weak' || r.token === 'explain'">
        <rect x="-9" y="-11" width="18" height="22" rx="3" class="kt-arch__ans" :class="{ 'is-study': r.token === 'explain' }" />
        <path d="M-5 -5 h10 M-5 0 h10 M-5 5 h6" class="kt-arch__anslines" />
      </template>
      <template v-else-if="r.token === 'packet'">
        <rect x="-32" y="-14" width="64" height="28" rx="8" class="kt-arch__packet" />
        <text x="-19" y="5" text-anchor="middle" class="kt-arch__ptext">?</text>
        <path d="M-8 -5 h14 M-8 1 h14 M-8 7 h9" class="kt-arch__plines" />
        <path d="M20 -7 l7 7 -7 7 -7 -7z" class="kt-arch__claim" />
      </template>
      <template v-else-if="r.token === 'fail' || r.token === 'pass'">
        <rect x="-30" y="-14" width="60" height="28" rx="8" class="kt-arch__reply" />
        <path v-if="r.token === 'fail'" d="M-21 -4 L-13 4 M-13 -4 L-21 4" class="kt-arch__replytick" />
        <path v-else d="M-20 0 l4 4 8 -9" class="kt-arch__replytick" />
        <path d="M0 -5 h18 M0 1 h18 M0 7 h11" class="kt-arch__replylines" />
      </template>
      <template v-else-if="r.token === 'layers'">
        <rect x="-13" y="-12" width="26" height="6" rx="2" class="kt-arch__layer" />
        <rect x="-13" y="-3" width="26" height="6" rx="2" class="kt-arch__layer" />
        <rect x="-13" y="6" width="26" height="6" rx="2" class="kt-arch__layer" />
      </template>
      <template v-else>
        <rect x="-11" y="-14" width="22" height="28" rx="3" class="kt-arch__note" :class="{ 'is-mine': r.token === 'notes' }" />
        <path d="M-6 -6 h12 M-6 0 h9 M-6 6 h11" class="kt-arch__text is-thin" />
      </template>
    </g>
  </svg>
</template>

<style>
.kt-arch {
  width: 888px;
  margin: 0 -24px;
  /* the viewBox is 48 units wider than the 840px diagram it grew from: one dot more on each side */
  height: auto;
  overflow: visible;
  font-family: var(--font-family-sans);
}

.kt-arch__part,
.kt-arch__token {
  opacity: 0;
  transition: opacity 0.45s;
}

.kt-arch__part.is-on { opacity: 1; }
.kt-arch__token { transition: opacity 0.25s; }
.kt-arch__token.is-on { opacity: 1; }

.kt-arch__pop > * {
  transform: scale(0);
  transform-box: fill-box;
  transform-origin: center;
  transition: transform 0.35s cubic-bezier(0.3, 1.6, 0.5, 1);
}

.kt-arch__pop.is-on > * { transform: scale(1); }

/* zones */
.kt-arch__zone { stroke-width: 2.5; }
.kt-arch__zone.is-local { fill: color-mix(in srgb, var(--kt-c-primary) 8%, transparent); stroke: var(--kt-c-primary); }
.kt-arch__zone.is-cloud { fill: color-mix(in srgb, var(--kt-c-secondary) 8%, transparent); stroke: var(--kt-c-secondary); }
.kt-arch__zonename { font: 800 13px var(--font-family-mono); letter-spacing: 0.12em; text-transform: uppercase; }
.kt-arch__zonename.is-local { fill: var(--kt-cool); }
.kt-arch__zonename.is-cloud { fill: var(--kt-hot); }

/* homes, as on CoachLoop */
.kt-arch__home { stroke-width: 2.5; stroke-dasharray: 8 6; }
.kt-arch__home.is-kb { fill: color-mix(in srgb, var(--kt-good) 12%, transparent); stroke: var(--kt-good); }
.kt-arch__home.is-coach { fill: color-mix(in srgb, var(--kt-warn) 5%, transparent); stroke: var(--kt-warn); }
.kt-arch__homename { font: 800 13px var(--font-family-mono); text-transform: uppercase; letter-spacing: 0.08em; }
.kt-arch__homename.is-kb { fill: var(--kt-good); }
.kt-arch__homename.is-coach { fill: var(--kt-warn); }
.kt-arch__tool { font-size: 12px; font-weight: 700; fill: var(--kt-fg); }
.kt-arch__group {
  fill: color-mix(in srgb, var(--kt-heading) 5%, transparent);
  stroke: var(--kt-heading);
  stroke-width: 2.5;
  stroke-dasharray: 7 5;
}
.kt-arch__ollama { font-size: 16px; font-weight: 800; fill: var(--kt-heading); }

/* notes, boxes, names */
.kt-arch__note { fill: var(--kt-card); stroke: var(--kt-c-primary-soft); stroke-width: 1.5; }
.kt-arch__note.is-back { opacity: 0.5; }
.kt-arch__text { stroke: var(--kt-subtle); stroke-width: 3; stroke-linecap: round; }
.kt-arch__text.is-thin { stroke-width: 2.2; }
.kt-arch__engine { fill: var(--kt-code-bg); stroke: var(--kt-line-strong); stroke-width: 2.5; transition: stroke 0.3s, filter 0.3s; }
.kt-arch__engine.is-local { stroke: var(--kt-c-primary); }
.kt-arch__engine.is-cloud { stroke: var(--kt-c-secondary); }
.kt-arch__engine.is-busy { stroke: var(--kt-warn); filter: drop-shadow(0 0 10px var(--kt-warn)); }
.kt-arch__engine.is-ask { stroke: var(--kt-hot); filter: drop-shadow(0 0 10px var(--kt-hot)); }
.kt-arch__engine.is-fail { stroke: var(--kt-bad); filter: drop-shadow(0 0 10px var(--kt-bad)); }
.kt-arch__engine.is-check { stroke: var(--kt-good); filter: drop-shadow(0 0 10px var(--kt-good)); }
.kt-arch__engine.is-study { stroke: var(--kt-info); filter: drop-shadow(0 0 10px var(--kt-info)); }
.kt-arch__engine.is-judge { stroke: var(--kt-hot); filter: drop-shadow(0 0 12px var(--kt-hot)); }
.kt-arch__engine.is-pass { stroke: var(--kt-warn); filter: drop-shadow(0 0 10px var(--kt-warn)); }
.kt-arch__passcmd { font: 600 10.5px var(--font-family-mono); fill: var(--kt-muted); white-space: pre; }
.kt-arch__passcmd.is-now { fill: var(--kt-warn); font-weight: 800; }
.kt-arch__name { font-size: 15px; font-weight: 800; fill: var(--kt-heading); }
.kt-arch__name.is-big { font-size: 18px; }
.kt-arch__does { font: 600 11.5px var(--font-family-mono); fill: var(--kt-muted); }
.kt-arch__does.is-ask { fill: var(--kt-hot); font-weight: 800; }
.kt-arch__does.is-check { fill: var(--kt-good); font-weight: 800; }

/* the coach's terminal */
.kt-arch__term { fill: var(--kt-bg); stroke: var(--kt-line); stroke-width: 1.2; }
.kt-arch__dot.is-r { fill: var(--kt-bad); }
.kt-arch__dot.is-y { fill: var(--kt-warn); }
.kt-arch__dot.is-g { fill: var(--kt-good); }
.kt-arch__cmd { font: 600 12px var(--font-family-mono); fill: var(--kt-code-fg); white-space: pre; }
.kt-arch__cmd.is-concept { fill: var(--kt-warn); font-weight: 800; }
.kt-arch__cursor { fill: var(--kt-code-fg); animation: kt-arch-blink 1s steps(1) infinite; }

@keyframes kt-arch-blink {
  50% { opacity: 0; }
}

/* me */
.kt-arch__ring { fill: none; stroke: var(--kt-good); stroke-width: 3; }
.kt-arch__glow { fill: color-mix(in srgb, var(--kt-good) 24%, transparent); }

/* wires: static, and the one that plays lights up and flows */
.kt-arch__wire {
  fill: none;
  stroke: var(--kt-line-strong);
  stroke-width: 2.5;
  stroke-dasharray: 6 5;
  opacity: 0.55;
  transition: opacity 0.3s, stroke-width 0.3s;
}
.kt-arch__wire.is-ask { stroke: var(--kt-hot); }
.kt-arch__wire.is-ans { stroke: var(--kt-good); }
.kt-arch__wire.is-out { stroke: var(--kt-hot); }
.kt-arch__wire.is-back { stroke: var(--kt-good); }
.kt-arch__wire.is-live { opacity: 1; stroke-width: 3; animation: kt-arch-flow 1s linear infinite; }
.kt-arch__head { fill: none; stroke: var(--kt-line-strong); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.kt-arch__route { fill: none; stroke: none; }

@keyframes kt-arch-flow {
  to { stroke-dashoffset: -22; }
}

/* labels on the wires: a halo so a line never runs through them */
.kt-arch__label {
  font: 800 14px var(--font-family-mono);
  paint-order: stroke;
  stroke: var(--kt-bg);
  stroke-width: 5px;
  stroke-linejoin: round;
}
.kt-arch__label.is-mcp { font-size: 12px; fill: var(--kt-fg); }
.kt-arch__label.is-ans,
.kt-arch__label.is-back { fill: var(--kt-good); }
.kt-arch__private { font: 800 14px var(--font-family-mono); fill: var(--kt-fg); }

/* the boundary */
.kt-arch__boundary { fill: none; stroke: var(--kt-heading); stroke-width: 3; stroke-linecap: round; stroke-dasharray: 2 9; }
.kt-arch__gate { stroke: var(--kt-heading); stroke-width: 3; stroke-linecap: round; }
.kt-arch__lockbg { fill: var(--kt-bg); stroke: var(--kt-heading); stroke-width: 2.5; }
.kt-arch__lockhit { fill: var(--kt-tint-secondary); stroke: var(--kt-bad); stroke-width: 3.5; opacity: 0; transition: opacity 0.2s; }
.kt-arch__lockhit.is-on { opacity: 1; }
.kt-arch__shackle { fill: none; stroke: var(--kt-heading); stroke-width: 2.5; stroke-linecap: round; }
.kt-arch__lockbody { fill: var(--kt-heading); }

/* tokens */
.kt-arch__cframe { fill: var(--kt-code-bg); stroke: var(--kt-warn); stroke-width: 2.5; stroke-linejoin: round; }
.kt-arch__ccore { fill: var(--kt-info); }
.kt-arch__q { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); stroke-width: 2; }
.kt-arch__qtext { font: 900 13px var(--font-family-sans); fill: var(--kt-hot); }
.kt-arch__ans { fill: var(--kt-card); stroke: var(--kt-good); stroke-width: 1.8; }
.kt-arch__token.is-weak .kt-arch__ans { stroke: var(--kt-bad); stroke-dasharray: 3 2; }
.kt-arch__anslines { stroke: var(--kt-heading); stroke-width: 1.8; stroke-linecap: round; }
.kt-arch__packet { fill: var(--kt-bg); stroke: var(--kt-hot); stroke-width: 2.5; }
.kt-arch__ptext { font: 900 15px var(--font-family-sans); fill: var(--kt-hot); }
.kt-arch__plines { stroke: var(--kt-hot); stroke-width: 2; stroke-linecap: round; }
.kt-arch__claim { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); stroke-width: 2; stroke-linejoin: round; }
.kt-arch__reply { fill: var(--kt-bg); stroke: var(--kt-good); stroke-width: 2.5; }
.kt-arch__token.is-fail .kt-arch__reply { stroke: var(--kt-bad); }
.kt-arch__token.is-fail .kt-arch__replytick,
.kt-arch__token.is-fail .kt-arch__replylines { stroke: var(--kt-bad); }
.kt-arch__replytick { fill: none; stroke: var(--kt-good); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
.kt-arch__replylines { stroke: var(--kt-good); stroke-width: 2; stroke-linecap: round; }
.kt-arch__verdict { fill: var(--kt-good); }
.kt-arch__verdict.is-fail { fill: var(--kt-bad); }
.kt-arch__tier { fill: var(--kt-bg); stroke-width: 2.2; }
.kt-arch__ladder { fill: var(--kt-bg); stroke: color-mix(in srgb, var(--kt-good) 55%, transparent); stroke-width: 1.5; }
.kt-arch__laddertitle { font: 800 11px var(--font-family-mono); text-transform: uppercase; letter-spacing: 0.06em; fill: var(--kt-good); }
.kt-arch__rung { opacity: 0; transform: translateX(-8px); transition: opacity 0.35s, transform 0.4s ease-out; }
.kt-arch__rung.is-on { opacity: 1; transform: none; }
.kt-arch__rungdot { fill: color-mix(in srgb, var(--kt-good) 55%, transparent); }
.kt-arch__rungtext { font: 700 12px var(--font-family-mono); fill: var(--kt-muted); }
.kt-arch__rung.is-next .kt-arch__rungdot { fill: var(--kt-good); }
.kt-arch__rung.is-next .kt-arch__rungtext { fill: var(--kt-good); font-weight: 800; }
.kt-arch__tier.is-pass { stroke: var(--kt-good); }
.kt-arch__tier.is-fail { stroke: var(--kt-bad); }
.kt-arch__tiertext { font: 800 11px var(--font-family-mono); letter-spacing: -0.02em; }
.kt-arch__tiertext.is-pass { fill: var(--kt-good); }
.kt-arch__tiertext.is-fail { fill: var(--kt-bad); }
.kt-arch__tier.is-study { stroke: var(--kt-info); }
.kt-arch__tiertext.is-study { fill: var(--kt-info); }
.kt-arch__does.is-studytext { fill: var(--kt-info); font-weight: 800; }
.kt-arch__ans.is-study { stroke: var(--kt-info); }
.kt-arch__wire.is-ask.is-study { stroke: var(--kt-info); }
.kt-arch__does.is-tight { font-size: 10.5px; letter-spacing: -0.02em; }
.kt-arch__hint { fill: var(--kt-bg); stroke: var(--kt-info); stroke-width: 2.2; }
.kt-arch__hinttext { font: 800 11px var(--font-family-mono); fill: var(--kt-info); }
.kt-arch__verdicttick { fill: none; stroke: var(--kt-bg); stroke-width: 2.6; stroke-linecap: round; stroke-linejoin: round; }

/* step badges */
.kt-arch__badge { fill: var(--kt-bg); stroke: var(--kt-warn); stroke-width: 2.5; transition: fill 0.3s; }
.kt-arch__badge.is-now { fill: var(--kt-warn); }
.kt-arch__badgen { font: 900 13px var(--font-family-mono); fill: var(--kt-heading); }
.kt-arch__badge.is-now + .kt-arch__badgen { fill: var(--kt-bg); }

@media (prefers-reduced-motion: reduce) {
  .kt-arch__wire.is-live,
  .kt-arch__cursor { animation: none !important; }
}

/* the story: the climb step chip, the status pill's extra tones, the tokens' extra shapes */
.kt-arch__chip { fill: color-mix(in srgb, var(--kt-warn) 16%, var(--kt-bg)); stroke: var(--kt-warn); stroke-width: 1.8; }
.kt-arch__chiptext { font: 800 12px var(--font-family-mono); fill: var(--kt-warn); }
.kt-arch__tier.is-plain { stroke: var(--kt-line-strong); }
.kt-arch__tiertext.is-plain { fill: var(--kt-fg); }
.kt-arch__tier.is-hot { stroke: var(--kt-hot); }
.kt-arch__tiertext.is-hot { fill: var(--kt-hot); }
.kt-arch__layer { fill: color-mix(in srgb, var(--kt-good) 30%, var(--kt-bg)); stroke: var(--kt-good); stroke-width: 1.4; }
.kt-arch__note.is-mine { stroke: var(--kt-info); }
</style>
