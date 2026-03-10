import _ from "lodash"
import { SCREEN_IDS, type WorldState } from '../types/WorldState';
import health_bar from "./components/health_bar.ts";
import type { Character } from "../types/Character";
import container from "./components/container.ts";
import get_ability from "../data/abilities.ts";
import { open_screen } from "../controller/screen.ts";

// const PARTY_SIZE_LIMIT = 4
type RosterState = {
  focus: number,
}
const _state: RosterState = {
  focus: 0,
}
// ☐
// ☑
// ☒

const RosterRow = (c: Character, focus: boolean = false, selected: boolean = false): string => {
  // if (!c) return _.padEnd(`${focus ? "-->" : "   "} '☐'Tank [Empty]`, 36, " ");
  return `${focus ? "-->" : "   "} ${selected ? '☑' : '☐'} ${c.display_name} [${c.id}]HP${c.hp_max} ATK${c.att} `
}

const MemberPreview = (ch?: Character): string => {
  if (!ch) return ''
  const ability = get_ability(ch.ability_primary)
  const template = container(`
${ch.display_name} Lv${ch.level} | Tank Role
[HP Bar ${health_bar(ch)} [ATK Icon + ${ch.att}][DEF Shield + ${ch.def}]
"${ability.display_name}: ${ability.target_count} target(s)"
`, '[Character Card Preview]')

  return template
}


const _handle_input = (state: WorldState) => {
  const len = Object.keys(state.roster).length;
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
      const focused_character = Object.values(state.roster)[_state.focus]
      if (!focused_character) break;
      const idx_of = _.indexOf(state.party, focused_character.id);
      if (idx_of == -1) {
        state.party.push(focused_character.id)
      } else {
        state.party = _.remove(state.party, (idx) => idx != focused_character.id)
      }
      state.input = ""
      break;
    case "a":
      open_screen(state, SCREEN_IDS.assembly_area)
      state.input = ""
      break;
    default:
      break;
  }
  return
}

const roster = (state: WorldState) => {
  _handle_input(state)
  const header = `[Guild Roster][${state.roster.length} / 100]`
  const body = Object.values(state.roster)
    .map((ch, idx) => RosterRow(ch, idx == _state.focus, state.party.includes(ch.id)))
    .join('\n')
  const focused_character_id = Object.values(state.roster)[_state.focus];
  const footer = MemberPreview(focused_character_id);
  // render
  console.log('DEBUG LINE - ', _state.focus, state.party);
  console.log(header);
  console.log(container(body));
  console.log(footer);
  console.log("press 'j' and 'k' to navigate ↑ and ↓");
  console.log("press 'a' to assemble a party");
  return state
}
export default roster
