<script setup lang="ts">
import { useTimeline } from '../theme/composables/useTimeline'

/**
 * The pull-vs-push gag, drawn as an old-school Ventrilo client (Windows-classic chrome, the server
 * tree with talk lights on the left, the chat on the right). After a lost match, Julian says
 * we have to analyze our old tactics, maybe rushing B isn't the only option; the speaker suggests
 * asking an AI to summarize them and pulling the result; Michael keys his mic, types
 * "pull-based? at PushBased?", the speaker drops out of the channel and the old-school
 * Counter-Strike 1.6 "Disconnected · Kicked and banned" dialog pops over the client. Fills its
 * container (the slide, via `::bg::`); each player shows their photo in the tree and the chat; paced slowly so the room can read every message.
 * - `pitch`: the speaker's message
 */
withDefaults(defineProps<{ pitch?: string }>(), {
  pitch: 'Easy, we ask the AI to summarize our old rounds and just pull the result 🤖',
})
const { at } = useTimeline(14)
</script>

<template>
  <div class="kt-revoke">
    <div class="kt-revoke__win">
      <div class="kt-revoke__title"><span>Ventrilo</span><i>_</i><i>□</i><i>×</i></div>
      <div class="kt-revoke__head">
        <img src="/images/logos/ventrilo.png" alt="Ventrilo, Surround Sound Voice Communication Software">
        <div class="kt-revoke__btns"><b>Connect</b><b>Setup</b></div>
      </div>
      <div class="kt-revoke__body">
        <div class="kt-revoke__side">
          <ul class="kt-revoke__tree kt-revoke__sunken">
            <li class="is-server">PushBased Gaming</li>
            <li class="is-chan">Lobby</li>
            <li class="is-chan">Counter-Strike 1.6</li>
            <li class="is-user" :class="{ 'is-talk': at(0.5) && !at(4) }"><img class="kt-revoke__ava" src="/images/people/julian-jandl.jpg" alt="">Julian <small>(rush B)</small></li>
            <li class="is-user" :class="{ 'is-talk': at(4.4) && !at(8), 'is-gone': at(12.6) }"><img class="kt-revoke__ava" src="/images/speaker.webp" alt="">Adrian</li>
            <li class="is-user" :class="{ 'is-talk': at(8.4) && !at(13.4) }"><img class="kt-revoke__ava" src="/images/people/michael-hladky.webp" alt="">Michael <small>(admin)</small></li>
            <li class="is-chan">AFK</li>
          </ul>
          <div class="kt-revoke__checks"><span><i />Mute Sound</span><span><i />Mute Mic</span></div>
        </div>
        <div class="kt-revoke__chat">
          <div class="kt-revoke__log kt-revoke__sunken">
            <p class="is-sys">*** Connected to PushBased Gaming</p>
            <p class="is-msg" :class="{ 'is-on': at(0.5) }"><img class="kt-revoke__ava" src="/images/people/julian-jandl-face.jpg" alt=""><span><time>21:47</time> <strong>Julian:</strong> Lost again 😩 We have to analyze our old tactics. Maybe rushing B is not the only option</span></p>
            <p class="is-msg" :class="{ 'is-on': at(4.4) }"><img class="kt-revoke__ava" src="/images/speaker.webp" alt=""><span><time>21:48</time> <strong>Adrian:</strong> {{ pitch }}</span></p>
            <p class="is-msg" :class="{ 'is-on': at(10.4) }"><img class="kt-revoke__ava" src="/images/people/michael-hladky.webp" alt=""><span><time>21:48</time> <strong>Michael:</strong> <em class="is-pull">Pull</em>-based? at <em class="is-push">Push</em>Based? 🤨</span></p>
            <p class="is-sys" :class="{ 'is-on': at(12.6) }">*** Adrian was kicked by Michael</p>
          </div>
          <div class="kt-revoke__send"><span class="kt-revoke__sunken" /><b>Send</b></div>
        </div>
      </div>
      <div class="kt-revoke__status"><span class="kt-revoke__sunken">Connected</span><span class="kt-revoke__sunken">Ping: 42 ms</span></div>
    </div>
    <!-- kicked, old school: the Counter-Strike 1.6 disconnect dialog -->
    <div class="kt-revoke__dim" :class="{ 'is-on': at(13.4) }" />
    <img class="kt-revoke__kicked" :class="{ 'is-on': at(13.4) }" src="/images/memes/kicked-cs.jpg"
      alt="Counter-Strike 1.6 dialog: Disconnected. You have been disconnected from the server. Reason: Kicked and banned">
  </div>
</template>

<style>
/* Windows-classic greys, mixed from the theme's foreground and background */
.kt-revoke {
  --w-face: color-mix(in srgb, var(--kt-fg) 76%, var(--kt-bg));
  --w-hi: var(--kt-fg);
  --w-shadow: color-mix(in srgb, var(--kt-fg) 45%, var(--kt-bg));
  --w-dark: var(--kt-bg);
  --w-text: var(--kt-bg);
  --w-name: color-mix(in srgb, var(--kt-cool) 45%, var(--kt-bg));

  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  padding: 18px 28px;
  overflow: hidden;
  text-align: left;
  font-family: Tahoma, Verdana, 'Segoe UI', sans-serif;
}

.kt-revoke__win {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  padding: 3px;
  background: var(--w-face);
  color: var(--w-text);
  border: 2px solid;
  border-color: var(--w-hi) var(--w-dark) var(--w-dark) var(--w-hi);
  box-shadow: 0 16px 40px color-mix(in srgb, var(--kt-bg) 70%, transparent);
}

.kt-revoke__sunken {
  background: var(--w-hi);
  border: 2px solid;
  border-color: var(--w-shadow) var(--w-hi) var(--w-hi) var(--w-shadow);
  box-shadow: inset 1px 1px 0 var(--w-dark);
}

.kt-revoke__title {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 3px 4px 3px 8px;
  background: linear-gradient(90deg, color-mix(in srgb, var(--kt-cool) 35%, var(--kt-bg)), color-mix(in srgb, var(--kt-cool) 75%, var(--kt-bg)));
  color: var(--kt-fg);
  font-size: 14px;
  font-weight: 700;
}

.kt-revoke__title span { flex: 1; }

.kt-revoke__title i,
.kt-revoke__btns b,
.kt-revoke__send b {
  background: var(--w-face);
  color: var(--w-text);
  border: 2px solid;
  border-color: var(--w-hi) var(--w-dark) var(--w-dark) var(--w-hi);
  font-style: normal;
}

.kt-revoke__title i {
  width: 20px;
  height: 18px;
  font-size: 12px;
  line-height: 13px;
  text-align: center;
}

.kt-revoke__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px 4px;
}

.kt-revoke__head img { height: 58px; }

.kt-revoke__btns { display: flex; gap: 8px; }

.kt-revoke__btns b,
.kt-revoke__send b {
  padding: 4px 18px;
  font-size: 15px;
  font-weight: 400;
}

.kt-revoke__body {
  display: flex;
  flex: 1;
  gap: 8px;
  min-height: 0;
  padding: 4px 6px;
}

.kt-revoke__side {
  display: flex;
  flex-direction: column;
  flex: none;
  width: 290px;
  gap: 6px;
}

.kt-revoke__tree {
  flex: 1;
  margin: 0;
  padding: 6px 4px;
  list-style: none;
  font-size: 17px;
  line-height: 1.6;
}

.kt-revoke__tree li { display: flex; align-items: center; gap: 7px; white-space: nowrap; }
.kt-revoke__tree small { font-size: 14px; color: var(--w-shadow); }
.kt-revoke__tree .is-server { font-weight: 700; }
.kt-revoke__tree .is-chan { padding-left: 18px; }
.kt-revoke__tree .is-user { max-height: 2em; padding-left: 38px; overflow: hidden; transition: opacity 0.3s, max-height 0.3s 0.2s; }
.kt-revoke__tree .is-user.is-gone { max-height: 0; margin: 0; opacity: 0; }

/* the little icons: server, channel folder, user talk light */
.kt-revoke .kt-revoke__tree li::before {
  content: '';
  position: static;
  flex: none;
  width: 12px;
  height: 12px;
  border-radius: 0;
  background: none;
}

.kt-revoke .kt-revoke__tree .is-server::before { background: var(--w-name); border-radius: 2px; }
.kt-revoke .kt-revoke__tree .is-chan::before { border: 2px solid var(--w-shadow); border-top-width: 4px; }

.kt-revoke .kt-revoke__tree .is-user::before {
  border: 1px solid var(--w-dark);
  border-radius: 50%;
  background: var(--w-shadow);
}

.kt-revoke .kt-revoke__tree .is-user.is-talk::before {
  background: var(--kt-good);
  box-shadow: 0 0 6px var(--kt-good);
  animation: kt-revoke-talk 0.5s steps(2) infinite;
}

@keyframes kt-revoke-talk {
  50% { background: color-mix(in srgb, var(--kt-good) 40%, var(--kt-bg)); box-shadow: none; }
}

.kt-revoke__checks { display: flex; gap: 16px; font-size: 14px; }
.kt-revoke__checks span { display: flex; align-items: center; gap: 5px; }

.kt-revoke__checks i {
  width: 13px;
  height: 13px;
  background: var(--w-hi);
  border: 1px solid var(--w-shadow);
  box-shadow: inset 1px 1px 0 var(--w-dark);
}

.kt-revoke__chat {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.kt-revoke__log {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  padding: 8px 12px;
  overflow: hidden;
}

.kt-revoke__log p {
  margin: 0;
  font-size: 22px;
  line-height: 1.3;
  opacity: 0;
  transition: opacity 0.3s;
}

.kt-revoke__log p.is-on,
.kt-revoke__log p.is-sys:first-child { opacity: 1; }

/* the players' faces, framed like old 16-bit buddy icons */
.kt-revoke__ava {
  flex: none;
  width: 22px;
  height: 22px;
  object-fit: cover;
  border: 1px solid var(--w-shadow);
}

.kt-revoke__log .is-msg { display: flex; align-items: flex-start; gap: 12px; }
.kt-revoke__log .is-msg .kt-revoke__ava { width: 88px; height: 88px; object-position: 50% 25%; border-width: 2px; border-color: var(--w-shadow) var(--w-hi) var(--w-hi) var(--w-shadow); }

.kt-revoke__log time { font-size: 15px; color: var(--w-shadow); }
.kt-revoke__log time::before { content: '['; }
.kt-revoke__log time::after { content: ']'; }
.kt-revoke__log strong { color: var(--w-name); }
.kt-revoke__log .is-sys { font-size: 16px; font-style: italic; color: var(--w-shadow); }
.kt-revoke__log .is-sys:last-child { color: color-mix(in srgb, var(--kt-hot) 55%, var(--kt-bg)); font-weight: 700; }
.kt-revoke__log em { font-style: normal; font-weight: 800; }
.kt-revoke__log em.is-pull { color: color-mix(in srgb, var(--kt-hot) 70%, var(--kt-bg)); }
.kt-revoke__log em.is-push { color: color-mix(in srgb, var(--kt-good) 55%, var(--kt-bg)); }

.kt-revoke__send { display: flex; gap: 6px; }
.kt-revoke__send span { flex: 1; height: 30px; }

.kt-revoke__status { display: flex; gap: 3px; padding-top: 3px; font-size: 13px; }
.kt-revoke__status span { padding: 1px 8px; background: none; }
.kt-revoke__status span:first-child { flex: 1; }

.kt-revoke__dim {
  position: absolute;
  inset: 0;
  background: color-mix(in srgb, var(--kt-bg) 60%, transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.kt-revoke__dim.is-on { opacity: 1; }

/* the dialog drops in, then shakes once */
.kt-revoke__kicked {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 760px;
  border-radius: 4px;
  box-shadow: 0 20px 50px color-mix(in srgb, var(--kt-bg) 80%, transparent);
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.5);
  transition: opacity 0.15s, transform 0.4s cubic-bezier(0.3, 1.7, 0.5, 1);
}

.kt-revoke__kicked.is-on {
  opacity: 1;
  transform: translate(-50%, -50%);
  animation: kt-revoke-shake 0.35s linear 0.4s;
}

@keyframes kt-revoke-shake {
  25% { transform: translate(calc(-50% - 6px), -50%) rotate(-1deg); }
  75% { transform: translate(calc(-50% + 6px), -50%) rotate(1deg); }
}

@media (prefers-reduced-motion: reduce) {
  .kt-revoke__kicked.is-on,
  .kt-revoke .kt-revoke__tree .is-user.is-talk::before { animation: none; }
}
</style>
