import _ from "lodash";
import { styleText } from "node:util";
import { SCREEN_IDS, type WorldState, type Screen, _empty_screen_fn } from '../types/WorldState';
import { open_screen } from "../controller/screen";
import { render, render_debug } from "../lib/render";
import { default_character, type Character } from "../types/Character";
import { ABILITY } from "../types/Ability";

const _names: Array<string> = [
  'Ciririla',
  'Amameine',
  'Laminaera',
  'Nonateia',
  'Saphanoire',
  'Mirabelle',
  'Nautiria',
  'Oratune',
  'Aenne',
  'Callava']

const _generate_member = (_state: WorldState): Character => {
  // we need the turn from the world state and the current recruitment pool
  return {
    ...default_character,
    id: "",
    display_name: _.get(_names, Math.floor(Math.random() * _names.length)),
    // characte
    level: 1,
    xp: 0,
    hp_max: 100,
    hp_now: 100,
    att: 1,
    def: 1,
    mgc: 1,
    ini: 1,
    ability_primary: ABILITY.MELEE,
  }
}

type LocalState = {
  selection: number
  pool: Array<Character>

}

const _local_state: LocalState = {
  selection: -1,
  pool: []
}

const init = (state: WorldState) => {
  _local_state.pool = _.map(Array(5) as Array<Character>, () => _generate_member(state))
}

const _recruit_row = (ch: Character, is_selected: boolean = false): string => {
  return [
    is_selected ? "->" : "  ",
    _.padEnd(ch.display_name, 20),
    _.padEnd(ch.display_name, 20)
  ].join(' ')
}

const _selection_details = (ch: Character): string => {
  if (!ch) return `Currently selected:
    None
`

  return `Currently selected: ${ch.level}  ${ch.display_name}
   "I've got quick fingers and quicker feet. What’s the job?"
  `
}

const process = (state: WorldState) => {
  const header = styleText('gray', '[Recruitment]')
  const footer = '[j, k] Select  [Enter] Recruit  [I] Interview  [B] Back to Home '

  render(header);
  for (let index = 0; index < _local_state.pool.length; index++) {
    const recruit = _.get(_local_state.pool, index);
    render(_recruit_row(recruit, index == _local_state.selection))
  }
  render(_selection_details(_.get(_local_state.pool, _local_state.selection)))
  render(footer)

  switch (state.input.toLocaleLowerCase()) {
    case "b":
      open_screen(state, SCREEN_IDS.home)
      break;
    case "i":
      open_screen(state, SCREEN_IDS.interview)
      break;
    case "j":
      _local_state.selection = (_local_state.selection + 1) % _local_state.pool.length
      break;
    case "k":
      _local_state.selection = _local_state.selection == 0 ? _local_state.pool.length - 1 : (_local_state.selection - 1) % _local_state.pool.length
      break;
    // case " ":
    //   const focused_character = _local_state.pool[_local_state.selection]
    //   if (!focused_character) break;
    //   break;
    default:
      break;
  }
  state.input = ""
}

const screen: Screen = {
  init,
  process,
  clear: _empty_screen_fn
}

export default screen 
