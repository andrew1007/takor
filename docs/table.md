## static methods

| name | types |
| -- | --|
| shape | [el](#types)

##types
```typescript
type IValidator = (el?: any) => boolean

interface ShapeArg {
    [key: string]: IValidEnforcerArgs
}

type IValidEnforcerArgs =
    SetConstructor |
    MapConstructor |
    NumberConstructor |
    StringConstructor |
    null |
    undefined |
    ArrayConstructor |
    BooleanConstructor |
    true |
    false |
    string |
    number |
    IValidator
```