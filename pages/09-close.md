
# Back on the <span class="hot">train</span>

<div class="kt-center" style="margin-top: 22px">
  <BackOnTrain />
</div>

<!--
⏱ 0:30 · script: [STAGE BackOnTrain "where it started"] Back on the *train* | bookend to TrainOffline, three beats on the same PKP Intercity laptop: offline sparring, five minutes of train Wi-Fi to get judged, then "no internet. again."; the doubt "How can I know that I understand it?" is struck and answered "I explain it. offline, then judged" ⏱ 30s

Remember the train? No signal, a finished book, and one question: how can I know that I understand it?

(no internet) Same train. Still no internet. But now Gemma asks me. (the question) Why does highlighting go inside the bold? (my answer) Each layer keeps only the best of the one before. (covered) Covered. Offline.

(Wi-Fi, the countdown) And then, a miracle: the train Wi-Fi comes back. For about five minutes. That's all I need. (Argon) The judge gets my answer, never my notes. (pass) Pass. Next review in a week.

(no internet. again.) And it's gone again. Doesn't matter. I'm already judged.

(the doubt, struck) That's how I know I understand it. I explain it, offline, and then I get judged.

One step is still open.

(If asked: this slide is the loop as I use it, not a recorded session; my real first session is the one on the AnswerGap slide ("It found the gap I couldn't see"), and that one failed.)
-->

---

# Five books, one <span class="hot">workshop</span>

<div class="kt-center" style="margin-top: 4px; zoom: 0.95">
  <BooksToTalk />
</div>

<!--
⏱ 0:20 · script: [STAGE BooksToTalk "how this workshop was made"] Five books, one *workshop* | the five covers land, their lines run into notes → distill → concepts → this workshop ⏱ 20s

(the books) Everything you heard today started here. Building a Second Brain: my notes are a resource, not a graveyard. Make It Stick: recalling beats rereading. Feynman: if you can't explain it plainly, you don't get it. Farnsworth's Socratic Method: claim, why, counterexample. And Tomorrowmind: hand all your thinking to AI and you lose the resilience to adapt; use it as a coach and you keep it.

(notes) I read them and marked what resonated. (distill) I distilled the marks, layer by layer. (concepts) I turned them into concepts, one idea in my words, and the coach sparred with me on them.

(this workshop) And from those concepts, I built this workshop.
-->

---
status: in-progress
---

# The last step was this <span class="hot">workshop</span>

<div class="kt-center" style="margin-top: 4px">
  <TeachTalk />
</div>

<!--
⏱ 0:25 · script: [PAYOFF TeachTalk "climb step 7 · teach"] The last step was this *workshop* | pays off slide 9's summit (TEACH, the Protégé Effect) and slide 29's step 7: the stairs, on a cinema screen, light up to Teach, flag and confetti, "this workshop"; below, a lecture hall, rows A–C, lights up: the students, you; the GDG logo, DevFest Warsaw and the venue, Google for Startups Campus at Koneser, at the foot ⏱ 25s

(the stairs light up, I hop) Remember the top of the stairs? Teach. The Protégé Effect: you understand something best when you have to explain it to someone else.

(the flag) So, what about teaching? Ladies and gentlemen: I just did it. (this workshop) The last step of my climb was this workshop.

(the hall lights up, row by row) And the students were you, here in this hall at DevFest, at Koneser. Every slide, I had to explain it without the notes in front of me, and every question you'll ask me in a minute is the misconception check.

Thank you.
-->
---
align: center
---

<EndCard qr="https://github.com/push-based/ai-performance-coach" qr-label="Try the coach" :tags="['Design Systems', 'A11Y', 'Nx Architecture', 'Good Ways of using AI']">
  <div class="kt-julian">
    <div class="kt-julian__line">
      <img src="/images/people/julian-jandl.jpg" alt="Julian Jandl">
      <div class="kt-julian__bubble"><b>Julian:</b> “Adrian, you always spend too much time on slides. Last time: <b>100 hours</b>. Here, take my skill.”</div>
    </div>
    <div class="kt-julian__line is-me">
      <div class="kt-julian__bubble is-me"><b>Me, having way too much fun with it:</b> <b class="hot">150 hours</b> 😄</div>
      <img src="/images/speaker.webp" alt="Adrian Romanski">
    </div>
  </div>
</EndCard>

<style>
/* four longer interests: a 2 × 2 grid, no separators */
:global(.kt-end__tags) { display: grid !important; grid-template-columns: auto auto; justify-content: start; column-gap: 32px; row-gap: 6px; font-size: 24px !important; }
:global(.kt-end__tags i) { display: none; }
:global(.kt-end__tags span) { white-space: nowrap; }
/* the thank-you to Julian: a short chat, his line, then mine */
.kt-julian { display: flex; flex-direction: column; gap: 12px; margin: 4px 0 20px; }
.kt-julian__line { display: flex; align-items: center; gap: 10px; }
.kt-julian__line.is-me { justify-content: flex-end; }
.kt-julian__line img { width: 68px; height: 68px; border-radius: 50%; object-fit: cover; flex: none; border: 2px solid var(--kt-card-line); }
.kt-julian__bubble { max-width: 560px; padding: 12px 16px; border-radius: 18px 18px 18px 4px; background: var(--kt-card); border: 1.5px solid var(--kt-card-line); font-size: 20px; line-height: 1.3; color: var(--kt-fg); }
.kt-julian__bubble.is-me { border-radius: 18px 18px 4px 18px; border-color: var(--kt-hot); background: color-mix(in srgb, var(--kt-hot) 10%, var(--kt-bg)); }
.kt-julian__bubble b { color: var(--kt-heading); white-space: nowrap; }
.kt-julian__bubble b.hot { color: var(--kt-hot); }
/* under the QR code: where it goes */
:global(.kt-end__qr span) { text-align: center; }
:global(.kt-end__qr span::after) { content: 'the repo on GitHub:\A push-based/\A ai-performance-coach'; display: block; white-space: pre; margin-top: 6px; font: 600 13px/1.4 var(--font-family-mono); color: var(--kt-muted); }
</style>

<!--
⏱ 0:20 · script line 84: [END] | EndCard, QR to the coach's repo (github.com/push-based/ai-performance-coach); the thank-you to Julian Jandl for the slide-building skill, as a chat

Thank you. And one more thank-you, to Julian. (his bubble) He told me: Adrian, you always spend too much time on slides, last time it was a hundred hours. Here, take my skill, it'll make it faster. (my bubble) And I was having so much fun with it that this one took a hundred and fifty. (laugh) I hope you enjoyed the presentation. And if you want to try the coach: the QR code is the repo.
-->

---
layout: image
image: /images/hobbies/machinekind-robodog.webp
overlay: left
class: kt-rd
status: in-progress
---

<div class="kt-rd__kicker">Robotics Lab Wrocław</div>

<div class="kt-rd__logos">
  <img class="kt-rd__pb" src="/images/logos/PushBased-Logo-Wordmark-White.png" alt="PushBased">
  <span class="kt-rd__x">×</span>
  <img class="kt-rd__mk" src="/images/logos/machinekind.webp" alt="Machinekind">
</div>

# <span class="hot">Robotics</span><br>Division

<div class="kt-rd__crew kt-stagger">
  <div class="kt-rd__who">
    <img src="/images/speaker.webp" alt="Adrian Romanski">
    <div><b>Adrian Romanski</b><span>PushBased</span></div>
  </div>
  <div class="kt-rd__who">
    <img src="/images/people/michal-pogoda-rosikon.jpeg" alt="Michał Pogoda-Rosikoń">
    <div><b>Michał Pogoda-Rosikoń</b><span>Machinekind</span></div>
  </div>
</div>

<style>
/* the photo sits in the right 55% and fades into the dark on its left edge,
   so the robodog stays whole and the text gets a clean panel (theme layout classes, hence :global) */
:global(.kt-rd) { background: var(--kt-bg) !important; }
:global(.kt-rd .kt-image__img) {
  left: 45% !important;
  width: 55% !important;
  object-position: 26% center !important;
  -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 18%);
  mask-image: linear-gradient(to right, transparent 0%, #000 18%);
}
:global(.kt-rd .kt-image__scrim) { display: none; }
:global(.kt-rd .kt-image__body) { width: 44% !important; }
:global(.kt-rd .kt-image__body h1) {
  margin: 0 !important;
  font-size: 54px !important;
  line-height: 1.02 !important;
  letter-spacing: -0.02em;
}
.kt-rd__kicker {
  font: 700 13px var(--font-family-mono);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--kt-good);
}
/* the two logos as one lockup; the hexagon is taller than the wordmark's cap height, so it is sized to match visually */
.kt-rd__logos { display: flex; align-items: center; gap: 16px; margin: 18px 0 16px; }
.kt-rd__pb { height: 32px; width: auto; }
.kt-rd__mk { height: 44px; width: auto; }
.kt-rd__x { font: 300 26px var(--font-family-mono); color: var(--kt-muted); }
/* one row per side: the face, the name, the side */
.kt-rd__crew { display: flex; flex-direction: column; gap: 14px; margin-top: 26px; }
.kt-rd__who { display: flex; align-items: center; gap: 14px; }
.kt-rd__who img {
  width: 62px;
  height: 62px;
  flex: none;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--kt-card-line);
}
.kt-rd__who div { display: flex; flex-direction: column; }
.kt-rd__who b { font-size: 21px; font-weight: 800; color: var(--kt-heading); white-space: nowrap; }
.kt-rd__who span {
  margin-top: 3px;
  font: 600 12px var(--font-family-mono);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--kt-muted);
}
</style>

<!--
⏱ 0:00 · script: [STATEMENT] PushBased *Robotics* Division | a picture slide: the PushBased wordmark × the Machinekind logo, "Robotics Division", Adrian (PushBased) and Michał Pogoda-Rosikoń (Machinekind), next to Machinekind's robodog walking in the lab (photo: machinekind.ai, poster of the "lab-wstaje-i-idzie" video)
Status: not part of the workshop yet; hide or move it once the picture is taken.
-->
