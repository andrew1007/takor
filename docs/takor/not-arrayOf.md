#### not.arrayOf

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
