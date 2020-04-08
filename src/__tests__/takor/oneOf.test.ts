import takor from '../..'
import { EVERY_POSSIBLE_VALUE } from '../testResources'

describe('oneOf', () => {
    it('matches one', () => {
        const enforcer = takor.oneOf(String, Number)
        expect(enforcer(10)).toEqual(true)
    })
    it('matches other', () => {
        const enforcer = takor.oneOf(Set, Number)
        expect(enforcer(new Set)).toEqual(true)
    })
    it('returns false when not one of', () => {
        const enforcer = takor.oneOf(Set, Number)
        expect(enforcer('new Set')).toEqual(false)
    })
    describe('with takor.shape', () => {
        it('is used when is in shape', () => {
            const enforcer = takor.shape({
                key: takor.oneOf(String, Number)
            })
            const actual = enforcer({
                key: ''
            })
            expect(actual).toEqual(true)
        })
    })
    describe('with takor.arrayOf', () => {
        it('finds inside arrayOf', () => {
            const enforcer = takor.arrayOf(takor.oneOf(String, Number))
            expect(enforcer([''])).toEqual(true)
        })
        it('works correctly in a failed assertion', () => {
            const enforcer = takor.arrayOf(takor.oneOf(String, Number))
            expect(enforcer([new Set])).toEqual(false)
        })
    })
    describe('robustness', () => {
        describe('assertion', () => {
            EVERY_POSSIBLE_VALUE.forEach(value => {
                const enforcer = takor.oneOf(takor.any)
                it(`does not throw for value type ${value}`, () => {
                    expect(() => { enforcer(value) }).not.toThrow()
                })
            })
        })
        describe('function creation', () => {
            EVERY_POSSIBLE_VALUE.forEach(value => {
                it(`does not throw when initailized with: ${value}`, () => {
                    // @ts-ignore
                    expect(() => { takor.oneOf(value) }).not.toThrow()
                })
            })
        })
    })
})
