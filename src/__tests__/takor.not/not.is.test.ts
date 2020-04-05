import Enforce from '../..'

describe('not.is', () => {
    describe('base matchers', () => {
        it('matches not', () => {
            const enforcer = Enforce.not.is(undefined)
            expect(enforcer(10)).toEqual(true)
        })
        it('inverse matches', () => {
            const enforcer = Enforce.not.is(undefined)
            expect(enforcer(undefined)).toEqual(false)
        })
    })
    describe('compound matchers', () => {
        it('matches not', () => {
            const enforcer = Enforce.not.is(Enforce.arrayOf(Number))
            expect(enforcer(['10', null, undefined, NaN, [], new Set, new Map])).toEqual(true)
        })
        it('inverse matches', () => {
            const enforcer = Enforce.not.is(Enforce.arrayOf(Number))
            expect(enforcer(['10'])).toEqual(true)
        })
        it('inverse matches specific types', () => {
            const enforcer = Enforce.not.is(Enforce.arrayOf(10))
            expect(enforcer([10])).toEqual(false)
        })
    })
})
