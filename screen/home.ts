import { styleText } from "node:util";
import { SCREEN_IDS, type WorldState } from '../types/WorldState';

const Component = (state: WorldState) => {
  const template = `
${styleText('gray', '[Home State]')}
[${styleText('underline', 'S')}tart Dungeon Group]
[R${styleText('underline', 'e')}cruit]
[${styleText('underline', 'R')}oster] 
`
  console.log(template);
  switch (state.selection) {
    case "s":
      state.current = SCREEN_IDS.dungeon_combat;
      state.selection = ""
      break;
    case "e":
      break;
    case "R":
      break;
    default:
      break;
  }
  return state
}

export default Component;
