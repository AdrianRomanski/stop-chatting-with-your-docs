---
kicker: "how this talk was made"
---

# Five books, one <span class="hot">talk</span>

<div class="kt-center" style="margin-top: 14px">
  <BooksToTalk />
</div>

<!--
⏱ 0:20 · script: [STAGE BooksToTalk "how this talk was made"] Five books, one *talk* | the five covers land, their lines run into notes → distill → concepts → this talk ⏱ 20s

(the books) Everything you heard today started here. Building a Second Brain: my notes are a resource, not a graveyard. Make It Stick: recalling beats rereading. Feynman: if you can't explain it plainly, you don't get it. Farnsworth's Socratic Method: claim, why, counterexample. And Tomorrowmind: hand all your thinking to AI and you lose the resilience to adapt; use it as a coach and you keep it.

(notes) I read them and marked what resonated. (distill) I distilled the marks, layer by layer. (concepts) I turned them into concepts, one idea in my words, and the coach sparred with me on them.

(this talk) And from those concepts, I built this talk.
-->

---
kicker: where it started
---

# Back on the <span class="hot">train</span>

<div class="kt-center" style="margin-top: 22px">
  <BackOnTrain />
</div>

<!--
⏱ 0:30 · script: [STAGE BackOnTrain "where it started"] Back on the *train* | bookend to TrainOffline (slide 4), three beats on the same PKP Intercity laptop: offline sparring, five minutes of train Wi-Fi to get judged, then "no internet. again."; the doubt "How can I know that I understand it?" is struck and answered "I explain it. offline, then judged" ⏱ 30s

Remember the train? No signal, a finished book, and one question: how can I know that I understand it?

(no internet) Same train. Still no internet. But now Gemma asks me. (the question) Why does highlighting go inside the bold? (my answer) Each layer keeps only the best of the one before. (covered) Covered. Offline.

(Wi-Fi, the countdown) And then, a miracle: the train Wi-Fi comes back. For about five minutes. That's all I need. (Argon) The judge gets my answer, never my notes. (pass) Pass. Next review in a week.

(no internet. again.) And it's gone again. Doesn't matter. I'm already judged.

(the doubt, struck) That's how I know I understand it. I explain it, offline, and then I get judged.

One more thing before you go: let's see the judge, live.

(If asked: this slide is the loop as I use it, not a recorded session; my real first session is the one on slide 35, and that one failed.)
-->

---
surface: accent-2
align: center
---

<div class="kt-live"><i />live demo</div>

<h1 class="s">Judge me <span class="hot">blind</span></h1>

<div class="kt-center" style="margin-top: 36px">
  <JudgeStrip />
</div>

<!--
⏱ 2:30 · script: [DEMO judge] Judge me *blind* → demos/judge.md (2:30, including 30 s for the screen switch)

(it gets) The session I sparred earlier is waiting in the queue. What goes to the judge: the challenge, my answer, my claims. (my notes, struck) Never my notes. (Argon) Gemini 4 Argon judges blind. (it sends back) And it sends back a verdict, the gaps, any hand-waving, and when I see this concept again.

Turn Wi-Fi back on, visibly.

Switch to the terminal (script: talk/demos/judge.md). In ~/projects/ai-coach: npm run coach -- judge. The API key lives in .env and never goes on screen.

Show what leaves the laptop: the challenge, my answer, the style and my core assertions. No note, no title, no path. Argon replies: "Judged by gemini-4-argon.", the verdict with its one-sentence reason, the gaps, hand-waves named as "hand-waving: …". Then the next review date; I confirm.

The moment: it finds the gap without ever seeing my notes.

If the network or the API fails: tell them what slide 35 ("It found the gap I couldn't see") showed, my real session from 25 October: the small model passed me, Argon failed me for hand-waving, next review tomorrow.

Back to the slides: so, last question. When AI is in the room, which one do you want to be?
-->

---
layout: default
---

# Code Monkey or <span class="hot">Gigachad</span>

<div class="kt-center" style="margin-top: 14px">
  <MonkeyChad />
</div>

<!--
⏱ 0:25 · script line 80: [MEME macro] Code Monkey or *Gigachad* | the finale; two panels, the monkey greys out at a VS badge, the chad lights up with sparks, then "Don't outsource your understanding" lands under both (pays off slide 7's "never outsource synthesis"): "Code Monkey: AI produces conclusions for you" vs "Gigachad: AI stores, retrieves and tests, so your brain builds stronger connections" ⏱ 20s

(code monkey) The Code Monkey lets AI pour summaries in. Read, read, read. Recalled: nothing. It's me with the 200 pages.

(VS, the monkey greys out) Or.

(gigachad) And the Gigachad? Same AI, different job. It does the boring parts: store, retrieve, test him. The questions come in, and his own brain builds the connections. (the shades drop) Deal with it.

Same AI. The difference is who does the thinking.

(the last line lands) Don't outsource your understanding.
-->

---
align: center
---

<EndCard qr="https://push-based.io" qr-label="push-based.io" :tags="['Design Systems', 'A11Y', 'Nx Architecture', 'Good Ways of using AI']" />

<style>
/* four longer interests: a 2 × 2 grid, no separators */
:global(.kt-end__tags) { display: grid !important; grid-template-columns: auto auto; justify-content: start; column-gap: 32px; row-gap: 6px; font-size: 24px !important; }
:global(.kt-end__tags i) { display: none; }
:global(.kt-end__tags span) { white-space: nowrap; }
</style>

<!--
⏱ 0:10 · script line 84: [END] | EndCard, QR to push-based.io
-->
