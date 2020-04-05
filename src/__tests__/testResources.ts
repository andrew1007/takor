const SETS = [
    new Set,
    new Set([19]),
    new Set([new Map([[1, 10]])]),
    new Set([12, '123'])
]
const ARRAYS = [
    [],
    [1],
    [20, 123],
    ['123', new Set, new Map([[10, 10]])],
    Array(30),
    new Array,
    [[]],
    [[10, 203, [], [[[]]]]]
]
const MAPS = [
    new Map,
    new Map([[10, new Set]]),
    new Map([])
]
const NUMBERS = [0, 10, Infinity, -Infinity, NaN, -1, 12321, Number(10)]
const STRINGS = ['', '100', '-1', '0', 'new Set', 'new Map', '[]', '{}', String(10), new String, 'true', 'false']
const FUNCTIONS = [
    () => { throw new Error('') },
    () => 10,
    () => '',
    (bool: any) => bool,
]
const POJOS = [
    {},
    { a: 10 },
    { a: { b: { c: { d: [] } } } },
]

export const SAMPLE_ARGS = {
    SETS,
    ARRAYS,
    MAPS,
    NUMBERS,
    STRINGS,
    FUNCTIONS,
    POJOS
}

export const EVERY_POSSIBLE_VALUE = [
    ...Object.values(SAMPLE_ARGS).reduce((acc, valArr) => {
        return [...acc, ...valArr]
    }, []),
    false,
    true,
    null,
    undefined
]

const ALL_ARGUMENT_TYPES = Object.entries({
    null: null,
    Set: new Set,
    Map: new Map,
    Number: 10,
    String: 'a string',
    Array: [],
    NestedArray: [[10, 20]],
    throw: () => new Error(''),
    undefined: undefined,
    function: () => 10,
    NaN: NaN,
    pojo: {},
})

export const INVALID_VALUE_TYPES = {
    setOf: ALL_ARGUMENT_TYPES.filter(([key]) => key !== 'Set'),
    mapOf: ALL_ARGUMENT_TYPES.filter(([key]) => key !== 'Map'),
    arrayOf: ALL_ARGUMENT_TYPES.filter(([key]) => (key !== 'Array')).filter(([key]) => key !== 'NestedArray'),
    shape: ALL_ARGUMENT_TYPES.filter(([key]) => key !== 'pojo'),
}
