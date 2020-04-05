import Enforce from '../..'

describe('oneOf', () => {
    it('finds opposite', () => {
        const enforcer = Enforce.not.oneOf(Number, String)
        expect(enforcer(new Set)).toEqual(true)
    })
    it('is true when includes', () => {
        const enforcer = Enforce.not.oneOf(Number, Map)
        expect(enforcer(new Map)).toEqual(false)
    })
    describe('inside shape', () => {
        it('works in an expected way', () => {
            const enforcer = Enforce.shape({
                key: Enforce.not.oneOf(null)
            })
            expect(enforcer({ key: 10 })).toEqual(true)
        })
        it('fails in expected way', () => {
            const enforcer = Enforce.shape({
                key: Enforce.not.oneOf(null)
            })
            expect(enforcer({ key: null })).toEqual(false)
        })
    })
    describe('inside arrayOf', () => {
        it('works when passed in', () => {
            const enforcer = Enforce.arrayOf(Enforce.not.oneOf(null))
            expect(enforcer(['', 1, new Set, new Map])).toEqual(true)
        })
        // @todo how should this be handled?
        describe('contradictory enforcements', () => {
            it('handles contradictory in an expected way', () => {
                const enforcer = Enforce.arrayOf(Enforce.not.oneOf(null), null)
                expect(enforcer(['', 1, new Set, new Map])).toEqual(true)
            })
            it('handles contradictory in an expected way in reverse order', () => {
                const enforcer = Enforce.arrayOf(null, Enforce.not.oneOf(null))
                expect(enforcer(['', 1, new Set, new Map])).toEqual(true)
            })
        })
    })
})
