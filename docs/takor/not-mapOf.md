#### not.mapOf

##### Desc
The converse [mapOf](#mapof)
##### Notes
non-`Map` values will always be `true`

##### Examples
```javascript
const notAllNumbers = takor.not.mapOf(
    [Number, Number]
)

notAllNumbers(new Map([ // false
    [10, 10]
]))
notAllNumbers(new Map([ // true
    [10, '10']
]))
```
