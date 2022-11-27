/* eslint-disable unicorn/no-abusive-eslint-disable */
/* eslint-disable */
import { expect, test } from 'vitest'
import * as percent from '../src/percent.js'

test('Percent Encoding', () => {
  expect(percent.encode('Ladies + Gentlemen')).toBe('Ladies%20%2B%20Gentlemen')
  expect(percent.encode('An encoded string!')).toBe('An%20encoded%20string%21')
  expect(percent.encode('Dogs, Cats & Mice')).toBe(
    'Dogs%2C%20Cats%20%26%20Mice'
  )
  expect(percent.encode('☃')).toBe('%E2%98%83')
})
