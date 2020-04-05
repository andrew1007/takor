import Enforce from '../..'
import { INVALID_VALUE_TYPES } from '../testResources'

describe('not.arrayOf', () => {
    describe('basic', () => {
        it('succeeds', () => {
            const enforcer = Enforce.not.arrayOf(Array, String, Set)
            const actual = enforcer([10])
            expect(actual).toEqual(true)
        })
        it('fails', () => {
            const enforcer = Enforce.not.arrayOf(Array, String, Set)
            const actual = enforcer([[]])
            expect(actual).toEqual(false)
        })
    })
    describe('complex', () => {
        it('succeeds', () => {
            const enforcer = Enforce.not.arrayOf(Array, Enforce.shape({ key: Number }), Set)
            const actual = enforcer(['', { key: '' }])
            expect(actual).toEqual(true)
        })
        it('fails', () => {
            const enforcer = Enforce.not.arrayOf(Array, Enforce.shape({ key: Enforce.pojo }), Set)
            const actual = enforcer(['', { key: {} }])
            expect(actual).toEqual(false)
        })
    })
    describe('non-array values', () => {
        INVALID_VALUE_TYPES.arrayOf.forEach(([type, value]) => {
            it(`is true for type ${type} of value ${value}`, () => {
                const enforcer = Enforce.not.arrayOf(Enforce.any)
                expect(enforcer(value)).toEqual(true)
            })
        })
    })
})
