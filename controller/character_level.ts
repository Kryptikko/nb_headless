import _ from "lodash";
import type { Character, ProfessionStatsGrowth } from "../types/Character"
import professions from "../data/professions"

const LVL_1_BASE = 1000;
const EXPONENT = 1.6;

export const xp_to_level = (level: number): number => Math.floor(LVL_1_BASE * (level ^ EXPONENT))
export const enemy_xp_per_member = (enemy_level: number, player_level: number): number => enemy_level * 300 // apply debuff base on player level?
export const enemy_xp_per_group = (enemy_level: number, group_levels: Array<number>): number => enemy_xp_per_member(enemy_level, _.mean(group_levels))

export const xp_add = (character: Character, xp: number): Character => {
  character.xp += xp
  while (character.xp >= 0) {
    character.level++
    character.xp -= xp_to_level(character.level)
    character = stats_growth(character, professions[character.profession])
  }
  return character;
}

export const stats_growth = (character: Character, growth: ProfessionStatsGrowth): Character => {
  character.base_hp_max += growth.hp_max
  character.base_att += growth.att
  character.base_def += growth.def
  character.base_mgc += growth.mgc
  character.base_ini += growth.ini
  return character
}
