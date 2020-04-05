# Enforce.js

Flexible and composable runtime type assertion for Javascript. Syntax inspired by prop-types. Supports:
- ES6 data structures
- nested assertions 
- inverse assertions
- custom validators

## 📦 Quick Examples
```javascript
// Enforce.oneOf
const isNumOrStr = Enforce.oneOf(Number, String)
isNumOrStr(10) // true
isNumOrStr(new Set) // false

// Enforce.shape basic
const checkShape = Enforce.shape({
    key1: Enforce.oneOf(Number, String)
})
checkShape({ // true
    key1: 'string'
})

// Enforce.shape with nested assertions
const checkNestedElement = Enforce.shape({
    key1: Enforce.shape({
        key2: Enforce.arrayOf(Number, Set, String)
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
const isValidDogBreed = Enforce.oneOf('terrier', 'greyhound', 'golden retriever')
isValidDogBreed('terrier') // true
isValidDogBreed('persian') // false

// custom validator(s)
const lessThanTen = (el) => el < 10
const greaterThanThree = (el) => el > 3

const goodNumberRange = Enforce.allOf(lessThanTen, greaterThanThree)
const allInValidRange = Enforce.arrayOf(goodNumberRange, String)

allInValidRange([8, 4, 3.5, 5]) // true
allInValidRange([8, 4, '100', 5]) // true
allInValidRange([8, 4, 100, 5]) // false
allInValidRange(10) // false 
allInValidRange(new Map) // false

// Enforce.mapOf
const validMap = Enforce.mapOf(
    [Number, Enforce.oneOf(Array, Set)],
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

// Enforce.not
const nonNullOrArray = Enforce.not.oneOf(null, Array)
nonNullOrArray(10) // true
nonNullOrArray([]) // false
```
# type-enforce
