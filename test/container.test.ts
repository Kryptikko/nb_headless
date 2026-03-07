import assert from 'node:assert/strict'
import { test } from 'node:test'
import container from "../screen/components/container";

test('Does it detect new lines', (_t) => {
  var result = container(`Lorem ipsum dolor sit amet, 
consectetur adipiscing elit. Sed eu felis sed quam laoreet semper a convallis ligula. Maecenas auctor id dolor quis lobortis. F`)
  assert.equal(result.split('\n').length, 4)
})

test('Does it render the header', (_t) => {
  var result = container(`Lorem ipsum dolor sit amet, 
consectetur adipiscing elit. Sed eu felis sed quam laoreet semper a convallis ligula. Maecenas auctor id dolor quis lobortis. F`, "Header")
  assert.equal(result.includes('Header'), true)
})
