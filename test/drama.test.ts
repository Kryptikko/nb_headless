import _ from "lodash"
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { INTERACTION_TRIGGER, type Interaction, type Persona, type Relation } from '../types/Persona';
import drama from '../controller/drama';

const _persona_group: Array<Persona> = [
  {
    id: "persona_1",
    tension: 1,
    morale: 1,
    dominant: 0.1,
    friendly: 0.1,
    compliant: 0.1,
    memory: []
  }, {
    id: "persona_2",
    tension: 1,
    morale: 1,
    dominant: 0.1,
    friendly: 0.1,
    compliant: 0.1,
    memory: []
  },
]
const _interaction: Interaction = {
  id: '_hello',
  display_text: 'Test interaction',
  strength: 0.1,
  delta: {
    trust: -0.1,
    tension: 0.1,
  },
  trigger: INTERACTION_TRIGGER.DUNGEON_COMPLETED,
  // trigger_chance: 1,
  condition: {
    'and': [
      { '>': [{ 'var': 'actor.tension' }, 0.5] },
      { '>': [{ 'var': 'target.tension' }, 0.5] }
    ]
  }
}
const relations: Array<Relation> = []
test('Drama: initializing a group will autofill their relationships', (_t) => {
  drama.init([_interaction])
  assert.strictEqual(_.get(drama.get_interactions(), INTERACTION_TRIGGER.DUNGEON_COMPLETED).length, 1)
});

test('Drama: initializing a group will prefill relations', (_t) => {
  drama.init_group(_persona_group)
  assert.strictEqual(_.values(drama.get_relations()).length, 2)
});

test('Drama: reinitializing a group will not create new relations', (_t) => {
  drama.init_group(_persona_group)
  assert.strictEqual(_.values(drama.get_relations()).length, 2)
});

test('Drama: triggering an action', (_t) => {
  drama.trigger(INTERACTION_TRIGGER.DUNGEON_COMPLETED, true)
  assert.strictEqual(_.values(drama.get_relations()).length, 2)
});
