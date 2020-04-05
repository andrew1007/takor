import takor from '../..'
import { INVALID_VALUE_TYPES, EVERY_POSSIBLE_VALUE } from '../testResources'

describe('takor.any', () => {
    EVERY_POSSIBLE_VALUE.forEach(value => {
        it(`is true for value type: ${value}`, () => {
            const asserter = takor.any(value)
            expect(takor.any(value)).toEqual(true)
        })
        
    })
})
