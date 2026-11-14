---
surface: accent-1
align: center
---

<h1 class="s">Push the <span class="hot">challenge</span></h1>

<div style="margin-top: 64px">
  <Journey :stops="['stop learning from summaries', 'build the brain', 'create concepts', 'push the challenge']" :at="3" :from="1" />
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

# Guess before you <span class="hot">look</span>

<div class="kt-center" style="margin-top: 6px">
  <GenerateGuess />
</div>

<!--
⏱ 0:45 · script: [STAGE GenerateGuess "climb step 3 · coach generate"] Guess before you *look* | five beats: title only (Reveal grey, "guess first") → my guess, 16 words → reveal: three real core assertions → mark each against a line of my guess: got it / wrong + my correction / got it → Gemma 12B checks each got it against my words ⏱ 45s

(3, Generate) The second quiet step: Generate. And it's the strangest one: I answer before I study.

(1, title only) coach generate, on one concept. The note stays closed: I see only its title, Distillation. The Reveal button is grey. The code won't open the note until I've guessed.

(2, the guess types) So I guess. What does it say? I bold what I find interesting, then highlight whole paragraphs, and write a summary on top. Ten words at least; I can type /idk if I really have no idea. (attempted) Stamped.

(3, reveal) Now the note opens: its core assertions.

(4, the lines) I mark each one against my guess, myself. Bolding: got it. (red) Highlighting: wrong. It's not whole paragraphs, only parts of the bold. And a wrong mark needs a correction, in my own words: copy six words from the note and it's refused. Summary: got it.

(5, Gemma 12B) Then the check: was each "got it" really in my guess? Gemma 12B looks for it in my words. Both hold. If one didn't, it would turn into "missed".

(the footer) Not graded. But a wrong guess, corrected, sticks better than a right answer I just read. And the idea comes back tomorrow, for its first spar.
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

<div class="kt-center" style="margin-top: 16px">
  <StyleRound name="feynman" />
</div>

<!--
⏱ 0:30 · script: [STAGE StyleRound feynman] Feynman: say it in *plain words* | the style's card (what this sparring style does), the coach's question and the winning answer

(the card) Feynman stops me from hiding behind fancy buzzwords. We often think we understand a concept just because we know its name. So Feynman mode bans the main keywords from my note, and asks me to explain how the idea works in simple, everyday words.

(the question) Without using the phrase "Progressive Summarization": how do you prepare a long note today, so that Future You finds the main point in 10 seconds, six months from now?

(winning answer) Each time I revisit the note, I mark only the best 10 to 20 percent: first I bold key sentences, then I highlight the best of the bold, and finally I write a two-sentence takeaway at the top, in my own words. So I never have to reread the whole page.
-->

---
status: in-progress
---

# Socratic: defend it against a <span class="hot">counterexample</span>

<div class="kt-center" style="margin-top: 16px">
  <StyleRound name="socratic" />
</div>

<!--
⏱ 0:30 · script: [STAGE StyleRound socratic] Socratic: defend it against a *counterexample* | the style's card (what this sparring style does), the coach's question and the winning answer

(the card) Socratic never asks "what is X". It tests the limits of what I say. I give a general rule that sounds right on the surface, and the coach pushes my own logic to an extreme, to see where it breaks.

(you say) I say: highlighting helps me spot the important parts faster.

(the coach pushes back) If highlighting makes things easier to find, what happens if you highlight half the page? Does that still help?

(winning answer) No. If half the page is highlighted, nothing stands out, and my eyes still have to read everything. It only saves time if each layer compresses the one before to about 10 to 20 percent: I trade full detail for fast scanning.
-->

---
status: in-progress
---

# Cornell: the author's <span class="hot">thesis</span>

<div class="kt-center" style="margin-top: 16px">
  <StyleRound name="cornell" />
</div>

<!--
⏱ 0:30 · script: [STAGE StyleRound cornell] Cornell: the author's *thesis* | the style's card (what this sparring style does), the coach's question and the winning answer

(the card) Cornell is built for non-technical books, essays and big ideas. No nitpicking tiny mechanical details: the big picture. What is the author's main argument, and why did they use this story, this metaphor, to prove it?

(the question) Why does the author argue you should treat "Future You" like an impatient stranger? And how does that change the way you save a note today?

(winning answer) Because six months from now, I won't remember the context I have in my head today. If I just save a raw 30-page article, Future Me won't have time to re-read it under a deadline. So I highlight the core takeaway now, as a gift to my future self.
-->

---
status: in-progress
---

# Devil's advocate: where does it <span class="hot">break</span>

<div class="kt-center" style="margin-top: 16px">
  <StyleRound name="devil" />
</div>

<!--
⏱ 0:30 · script: [STAGE StyleRound devil] Devil's advocate: where does it *break* | the style's card (what this sparring style does), the coach's question and the winning answer

(the card) Devil's advocate: a skeptical teammate in a design review. It assumes my idea works fine on a sunny day, and asks right away what happens when things go wrong in real life: when I'm busy, stressed, or dealing with massive scale.

(the question) This note-taking system sounds great when you have free time on Sunday. But where does it break during a chaotic crunch week at work, and how do you recover?

(winning answer) It breaks if I bold and summarize every article the moment I save it: that's unpaid homework. The fix is just-in-time: I only compress a note when I open it again for a real project. And if my inbox overflows, I archive the batch and start fresh.
-->

---
status: in-progress
---

# One round of <span class="hot">sparring</span>

<div class="kt-center" style="margin-top: 6px">
  <SparRound />
</div>

<!--
⏱ 0:40 · script: [STAGE SparRound "coach spar"] One round of *sparring* | four beats: pick a concept (Distillation) → pick the coach's style (socratic) → Gemma 4B asks, I answer → Gemma 12B verifies each core assertion against my words: covered, pass ⏱ 40s

(1, concept) Sparring starts with a choice: which concept do I want to be sparred on? From the book's concepts, I pick Distillation.

(2, style) Then, how the coach should push me: one of four styles. This time, socratic.

(3, answer) Gemma 4B, the small model, offline, asks. One question at a time, never the answer: highlighting helps, so why not highlight half the page? And I answer, in my own words: then nothing stands out; each layer keeps 10 to 20 percent of the last.

(4, check) But the small model doesn't grade me. A stronger one does: Gemma 12B, still on my laptop. One core assertion at a time, and it only ticks one off when it can quote my own words as evidence. (covered) Here it can. (pass) Pass.
-->
