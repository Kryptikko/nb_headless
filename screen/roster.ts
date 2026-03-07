import _ from "lodash"
import { SCREEN_IDS, type WorldState } from '../types/WorldState';
import health_bar from "./components/health_bar.ts";
import type { Character } from "../types/Character";
import container from "./components/container.ts";

type RosterState = {
  selection: Array<string>,
  focus: number,
  party: Array<Character | undefined>
}
const _state: RosterState = {
  selection: [],
  focus: 0,
  party: [],
}
// ☐
// ☑
// ☒

const RosterRow = (c?: Character, focus: boolean = false, selected: boolean = false): string => {
  if (!c) return _.padEnd(`${focus ? "-->" : "   "} ☒ Tank [Empty]`, 36, " ");
  return `${focus ? "-->" : "   "} ${selected ? '☑' : '☐'} ${c.display_name} [${c.id}]HP${c.hp_max} ATK${c.att} `
}

const MemberPreview = (ch?: Character): string => {
  if (!ch) return ''
  const template = `
  [Character Card Preview]
${ch.display_name} Lv${ch.level} | Tank Role
  [HP Bar ${health_bar(ch)} [ATK Icon + ${ch.att}][DEF Shield + ${ch.def}]
  "${ch.ability_primary.display_name}: ${ch.ability_primary.target_count} target(s) for ${ch.ability_primary.base_power} Power"
    `
  return template
}


const _handle_input = (state: WorldState) => {
  const len = state.roster.length;
  switch (state.input.toLocaleLowerCase()) {
    case "j":
      _state.focus = (_state.focus + 1) % len
      state.input = ""
      break;
    case "k":
      _state.focus = _state.focus == 0 ? len - 1 : (_state.focus - 1) % len
      state.input = ""
      break;
    case " ":
      const focused_character = state.roster[_state.focus]
      if (!focused_character) break;
      const idx_of = _.indexOf(_state.selection, focused_character.id);
      if (idx_of == -1) {
        _state.selection.push(focused_character.id)
      } else {
        _state.selection = _.remove(_state.selection, (idx) => idx == focused_character.id)
      }
      state.input = ""
      break;
    case "a":
      state.party = _state.selection
      state.input = ""
      state.current = SCREEN_IDS.assembly_area
      break;
    default:
      break;
  }
  return
}

const roster = (state: WorldState) => {
  _state.selection = state.party
  _handle_input(state)
  const header = `[Guild Roster][${state.roster.length} / 100]`
  const body = state
    .roster
    .map((ch, idx) => RosterRow(ch, idx == _state.focus, _state.selection.includes(ch.id)))
    .join('\n')

  const footer = MemberPreview(_.find(state.roster, ['id', _state.selection]));
  // render
  console.log(_state.focus, _state.selection, state.party);
  console.log(header);
  console.log(container(body));
  console.log(footer);
  console.log("press 'j' and 'k' to navigate ↑ and ↓");
  console.log("press 'a' to assemble a party");
  return state
}
export default roster
