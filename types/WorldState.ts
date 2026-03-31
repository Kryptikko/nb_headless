import type { Character } from "./Character";
import type { BankItem } from "./Equipment";
import type { Persona, Relation } from "./Persona";

export const _empty_screen_fn = (_state: WorldState): void => { }
export enum SCREEN_IDS {
  home,
  bank,
  overworld,
  combat_reward,
  dungeon_combat,
  recruitment,
  interview,
  assembly_area,
  guild_roster,
}

export type Screen = {
  init: (state: WorldState) => void
  process: (state: WorldState) => void
  clear: (state: WorldState) => void
}

export type WorldState = {
  // render state
  game_start: number
  game_now: number
  delta: number
  current: SCREEN_IDS // TODO: make it an enum
  input: string
  // game state
  // guild_bank: Object
  encounter: string
  // parties?
  party: Array<string>
  roster: Record<string, Character>
  relation: Record<string, Relation>
  persona: Record<string, Persona>
  recruitment_pool: Array<Character>
  bank: Record<string, BankItem>
}
