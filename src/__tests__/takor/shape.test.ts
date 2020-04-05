import takor from '../..'
import { INVALID_VALUE_TYPES, EVERY_POSSIBLE_VALUE } from '../testResources'

describe('shape', () => {
    describe('basic shapes', () => {
        it('enforces basic shape', () => {
            const enforcer = takor.shape({
                key: String
            })
            const actual = enforcer({
                key: ''
            })
            expect(actual).toEqual(true)
        })
        it('enforce fails basic shape', () => {
            const enforcer = takor.shape({
                key: String
            })
            const actual = enforcer({
                key: 10
            })
            expect(actual).toEqual(false)
        })
    })

    describe('nested shapes', () => {
        it('enforces nested shapes', () => {
            const enforcer = takor.shape({
                key: takor.shape({
                    key: String
                })
            })
            const actual = enforcer({
                key: {
                    key: ''
                }
            })
            expect(actual).toEqual(true)
        })
        it('enforce fails nested shapes', () => {
            const enforcer = takor.shape({
                key: takor.shape({
                    key: takor.shape({
                        key1: String
                    })
                })
            })
            const actual = enforcer({
                key: {
                    els: '10'
                }
            })
            expect(actual).toEqual(false)
        })
        it('enforces nested shapes', () => {
            const enforcer = takor.shape({
                key: takor.pojo
            })
            const actual = enforcer({
                key: {
                    key: 10
                }
            })
            expect(actual).toEqual(true)
        })
    })

    describe('composite shapes', () => {
        it('enforces composite enforcers', () => {
            const enforcer = takor.shape({
                key: takor.arrayOf(String)
            })
            const actual = enforcer({
                key: ['']
            })
            expect(actual).toEqual(true)
        })
        it('enforces mega composite enforcers', () => {
            const enforcer = takor.shape({
                key: takor.arrayOf(takor.shape({
                    hello: takor.shape({
                        hello2: takor.shape({
                            hello4: Array,
                        })
                    })
                }))
            })
            const actual = enforcer({
                key: [
                    {
                        hello: {
                            hello2: {
                                hello4: [123],
                            }
                        }
                    }
                ]
            })
            expect(actual).toEqual(true)
        })
    })

    describe('key existence', () => {
        it('enforces missing keys', () => {
            const enforcer = takor.shape({
                key: takor.arrayOf(takor.shape({
                    hello: takor.shape({
                        hello2: Number,
                        hello3: Number
                    })
                }))
            })
            const actual = enforcer({
                key: [
                    {
                        hello: {
                            hello2: 10,
                        }
                    }
                ]
            })
            expect(actual).toEqual(false)
        })
        // it's a feature not a bug omegalul
        it('does not enforce extra keys', () => {
            const enforcer = takor.shape({
                data: takor.arrayOf(takor.shape({
                    entry: takor.shape({
                        phoneNumber: Number,
                        firstName: String
                    })
                }))
            })
            const actual = enforcer({
                data: [{
                    entry: {
                        phoneNumber: 4024224856,
                        firstName: 'john',
                        lastName: 'smith'
                    }
                }]
            })
            expect(actual).toEqual(true)
        })
    })

    describe('edge cases', () => {
        it('succesfully enforce empty object', () => {
            const enforcer = takor.shape({})
            const actual = enforcer({})
            expect(actual).toEqual(true)
        })
        it('succesfully enforce empty object when passed in is not empty', () => {
            const enforcer = takor.shape({})
            const actual = enforcer({
                key: 10
            })
            expect(actual).toEqual(false)
        })
    })

    describe('non-default matchers', () => {
        it('validates nested custom objects', () => {
            class Dog {
                breed: string
                constructor(breed: string) {
                    this.breed = breed
                }
            }
            const isTerrier = (arg: Dog) => {
                return arg.breed === 'terrier'
            }
            const enforcer = takor.shape({
                dogType: takor.is(isTerrier)
            })
            expect(enforcer({
                dogType: new Dog('terrier')
            })).toEqual(true)
        })
    })

    describe('non-pojo values', () => {
        INVALID_VALUE_TYPES.shape.forEach(([type, value]) => {
            it(`is false for type ${type} of value ${value}`, () => {
                const enforcer = takor.shape({})
                expect(enforcer(value)).toEqual(false)
            })
        })
    })

    describe('robustness', () => {
        describe('assertion', () => {
            EVERY_POSSIBLE_VALUE.forEach(value => {
                const enforcer = takor.shape({})
                it(`does not throw for value type ${value}`, () => {
                    expect(() => { enforcer(value) }).not.toThrow()
                })
            })
        })
        describe('function creation', () => {
            EVERY_POSSIBLE_VALUE.forEach(value => {
                it(`does not throw when initailized with: ${value}`, () => {
                    // @ts-ignore
                    expect(() => { takor.shape(value) }).not.toThrow()
                })
            })
        })
    })
})
