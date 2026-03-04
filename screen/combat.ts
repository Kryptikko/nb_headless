import _ from "lodash"
import { styleText } from "node:util";
import type { Character } from "../types/Character"
import type { WorldState } from "../types/WorldState"

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

const _get_combat_step_log = (step: number) => {
  return `Warrior: hits for ${step}`
}

const CombatScreen = (state: WorldState) => {
  console.log('last input > ', state.selection)
  // TODO:  handle input 
  // FF > skip to endscreen
  // Run > 
  const template = `
${styleText('gray', '[Start Dungeon Group]')}
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
export default CombatScreen;
