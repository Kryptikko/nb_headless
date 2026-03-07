import _ from "lodash"
import { styleText } from "node:util";

// 4 states, appear, highhted, cooldown, invisible
// style appear == cooldown
export default (value: number, start_at: number, now: number) => {
  // let indicator = ""
  let indicator = "" + start_at + "/" + now
  if (start_at > now || now > (now + start_at)) {
    // noop
  } else if (now - start_at < 200) {
    indicator = styleText('red', `✨-${value}!`);
  } else if (now - start_at < 400) {
    indicator = styleText('bgRed', `✨-${value}!`);
  } else if (now - start_at < 1000) {
    indicator = `✨-${value}!`
  }
  return _.padEnd(indicator, 5, ' ')
}
