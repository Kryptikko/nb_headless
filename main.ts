import _ from "lodash"
import type { WorldState } from './types/WorldState';
import { SCREEN_IDS } from './types/WorldState';
import { SCREENS } from './screen/';
import { StringDecoder } from "string_decoder";
import { render_buffer_flush } from "./lib/render.ts";
import { default_character, PROFESSION } from "./types/Character.ts";
import state from "./data/world"

const _decoder = new StringDecoder('utf8');
const RENDER_RATE = 1000 / 24 // 24 fps

// const state: WorldState = {
//   delta: 0,
//   game_now: 0,
//   game_start: 0,
//   current: SCREEN_IDS.home,
//   party: [],
//   input: "",
//   encounter: "",
//   recruitment_pool: [],
//   persona: {},
//   relation: {},
//   bank: {
//     'basic_axe': {
//       item_template_id: 'basic_axe',
//       quantity: 1
//     },
//     'basic_armor': {
//       item_template_id: 'basic_armor',
//       quantity: 2
//     }
//   },
//   roster: {
//     'war1': {
//       ...default_character,
//       id: 'war1',
//       display_name: "Warrior",
//       profession: PROFESSION.FIGHTER,
//       level: 1,
//       xp: 0,
//       hp_max: 120,
//       hp_now: 120,
//       att: 3,
//       def: 1,
//       mgc: 0,
//       ini: 2,
//       ability_primary: ABILITY.CLEAVE,
//       // active_effect: []
//     },
//     'wiz1': {
//       ...default_character,
//       id: 'wiz1',
//       display_name: "Wizard",
//       profession: PROFESSION.MYSTIC,
//       level: 1,
//       xp: 0,
//       hp_max: 60,
//       hp_now: 60,
//       att: 0,
//       def: 1,
//       mgc: 3,
//       ini: 1,
//       ability_primary: ABILITY.BLIZZARD,
//       // active_effect: []
//     },
//     'sor1': {
//       ...default_character,
//       id: 'sor1',
//       display_name: "Sorcerer",
//       profession: PROFESSION.MYSTIC,
//       level: 1,
//       xp: 0,
//       hp_max: 60,
//       hp_now: 60,
//       att: 1,
//       def: 1,
//       mgc: 2,
//       ini: 1,
//       ability_primary: ABILITY.FIREBOLT,
//       // active_effect: []
//     }
//   }
// }

console.log("nb> q  →  exit\n");

const handle_input = (input: string, state: WorldState) => {
  //TODO: check for valid inputs
  // console.log(input)
  state.input = input
}

let next_frame = Date.now()
let last_frame = next_frame
const loop = () => {
  const now = Date.now()
  state.game_now = now - state.game_start;
  state.delta = now - last_frame
  next_frame = next_frame + RENDER_RATE
  SCREENS[state.current].process(state)
  render_buffer_flush()
  state.input = ""
  // TODO: test and skip a frame if the compuation takes more then the target FPS
  // making up for computation so the frame times are consistent
  last_frame = Date.now()
  setTimeout(loop, Math.max(0, next_frame - last_frame))
}
state.game_start = Date.now()
loop()

process.stdin.setRawMode(true)
process.stdin.on('data', (data) => {
  var key = _decoder.write(data)
  if (key == "q") {
    // console.clear()
    console.log("\nBye!");
    process.exit(0)
  }
  handle_input(key, state)
})

process.stdin.resume();
