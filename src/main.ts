import { distance, collide, get_center } from "./math";
import type { Vec2, Point, Rect } from "./math";

const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

// --- game state: plain mutable numbers ---
const player = { x: 100, y: 100, vx: 120, vy: 90, w: 32, h: 32 };
const enemy = { x: 300, y: 300, vx: 120, vy: 90, w: 32, h: 32 };
const projectile = { x: 120, y: 100, vx: 120, vy: 90, w: 32, h: 32 };

// --- input ---
const mouse: Point = {
  x: 0,
  y: 0,
}
const keys = {};
addEventListener('keydown', e => { keys[e.code] = true; });
addEventListener('keyup', e => { keys[e.code] = false; });
function getMousePos(canvas: HTMLCanvasElement, e: MouseEvent): Point {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;    // attribute size ÷ displayed size
  const scaleY = canvas.height / rect.height;
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
  };
}
addEventListener('mousemove', (ev: MouseEvent) => {
  const new_pos = getMousePos(canvas, ev)
  mouse.x = new_pos.x
  mouse.y = new_pos.y
});

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

let hover = false
function render() {
  if (!ctx) return
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // draw sprite (replace with ctx.drawImage(img, player.x, player.y) once loaded)
  ctx.fillStyle = '#4caf50';
  ctx.fillRect(player.x, player.y, player.w, player.h);

  ctx.fillStyle = '#000000';
  ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);

  ctx.fillStyle = '#FF0000';
  ctx.fillRect(projectile.x, projectile.y, projectile.w, projectile.h);

  // button
  ctx.fillStyle = hover ? '#FF0000' : '#00FFFF';
  const rect: Rect = { x: 8, y: 220, w: 120, h: 40 }
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  const center = get_center(rect)
  // ctx.fillStyle = '#000000';
  ctx.textAlign = "center"
  ctx.fillStyle = '#000000';
  ctx.textBaseline = "middle"
  ctx.fillText(hover ? "hoverging" : "not", center.x, center.y)
  hover = collide(rect, mouse)
  ctx.fillStyle = '#FF0000';
  ctx.textAlign = "start"
  ctx.fillText(`Mouse X: ${mouse.x}`, 8, 8)
  ctx.fillText(`Mouse Y: ${mouse.y}`, 8, 16)
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
ctx?.fillText("LOADING IMAGES", canvas.width / 2, canvas.height / 2)

const sprites = new Image()
// Tile size                 •  16px × 16px
// Space between tiles       •  1px × 1px
// ---
// Total tiles (horizontal)  •  12 tiles
// Total tiles (vertical)    •  11 tiles
const U = 16
sprites.onload = () => {
  const bitmaps = []
  for (let i = 0; i < 12; i++) {
    for (let j = 0; j < 11; j++) {
      bitmaps.push(createImageBitmap(sprites, i * U, j * U, U, U))
    }
  }
  Promise.all(bitmaps).then(parsed => {
    for (let i = 0; i < parsed.length; i++) {
      // @ts-ignore
      ctx?.drawImage(parsed[i], 0, i * (U * 4), 64, 64)
    }
  })
  rafId = requestAnimationFrame(frame);
}
sprites.src = "./tilemap_packed.png"

// --- HMR teardown: stop the old loop before the new module starts its own ---
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    cancelAnimationFrame(rafId);
  });
}
