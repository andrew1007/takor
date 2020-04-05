// Custom validators are any function that accepts an input value and returns a boolean
export type IValidator = (el?: any) => boolean

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
    IValidator // custom validator
