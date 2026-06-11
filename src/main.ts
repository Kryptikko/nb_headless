import { collide, get_center } from "./math";
import type { Vec4, Point, Rect } from "./math";
import theme from './theme'

const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

// --- game state: plain mutable numbers ---
type Member = {
  id: string
  display_name: string
  power: number
}
interface World {
  hot: string
  active: string
  current_interaction: INTERACTION
  energy: number
  day: number
  roster: Member[]
  error: string
  error_duration: number
}
interface MouseInput {
  up: boolean,
  down: boolean
}
// --- input ---
const mouse: Point & MouseInput = {
  x: 0,
  y: 0,
  up: false,
  down: false
}

enum INTERACTION {
  NONE,
  END_TURN,
  RECRUIT,
  CRAFT
}
const MENU_LABELS = ["Recruit", "Craft"] //, "Assemble", "Journal", "Quest"]
const MENU_INTERACTOINS = [INTERACTION.RECRUIT, INTERACTION.CRAFT]

const ENERGY_PER_TURN = 1000;

const w: World = {
  hot: "",
  active: "",
  current_interaction: INTERACTION.NONE,
  energy: 0,
  day: 0,
  roster: [],
  error: "",
  error_duration: 0
}
const keys = {};
addEventListener('keydown', e => { keys[e.code] = true; });
addEventListener('keyup', e => { keys[e.code] = false; });


function getMousePos(canvas: HTMLCanvasElement, e: MouseEvent): Point {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;    // attribute size ÷ displayed size
  const scaleY = canvas.height / rect.height;
  // normalzie to the canvas dimentions
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
  };
}
addEventListener("mousedown", () => {
  mouse.up = false
  mouse.down = true
})

addEventListener("mouseup", () => {
  mouse.down = false
  mouse.up = true
})
addEventListener('mousemove', (ev: MouseEvent) => {
  const new_pos = getMousePos(canvas, ev)
  mouse.x = new_pos.x
  mouse.y = new_pos.y
});

// --- fixed timestep loop ---
const STEP = 1 / 60;        // simulate at 60 Hz
let acc = 0;
let last = performance.now() / 1000;


const FIRST_NAMES = [
  'Aldric', 'Brynn', 'Caeron', 'Dara', 'Elric',
  'Faye', 'Gorn', 'Hessa', 'Idris', 'Jael',
  'Kade', 'Lira', 'Mord', 'Nira', 'Orin',
  'Pip', 'Quen', 'Reva', 'Sorn', 'Thea',
]
const LAST_NAMES = [
  'Ashveil', 'Blackthorn', 'Coldmere', 'Duskfall', 'Emberholt',
  'Frostmark', 'Gravenmoor', 'Highcliff', 'Ironwood', 'Jadestone',
  'Kestrel', 'Lightfoot', 'Moonshard', 'Nighthollow', 'Oakhaven',
  'Pinecroft', 'Quicksilver', 'Ravenfield', 'Stonegate', 'Tidewatch',
]
const make_member = (): Member => {
  return {
    id: Math.random() + "",
    display_name: FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)] || 'Random Broke',
    power: 1
  }
}
function simulate(_dt: number) {
  switch (w.current_interaction) {
    case INTERACTION.CRAFT:
      console.log('CRAFT')
      break;
    case INTERACTION.RECRUIT:
      console.log('RECRUIT')
      // cost = 300
      if (w.energy > 300) {
        w.roster.push(make_member())
        w.energy -= 300
      } else {
        w.error = "Not enough energy"
        w.error_duration = 2000
      }
      break;
    case INTERACTION.END_TURN:
      w.energy = ENERGY_PER_TURN
      w.day++
      break;
    default:
      break;
  }
  w.current_interaction = INTERACTION.NONE
}


const ButtonClicked = (ctx: CanvasRenderingContext2D, parent_id: number, item_id: number, rect: Rect, label: string): boolean => {
  let fill_color = '#00FFFF'
  let result = false
  const id = `${parent_id}:${item_id}`

  if (w.active == id) {
    if (mouse.up) {
      // clicked
      result = (w.hot == id) // check if user clickedd outside bounds
      w.active = ""
    }
  } else if (w.hot == id) {
    if (mouse.down) {
      // active
      w.active = id
      fill_color = '#FFFFFF'
    }
  }
  if (w.hot == id) w.hot = ""
  if (collide(rect, mouse)) {
    // hovered
    fill_color = '#FF0000'
    w.hot = id
  }

  ctx.fillStyle = fill_color;
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  const center = get_center(rect)
  // ctx.fillStyle = '#000000';
  ctx.textAlign = "center"
  ctx.fillStyle = '#000000';
  ctx.textBaseline = "middle"
  ctx.fillText(label, center.x, center.y)
  return result
}

const push_text = (ctx: CanvasRenderingContext2D, text: string, p: Point) => {
  ctx.fillStyle = theme.text;
  ctx.fillText(text, p.x, p.y);
}
const push_rect = (ctx: CanvasRenderingContext2D, r: Rect) => {
  ctx.fillStyle = "#333333"
  ctx.fillRect(r.x, r.y, r.w, r.h)
}

const render_top_bar = (ctx: CanvasRenderingContext2D) => {
  // topbar
  const toprect: Rect = { x: (canvas.width / 2) - 60, y: 24, w: 120, h: 40 }
  push_text(ctx, `${w.energy}/${ENERGY_PER_TURN}`, { x: toprect.x, y: 8 });
  push_text(ctx, `d ${(w.day % 7) + 1} w ${Math.ceil(w.day / 7)}`, { x: canvas.width - 40, y: 8 });
  if (ButtonClicked(ctx, 0, 0, toprect, "End Turn")) {
    w.current_interaction = INTERACTION.END_TURN
  }
}
const render_roster = (ctx: CanvasRenderingContext2D) => {
  const r: Rect = { x: (canvas.width / 2) - 60, y: canvas.height - 120, w: 60, h: 60 }
  for (let i = 0; i < w.roster.length; i++) {
    const member = w.roster[i] as Member;
    r.x += 60 + 10
    // ctx?.drawImage(parsed[i], 0, i * (U * 4), 64, 64)
    push_rect(ctx, r)
    // @ts-ignore
    ctx.drawImage(sprites[SPRITE.BARBARIAN], r.x, r.y, 32, 32)
  }
  // canvas.width 
}
const render_error = (ctx: CanvasRenderingContext2D, dt: number) => {
  if (w.error_duration <= 0)
    return
  w.error_duration -= dt * 1000
  const mesure = ctx.measureText(w.error)
  const rect = {
    x: (canvas.width / 2) - mesure.width,
    y: (canvas.height / 2)
  };
  push_text(ctx, w.error, rect);
}

const render_member = (ctx: CanvasRenderingContext2D) => {
  const r = { w: 360, h: 460, x: canvas.width - 360 - 8, y: 120 }
  push_rect(ctx, r)
  r.x += 16
  r.y += 16
  push_text(ctx, "Member Name", r);
}

function render(_dt: number) {
  if (!ctx) return
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // background
  ctx.fillStyle = '#000000';
  ctx.strokeRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = theme.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  render_top_bar(ctx)
  render_roster(ctx)

  for (let index = 0; index < MENU_LABELS.length; index++) {
    const rect: Rect = { x: 8, y: 220 + (50 * index), w: 120, h: 40 }
    const label: string = MENU_LABELS[index] || ""
    if (ButtonClicked(ctx, 1, index, rect, label)) {
      console.log('click', MENU_INTERACTOINS[index])
      w.current_interaction = MENU_INTERACTOINS[index] || INTERACTION.NONE
    }
  }

  ctx.fillStyle = '#FF0000';
  ctx.textAlign = "start"
  ctx.fillText(`Mouse X: ${mouse.x}`, 8, 8)
  ctx.fillText(`Mouse Y: ${mouse.y}`, 8, 16)
  // prompts
  render_member(ctx)
  render_error(ctx, _dt)
  // handle input for 1 frame only
  // mouse.up = false
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

  render(dt);
  rafId = requestAnimationFrame(frame);
}
ctx?.fillText("LOADING IMAGES", canvas.width / 2, canvas.height / 2)

enum SPRITE {
  KNIGHT = (11 * 0) + 8,
  NOBLE = (11 * 2) + 8,
  BARBARIAN = (11 * 3) + 7,
  WIZARD = (11 * 0) + 7,
  WARLOCK = (11 * 3) + 9,
  ROGUE = (11 * 4) + 9,
  SLIME = (11 * 0) + 9,
  GHOST = (11 * 1) + 10,
}

const sprites: ImageBitmap[] = []
const sprite_source = new Image()
// Tile size                 •  16px × 16px
// Space between tiles       •  1px × 1px
// ---
// Total tiles (horizontal)  •  12 tiles
// Total tiles (vertical)    •  11 tiles
const U = 16
sprite_source.onload = () => {
  const bitmaps = []
  for (let i = 0; i < 12; i++) {
    for (let j = 0; j < 11; j++) {
      bitmaps.push(createImageBitmap(sprite_source, i * U, j * U, U, U))
    }
  }
  Promise.all(bitmaps).then(parsed => {
    for (let i = 0; i < parsed.length; i++) {
      // @ts-ignore
      ctx?.drawImage(parsed[i], 0, i * (U * 4), 64, 64)
      // @ts-ignore
      sprites.push(parsed[i])
    }
  })
  rafId = requestAnimationFrame(frame);
}
sprite_source.src = "./tilemap_packed.png"

// --- HMR teardown: stop the old loop before the new module starts its own ---
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    cancelAnimationFrame(rafId);
  });
}
