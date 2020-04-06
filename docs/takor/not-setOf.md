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
