import _ from "lodash"
import { styleText } from "node:util";
import type { Character } from "../types/Character"
import type { WorldState } from "../types/WorldState"
import { MeleeAttack, Cleave, Blizzard } from "../data/abilities.ts";
import { combat_simulation } from "../combat";
import health_bar from "./components/health_bar.ts";

let _c_state = {
  turn: 0,
  log: [] as Array<string>,
  party: [{
    display_name: "Warrior",
    hp_max: 120,
    hp_now: 120,
    att: 3,
    def: 1,
    mgc: 0,
    ini: 2,
    ability_primary: Cleave
  }, {
    display_name: "Wizard",
    hp_max: 50,
    hp_now: 50,
    att: 3,
    mgc: 2,
    def: 1,
    ini: 2,
    ability_primary: Blizzard
  }] as Array<Character>,
  enemy: [{
    id: 'enemy_1',
    display_name: "Goblin1",
    hp_max: 60,
    hp_now: 60,
    level: 1,
    xp: 0,
    att: 1,
    def: 1,
    mgc: 1,
    ini: 1,
    ability_primary: MeleeAttack
  }, {
    id: 'enemy_2',
    display_name: "Goblin2",
    hp_max: 60,
    hp_now: 60,
    level: 1,
    xp: 0,
    att: 1,
    def: 1,
    mgc: 1,
    ini: 1,
    ability_primary: MeleeAttack
  }, {
    id: 'enemy_3',
    display_name: "Goblin3",
    hp_max: 60,
    hp_now: 60,
    level: 1,
    xp: 0,
    att: 1,
    def: 1,
    mgc: 1,
    ini: 1,
    ability_primary: MeleeAttack
  }] as Array<Character>
}

const CharacterStatus = (ch: Character) => {
  return _.padEnd(ch.display_name, 10, " ") + `👨‍🦰 ${health_bar(ch)}` + _.padEnd(` ${ch.hp_now}/${ch.hp_max}`, 8, " ")
}

let _global_log: Array<string> = []
// combat screen needs to be a function that returns a render ?
const CombatScreen = (state: WorldState) => {
  _global_log = combat_simulation(_c_state.party, _c_state.enemy)
  console.log('last input > ', state.selection)
  // TODO:  split 
  // handle input 
  // run simulation
  // render
  const template = `
${styleText('gray', '[Start Dungeon Group]')}
=== Dungeon floor 1 ===
`
  _c_state.turn++
  const log_item = _.get(_global_log, _c_state.turn)
  if (log_item) {
    _c_state.log.push(log_item)
  }

  console.log(template);
  console.log(`Step: ${_c_state.turn}`);
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
export default CombatScreen;
