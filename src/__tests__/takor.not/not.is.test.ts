import takor from '../..'

describe('not.is', () => {
    describe('base matchers', () => {
        it('matches not', () => {
            const enforcer = takor.not.is(undefined)
            expect(enforcer(10)).toEqual(true)
        })
        it('inverse matches', () => {
            const enforcer = takor.not.is(undefined)
            expect(enforcer(undefined)).toEqual(false)
        })
    })
    describe('compound matchers', () => {
        it('matches not', () => {
            const enforcer = takor.not.is(takor.arrayOf(Number))
            expect(enforcer(['10', null, undefined, NaN, [], new Set, new Map])).toEqual(true)
        })
        it('inverse matches', () => {
            const enforcer = takor.not.is(takor.arrayOf(Number))
            expect(enforcer(['10'])).toEqual(true)
        })
        it('inverse matches specific types', () => {
            const enforcer = takor.not.is(takor.arrayOf(10))
            expect(enforcer([10])).toEqual(false)
        })
    })
})
