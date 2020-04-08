// Custom validators are any function that accepts an input value and returns a boolean
export type ICustomValidator = (el: any) => boolean

// Baked in common matchers, so you don't have to constantly write them yourself
export type IPojo = (el: any) => boolean
export type IAny = (el: any) => boolean
export type ITruthy = (el: any) => boolean
export type IFalsey = (el: any) => boolean

// Shape accepts an object where the value is a validator or a primitive literal
export type ShapeOfMatchers = {
    [key: string]: IMatcher
}

// A function that takes an arbitrary number of matchers that returns another function to assert values
export type ListOfMatchers = (...matchers: IMatcher[]) => (el: any) => boolean

// A function that takes an arbitrary number of tuple of matchers that return another function to assert values
export type ListOfTupleMatchers = (...matchers: [IMatcher, IMatcher][]) => (el: any) => boolean

// Only accepts a single matcher
export type SingleMatcher = (matcher: IMatcher) => (el: any) => boolean

// List of valid matchers
export type IMatcher =
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
    ICustomValidator | // custom validator
    IPojo | // built in matcher
    IAny | // built in matcher
    ITruthy | // built in matcher
    IFalsey // built in matcher
