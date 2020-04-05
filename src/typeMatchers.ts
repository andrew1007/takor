import {
    POJO as pojo,
    ANY as any,
    TRUTHY as truthy,
    FALSEY as falsey,
} from './constants'

const { prototype, getPrototypeOf } = Object

function isPojo(obj) {
    if (obj === null || typeof obj !== 'object') {
        return false
    }
    return getPrototypeOf(obj) === prototype
}

export default new Map<any, (arg: any) => boolean>([
    [Number, (el: any) => typeof el === 'number' || el instanceof Number],
    [String, (el: any) => typeof el === 'string' || el instanceof String],
    [Set, (el: any) => el instanceof Set],
    [Map, (el: any) => el instanceof Map],
    [null, (el: any) => el === null],
    [undefined, (el: any) => el === undefined],
    [NaN, (el: any) => Number.isNaN(el)],
    [Array, (el: any) => el instanceof Array || Array.isArray(el)],
    [pojo, (el: any) => isPojo(el)],
    [any, (_: any) => true],
    [Boolean, (el: any) => typeof el === 'boolean'],
    [true, (el: any) => el === true],
    [false, (el: any) => el === false],
    [truthy, (el: any) => !!el],
    [falsey, (el: any) => !el],
])
