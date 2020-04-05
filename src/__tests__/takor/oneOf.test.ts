import Enforce from '../..'
import { EVERY_POSSIBLE_VALUE } from '../testResources'

describe('oneOf', () => {
    it('matches one', () => {
        const enforcer = Enforce.oneOf(String, Number)
        expect(enforcer(10)).toEqual(true)
    })
    it('matches other', () => {
        const enforcer = Enforce.oneOf(Set, Number)
        expect(enforcer(new Set)).toEqual(true)
    })
    it('returns false when not one of', () => {
        const enforcer = Enforce.oneOf(Set, Number)
        expect(enforcer('new Set')).toEqual(false)
    })
    describe('with Enforce.shape', () => {
        it('is used when is in shape', () => {
            const enforcer = Enforce.shape({
                key: Enforce.oneOf(String, Number)
            })
            const actual = enforcer({
                key: ''
            })
            expect(actual).toEqual(true)
        })
    })
    describe('with Enforce.arrayOf', () => {
        it('finds inside arrayOf', () => {
            const enforcer = Enforce.arrayOf(Enforce.oneOf(String, Number))
            expect(enforcer([''])).toEqual(true)
        })
        it('works correctly in a failed assertion', () => {
            const enforcer = Enforce.arrayOf(Enforce.oneOf(String, Number))
            expect(enforcer([new Set])).toEqual(false)
        })
    })
    describe('robustness', () => {
        describe('assertion', () => {
            EVERY_POSSIBLE_VALUE.forEach(value => {
                const enforcer = Enforce.oneOf(Enforce.any)
                it(`does not throw for value type ${value}`, () => {
                    expect(() => { enforcer(value) }).not.toThrow()
                })
            })
        })
        describe('function creation', () => {
            EVERY_POSSIBLE_VALUE.forEach(value => {
                it(`does not throw when initailized with: ${value}`, () => {
                    // @ts-ignore
                    expect(() => { Enforce.oneOf(value) }).not.toThrow()
                })
            })
        })
    })
})
