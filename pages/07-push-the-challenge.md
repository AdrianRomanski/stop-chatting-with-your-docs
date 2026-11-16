# Why can't the same model check its <span class="hot">questions</span>?

<div style="position: absolute; left: -52px; top: 118px; width: 920px">
  <WhySmallChecks />
</div>

<!--
⏱ 0:20 · script: [STAGE WhySmallChecks "why two models"] Why can't the same model check its *questions*? | the two models from the round, bigger, on the laptop: Gemma 4B asks, my answer goes right, Gemma 12B verifies; both pills centered in their boxes; one line from "ask question" through "my answer" to "verify answer"; "offline" with the Ollama logo top middle. Bridges SparRound and StudySession to VerifierLaw ⏱ 20s

(4B asks) In those rounds, two models did the work. Gemma 4B asked. (my answer, 12B verifies) And a bigger one, Gemma 12B, checked my answers: the miss, and after studying, the pass.

(the line) So why can't the same model that asked the question check the answer?

It turns out the two jobs are not the same size.
-->
---

# Verification <span class="hot">asymmetry</span>

<div class="kt-center" style="margin-top: 0; zoom: 0.95">
  <VerifierLaw />
</div>

<!--
⏱ 0:40 · script: [STAGE VerifierLaw "verifier's law"] Verification *asymmetry* | two panels, classic vs inverted asymmetry, then Jason Wei's verifier's law and the conclusion: the check gets Gemma 12B ⏱ 40s

Because of verification asymmetry: the effort to check an answer is not the effort to make it.

(classic) The classic kind: hard to solve, easy to check. Math, code with tests, a schedule. Finding the answer takes work; checking it takes seconds.

(inverted) With language models it flips. Easy to generate, hard to check: an essay, a security audit, a design review. The model writes it in seconds; checking it properly takes much longer. (my answer) And my answer, a free-text explanation of an idea, is exactly that kind.

(the law) Jason Wei calls it the verifier's law: AI gets good at the tasks that are easy to verify. Mine isn't one of them. So the check gets the strongest model I can run offline: Gemma 12B.

So the small model asks, and the bigger one checks.
-->
