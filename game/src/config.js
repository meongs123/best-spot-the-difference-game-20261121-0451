// Shared constants for Senja Express: canvas size, panel geometry, timing,
// scoring and the scene list. One job: the numbers every other module reads.
export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 800;

// The two picture panels, side by side, in canvas coordinates.
export const PANEL_WIDTH = 616;
export const PANEL_HEIGHT = 560;
export const PANEL_Y = 88;
export const LEFT_PANEL_X = 16;
export const RIGHT_PANEL_X = 648;
export const HUD_HEIGHT = 76;
export const FOOTER_Y = 664;

// Scenes are drawn in their own 616 x 560 space, one unit per panel pixel.
export const SCENE_WIDTH = 616;
export const SCENE_HEIGHT = 560;

export const SCENE_TIME_SECONDS = 180;
export const HINTS_PER_SCENE = 3;
export const WRONG_CLICK_TIME_PENALTY = 5;
export const POINTS_PER_FIND = 100;
export const POINTS_PER_STREAK_STEP = 25;
export const POINTS_PER_HINT = 50;
export const POINTS_PER_WRONG = 10;

export const MARKER_RADIUS = 26;
export const CLICK_SLOP = 16;

export const SCENES = [
  { id: 'platform', name: 'Peron Senja', subtitle: 'Platform at dusk' },
  { id: 'carriage', name: 'Gerbong Senja', subtitle: 'Inside the dusk train' },
  { id: 'hall', name: 'Aula Stasiun', subtitle: 'The ticket hall at night' },
];

export const GAME_TITLE = 'SENJA EXPRESS';
export const GAME_TAGLINE = 'Spot the Difference — a dusk train in three scenes';
