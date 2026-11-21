---
surface: accent-1
align: center
---

<h1 class="s">Push the <span class="hot">challenge</span></h1>

<div style="margin-top: 64px">
  <Journey :stops="['stop learning from summaries', 'build the brain', 'push the challenge']" :at="2" :from="1" />
</div>

<!--
⏱ 0:08 · script: [PHASE] Push the *challenge*
-->

---
status: in-progress
---

# Sort the book into <span class="hot">layers</span>

<div class="kt-center" style="margin-top: 8px">
  <GroupLayers />
</div>

<!--
⏱ 0:50 · script: [STAGE GroupLayers "climb step 2 · coach group"] Sort the book into *layers* | coach group on Building a Second Brain: ten concepts, unsorted, fly into four layers I name (Capture, Organize, Distill, Express, top to bottom), builds-on arrows up the stack, one cycle refused, the rules ticked, Gemma's question ⏱ 35s

Before the coach pushes me, two quieter steps. (2, Group) First, Group. (the command) Again one CLI command: coach group, on the whole book.

(the tray) Synthesize left me ten concept notes from Building a Second Brain. A list. Unsorted. Hard to remember.

(the layers) So I group them, and the groups are mine. Some already exist in my knowledge base: Capture and Organize, with concepts from earlier books already in them. I just reuse them. (+ new) The rest I create myself, empty: Distill, Express. Here named after the book; the names are mine to pick. (the chips fly) Then I add the concepts to each group. Every concept goes into exactly one. Green: it belongs there. Distillation, the one we followed, lands in Distill.

(two go red) But I'm not perfect. Executive summary went into Capture, Hemingway bridge into Organize. (Gemma) And here the AI gives me no answers. It doesn't fix it for me. It gives me a hint: an executive summary comes after you've marked up a note. (I think, I move it, green) Right, I write it on top, after I've distilled. So: Distill. Then: a Hemingway bridge is what you leave for your next work session. (green) That's expressing, not organizing. Gemma hints; I think; I move it.

(the arrows) And each layer builds on the one above it: you can't organize what you never captured.

(hints, not answers) That's the rule: Gemma may point at what a concept does, to correct my thinking, but it never names a group or proposes a move. The frame has to be mine.
-->

---
status: in-progress
---

# Two steps up the <span class="hot">climb</span>

<div class="kt-center">
  <ClimbCheckpoint :done="2" concept="Distillation" books covers big />
</div>

<!--
⏱ 0:15 · script: [CHECKPOINT ClimbCheckpoint "the climb so far"] Two steps up the *climb*

(I hop on, step by step) Back to the stairs. Read, synthesize, and now Group. (I land on Group) My concepts sit in groups I made myself.

(the books under it) And under the steps, the books they come from: Building a Second Brain under Read to Group, Make It Stick joining at Group, and Tomorrowmind under all of it.

(next: Generate) Next step: Generate.
-->

---
status: in-progress
---

# A name, a blank page, all you <span class="hot">know</span>

<div class="kt-center" style="margin-top: 6px">
  <GenerateGuess />
</div>

<!--
⏱ 0:45 · script: [STAGE GenerateGuess "climb step 3 · coach generate"] A name, a blank page, all you *know* | five beats: name only (Reveal grey, "write first") → I write all I know → reveal: three real core assertions → mark each against what I wrote: got it / wrong / got it → Gemma 12B checks: both got its hold, the wrong one gets a hint on what's wrong → my correction in my own words → solved, passed ⏱ 45s

(3, Generate) The second quiet step: Generate. And it's the strangest one: I answer before I study.

(1, name only) coach generate, on one concept. All I get is its name, Distillation, and a blank page. The note stays closed, the Reveal button is grey. The code won't open the note until I've written.

(2, the page fills) So I write down everything I know about it. I bold what I find interesting, then highlight whole paragraphs, and write a summary on top. Ten words at least; I can type /idk if I really know nothing. (attempted) Stamped.

(3, reveal) Now the note opens: its core assertions.

(4, the lines) I mark each one against what I wrote, myself. Bolding: got it. (red) Highlighting: wrong. Summary: got it.

(5, Gemma 12B) Then the check. Gemma 12B looks for each "got it" in my words: both hold. And on the wrong one, it doesn't tell me the answer. It gives me a hint on what's wrong: "whole paragraphs". So what do I highlight instead?

(the correction) So I fix it myself, in my own words: only parts of the bold get highlighted, not whole paragraphs. Copy six words from the note and it's refused. Gemma checks it: solved. (passed) Passed.

(the close) Not graded. A wrong line, fixed by me, sticks better than a right answer I just read. And the idea comes back tomorrow, for its first spar.
-->

---
status: in-progress
---

# Three steps up the <span class="hot">climb</span>

<div class="kt-center" style="margin-top: 10px">
  <ClimbCheckpoint :done="3" concept="Distillation" books covers />
</div>

<!--
⏱ 0:20 · script: [CHECKPOINT ClimbCheckpoint "the climb so far"] Three steps up the *climb* ⏱ 20s

(the stairs, I hop up) Back to the stairs. Read, the bridge, and now Group and Generate.

(the books) And a second book joins under Group and Generate: Make It Stick.

(the rows) The book has a frame I built myself. And I've already been wrong about Distillation once, and fixed it. That's the soil the coach needs. Now it can push.
-->

---


# Now, <span class="hot">Stress-Test</span> Your Thinking

<div class="kt-questioned">
  <Meme src="/images/memes/dwight-joke.jpg" alt="Dwight Schrute, deadpan: Question: is an eggplant a fruit or a vegetable?" :height="300" />
  <div class="kt-questioned__styles">
    <div class="kt-questioned__head">Coaching Personas</div>
    <ul>
    <li class="is-feynman">feynman</li>
    <li class="is-socratic">socratic</li>
    <li class="is-cornell">cornell</li>
    <li class="is-devil">devil</li>
    </ul>
  </div>
</div>

<style>
.kt-questioned { display: flex; align-items: center; justify-content: center; gap: 72px; margin-top: 28px; }
.kt-questioned__head { margin-bottom: 22px; font-size: 18px; font-weight: 700; color: var(--kt-muted); }
.kt-questioned ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 18px; }
.kt-questioned li { margin: 0; padding: 0; font: 700 34px var(--font-family-mono); text-transform: uppercase; letter-spacing: 0.08em; }
.kt-questioned li::before { content: none; }
.kt-questioned .is-feynman { color: var(--kt-info); }
.kt-questioned .is-socratic { color: var(--kt-hot); }
.kt-questioned .is-cornell { color: var(--kt-good); }
.kt-questioned .is-devil { color: var(--kt-warn); }
</style>

<!--
⏱ 0:20 · script: [MEME dwight-joke] Now, *Stress-Test* Your Thinking | Dwight's "Question:" meme, and the four style names under "Coaching Personas", nothing else, no motion; each style gets its own slide next ⏱ 20s

(the meme) Now, stress-test your thinking. Time to be questioned.

(the names) The sparring partner is one small model, Gemma 4B, on my laptop. But it doesn't question everything the same way. It has four styles: Feynman, Socratic, Cornell, and devil's advocate. One at a time.
-->

---
status: in-progress
---

# Feynman: say it in <span class="hot">plain words</span>

<div class="kt-center" style="margin-top: 36px">
  <StyleRound name="feynman" />
</div>

<!--
⏱ 0:30 · script: [STAGE StyleRound feynman] Feynman: say it in *plain words* | the style's card (what this sparring style does), the coach's question and the winning answer

(the card) Feynman stops me from hiding behind fancy buzzwords. We often think we understand a concept just because we know its name. So Feynman mode bans the main keywords from my note, and asks me to explain how the idea works in simple, everyday words.

(the question) In plain words: how do you compress a note?

(winning answer) I bold 10 to 20 percent of the text, the key sentences. Inside the bold, I highlight the best parts, a few words, a phrase, sometimes a whole sentence, so they jump out. Then I write a short summary at the top, in my own words, made from what I bolded and highlighted. So I never have to reread the whole page.
-->

---
status: in-progress
---

# Socratic: defend it against a <span class="hot">counterexample</span>

<div class="kt-center" style="margin-top: 64px">
  <StyleRound name="socratic" />
</div>

<!--
⏱ 0:30 · script: [STAGE StyleRound socratic] Socratic: defend it against a *counterexample* | the style's card (what this sparring style does), the coach's question and the winning answer

(the card) Socratic never asks "what is X". It tests the limits of what I say. I give a general rule that sounds right on the surface, and the coach pushes my own logic to an extreme, to see where it breaks.

(you say) I say: bolding and highlighting make my notes faster to scan. I see the point without rereading the page.

(the coach pushes back) If marking makes scanning faster, why not bold and highlight 70 percent of the text?

(winning answer) Because then nothing stands out. If 70 percent is marked, the marks tell me nothing, and I'm back to reading the whole page. Marks only work when they're rare: that's why I bold only 10 to 20 percent, and highlight only the best of that.
-->

---
status: in-progress
---

# Cornell: the author's <span class="hot">thesis</span>

<div class="kt-center" style="margin-top: 64px">
  <StyleRound name="cornell" />
</div>

<!--
⏱ 0:30 · script: [STAGE StyleRound cornell] Cornell: the author's *thesis* | the style's card (what this sparring style does), the coach's question and the winning answer

(the card) Cornell is built for non-technical books, essays and big ideas. No nitpicking tiny mechanical details: the big picture. What is the author's main argument, and why did they use this story, this metaphor, to prove it?

(the question) What's the author's main claim about distilling?

(winning answer) Notes are for Future You, not for today. Today I know the context, so every note looks clear. In six months that context is gone. Distilling is how I write for that person: the point on top, ready the moment a project needs it.
-->

---
status: in-progress
---

# Devil's advocate: where does it <span class="hot">break</span>

<div class="kt-center" style="margin-top: 64px">
  <StyleRound name="devil" />
</div>

<!--
⏱ 0:30 · script: [STAGE StyleRound devil] Devil's advocate: where does it *break* | the style's card (what this sparring style does), the coach's question and the winning answer

(the card) Devil's advocate: a skeptical teammate in a design review. It assumes my idea works fine on a sunny day, and asks right away what happens when things go wrong in real life: when I'm busy, stressed, or dealing with massive scale.

(the question) Distilling sounds great on a quiet Sunday. But what happens in a crunch week at work, when you have no time for it?

(winning answer) I only distill a note when a project needs it, not the moment I save it. So I can skip a day, and in a crunch week I just focus on the work. Nothing breaks: notes are a marathon, not a sprint.
-->

---
status: in-progress
---

# The loop inside <span class="hot">Retrieve</span>

<div class="kt-center" style="margin-top: 14px">
  <RetrieveLoop />
</div>

<!--
⏱ 0:35 · script: [STEPS RetrieveLoop] The loop inside *Retrieve* | spar (Gemma 4B asks, Gemma 12B checks, offline, one of four styles) → fail: study session → spar again; pass: concept, question and answer to Argon, no notes → gaps: study session → spar again ⏱ 35s

(spar) So that's the whole of step four, Retrieve, as one loop. It starts with sparring: the coach questions me, offline, with Gemma 4B, and Gemma 12B, also offline, checks my answer. (the styles) And I pick how: one of four training styles. Feynman, socratic, cornell, devil.

(fail) If I fail, I ask for a study session. (spar again) And then I spar again.

(pass) If I pass, three things go to the judge: the concept, the question, and my answer. (notes struck) Not the notes. Argon judges without them.

(the judge) Argon, online, looks for the gaps in my answer. (gaps) If there are any, I'm back in a study session. And after it, I spar again.
-->

---
status: in-progress
---

# One round of sparring, one <span class="hot">gap</span>

<div class="kt-center" style="margin-top: 6px">
  <SparRound />
</div>

<!--
⏱ 0:40 · script: [STAGE SparRound "coach spar"] One round of sparring, one *gap* | four beats: pick a concept (Distillation) → pick the coach's style (socratic) → Gemma 4B asks, I answer, vaguely → Gemma 12B verifies each core assertion against my words: no words of mine say it, missed, fail, one gap; next: coach study ⏱ 40s
Status: changed 2026-11-16, the round now fails so the study session can follow. The answer is illustrative.

(1, concept) Sparring starts with a choice: which concept do I want to be sparred on? From the book's concepts, I pick Distillation.

(2, style) Then, how the coach should push me: one of four styles. This time, socratic.

(3, answer) Gemma 4B, the small model, offline, asks. One question at a time, never the answer: highlighting helps, so why not highlight half the page? And I answer, in my own words: it still helps, you see what matters when you skim. Sounds fine, right?

(4, check) But the small model doesn't grade me. A stronger one does: Gemma 12B, still on my laptop. One core assertion at a time, and it only ticks one off when it can quote my own words as evidence. (missed) Here it can't. Nothing I said is about highlighting only inside the bold. (fail) Fail, one gap. (next) So I don't move on. I study.
-->

---
status: in-progress
---

# Study the <span class="hot">gap</span>

<div class="kt-center" style="margin-top: 6px">
  <StudySession />
</div>

<!--
⏱ 0:45 · script: [STAGE StudySession "coach study"] Study the *gap* | four beats: the open gap from the failed round (highlight portions of the bold), coach study → Gemma 4B asks a guiding question, never the answer → try 1: a miss, and the author's words to reread, Building a Second Brain p. 119 → try 2 in my own words: gap closed → coach spar again: pass ⏱ 45s
Status: new 2026-11-16 (ADR-AIC-0017, ADR-AIC-0020). Real: the rules and the book quote (p. 119). Illustrative: my two tries.

(1, gap) coach study takes the gap from the round I just failed: the learner highlights portions of the bolded text. Offline, and nothing is recorded. It doesn't change my score.

(2, guide) Gemma asks one guiding question. After you bold, what do you do with only the bold? It points at the gap. It never gives me the answer.

(3, try 1) I try: I highlight what matters. (miss) Still vague. A miss. (the book) So now, and only now, the coach shows me where to look: the author's own words, with the page. Now read through only the bolded passages, and highlight the best of the best. Page 119.

(4, try 2) I put the book away and explain it again, in my words: I reread only my bold, and mark the best few lines of it. (closed) Gap closed. Two tries per gap, and asking for a hint never costs one.

(spar again) But studying isn't the test. The next spar is. (pass) Pass.
-->
