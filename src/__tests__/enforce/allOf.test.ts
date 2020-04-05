import Enforce from '../..'
import { INVALID_VALUE_TYPES, EVERY_POSSIBLE_VALUE } from '../testResources'

describe('allOf', () => {
    it('is true for one validator and full match', () => {
        const enforcer = Enforce.allOf(Array)
        expect(enforcer([])).toEqual(true)
    })
    it('is false for one validator and only partial match', () => {
        const isPopulated = (arr) => arr.length > 0
        const enforcer = Enforce.allOf(Array, isPopulated)
        expect(enforcer([])).toEqual(false)
    })
    it('uses nested validators correctly (true case)', () => {
        const isEmptyObj = Enforce.shape({})
        const enforcer = Enforce.allOf(isEmptyObj, Enforce.pojo)
        expect(enforcer({})).toEqual(true)
    })
    it('uses nested validators correctly (false case)', () => {
        const isEmptyObj = Enforce.shape({})
        const enforcer = Enforce.allOf(isEmptyObj, Enforce.pojo)
        expect(enforcer({ a: 10 })).toEqual(false)
    })
    describe('edge cases', () => {
        describe('no validators passed in', () => {
            EVERY_POSSIBLE_VALUE.forEach(value => {
                it(`is always true if no validators are used for value: ${value}`, () => {
                    expect(Enforce.allOf()(value)).toEqual(true)
                })
            })
        })
        describe('contradictory validators', () => {
            it('handles contradictory types in an expected way', () => {
                const enforcer = Enforce.allOf(Number, String)
                expect(enforcer('')).toEqual(false)
            })
            it('handles contradictory types in an expected way', () => {
                const enforcer = Enforce.allOf(Number, String)
                expect(enforcer(10)).toEqual(false)
            })
        })
    })
    describe('robustness', () => {
        describe('assertion', () => {
            EVERY_POSSIBLE_VALUE.forEach(value => {
                const enforcer = Enforce.allOf(Enforce.any)
                it(`does not throw for value type ${value}`, () => {
                    expect(() => enforcer(value)).not.toThrow()
                })
            })
        })
        describe('function creation', () => {
            EVERY_POSSIBLE_VALUE.forEach(value => {
                it(`does not throw when initailized with: ${value}`, () => {
                    // @ts-ignore
                    expect(() => { Enforce.allOf(value) }).not.toThrow()
                })
            })
        })
    })
})
