import _ from "lodash"
import { SCREEN_IDS, type WorldState } from '../types/WorldState';
import health_bar from "./components/health_bar.ts";
import type { Character } from "../types/Character";
import container from "./components/container.ts";


const CharacterPreview = (ch?: Character): string => {
  if (!ch) return ''
  const template = `
[Character Card Preview]
${ch.display_name} Lv${ch.level} | Tank Role
[HP Bar ${health_bar(ch)} [ATK Icon +${ch.att}] [DEF Shield +${ch.def}]
"${ch.ability_primary.display_name}: ${ch.ability_primary.target_count} target(s) for ${ch.ability_primary.base_power} Power"
  `
  return template
}

const PartySlot = (c?: Character, focus: boolean = false, selected: boolean = false): string => {

  if (!c) return _.padEnd(`${focus ? "-->" : "   "}${selected ? "•" : " "} Tank [Empty]`, 43, " ");
  return `${focus ? "-->" : "   "}${selected ? "•" : " "} ${_.padEnd(c.display_name, 20, " ")}[Drag Icon] HP${c.hp_max} ATK${c.att}`
}
type AssemblyAreaState = {
  selection: number,
  focus: number,
  party: Array<Character | undefined>
}
const _state: AssemblyAreaState = {
  selection: -1,
  focus: 0,
  party: [undefined, undefined, undefined, undefined],
}

const _handle_input = (input: string, state: WorldState) => {
  switch (input.toLocaleLowerCase()) {
    case "j":
      _state.focus = (_state.focus + 1) % 4
      state.input = ""
      break;
    case "k":
      _state.focus = _state.focus == 0 ? 3 : (_state.focus - 1) % 4
      state.input = ""
      break;
    case " ":
      _state.selection = _state.focus
      state.input = ""
      break;
    case "r":
      state.current = SCREEN_IDS.guild_roster;
      state.input = ""
      break;
    default:
      break;
  }
  return
}

const assembly_area = (state: WorldState) => {
  _handle_input(state.input, state)
  const header = '[Party Slots]                  [Morale Torch: 🔥🔥🔥🔥🔥 100/100]'
  const body = state.party.map((ch, idx) => PartySlot(state.roster[ch], idx == _state.focus, idx == _state.selection)).join('\n')
  const footer = CharacterPreview(_.find(_state.party, ['id', _state.selection]));
  // render
  console.log(header);
  console.log(container(body));
  console.log(footer);
  console.log("press 'j' and 'k' to navigate ↑ and ↓");
  console.log("press 'r' to assing membrs from roster");
  return state
}

export default assembly_area;
