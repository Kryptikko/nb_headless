import _ from "lodash"
import { styleText } from "node:util";

// 4 states, appear, highhted, cooldown, invisible
// style appear == cooldown
export default (value: number, frame: number) => {
  let indicator = ""
  if (frame < 0) {

  } else if (frame < 2) {
    indicator = styleText('red', `✨-${value}!`);
  } else if (frame < 4) {
    indicator = styleText('bgRed', `✨-${value}!`);
  } else if (frame < 6) {
    indicator = `✨-${value}!`
  }
  return _.padEnd(indicator, 5, ' ')
}
