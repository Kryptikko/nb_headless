import _ from "lodash"
import { StringDecoder } from "string_decoder";
import { styleText } from "node:util";
// const { styleText } = require('node:util');

const _decoder = new StringDecoder('utf8');
// const { styleText } = require('node:util');

import c, { COLORS as CO } from "./lib/color";


type WorldState = {
  delta: number,
  current: string, // TODO: make it an enum
  selection: string,
  context: Object // dont know yet
}
const state: WorldState = {
  delta: 0,
  current: "home",
  selection: "",
  context: {}
}
const _home_state = (state: WorldState) => {
  const template = `
${styleText('grey', '[Home State]')}
[${styleText('underline', 'S')}tart Dungeon Group]
[R${styleText('underline', 'e')}cruit]
[${styleText('underline', 'R')}oster] 
`
  console.log(template);
  switch (state.selection) {
    case "s":
      state.current = "dungeon_combat"
      state.selection = ""
      break;
    case "e":
      break;
    case "R":
      break;
    default:
      break;
  }
  return state
}

const RENDER_RATE = 1000 / 24 // 24 fps

let _c_state = {
  duration: 0,
  log: [] as Array<string>,
  party: [{
    display_name: "Warrior",
    hp_max: 120,
    hp_now: 80,
    att: 1,
    def: 1
  }] as Array<Character>,
  enemy: [{
    display_name: "Goblin 1",
    hp_max: 120,
    hp_now: 80,
    att: 1,
    def: 1
  }] as Array<Character>

}
const _get_combat_step_log = (step: number) => {
  return `Warrior: hits for ${step}`
}
type Character = {
  display_name: string, // max 10
  hp_max: number,
  hp_now: number,
  att: number,
  def: number,
}
const CharacterStatus = (ch: Character) => {
  let hp_percent = Math.ceil((ch.hp_now / ch.hp_max) * 10)
  let hp_bar = ""
  console.log(hp_percent)
  for (let index = 0; index < 10; index++) {
    hp_percent--
    hp_bar += hp_percent > 0 ? "█" : " "
  }
  hp_bar = '[' + hp_bar + ']';

  return _.padEnd(ch.display_name, 10, " ") + `👨‍🦰 ${hp_bar}` + _.padEnd(` ${ch.hp_now}/${ch.hp_max}`, 8, " ")
}
// run sim and then just play it out 
const _combat_state = (state: WorldState) => {
  console.log('last input > ', state.selection)
  // TODO:  handle input 
  // FF > skip to endscreen
  // Run > 
  const template = `
${styleText('grey', '[Start Dungeon Group]')}
=== Dungeon floor 1 ===
`
  _c_state.duration++
  _c_state.log.push(_get_combat_step_log(_c_state.duration))

  console.log(template);
  console.log(`Step: ${_c_state.duration}`);
  console.log(`Delta: ${state.delta}`);
  console.log(`FPS: ${Math.ceil(1000 / state.delta)}`);
  _c_state.party.map(ch => console.log(CharacterStatus(ch)))
  _c_state.enemy.map(ch => console.log(CharacterStatus(ch)))

  // Warrior  👨‍🦰  [█████▌    ] 90/150   Goblin1 🧝‍♂️ [███▌      ] 35/100  💥-28!
  // Mage     🧙‍♂️  [███▌      ] 45/80    Goblin2 🧝‍♂️ [█▌        ] 12/100  ✨-22!
  // Rogue    🗡️  [███████▌  ] 110/120  Goblin3 🧝‍♂️ [          ] 0/100  ☠️
  // Tank     🛡️  [█████████ ] 140/140
  console.log(`[Turn Log]`);
  _.takeRight(_c_state.log, 3).map(log => console.log(log))
  return state
}

const SCREENS = {
  "home": _home_state,
  "dungeon_assemble": "",
  "dungeon_progression": "",
  "dungeon_combat": _combat_state,
  "dungeon_cleared": "",
}
console.log("nb> q  →  exit\n");

const handle_input = (input: string, state: WorldState) => {
  //TODO: check for valid inputs
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

