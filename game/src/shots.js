// Deterministic screenshot states for Senja Express. The game reads
// ?shot=<name> from the URL and pre-sets a mid-game state, so screenshots
// are exact renders of the game's own code: the same panels, markers,
// counter and timer a player would see. In shot mode the timer is frozen
// and no randomness runs. One job: the four staged states.
import { SCENE_TIME_SECONDS } from './config.js';

const PRESETS = {
  // Cover: scene 1, three differences found, four still to find.
  start: { scene: 0, found: [0, 1, 2], timeLeft: 151, score: 375, streak: 3 },
  // Mid-play: scene 2, two found, five to go, magnifier lens open.
  midplay: { scene: 1, found: [1, 4], timeLeft: 98, score: 640, streak: 2, lens: { x: 470, y: 330 } },
  // Scene 3, hardest: four found, three to go, streak x4.
  scene3: { scene: 2, found: [0, 2, 3, 5], timeLeft: 74, score: 1180, streak: 4 },
  // End: every scene cleared, win overlay up.
  end: { scene: 2, found: [0, 1, 2, 3, 4, 5, 6], timeLeft: 63, score: 2475, streak: 7, win: true },
};

export function applyShot(state, input) {
  const params = new URLSearchParams(window.location.search);
  const name = params.get('shot');
  if (!name || !PRESETS[name]) return false;
  const p = PRESETS[name];
  state.sceneIndex = p.scene;
  state.found = [new Set(), new Set(), new Set()];
  state.found[p.scene] = new Set(p.found);
  state.timeLeft = p.timeLeft;
  state.lastTickSecond = Math.ceil(p.timeLeft);
  state.score = p.score;
  state.streak = p.streak;
  state.bestStreak = p.streak;
  state.totalFound = p.found.length + p.scene * 7;
  state.scenesCleared = p.scene;
  state.frozen = true;
  if (p.win) {
    state.phase = 'win';
    state.scenesCleared = 3;
    state.totalFound = 21;
  }
  if (p.lens) {
    input.magnifier.on = true;
    input.magnifier.toggled = true;
    input.magnifier.x = p.lens.x;
    input.magnifier.y = p.lens.y;
  }
  return true;
}

export function shotSecondsLeft() {
  return SCENE_TIME_SECONDS;
}
