import takor from '../..'
import { INVALID_VALUE_TYPES, EVERY_POSSIBLE_VALUE } from '../testResources'

describe('arrayOf', () => {
    it('asserts a basic type of String', () => {
        const enforcer = takor.arrayOf(String)
        expect(enforcer(['Number'])).toEqual(true)
    })
    it('fails when wrong type', () => {
        const enforcer = takor.arrayOf(Number)
        expect(enforcer(['Number'])).toEqual(false)
    })
    it('succeeds when one type is matching', () => {
        const enforcer = takor.arrayOf(String, Number)
        expect(enforcer(['Number'])).toEqual(true)
    })
    it('succeeds with subcomposite elements', () => {
        const enforcer = takor.arrayOf(takor.shape({
            hi: String
        }),
            Number
        )
        expect(enforcer([10])).toEqual(true)
    })
    it('succeeds with subcomposite elements', () => {
        const enforcer = takor.arrayOf(
            String,
            takor.shape({
                hi: Number
            }),
            Number,
        )
        expect(enforcer([10, { hi: 10 }])).toEqual(true)
    })
    it('succeeds with reversed order of arguments', () => {
        const enforcer = takor.arrayOf(
            takor.shape({
                hi: Number
            }),
            String,
            Number,
        )
        expect(enforcer([10, { hi: 10 }])).toEqual(true)
    })
    it('fails with a single bad value', () => {
        const enforcer = takor.arrayOf(
            takor.shape({
                hi: Number
            }),
            String,
            Number,
        )
        expect(enforcer([10, { hi: 10 }, new Map])).toEqual(false)
    })
    it('asserts undefined', () => {
        const enforcer = takor.arrayOf(undefined)
        expect(enforcer([undefined])).toEqual(true)
    })
    describe('non-array values', () => {
        INVALID_VALUE_TYPES.arrayOf.forEach(([type, value]) => {
            it(`is false for type ${type} of value ${value}`, () => {
                const enforcer = takor.arrayOf(takor.any)
                expect(enforcer(value)).toEqual(false)
            })
        })
    })
    describe('robustness', () => {
        describe('assertion', () => {
            EVERY_POSSIBLE_VALUE.forEach(value => {
                const enforcer = takor.arrayOf(takor.any)
                it(`does not throw for value type ${value}`, () => {
                    expect(() => enforcer(value)).not.toThrow()
                })
            })
        })
        describe('function creation', () => {
            EVERY_POSSIBLE_VALUE.forEach(value => {
                it(`does not throw when initailized with: ${value}`, () => {
                    // @ts-ignore
                    expect(() => { takor.arrayOf(value) }).not.toThrow()
                })
            })
        })
    })
})
