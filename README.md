Flexible and composable runtime type assertion for Javascript. Syntax inspired by prop-types. Supports:
- ES6 data structures
- inner elements in data structures
- nested assertions 
- inverse assertions
- custom validators


## Quick Examples
```javascript
// takor.oneOf
const isNumOrStr = takor.oneOf(Number, String)
isNumOrStr(10) // true
isNumOrStr(new Set) // false

// takor.shape basic
const checkShape = takor.shape({
    key1: takor.oneOf(Number, String)
})
checkShape({ // true
    key1: 'string'
})

// takor.shape with nested assertions
const checkNestedElement = takor.shape({
    key1: takor.shape({
        key2: takor.arrayOf(Number, Set, String)
    })
})
checkNestedElement({ // true
    key1: {
        key2: [0, new Set, '']
    }
})

checkNestedElement({ // false
    key2: {
        key1: [0, new Set, '']
    }
})

// supports literal number or string
const isValidDogBreed = takor.oneOf('terrier', 'greyhound', 'golden retriever')
isValidDogBreed('terrier') // true
isValidDogBreed('persian') // false

// custom validator(s)
const lessThanTen = (el) => el < 10
const greaterThanThree = (el) => el > 3
const goodNumberRange = takor.allOf(lessThanTen, greaterThanThree)
// compose existing validator into another
const validNumRangeOrStr = takor.arrayOf(goodNumberRange, String)

validNumRangeOrStr([8, 4, 3.5, 5]) // true
validNumRangeOrStr([8, 4, '100', 5]) // true
validNumRangeOrStr([8, 4, 100, 5]) // false
validNumRangeOrStr(10) // false 
validNumRangeOrStr(new Map) // false

// takor.mapOf
const validMap = takor.mapOf(
    [Number, takor.oneOf(Array, Set)],
    [String, String]
)
validMap(new Map([ // true
    [10, []],
    [10, new Set],
    ['10', '10']
]))

validMap(new Map([ // false
    [10, []],
    [10, new Set],
    ['10', new Set]
]))

// takor.not
const nonNullOrArray = takor.not.oneOf(null, Array)
nonNullOrArray(10) // true
nonNullOrArray([]) // false


/**
 * Practical example:
 * Checks if the api response has a data key that is an array of objects
 * that have the keys id, phoneNumber, and name, where
 * the phone number is also checked if it is a valid phone number
 */
const isValidPhoneNumber = (phoneNumber) => {
    return /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(phoneNumber)
}
const isExpectedApiResponse = takor.shape({
    status: Number,
    message: String,
    data: takor.arrayOf(takor.shape({
        id: Number,
        phoneNumber: isValidPhoneNumber,
        name: String,
    })),
})
```
## Table of Contents
* [Quick Examples](#quick-examples)
* [Available Matchers](#available-matchers)
  * [any](#any)
  * [falsey](#falsey)
  * [pojo](#pojo)
  * [truthy](#truthy)
* Validators
  * [allOf](#allof)
  * [arrayOf](#arrayof)
  * [is](#is)
  * [mapOf](#mapof)
  * [oneOf](#oneof)
  * [setOf](#setof)
  * [shape](#shape)
* Inverse Validators
  * [not.arrayOf](#notarrayof)
  * [not.is](#notis)
  * [not.mapOf](#notmapof)
  * [not.oneOf](#notoneof)
  * [not.setOf](#notsetof)
  * [not.shape](#notshape)
* [types](#types)

|static method| type| description |
|--| -- | -- |
|[allOf](#allof)| [ListOfMatchers](#types) | Passed in validators must meet every criteria |
|[arrayOf](#arrayof)| [ListOfMatchers](#types) | Asserts the element is an array with specific types stated |
|[is](#is)| [SingleMatcher](#types) | Performs an assertion on a single value |
|[mapOf](#mapof)| [ListOfTupleMatchers](#types) | Asserts inner elemnts of an es6 `Map` |
|[oneOf](#oneof)| [ListOfMatchers](#types) | At least one validator must match |
|[setOf](#setof)| [ListOfMatchers](#types) | Asserts inner elements of a `Set` |
|[shape](#shape)| [ShapeOfMatchers](#types) | Asserts a specific structure of a pojo (plain old javascript object) |
|[not.arrayOf<nohttp>]() | [ListOfMatchers](#types) | The converse [arrayOf](#arrayof) |
|[not.is<nohttp>]() | [SingleMatcher](#types) | The converse [is](#is) |
|[not.mapOf<nohttp>]() | [ListOfTupleMatchers](#types) | The converse [mapOf](#mapof) |
|[not.oneOf<nohttp>]() | [ListOfMatchers](#types) | The converse [oneOf](#oneof) |
|[not.setOf<nohttp>]() | [ListOfMatchers](#types) | The converse [setOf](#setof) |
|[not.shape<nohttp>]() | [ShapeOfMatchers](#types) | The converse [shape](#shape) |
#### Available Matchers

##### Description 
Out-of-the-box type validators. See examples for usage.
- `Number` (Constructor)
- `String` (Constructor)
- `Set` (Constructor)
- `Map` (Constructor)
- `Boolean` (Constructor)
- `Array` (Constructor)
- `Function` (Constructor)
- `null`
- `undefined`
- `NaN`
- `true`
- `false`

#### any

type: [IAny](#types)

##### Desc
Not a validator. A function that is `true` for any value

##### Notes
Intended use is as an argument for validators.

##### Examples
```javascript
takor.any(10) // true

const assertKeysOnly = takor.shape({
    data: takor.shape({
        entry: takor.any
    })
})

assertKeysOnly({ // true
    data: {
        entry: []
    }
})
```

#### falsey

type: [IFalsey](#types)

##### Desc
Not a validator. It is a raw function that checks for any `falsey` value type

##### Notes
More information on `falsey` can be found on [MDN](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)
Intended use is as an argument for validators.

##### Examples
```javascript
takor.falsey(false) // true
takor.falsey([]) // false

const falseyOnly = takor.arrayOf(takor.falsey)
falseyOnly([1, null, '']) //  false
falseyOnly([null, 0, '']) //  true
```

#### pojo

type: [IPojo](#types)

##### Desc
Not a validator. It is a raw function that if a value is a pojo. Use [shape](#shape) to specify a pojo shape

##### Notes
Intended use is as an argument for validators

##### Examples
```javascript
takor.pojo({}) // true
takor.pojo(10) // false

// any object or array as long as top level key is `data`
const isPayload = takor.shape({
    data: takor.oneOf(takor.pojo, Array)
})

isPayload({ // false
    result: {}
})

isPayload({ // true
    data: {}
})

isPayload({ // true
    data: []
})

```


#### truthy

type: [ITruthy](#types)

##### Desc
Not a validator. It is a function that checks if the value is `truthy`.
##### Notes
More information on `truthy` can be found on [MDN](https://developer.mozilla.org/en-US/docs/Glossary/Truthy)
Intended use is as an argument for validators.
##### Examples
```javascript
takor.truthy(10) // true
takor.truthy(NaN) // false

const truthiesOnly = takor.arrayOf(takor.truthy)
truthiesOnly([1, new Set, '1']) //  true
truthiesOnly([1, new Set, '']) //  false
```
#### allOf

type: [ListOfMatchers](#types)

##### Desc
Passed in validators must meet every criteria

##### Notes
- Contradictory validators will result in `false`

##### Examples
```javascript
const isPopulated = (arr) => arr.length > 0
const populatedStringArr = takor.allOf(takor.arrayOf(String), isPopulated)
populatedStringArr(['']) // true
populatedStringArr([]) // false
populatedStringArr([10]) // false

// contradictory types. impossible to meet criteria
const impossibleCheck = takor.allOf(Number, String)
impossibleCheck(10) // false
impossibleCheck('') // false
```


#### arrayOf

type: [ListOfMatchers](#types)

##### Desc
Asserts the element is an array with specific types stated

##### Notes

##### Examples
```javascript
const assert = takor.arrayOf(Number)
assert(['Number']) //false


const checkInnerOobj = takor.arrayOf(
    takor.shape({
        hi: Number
    }),
)
checkInnerOobj([{ hi: 10 }]) // true


const goodShapeNumOrStr = takor.arrayOf(
    takor.shape({
        hi: Number
    }),
    String,
    Number,
)
goodShapeNumOrStr([10, { hi: 10 }, new Map]) // false

const emptyArr = takor.arrayOf()
emptyArr([]) // true
emptyArr([1]) // false
```

#### is

type: [SingleMatcher](#types)

##### Desc
Performs an assertion on a single value

##### Notes
This is a less flexible version of [typeof](#typeof). `takor.is` only accepts a single validator, while [typeof](#typeof) accepts an arbitrary number.

##### Examples
```javascript
const isStr = takor.is(String)
isStr('') // true
isStr(10) // false


// custom validator
takor.is((el) => el > 0)
enforcer(190) // true
enforcer(-1) // false
```


#### mapOf

type: [ListOfTupleMatchers](#types)

##### Desc
Asserts inner elemnts of an es6 `Map`
##### Notes
`mapOf` takes an arbitrary number of tuples, correlating to `[key, value]` assertions

##### Examples
```javascript
const allNumbers = takor.mapOf(
    [Number, Number]
)
allNumbers(new Map([ // true
    [10, 10]
]))
allNumbers(new Map([ // false
    [10, '10']
]))


// inner assertion inside mapOf
const valueMapShape = takor.shape({
    key: takor.shape({
        key2: takor.oneOf(null, Number)
    })
})
const checkMapValue = takor.mapOf(
    [String, assertShape]
)
checkMapValue(new Map([ // true
    ['12', { key: { key2: null } }],
])))

```

#### not.arrayOf

type: [ListOfMatchers](#types)

##### Desc
The converse [arrayOf](#arrayof)

##### Notes
Any non-`Array` value will be `true`

##### Examples
```javascript
const checkArray = takor.not.arrayOf(Array, String, Set)
checkArray([[]]) // false
checkArray([10]) // true
checkArray(NaN) // true
```


#### not.is

type: [SingleMatcher](#types)

##### Desc
The converse [is](#is)
##### Notes

##### Examples
```javascript
const checkStrLen = takor.not.is((str) => str.length === 0)
checkStrLen('') // false
checkStrLen('10') // true
```


#### not.mapOf

type: [ListOfTupleMatchers](#types)

##### Desc
The converse [mapOf](#mapof)
##### Notes
non-`Map` values will always be `true`

##### Examples
```javascript
const notAllNumbers = takor.not.mapOf(
    [Number, Number]
)

notAllNumbers(new Map([ // false
    [10, 10]
]))
notAllNumbers(new Map([ // true
    [10, '10']
]))
```


#### not.oneOf

type: [ListOfMatchers](#types)

##### Desc
The converse [oneOf](#oneof)
##### Notes

##### Examples
```javascript
const keyIsNotNull = takor.shape({
    key: takor.not.oneOf(null)
})

keyIsNotNull(({ // true
    key: 10
}))
```


#### not.setOf

type: [ListOfMatchers](#types)

##### Desc
The converse [setOf](#setof)
##### Notes

##### Examples
```javascript
const notStrs = takor.not.setOf(String)
notStrs(new Set([10])) // true
notStrs(new Set([10, '12'])) // false
```


#### not.shape

type: [ShapeOfMatchers](#types)

##### Desc
The converse [shape](#shape)
##### Notes

##### Examples
```javascript
const notEmpty = takor.not.shape({})
notEmpty({ a: 10 }) // true
notEmpty({}) // false
```


#### oneOf

type: [ListOfMatchers](#types)

##### Desc
At least one validator must match

##### Notes

##### Examples
```javascript
const numOrStr = takor.oneOf(String, Number)
numOrStr(10) // true
numOrStr(new Set) // false

// check inner elements of an array
const dogOrCat = takor.oneOf('dog', 'cat')
dogOrCat('cat') // true
dogOrCat('bird') // false
```


#### setOf

type: [ListOfMatchers](#types)

##### Desc
Asserts inner elements of a `Set`

##### Notes

##### Examples
```javascript
const allNums = takor.setOf(Number)
setOfNums(new Set([10, 30, 40])) // true

const strOrNums = takor.setOf(String, Number)
strOrNums(new Set([10, '12'])) // true
strOrNums(new Set([10, '12', new Map])) // false
```

#### shape

type: [ShapeOfMatchers](#types)

##### Desc
Asserts a specific structure of a pojo (plain old javascript object)

##### Notes
- `shape` checks only top level keys.
- Nest another `shape` to assert deeper
- Does not check for superfluous keys. Only ensures types of defined keys

##### Examples
```javascript
const assert = takor.shape({
    key: String
})
assert({key: ''}) // true


const assertNested = takor.shape({
    key: takor.shape({
        key: takor.shape({
            key1: String
        })
    })
})

assertNested({ // false
    key: {
        els: '10'
    }
})

const assertApiPayload = takor.shape({
    data: takor.arrayOf(takor.shape({
        user: takor.shape({
            phoneNumber: Number,
            firstName: String
        })
    }))
})

assertApiPayload({ // true
    data: [{
        user: {
            phoneNumber: 4024224856,
            firstName: 'john',
            lastName: 'smith' // does not check this key
        }
    }]
})
```


#### types
```typescript
// Custom validators are any function that accepts an input value and returns a boolean
type ICustomValidator = (el: any) => boolean

// Baked in common matchers, so you don't have to constantly write them yourself
type IPojo = (el: any) => boolean
type IAny = (el: any) => boolean
type ITruthy = (el: any) => boolean
type IFalsey = (el: any) => boolean

// Shape accepts an object where the value is a validator or a primitive literal
type ShapeOfMatchers = {
    [key: string]: IMatcher
}

// A function that takes an arbitrary number of matchers that returns another function to assert values
type ListOfMatchers = (...matchers: IMatcher[]) => (el: any) => boolean

// A function that takes an arbitrary number of tuple of matchers that return another function to assert values
type ListOfTupleMatchers = (...matchers: [IMatcher, IMatcher][]) => (el: any) => boolean

// Only accepts a single matcher
type SingleMatcher = (matcher: IMatcher) => (el: any) => boolean

// List of valid matchers
type IMatcher =
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

```
