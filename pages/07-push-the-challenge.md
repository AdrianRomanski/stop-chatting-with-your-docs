# Asking is cheap, <span class="hot">checking</span> isn't

<div class="kt-center" style="margin-top: 14px">
  <VerifyAsym />
</div>

<!--
⏱ 0:35 · script: [STAGE VerifyAsym "verification asymmetry"] Asking is cheap, *checking* isn't

So why is the small model allowed to ask? Because of an asymmetry.

(ask) Asking is generating. Gemma 4B fires questions, in any style. (so-so question) Some of them are a bit off. And that's fine: (spark) a so-so question still makes me think. A wrong question is cheap.

(check) Checking is verifying. Did my answer really cover each of my six core assertions? Here a mistake is expensive. (4B: pass, struck) If a model says "pass" when I didn't get it, that's the fluency illusion again: I walk away thinking I understand.

So the check goes to a bigger model, Gemma 12B, still on my laptop. Temperature zero, one assertion at a time, and it only ticks one off when it can quote my own words as evidence.

(the seesaw tips) That's verification asymmetry: the cost of a mistake decides the model. Small model asks. Bigger model checks.
-->

---

# Verification <span class="hot">asymmetry</span>

<div class="kt-center" style="margin-top: 18px">
  <VerifierLaw />
</div>

<!--
⏱ 0:40 · script: [STAGE VerifierLaw "verifier's law"] Verification *asymmetry* | two panels, classic vs inverted asymmetry, then Jason Wei's verifier's law and the conclusion: the check gets Gemma 12B ⏱ 40s

Why does the check need a bigger model? Verification asymmetry: the effort to check an answer is not the effort to make it.

(classic) The classic kind: hard to solve, easy to check. Math, code with tests, a schedule. Finding the answer takes work; checking it takes seconds.

(inverted) With language models it flips. Easy to generate, hard to check: an essay, a security audit, a design review. The model writes it in seconds; checking it properly takes much longer. (my answer) And my answer, a free-text explanation of an idea, is exactly that kind.

(the law) Jason Wei calls it the verifier's law: AI gets good at the tasks that are easy to verify. Mine isn't one of them. So the check gets the strongest model I can run offline: Gemma 12B.

So the small model asks, and the bigger one checks.
-->
