#### mapOf

##### Desc
Asserts inner elemnts of an es6 `Map`
##### Notes
`mapOf` takes an arbitrary number of tuples, correlating to `[key, value]` assertions

##### Examples
```javascript
const allNumbers = takor.mapOf(
    [Number, Number]
)
allNumbers(new Map([ // true
    [10, 10]
]))
allNumbers(new Map([ // false
    [10, '10']
]))


// inner assertion inside mapOf
const valueMapShape = takor.shape({
    key: takor.shape({
        key2: takor.oneOf(null, Number)
    })
})
const checkMapValue = takor.mapOf(
    [String, assertShape]
)
checkMapValue(new Map([ // true
    ['12', { key: { key2: null } }],
])))

```