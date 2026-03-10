import type { WorldState, SCREEN_IDS } from '../types/WorldState';
import { SCREENS } from './../screen/';
export const open_screen = (state: WorldState, screen: SCREEN_IDS) => {
  SCREENS[state.current].clear(state)
  state.current = screen
  SCREENS[state.current].init(state)
}
