import _ from "lodash";
import { styleText } from "node:util";
import { SCREEN_IDS, type WorldState, type Screen, _empty_screen_fn } from '../types/WorldState';
import { open_screen } from "../controller/screen";
import { render } from "../lib/render";
import type { Character } from "../types/Character";
import container from "./components/container";


type LocalState = {
  chat_log: Array<string>
  dialogue: Record<string, ChatNode>
  character?: Character
  cursor_delta: number,
  cursor_state: boolean,
  character_name: string
}

type ChatOption = {
  id: string
  lines: Array<string>
  isEnd: boolean
  enabled: string
  action: string
}
type ChatNode = {
  id: string
  lines: Array<string>
  options: Record<string, ChatOption>
}

const _local_state: LocalState = {
  chat_log: ['[Clippy]: Hello World', '[You]: Looking to recruit', '[Clippy]: Yolo skibbidy'],
  dialogue: {
    "_start": {
      id: "_start",
      lines: ["[You]: Hey there!", "[You]: Wanna build a snowman?", "[Him]: Dafuq are you talking bout?"],
      options: {
        "gear": {
          id: "gear",
          lines: [
            "[You]: Whats your gear like?",
            "[Him]: I has all the gearz",
          ],
          isEnd: false,
          enabled: 'shown_gear',
          action: 'show_gear'
        },
        "profession": {
          id: "profession",
          lines: [
            "[You]: What are your professions?",
            "[Him]: You can profession these nuts.",
          ],
          isEnd: false,
          enabled: 'shown_profession',
          action: 'show_profession'
        }
      }
    }
  },
  cursor_delta: 0,
  cursor_state: false,
  character_name: "Clippy"
}

const cursor = (delta: number) => {
  _local_state.cursor_delta -= delta
  if (_local_state.cursor_delta < 0) {
    _local_state.cursor_delta = 500
    _local_state.cursor_state = !_local_state.cursor_state
  }
  return _local_state.cursor_state ? "█" : " "
}
const init = (state: WorldState) => {
  _local_state.character = state.recruitment_pool[0]
}


const process = (state: WorldState) => {
  const header = styleText('gray', '[Interview Chat]')
  const footer = '[j, k] Select  [Enter] Recruit  [B] Back to Home '

  render(header);
  render(container(_local_state.chat_log.join('\n'), `[${_local_state.character_name}]`, 60))
  render(container(cursor(state.delta), '[Type a message]', 60))
  render(footer)

  switch (state.input.toLocaleLowerCase()) {
    case "b":
      open_screen(state, SCREEN_IDS.home)
      break;
    case "r":
      // add to roster
      open_screen(state, SCREEN_IDS.home)
      break;

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
