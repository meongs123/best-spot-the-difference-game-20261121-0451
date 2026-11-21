// Game state for Senja Express: scene progress, timer, score, streak,
// hints, pause and the pop/flash animations. One job: what the game is,
// with no drawing and no input in it.
import {
  HINTS_PER_SCENE,
  POINTS_PER_FIND,
  POINTS_PER_HINT,
  POINTS_PER_STREAK_STEP,
  POINTS_PER_WRONG,
  SCENES,
  SCENE_TIME_SECONDS,
  WRONG_CLICK_TIME_PENALTY,
} from './config.js';
import { SCENE_DEFS } from './scenes.js';
import { playFind, playHint, playSceneClear, playTick, playWin, playWrong } from './audio.js';

export function createState() {
  return {
    phase: 'playing', // playing | paused | sceneClear | win | timeUp
    sceneIndex: 0,
    found: [new Set(), new Set(), new Set()],
    score: 0,
    streak: 0,
    bestStreak: 0,
    hintsLeft: HINTS_PER_SCENE,
    timeLeft: SCENE_TIME_SECONDS,
    lastTickSecond: SCENE_TIME_SECONDS,
    hintFlash: null, // {x, y, until}
    wrongFlashes: [], // {x, y, until}
    pops: [], // {x, y, born}
    hinted: new Set(), // diff indices already hinted this scene
    message: '',
    messageUntil: 0,
    totalFound: 0,
    scenesCleared: 0,
  };
}

export function diffsOf(state) {
  return SCENE_DEFS[state.sceneIndex].diffs;
}

export function remaining(state) {
  return diffsOf(state).length - state.found[state.sceneIndex].size;
}

export function markFound(state, diffIndex, now) {
  const found = state.found[state.sceneIndex];
  if (found.has(diffIndex)) return false;
  found.add(diffIndex);
  state.totalFound += 1;
  state.streak += 1;
  state.bestStreak = Math.max(state.bestStreak, state.streak);
  state.score += POINTS_PER_FIND + (state.streak - 1) * POINTS_PER_STREAK_STEP;
  const diff = diffsOf(state)[diffIndex];
  state.pops.push({ x: diff.x, y: diff.y, born: now });
  playFind();
  if (remaining(state) === 0) {
    state.scenesCleared += 1;
    if (state.sceneIndex === SCENES.length - 1) {
      state.phase = 'win';
      playWin();
    } else {
      state.phase = 'sceneClear';
      playSceneClear();
    }
  }
  return true;
}

export function markWrong(state, x, y, now) {
  state.streak = 0;
  state.score = Math.max(0, state.score - POINTS_PER_WRONG);
  state.timeLeft = Math.max(0, state.timeLeft - WRONG_CLICK_TIME_PENALTY);
  state.wrongFlashes.push({ x, y, until: now + 700 });
  state.message = `Not a difference — minus ${WRONG_CLICK_TIME_PENALTY}s`;
  state.messageUntil = now + 1400;
  playWrong();
}

export function useHint(state, now) {
  if (state.hintsLeft <= 0) {
    state.message = 'No hints left in this scene';
    state.messageUntil = now + 1400;
    return false;
  }
  const found = state.found[state.sceneIndex];
  const unFound = diffsOf(state).map((d, i) => i).filter((i) => !found.has(i) && !state.hinted.has(i));
  if (unFound.length === 0) return false;
  const pick = unFound[Math.floor(Math.random() * unFound.length)];
  state.hinted.add(pick);
  state.hintsLeft -= 1;
  state.score = Math.max(0, state.score - POINTS_PER_HINT);
  const diff = diffsOf(state)[pick];
  state.hintFlash = { x: diff.x, y: diff.y, until: now + 2200 };
  state.message = `Hint: look near — ${diff.label}`;
  state.messageUntil = now + 2200;
  playHint();
  return true;
}

export function nextScene(state) {
  state.sceneIndex = Math.min(state.sceneIndex + 1, SCENES.length - 1);
  state.phase = 'playing';
  state.hintsLeft = HINTS_PER_SCENE;
  state.timeLeft = SCENE_TIME_SECONDS;
  state.lastTickSecond = SCENE_TIME_SECONDS;
  state.hinted = new Set();
  state.hintFlash = null;
  state.wrongFlashes = [];
}

export function restartScene(state) {
  state.found[state.sceneIndex] = new Set();
  state.phase = 'playing';
  state.hintsLeft = HINTS_PER_SCENE;
  state.timeLeft = SCENE_TIME_SECONDS;
  state.lastTickSecond = SCENE_TIME_SECONDS;
  state.hinted = new Set();
  state.hintFlash = null;
  state.wrongFlashes = [];
  state.streak = 0;
}

export function restartAll(state) {
  const fresh = createState();
  Object.assign(state, fresh);
}

export function jumpToScene(state, index) {
  if (index < 0 || index >= SCENES.length) return;
  state.sceneIndex = index;
  state.phase = 'playing';
  state.hintsLeft = HINTS_PER_SCENE;
  state.timeLeft = SCENE_TIME_SECONDS;
  state.lastTickSecond = SCENE_TIME_SECONDS;
  state.hinted = new Set();
  state.hintFlash = null;
  state.wrongFlashes = [];
  state.streak = 0;
}

export function tickTimer(state, dtSeconds, now) {
  if (state.phase !== 'playing') return;
  state.timeLeft = Math.max(0, state.timeLeft - dtSeconds);
  const whole = Math.ceil(state.timeLeft);
  if (whole !== state.lastTickSecond) {
    state.lastTickSecond = whole;
    if (whole <= 10 && whole > 0) playTick();
  }
  if (state.timeLeft <= 0) {
    state.phase = 'timeUp';
    playWrong();
  }
}

export function pruneTransient(state, now) {
  state.wrongFlashes = state.wrongFlashes.filter((f) => f.until > now);
  state.pops = state.pops.filter((p) => now - p.born < 500);
  if (state.hintFlash && state.hintFlash.until <= now) state.hintFlash = null;
  if (state.message && state.messageUntil <= now) state.message = '';
}
