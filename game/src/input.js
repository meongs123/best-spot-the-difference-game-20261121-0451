// Mouse and keyboard input for Senja Express: clicks on panels and HUD
// buttons, the magnifier lens, and the keyboard cursor. One job: turn raw
// events into game actions, with no drawing in it.
import {
  CLICK_SLOP,
  FOOTER_Y,
  LEFT_PANEL_X,
  MARKER_RADIUS,
  PANEL_HEIGHT,
  PANEL_WIDTH,
  PANEL_Y,
  RIGHT_PANEL_X,
  SCENES,
} from './config.js';
import {
  jumpToScene,
  markFound,
  markWrong,
  nextScene,
  restartAll,
  restartScene,
  useHint,
} from './state.js';
import { isMuted, playClick, toggleMute } from './audio.js';
import { SCENE_DEFS } from './scenes.js';

export const BUTTONS = {
  hint: { x: 1000, y: 16, w: 88, h: 44, label: 'Hint' },
  pause: { x: 1098, y: 16, w: 88, h: 44, label: 'Pause' },
  sound: { x: 1196, y: 16, w: 68, h: 44, label: 'Sound' },
  next: { x: 540, y: 440, w: 200, h: 52, label: 'Next scene' },
  again: { x: 540, y: 440, w: 200, h: 52, label: 'Play again' },
  retry: { x: 540, y: 440, w: 200, h: 52, label: 'Retry scene' },
};

export function sceneTabRect(index) {
  return { x: 440 + index * 130, y: FOOTER_Y + 36, w: 118, h: 42 };
}

export const keyboardCursor = { x: 324, y: 368, active: false };
export const magnifier = { on: false, x: 0, y: 0, held: false, toggled: false };
export const mouse = { x: -1, y: -1, inside: false };

function inside(rect, x, y) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

function panelAt(x, y) {
  if (y < PANEL_Y || y > PANEL_Y + PANEL_HEIGHT) return -1;
  if (x >= LEFT_PANEL_X && x <= LEFT_PANEL_X + PANEL_WIDTH) return 0;
  if (x >= RIGHT_PANEL_X && x <= RIGHT_PANEL_X + PANEL_WIDTH) return 1;
  return -1;
}

function toSceneCoords(panel, x, y) {
  const origin = panel === 0 ? LEFT_PANEL_X : RIGHT_PANEL_X;
  return { x: x - origin, y: y - PANEL_Y };
}

export function tryMarkAt(state, canvasX, canvasY, now) {
  const panel = panelAt(canvasX, canvasY);
  if (panel === -1) return false;
  const { x, y } = toSceneCoords(panel, canvasX, canvasY);
  const found = state.found[state.sceneIndex];
  const diffs = SCENE_DEFS[state.sceneIndex].diffs;
  for (let i = 0; i < diffs.length; i++) {
    if (found.has(i)) continue;
    const d = diffs[i];
    const dist = Math.hypot(x - d.x, y - d.y);
    if (dist <= d.r + CLICK_SLOP) {
      markFound(state, i, now);
      return true;
    }
  }
  markWrong(state, canvasX, canvasY, now);
  return false;
}

export function attachInput(canvas, state, hooks) {
  const now = () => performance.now();

  function canvasPoint(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  }

  function togglePause() {
    if (state.phase === 'playing') state.phase = 'paused';
    else if (state.phase === 'paused') state.phase = 'playing';
    playClick();
  }

  canvas.addEventListener('contextmenu', (e) => e.preventDefault());

  canvas.addEventListener('mousemove', (event) => {
    const p = canvasPoint(event);
    mouse.x = p.x;
    mouse.y = p.y;
    mouse.inside = true;
    magnifier.x = p.x;
    magnifier.y = p.y;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.inside = false;
  });

  canvas.addEventListener('mousedown', (event) => {
    const p = canvasPoint(event);
    if (event.button === 2) {
      magnifier.held = true;
      magnifier.on = true;
      magnifier.x = p.x;
      magnifier.y = p.y;
      return;
    }
    if (event.button !== 0) return;
    keyboardCursor.active = false;
    if (state.phase === 'sceneClear' && inside(BUTTONS.next, p.x, p.y)) {
      nextScene(state);
      playClick();
      return;
    }
    if (state.phase === 'win' && inside(BUTTONS.again, p.x, p.y)) {
      restartAll(state);
      playClick();
      return;
    }
    if (state.phase === 'timeUp' && inside(BUTTONS.retry, p.x, p.y)) {
      restartScene(state);
      playClick();
      return;
    }
    if (state.phase === 'paused') return;
    if (inside(BUTTONS.hint, p.x, p.y)) {
      useHint(state, now());
      return;
    }
    if (inside(BUTTONS.pause, p.x, p.y)) {
      togglePause();
      return;
    }
    if (inside(BUTTONS.sound, p.x, p.y)) {
      toggleMute();
      playClick();
      return;
    }
    for (let i = 0; i < SCENES.length; i++) {
      if (inside(sceneTabRect(i), p.x, p.y)) {
        jumpToScene(state, i);
        playClick();
        return;
      }
    }
    if (state.phase === 'playing') tryMarkAt(state, p.x, p.y, now());
  });

  canvas.addEventListener('mouseup', (event) => {
    if (event.button === 2) {
      magnifier.held = false;
      if (!magnifier.toggled) magnifier.on = false;
    }
  });

  window.addEventListener('keydown', (event) => {
    const k = event.key;
    if (k === 'ArrowLeft' || k === 'ArrowRight' || k === 'ArrowUp' || k === 'ArrowDown') {
      event.preventDefault();
      keyboardCursor.active = true;
      const step = event.shiftKey ? 48 : 14;
      if (k === 'ArrowLeft') keyboardCursor.x = Math.max(0, keyboardCursor.x - step);
      if (k === 'ArrowRight') keyboardCursor.x = Math.min(canvas.width, keyboardCursor.x + step);
      if (k === 'ArrowUp') keyboardCursor.y = Math.max(0, keyboardCursor.y - step);
      if (k === 'ArrowDown') keyboardCursor.y = Math.min(canvas.height, keyboardCursor.y + step);
      magnifier.x = keyboardCursor.x;
      magnifier.y = keyboardCursor.y;
      return;
    }
    if (k === 'Enter' || k === ' ') {
      event.preventDefault();
      if (state.phase === 'sceneClear') {
        nextScene(state);
        return;
      }
      if (state.phase === 'win') {
        restartAll(state);
        return;
      }
      if (state.phase === 'timeUp') {
        restartScene(state);
        return;
      }
      if (state.phase === 'playing') {
        keyboardCursor.active = true;
        tryMarkAt(state, keyboardCursor.x, keyboardCursor.y, now());
      }
      return;
    }
    if (k === 'h' || k === 'H') {
      if (state.phase === 'playing') useHint(state, now());
      return;
    }
    if (k === 'p' || k === 'P' || k === 'Escape') {
      if (state.phase === 'playing' || state.phase === 'paused') togglePause();
      return;
    }
    if (k === 'r' || k === 'R') {
      if (state.phase !== 'win') restartScene(state);
      return;
    }
    if (k === 'm' || k === 'M') {
      toggleMute();
      return;
    }
    if (k === 'n' || k === 'N') {
      if (state.phase === 'sceneClear') nextScene(state);
      return;
    }
    if (k === 'z' || k === 'Z') {
      magnifier.toggled = !magnifier.toggled;
      magnifier.on = magnifier.toggled || magnifier.held;
      return;
    }
    if (k === '1' || k === '2' || k === '3') {
      jumpToScene(state, Number(k) - 1);
    }
  });
}

export function soundLabel() {
  return isMuted() ? 'Muted' : 'Sound';
}
