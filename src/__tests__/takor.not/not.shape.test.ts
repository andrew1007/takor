import Enforce from '../..'
import { INVALID_VALUE_TYPES, EVERY_POSSIBLE_VALUE } from '../testResources'

describe('not.shape', () => {
    describe('basic', () => {
        it('succeeds', () => {
            const enforcer = Enforce.not.shape({})
            const actual = enforcer({ a: 10 })
            expect(actual).toEqual(true)
        })
        it('fails', () => {
            const enforcer = Enforce.not.shape({
                key: Enforce.pojo
            })
            const actual = enforcer({ key: { a: 10 } })
            expect(actual).toEqual(false)
        })
    })
    describe('complex', () => {
        it('checks nested elements', () => {
            const enforcer = Enforce.shape({
                key: Enforce.not.shape({
                    notKey: Number
                })
            })
            const actual = enforcer({
                key: {}
            })
            expect(actual).toEqual(true)
        })
        it('asserts outer elements', () => {
            const enforcer = Enforce.not.shape({
                key: Enforce.shape({
                    notKey: Number
                })
            })
            const actual = enforcer({
                hello: {
                    notKey: 10
                }
            })
            expect(actual).toEqual(true)
        })
    })
    describe('non-pojo vales', () => {
        INVALID_VALUE_TYPES.shape.forEach(([type, value]) => {
            it(`is true for type ${type} of value ${value}`, () => {
                // @ts-ignore
                const enforcer = Enforce.not.shape(Enforce.any)
                expect(enforcer(value)).toEqual(true)
            })
        })
    })

    describe('robustness', () => {
        describe('assertion', () => {
            EVERY_POSSIBLE_VALUE.forEach(value => {
                // @ts-ignore
                const enforcer = Enforce.not.shape(Enforce.any)
                it(`does not throw for value type ${value}`, () => {
                    expect(() => { enforcer(value) }).not.toThrow()
                })
            })
        })
        describe('function creation', () => {
            EVERY_POSSIBLE_VALUE.forEach(value => {
                it(`does not throw when initailized with: ${value}`, () => {
                    // @ts-ignore
                    expect(() => { Enforce.not.shape(value) }).not.toThrow()
                })
            })
        })
    })
})
