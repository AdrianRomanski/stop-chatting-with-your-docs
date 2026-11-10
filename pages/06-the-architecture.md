---
surface: accent-1
align: center
kicker: phase 4
---

<h1 class="s">Push the <span class="hot">challenge</span></h1>

<div style="margin-top: 64px">
  <Journey :stops="['stop learning from summaries', 'build the brain', 'create concepts', 'push the challenge', 'judge blind']" :at="3" :from="1" />
</div>

<!--
⏱ 0:08 · script: [PHASE] Push the *challenge*
-->

---
kicker: "climb step 2 · coach group"
status: in-progress
---

# Sort the book into <span class="hot">layers</span>

<div class="kt-center" style="margin-top: 8px">
  <GroupLayers />
</div>

<!--
⏱ 0:50 · script: [STAGE GroupLayers "climb step 2 · coach group"] Sort the book into *layers* | coach group on Building a Second Brain: ten concepts, unsorted, fly into four layers I name (Capture, Organize, Distill, Express, top to bottom), builds-on arrows up the stack, one cycle refused, the rules ticked, Gemma's question ⏱ 35s

Before the coach pushes me, two quieter steps. (2, Group) First, Group: coach group, on the whole book.

(the tray) Synthesize left me ten concept notes from Building a Second Brain. A list. Unsorted. Hard to remember.

(the layers) So I add layers and name them myself. Here I named them after the book: Capture, Organize, Distill, Express. The names are mine to pick. (the chips fly) Every concept goes into exactly one. Green: it belongs there. Distillation, the one we followed, lands in Distill.

(two go red) But I'm not perfect. Executive summary went into Capture, Hemingway bridge into Organize. (Gemma) Gemma doesn't fix it for me. It asks: is Executive summary something you capture, or distill? (I move it, green) Distill, of course. Then: is Hemingway bridge about organizing, or expressing? (green) Expressing. Gemma asks; I move it.

(the arrows) And each layer builds on the one above it: you can't organize what you never captured.

(the red arrow) Draw one arrow too many, Capture building on Express, and the code refuses it: it prints the loop. (the ticks) Two to seven groups, every concept in one, no cycles. Checked in code, not by a model.

That's the rule in the code: Gemma may ask up to three questions about my structure, but a question that proposes a group or a move gets dropped. The frame has to be mine.
-->

---
kicker: "climb step 3 · coach generate"
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
kicker: the climb so far
status: in-progress
---

# Three steps up the <span class="hot">climb</span>

<div class="kt-center" style="margin-top: 10px">
  <ClimbCheckpoint :done="3" concept="Distillation" books covers :gained="[
    { step: 'group', text: 'Building a Second Brain in 4 layers I named · Distillation sits in Distill' },
    { step: 'generate', text: 'guessed before I looked: 2 got it, 1 wrong, corrected in my own words' },
  ]" />
</div>

<!--
⏱ 0:20 · script: [CHECKPOINT ClimbCheckpoint "the climb so far"] Three steps up the *climb* ⏱ 20s

(the stairs, I hop up) Back to the stairs. Read, the bridge, and now Group and Generate.

(the books) And a second book joins under Group and Generate: Make It Stick.

(the rows) The book has a frame I built myself. And I've already been wrong about Distillation once, and fixed it. That's the soil the coach needs. Now it can push.
-->


---
status: in-progress
---

# The loop inside the <span class="hot">climb</span>

<div class="kt-center" style="margin-top: 14px">
  <CoachLoop />
</div>

<!--
⏱ 0:50 · script: [STEPS] The loop inside the *climb* | the README loop with the climb's seven steps numbered on it: 1 read (+ distill, synthesize the bridge) ticked; 2 group, 3 generate before the loop; spar · judge · study = 4 Retrieve; 5 elaborate after a round; review = 6 Space; 7 teach after a spaced pass; the ladder under review [^ladder] ⏱ 50s

(the left zone) Read, distill, and the bridge, synthesize: you just saw those. That half lives in the knowledge base, my second brain: (the logos) Obsidian, where I read and mark, on a kb-template vault.

(the coach) Everything else is ai-coach, and every step of the climb has its place. (2) Group: once a book has its concepts, I sort them into layers I name myself. (3) Generate: before I spar a concept for the first time, I guess what it says from its title alone, then check.

(the ring) Then the loop. Spar, offline, with Gemma. Judge, online, with Argon. Study what you missed. (Retrieve) Those three together are step four: Retrieve, from memory, note closed.

(5) After a round, elaborate: why does it work, what does it link to, where would I use it. (6) And review: the idea comes back when it's due, and I spar it again after a gap. That's Space.

(7) Pass a spaced review, and the last step opens: teach it, to a student who gets it wrong.

(the tags) And under each step, who does the work. Read, distill, review: no AI, just code. Synthesize, group, generate, teach: Gemma, offline, as a plain helper. Only spar, study and elaborate speak in the note's style, feynman, socratic, cornell or devil. And the judge, Argon, online, grades by the style I sparred in.

(the ladder) The schedule: fail, and it's back tomorrow. A new idea comes back tomorrow too, even when I pass. After that, the sparring partner's pass gives three days. Pass the judge, and the gap grows: seven days, fourteen, thirty, up to a year.
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

(the hexagon) In the middle, the application: one use case per command. Read, synthesize, group, generate, spar, judge, study, elaborate, teach, and climb, which shows where each idea stands. Inside it, the domain: the rules of learning, including the four coaching styles, feynman, socratic, cornell and devil; more on those in a minute. It imports nothing, not even Node.

(the cli) On the left, the driving side: the terminal and the cli, the composition root, the only place a port meets its adapter.

(the adapters) On the right, the driven side. The core defines the ports, and each piece of technology plugs in: the vault over MCP, Gemma on Ollama, which plays seven parts now, the sparring partner, the synthesis partner, the student I teach and four more, Argon as the judge, and local state for the queue and the clock. Swapping Gemma for another model is one new adapter.

(the red arrow) Every arrow points in. If one points out, lint fails the build.
-->
