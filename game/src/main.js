// Bootstrap for Senja Express: wires the canvas, state, input, render loop
// and the timer together. One job: start the game and keep it running.
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './config.js';
import { createState, pruneTransient, tickTimer } from './state.js';
import { attachInput, magnifier, mouse } from './input.js';
import { render } from './render.js';
import { applyShot } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const state = createState();
window.__senja = state; // Test handle: lets automated playtests read the state.
attachInput(canvas, state, { magnifier, mouse });
const inShot = applyShot(state, { magnifier, mouse });

const status = document.getElementById('status');
let lastStatus = '';
function announce() {
  const total = 7;
  const left = total - state.found[state.sceneIndex].size;
  const text = `Scene ${state.sceneIndex + 1} of 3: ${left} differences left to find. Score ${state.score}.`;
  if (text !== lastStatus) {
    lastStatus = text;
    status.textContent = text;
  }
}

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  if (!state.frozen) tickTimer(state, dt, now);
  pruneTransient(state, now);
  announce();
  render(ctx, state, now);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
