import { styleText } from "node:util";
import { SCREEN_IDS, type WorldState, type Screen, _empty_screen_fn } from '../types/WorldState';
import { open_screen } from "../controller/screen";

const process = (state: WorldState) => {
  const template = `
${styleText('gray', '[Home State]')}
[${styleText('underline', 'S')}tart Dungeon Group]
[R${styleText('underline', 'e')}cruit]
[${styleText('underline', 'A')}ssembly Area]
[${styleText('underline', 'R')}oster] 
`
  console.log(template);
  switch (state.input.toLocaleLowerCase()) {
    case "s":
      open_screen(state, SCREEN_IDS.dungeon_combat)
      break;
    case "a":
      open_screen(state, SCREEN_IDS.assembly_area)
      break;
    case "e":
      break;
    case "r":
      open_screen(state, SCREEN_IDS.guild_roster)
      break;
    default:
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
