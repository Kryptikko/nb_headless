import { default_character, PROFESSION } from '../types/Character';
import type { WorldState } from '../types/WorldState';
import { SCREEN_IDS } from '../types/WorldState';

const state: WorldState = {
  delta: 0,
  game_now: 0,
  game_start: 0,
  current: SCREEN_IDS.home,
  party: [],
  input: "",
  encounter: "",
  recruitment_pool: [],
  persona: {},
  relation: {},
  bank: {
    'basic_axe': {
      item_template_id: 'basic_axe',
      quantity: 1
    },
    'basic_armor': {
      item_template_id: 'basic_armor',
      quantity: 2
    }
  },
  roster: {
    'war1': {
      ...default_character,
      id: 'war1',
      display_name: "Warrior",
      profession: PROFESSION.FIGHTER,
      level: 1,
      xp: 0,
      hp_max: 120,
      hp_now: 120,
      att: 3,
      def: 1,
      mgc: 0,
      ini: 2,
      ability_primary: 'cleave',
      // active_effect: []
    },
    'wiz1': {
      ...default_character,
      id: 'wiz1',
      display_name: "Wizard",
      profession: PROFESSION.MYSTIC,
      level: 1,
      xp: 0,
      hp_max: 60,
      hp_now: 60,
      att: 0,
      def: 1,
      mgc: 3,
      ini: 1,
      ability_primary: 'fireball',
      // active_effect: []
    },

    'sor1': {
      ...default_character,
      id: 'sor1',
      display_name: "Sorcerer",
      profession: PROFESSION.MYSTIC,
      level: 1,
      xp: 0,
      hp_max: 60,
      hp_now: 60,
      att: 1,
      def: 1,
      mgc: 2,
      ini: 1,
      ability_primary: 'fireball',
      // active_effect: []
    }
  }
}
export default state;
