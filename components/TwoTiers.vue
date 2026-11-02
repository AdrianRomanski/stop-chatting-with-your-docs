<script setup lang="ts">
import { computed, useId } from 'vue'
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * The architecture: two tiers, one boundary. Pays off PullPush's push panel with the same node
 * shapes (the 52 × 64 note, the code-bg engine box, your photo in a ring, dashed wires).
 * - `compact`: false (the full architecture) | true (the boundary only, for the judge statement)
 *
 * Full: on the laptop, offline, two homes, as on CoachLoop. "second brain" (Obsidian, kb-template):
 * "notes", the vault, reached only through "kb-template · MCP vault server".
 * "ai-coach": the "coach" CLI, talking MCP to the vault server, and a dashed "Ollama"
 * group with "Gemma 4B · creates questions" and "Gemma 12B · checks answers"; one turn every 6 s:
 * the concept note (the diamond) travels from the vault through kb-template and the coach to 4B,
 * 4B glows and a "?" travels to me, my answer travels down to 12B, 12B glows and a ✓ pops.
 * You talk with the judge too: the packet leaves from you, and Argon's verdict and gaps come back
 * to you on a green line through the same gate. The note that tries leaves from the vault.
 * The ai-coach box reaches over the boundary into the cloud and around the judge: Argon is ai-coach's
 * Judge port with the adapter-gemini adapter, just a different adapter than Ollama's.
 * In the cloud, "Gemini 4 Argon · judge". Compact: you and your notes on the laptop, the judge in
 * the cloud. In both, only the packet "challenge + answer + your claims" crosses the gate; a note
 * that tries is stopped at the lock and slides back.
 */
const props = withDefaults(defineProps<{ compact?: boolean }>(), { compact: false })
const { at } = useTimeline(props.compact ? 3 : 5)
const uid = useId()
const id = (name: string) => `kt-tiers-${name}-${uid}`
const full = computed(() => !props.compact)
const PACKET = 'challenge + answer + your claims'

// geometry and timing per mode
const g = computed(() => full.value
  ? {
      vb: '0 0 880 392', local: { x: 4, w: 620 }, cloud: { x: 664, w: 212 }, h: 384, line: 644,
      gate: 324, lock: 366, end: 392,
      cross: 'M582 132 H 586 Q 596 132 596 142 V 324 Q 596 334 606 334 H 750 Q 760 334 760 324 V 174',
      label: { x: 536, y: 352, anchor: 'end' },
      note: 'M66 120 H 30 Q 22 120 22 128 V 356 Q 22 366 32 366 H 626',
      noteLabel: { x: 150, y: 358 },
      judge: { x: 680, y: 110, w: 180 },
      tl: { zones: 0.1, cloud: 0.2, boundary: 2.3, judge: 2.5, cross: 2.8, packet: 3.0, note: 3.4, noteGo: 3.6 },
    }
  : {
      vb: '0 0 780 236', local: { x: 6, w: 394 }, cloud: { x: 440, w: 334 }, h: 224, line: 420,
      gate: 96, lock: 184, end: 236,
      cross: 'M104 96 H 548',
      label: { x: 262, y: 70, anchor: 'middle' },
      note: 'M118 184 H 384',
      noteLabel: { x: 262, y: 170 },
      judge: { x: 548, y: 66, w: 190 },
      tl: { zones: 0.1, cloud: 0.2, boundary: 0.6, judge: 0.8, cross: 1.1, packet: 1.3, note: 1.6, noteGo: 1.8 },
    })

</script>

<template>
  <svg class="kt-tiers" :class="{ 'is-compact': compact }" :viewBox="g.vb" role="img"
    :aria-label="compact
      ? 'Only the packet challenge plus answer plus your claims crosses the boundary to the judge; your notes are stopped at the lock and stay on the laptop'
      : 'On the laptop, offline. In the second brain, Obsidian and kb-template: your notes, reached only through the kb-template MCP vault server. In ai-coach: the coach CLI talks MCP to the vault server, and on Ollama Gemma 4B gets a concept note from the vault, through kb-template and the coach, creates the questions on it and asks you; your answer goes to Gemma 12B, which checks it. In the cloud, still inside ai-coach as one more adapter: Gemini 4 Argon, the judge. Only challenge, answer and your claims cross the boundary to it, and its verdict and gaps come back to you; your notes never do.'">
    <defs>
      <clipPath :id="id('face')" clipPathUnits="objectBoundingBox"><circle cx="0.5" cy="0.5" r="0.5" /></clipPath>
      <marker :id="id('head')" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M1 1 L 9 5 L 1 9" class="kt-tiers__head" />
      </marker>
    </defs>

    <!-- the two zones -->
    <g class="kt-tiers__part" :class="{ 'is-on': at(g.tl.zones) }">
      <rect :x="g.local.x" y="4" :width="g.local.w" :height="g.h" rx="14" class="kt-tiers__zone is-local" />
      <text :x="g.local.x + 18" y="32" class="kt-tiers__zonename is-local">laptop · offline</text>
    </g>
    <g class="kt-tiers__part" :class="{ 'is-on': at(g.tl.cloud) }">
      <rect :x="g.cloud.x" y="4" :width="g.cloud.w" :height="g.h" rx="14" class="kt-tiers__zone is-cloud" />
      <text :x="g.cloud.x + 18" y="32" class="kt-tiers__zonename is-cloud">cloud</text>
    </g>

    <!-- the boundary: a gate where the packet passes, a lock where the notes stop -->
    <g class="kt-tiers__part" :class="{ 'is-on': at(g.tl.boundary) }">
      <path :d="`M${g.line} 0 V ${g.gate - 18} M${g.line} ${g.gate + 18} V ${g.lock - 20} M${g.line} ${g.lock + 20} V ${g.end}`" class="kt-tiers__boundary" />
      <path :d="`M${g.line - 9} ${g.gate - 18} h18 M${g.line - 9} ${g.gate + 18} h18`" class="kt-tiers__gate" />
    </g>

    <template v-if="full">
      <!-- the second brain: the notes, reached only through kb-template's MCP server -->
      <g class="kt-tiers__part" :class="{ 'is-on': at(0.2) }">
        <rect x="14" y="46" width="172" height="262" rx="14" class="kt-tiers__home is-kb" />
        <text x="26" y="66" class="kt-tiers__homename is-kb">second brain</text>
        <image href="/images/logos/obsidian.webp" x="22" y="281" width="17" height="17" />
        <text x="42" y="295" class="kt-tiers__tool">Obsidian</text>
        <image href="/images/logos/kb-template-mark.png" x="100" y="281" width="12" height="17" />
        <text x="116" y="295" class="kt-tiers__tool">kb-template</text>
      </g>
      <g class="kt-tiers__part" :class="{ 'is-on': at(0.3) }">
        <rect x="66" y="78" width="52" height="64" rx="5" class="kt-tiers__note is-back" />
        <rect x="74" y="86" width="52" height="64" rx="5" class="kt-tiers__note is-back" />
        <rect x="82" y="94" width="52" height="64" rx="5" class="kt-tiers__note" />
        <path d="M90 112 h36 M90 123 h28 M90 134 h34 M90 145 h24" class="kt-tiers__text" />
        <text x="100" y="186" text-anchor="middle" class="kt-tiers__name is-big">notes</text>
      </g>
      <path d="M100 200 V 218" class="kt-tiers__wire" :marker-start="`url(#${id('head')})`" :marker-end="`url(#${id('head')})`"
        :class="{ 'is-on': at(0.7) }" />
      <g class="kt-tiers__part" :class="{ 'is-on': at(0.7) }">
        <rect x="30" y="222" width="140" height="50" rx="14" class="kt-tiers__engine" />
        <text x="100" y="243" text-anchor="middle" class="kt-tiers__name">kb-template</text>
        <text x="100" y="260" text-anchor="middle" class="kt-tiers__does">MCP vault server</text>
      </g>

      <!-- ai-coach: the CLI and, on loopback, the sparring partner and the checker -->
      <g class="kt-tiers__part" :class="{ 'is-on': at(0.9) }">
        <!-- ai-coach reaches the cloud too: the judge is one more adapter (adapter-gemini) -->
        <path d="M212 46 H 856 Q 870 46 870 60 V 186 Q 870 200 856 200 H 684 Q 670 200 670 186 V 86 Q 670 72 656 72
          H 494 Q 480 72 480 86 V 294 Q 480 308 466 308 H 212 Q 198 308 198 294 V 60 Q 198 46 212 46 Z" class="kt-tiers__home is-coach" />
        <text x="210" y="66" class="kt-tiers__homename is-coach">ai-coach</text>
      </g>
      <path d="M172 247 H 204" class="kt-tiers__wire" :marker-start="`url(#${id('head')})`" :marker-end="`url(#${id('head')})`"
        :class="{ 'is-on': at(1.0) }" />
      <text x="188" y="236" text-anchor="middle" class="kt-tiers__label is-mcp kt-tiers__part" :class="{ 'is-on': at(1.0) }">MCP</text>
      <!-- the coach: a CLI in my terminal, its real commands -->
      <g class="kt-tiers__part" :class="{ 'is-on': at(1.0) }">
        <rect x="208" y="84" width="120" height="208" rx="14" class="kt-tiers__engine is-local" />
        <text x="268" y="110" text-anchor="middle" class="kt-tiers__name">coach</text>
        <text x="268" y="127" text-anchor="middle" class="kt-tiers__does">CLI</text>
        <rect x="216" y="138" width="104" height="144" rx="8" class="kt-tiers__term" />
        <circle cx="226" cy="148" r="2.6" class="kt-tiers__dotr" />
        <circle cx="235" cy="148" r="2.6" class="kt-tiers__doty" />
        <circle cx="244" cy="148" r="2.6" class="kt-tiers__dotg" />
        <text x="224" y="172" class="kt-tiers__cmd"><tspan class="is-prompt">$</tspan> coach spar</text>
        <text x="224" y="194" class="kt-tiers__cmd"><tspan class="is-prompt">$</tspan> coach judge</text>
        <text x="224" y="216" class="kt-tiers__cmd"><tspan class="is-prompt">$</tspan> coach study</text>
        <text x="224" y="238" class="kt-tiers__cmd is-concept">◆ concept</text>
        <rect x="224" y="258" width="8" height="13" class="kt-tiers__cursor" />
      </g>
      <path d="M328 247 H 344" class="kt-tiers__wire" :marker-end="`url(#${id('head')})`" :class="{ 'is-on': at(1.1) }" />
      <g class="kt-tiers__part" :class="{ 'is-on': at(1.1) }">
        <rect x="340" y="80" width="132" height="218" rx="14" class="kt-tiers__group" />
        <text x="406" y="289" text-anchor="middle" class="kt-tiers__ollama">Ollama</text>
        <rect x="348" y="100" width="116" height="56" rx="14" class="kt-tiers__engine is-local" />
        <image href="/images/logos/gemma-mark.png" x="358" y="111" width="16" height="16" />
        <text x="378" y="124" class="kt-tiers__name">Gemma 4B</text>
        <text x="406" y="143" text-anchor="middle" class="kt-tiers__does is-ask">creates questions</text>
      </g>
      <g class="kt-tiers__part" :class="{ 'is-on': at(1.5) }">
        <rect x="348" y="196" width="116" height="56" rx="14" class="kt-tiers__engine is-local" />
        <image href="/images/logos/gemma-mark.png" x="353" y="207" width="16" height="16" />
        <text x="372" y="220" class="kt-tiers__name">Gemma 12B</text>
        <text x="406" y="239" text-anchor="middle" class="kt-tiers__does is-check">checks answers</text>
      </g>

      <!-- you: Gemma asks, you answer -->
      <g class="kt-tiers__part" :class="{ 'is-on': at(1.8) }">
        <circle cx="552" cy="128" r="34" class="kt-tiers__glow" />
        <image href="/images/speaker.webp" x="524" y="100" width="56" height="56" :clip-path="`url(#${id('face')})`"
          preserveAspectRatio="xMidYMid slice" />
        <circle cx="552" cy="128" r="28" class="kt-tiers__ring" />
        <text x="552" y="184" text-anchor="middle" class="kt-tiers__name">you</text>
      </g>
      <!-- one turn, 6 s: the concept note travels from the vault (kb-template, coach) to 4B; 4B asks
           (glow, "?" to me); I answer (to 12B); 12B checks (glow, ✓) -->
      <path :id="id('concept')" d="M100 198 V 247 H 330 Q 340 247 340 237 V 138 Q 340 128 350 128" class="kt-tiers__route" />
      
      <g class="kt-tiers__part" :class="{ 'is-on': at(2.0) }">
        <g>
          <path d="M0 -10 L10 0 L0 10 L-10 0 Z" class="kt-tiers__cframe" />
          <path d="M0 -4.5 L4.5 0 L0 4.5 L-4.5 0 Z" class="kt-tiers__ccore" />
          <animateMotion dur="6s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.02;0.22;1" keyPoints="0;0;1;1">
            <mpath :href="`#${id('concept')}`" />
          </animateMotion>
          <animate attributeName="opacity" dur="6s" repeatCount="indefinite" keyTimes="0;0.01;0.03;0.22;0.24;1" values="0;0;1;1;0;0" />
        </g>
        <rect x="346" y="98" width="120" height="60" rx="15" class="kt-tiers__busy is-ask">
          <animate attributeName="opacity" dur="6s" repeatCount="indefinite" keyTimes="0;0.21;0.24;0.44;0.48;1" values="0;0;1;1;0;0" />
        </rect>
        <rect x="346" y="194" width="120" height="60" rx="15" class="kt-tiers__busy is-check">
          <animate attributeName="opacity" dur="6s" repeatCount="indefinite" keyTimes="0;0.67;0.7;0.92;0.95;1" values="0;0;1;1;0;0" />
        </rect>
        <g transform="translate(462 198)">
          <circle r="11" class="kt-tiers__verdict" />
          <path d="M-5 0 l3.5 3.5 6.5 -7" class="kt-tiers__verdicttick" />
          <animate attributeName="opacity" dur="6s" repeatCount="indefinite" keyTimes="0;0.74;0.77;0.92;0.95;1" values="0;0;1;1;0;0" />
        </g>
      </g>
      <path :id="id('ask')" d="M466 120 H 518" class="kt-tiers__wire is-ask" :class="{ 'is-on': at(1.8) }" />
      <path :id="id('ans')" d="M532 156 C 516 200 500 224 468 224" class="kt-tiers__wire is-ans" :class="{ 'is-on': at(1.8) }" />
      <g class="kt-tiers__part" :class="{ 'is-on': at(2.0) }">
        <g>
          <circle r="9" class="kt-tiers__q" />
          <text y="4" text-anchor="middle" class="kt-tiers__qtext">?</text>
          <animateMotion dur="6s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.28;0.44;1" keyPoints="0;0;1;1">
            <mpath :href="`#${id('ask')}`" />
          </animateMotion>
          <animate attributeName="opacity" dur="6s" repeatCount="indefinite" keyTimes="0;0.27;0.29;0.44;0.47;1" values="0;0;1;1;0;0" />
        </g>
      </g>
      <g class="kt-tiers__part" :class="{ 'is-on': at(2.0) }">
        <g>
          <rect x="-8" y="-10" width="16" height="20" rx="3" class="kt-tiers__ans" />
          <path d="M-4 -4 h8 M-4 0 h8 M-4 4 h5" class="kt-tiers__anslines" />
          <animateMotion dur="6s" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.5;0.69;1" keyPoints="0;0;1;1">
            <mpath :href="`#${id('ans')}`" />
          </animateMotion>
          <animate attributeName="opacity" dur="6s" repeatCount="indefinite" keyTimes="0;0.49;0.51;0.69;0.72;1" values="0;0;1;1;0;0" />
        </g>
      </g>
      <text x="494" y="250" class="kt-tiers__label is-ans kt-tiers__part" :class="{ 'is-on': at(2.0) }">my answer</text>
    </template>

    <template v-else>
      <!-- compact: you and your notes on the left -->
      <g class="kt-tiers__part" :class="{ 'is-on': at(0.3) }">
        <circle cx="70" cy="96" r="32" class="kt-tiers__glow" />
        <image href="/images/speaker.webp" x="44" y="70" width="52" height="52" :clip-path="`url(#${id('face')})`"
          preserveAspectRatio="xMidYMid slice" />
        <circle cx="70" cy="96" r="26" class="kt-tiers__ring" />
      </g>
      <g class="kt-tiers__part" :class="{ 'is-on': at(0.45) }">
        <rect x="40" y="146" width="44" height="54" rx="5" class="kt-tiers__note is-back" />
        <rect x="48" y="152" width="44" height="54" rx="5" class="kt-tiers__note is-back" />
        <rect x="56" y="158" width="44" height="54" rx="5" class="kt-tiers__note" />
        <path d="M63 172 h30 M63 182 h22 M63 192 h28 M63 202 h18" class="kt-tiers__text" />
      </g>
    </template>

    <!-- the judge -->
    <g class="kt-tiers__part" :class="{ 'is-on': at(g.tl.judge) }">
      <rect :x="g.judge.x" :y="g.judge.y" :width="g.judge.w" height="60" rx="14" class="kt-tiers__engine is-cloud" />
      <image href="/images/logos/gemini-mark.png" :x="g.judge.x + 10" :y="g.judge.y + 21" width="18" height="18" />
      <text :x="g.judge.x + g.judge.w / 2 + 8" :y="g.judge.y + 26" text-anchor="middle" class="kt-tiers__name">Gemini 4 Argon</text>
      <text :x="g.judge.x + g.judge.w / 2 + 8" :y="g.judge.y + 45" text-anchor="middle" class="kt-tiers__does">judge</text>
    </g>

    <!-- what may cross: the packet -->
    <path :id="id('cross')" :d="g.cross" class="kt-tiers__wire is-cross" :class="{ 'is-on': at(g.tl.cross) }" />
    <text v-if="compact" :x="g.label.x" :y="g.label.y" :text-anchor="g.label.anchor" class="kt-tiers__tag is-cross kt-tiers__part"
      :class="{ 'is-on': at(g.tl.cross) }">{{ PACKET }}</text>
    <g class="kt-tiers__part" :class="{ 'is-on': at(g.tl.packet) }">
      <g>
        <rect x="-32" y="-14" width="64" height="28" rx="8" class="kt-tiers__packet" />
        <text x="-19" y="5" text-anchor="middle" class="kt-tiers__ptext">?</text>
        <path d="M-8 -5 h14 M-8 1 h14 M-8 7 h9" class="kt-tiers__plines" />
        <path d="M20 -7 l7 7 -7 7 -7 -7z" class="kt-tiers__claim" />
        <animateMotion dur="3.2s" repeatCount="indefinite"><mpath :href="`#${id('cross')}`" /></animateMotion>
      </g>
    </g>

    <!-- and back: Argon answers me, the verdict and the gaps -->
    <template v-if="full">
      <path :id="id('back')" d="M740 174 V 304 Q 740 314 730 314 H 622 Q 612 314 612 304 V 160 Q 612 150 602 150 H 584" class="kt-tiers__wire is-back"
        :class="{ 'is-on': at(3.3) }" />
      <text x="732" y="262" text-anchor="end" class="kt-tiers__label is-back kt-tiers__part" :class="{ 'is-on': at(3.3) }"><tspan x="732">verdict</tspan><tspan x="732" dy="18">+ gaps</tspan></text>
      <g class="kt-tiers__part" :class="{ 'is-on': at(3.5) }">
        <g>
          <rect x="-30" y="-14" width="60" height="28" rx="8" class="kt-tiers__reply" />
          <path d="M-20 0 l4 4 8 -9" class="kt-tiers__replytick" />
          <path d="M0 -5 h18 M0 1 h18 M0 7 h11" class="kt-tiers__replylines" />
          <animateMotion dur="3.2s" begin="1.6s" repeatCount="indefinite"><mpath :href="`#${id('back')}`" /></animateMotion>
        </g>
      </g>
    </template>

    <!-- what may not: a note tries, hits the lock, slides back -->
    <path :id="id('note')" :d="g.note" class="kt-tiers__wire is-note" :class="{ 'is-on': at(g.tl.note) }" />
    <text :x="g.noteLabel.x" :y="g.noteLabel.y" text-anchor="middle" class="kt-tiers__tag is-private kt-tiers__part"
      :class="{ 'is-on': at(g.tl.note) }">🔒 notes stay private</text>
    <g class="kt-tiers__part" :class="{ 'is-on': at(g.tl.noteGo) }">
      <g>
        <rect x="-13" y="-16" width="26" height="32" rx="4" class="kt-tiers__note" />
        <path d="M-7 -7 h14 M-7 -1 h10 M-7 5 h13" class="kt-tiers__text is-thin" />
        <animateMotion dur="3s" repeatCount="indefinite" calcMode="linear"
          keyTimes="0;0.55;0.65;0.8;1" keyPoints="0;1;0.9;0.9;0.9"><mpath :href="`#${id('note')}`" /></animateMotion>
        <animate attributeName="opacity" dur="3s" repeatCount="indefinite"
          keyTimes="0;0.08;0.75;0.9;1" values="0;1;1;0;0" />
      </g>
    </g>
    <g class="kt-tiers__part" :class="{ 'is-on': at(g.tl.note) }" :transform="`translate(${g.line} ${g.lock})`">
      <circle r="18" class="kt-tiers__lockbg" />
      <circle r="18" class="kt-tiers__lockhit">
        <animate attributeName="opacity" dur="3s" repeatCount="indefinite"
          keyTimes="0;0.53;0.57;0.8;0.9;1" values="0;0;1;1;0;0" />
      </circle>
      <path d="M-6 -3 v-5 a6 6 0 0 1 12 0 v5" class="kt-tiers__shackle" />
      <rect x="-9" y="-3" width="18" height="13" rx="2.5" class="kt-tiers__lockbody" />
    </g>
  </svg>
</template>

<style>
.kt-tiers {
  width: 840px;
  height: auto;
  overflow: visible;
  font-family: var(--font-family-sans);
}

.kt-tiers.is-compact { width: 680px; }

.kt-tiers__part,
.kt-tiers__wire {
  opacity: 0;
  transition: opacity 0.45s;
}

.kt-tiers__part.is-on,
.kt-tiers__wire.is-on { opacity: 1; }

/* zones: the laptop as PullPush's push panel, the cloud in the secondary color */
.kt-tiers__zone { stroke-width: 2.5; }
.kt-tiers__zone.is-local { fill: color-mix(in srgb, var(--kt-c-primary) 8%, transparent); stroke: var(--kt-c-primary); }
.kt-tiers__zone.is-cloud { fill: color-mix(in srgb, var(--kt-c-secondary) 8%, transparent); stroke: var(--kt-c-secondary); }
.kt-tiers__zonename {
  font: 800 13px var(--font-family-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.kt-tiers__zonename.is-local { fill: var(--kt-cool); }
.kt-tiers__zonename.is-cloud { fill: var(--kt-hot); }

.kt-tiers__boundary {
  fill: none;
  stroke: var(--kt-heading);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 2 9;
}
.kt-tiers__gate { stroke: var(--kt-heading); stroke-width: 3; stroke-linecap: round; }

/* notes, as in PullPush */
.kt-tiers__note { fill: var(--kt-card); stroke: var(--kt-c-primary-soft); stroke-width: 1.5; }
.kt-tiers__note.is-back { opacity: 0.5; }
.kt-tiers__text { stroke: var(--kt-subtle); stroke-width: 3; stroke-linecap: round; }
.kt-tiers__text.is-thin { stroke-width: 2.2; }

/* engine boxes, as PullPush's mind coach */
.kt-tiers__engine { fill: var(--kt-code-bg); stroke: var(--kt-line-strong); stroke-width: 2.5; }
.kt-tiers__engine.is-local { stroke: var(--kt-c-primary); }
.kt-tiers__engine.is-cloud { stroke: var(--kt-c-secondary); }
.kt-tiers__group {
  fill: color-mix(in srgb, var(--kt-cool) 6%, transparent);
  stroke: var(--kt-cool);
  stroke-width: 2.5;
  stroke-dasharray: 7 5;
}
.kt-tiers__name { font-size: 15px; font-weight: 800; fill: var(--kt-heading); }

/* where things live: the second brain and ai-coach, as on CoachLoop */
.kt-tiers__home { stroke-width: 2; stroke-dasharray: 8 6; }
.kt-tiers__home.is-kb { fill: color-mix(in srgb, var(--kt-good) 12%, transparent); stroke: var(--kt-good); stroke-width: 2.5; }
.kt-tiers__home.is-coach { fill: color-mix(in srgb, var(--kt-warn) 5%, transparent); stroke: var(--kt-warn); stroke-width: 2.5; }
.kt-tiers__homename { font: 800 13px var(--font-family-mono); text-transform: uppercase; letter-spacing: 0.08em; }
.kt-tiers__homename.is-kb { fill: var(--kt-good); }
.kt-tiers__homename.is-coach { fill: var(--kt-warn); }
.kt-tiers__tool { font-size: 12px; font-weight: 700; fill: var(--kt-fg); }
.kt-tiers__does,
.kt-tiers__tag { font: 600 11px var(--font-family-mono); fill: var(--kt-muted); }
.kt-tiers__does.is-group { fill: var(--kt-cool); font-weight: 700; }
.kt-tiers__name.is-big { font-size: 18px; }

/* labels on the wires: bigger, with a halo so a line never runs through them */
.kt-tiers__label {
  font: 800 14px var(--font-family-mono);
  paint-order: stroke;
  stroke: var(--kt-bg);
  stroke-width: 5px;
  stroke-linejoin: round;
}
.kt-tiers__label.is-mcp { font-size: 12px; fill: var(--kt-fg); }
.kt-tiers__label.is-concept { font-size: 13px; fill: var(--kt-warn); }
.kt-tiers__label.is-ans { fill: var(--kt-good); }
.kt-tiers__label.is-back { fill: var(--kt-good); }

/* the coach's terminal */
.kt-tiers__term { fill: var(--kt-bg); stroke: var(--kt-line); stroke-width: 1.2; }
.kt-tiers__dotr { fill: var(--kt-bad); }
.kt-tiers__doty { fill: var(--kt-warn); }
.kt-tiers__dotg { fill: var(--kt-good); }
.kt-tiers__cmd { font: 600 11.5px var(--font-family-mono); fill: var(--kt-code-fg); }
.kt-tiers__cmd .is-prompt { fill: var(--kt-good); }
.kt-tiers__cmd.is-concept { fill: var(--kt-warn); font-weight: 800; }
.kt-tiers__cursor { fill: var(--kt-code-fg); animation: kt-tiers-blink 1s steps(1) infinite; }

@keyframes kt-tiers-blink {
  50% { opacity: 0; }
}
.kt-tiers__ollama { font-size: 16px; font-weight: 800; fill: var(--kt-cool); }
.kt-tiers__does.is-ask { fill: var(--kt-hot); font-weight: 800; }
.kt-tiers__does.is-check { fill: var(--kt-good); font-weight: 800; }
.kt-tiers__does.is-ans { fill: var(--kt-fg); }

/* who is busy right now: 4B asking, 12B checking */
.kt-tiers__busy { fill: none; stroke-width: 3; opacity: 0; }
.kt-tiers__busy.is-ask { stroke: var(--kt-hot); filter: drop-shadow(0 0 8px var(--kt-hot)); }
.kt-tiers__busy.is-check { stroke: var(--kt-good); filter: drop-shadow(0 0 8px var(--kt-good)); }
.kt-tiers__verdict { fill: var(--kt-good); }
.kt-tiers__verdicttick { fill: none; stroke: var(--kt-bg); stroke-width: 2.6; stroke-linecap: round; stroke-linejoin: round; }
.kt-tiers__wire.is-ans { stroke: var(--kt-good); }
.kt-tiers__route { fill: none; stroke: none; }
.kt-tiers__does.is-concept { fill: var(--kt-warn); font-weight: 800; }
/* the concept note, as ReadingFlow's diamond: yellow frame, blue core */
.kt-tiers__cframe { fill: var(--kt-code-bg); stroke: var(--kt-warn); stroke-width: 2.5; stroke-linejoin: round; }
.kt-tiers__ccore { fill: var(--kt-info); }
.kt-tiers__tag { font-size: 13px; }
.kt-tiers__tag.is-cross { fill: var(--kt-hot); font-weight: 800; }
.kt-tiers__tag.is-private { fill: var(--kt-fg); font-weight: 800; font-size: 14px; }
.kt-tiers__tag.is-back { fill: var(--kt-good); font-weight: 800; }

/* you */
.kt-tiers__ring { fill: none; stroke: var(--kt-good); stroke-width: 3; }
.kt-tiers__glow {
  fill: color-mix(in srgb, var(--kt-good) 24%, transparent);
  animation: kt-tiers-pulse 2.4s ease-in-out infinite;
}

@keyframes kt-tiers-pulse {
  50% { opacity: 0.4; }
}

.kt-tiers__wire {
  fill: none;
  stroke: var(--kt-line-strong);
  stroke-width: 2.5;
  stroke-dasharray: 6 5;
}
.kt-tiers__wire.is-on { animation: kt-tiers-flow 1.2s linear infinite; }
.kt-tiers__wire.is-ask { stroke: var(--kt-c-primary-soft); }
.kt-tiers__wire.is-cross { stroke: var(--kt-hot); }
.kt-tiers__wire.is-back { stroke: var(--kt-good); }
.kt-tiers__wire.is-note.is-on { animation: none; }
.kt-tiers__head { fill: none; stroke: var(--kt-line-strong); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }

@keyframes kt-tiers-flow {
  to { stroke-dashoffset: -22; }
}

.kt-tiers__q { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); stroke-width: 2; }
.kt-tiers__qtext { font: 900 12px var(--font-family-sans); fill: var(--kt-hot); }
.kt-tiers__ans { fill: var(--kt-card); stroke: var(--kt-c-primary-soft); stroke-width: 1.5; }
.kt-tiers__anslines { stroke: var(--kt-heading); stroke-width: 1.8; stroke-linecap: round; }

/* the packet: a challenge, an answer, your claims (the concept note's diamond) */
.kt-tiers__packet { fill: var(--kt-bg); stroke: var(--kt-hot); stroke-width: 2.5; }
.kt-tiers__ptext { font: 900 15px var(--font-family-sans); fill: var(--kt-hot); }
.kt-tiers__plines { stroke: var(--kt-hot); stroke-width: 2; stroke-linecap: round; }
.kt-tiers__reply { fill: var(--kt-bg); stroke: var(--kt-good); stroke-width: 2.5; }
.kt-tiers__replytick { fill: none; stroke: var(--kt-good); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
.kt-tiers__replylines { stroke: var(--kt-good); stroke-width: 2; stroke-linecap: round; }
.kt-tiers__claim { fill: var(--kt-tint-secondary); stroke: var(--kt-hot); stroke-width: 2; stroke-linejoin: round; }

.kt-tiers__lockbg { fill: var(--kt-bg); stroke: var(--kt-heading); stroke-width: 2.5; }
.kt-tiers__lockhit { fill: var(--kt-tint-secondary); stroke: var(--kt-bad); stroke-width: 3.5; opacity: 0; }
.kt-tiers__shackle { fill: none; stroke: var(--kt-heading); stroke-width: 2.5; stroke-linecap: round; }
.kt-tiers__lockbody { fill: var(--kt-heading); }

@media (prefers-reduced-motion: reduce) {
  .kt-tiers__glow,
  .kt-tiers__wire.is-on { animation: none !important; }
}
</style>
