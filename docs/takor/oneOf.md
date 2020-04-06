#### oneOf

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
