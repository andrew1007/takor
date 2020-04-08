import { POJO, ANY, TRUTHY, FALSEY } from '../constants'
import typeMatchers from '../typeMatchers'
import { SAMPLE_ARGS } from './testResources'

const ALL_VALUES = Object.values(SAMPLE_ARGS).reduce((acc, valArr) => {
    return [...acc, ...valArr]
}, [])

const FALSEY_VALUES = [0, '', null, undefined, null, NaN, false] as any[]

const ASSERTIONS = {
    number: {
        type: Number,
        tests: {
            good: SAMPLE_ARGS.NUMBERS,
            bad: [
                ...SAMPLE_ARGS.SETS,
                ...SAMPLE_ARGS.ARRAYS,
                ...SAMPLE_ARGS.MAPS,
                ...SAMPLE_ARGS.STRINGS,
                ...SAMPLE_ARGS.FUNCTIONS,
                ...SAMPLE_ARGS.POJOS,
            ]
        },
    },
    string: {
        type: String,
        tests: {
            good: SAMPLE_ARGS.STRINGS,
            bad: [
                ...SAMPLE_ARGS.SETS,
                ...SAMPLE_ARGS.ARRAYS,
                ...SAMPLE_ARGS.MAPS,
                ...SAMPLE_ARGS.NUMBERS,
                ...SAMPLE_ARGS.FUNCTIONS,
                ...SAMPLE_ARGS.POJOS,
            ]
        },
    },
    set: {
        type: Set,
        tests: {
            good: SAMPLE_ARGS.SETS,
            bad: [
                ...SAMPLE_ARGS.ARRAYS,
                ...SAMPLE_ARGS.MAPS,
                ...SAMPLE_ARGS.NUMBERS,
                ...SAMPLE_ARGS.STRINGS,
                ...SAMPLE_ARGS.FUNCTIONS,
                ...SAMPLE_ARGS.POJOS,
            ]
        },
    },
    map: {
        type: Map,
        tests: {
            good: SAMPLE_ARGS.MAPS,
            bad: [
                ...SAMPLE_ARGS.SETS,
                ...SAMPLE_ARGS.ARRAYS,
                ...SAMPLE_ARGS.NUMBERS,
                ...SAMPLE_ARGS.STRINGS,
                ...SAMPLE_ARGS.FUNCTIONS,
                ...SAMPLE_ARGS.POJOS,
            ]
        },
    },
    null: {
        type: null,
        tests: {
            good: [null],
            bad: [
                ...SAMPLE_ARGS.SETS,
                ...SAMPLE_ARGS.ARRAYS,
                ...SAMPLE_ARGS.MAPS,
                ...SAMPLE_ARGS.NUMBERS,
                ...SAMPLE_ARGS.STRINGS,
                ...SAMPLE_ARGS.FUNCTIONS,
                ...SAMPLE_ARGS.POJOS,
                undefined,
                false,
                true
            ]
        },
    },
    undefined: {
        type: undefined,
        tests: {
            good: [undefined],
            bad: [
                ...SAMPLE_ARGS.SETS,
                ...SAMPLE_ARGS.ARRAYS,
                ...SAMPLE_ARGS.MAPS,
                ...SAMPLE_ARGS.NUMBERS,
                ...SAMPLE_ARGS.STRINGS,
                ...SAMPLE_ARGS.FUNCTIONS,
                ...SAMPLE_ARGS.POJOS,
            ]
        },
    },
    NaN: {
        type: NaN,
        tests: {
            good: [NaN],
            bad: [
                ...SAMPLE_ARGS.SETS,
                ...SAMPLE_ARGS.ARRAYS,
                ...SAMPLE_ARGS.MAPS,
                ...SAMPLE_ARGS.NUMBERS.map(num => !Number.isNaN(num)),
                ...SAMPLE_ARGS.STRINGS,
                ...SAMPLE_ARGS.FUNCTIONS,
                ...SAMPLE_ARGS.POJOS,
            ]
        },
    },
    array: {
        type: Array,
        tests: {
            good: SAMPLE_ARGS.ARRAYS,
            bad: [
                ...SAMPLE_ARGS.SETS,
                ...SAMPLE_ARGS.MAPS,
                ...SAMPLE_ARGS.NUMBERS,
                ...SAMPLE_ARGS.STRINGS,
                ...SAMPLE_ARGS.FUNCTIONS,
                ...SAMPLE_ARGS.POJOS,
            ]
        },
    },
    POJO: {
        type: POJO,
        tests: {
            good: SAMPLE_ARGS.POJOS,
            bad: [
                ...SAMPLE_ARGS.SETS,
                ...SAMPLE_ARGS.ARRAYS,
                ...SAMPLE_ARGS.MAPS,
                ...SAMPLE_ARGS.NUMBERS,
                ...SAMPLE_ARGS.STRINGS,
                ...SAMPLE_ARGS.FUNCTIONS,
                ...FALSEY_VALUES,
            ]
        },
    },
    ANY: {
        type: ANY,
        tests: {
            good: ALL_VALUES,
            bad: []
        },
    },
    Boolean: {
        type: Boolean,
        tests: {
            good: [true, false],
            bad: [
                ...SAMPLE_ARGS.SETS,
                ...SAMPLE_ARGS.ARRAYS,
                ...SAMPLE_ARGS.MAPS,
                ...SAMPLE_ARGS.NUMBERS,
                ...SAMPLE_ARGS.STRINGS,
                ...SAMPLE_ARGS.FUNCTIONS,
                ...SAMPLE_ARGS.POJOS,
                undefined,
                null,
            ]
        },
    },
    true: {
        type: true,
        tests: {
            good: [true],
            bad: [
                ...SAMPLE_ARGS.SETS,
                ...SAMPLE_ARGS.ARRAYS,
                ...SAMPLE_ARGS.MAPS,
                ...SAMPLE_ARGS.NUMBERS,
                ...SAMPLE_ARGS.STRINGS,
                ...SAMPLE_ARGS.FUNCTIONS,
                ...SAMPLE_ARGS.POJOS,
                undefined,
                null,
                false
            ]
        },
    },
    false: {
        type: false,
        tests: {
            good: [false],
            bad: [
                ...SAMPLE_ARGS.SETS,
                ...SAMPLE_ARGS.ARRAYS,
                ...SAMPLE_ARGS.MAPS,
                ...SAMPLE_ARGS.NUMBERS,
                ...SAMPLE_ARGS.STRINGS,
                ...SAMPLE_ARGS.FUNCTIONS,
                ...SAMPLE_ARGS.POJOS,
                undefined,
                null,
                true
            ]
        },
    },
    TRUTHY: {
        type: TRUTHY,
        tests: {
            good: ALL_VALUES.filter(val => !FALSEY_VALUES.includes(val)),
            bad: FALSEY_VALUES
        },
    },
    FALSEY: {
        type: FALSEY,
        tests: {
            good: FALSEY_VALUES,
            bad: ALL_VALUES.filter(val => !FALSEY_VALUES.includes(val)),
        },
    },
    function: {
        type: Function,
        tests: {
            good: SAMPLE_ARGS.FUNCTIONS,
            bad: [
                ...SAMPLE_ARGS.SETS,
                ...SAMPLE_ARGS.ARRAYS,
                ...SAMPLE_ARGS.MAPS,
                ...SAMPLE_ARGS.NUMBERS,
                ...SAMPLE_ARGS.STRINGS,
                ...SAMPLE_ARGS.POJOS,
                undefined,
                null,
            ]
        }
    }
}

const allAssertionTypes = Object.keys(ASSERTIONS)
const getMatcher = (type: any) => typeMatchers.get(type) as (el: any) => boolean

describe('typeMatchers', () => {
    it('this test suite asserts all matchers', () => {
        expect(Object.keys(ASSERTIONS).length).toEqual(typeMatchers.size)
    })
    allAssertionTypes.forEach((assertionType) => {
        const { type, tests } = ASSERTIONS[assertionType]
        const currentMatcher = getMatcher(type)
        tests.good.forEach(value => {
            it(`correctly uses the matcher ${assertionType} to assert ${value}`, () => {
                expect(currentMatcher(value)).toEqual(true)
            })
        })
        tests.bad.forEach(value => {
            it(`correctly uses the matcher ${assertionType} to assert AGAINST ${value}`, () => {
                expect(currentMatcher(value)).toEqual(false)
            })
        })
    })
})
