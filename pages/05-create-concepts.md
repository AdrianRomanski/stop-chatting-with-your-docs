---
surface: accent-1
align: center
status: in-progress
---

<h1 class="s">Create <span class="hot">concepts</span></h1>

<div style="margin-top: 64px">
  <Journey :stops="['stop learning from summaries', 'build the brain', 'create concepts', 'push the challenge', 'judge blind']" :at="2" :from="1" />
</div>

<!--
⏱ 0:08 · script: [PHASE] Create *concepts*
-->

---
status: in-progress
---

# From distilled notes to a <span class="hot">concept</span>

<!-- centered in the space under the headline -->
<div class="kt-center" style="margin-top: 24px">
  <ConceptNote />
</div>

<!--
⏱ 0:55 · script: [STAGE ConceptNote "synthesize"] From distilled notes to a *concept* ⏱ 55s
Merges the old "From a book to a concept" (ReadingFlow) and "One idea, in your words" (ConceptNote, four layers). The layers were shown on the Distill slide, so here they're already done. Paced (ConceptNote.vue): my note and the raw book are there from the start, synthesize at 0:01, the concept card from 0:02, the assertions 0:02–0:04, Gemma on the arrow at 0:01, glowing while the note fills (0:02–0:05), the buzzwords from 0:05.

That was the theory. Here's how it runs for me, with a real book: Building a Second Brain.

(left, a stack of notes) This part is already done. Not one note: a group of them, all distilled. A concept comes from a group of notes, not from one. I read, I captured what resonated, and I distilled it, the layers you saw on the Distill slide. (the marked passage) The bold and the highlights are still there, and on top, my summary, in my own words: "When I find something interesting I bold it, then I highlight parts of the bold, and at the end I add a summary."

(synthesize, Gemma on the arrow) Now the step that matters: synthesis. (the command) One CLI command: coach synthesize. I take one idea and turn it into a concept note. Gemma helps me shape it, but it works from my core assertions, in my words. That stays mine. It's the only thing the coach spars. Not the book, not my raw notes: the idea, in my words.

(the card, my words) First field, the core assertions. (one after another) The learner identifies interesting text by bolding it. Then highlights portions of the bolded text. Then creates a fourth layer, a summary. Drafted from my summary, never from the book, because whoever writes them decides what passing means. And they're what the judge grades me against, later.

(chips) Then the forbidden buzzwords, the words I'd hide behind: distill, the concept's own name. Main points, the author's phrase. Important parts, which says nothing. Use one in an answer and the coach sends it back: say it again as the mechanism, in plain words.
-->

---
status: in-progress
---

# One step up the <span class="hot">climb</span>

<div class="kt-center">
  <ClimbCheckpoint :done="1" concept="Distillation" books covers tall />
</div>

<!--
⏱ 0:30 · script: [CHECKPOINT ClimbCheckpoint "the climb so far"] One step up the *climb*

Remember the stairs? (the stairs, Read lights up, I hop on) Here's where my concept is now. One step: Read. (I hop on, pink) Then the bridge: synthesize. It's not a step of the climb, it's what makes the concept notes the climb runs on. Gemma groups my marks into ideas, up to six, and every idea I pick becomes its own concept note. Here we follow one: Distillation.

(the books under it) And under the steps, the books they come from: Building a Second Brain, and Tomorrowmind, the one behind the whole app.

One step. Six to go. Now the coach starts pushing.
-->
