import typeMatchers from './typeMatchers'
import { POJO, ANY, TRUTHY, FALSEY } from './constants'
import { IValidEnforcerArgs, IValidator } from './types'

export default class Utils {
    protected static POJO = typeMatchers.get(POJO) as IValidator
    protected static ANY = typeMatchers.get(ANY) as IValidator
    protected static TRUTHY = typeMatchers.get(TRUTHY) as IValidator
    protected static FALSEY = typeMatchers.get(FALSEY) as IValidator

    protected static getValidator(el: any): IValidator {
        if (el === Utils.ANY) {
            return () => true
        } if (typeMatchers.has(el)) {
            return typeMatchers.get(el) as IValidator
        } else if (typeof el === 'function') {
            return el
        } else if (typeof el === 'string' || typeof el === 'number') {
            return (arg: any) => arg === el
        } else {
            return () => false
        }
    }

    protected static createArrayValidators = (enforcedTypes: any[]): IValidator[] => {
        return enforcedTypes.map(el => Utils.getValidator(el))
    }

    protected static createMapValidators = (enforcedTypes: [IValidEnforcerArgs, IValidEnforcerArgs][]): [IValidator, IValidator][] => {
        return enforcedTypes.map(([key, value]) => [Utils.getValidator(key), Utils.getValidator(value)])
    }

    protected static assertOfArray(allValidators: IValidator[]) {
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
            every: (allValidators: IValidator[]) => (entry: any) => allValidators.every(validator => !validator(entry)),
            matchShape: ({ shape, arg }): boolean => {
                for (let key in shape) {
                    if (shape.hasOwnProperty(key)) {
                        const currWalkedValue = arg[key]
                        const value = shape[key]
                        const validator = Utils.getValidator(value)
                        if (validator(currWalkedValue)) {
                            return false
                        }
                    }
                }
                return true
            }
        },
        every: (allValidators: IValidator[]) => (entry: any) => allValidators.every(validator => validator(entry)),
        some: (allValidators: IValidator[]) => (entry: any) => allValidators.some(el => el(entry)),
        matchShape: ({ shape, arg }): boolean => {
            for (let key in shape) {
                if (shape.hasOwnProperty(key)) {
                    const currWalkedValue = arg[key]
                    const value = shape[key]
                    const validator = Utils.getValidator(value)
                    if (!validator(currWalkedValue)) {
                        return false
                    }
                }
            }
            return true
        }
    }
}
