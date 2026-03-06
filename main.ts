import _ from "lodash"
import type { WorldState } from './types/WorldState';
import { SCREEN_IDS } from './types/WorldState';
import { StringDecoder } from "string_decoder";
import home_screen from './screen/home'
import combat_screen from './screen/combat'
import { Cleave, Blizzard } from './data/abilities.ts'
import assembly_area from "./screen/assembly_area.ts";

const _decoder = new StringDecoder('utf8');
const RENDER_RATE = 1000 / 24 // 24 fps

const state: WorldState = {
  delta: 0,
  current: SCREEN_IDS.home,
  selection: "",
  context: {},
  roster: [{
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
    ability_primary: Cleave
  }, {
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
    ability_primary: Blizzard
  }]
}

type ScreenFn = (state: WorldState) => void;
const _empty_fn = () => { }
const SCREENS: Record<SCREEN_IDS, ScreenFn> = {
  [SCREEN_IDS.home]: home_screen,
  [SCREEN_IDS.dungeon_combat]: combat_screen,
  [SCREEN_IDS.assembly_area]: assembly_area,
}
console.log("nb> q  →  exit\n");

const handle_input = (input: string, state: WorldState) => {
  //TODO: check for valid inputs
  // console.log(input)
  state.selection = input
  // render_frame(state)
}
const render_frame = (state: WorldState) => {
  process.stdout.write('\x1b[2J\x1b[H'); // ANSI clear + home
  SCREENS[state.current](state)
  loop()
}
// render _frame
// handle input
// update state
// loop
let next_frame = Date.now()
let last_frame = Date.now()
const loop = () => {
  state.delta = Date.now() - last_frame
  next_frame = next_frame + 100 // RENDER_RATE
  process.stdout.write('\x1b[2J\x1b[H'); // ANSI clear + home
  SCREENS[state.current](state)
  state.selection = ""
  // render 
  // adjust frame offset
  last_frame = Date.now()
  setTimeout(loop, Math.max(0, next_frame - Date.now()))
}
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

// Know when child is done
process.on('close', (code) => {
  console.log(`Child process exited with code ${code}`);
});

process.stdin.resume();
