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
