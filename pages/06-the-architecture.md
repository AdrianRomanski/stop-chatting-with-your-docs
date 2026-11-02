---
surface: accent-1
align: center
kicker: phase 4
---

<h1 class="s">Push the <span class="hot">challenge</span></h1>

<div style="margin-top: 64px">
  <Journey :stops="['stop pulling', 'build the brain', 'create concepts', 'push the challenge', 'judge blind']" :at="3" :from="1" />
</div>

<!--
⏱ 0:08 · script: [PHASE] Push the *challenge*
-->


---
status: in-progress
---

# One loop, <span class="hot">seven</span> steps

<div class="kt-center" style="margin-top: 14px">
  <CoachLoop />
</div>

<!--
⏱ 0:35 · script: [STEPS] One loop, *seven* steps | the README loop as a ring, read · distill · synthesize ticked, the ladder under review [^ladder] ⏱ 35s

Read, distill, synthesize: you just saw those. (the left zone) That half lives in the knowledge base, my second brain: (the logos) Obsidian, where I read and mark, on a kb-template vault.

(the right zone) Then the coach's half, ai-coach. Spar, offline, with Gemma. Judge, online, with Argon. Study what you missed. And come back when it's due: review sends me back to spar.

The schedule: fail, and it's back tomorrow. Pass the sparring partner, three days. Pass the judge, and the gap grows: seven days, fourteen, thirty, up to a year.
-->

---
status: in-progress
---

# The application <span class="hot">flow</span>

<div class="kt-center" style="margin-top: 33px">
  <ArchFlow />
</div>

<style>
/* two dots (2 × 24px) higher than the other headlines, so the diagram can grow */
h1 { margin-top: -48px; }
</style>

<!--
⏱ 1:10 · script: [ARCH #arch] The application *flow* | one real session, step by step (ArchFlow) ⏱ 70s
Paced to this narration (S in ArchFlow.vue): the map builds in the first 8 s; coach spar 0:08, Gemma 4B asks 0:15, weak answer and Tier 1 failed 0:21, asks again 0:27, good answer and Tier 1 completed 0:31, coach judge and Tier 2 failed 0:37, coach study 0:46, coach judge again and Tier 2 passed 0:54, the lock 1:03. Each actor keeps its number badge.

(the map) My laptop, offline. On the left, my second brain: my notes, in Obsidian. Under it, kb-template's vault server: the only way in. In the middle, ai-coach. And in the cloud, Gemini 4 Argon. Still ai-coach: the judge is just another adapter.

Let's run one session.

(1, the terminal types, the diamond travels) I type coach spar. The coach never opens a file itself: it asks kb-template, over MCP, for a concept note. Here it comes.

(2, Gemma 4B glows) The coach hands the concept to Gemma 4B, on Ollama. The small model creates the question, (the "?") and asks me.

(3, the weak answer goes down, 12B glows red, ✕) My first answer is weak. Gemma 12B, the bigger model, checks it against my core assertions: Tier 1, failed.

(4B asks again, the good answer, ✓) It asks again. This time I explain the mechanism: Tier 1, completed.

(4, coach judge, red out) Then, online: coach judge. My answer and my claims cross the boundary to Argon. (red back) And Argon finds what the small models missed: Tier 2, failed. A verdict, and the gaps.

(5, coach study, Gemma 4B turns study partner) So, coach study. Gemma 4B, back on my laptop, becomes my study partner. (hint, my explanation, twice) It gives me a hint, never the answer, and I explain it again in my words. (study · gaps closed) Gaps closed.

(coach judge again, green back) Back to the judge: Tier 2, passed. (next review) And it doesn't end there: the next review is in seven days, then fourteen, thirty, up to a year.

(the note, the lock) And my notes? One tries to leave. It stops at the lock. My notes stay private.
-->

---
kicker: hexagonal architecture
status: in-progress
---

# Ports and <span class="hot">adapters</span>

<div class="kt-center" style="margin-top: 4px">
  <div style="width: 800px">
    <CoachLayers />
  </div>
</div>


<!--
⏱ 0:40 · script: [FILES "hexagonal architecture"] Ports and *adapters* | the hexagon: domain inside application, cli driving from the left, four adapters plugging into ports on the right ⏱ 40s

Hexagonal, enforced by Nx.

(the hexagon) In the middle, the application: the things you can do, spar, judge, study, file. Inside it, the domain: the rules of learning, including the four coaching styles, feynman, socratic, cornell and devil; more on those in a minute. It imports nothing, not even Node.

(the cli) On the left, the driving side: the terminal and the cli, the composition root, the only place a port meets its adapter.

(the adapters) On the right, the driven side. The core defines the ports, and each piece of technology plugs in: the vault over MCP, Gemma on Ollama as the sparring partner, Argon as the judge, and local state for the queue and the clock. Swapping Gemma for another model is one new adapter.

(the red arrow) Every arrow points in. If one points out, lint fails the build.
-->
