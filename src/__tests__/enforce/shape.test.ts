import Enforce from '../..'
import { INVALID_VALUE_TYPES, EVERY_POSSIBLE_VALUE } from '../testResources'

describe('shape', () => {
    it('succeeds match for any object using Enforce.ANY', () => {
        const enforcer = Enforce.shape(Enforce.ANY)
        const actual = enforcer({})
        expect(actual).toEqual(true)
    })

    describe('basic shapes', () => {
        it('enforces basic shape', () => {
            const enforcer = Enforce.shape({
                key: String
            })
            const actual = enforcer({
                key: ''
            })
            expect(actual).toEqual(true)
        })
        it('enforce fails basic shape', () => {
            const enforcer = Enforce.shape({
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
            const enforcer = Enforce.shape({
                key: Enforce.shape({
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
            const enforcer = Enforce.shape({
                key: Enforce.shape({
                    key: Enforce.shape({
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
            const enforcer = Enforce.shape({
                key: Enforce.POJO
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
            const enforcer = Enforce.shape({
                key: Enforce.arrayOf(String)
            })
            const actual = enforcer({
                key: ['']
            })
            expect(actual).toEqual(true)
        })
        it('enforces mega composite enforcers', () => {
            const enforcer = Enforce.shape({
                key: Enforce.arrayOf(Enforce.shape({
                    hello: Enforce.shape({
                        hello2: Enforce.shape({
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
            const enforcer = Enforce.shape({
                key: Enforce.arrayOf(Enforce.shape({
                    hello: Enforce.shape({
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
            const enforcer = Enforce.shape({
                key: Enforce.arrayOf(Enforce.shape({
                    hello: Enforce.shape({
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
                            hello3: 10,
                            hello4: 20
                        }
                    }
                ]
            })
            expect(actual).toEqual(true)
        })
    })

    describe('edge cases', () => {
        it('succesfully enforce empty object', () => {
            const enforcer = Enforce.shape({})
            const actual = enforcer({})
            expect(actual).toEqual(true)
        })
        it('succesfully enforce empty object when passed in is not empty', () => {
            const enforcer = Enforce.shape({})
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
            const enforcer = Enforce.shape({
                dogType: Enforce.is(isTerrier)
            })
            expect(enforcer({
                dogType: new Dog('terrier')
            })).toEqual(true)
        })
    })

    describe('non-pojo values', () => {
        INVALID_VALUE_TYPES.shape.forEach(([type, value]) => {
            it(`is false for type ${type} of value ${value}`, () => {
                const enforcer = Enforce.shape(Enforce.ANY)
                expect(enforcer(value)).toEqual(false)
            })
        })
    })

    describe('robustness', () => {
        describe('assertion', () => {
            EVERY_POSSIBLE_VALUE.forEach(value => {
                const enforcer = Enforce.shape(Enforce.ANY)
                it(`does not throw for value type ${value}`, () => {
                    expect(() => {enforcer(value)}).not.toThrow()
                })
            })
        })
        describe('function creation', () => {
            EVERY_POSSIBLE_VALUE.forEach(value => {
                it(`does not throw when initailized with: ${value}`, () => {
                    // @ts-ignore
                    expect(() => {Enforce.shape(value)}).not.toThrow()
                })
            })
        })
    })
})
