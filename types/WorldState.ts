import type { Character } from "./Character";

export enum SCREEN_IDS {
  home,
  dungeon_combat,
  assembly_area,
}
type ScreenFn = (state: WorldState) => void;

export type WorldState = {
  // render state
  game_start: number,
  game_now: number,
  delta: number,
  current: SCREEN_IDS, // TODO: make it an enum
  selection: string,
  context: Object // dont know yet
  // game state
  // guild_bank: Object
  roster: Array<Character>
}
