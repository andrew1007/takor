// Custom validators are any function that accepts an input value and returns a boolean
export type ICustomValidator = (el?: any) => boolean

// Baked in common matchers, so you don't have to constantly write them yourself
export type IPojo = (el?: any) => boolean
export type IAny = (el?: any) => boolean
export type ITruthy = (el?: any) => boolean
export type IFalsey = (el?: any) => boolean

// Shape accepts an object where the value is a validator or a primitive literal
export type ShapeArg = {
    [key: string]: IValidTakorArgs
}

// List of valid arguments
export type IValidTakorArgs =
    SetConstructor |
    MapConstructor |
    NumberConstructor |
    StringConstructor |
    null |
    undefined |
    ArrayConstructor |
    BooleanConstructor |
    true |
    false |
    string |
    number |
    ICustomValidator // custom validator
