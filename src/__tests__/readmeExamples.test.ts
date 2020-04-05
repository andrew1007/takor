import Enforce from '..'

describe('README examples', () => {
    describe('Enforce.oneOf', () => {
        const isNumOrStr = Enforce.oneOf(Number, String)
        it('matching value', () => {
            expect(isNumOrStr(10)).toEqual(true)
        })
        it('mismatching value', () => {
            expect(isNumOrStr(new Set)).toEqual(false)
        })
    })

    describe('Enforce.shape', () => {
        const checkShape = Enforce.shape({
            key1: Enforce.oneOf(Number, String)
        })
        describe('basic', () => {
            it('matches', () => {
                expect(checkShape({
                    key1: 'string'
                })).toEqual(true)
            })
        })
        describe('nested', () => {
            const checkNestedElement = Enforce.shape({
                key1: Enforce.shape({
                    key2: Enforce.arrayOf(Number, Set, String)
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
        const isValidDogBreed = Enforce.oneOf('terrier', 'greyhound', 'golden retriever')
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

        const goodNumberRange = Enforce.allOf(lessThanTen, greaterThanThree)
        const allInValidRange = Enforce.arrayOf(goodNumberRange, String)
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
            const nonNullOrArray = Enforce.not.oneOf(null, Array)
            it('matches', () => {
                expect(nonNullOrArray(10)).toEqual(true)
            })
            it('mismatches', () => {
                expect(nonNullOrArray([])).toEqual(false)
            })
        })
    })

    describe('mapOf', () => {
        const validMap = Enforce.mapOf(
            [Number, Enforce.oneOf(Array, Set)],
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
})
