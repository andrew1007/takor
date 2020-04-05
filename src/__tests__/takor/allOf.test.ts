import takor from '../..'
import { EVERY_POSSIBLE_VALUE } from '../testResources'

describe('allOf', () => {
    it('is true for one validator and full match', () => {
        const enforcer = takor.allOf(Array)
        expect(enforcer([])).toEqual(true)
    })
    it('is false for one validator and only partial match', () => {
        const isPopulated = (arr) => arr.length > 0
        const enforcer = takor.allOf(Array, isPopulated)
        expect(enforcer([])).toEqual(false)
    })
    it('uses nested validators correctly (true case)', () => {
        const isEmptyObj = takor.shape({})
        const enforcer = takor.allOf(isEmptyObj, takor.pojo)
        expect(enforcer({})).toEqual(true)
    })
    it('uses nested validators correctly (false case)', () => {
        const isEmptyObj = takor.shape({})
        const enforcer = takor.allOf(isEmptyObj, takor.pojo)
        expect(enforcer({ a: 10 })).toEqual(false)
    })
    describe('edge cases', () => {
        describe('no validators passed in', () => {
            EVERY_POSSIBLE_VALUE.forEach(value => {
                it(`is always true if no validators are used for value: ${value}`, () => {
                    expect(takor.allOf()(value)).toEqual(true)
                })
            })
        })
        describe('contradictory validators', () => {
            it('handles contradictory types in an expected way', () => {
                const enforcer = takor.allOf(Number, String)
                expect(enforcer('')).toEqual(false)
            })
            it('handles contradictory types in an expected way', () => {
                const enforcer = takor.allOf(Number, String)
                expect(enforcer(10)).toEqual(false)
            })
        })
    })
    describe('robustness', () => {
        describe('assertion', () => {
            EVERY_POSSIBLE_VALUE.forEach(value => {
                const enforcer = takor.allOf(takor.any)
                it(`does not throw for value type ${value}`, () => {
                    expect(() => enforcer(value)).not.toThrow()
                })
            })
        })
        describe('function creation', () => {
            EVERY_POSSIBLE_VALUE.forEach(value => {
                it(`does not throw when initailized with: ${value}`, () => {
                    // @ts-ignore
                    expect(() => { takor.allOf(value) }).not.toThrow()
                })
            })
        })
    })
})
