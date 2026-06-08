import { distance, normalize, lerp } from "./vector";
import type { Vec2 } from "./vector";

const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

// --- game state: plain mutable numbers ---
const player = { x: 100, y: 100, vx: 120, vy: 90, w: 32, h: 32 };
const enemy = { x: 300, y: 300, vx: 120, vy: 90, w: 32, h: 32 };
const projectile = { x: 120, y: 100, vx: 120, vy: 90, w: 32, h: 32 };

// --- a placeholder sprite; swap for: const img = new Image(); img.src = 'sprite.png'; ---
// here we just draw a colored rect so it runs with no assets.

// --- input ---
const keys = {};
addEventListener('keydown', e => { keys[e.code] = true; });
addEventListener('keyup', e => { keys[e.code] = false; });

// --- fixed timestep loop ---
const STEP = 1 / 60;        // simulate at 60 Hz
let acc = 0;
let last = performance.now() / 1000;

const PROJECTILE_SPEED = 10
function simulate(dt: number) {
  if (distance([projectile.x, projectile.y], [enemy.x, enemy.y]) >= 10) {
    projectile.x += (enemy.x - projectile.x) * dt * PROJECTILE_SPEED
    projectile.y += (enemy.y - projectile.y) * dt * PROJECTILE_SPEED
    // projectile.x = lerp(projectile.x, enemy.x, dt * 2)
    // projectile.y = lerp(projectile.y, enemy.y, dt * 2)
  }
  // movement input
  // if (keys['ArrowLeft']) player.x -= player.vx * dt;
  // if (keys['ArrowRight']) player.x += player.vx * dt;
  // if (keys['ArrowUp']) player.y -= player.vy * dt;
  // if (keys['ArrowDown']) player.y += player.vy * dt;
  //
  // clamp to bounds
  // if (player.x < 0) player.x = 0;
  // if (player.y < 0) player.y = 0;
  // if (player.x + player.w > canvas.width) player.x = canvas.width - player.w;
  // if (player.y + player.h > canvas.height) player.y = canvas.height - player.h;
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // draw sprite (replace with ctx.drawImage(img, player.x, player.y) once loaded)
  ctx.fillStyle = '#4caf50';
  ctx.fillRect(player.x, player.y, player.w, player.h);

  ctx.fillStyle = '#000000';
  ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);

  ctx.fillStyle = '#FF0000';
  ctx.fillRect(projectile.x, projectile.y, projectile.w, projectile.h);
}

let rafId = 0
function frame(nowMs: number) {
  const now = nowMs / 1000;
  let dt = now - last;
  last = now;
  if (dt > 0.25) dt = 0.25;          // clamp after tab-out, avoids spiral of death

  acc += dt;
  while (acc >= STEP) {              // run zero or more fixed steps
    simulate(STEP);
    acc -= STEP;
  }

  render();
  rafId = requestAnimationFrame(frame);
}
const sprites = new Image()
sprites.onload = () => {
  createImageBitmap()
  ctx?.drawImage(sprites, 10, 10, 32, 32);
}
sprites.src = "./tilemap_packed.png"
// rafId = requestAnimationFrame(frame);
// --- HMR teardown: stop the old loop before the new module starts its own ---
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    cancelAnimationFrame(rafId);
  });
}
