import _ from "lodash"
import { test } from 'node:test'
import assert from 'node:assert/strict'
import type { Character, Equipment, CharacterAura } from "../types/Character";
import { default_character, default_modifier, EQUIPMENT_SLOT } from "../types/Character";
import { apply_modifier, remove_modifier } from "../controller/mod";
import { equip } from "../controller/equipment";

const char: Character = {
  ...default_character,
  id: 'test_character',
}

test('CharacterModifier: ADD modifiers increases attrbiute', (_t) => {
  var mod: CharacterAura = {
    id: 'max_hp_buff',
    display_name: 'Max Hp Buff',
    duration: -1, // -1 should be permanent?
    modifiers: { ...default_modifier, hp_max: 10 }
  }
  apply_modifier(char, mod)
  assert.equal(char.hp_max, 110);
})

test('CharacterModifier: REMOVING ADD modifiers remove attrbiute', (_t) => {
  remove_modifier(char, _.get(char.aura, 0))
  assert.equal(char.hp_max, 100);
})

test('Equipment: Equiping an Item should apply its stats to the Character', (_t) => {
  var equipment: Equipment = {
    id: 'max_hp_buff',
    slot: EQUIPMENT_SLOT.ARMOR,
    display_name: 'Axe',
    modifiers: { ...default_modifier, att: 10 }
  }
  assert.equal(equip(char, equipment).att, 11);
})
