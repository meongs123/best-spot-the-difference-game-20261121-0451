// Spot the Difference — entry program (Node 22, standard library only).
//
// The game is plain static files under game/ (game/index.html plus its ES
// modules; no library, no network request). This program hands it in: it
// copies game/ and screenshots/ from beside this file into /output and
// writes /output/dossier.json with the vendored make.fun library, so the
// judge can read the game from the dossier alone.
//
// Run locally to check the hand-in:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Outside the grader MAKEFUN_OUTPUT_DIR stands in for /output.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// Caps matching the scorer's gate (see the kit's reference/gate.json): the
// dossier text is capped, and the rest refuse an entry the scorer would
// refuse (more than 4 screenshots or one over 256 KiB; game/ over 993
// files/dirs or 48 MiB in all, or a path under game/ over 1000 bytes).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
