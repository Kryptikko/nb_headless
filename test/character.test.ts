import _ from "lodash"
import { test } from 'node:test'
import assert from 'node:assert/strict'
import type { Character, CharacterModifier } from "../types/Character";
import { ABILITY } from "../types/Ability";
import { apply_mod } from "../controller/mod";
const char: Character = {
  id: 'test',
  display_name: "Tester",
  level: 1,
  xp: 100,
  hp_max: 100,
  hp_now: 100,
  att: 1,
  def: 1,
  mgc: 1,
  ini: 1,
  ability_primary: ABILITY.BLIZZARD,
  aura: []
}
test('CharacterModifier: ADD types increases attrbiute', (_t) => {
  var mod: CharacterModifier = {
    id: 'max_hp_buff',
    attribute: 'hp_max',
    type: "ADD",
    value: 10
  }
  apply_mod(char, mod)
  assert.equal(char.hp_max, 110);
})
