import { combat_simulation } from "./combat";
import type { Character } from './types/Character.ts'
import { test } from 'node:test'
import assert from 'node:assert/strict'

const attackers: Array<Character> = [{
  id: 'id_1',
  display_name: "Attacker 1",
  hp_max: 20,
  hp_now: 20,
  level: 1,
  xp: 0,
  att: 1,
  def: 1,
  mgc: 1,
  ini: 1,
}, {
  id: 'id_2',
  display_name: "Attacker 2",
  hp_max: 10,
  hp_now: 10,
  level: 1,
  xp: 0,
  att: 1,
  def: 1,
  mgc: 1,
  ini: 3,
}]
const defenders: Array<Character> = [{
  id: 'id_d_1',
  display_name: "Defender 1",
  hp_max: 10,
  hp_now: 10,
  level: 1,
  xp: 0,
  att: 1,
  def: 1,
  mgc: 1,
  ini: 2,
}, {
  id: 'id_d_1',
  display_name: "Defender 1",
  hp_max: 10,
  hp_now: 10,
  level: 1,
  xp: 0,
  att: 1,
  def: 1,
  mgc: 1,
  ini: 1,
}]

test('No attackers results in no combat logs', (_t) => {
  assert.strictEqual(combat_simulation([], attackers).length, 0)
});

test('No defenders results in no combat', (_t) => {
  assert.strictEqual(combat_simulation(attackers, []).length, 0)
});

test('Speed combat prioritisation', (_t) => {
  var result = combat_simulation(attackers, defenders)
  assert.equal(result.length, 40)
  // assert.deepEqual(combat_simulation())
})
