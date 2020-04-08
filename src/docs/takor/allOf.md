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
