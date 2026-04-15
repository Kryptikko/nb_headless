import assert from 'node:assert/strict'
import { test } from 'node:test'
import hbox from '../screen/components/hbox'

test('Puts 2 elements side by side', (_t) => {
  var result = hbox(
    `line 11      
line 12
line 13
line 14`,
    `line 21
line 22`
  )
  // console.log('result')
  // console.log(result)
  const split = result.split('\n')
  assert.equal(split.length, 4)
  assert.equal(split[0]?.length, 75)
})

