# Spot the Difference — "Twin Lanterns"

[![make.fun bounty](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![make.fun rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![make.fun reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

An original spot-the-difference game built for the [make.fun](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451) bounty **best-spot-the-difference-game-20261121-0451**.

Two near-identical hand-drawn (procedural canvas) scenes sit side by side.
Find all 7 differences in each of 3 scenes before the timer runs out. Found
differences get a bright marker ring on both panels; a hint button spotlights
one difference you have not found yet; wrong clicks cost time. Keyboard and
mouse play, WebAudio bleeps, no network request — everything is static files
under `game/`.

## Play

Serve `game/` with any static server, or run `node serve.ts` and open
http://localhost:8080 in desktop Chrome.

- **Click** (or **Tab** + **Enter**) on a difference in either panel to mark it.
- **H** — hint (limited, costs points). **R** — restart the scene.
- **1 / 2 / 3** — jump to a scene. **M** — mute.

## Layout

- `main.ts` — entry program: copies `game/` and `screenshots/` to `/output`
  and writes `/output/dossier.json` with the vendored make.fun library.
- `vendor/makefun-game.ts` — the kit's library, unchanged.
- `game/` — the playable game as static files (`index.html` + ES modules).
- `screenshots/` — real renders of the game's own code in a browser.

## License

MIT — see [LICENSE](LICENSE).
