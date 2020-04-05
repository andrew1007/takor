
export type IValidator = (el?: any) => boolean

export type ShapeArg = { [key: string]: (IValidEnforcerArgs | ({ [key: string]: any })) } | IValidEnforcerArgs
export type IValidEnforcerArgs =
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
    IValidator
