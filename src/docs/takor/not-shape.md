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
