import { styleText } from "node:util";
import { SCREEN_IDS, type WorldState, type Screen, _empty_screen_fn } from '../types/WorldState';
import { open_screen } from "../controller/screen";
import { render } from "../lib/render";

const process = (state: WorldState) => {
  const template = `
${styleText('gray', '[Home State]')}
[${styleText('underline', 'O')}verworld]
[${styleText('underline', 'S')}tart Dungeon Group]
[R${styleText('underline', 'e')}cruit]
[${styleText('underline', 'A')}ssembly Area]
[${styleText('underline', 'B')}ank]
[${styleText('underline', 'R')}oster] 
`
  render(template);
  switch (state.input.toLocaleLowerCase()) {
    case "s":
      open_screen(state, SCREEN_IDS.dungeon_combat)
      break;
    case "a":
      open_screen(state, SCREEN_IDS.assembly_area)
      break;
    case "e":
      open_screen(state, SCREEN_IDS.recruitment)
      break;
    case "r":
      open_screen(state, SCREEN_IDS.guild_roster)
      break;
    case "b":
      open_screen(state, SCREEN_IDS.bank)
      break;
    case "o":
      open_screen(state, SCREEN_IDS.overworld)
      break;
    default:
      // error message ?
      break;
  }
  state.input = ""
}

const screen: Screen = {
  init: _empty_screen_fn,
  process,
  clear: _empty_screen_fn
}

export default screen 
