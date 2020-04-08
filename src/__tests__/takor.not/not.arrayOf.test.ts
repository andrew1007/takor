import takor from '../..'
import { INVALID_VALUE_TYPES } from '../testResources'

describe('not.arrayOf', () => {
    describe('basic', () => {
        it('succeeds', () => {
            const enforcer = takor.not.arrayOf(Array, String, Set)
            const actual = enforcer([10])
            expect(actual).toEqual(true)
        })
        it('fails', () => {
            const enforcer = takor.not.arrayOf(Array, String, Set)
            const actual = enforcer([[]])
            expect(actual).toEqual(false)
        })
    })
    describe('complex', () => {
        it('succeeds', () => {
            const enforcer = takor.not.arrayOf(Array, takor.shape({ key: Number }), Set)
            const actual = enforcer(['', { key: '' }])
            expect(actual).toEqual(true)
        })
        it('fails', () => {
            const enforcer = takor.not.arrayOf(Array, takor.shape({ key: takor.pojo }), Set)
            const actual = enforcer(['', { key: {} }])
            expect(actual).toEqual(false)
        })
    })
    describe('non-array values', () => {
        INVALID_VALUE_TYPES.arrayOf.forEach(([type, value]) => {
            it(`is true for type ${type} of value ${value}`, () => {
                const enforcer = takor.not.arrayOf(takor.any)
                expect(enforcer(value)).toEqual(true)
            })
        })
    })
})
