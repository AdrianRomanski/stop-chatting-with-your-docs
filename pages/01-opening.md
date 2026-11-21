---
layout: cover
scheme: light
surface: soft
# the GDG logo sits by my name here; in the corner it would land on the illustration
frame: false
partner: /images/logos/gdg.png
partnerLabel: 'GDG DevFest Warsaw · 21 Nov 2026'
subtitle: "Architecting a Local-First AI Mind Coach in TypeScript with Gemma & Gemini 4 Argon"
---

# Stop Chatting with<br><span class="hot">Your Docs</span>

::bg::

<CoverWeave />

<style>
:global(.kt-cover__sub) { max-width: 600px; }
:global(.kt-cover__by) { font-size: 22px; gap: 18px; }
:global(.kt-cover__logo) { height: 40px; }
/* the event, GDG DevFest Warsaw, above the title: the bottom belongs to the illustration */
:global(.slidev-layout.kt-cover) { justify-content: flex-start !important; padding-top: 58px !important; }
:global(.kt-cover__body) { display: flex; flex-direction: column; }
:global(.kt-cover__partner) { order: -1; margin: 0 0 18px !important; }
/* gdg.png is the mark plus a white wordmark, unreadable on the light cover: show only the mark */
:global(.kt-cover__partner img) { height: 44px !important; width: 91px; object-fit: cover; object-position: left center; }
</style>

<!--
⏱ 0:20 · script line 11: [COVER] Stop Chatting with *Your Docs*
Status: READY (speaker sign-off 2026-10-22). Light soft cover on a dark workshop: a deliberate single-slide override (scheme: light).
The background (CoverWeave) plays once (~20 s) and then holds: a learner links notes from a book, they slide into the .md vault, the brain wires up, then Gemma (local sparring partner) asks and Argon (cloud judge, blind) grades: four checks, one gap redrawn. Then the payoff: the tested brain fills with Matrix code rain (the letters of MATRIX, ones and zeros) that keeps falling while the cover is up. It sets up the Matrix loading scene (NeoGrind), two slides later, after the train. Re-enter the slide to replay.
-->

---
status: in-progress
---

# Install it <span class="hot">while I talk</span>

<div class="kt-setup kt-stagger">
  <div class="kt-setup__card">
    <div class="kt-setup__head"><carbon-logo-github class="kt-setup__icon" /><span>1 · the coach</span></div>
    <QR url="https://github.com/push-based/ai-performance-coach" :size="190" />
    <code>github.com/push-based/<br>ai-performance-coach</code>
  </div>
  <div class="kt-setup__card">
    <div class="kt-setup__head"><img src="/images/logos/obsidian.webp" alt=""><span>2 · no Obsidian yet?</span></div>
    <QR url="https://obsidian.md/download" :size="190" />
    <code>obsidian.md/download</code>
  </div>
</div>

<p class="kt-setup__also">Also: <b>Node.js 24+</b> · <b>Ollama</b>, then <code>ollama pull gemma3</code> (big, start it now)</p>

<style>
/* the setup slide: two QR cards side by side, the rest of the setup in one line under them */
.kt-setup { display: flex; justify-content: center; gap: 48px; margin-top: 10px; }
.kt-setup__card { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 14px 26px 16px; border-radius: var(--radius-lg); background: var(--kt-card); border: 1.5px solid var(--kt-card-line); }
.kt-setup__head { display: flex; align-items: center; gap: 10px; font-size: 20px; font-weight: 800; color: var(--kt-heading); }
.kt-setup__head img, .kt-setup__icon { height: 28px; width: auto; }
.kt-setup__icon { width: 28px; color: var(--kt-heading); }
.kt-setup__card code { font: 600 14px/1.35 var(--font-family-mono); color: var(--kt-muted); text-align: center; background: none; }
.kt-setup__also { margin-top: 18px !important; text-align: center; font-size: 17px; color: var(--kt-muted); }
.kt-setup__also b { color: var(--kt-heading); }
.kt-setup__also code { font: 600 15px var(--font-family-mono); color: var(--kt-hot); }
</style>

<!--
⏱ 0:30 · script: [STAGE QR "setup"] Install it *while I talk* | two QR cards fade in: the coach's repo on GitHub, and the Obsidian download for anyone without it; under them, Node.js 24+, Ollama and ollama pull gemma3 ⏱ 30s
Workshop: leave this up while people scan. The model download is the slow part, so it starts now.

This is a workshop, so let's get the slow part going first. (repo QR) Scan this one: it's the coach, the repo on GitHub. Clone it, the README has the quick setup. (Obsidian QR) No Obsidian yet? This one is the download, it's free. (the line below) And you'll need Node 24 and Ollama. Start ollama pull gemma3 now: it's a few gigabytes, and by the time we need it, it'll be there. While that runs, let me tell you how this all started.
-->

---
status: done
---

# Born on a train<br>with <span class="hot">no signal</span>

<div class="kt-center" style="margin-top: 18px">
  <TrainOffline />
</div>

<!--
⏱ 0:50 · script line 14: [STAGE TrainOffline "how this workshop started"] Born on a train / with *no signal* | one thought cloud, four thoughts: "I'm bored…", "ADHD won't let me sit still", "Let's organize my notes", then the bulb: "A sparring partner, Matrix-style. Offline!", and the person's head and body fill with Matrix code rain (keeps falling); the laptop stays on PKP Intercity, no internet ⏱ 50s
Comedic, quick; let the animation land each beat.

So: this workshop was born on a train. PKP Intercity, for the locals. (beat)

I'd just finished the book. Closed it, fired up, let's build something! (book snaps shut)

Laptop open. Wi-Fi: connecting… connecting… (no internet) No internet. (I'm bored) And a long ride ahead. I was bored.

(ADHD) And my ADHD does not let me just sit there doing nothing. So I started spamming notes. Everything in my head, into notes.md, as fast as I could type. (notes fly out) And connecting them. This links to that, that to this. (links draw)

And then everything linked to everything. (graph tangles) A pile, not a second brain. (let's organize) So: let's organize my notes. The book had a plan: four folders. P, A, R, A. (notes drop into the four folders) Hold that thought: we open those four folders in a minute.

Organized. But do I actually get any of it? Nobody on that train to ask me. A summary wouldn't do it either; I'd tried that before, with an architecture, and it did not go well. I'll tell that one in a minute.

(bulb, Matrix rain in the head and body) And then it hit me. I need a sparring partner. Like in The Matrix. One that works offline, right here on my laptop.
-->

---
status: in-progress
---

<!-- no headline: the storyboard takes the whole slide, from the top -->
<div class="kt-center" style="margin-top: -28px">
  <NeoGrind />
</div>

<!--
⏱ 0:45 · script: [STAGE NeoGrind "what we build"] Not magic, a *grinding system* | a storyboard of Matrix stills with subtitles; the summary: "I know kung fu.", Morpheus throws Neo across the dojo, LOST (00:00:05); the grind, AI as a coach: "Train me, style by style.", the bar split into jujitsu · kempo · taekwondo · drunken boxing · kung fu, Neo in pain lands as it starts, Neo in pain: "Training takes sacrifice."; Morpheus and Tank in one still: "How is he?" / "Ten hours straight. He's a machine.", Neo's punch stops at Morpheus' face, WON (10:00:00); under both: a grinding system, not a magic summary machine ⏱ 45s

(from the train's bulb) You all know the scene. Neo sits in the chair, and the ask is one prompt: (teach me kung fu) "Teach me kung fu." AI as magic. Tank hits enter, and a few seconds later Neo opens his eyes: (I know kung fu) "I know kung fu."

That's the AI summary. One download, a few seconds, and you feel like you know it. (the dojo) And then Morpheus says "show me", and throws him across the floor. (lost) Lost.

But Neo didn't stop at one download. (the grind) He kept the headset on all night, and the ask changed: AI as a coach. "Train me, style by style." Jujitsu. Kempo. Taekwondo. Drunken boxing. Kung fu. While everyone else was asleep. (Neo in pain) And look at him in the chair. It hurts. Training takes sacrifice. (Morpheus and Tank) Morpheus walks up behind Tank: "How is he?" And Tank: "Ten hours straight. He's a machine."

(won) He woke up exhausted, bruised, and dialed in. And this time, he wins.

(what we build) So what we're building today is not a magic summary machine. It's a grinding system: a coach for the ten hours.
-->

---
align: center
surface: soft
---

<SpeakerIntro>
  <div class="kt-cred-head">Web &amp; AI</div>
  <div class="kt-cred">
    <img class="kt-cred__logo is-gde" src="/images/logos/gde-experts.png" alt="Google Developer Experts">
    <span class="kt-cred__v">Angular</span>
    <span class="kt-cred__k">Google Developer Expert</span>
  </div>
  <div class="kt-cred">
    <img class="kt-cred__logo is-gdg" src="/images/logos/gdg.png" alt="Google Developer Groups">
    <span class="kt-cred__v">Wrocław</span>
    <span class="kt-cred__k">Community leader</span>
  </div>
  <div class="kt-cred">
    <img class="kt-cred__logo is-meetjs" src="/images/logos/meetjs.svg" alt="meet.js">
    <span class="kt-cred__v">Wrocław</span>
    <span class="kt-cred__k">Community leader</span>
  </div>
  <div class="kt-cred-head is-robotics">Robotics</div>
  <div class="kt-cred">
    <img class="kt-cred__logo is-erc" src="/images/logos/european-rover-challenge.svg" alt="European Rover Challenge">
    <span class="kt-cred__v">Main judge</span>
    <span class="kt-cred__k">Mars rovers</span>
  </div>
  <div class="kt-cred">
    <img class="kt-cred__logo is-wro" src="/images/logos/world-robot-olympiad.webp" alt="World Robot Olympiad">
    <span class="kt-cred__v">Judge</span>
    <span class="kt-cred__k">Robot olympiad</span>
  </div>
  <div class="kt-cred">
    <img class="kt-cred__logo is-mk" src="/images/logos/machinekind.webp" alt="Machinekind">
    <span class="kt-cred__v">Machinekind</span>
    <span class="kt-cred__k">Community member</span>
  </div>
</SpeakerIntro>

<style>
/* the right side: one row per community role, the program's own logo on top */
:global(.kt-me__lines > .kt-cred) {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 6px 0 6px 18px;
  margin-bottom: 16px;
  border-left: 3px solid var(--kt-c-primary);
}
/* the lockups differ in shape (5.4:1, 4.7:1, 3.5:1): heights tuned so the wordmarks read the same size */
:global(.kt-cred__logo) { display: block; width: auto; height: 24px; margin-bottom: 10px; }
:global(.kt-cred__logo.is-gde) { height: 30px; }
:global(.kt-cred__logo.is-gdg) { height: 27px; }
:global(.kt-cred__logo.is-meetjs) { height: 32px; margin-bottom: 10px; }
:global(.kt-cred__logo.is-erc) { height: 38px; margin-bottom: 6px; }
:global(.kt-cred__logo.is-mk) { height: 34px; margin-bottom: 8px; }
/* the second column of roles squeezes the left side: keep "Software Engineer @ PushBased" on one line */
:global(.kt-me__role) { white-space: nowrap; }
/* two sections, one column each, filled top to bottom: Web & AI (GDE, GDG, meet.js), Robotics (ERC, WRO, Machinekind) */
:global(.kt-me__lines) { display: grid; grid-template-rows: repeat(4, auto); grid-auto-flow: column; column-gap: 40px; align-content: center; }
:global(.kt-me__lines > .kt-cred-head) {
  margin-bottom: 14px;
  font: 800 15px var(--font-family-mono);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--kt-c-primary-soft);
}
:global(.kt-me__lines > .kt-cred-head.is-robotics) { color: var(--kt-good); }
:global(.kt-me__lines > .kt-cred:nth-child(n+6)) { border-left-color: var(--kt-good); }
:global(.kt-cred__logo.is-wro) { height: 34px; margin-bottom: 10px; }
:global(.kt-cred__v) {
  font-size: 26px;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--kt-heading);
}
:global(.kt-cred__k) {
  margin-top: 6px;
  font: 600 13px var(--font-family-mono);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--kt-muted);
}
/* easter egg: WoW badges on the photo, Horde (faction) bottom left, Warlock (class) bottom right */
:global(.kt-me__who) { position: relative; }
:global(.kt-me__who::before),
:global(.kt-me__who::after) {
  content: '';
  position: absolute;
  z-index: 2;
  top: calc(50% + 58px - 40px);
  width: 46px;
  height: 46px;
  border-radius: 50%;
}
:global(.kt-me__who::before) {
  left: -6px;
  background: var(--kt-code-bg) url(/images/badges/horde.png) center / 64% no-repeat;
  box-shadow: 0 0 0 3px var(--kt-card-line), 0 0 18px color-mix(in srgb, var(--kt-bad) 60%, transparent);
}
:global(.kt-me__who::after) {
  left: calc(116px - 40px);
  background: url(/images/badges/warlock.png) center / cover no-repeat;
  box-shadow: 0 0 0 3px var(--kt-card-line), 0 0 18px color-mix(in srgb, var(--kt-c-primary) 70%, transparent);
}
</style>

<!--
⏱ 0:35 · script line 12: [INTRO] Who I am | two sections: Web & AI (GDE Angular, GDG Wrocław, meet.js Wrocław) and Robotics (European Rover Challenge main judge, World Robot Olympiad judge, Machinekind community member)
Soft dark surface. Quick: Adrian, software engineer at PushBased. Google Developer Expert in Angular, and I lead two communities here in Poland: GDG Wrocław and meet.js Wrocław. That's the web and AI side. The other side is robotics: I'm the main judge at the European Rover Challenge, the Mars rover competition, a judge at the World Robot Olympiad, and a member of Machinekind, the robotics and AI collective in Wrocław. Easter egg, not mentioned unless asked: the two badges on the photo are Horde (faction) and Warlock (class) from World of Warcraft. Then into phase 1.
-->

---
surface: accent-1
align: center
status: in-progress
---

<h1 class="s">Stop learning from <span class="hot">summaries</span></h1>

<div style="margin-top: 64px">
  <Journey :stops="['stop learning from summaries', 'build the brain', 'push the challenge']" :at="0" :from="1" />
</div>

<!--
⏱ 0:08 · script: [PHASE] Stop learning from *summaries*
-->
