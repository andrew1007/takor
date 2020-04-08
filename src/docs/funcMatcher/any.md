#### any

type: [IAny](#types)

##### Desc
Not a validator. A function that is `true` for any value

##### Notes
Intended use is as an argument for validators.

##### Examples
```javascript
takor.any(10) // true

const assertKeysOnly = takor.shape({
    data: takor.shape({
        entry: takor.any
    })
})

assertKeysOnly({ // true
    data: {
        entry: []
    }
})
```