// The three scenes of Senja Express, drawn procedurally on canvas. Each
// scene is one function draw(ctx, right): `right` false draws the left
// ("Original") panel, true draws the right ("Twin") panel with all seven
// differences applied. The `diffs` list gives each difference its spot in
// scene coordinates, its hit radius and a plain-language label.
import { circle, ellipse, fillRoundRect, skyGradient, star, text } from './draw.js';

function duskSky(ctx) {
  ctx.fillStyle = skyGradient(ctx, 0, 300, [
    [0, '#2b1b4d'],
    [0.55, '#c65a7a'],
    [1, '#ffb26b'],
  ]);
  ctx.fillRect(0, 0, 616, 300);
  for (const [x, y, r] of [[40, 40, 2], [200, 26, 2], [330, 52, 1.5], [470, 30, 2], [560, 70, 1.5], [150, 80, 1.5], [420, 90, 2]]) {
    star(ctx, x, y, r, '#ffe9c9');
  }
}

function skyline(ctx) {
  ctx.fillStyle = '#3a2a5e';
  const blocks = [[0, 235, 70, 65], [70, 255, 55, 45], [125, 220, 60, 80], [185, 250, 70, 50], [255, 228, 55, 72], [310, 252, 80, 48], [390, 222, 60, 78], [450, 250, 70, 50], [520, 232, 96, 68]];
  for (const [x, y, w, h] of blocks) ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#ffd93d';
  for (const [x, y] of [[30, 250], [95, 268], [150, 238], [215, 264], [280, 244], [340, 266], [415, 240], [475, 264], [545, 248]]) {
    ctx.fillRect(x, y, 8, 10);
  }
}

function bunting(ctx, flagColor) {
  ctx.strokeStyle = '#3a2a5e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(20, 44);
  ctx.quadraticCurveTo(308, 92, 596, 44);
  ctx.stroke();
  const colors = ['#ff5d5d', '#ffd93d', '#4ecb71', '#4aa8ff', '#ff9f43', flagColor, '#4ecb71'];
  for (let i = 0; i < 7; i++) {
    const x = 60 + i * 76;
    const y = 44 + Math.sin((x / 616) * Math.PI) * 26;
    ctx.fillStyle = colors[i];
    ctx.beginPath();
    ctx.moveTo(x - 14, y);
    ctx.lineTo(x + 14, y);
    ctx.lineTo(x, y + 26);
    ctx.closePath();
    ctx.fill();
  }
}

function drawPlatform(ctx, right) {
  duskSky(ctx);
  skyline(ctx);
  // Sun: golden on the left, pink on the right (difference 1).
  circle(ctx, 110, 110, 46, right ? '#ff6b9d' : '#ffd93d');
  circle(ctx, 110, 110, 34, right ? '#ff8fb5' : '#ffe98a');
  // Clock tower: hands at 6:00 on the left, 7:30 on the right (difference 6).
  ctx.fillStyle = '#4a3566';
  ctx.fillRect(492, 40, 84, 96);
  fillRoundRect(ctx, 486, 34, 96, 16, 6, '#6b4f8a');
  circle(ctx, 534, 92, 32, '#fff6e0');
  ctx.strokeStyle = '#4a3566';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(534, 92, 32, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#2b1b4d';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(534, 92);
  ctx.lineTo(534, 70);
  ctx.moveTo(534, 92);
  ctx.lineTo(right ? 514 : 534, right ? 108 : 114);
  ctx.stroke();
  circle(ctx, 534, 92, 4, '#2b1b4d');
  bunting(ctx, right ? '#4ecb71' : '#ff5d5d');
  // Train across the middle.
  fillRoundRect(ctx, 30, 300, 556, 118, 14, '#2e5fa3');
  fillRoundRect(ctx, 30, 300, 556, 22, 14, '#3f74c4');
  ctx.fillStyle = '#1d3f73';
  ctx.fillRect(30, 396, 556, 22);
  for (let i = 0; i < 6; i++) {
    const x = 58 + i * 88;
    const lit = !(right && i === 3);
    fillRoundRect(ctx, x, 330, 56, 40, 8, lit ? '#ffe9a8' : '#22304d');
    if (lit) {
      ctx.strokeStyle = '#3f74c4';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + 28, 330);
      ctx.lineTo(x + 28, 370);
      ctx.stroke();
    }
  }
  circle(ctx, 90, 428, 16, '#1d3f73');
  circle(ctx, 526, 428, 16, '#1d3f73');
  // Track and platform floor.
  ctx.fillStyle = '#241a33';
  ctx.fillRect(0, 440, 616, 14);
  ctx.fillStyle = '#b08968';
  ctx.fillRect(0, 454, 616, 106);
  ctx.strokeStyle = '#8a6a4d';
  ctx.lineWidth = 2;
  for (let y = 478; y <= 550; y += 24) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(616, y);
    ctx.stroke();
  }
  // Bench with (left) or without (right) a black cat (difference 2).
  ctx.fillStyle = '#7a4a2b';
  ctx.fillRect(96, 486, 130, 12);
  ctx.fillRect(96, 462, 130, 12);
  ctx.fillRect(104, 498, 10, 40);
  ctx.fillRect(208, 498, 10, 40);
  if (!right) {
    ctx.fillStyle = '#26232e';
    ellipse(ctx, 196, 452, 22, 14, '#26232e');
    circle(ctx, 214, 436, 11, '#26232e');
    ctx.beginPath();
    ctx.moveTo(206, 428);
    ctx.lineTo(208, 414);
    ctx.lineTo(213, 428);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(216, 428);
    ctx.lineTo(218, 414);
    ctx.lineTo(223, 428);
    ctx.closePath();
    ctx.fill();
  }
  // Lamp post: glow on (left) or off (right) (difference 3).
  ctx.fillStyle = '#2b2b3a';
  ctx.fillRect(516, 330, 8, 124);
  circle(ctx, 520, 322, 14, '#2b2b3a');
  if (!right) {
    ctx.fillStyle = 'rgba(255, 217, 61, 0.35)';
    ctx.beginPath();
    ctx.arc(520, 322, 44, 0, Math.PI * 2);
    ctx.fill();
    circle(ctx, 520, 322, 12, '#ffe98a');
  } else {
    circle(ctx, 520, 322, 12, '#8a8a9a');
  }
  // Suitcase: red on the left, teal on the right (difference 4).
  fillRoundRect(ctx, 404, 478, 54, 44, 8, right ? '#1f8a8a' : '#d94f3d');
  ctx.fillStyle = '#2b2b3a';
  ctx.fillRect(420, 470, 22, 8);
  ctx.strokeStyle = '#2b2b3a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(404, 500);
  ctx.lineTo(458, 500);
  ctx.stroke();
  // Pigeon on the platform (difference 5).
  if (!right) {
    ctx.fillStyle = '#8d93a8';
    ellipse(ctx, 292, 508, 16, 11, '#8d93a8');
    circle(ctx, 304, 496, 8, '#8d93a8');
    ctx.fillStyle = '#ff9f43';
    ctx.beginPath();
    ctx.moveTo(311, 494);
    ctx.lineTo(318, 497);
    ctx.lineTo(311, 500);
    ctx.closePath();
    ctx.fill();
  }
  // Station sign.
  fillRoundRect(ctx, 238, 250, 140, 34, 8, '#fff6e0');
  text(ctx, 'SENJA', 308, 268, 20, '#2b1b4d');
}

const PLATFORM_DIFFS = [
  { x: 110, y: 110, r: 40, label: 'the sun changed colour' },
  { x: 196, y: 444, r: 24, label: 'the cat on the bench' },
  { x: 520, y: 322, r: 26, label: 'the lamp glow' },
  { x: 431, y: 500, r: 26, label: 'the suitcase colour' },
  { x: 292, y: 502, r: 20, label: 'the pigeon' },
  { x: 534, y: 92, r: 30, label: 'the clock hands' },
  { x: 380, y: 62, r: 18, label: 'the bunting flag colour' },
];

function carriageWindow(ctx, x, right, kind) {
  fillRoundRect(ctx, x, 96, 220, 190, 12, '#f5e6c8');
  ctx.fillStyle = skyGradient(ctx, 108, 274, [[0, '#7a5fa8'], [0.6, '#ff9d7a'], [1, '#ffc46b']]);
  ctx.fillRect(x + 10, 106, 200, 170);
  ctx.fillStyle = '#4a3566';
  ctx.beginPath();
  ctx.moveTo(x + 10, 276);
  ctx.lineTo(x + 70, 210);
  ctx.lineTo(x + 130, 240);
  ctx.lineTo(x + 210, 200);
  ctx.lineTo(x + 210, 276);
  ctx.closePath();
  ctx.fill();
  if (kind === 'tree') {
    ctx.fillStyle = right ? '#4a3566' : '#3f7a3a';
    if (right) {
      ctx.fillRect(x + 118, 196, 44, 80);
      ctx.beginPath();
      ctx.moveTo(x + 110, 200);
      ctx.lineTo(x + 140, 162);
      ctx.lineTo(x + 170, 200);
      ctx.closePath();
      ctx.fill();
    } else {
      circle(ctx, x + 140, 200, 26, '#3f7a3a');
      ctx.fillStyle = '#6b4a2b';
      ctx.fillRect(x + 134, 220, 12, 40);
    }
  }
}

function drawCarriage(ctx, right) {
  ctx.fillStyle = '#f5e6c8';
  ctx.fillRect(0, 0, 616, 560);
  ctx.fillStyle = '#6b4f3a';
  ctx.fillRect(0, 0, 616, 64);
  ctx.fillStyle = '#2a7f7f';
  ctx.fillRect(0, 300, 616, 26);
  // Luggage rack with a bag that changes colour (difference 4).
  ctx.fillStyle = '#8a6a4d';
  ctx.fillRect(0, 64, 616, 10);
  fillRoundRect(ctx, 452, 30, 74, 36, 8, right ? '#e87e2b' : '#4a9e4a');
  ctx.fillStyle = '#2b2b3a';
  ctx.fillRect(480, 24, 18, 8);
  fillRoundRect(ctx, 96, 34, 60, 32, 8, '#c65a7a');
  // Ceiling lamp: on (left) or off (right) (difference 6).
  if (!right) {
    ctx.fillStyle = 'rgba(255, 217, 61, 0.25)';
    ctx.beginPath();
    ctx.arc(308, 40, 40, 0, Math.PI * 2);
    ctx.fill();
  }
  circle(ctx, 308, 40, 16, right ? '#9a9aa8' : '#ffe98a');
  // Hanging straps: four on the left, three on the right (difference 3).
  ctx.fillStyle = '#3a3a4a';
  ctx.fillRect(120, 64, 376, 6);
  const strapXs = [150, 230, 310, 390, 470];
  const straps = right ? [150, 230, 390, 470] : strapXs;
  for (const x of straps) {
    ctx.fillRect(x - 3, 70, 6, 44);
    ellipse(ctx, x, 128, 12, 20, '#3a3a4a');
  }
  carriageWindow(ctx, 40, right, 'tree');
  carriageWindow(ctx, 356, right, 'hills');
  // Poster between the windows: mountains (left) or sea (right) (difference 5).
  fillRoundRect(ctx, 278, 130, 60, 80, 6, '#fff6e0');
  if (right) {
    ctx.fillStyle = '#4aa8ff';
    ctx.fillRect(284, 136, 48, 68);
    ctx.fillStyle = '#fff6e0';
    ctx.beginPath();
    ctx.arc(296, 152, 10, 0, Math.PI * 2);
    ctx.arc(320, 146, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffd93d';
    ctx.beginPath();
    ctx.arc(322, 190, 8, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = '#8fb8d8';
    ctx.fillRect(284, 136, 48, 68);
    ctx.fillStyle = '#4a3566';
    ctx.beginPath();
    ctx.moveTo(284, 204);
    ctx.lineTo(300, 162);
    ctx.lineTo(316, 204);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(306, 204);
    ctx.lineTo(322, 170);
    ctx.lineTo(332, 204);
    ctx.closePath();
    ctx.fill();
  }
  // Floor.
  ctx.fillStyle = '#7a5c42';
  ctx.fillRect(0, 480, 616, 80);
  ctx.strokeStyle = '#5f4632';
  ctx.lineWidth = 2;
  for (let x = 0; x <= 616; x += 77) {
    ctx.beginPath();
    ctx.moveTo(x, 480);
    ctx.lineTo(x, 560);
    ctx.stroke();
  }
  // Seats.
  for (const sx of [52, 344]) {
    fillRoundRect(ctx, sx, 340, 220, 140, 16, '#2e5fa3');
    fillRoundRect(ctx, sx, 340, 220, 26, 16, '#3f74c4');
    ctx.fillStyle = '#1d3f73';
    ctx.fillRect(sx, 452, 220, 12);
    ctx.fillStyle = '#2e5fa3';
    ctx.fillRect(sx + 8, 464, 12, 16);
    ctx.fillRect(sx + 200, 464, 12, 16);
  }
  // Ticket on the left seat (difference 7).
  if (!right) {
    ctx.save();
    ctx.translate(150, 424);
    ctx.rotate(-0.15);
    fillRoundRect(ctx, -28, -10, 56, 20, 4, '#fff6e0');
    ctx.strokeStyle = '#d94f3d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(20, 0);
    ctx.stroke();
    ctx.restore();
  }
  // Sleeping cat on the right seat (difference 2).
  if (!right) {
    ctx.fillStyle = '#e8a04c';
    ellipse(ctx, 452, 400, 34, 18, '#e8a04c');
    circle(ctx, 482, 392, 13, '#e8a04c');
    ctx.beginPath();
    ctx.moveTo(474, 382);
    ctx.lineTo(476, 370);
    ctx.lineTo(481, 382);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(484, 380);
    ctx.lineTo(488, 370);
    ctx.lineTo(491, 382);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#b87a2e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(452, 398, 20, 0.4, 2.2);
    ctx.stroke();
  }
}

const CARRIAGE_DIFFS = [
  { x: 180, y: 200, r: 30, label: 'the tree outside the window' },
  { x: 456, y: 396, r: 26, label: 'the sleeping cat' },
  { x: 310, y: 116, r: 20, label: 'a hanging strap' },
  { x: 489, y: 48, r: 22, label: 'the bag on the rack' },
  { x: 308, y: 170, r: 30, label: 'the poster picture' },
  { x: 308, y: 40, r: 20, label: 'the ceiling lamp' },
  { x: 150, y: 424, r: 18, label: 'the ticket on the seat' },
];

function drawHall(ctx, right) {
  // High hall: warm walls, arched windows, chequered floor.
  ctx.fillStyle = '#e8d5b0';
  ctx.fillRect(0, 0, 616, 560);
  ctx.fillStyle = '#c9a86f';
  ctx.fillRect(0, 0, 616, 40);
  for (const x of [40, 556]) {
    ctx.fillStyle = '#7a5c42';
    ctx.fillRect(x, 40, 20, 340);
  }
  for (const wx of [100, 420]) {
    fillRoundRect(ctx, wx, 60, 96, 150, 48, '#2b1b4d');
    ctx.fillStyle = skyGradient(ctx, 66, 204, [[0, '#2b1b4d'], [1, '#ff9d7a']]);
    ctx.fillRect(wx + 6, 66, 84, 138);
    circle(ctx, wx + 66, 96, 16, '#ffd93d');
    ctx.fillStyle = '#3a2a5e';
    ctx.fillRect(wx + 6, 190, 84, 14);
  }
  // Departure board: status dot green (left) or red (right) (difference 1).
  fillRoundRect(ctx, 196, 90, 224, 108, 10, '#26232e');
  text(ctx, 'DEPARTURES', 308, 110, 14, '#ffe9a8');
  ctx.fillStyle = '#e8e8e8';
  ctx.font = 'bold 13px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('SENJA  ·  18:40  ·  P2', 210, 136);
  ctx.fillText('FAJAR  ·  19:05  ·  P1', 210, 160);
  ctx.fillText('MALAM  ·  20:15  ·  P3', 210, 184);
  circle(ctx, 404, 136, 7, right ? '#ff5d5d' : '#4ecb71');
  // Chandelier, hung high above the board: five bulbs (left) or four (right) (difference 2).
  ctx.fillStyle = '#3a3a4a';
  ctx.fillRect(306, 40, 4, 12);
  circle(ctx, 308, 60, 20, '#8a6a2f');
  const bulbs = right ? [276, 292, 308, 324] : [276, 292, 308, 324, 340];
  for (const x of bulbs) {
    circle(ctx, x, 82, 7, '#ffe98a');
  }
  // Wall clock: second hand present (left) or gone (right) (difference 3).
  circle(ctx, 92, 252, 30, '#fff6e0');
  ctx.strokeStyle = '#4a3566';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(92, 252, 30, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#2b1b4d';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(92, 252);
  ctx.lineTo(92, 232);
  ctx.moveTo(92, 252);
  ctx.lineTo(106, 260);
  ctx.stroke();
  if (!right) {
    ctx.strokeStyle = '#d94f3d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(92, 252);
    ctx.lineTo(78, 240);
    ctx.stroke();
  }
  // Chequered floor.
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 8; col++) {
      ctx.fillStyle = (row + col) % 2 === 0 ? '#b08968' : '#8a6a4d';
      ctx.fillRect(col * 77, 420 + row * 35, 77, 35);
    }
  }
  // Ticket counter.
  fillRoundRect(ctx, 60, 380, 496, 44, 8, '#7a4a2b');
  fillRoundRect(ctx, 60, 380, 496, 10, 8, '#9a6a3f');
  ctx.fillStyle = '#ffd93d';
  ctx.beginPath();
  ctx.arc(150, 372, 12, Math.PI, 0);
  ctx.fill();
  ctx.fillRect(138, 372, 24, 6);
  // A small bird on the counter (difference 7).
  if (!right) {
    ctx.fillStyle = '#4aa8ff';
    ellipse(ctx, 320, 368, 13, 9, '#4aa8ff');
    circle(ctx, 330, 360, 7, '#4aa8ff');
    ctx.fillStyle = '#ff9f43';
    ctx.beginPath();
    ctx.moveTo(336, 358);
    ctx.lineTo(342, 361);
    ctx.lineTo(336, 363);
    ctx.closePath();
    ctx.fill();
  }
  // Potted plant on the counter: red flower (left) or yellow (right) (difference 4).
  ctx.fillStyle = '#c65a7a';
  ctx.beginPath();
  ctx.moveTo(424, 380);
  ctx.lineTo(440, 336);
  ctx.lineTo(456, 380);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#3f7a3a';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(440, 340);
  ctx.lineTo(440, 312);
  ctx.stroke();
  circle(ctx, 440, 304, 12, right ? '#ffd93d' : '#d94f3d');
  circle(ctx, 424, 316, 8, '#3f7a3a');
  circle(ctx, 456, 316, 8, '#3f7a3a');
  // Bench with cushion stripe blue (left) or green (right) (difference 5).
  ctx.fillStyle = '#7a4a2b';
  ctx.fillRect(90, 452, 150, 12);
  ctx.fillRect(90, 430, 150, 12);
  ctx.fillRect(98, 464, 10, 36);
  ctx.fillRect(222, 464, 10, 36);
  ctx.fillStyle = right ? '#4a9e4a' : '#4aa8ff';
  ctx.fillRect(96, 440, 138, 12);
  // Kiosk awning: five stripes (left) or four (right) (difference 6).
  ctx.fillStyle = '#2b2b3a';
  ctx.fillRect(452, 250, 120, 130);
  ctx.fillStyle = '#fff6e0';
  ctx.fillRect(452, 250, 120, 34);
  const stripes = right ? 4 : 5;
  for (let i = 0; i < stripes; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#d94f3d' : '#fff6e0';
    ctx.fillRect(452 + i * (120 / stripes), 250, 120 / stripes, 34);
  }
  text(ctx, 'KIOSK', 512, 306, 14, '#ffe9a8');
  text(ctx, 'TIKET', 512, 330, 12, '#e8e8e8');
  // Bunting across the hall.
  ctx.strokeStyle = '#3a2a5e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(60, 220);
  ctx.quadraticCurveTo(308, 250, 556, 220);
  ctx.stroke();
  for (let i = 0; i < 9; i++) {
    const x = 90 + i * 50;
    ctx.fillStyle = ['#ff5d5d', '#ffd93d', '#4ecb71', '#4aa8ff'][i % 4];
    ctx.beginPath();
    ctx.moveTo(x - 9, 226);
    ctx.lineTo(x + 9, 226);
    ctx.lineTo(x, 244);
    ctx.closePath();
    ctx.fill();
  }
}

const HALL_DIFFS = [
  { x: 404, y: 136, r: 15, label: 'the board status dot' },
  { x: 340, y: 82, r: 15, label: 'a chandelier bulb' },
  { x: 92, y: 252, r: 17, label: 'the clock second hand' },
  { x: 440, y: 304, r: 17, label: 'the flower colour' },
  { x: 165, y: 446, r: 17, label: 'the bench cushion stripe' },
  { x: 512, y: 267, r: 17, label: 'an awning stripe' },
  { x: 324, y: 364, r: 15, label: 'the bird on the counter' },
];

export const SCENE_DEFS = [
  { id: 'platform', draw: drawPlatform, diffs: PLATFORM_DIFFS },
  { id: 'carriage', draw: drawCarriage, diffs: CARRIAGE_DIFFS },
  { id: 'hall', draw: drawHall, diffs: HALL_DIFFS },
];
