import takor from '..'

describe('README examples', () => {
    describe('Enforce.oneOf', () => {
        const isNumOrStr = takor.oneOf(Number, String)
        it('matching value', () => {
            expect(isNumOrStr(10)).toEqual(true)
        })
        it('mismatching value', () => {
            expect(isNumOrStr(new Set)).toEqual(false)
        })
    })

    describe('Enforce.shape', () => {
        const checkShape = takor.shape({
            key1: takor.oneOf(Number, String)
        })
        describe('basic', () => {
            it('matches', () => {
                expect(checkShape({
                    key1: 'string'
                })).toEqual(true)
            })
        })
        describe('nested', () => {
            const checkNestedElement = takor.shape({
                key1: takor.shape({
                    key2: takor.arrayOf(Number, Set, String)
                })
            })
            it('matching value', () => {
                expect(checkNestedElement({ // true
                    key1: {
                        key2: [0, new Set, '']
                    }
                })).toEqual(true)
            })
            it('mismatching value', () => {
                expect(checkNestedElement({ // false
                    key2: {
                        key1: [0, new Set, '']
                    }
                })).toEqual(false)
            })
        })
    })

    describe('literal number or string', () => {
        const isValidDogBreed = takor.oneOf('terrier', 'greyhound', 'golden retriever')
        it('matches', () => {
            expect(isValidDogBreed('terrier')).toEqual(true)
        })
        it('mismatches', () => {
            expect(isValidDogBreed('persian')).toEqual(false)
        })
    })

    describe('custom validator(s)', () => {
        const lessThanTen = (el) => el < 10
        const greaterThanThree = (el) => el > 3

        const goodNumberRange = takor.allOf(lessThanTen, greaterThanThree)
        const allInValidRange = takor.arrayOf(goodNumberRange, String)
        it('matches', () => {
            expect(allInValidRange([8, 4, 3.5, 5])).toEqual(true)
        })
        it('matches', () => {
            expect(allInValidRange([8, 4, '100', 5])).toEqual(true)
        })
        it('mismatches', () => {
            expect(allInValidRange([8, 4, 100, 5])).toEqual(false)
        })
        it('mismatches', () => {
            expect(allInValidRange(10)).toEqual(false)
        })
        it('mismatches', () => {
            expect(allInValidRange(new Map)).toEqual(false)
        })
    })

    describe('not', () => {
        describe('oneOf', () => {
            const nonNullOrArray = takor.not.oneOf(null, Array)
            it('matches', () => {
                expect(nonNullOrArray(10)).toEqual(true)
            })
            it('mismatches', () => {
                expect(nonNullOrArray([])).toEqual(false)
            })
        })
    })

    describe('mapOf', () => {
        const validMap = takor.mapOf(
            [Number, takor.oneOf(Array, Set)],
            [String, String]
        )
        it('matches', () => {
            expect(validMap(new Map<any, any>([ // true
                [10, []],
                [10, new Set],
                ['10', '10']
            ]))).toEqual(true)
        })
        it('matches', () => {
            expect(validMap(new Map<any, any>([ // false
                [10, []],
                [10, new Set],
                ['10', new Set]
            ]))).toEqual(false)

        })
    })

    describe('allOf', () => {
        const isPopulated = (arr) => arr.length > 0
        const populatedStringArr = takor.allOf(takor.arrayOf(String), isPopulated)
        it('it meets expected values', () => {
            expect(populatedStringArr([''])).toEqual(true)
            expect(populatedStringArr([])).toEqual(false)
            expect(populatedStringArr([10])).toEqual(false)
        })
    })

    describe('not.is', () => {
        it('asserts', () => {
            const checkStrLen = takor.not.is((str) => str.length === 0)
            expect(checkStrLen('')).toEqual(false)
            expect(checkStrLen('10')).toEqual(true)
        })
    })

    describe('not.setOf', () => {
        it('asserts', () => {
            const notStrs = takor.not.setOf(String)
            expect(notStrs(new Set([10]))).toEqual(true)
            expect(notStrs(new Set([10, '12']))).toEqual(false)
        })
    })

    describe('falsey', () => {
        it('works', () => {
            const falseyOnly = takor.arrayOf(takor.falsey)
            expect(falseyOnly([1, null, ''])).toEqual(false)
            expect(falseyOnly([null, 0, ''])).toEqual(true)
        })
    })

    describe('truthy', () => {
        it('works', () => {
            const truthiesOnly = takor.arrayOf(takor.truthy)
            expect(truthiesOnly([1, new Set, ''])).toEqual(false)
            expect(truthiesOnly([1, new Set, '1'])).toEqual(true)
        })
    })

    describe('pojo', () => {
        it('works', () => {
            const isPayload = takor.shape({
                data: takor.oneOf(takor.pojo, Array)
            })
            
            expect(isPayload({ // false
                result: {}
            })).toEqual(false)
            
            expect(isPayload({ // true
                data: {}
            })).toEqual(true)
            
            expect(isPayload({ // true
                data: []
            })).toEqual(true)
        })
    })
})
