import Enforce from '../..'
import { INVALID_VALUE_TYPES, EVERY_POSSIBLE_VALUE } from '../testResources'

describe('not.mapOf', () => {
    it('asserts internal elements of set', () => {
        const enforcer = Enforce.not.mapOf(
            [Number, Number]
        )
        expect(enforcer(new Map([
            [10, 10]
        ]))).toEqual(false)
    })
    it('asserts failure of elements', () => {
        const enforcer = Enforce.not.mapOf(
            [String, Number]
        )
        expect(enforcer(new Map([
            [10, '10']
        ]))).toEqual(true)
    })
    it('asserts failure of elements', () => {
        const enforcer = Enforce.not.mapOf(
            [String, Number]
        )
        expect(enforcer(new Map([
            [10, '10']
        ]))).toEqual(true)
    })
    it('asserts failure of elements', () => {
        const enforcer = Enforce.not.mapOf(
            [String, 'Number']
        )
        expect(enforcer(new Map([
            ['10', 'Number']
        ]))).toEqual(false)
    })
    it('asserts multitypes', () => {
        const enforcer = Enforce.not.mapOf(
            [String, Number],
            [Number, String]
        )
        expect(enforcer(new Map<any, any>([
            [10, '10'],
            ['10', 10],
            [12, '12']
        ]))).toEqual(false)
    })
    it('asserts multitypes that are partial matches', () => {
        const enforcer = Enforce.not.mapOf(
            [String, Number],
            [Number, String],
            [Number, Set]
        )
        expect(enforcer(new Map<any, any>([
            [10, '10'],
            ['12', 10],
            [10, new Set]
        ]))).toEqual(false)
    })
    it('asserts multitypes correctly', () => {
        const enforcer = Enforce.not.mapOf(
            [String, Number],
            [Map, Number]
        )
        expect(enforcer(new Map<any, any>([
            [10, '10'],
            [10, new Map]
        ]))).toEqual(true)
    })
    it('asserts multitypes correctly when one key does match', () => {
        const enforcer = Enforce.not.mapOf(
            [String, Number],
            [Number, String],
            [String, Map]
        )
        expect(enforcer(new Map<any, any>([
            [10, 10],
            ['12', 10],
            ['10', new Map]
        ]))).toEqual(false)
    })
    it('asserts multitypes and allows enforcer functions as sub checkers', () => {
        const assertShape = Enforce.shape({
            key: Enforce.shape({
                key2: Enforce.oneOf(null, Number)
            })
        })
        const enforcer = Enforce.not.mapOf(
            [String, Number],
            [Number, String],
            [String, assertShape]
        )
        expect(enforcer(new Map<any, any>([
            ['10', 10],
            ['12', { key: { key2: null } }],
            [10, '10']
        ]))).toEqual(false)
    })
    it('asserts not an empty map', () => {
        const enforcer = Enforce.not.mapOf()
        expect(enforcer(new Map<any, any>([
            ['10', 10],
            ['12', { key: { key2: null } }],
            [10, '10']
        ]))).toEqual(true)
    })
    it('asserts not an empty map', () => {
        const enforcer = Enforce.not.mapOf(
            [Enforce.ANY, Enforce.ANY],
        )
        expect(enforcer(new Map)).toEqual(true)
    })
    describe('non-map values', () => {
        INVALID_VALUE_TYPES.mapOf.forEach(([type, value]) => {
            it(`is true for type ${type} of value ${value}`, () => {
                const enforcer = Enforce.not.mapOf([Enforce.ANY, Enforce.ANY])
                expect(enforcer(value)).toEqual(true)
            })
        })
    })
    describe('robustness', () => {
        describe('assertion', () => {
            EVERY_POSSIBLE_VALUE.forEach(value => {
                const enforcer = Enforce.not.mapOf([Enforce.ANY, Enforce.ANY])
                it(`does not throw for value type ${value}`, () => {
                    expect(() => { enforcer(value) }).not.toThrow()
                })
            })
        })
        describe('function creation', () => {
            EVERY_POSSIBLE_VALUE.forEach(value => {
                it(`does not throw when initailized with: ${value}`, () => {
                    // @ts-ignore
                    expect(() => { Enforce.not.mapOf(value) }).not.toThrow()
                })
            })
        })
    })
})