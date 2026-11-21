// Tiny WebAudio synth for Senja Express: no audio files, every sound is a
// short oscillator envelope. One job: the game's bleeps and chimes.
let audioCtx = null;
let muted = false;

export function isMuted() {
  return muted;
}

export function toggleMute() {
  muted = !muted;
  return muted;
}

function ensureCtx() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function tone(freq, dur, type, gain, when = 0) {
  if (muted) return;
  const ctx = ensureCtx();
  if (!ctx) return;
  const t0 = ctx.currentTime + when;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  amp.gain.setValueAtTime(0.0001, t0);
  amp.gain.exponentialRampToValueAtTime(gain, t0 + 0.015);
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(amp);
  amp.connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

export function playFind() {
  tone(660, 0.12, 'sine', 0.22);
  tone(990, 0.18, 'sine', 0.22, 0.08);
}

export function playWrong() {
  tone(160, 0.18, 'square', 0.1);
  tone(110, 0.22, 'square', 0.1, 0.08);
}

export function playHint() {
  tone(520, 0.1, 'triangle', 0.16);
  tone(780, 0.14, 'triangle', 0.16, 0.09);
}

export function playClick() {
  tone(440, 0.06, 'sine', 0.1);
}

export function playSceneClear() {
  tone(523, 0.14, 'sine', 0.2);
  tone(659, 0.14, 'sine', 0.2, 0.12);
  tone(784, 0.22, 'sine', 0.22, 0.24);
}

export function playWin() {
  tone(523, 0.16, 'sine', 0.22);
  tone(659, 0.16, 'sine', 0.22, 0.14);
  tone(784, 0.16, 'sine', 0.22, 0.28);
  tone(1046, 0.3, 'sine', 0.24, 0.42);
}

export function playTick() {
  tone(880, 0.05, 'sine', 0.08);
}
