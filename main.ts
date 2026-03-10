import _ from "lodash"
import type { WorldState } from './types/WorldState';
import { SCREEN_IDS } from './types/WorldState';
import { SCREENS } from './screen/';
import { StringDecoder } from "string_decoder";
import { ABILITY } from "./types/Ability.ts";

const _decoder = new StringDecoder('utf8');
const RENDER_RATE = 1000 / 24 // 24 fps


const state: WorldState = {
  delta: 0,
  game_now: 0,
  game_start: 0,
  current: SCREEN_IDS.home,
  party: [],
  input: "",
  encounter: "",
  roster: {
    'war1': {
      id: 'war1',
      display_name: "Warrior",
      level: 1,
      xp: 0,
      hp_max: 120,
      hp_now: 120,
      att: 3,
      def: 1,
      mgc: 0,
      ini: 2,
      ability_primary: ABILITY.CLEAVE,
    },
    'wiz1': {
      id: 'wiz1',
      display_name: "Wizard",
      level: 1,
      xp: 0,
      hp_max: 60,
      hp_now: 60,
      att: 3,
      def: 1,
      mgc: 0,
      ini: 1,
      ability_primary: ABILITY.BLIZZARD,
    },
    'sor1': {
      id: 'sor1',
      display_name: "Sorcerer",
      level: 1,
      xp: 0,
      hp_max: 60,
      hp_now: 60,
      att: 3,
      def: 1,
      mgc: 0,
      ini: 1,
      ability_primary: ABILITY.FIREBOLT,
    }
  }
}

console.log("nb> q  →  exit\n");

const handle_input = (input: string, state: WorldState) => {
  //TODO: check for valid inputs
  // console.log(input)
  state.input = input
}

const render = console.log
let buffer: Array<string> = [];
// 🐒 patch 
// TODO: omg fix dis 
console.log = (line: string) => {
  buffer.push(line);
}

// render _frame
// handle input
// update state
// loop
let next_frame = Date.now()
let last_frame = Date.now()
const loop = () => {
  const now = Date.now()
  state.game_now = now - state.game_start;
  state.delta = now - last_frame
  next_frame = next_frame + 100 // RENDER_RATE
  SCREENS[state.current].process(state)
  state.input = ""
  process.stdout.write('\x1b[2J\x1b[H'); // ANSI clear + home
  render(buffer.join('\n'))
  buffer = []
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
  // console.clear()
  if (key == "q") {
    console.log("\nBye!");
    process.exit(0)
  }
  handle_input(key, state)
})

process.stdin.resume();
