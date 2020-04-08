#### falsey

type: [IFalsey](#types)

##### Desc
Not a validator. It is a raw function that checks for any `falsey` value type

##### Notes
More information on `falsey` can be found on [MDN](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)
Intended use is as an argument for validators.

##### Examples
```javascript
takor.falsey(false) // true
takor.falsey([]) // false

const falseyOnly = takor.arrayOf(takor.falsey)
falseyOnly([1, null, '']) //  false
falseyOnly([null, 0, '']) //  true
```