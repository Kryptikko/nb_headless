import type { Screen } from "../types/WorldState";
import { SCREEN_IDS, _empty_screen_fn } from "../types/WorldState";
import home_screen from './home'
import combat_screen from './combat'
import assembly_area from "./assembly_area.ts";
import roster from "./roster.ts";

export const SCREENS: Record<SCREEN_IDS, Screen> = {
  [SCREEN_IDS.home]: home_screen,
  [SCREEN_IDS.dungeon_combat]: combat_screen,
  [SCREEN_IDS.assembly_area]: {
    init: _empty_screen_fn,
    process: assembly_area,
    clear: _empty_screen_fn
  },
  [SCREEN_IDS.guild_roster]: {
    init: _empty_screen_fn,
    process: roster,
    clear: _empty_screen_fn
  }
}
