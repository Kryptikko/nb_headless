import type { CombatEncounter } from "../types/Encounter";
import { Goblin, Troll } from "./enemies";

export const dungeon_floor_1: CombatEncounter = {
  id: 'dung_fl_1',
  display_name: "Dungeon Floor 1",
  enemies: [{
    ...Goblin,
    display_name: "Ugly Golbin",
    id: 'dung_fl_1_goblin_1'
  }, {
    ...Goblin,
    display_name: "Wretched Golbin",
    id: 'dung_fl_1_goblin_2'
  }],
  loot: []
}

export const dungeon_floor_2: CombatEncounter = {
  id: 'dung_fl_2',
  display_name: "Dungeon Floor 2",
  enemies: [{
    ...Goblin,
    display_name: "Smelly Golbin",
    id: 'dung_fl_2_goblin_1'
  }, {
    ...Goblin,
    display_name: "Goshko",
    id: 'dung_fl_2_goblin_2'
  }, {
    ...Troll,
    display_name: "Fat Troll",
    id: 'dung_fl_2_troll_1'
  }],
  loot: []
}
