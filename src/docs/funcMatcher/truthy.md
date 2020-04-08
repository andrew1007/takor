#### truthy

type: [ITruthy](#types)

##### Desc
Not a validator. It is a function that checks if the value is `truthy`.
##### Notes
More information on `truthy` can be found on [MDN](#https://developer.mozilla.org/en-US/docs/Glossary/Truthy)
Intended use is as an argument for validators.
##### Examples
```javascript
takor.truthy(10) // true
takor.truthy(NaN) // false

const truthiesOnly = takor.arrayOf(takor.truthy)
truthiesOnly([1, new Set, '1']) //  true
truthiesOnly([1, new Set, '']) //  false
```