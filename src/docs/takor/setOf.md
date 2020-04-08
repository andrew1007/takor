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