---
align: center
status: in-progress
---

<h1 class="xs" style="white-space: nowrap; letter-spacing: var(--kt-track-display); font-size: calc(var(--kt-display-xs) * 0.92)">The judge never sees your <span class="hot">notes</span><br>only your answer and your claims</h1>

<div class="kt-center" style="margin-top: 32px">
  <TwoTiers compact />
</div>

<!--
⏱ 0:25 · script: [STATEMENT] The judge never sees your *notes* / only your answer and your claims | pays #arch and #claims; the compact TwoTiers below, the packet crossing labelled "challenge + answer + your claims"

A boundary between my laptop and the cloud. The notes try to cross and bounce off the lock.

What crosses the boundary is my explanation, in my words, and the claims I wrote myself when I distilled the note. That's exactly what should be graded.

And if even the claims feel too private: a switch in the config, includeAssertions, keeps them at home too. Then the judge gets the challenge and the answer, nothing else.
-->

---
status: in-progress
---

# The loop inside <span class="hot">Retrieve</span>

<div class="kt-center" style="margin-top: 14px">
  <RetrieveLoop />
</div>

<!--
⏱ 0:35 · script: [STEPS RetrieveLoop] The loop inside *Retrieve* | spar (Gemma 4B, offline, one of four styles) → fail: study session → spar again; pass: concept, question and answer to Argon, no notes → gaps: study session → spar again ⏱ 35s

(spar) So that's the whole of step four, Retrieve, as one loop. It starts with sparring: the coach questions me, offline, with Gemma 4B. (the styles) And I pick how: one of four training styles. Feynman, socratic, cornell, devil.

(fail) If I fail, I ask for a study session. (spar again) And then I spar again.

(pass) If I pass, three things go to the judge: the concept, the question, and my answer. (notes struck) Not the notes. Argon judges without them.

(the judge) Argon, online, looks for the gaps in my answer. (gaps) If there are any, I'm back in a study session. And after it, I spar again.
-->

---
align: center
status: in-progress
---

<h1 class="s">It found the gap<br>I <span class="hot">couldn't</span> see</h1>

<div class="kt-center" style="margin-top: 28px">
  <AnswerGap />
</div>

<!--
⏱ 0:25 · script: [STATEMENT] It found the gap / I *couldn't* see | my real judge session; AnswerGap redrawn with my real session of 25 Oct 2026: the challenge "What is the author's primary argument regarding this layered text processing system?", my answer "it helps take the essence of text"; Gemma 4B "pass" ✓ fades; Argon: "fail", the claim marked "hand-waving", one gap "how highlighting works inside the bolded text"; "next review: tomorrow". Pays off the fluency illusion: fluent, and not enough [^session-1025]

My own first session, on my Distillation note. (the question) The coach asked: "What is the author's primary argument regarding this layered text processing system?" (my answer) And I answered: "it helps take the essence of text." The small model passed my answer. That was before the 12B check: this session is why it exists. Argon read the same words and called it what it was: hand-waving.

"It helps take the essence of text" sounds right. It's the summary.md all over again: fluent, and not enough.

On the slide: the challenge, my answer and Argon's hand-waving claim are verbatim from the session file (s-20261025-205751-3ff4.md); the slide shows my first answer, three follow-ups came after it. The gap is shortened, a paraphrase; the recorded gap reads: "The answer does not explain that highlighting specifically targets portions of the bolded text." The session recorded two hand-waves and two gaps; the slide shows one of each. Next review 2026-10-26: the day after.
-->

---
status: in-progress
---

# Four steps up the <span class="hot">climb</span>

<div class="kt-center" style="margin-top: 0px">
  <ClimbCheckpoint :done="4" concept="Distillation" books covers />
</div>

<!--
⏱ 0:20 · script: [CHECKPOINT ClimbCheckpoint "the climb so far"] Four steps up the *climb* | the stairs to Retrieve, Elaborate next; the books under the stretch climbed ⏱ 20s

(the stairs, I hop up) Back to the stairs. Read, the bridge, Group, Generate, and now Retrieve.

Sparred offline with Gemma, judged blind by Argon. Failed once, studied the gap, passed. From memory, note closed.

(next) Four steps. Next one looks the other way: Elaborate.
-->

---
status: in-progress
---

# Elaborate: how does it fit my <span class="hot">world</span>?

<div class="kt-center" style="margin-top: 18px">
  <ElaborateSteps />
</div>

<!--
⏱ 0:30 · script: [STEPS ElaborateSteps "climb step 5 · elaborate"] Elaborate: how does it fit my *world*? | three boxes, in the order the coach asks: why (a reason, + follow-ups), connect (a link outside the note; the only question the style changes), apply (a real place, 1.Projects); at the foot: checked in code, not graded, no review, into ## My elaborations ⏱ 30s

Retrieve asks: is it in my head? Step five looks the other way. Elaborate asks: how does it fit into everything else I know?

(why) coach elaborate asks three questions, always in this order. First, why: why is it built this way, what would break without it? It only takes an answer with a reason in it: because, so that, otherwise.

(connect) Second, connect: what is it like? And the answer has to link to another note, or to something from my own work. This is the only question the sparring style changes.

(apply) Third, apply: where would I use it this month? A real project, a file, a team.

(the foot) No model checks these: plain TypeScript does. Nothing is graded, no review gets scheduled. The answers just go into the note. Three more threads back to the idea. Let's do it on Distillation.
-->

---
status: in-progress
---

# Why: give it a <span class="hot">reason</span>

<div class="kt-center" style="margin-top: 4px">
  <ElaborateTurn kind="why" />
</div>

<!--
⏱ 0:35 · script: [STAGE ElaborateTurn why "elaborate · why"] Why: give it a *reason* | Gemma's why question; my answer (✓ a reason: because, otherwise); the follow-up "What has to be true for that to work?"; my answer (✓ so that) ⏱ 35s

(the question) Why is Distillation built this way? What would break if it were not?

(my answer) We mark in thin layers because Future Me, opening a note under a deadline, has ten seconds, not ten minutes. Otherwise a three-page wall of text gets skipped, and I might as well never have saved it. (✓) The code finds the reason: "because", and enough words after it.

(follow-up) Then Gemma may dig, but only with one of three fixed questions. This one: what has to be true for that to work?

(my answer) Each pass keeps only ten to twenty percent of the layer before it, so that the yellow marks actually pop out when I scan the page. (✓)

(If asked: the questions are the code's fixed wording; the answers are mine, written for this talk, not a recorded session. Why may get two follow-ups; connect and apply one each.)
-->

---
status: in-progress
---

# Connect: link it to something <span class="hot">outside</span>

<div class="kt-center" style="margin-top: 4px">
  <ElaborateTurn kind="connect" />
</div>

<!--
⏱ 0:40 · script: [STAGE ElaborateTurn connect "elaborate · connect"] Connect: link it to something *outside* | the feynman connect question; my first try, soup into sauce (✗ no link); the code's refusal; the second try with [[Executive summary]] and [[Fluency illusion]] (✓ linked) ⏱ 40s

(the question) The note is in the Feynman style, so the connect question is: what everyday thing is Distillation like? No jargon.

(1st try) It's like boiling a pot of soup down into a rich sauce, so only the flavor stays. Nice, right? (✗)

(refused) Refused. Not by a model: by the code. Connect it to something outside this note. A nice metaphor that links to nothing is still an island.

(2nd try) So: like boiling sap into syrup, or how an Executive summary gives you the main decision on page one. Except, unlike an AI summary that causes the Fluency illusion, I boiled the layers down myself. (✓ linked) Two real links, to two notes I already have. And the second one is where this talk started.
-->

---
status: in-progress
---

# Apply: name a real <span class="hot">place</span>

<div class="kt-center" style="margin-top: 70px">
  <ElaborateTurn kind="apply" />
</div>

<!--
⏱ 0:25 · script: [STAGE ElaborateTurn apply "elaborate · apply"] Apply: name a real *place* | the apply question; my answer, a link to the talk's own project under 1.Projects (✓ 1.Projects) ⏱ 25s

(the question) Last: where would you use Distillation in your own work this month?

(my answer) In my project, Stop Chatting with Your Docs. When I turn my raw chapter notes from five books into the slides for this talk, without re-reading twelve hundred pages the night before DevFest. (✓) A link under Projects: accepted.

And the three answers go into the note, under My elaborations. Not graded, no review. Step five: done.
-->

---
status: in-progress
---

# Five steps up the <span class="hot">climb</span>

<div class="kt-center" style="margin-top: 0px">
  <ClimbCheckpoint :done="5" concept="Distillation" books covers />
</div>

<!--
⏱ 0:15 · script: [CHECKPOINT ClimbCheckpoint "the climb so far"] Five steps up the *climb* | the stairs to Elaborate, Space next; the books under the stretch climbed ⏱ 15s

(the stairs, I hop up) Back to the stairs. Read, the bridge, Group, Generate, Retrieve, and now Elaborate.

Three more threads to the idea: a reason, a link, a real place. Not graded, no review.

(next) Five steps. Next: Space. The idea comes back when it's due, and I have to pass again.
-->

---
status: in-progress
---

# Space: explain it again, a day <span class="hot">later</span>

<div class="kt-center" style="margin-top: 22px">
  <SpaceDays />
</div>

<!--
⏱ 0:30 · script: [STEPS SpaceDays "climb step 6 · space"] Space: explain it again, a day *later* | three day cards: day 0 Retrieve (spar → judge, failed once, studied, passed); ≥ 1 day; day 1 Space, feynman, spar ✓ judge ✓; ≥ 1 day; day 2 Space, socratic (the coach switches), spar ✓ judge ✓ ⏱ 30s

(day 0) Step six, Space, is the judge step again. Same loop as Retrieve: spar offline with Gemma, then Argon judges, blind. On day zero I failed once, studied, and passed.

(≥ 1 day, day 1) But Space only counts when I come back at least a day later. Recalling something just before you forget it is what makes it last. Day one: same note, its own style, Feynman. Spar, pass. Judge, pass.

(day 2) And then the coach does something on its own: it switches the style. Day two: Socratic. Same idea, asked from a different side.

A judgement alone doesn't count: the judge grades an answer I already gave, it's not a new recall. And the last step, Teach, stays locked until I've passed in two different styles.

(If asked: the days are illustrative; the rule and the style switch are ai-coach ADR-0047, socratic as the second style, or feynman when the note itself is socratic.)
-->

---
status: in-progress
---

# More styles, higher <span class="hot">rank</span>

<div class="kt-center" style="margin-top: 22px">
  <SpaceRank />
</div>

<!--
⏱ 0:30 · script: [STAGE SpaceRank "space · rank"] More styles, higher *rank* | four rungs by styles passed in a spaced spar: 1 Unranked (Teach locked), 2 Bronze (Teach opens), 3 Silver (+ cornell), 4 Gold (+ devil); I climb to Bronze; Silver and Gold dashed, ahead ⏱ 30s

(the rungs) And it doesn't stop at two. Every style I pass a spaced spar in is one more side of the idea I can defend.

(Unranked) One style: unranked. I can explain it one way, and Teach stays locked.

(Bronze, I climb) Two styles: Bronze. That's me now, Feynman and Socratic. Teach opens.

(Silver, Gold) Add Cornell, the author's argument: Silver. Add the devil's advocate, where it breaks: Gold. Four styles, four sides of the same idea.

(the foot) Like a ranked game: the rank isn't the point. The point is it keeps asking from a side you haven't trained yet.

(If asked: the two-style gate for Teach is in the coach today, ADR-0047. The rank names are my design for it, not shipped yet.)
-->

---
status: in-progress
---

# Six steps up the <span class="hot">climb</span>

<div class="kt-center" style="margin-top: 0px">
  <ClimbCheckpoint :done="6" concept="Distillation" books="all" covers />
</div>

<!--
⏱ 0:40 · script: [CHECKPOINT ClimbCheckpoint "the climb so far"] Six steps up the *climb* | the stairs to Space, Teach next; under the stairs the books: Building a Second Brain over Read, the bridge, Group and Generate; Make It Stick over Group to Space; the styles' books (The Socratic Method, Feynman's Mental Models) over Retrieve, Elaborate, Space; Richard Feynman's Mental Models under Teach; Tomorrowmind under everything ⏱ 30s

(the stairs) Space: done, a day apart, in two styles. Bronze. Six steps. One left: Teach.

(the books) And look underneath. Group and Generate aren't only Make It Stick. They're Building a Second Brain too: once I've synthesized my concepts, I connect them, into layers, and I try to rebuild them before I look. The two books overlap right there.

(the styles) Where the coach questions me in a style, two more books: Farnsworth's The Socratic Method, and Feynman's Mental Models. And Teach, the last step, is Feynman again: the Protégé Effect.

(Tomorrowmind) And under all of it, Tomorrowmind. There's a concept from it in every step, and it's the book that made me build this app in the first place: use AI as a coach, not a crutch.

Six steps. Next: teach.
-->

---
status: in-progress
---

# Ports and <span class="hot">adapters</span>

<div class="kt-center" style="margin-top: 4px">
  <div style="width: 800px">
    <CoachLayers />
  </div>
</div>

<div class="kt-hexcredit kt-stagger">
  <img class="is-face" src="/images/people/greg-radzio.webp" alt="Greg Radzio">
  <div>
    <small>the hexagon, stolen from</small>
    <b>Greg <span class="hot">Radzio</span></b>
    <span class="dim">Hexagonal Architecture in Angular</span>
  </div>
  <div class="kt-hexcredit__event"><img src="/images/logos/ng-poland.webp" alt=""><small>NG Poland<br>2022</small></div>
</div>

<div class="kt-hexwatch kt-stagger">
  <QR url="https://www.youtube.com/watch?v=nNIUTBHaiG8" :size="62" />
  <div>
    <small>the original</small>
    <b>Watch Greg's <span class="hot">talk</span></b>
    <span class="dim">on YouTube</span>
  </div>
</div>

<style>
/* the credit, top right beside the headline: who the hexagon came from */
.kt-hexcredit { position: absolute; top: -4px; right: 40px; display: flex; align-items: center; gap: 12px; padding: 8px 14px 8px 8px; border: 1.5px solid var(--kt-line-strong); border-radius: 999px; background: var(--kt-card); }
.kt-hexcredit .is-face { width: 58px; height: 58px; border-radius: 50%; object-fit: cover; border: 2px solid var(--kt-hot); }
.kt-hexcredit > div { display: flex; flex-direction: column; line-height: 1.2; }
.kt-hexcredit small { font: 700 10.5px var(--font-family-mono); text-transform: uppercase; letter-spacing: 0.1em; color: var(--kt-muted); }
.kt-hexcredit b { font-size: 19px; font-weight: 800; color: var(--kt-heading); }
.kt-hexcredit .dim { font: 600 11px var(--font-family-mono); }
.kt-hexcredit .kt-hexcredit__event { align-items: center; gap: 2px; margin-left: 6px; padding-left: 14px; border-left: 1.5px solid var(--kt-line-strong); text-align: center; }
.kt-hexcredit__event img { width: 30px; height: 30px; object-fit: contain; }
.kt-hexcredit__event small { font-size: 8.5px; line-height: 1.25; color: var(--kt-heading); }
/* bottom left, under the cli: a QR to Greg's talk */
.kt-hexwatch { position: absolute; top: 326px; left: 25px; display: flex; align-items: center; gap: 10px; }
.kt-hexwatch .kt-qr { padding: 5px; border-radius: 10px; }
.kt-hexwatch > div { display: flex; flex-direction: column; line-height: 1.25; }
.kt-hexwatch small { font: 700 10px var(--font-family-mono); text-transform: uppercase; letter-spacing: 0.1em; color: var(--kt-muted); }
.kt-hexwatch b { font-size: 14px; font-weight: 800; color: var(--kt-heading); }
.kt-hexwatch .dim { font: 600 11px var(--font-family-mono); }
</style>


<!--
⏱ 0:40 · script: [FILES "hexagonal architecture"] Ports and *adapters* | the hexagon: domain inside application, cli driving from the left, four adapters plugging into ports on the right; under it "Architecture is protected by Nx enforce module boundaries", with the Nx logo ⏱ 40s

(Greg, top right) Hexagonal, enforced by Nx. And I didn't invent this: I stole it from Greg Radzio, from his talk "Hexagonal Architecture in Angular" at NG Poland. If it works, credit him. If it breaks, that's mine. (the QR, bottom left) His talk is on YouTube: scan it, it's where this hexagon comes from.

(the hexagon) In the middle, the application: one use case per command. Read, synthesize, group, generate, spar, judge, study, elaborate, teach, and climb, which shows where each idea stands. Inside it, the domain: the rules of learning, including the four coaching styles, feynman, socratic, cornell and devil, the ones you've just seen. It imports nothing, not even Node.

(the cli) On the left, the driving side: the terminal and the cli, the composition root, the only place a port meets its adapter.

(the adapters) On the right, the driven side. The core defines the ports, and each piece of technology plugs in: the vault over MCP, Gemma on Ollama, which plays seven parts now, the sparring partner, the synthesis partner, the student I teach and four more, Argon as the judge, and local state for the queue and the clock. Swapping Gemma for another model is one new adapter.

(the red arrow, the Nx line) Every arrow points in, and Nx enforces the boundaries: if one points out, the module-boundaries rule fails the build.
-->

---
status: in-progress
---

# The application <span class="hot">flow</span>

<div class="kt-center" style="margin-top: 24px">
  <AppFlow />
</div>

<!--
⏱ 0:35 · script: [ARCH AppFlow "the whole flow"] The application *flow* | cloud band on top, Argon only over Retrieve and Space; eight step cards: number, step, two or three words, the helper's mark; Retrieve and Space tagged EXAM (one style, then more); laptop band below: Obsidian, kb-template · MCP, Gemma · Ollama ⏱ 35s

(the cards) One idea, start to finish. One command per step, and I do the work in every one.

Read: raw material, and I keep the notes that resonate. No AI. Synthesize: bold, highlight, summarize. Then the climb. Group: I make areas and sort every concept into one. Generate: I write what I know, before anyone asks. (exam) Retrieve is an exam: from memory, questioned in one style. Elaborate: why, like, use. Space is the exam again, a day, a week or a month later, in more and more styles. And teach.

(offline) Five steps run fully offline: on the train, in airplane mode. (Teach, on site) And Teach happens on site: in front of real people. Like right now. (the cloud) Retrieve and Space spar offline too, and only the judge goes online. Argon gets my answer, never my notes.

(the laptop) Everything else stays here: Obsidian, kb-template, Gemma on Ollama.
-->
