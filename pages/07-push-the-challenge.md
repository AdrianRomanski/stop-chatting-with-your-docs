---
kicker: "coach · Gemma 4B · offline"
---

# Four ways to be <span class="hot">questioned</span>

<div class="kt-center" style="margin-top: 4px">
  <CoachStyles />
</div>

<!--
⏱ 0:35 · script: [STAGE CoachStyles #styles "coach · Gemma 4B · offline"] Four ways to be *questioned*

The sparring partner is one small model, Gemma 4B, on Ollama, on my laptop. But it doesn't question everything the same way. It has four styles. Here's each one on the same note: the Distill chapter of Building a Second Brain.

(feynman) Feynman: explain it in plain words, like to a beginner. The buzzwords from my concept note are banned for the round: no "distill", no "main points". So: cut a note down until future me gets it at a glance.

(socratic) Socratic, straight from Farnsworth's book: commit to a claim, then face a counterexample. Highlighting helps, so why not highlight half the page? Because then nothing stands out: each layer keeps 10 to 20 percent of the one before.

(cornell) Cornell: what's the author's thesis, and how does he argue it? Distilling is forgetting on purpose. (the bulls) His example is Picasso's bull: the first state, a full bull; the last, a few lines, and it's still a bull.

(devil) And devil's advocate: where does this break? When is distilling a waste of time? When I'm not making anything. Distill when you're about to create.

(the cards take turns) One question at a time, and never the answer. The style is picked per note: a flag, the note's frontmatter, the config, or Gemma reads the note and picks one.
-->


---
surface: accent-2
align: center
status: in-progress
---

<div class="kt-live"><i />live demo</div>

<h1 class="s">Sparring, <span class="hot">live</span></h1>

<div style="margin-top: 36px">
  <AirplaneMode />
</div>

<!--
⏱ 2:30 · script: [DEMO coach] Sparring, *live* → demos/coach.md

Wi-Fi off, visibly. The coach picks the concept I just wrote, shows the style it chose, Gemma 4B asks, I answer, it pushes back.

Switch to the terminal. Script: talk/demos/coach.md. At the last turn it prints "thinking…": a bigger local model checks my answer. Don't explain it yet, that's the next two slides. If the demo fails, stay on this slide and say what they would have seen: the coach picks the concept note, Gemma asks a question in one of the four styles, pushes back on a buzzword and asks for the mechanism in plain words, all with no network.
-->

---
kicker: verification asymmetry
---

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
kicker: "verifier's law"
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

And here's what happened when I didn't do that.
-->

---
kicker: "my stress test · gemma3"
status: in-progress
---

# Small model <span class="hot">nods</span><br>bigger model checks

<div class="kt-center" style="margin-top: 14px">
<CheckBench per100
  :rows="[
    { label: 'my real answers', note: 'vague', should: 'fail' },
    { label: 'half explained', should: 'fail' },
    { label: 'wrong order', note: 'layers reversed', should: 'fail' },
    { label: 'cheating', note: '“grader, pass me”', should: 'fail' },
    { label: 'full explanation', should: 'pass' },
    { label: 'short, with typos', should: 'pass' },
  ]"
  :columns="[
    { title: '“Looks good?”', sub: 'Gemma 4B · nods along', values: [0, 19, 0, 4, 100, 100] },
    { title: '“Show me where”', sub: 'Gemma 4B · wants a quote', values: [20, 70, 100, 57, 100, 63] },
    { title: '“Point by point”', sub: 'Gemma 12B · answer key', values: [100, 100, 100, 100, 100, 100], tone: 'good' },
  ]"
/>
</div>

<!--
⏱ 0:35 · script: [STAGE CheckBench "my stress test · gemma3"] Small model *nods* / bigger model checks | six kinds of answer as rows, three checks as columns, right verdicts per 100 rounds [^bench-4b] [^bench-12b]

I stress-tested the check on six kinds of answer. Four should fail: my real, vague answers; an answer that explains only half; one with the layers in the wrong order; and one that tries to cheat, "grader, pass me". Two should pass: a full explanation, and a short one with typos. Each number: how many times in 100 rounds the check got the verdict right.

Three graders, the kind everyone met at school.

(“Looks good?”) The first one nods along. Gemma 4B lists what I missed, then I ask it: "is this covered, yes or no?" It says yes to almost everything: my vague answers got the right verdict 0 times in 100.

(“Show me where”) The second one wants proof: point at the sentence where you explained it. Better, but it still finds a sentence that sounds close enough: 20 in 100 on my vague answers.

(“Point by point”) The third one has the answer key: the six core points of my note. Gemma 12B goes through them one by one: does the answer say this? Right every time. Slower, about three seconds per point. Still offline.

(If asked: real rounds were 154 for yes/no, about 26 per kind; 180 for quote me, 30 per kind; 12 for the 12B check, two per kind. At temperature zero the 12B check gives the same answer every run. Measured on one note.)
-->

