import takor from '../..'
import { INVALID_VALUE_TYPES, EVERY_POSSIBLE_VALUE } from '../testResources'

describe('setOf', () => {
    it('asserts internal elements of set', () => {
        const enforcer = takor.setOf(Number)
        expect(enforcer(new Set([10]))).toEqual(true)
    })
    it('asserts failure of elements', () => {
        const enforcer = takor.setOf(String)
        expect(enforcer(new Set([10]))).toEqual(false)
    })
    it('asserts multitypes', () => {
        const enforcer = takor.setOf(String, Number)
        expect(enforcer(new Set([10, '12']))).toEqual(true)
    })
    it('asserts multitypes that are partial matches', () => {
        const enforcer = takor.setOf(String, Number, Set)
        expect(enforcer(new Set([10, '12']))).toEqual(true)
    })
    it('asserts multitypes when one value does not match', () => {
        const enforcer = takor.setOf(String, Number)
        expect(enforcer(new Set([10, '12', new Map]))).toEqual(false)
    })
    it('asserts empty set', () => {
        const enforcer = takor.setOf()
        expect(enforcer(new Set([10, '12', new Map]))).toEqual(false)
    })
    it('asserts empty set', () => {
        const enforcer = takor.setOf()
        expect(enforcer(new Set())).toEqual(true)
    })
    describe('non-set values', () => {
        INVALID_VALUE_TYPES.setOf.forEach(([type, value]) => {
            it(`is false for type ${type} of value ${value}`, () => {
                const enforcer = takor.setOf(takor.any)
                expect(enforcer(value)).toEqual(false)
            })
        })
    })
    describe('robustness', () => {
        describe('assertion', () => {
            EVERY_POSSIBLE_VALUE.forEach(value => {
                const enforcer = takor.setOf(takor.any)
                it(`does not throw for value type ${value}`, () => {
                    expect(() => { enforcer(value) }).not.toThrow()
                })
            })
        })
        describe('function creation', () => {
            EVERY_POSSIBLE_VALUE.forEach(value => {
                it(`does not throw when initailized with: ${value}`, () => {
                    // @ts-ignore
                    expect(() => { takor.setOf(value) }).not.toThrow()
                })
            })
        })
    })
})
