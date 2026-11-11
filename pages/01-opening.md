---
layout: cover
scheme: light
surface: soft
# the JS Poland logo sits by my name here; in the corner it would land on the illustration
frame: false
partner: /images/logos/js-poland.webp
partnerLabel: 'JS Poland · 18 Nov 2026'
subtitle: "Architecting a Local-First AI Mind Coach in TypeScript with Gemma & Gemini 4 Argon"
---

# Stop Chatting with<br><span class="hot">Your Docs</span>

::bg::

<CoverWeave />

<style>
:global(.kt-cover__sub) { max-width: 600px; }
:global(.kt-cover__by) { font-size: 22px; gap: 18px; }
:global(.kt-cover__logo) { height: 40px; }
/* the event, JS Poland, above the title: the bottom belongs to the illustration */
:global(.slidev-layout.kt-cover) { justify-content: flex-start !important; padding-top: 58px !important; }
:global(.kt-cover__body) { display: flex; flex-direction: column; }
:global(.kt-cover__partner) { order: -1; margin: 0 0 18px !important; }
:global(.kt-cover__partner img) { height: 44px !important; }
</style>

<!--
⏱ 0:20 · script line 11: [COVER] Stop Chatting with *Your Docs*
Status: READY (speaker sign-off 2026-10-22). Light soft cover on a dark talk: a deliberate single-slide override (scheme: light).
The background (CoverWeave) plays once (~18 s) and then holds: a learner links notes from a book, they slide into the .md vault, the brain wires up, then Gemma (local sparring partner) asks and Argon (cloud judge, blind) grades: four checks, one gap redrawn, next review scheduled. Then the payoff, the Matrix dojo scene: the tested brain fills with "I know RxJS" (Neo, neo-matrix.png), and a beat later Morpheus answers beside it: "Show me." (show-me.png). That is the talk in one joke: knowing is not proving. The slide stays on that frame so the room can read it. Re-enter the slide to replay.
-->

---
status: done
---

# Born on a train<br>with <span class="hot">no signal</span>

<div class="kt-center" style="margin-top: 18px">
  <TrainOffline />
</div>

<!--
⏱ 0:55 · script line 14: [STAGE TrainOffline "how this talk started"] Born on a train / with *no signal* ⏱ 55s
Comedic, quick; let the animation land each beat.

So: this talk was born on a train. PKP Intercity, for the locals. (beat)

I'd just finished the book. Closed it, fired up, let's build something! (book snaps shut)

Laptop open. Wi-Fi: connecting… connecting… (beat) No internet. (rage bubble) Yes. That was my exact reaction.

So with no internet and nothing to look up, I just started spamming notes. Everything in my head, into notes.md, as fast as I could type. (notes fly out)

And I started connecting them. This idea links to that one, that one to this. Look at that graph. Beautiful. (links draw)

And then everything linked to everything. (graph tangles) I hadn't built a second brain. I'd built a pile. Dropping notes in doesn't help if nothing tells you where they go or what to do next. (thought: "Organize that CHAOS using PARA")

What I needed was structure, and a plan simple enough to follow on a train. The book had one: four folders. P, A, R, A. (notes drop into the four folders) Hold that thought: we open those four folders in a minute.

And even with a plan, the doubt. (thought bubble) Do I really get it? Or did I just read it? Without the book and without the internet, there was nobody to ask me.

So my first reflex? Just ask AI for a summary. (summary?) Like we all do. (beat) And then I remembered. (architecture docs?) I'd tried exactly that before. With an architecture. And it did not go well. (hold it: the next slide tells it)

And that's where the idea came from: what if a local model acts as a teacher? (bulb) Something that runs on my laptop, no Wi-Fi, and fires questions back at me instead of answers.

That's what we're building today.
-->

---
align: center
surface: soft
---

<SpeakerIntro>
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
</SpeakerIntro>

<style>
/* the right side: one row per community role, the program's own logo on top */
:global(.kt-me__lines > .kt-cred) {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px 0 10px 20px;
  margin-bottom: 22px;
  border-left: 3px solid var(--kt-c-primary);
}
/* the lockups differ in shape (5.4:1, 4.7:1, 3.5:1): heights tuned so the wordmarks read the same size */
:global(.kt-cred__logo) { display: block; width: auto; height: 24px; margin-bottom: 14px; }
:global(.kt-cred__logo.is-gde) { height: 34px; }
:global(.kt-cred__logo.is-gdg) { height: 30px; }
:global(.kt-cred__logo.is-meetjs) { height: 36px; margin-bottom: 12px; }
:global(.kt-cred__v) {
  font-size: 30px;
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
⏱ 0:30 · script line 12: [INTRO] Who I am
Soft dark surface. Quick: Adrian, software engineer at PushBased. Google Developer Expert in Angular, and I lead two communities here in Poland: GDG Wrocław and meet.js Wrocław. Easter egg, not mentioned unless asked: the two badges on the photo are Horde (faction) and Warlock (class) from World of Warcraft. Then into phase 1.
-->

---
surface: accent-1
align: center
status: in-progress
---

<h1 class="s">Stop learning from <span class="hot">summaries</span></h1>

<div style="margin-top: 64px">
  <Journey :stops="['stop learning from summaries', 'build the brain', 'create concepts', 'push the challenge', 'judge blind']" :at="0" :from="1" />
</div>

<!--
⏱ 0:08 · script: [PHASE] Stop learning from *summaries*
-->
