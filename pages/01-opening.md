---
layout: cover
scheme: light
surface: soft
subtitle: "Architecting a Local-First AI Mind Coach in TypeScript with Gemma & Gemini 4 Argon"
---

# Stop Chatting with<br><span class="hot">Your Docs</span>

::bg::

<CoverWeave />

<style>
:global(.kt-cover__sub) { max-width: 600px; }
:global(.kt-cover__by) { font-size: 22px; gap: 18px; }
:global(.kt-cover__logo) { height: 40px; }
</style>

<!--
⏱ 0:20 · script line 11: [COVER] Stop Chatting with *Your Docs*
Status: READY (speaker sign-off 2026-10-22). Light soft cover on a dark talk: a deliberate single-slide override (scheme: light).
The background (CoverWeave) loops while people walk in: a learner links notes from a book, they slide into the .md vault, the brain wires up, then Gemma (local sparring partner) asks and Argon (cloud judge, blind) grades: four checks, one gap redrawn, next review scheduled.
-->

---
align: center
surface: soft
---

<SpeakerIntro>
  <div class="kt-hobby">
    <div class="kt-hobby__favs">
      <figure class="kt-fav"><img src="/images/hobbies/warhammer40k.jpg" alt="Warhammer 40k" class="is-full"></figure>
      <figure class="kt-fav"><img src="/images/hobbies/pan-lodowego-ogrodu.jpg" alt="Pan Lodowego Ogrodu" class="is-full"></figure>
    </div>
  </div>
  <div class="kt-hobby">
    <div class="kt-hobby__favs">
      <figure class="kt-fav"><img src="/images/hobbies/thorgal.jpg" alt="Thorgal" class="is-full is-tall"></figure>
      <figure class="kt-fav"><img src="/images/hobbies/amazing-spiderman.jpg" alt="The Amazing Spider-Man" class="is-full is-tall"></figure>
    </div>
  </div>
  <div class="kt-hobby">
    <div class="kt-hobby__favs">
      <figure class="kt-fav"><img src="/images/hobbies/pokemon-crystal.webp" alt="Pokémon Crystal" class="is-full"></figure>
      <figure class="kt-fav"><img src="/images/hobbies/world-of-warcraft.png" alt="World of Warcraft" class="is-logo"></figure>
    </div>
  </div>
  <div class="kt-hobby">
    <div class="kt-hobby__favs">
      <figure class="kt-fav"><img src="/images/hobbies/one-piece.png" alt="One Piece" class="is-logo"></figure>
      <figure class="kt-fav"><img src="/images/hobbies/overlord.png" alt="Overlord" class="is-logo"></figure>
    </div>
  </div>
</SpeakerIntro>

<style>
:global(.kt-me__lines .kt-hobby) {
  display: grid;
  grid-template-columns: auto;
  align-items: start;
  gap: 14px;
  margin-bottom: 16px;
  white-space: normal;
}
:global(.kt-hobby__favs) { display: flex; gap: 14px; }
:global(.kt-fav) { margin: 0; width: 160px; }
:global(.kt-fav img) {
  display: block;
  width: 160px;
  height: 84px;
  object-fit: contain;
  border-radius: 8px;
}
:global(.kt-fav img.is-tall) { height: 128px; }
/* WoW badges on the photo: Horde (faction) bottom left, Warlock (class) bottom right */
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
⏱ 0:30 · script line 12: [INTRO] Hobbies
Status: READY (speaker sign-off 2026-10-22). Soft dark surface.
Quick and punchy. Adrian, full-stack at PushBased. Off the clock: books (Warhammer 40k, and Grzędowicz's Pan Lodowego Ogrodu, "Lord of the Ice Garden"), comics (Thorgal, The Amazing Spider-Man), games (Pokémon Crystal, World of Warcraft) and anime (One Piece, Overlord). The two badges on the photo: Horde (faction) and Warlock (class), from World of Warcraft. Then straight into the train story.
-->

---
surface: accent-1
align: center
kicker: phase 1
status: in-progress
---

<h1 class="s">Stop <span class="hot">pulling</span></h1>

<div style="margin-top: 64px">
  <Journey :stops="['stop pulling', 'build the brain', 'create concepts', 'push the challenge', 'judge blind']" :at="0" :from="1" />
</div>

<!--
⏱ 0:08 · script: [PHASE] Stop *pulling*
-->

---
kicker: how this talk started
status: done
---

# Born on a train<br>with <span class="hot">no signal</span>

<div class="kt-center" style="margin-top: 18px">
  <TrainOffline />
</div>

<!--
⏱ 0:45 · script line 14: [STAGE TrainOffline "how this talk started"] Born on a train / with *no signal* ⏱ 45s
Comedic, quick; let the animation land each beat.

So: this talk was born on a train. PKP Intercity, for the locals. (beat)

I'd just finished the book. Closed it, fired up, let's build something! (book snaps shut)

Laptop open. Wi-Fi: connecting… connecting… (beat) No internet. (rage bubble) Yes. That was my exact reaction.

So with no internet and nothing to look up, I just started spamming notes. Everything in my head, into notes.md, as fast as I could type. (notes fly out)

And I started connecting them. This idea links to that one, that one to this. Look at that graph. Beautiful. (links draw)

And then everything linked to everything. (graph tangles) I hadn't built a second brain. I'd built a pile. Dropping notes in doesn't help if nothing tells you where they go or what to do next. (thought: "Organize that CHAOS using PARA")

What I needed was structure, and a plan simple enough to follow on a train. The book had one: four folders. P, A, R, A. (notes drop into the four folders) Hold that thought: we open those four folders in a minute.

And even with a plan, the doubt. (thought bubble) Do I really get it? Or did I just read it? Without the book and without the internet, there was nobody to ask me.

And that's where the idea came from: an offline sparring partner. Something that runs on my laptop, no Wi-Fi, and fires questions back at me instead of answers. (bulb)

That's what we're building today.
-->
