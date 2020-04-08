import takor from '../..'
import { EVERY_POSSIBLE_VALUE } from '../testResources'

describe('is', () => {
    describe('basic', () => {
        it('validates a single entry', () => {
            const enforcer = takor.is(String)
            expect(enforcer('')).toEqual(true)
        })
        it('correctly fails validation', () => {
            const enforcer = takor.is(Number)
            expect(enforcer('')).toEqual(false)
        })
    })
    describe('shape', () => {
        it('validates a single entry', () => {
            const enforcer = takor.is(takor.shape({
                key: Number
            }))
            expect(enforcer({
                key: 10
            })).toEqual(true)
        })
        it('correctly fails validation', () => {
            const enforcer = takor.is(takor.shape({
                key: Set
            }))
            expect(enforcer({
                key: 10
            })).toEqual(false)
        })
    })
    describe('custom validator', () => {
        it('validates a single entry', () => {
            const enforcer = takor.is((el: any) => el > 0)
            expect(enforcer(190)).toEqual(true)
        })
        it('correctly fails validation', () => {
            const enforcer = takor.is((el: any) => el > 0)
            expect(enforcer(-1)).toEqual(false)
        })
    })
    describe('uses POJO properly', () => {
        const VALUES = [
            { value: NaN, good: false },
            { value: undefined, good: false },
            { value: null, good: false },
            { value: new Set, good: false },
            { value: new Map, good: false },
            { value: [], good: false },
            { value: '', good: false },
            { value: {}, good: true },
            { value: { a: 10 }, good: true },
        ]
        VALUES.forEach(({ value, good }) => {
            const isPojo = takor.is(takor.pojo)
            it(`is for ${value} of value ${good}`, () => {
                expect(isPojo(value)).toEqual(good)
            })
        })
    })
    describe('robustness', () => {
        describe('assertion', () => {
            EVERY_POSSIBLE_VALUE.forEach(value => {
                const enforcer = takor.is(takor.any)
                it(`does not throw for value type ${value}`, () => {
                    expect(() => enforcer(value)).not.toThrow()
                })
            })
        })
        describe('function creation', () => {
            EVERY_POSSIBLE_VALUE.forEach(value => {
                it(`does not throw when initailized with: ${value}`, () => {
                    // @ts-ignore
                    expect(() => { takor.is(value) }).not.toThrow()
                })
            })
        })
    })
})
