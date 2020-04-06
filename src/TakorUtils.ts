import typeMatchers from './typeMatchers'
import { POJO, ANY, TRUTHY, FALSEY } from './constants'
import { IValidTakorArgs, ICustomValidator } from './types'

export default class TakorUtils {
    protected static pojo = typeMatchers.get(POJO) as ICustomValidator
    protected static ANY = typeMatchers.get(ANY) as ICustomValidator
    protected static TRUTHY = typeMatchers.get(TRUTHY) as ICustomValidator
    protected static FALSEY = typeMatchers.get(FALSEY) as ICustomValidator

    protected static getValidator(el: any): ICustomValidator {
        if (el === TakorUtils.ANY) {
            return () => true
        } if (typeMatchers.has(el)) {
            return typeMatchers.get(el) as ICustomValidator
        } else if (typeof el === 'function') {
            return el
        } else if (typeof el === 'string' || typeof el === 'number') {
            return (arg: any) => arg === el
        } else {
            return () => false
        }
    }

    protected static createArrayValidators = (enforcedTypes: any[]): ICustomValidator[] => {
        return enforcedTypes.map(el => TakorUtils.getValidator(el))
    }

    protected static createMapValidators = (enforcedTypes: [IValidTakorArgs, IValidTakorArgs][]): [ICustomValidator, ICustomValidator][] => {
        return enforcedTypes.map(([key, value]) => [TakorUtils.getValidator(key), TakorUtils.getValidator(value)])
    }

    protected static assertOfArray(allValidators: ICustomValidator[]) {
        return (array: any) => {
            try {
                return array.every((entry: any) => {
                    return allValidators.some(el => el(entry))
                }) as boolean
            } catch {
                return false
            }
        }
    }

    protected static ensure = {
        not: {
            every: (allValidators: ICustomValidator[]) => (entry: any) => allValidators.every(validator => !validator(entry)),
            matchShape: ({ shape, arg }): boolean => {
                for (let key in shape) {
                    if (shape.hasOwnProperty(key)) {
                        const currWalkedValue = arg[key]
                        const value = shape[key]
                        const validator = TakorUtils.getValidator(value)
                        if (validator(currWalkedValue)) {
                            return false
                        }
                    }
                }
                return true
            }
        },
        every: (allValidators: ICustomValidator[]) => (entry: any) => allValidators.every(validator => validator(entry)),
        some: (allValidators: ICustomValidator[]) => (entry: any) => allValidators.some(el => el(entry)),
        matchShape: ({ shape, arg }): boolean => {
            for (let key in shape) {
                if (shape.hasOwnProperty(key)) {
                    const currWalkedValue = arg[key]
                    const value = shape[key]
                    const validator = TakorUtils.getValidator(value)
                    if (!validator(currWalkedValue)) {
                        return false
                    }
                }
            }
            return true
        }
    }
}
