# Senja Express — Spot the Difference

[![make.fun bounty](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![make.fun rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![make.fun reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

An original spot-the-difference game built for the [make.fun](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451) bounty **best-spot-the-difference-game-20261121-0451**.

Ride the dusk train through three scenes — **Peron Senja** (the platform at
dusk), **Gerbong Senja** (inside the carriage) and **Aula Stasiun** (the ticket
hall at night). Each scene shows two near-identical pictures side by side
with **7 fair differences** to find before the 3-minute timer runs out.
Found differences get a big gold ring with a check on **both** panels; a
wrong click costs 5 seconds; a hint spotlights one difference you have not
found yet.

## Depth

- **3 scenes × 7 differences**, each set harder than the last — the hall's
  differences are smaller and quieter than the platform's.
- **Magnifier lens**: hold right-click, or press **Z**, to zoom any spot 2×.
- **Keyboard play**: arrow keys move the crosshair, **Enter**/**Space** marks
  a difference. **H** hint, **P** pause, **R** restart, **M** mute, **1/2/3**
  jump between scenes.
- **Streaks**: consecutive finds without a miss pay a growing bonus.
- All art is procedural flat-vector canvas (no external assets), all sounds
  are tiny WebAudio synth bleeps, and the game makes **no network request**.

## Play

Serve `game/` with any static server, or run `node serve.ts` and open
http://localhost:8080 in desktop Chrome.

## Layout

- `main.ts` — entry program: copies `game/` and `screenshots/` to `/output`
  and writes `/output/dossier.json` with the vendored make.fun library.
- `vendor/makefun-game.ts` — the kit's library, unchanged.
- `game/` — the playable game as static files (`index.html` + ES modules):
  `config.js` (numbers), `draw.js` (vector helpers), `scenes.js` (the three
  scenes and their differences), `state.js` (timer, score, streak, hints),
  `input.js` (mouse, keyboard, magnifier), `render.js` (HUD, panels,
  markers, overlays), `audio.js` (WebAudio sounds), `shots.js` (staged
  screenshot states), `main.js` (bootstrap).
- `screenshots/` — real renders of the game's own code in a browser.

## License

MIT — see [LICENSE](LICENSE).
