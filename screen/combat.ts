import _ from "lodash"
import { styleText } from "node:util";
import type { Character } from "../types/Character"
import type { WorldState } from "../types/WorldState"
// import { MeleeAttack, Cleave, Blizzard } from "../data/abilities.ts";
import { combat_simulation } from "../combat";
// import damage_indicator from "./components/damage_indicator.ts";
// import cast_bar from "./components/cast_bar.ts";
import character_status from "./components/character_status.ts";
import { dungeon_floor_1 } from "../data/encounters.ts";

type CombatState = {
  last_turn_at: number
  turn: number
  log: Array<string>
  party: Array<Character>
  enemies: Array<Character>
}
let _local_state: CombatState = {
  last_turn_at: 1000,
  turn: 0,
  log: [],
  party: [],
  enemies: []
}

let _global_log: Array<string> = []
// combat screen needs to be a function that returns a render ?
const CombatScreen = (state: WorldState) => {
  // fetch encounter
  // state.encounter
  _local_state.party = _.map(state.party, id => _.get(state.roster, id));
  _local_state.enemies = [...dungeon_floor_1.enemies]
  _global_log = combat_simulation(_local_state.party, dungeon_floor_1.enemies)
  // TODO:  split 
  // handle input 
  // run simulation
  // render

  // a turn happens every half a second
  if ((state.game_now - _local_state.last_turn_at) > 500) {
    _local_state.last_turn_at = state.game_now
    _local_state.turn++
    const log_item = _.get(_global_log, _local_state.turn)
    if (log_item) {
      // _local_state.damage_ind_a_1.start = _local_state.turn
      // _local_state.damage_ind_a_1.value = 10
      _local_state.log.push(log_item)
    }
  }


  // RENDER
  const template = `
${styleText('gray', '[Start Dungeon Group]')}
=== Dungeon floor 1 ===
`
  console.log(template);
  console.log(`Step: ${_local_state.turn}`);
  console.log(`Delta: ${state.delta}`);
  console.log(`FPS: ${Math.ceil(1000 / state.delta)}`);
  _local_state.party.map(ch => console.log(character_status(ch)))
  _local_state.enemies.map(ch => console.log(character_status(ch)))
  // console.log(cast_bar(4000, 1000, state.game_now))
  // const ind_state = _local_state.damage_ind_a_1
  // console.log(damage_indicator(42, 5000, state.game_now))

  // Warrior  👨‍🦰  [█████▌    ] 90/150   Goblin1 🧝‍♂️ [███▌      ] 35/100  💥-28!
  // Mage     🧙‍♂️  [███▌      ] 45/80    Goblin2 🧝‍♂️ [█▌        ] 12/100  ✨-22!
  // Rogue    🗡️  [███████▌  ] 110/120  Goblin3 🧝‍♂️ [          ] 0/100  ☠️
  // Tank     🛡️  [█████████ ] 140/140
  console.log(`[Turn Log]`);
  _.takeRight(_local_state.log, 3).map(log => console.log(log))
  return state
}
export default CombatScreen;
