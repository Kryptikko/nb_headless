import type { Character } from "./Character";

export const _empty_screen_fn = (_state: WorldState): void => { }
export enum SCREEN_IDS {
  home,
  dungeon_combat,
  assembly_area,
  guild_roster
}
export type Screen = {
  init: (state: WorldState) => void;
  process: (state: WorldState) => void;
  clear: (state: WorldState) => void;
}

export type WorldState = {
  // render state
  game_start: number,
  game_now: number,
  delta: number,
  current: SCREEN_IDS, // TODO: make it an enum
  input: string,
  // game state
  // guild_bank: Object
  encounter: string,
  party: Array<string>
  roster: { [key: string]: Character }
}
