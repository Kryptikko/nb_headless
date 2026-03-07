import { styleText } from "node:util";
import { SCREEN_IDS, type WorldState } from '../types/WorldState';

const Component = (state: WorldState) => {
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
      state.previous = SCREEN_IDS.home;
      state.current = SCREEN_IDS.dungeon_combat;
      break;
    case "a":
      state.previous = SCREEN_IDS.home;
      state.current = SCREEN_IDS.assembly_area;
      break;
    case "e":
      break;
    case "r":
      state.previous = SCREEN_IDS.home;
      state.current = SCREEN_IDS.guild_roster;
      break;
    default:
      break;
  }
  state.input = ""
  return state
}

export default Component;
