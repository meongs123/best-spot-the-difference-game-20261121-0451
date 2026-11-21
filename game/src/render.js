// All drawing of Senja Express: the HUD, the two panels, found-difference
// markers, the magnifier lens and the overlays. One job: what the player
// sees each frame; it reads state, never changes it.
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  FOOTER_Y,
  GAME_TAGLINE,
  GAME_TITLE,
  HUD_HEIGHT,
  LEFT_PANEL_X,
  MARKER_RADIUS,
  PANEL_HEIGHT,
  PANEL_WIDTH,
  PANEL_Y,
  RIGHT_PANEL_X,
  SCENES,
} from './config.js';
import { SCENE_DEFS } from './scenes.js';
import { chip, circle, fillRoundRect, text } from './draw.js';
import { BUTTONS, keyboardCursor, magnifier, sceneTabRect, soundLabel } from './input.js';
import { remaining } from './state.js';

const GOLD = '#ffd93d';
const INK = '#2b1b4d';

function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function drawMarker(ctx, x, y, scale) {
  const r = MARKER_RADIUS * scale;
  ctx.save();
  ctx.lineWidth = 6;
  ctx.strokeStyle = GOLD;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#2b1b4d';
  ctx.beginPath();
  ctx.arc(x, y, r + 4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(x - r * 0.45, y + r * 0.02);
  ctx.lineTo(x - r * 0.1, y + r * 0.38);
  ctx.lineTo(x + r * 0.5, y - r * 0.32);
  ctx.stroke();
  ctx.restore();
}

// Draws one scene's art plus its markers, in scene coordinates (616 x 560).
function drawSceneArt(ctx, state, now) {
  const def = SCENE_DEFS[state.sceneIndex];
  const found = state.found[state.sceneIndex];
  // The right panel always carries every difference; the left never does.
  const right = ctx.__panelRight === true;
  def.draw(ctx, right);
  for (const index of found) {
    const d = def.diffs[index];
    const pop = state.pops.find((p) => p.x === d.x && p.y === d.y);
    let scale = 1;
    if (pop) {
      const age = now - pop.born;
      scale = age < 160 ? 0.4 + (age / 160) * 0.8 : 1.2 - ((age - 160) / 340) * 0.2;
    }
    drawMarker(ctx, d.x, d.y, scale);
  }
  if (state.hintFlash) {
    const pulse = 1 + 0.12 * Math.sin(now / 130);
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = '#4aa8ff';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(state.hintFlash.x, state.hintFlash.y, 34 * pulse, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function drawPanel(ctx, state, panel, now) {
  const x = panel === 0 ? LEFT_PANEL_X : RIGHT_PANEL_X;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, PANEL_Y, PANEL_WIDTH, PANEL_HEIGHT);
  ctx.clip();
  ctx.translate(x, PANEL_Y);
  ctx.__panelRight = panel === 1;
  drawSceneArt(ctx, state, now);
  ctx.restore();
  ctx.__panelRight = false;
  // Frame and panel label.
  ctx.strokeStyle = panel === 0 ? '#4aa8ff' : '#ff9f43';
  ctx.lineWidth = 4;
  ctx.strokeRect(x + 2, PANEL_Y + 2, PANEL_WIDTH - 4, PANEL_HEIGHT - 4);
  chip(ctx, x + 12, PANEL_Y + 12, 118, 30, 'rgba(43,27,77,0.85)', 'rgba(255,255,255,0.25)');
  text(ctx, panel === 0 ? 'ORIGINAL' : 'TWIN', x + 71, PANEL_Y + 28, 15, '#ffffff');
}

function drawHud(ctx, state) {
  ctx.fillStyle = '#241a33';
  ctx.fillRect(0, 0, CANVAS_WIDTH, HUD_HEIGHT);
  text(ctx, GAME_TITLE, 20, 30, 30, GOLD, 'bold', 'left');
  text(ctx, 'SPOT THE DIFFERENCE', 20, 56, 12, '#c9b8e8', 'bold', 'left');
  const left = remaining(state);
  const total = SCENE_DEFS[state.sceneIndex].diffs.length;
  const found = total - left;
  text(ctx, `${left} TO FIND`, 640, 30, 34, GOLD, 'bold');
  // Progress dots.
  for (let i = 0; i < total; i++) {
    circle(ctx, 640 + (i - (total - 1) / 2) * 26, 58, 7, i < found ? GOLD : '#5a4a7a');
  }
  text(ctx, `SCORE ${state.score}`, 800, 28, 18, '#ffffff', 'bold', 'left');
  text(ctx, state.streak >= 2 ? `STREAK x${state.streak}` : 'STREAK —', 800, 54, 14, state.streak >= 2 ? '#ff9f43' : '#8a7aa8', 'bold', 'left');
  const low = state.timeLeft <= 30 && state.phase === 'playing';
  text(ctx, formatTime(state.timeLeft), 920, 32, 24, low ? '#ff5d5d' : '#ffffff', 'bold', 'left');
  for (const key of ['hint', 'pause', 'sound']) {
    const b = BUTTONS[key];
    const label = key === 'hint' ? `Hint (${state.hintsLeft})` : key === 'pause' ? (state.phase === 'paused' ? 'Resume' : 'Pause') : soundLabel();
    const active = key === 'hint' && state.hintsLeft > 0;
    fillRoundRect(ctx, b.x, b.y, b.w, b.h, 10, key === 'hint' && !active ? '#3a3350' : '#4a3566');
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(b.x, b.y, b.w, b.h, 10);
    ctx.stroke();
    text(ctx, label, b.x + b.w / 2, b.y + b.h / 2 + 1, key === 'hint' ? 14 : 13, '#ffffff');
  }
}

function drawFooter(ctx, state) {
  text(ctx, 'Click a difference in either picture  ·  Arrows + Enter: keyboard play  ·  Z: magnifier  ·  H: hint  ·  P: pause', 640, FOOTER_Y + 16, 14, '#8a7aa8');
  for (let i = 0; i < SCENES.length; i++) {
    const r = sceneTabRect(i);
    const done = state.found[i].size === SCENE_DEFS[i].diffs.length;
    const current = i === state.sceneIndex;
    fillRoundRect(ctx, r.x, r.y, r.w, r.h, 10, current ? GOLD : done ? '#4a3566' : '#33284a');
    ctx.strokeStyle = current ? GOLD : '#5a4a7a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(r.x, r.y, r.w, r.h, 10);
    ctx.stroke();
    text(ctx, `${done ? '✓ ' : ''}${i + 1}. ${SCENES[i].name}`, r.x + r.w / 2, r.y + r.h / 2 + 1, 13, current ? INK : '#ffffff');
  }
  text(ctx, GAME_TAGLINE, 640, FOOTER_Y + 106, 13, '#5a4a7a');
}

function drawWrongFlashes(ctx, state) {
  for (const f of state.wrongFlashes) {
    ctx.save();
    ctx.strokeStyle = '#ff5d5d';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    const r = 14;
    ctx.beginPath();
    ctx.moveTo(f.x - r, f.y - r);
    ctx.lineTo(f.x + r, f.y + r);
    ctx.moveTo(f.x + r, f.y - r);
    ctx.lineTo(f.x - r, f.y + r);
    ctx.stroke();
    ctx.restore();
  }
}

function drawKeyboardCursor(ctx) {
  if (!keyboardCursor.active) return;
  ctx.save();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(keyboardCursor.x, keyboardCursor.y, 16, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(keyboardCursor.x - 22, keyboardCursor.y);
  ctx.lineTo(keyboardCursor.x - 8, keyboardCursor.y);
  ctx.moveTo(keyboardCursor.x + 8, keyboardCursor.y);
  ctx.lineTo(keyboardCursor.x + 22, keyboardCursor.y);
  ctx.moveTo(keyboardCursor.x, keyboardCursor.y - 22);
  ctx.lineTo(keyboardCursor.x, keyboardCursor.y - 8);
  ctx.moveTo(keyboardCursor.x, keyboardCursor.y + 8);
  ctx.lineTo(keyboardCursor.x, keyboardCursor.y + 22);
  ctx.stroke();
  ctx.restore();
}

function drawMagnifier(ctx, state, now) {
  if (!magnifier.on) return;
  const panel = magnifier.x >= RIGHT_PANEL_X ? 1 : magnifier.x >= LEFT_PANEL_X ? 0 : -1;
  if (panel === -1) return;
  const origin = panel === 0 ? LEFT_PANEL_X : RIGHT_PANEL_X;
  const sx = magnifier.x - origin;
  const sy = magnifier.y - PANEL_Y;
  if (sx < 0 || sx > PANEL_WIDTH || sy < 0 || sy > PANEL_HEIGHT) return;
  const R = 96;
  const ZOOM = 2;
  ctx.save();
  ctx.beginPath();
  ctx.arc(magnifier.x, magnifier.y, R, 0, Math.PI * 2);
  ctx.clip();
  ctx.translate(magnifier.x, magnifier.y);
  ctx.scale(ZOOM, ZOOM);
  ctx.translate(-sx, -sy);
  ctx.__panelRight = panel === 1;
  drawSceneArt(ctx, state, now);
  ctx.restore();
  ctx.__panelRight = false;
  ctx.save();
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(magnifier.x, magnifier.y, R, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(43,27,77,0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(magnifier.x, magnifier.y, R + 4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawMessage(ctx, state) {
  if (!state.message) return;
  const w = 560;
  chip(ctx, 640 - w / 2, 84, w, 34, 'rgba(43,27,77,0.92)', GOLD);
  text(ctx, state.message, 640, 102, 15, '#ffffff');
}

function overlay(ctx, title, lines, buttonKey, buttonLabel) {
  ctx.fillStyle = 'rgba(20,12,36,0.72)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  fillRoundRect(ctx, 340, 220, 600, 300, 18, '#2b1b4d');
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(340, 220, 600, 300, 18);
  ctx.stroke();
  text(ctx, title, 640, 278, 34, GOLD, 'bold');
  let y = 330;
  for (const line of lines) {
    text(ctx, line, 640, y, 18, '#ffffff');
    y += 30;
  }
  if (buttonKey) {
    const b = BUTTONS[buttonKey];
    fillRoundRect(ctx, b.x, b.y, b.w, b.h, 12, GOLD);
    text(ctx, buttonLabel, b.x + b.w / 2, b.y + b.h / 2 + 1, 18, INK);
  }
}

export function render(ctx, state, now) {
  ctx.fillStyle = '#1a1226';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawHud(ctx, state);
  drawPanel(ctx, state, 0, now);
  drawPanel(ctx, state, 1, now);
  drawWrongFlashes(ctx, state);
  drawKeyboardCursor(ctx);
  drawMagnifier(ctx, state, now);
  drawFooter(ctx, state);
  drawMessage(ctx, state);

  if (state.phase === 'paused') {
    overlay(ctx, 'PAUSED', ['Take a breath. The timer is stopped.', 'Press P or Resume to keep hunting.'], null, null);
  } else if (state.phase === 'sceneClear') {
    const scene = SCENES[state.sceneIndex];
    const next = SCENES[state.sceneIndex + 1];
    overlay(ctx, 'SCENE CLEAR!', [`${scene.name} — all 7 differences found.`, `Score ${state.score}  ·  Best streak x${state.bestStreak}`, `Next: ${next.name} — smaller, trickier differences.`], 'next', 'Next scene  →');
  } else if (state.phase === 'timeUp') {
    overlay(ctx, "TIME'S UP", [`${SCENES[state.sceneIndex].name} — ${remaining(state)} difference(s) still hiding.`, 'Retry the scene — the differences stay where they were.'], 'retry', 'Retry scene');
  } else if (state.phase === 'win') {
    overlay(ctx, 'ALL SCENES CLEAR!', ['You found every difference on the Senja Express.', `Final score ${state.score}  ·  Best streak x${state.bestStreak}  ·  ${state.totalFound} differences found`, 'Thank you for riding — play again to beat your score.'], 'again', 'Play again');
  }
}
