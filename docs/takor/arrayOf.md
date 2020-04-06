#### arrayOf

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
    Number,
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