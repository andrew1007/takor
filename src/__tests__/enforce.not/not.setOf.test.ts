import Enforce from '../..'
import { INVALID_VALUE_TYPES } from '../testResources'

describe('not.setOf', () => {
    it('asserts internal elements of set', () => {
        const enforcer = Enforce.not.setOf(Number)
        expect(enforcer(new Set([10]))).toEqual(false)
    })
    it('asserts failure of elements', () => {
        const enforcer = Enforce.not.setOf(String)
        expect(enforcer(new Set([10]))).toEqual(true)
    })
    it('asserts multitypes', () => {
        const enforcer = Enforce.not.setOf(String, Number)
        expect(enforcer(new Set([10, '12']))).toEqual(false)
    })
    it('asserts multitypes', () => {
        const enforcer = Enforce.not.setOf(String, Number)
        expect(enforcer(new Set([new Map, null]))).toEqual(true)
    })
    it('asserts multitypes that are partial matches', () => {
        const enforcer = Enforce.not.setOf(String, Number, Set)
        expect(enforcer(new Set([10, '12']))).toEqual(false)
    })
    it('asserts multitypes when one value does not match', () => {
        const enforcer = Enforce.not.setOf(String, Number)
        expect(enforcer(new Set([10, '12', new Map]))).toEqual(false)
    })
    it('asserts multitypes when one value does not match', () => {
        const enforcer = Enforce.not.setOf()
        expect(enforcer(new Set([10, '12', new Map]))).toEqual(true)
    })
    describe('non-set values', () => {
        INVALID_VALUE_TYPES.setOf.forEach(([type, value]) => {
            it(`is true for type ${type} of value ${value}`, () => {
                const enforcer = Enforce.not.setOf(Enforce.ANY)
                expect(enforcer(value)).toEqual(true)
            })
        })
    })
})
