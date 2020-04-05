import { getPojoSize } from './utils'
import Utils from './EnforceUtils'
import { ShapeArg, IValidEnforcerArgs } from './types'

export default class Enforce extends Utils {
    static POJO = Utils.POJO
    static ANY = Utils.ANY
    static TRUTHY = Utils.TRUTHY
    static FALSEY = Utils.FALSEY

    static shape(shape: ShapeArg) {
        let shapeSize: number
        try {
            shapeSize = getPojoSize(shape)
        } catch {
            return () => false
        }

        const automaticallyGoodArg = makeAutomaticallyGoodArg(shape)
        const notArgToAssert = makeNotArgToAssert()
        return (arg: any) => {
            if (automaticallyGoodArg(arg)) {
                return true
            }
            if (notArgToAssert(arg)) {
                return false
            }
            return Utils.ensure.matchShape({ shape, arg })
        }

        function makeAutomaticallyGoodArg(shape) {
            const isPojo = Enforce.is(Utils.POJO)
            const isAny = () => shape === Utils.ANY
            return Enforce.allOf(isPojo, isAny)
        }
        function makeNotArgToAssert() {
            const shapeEmptyButArgPopulated = (arg: any) => shapeSize === 0 && Object.values(arg).length > 0
            const isPojo = Enforce.is(Utils.POJO)
            const notPojo = Enforce.not.is(isPojo)
            return Enforce.oneOf(notPojo, shapeEmptyButArgPopulated)
        }
    }

    static arrayOf(...enforcedTypes: IValidEnforcerArgs[]) {
        const allValidators = Utils.createArrayValidators(enforcedTypes)
        return Utils.assertOfArray(allValidators)
    }

    static setOf(...enforcedTypes: IValidEnforcerArgs[]) {
        const allValidators = (enforcedTypes).map(el => Utils.getValidator(el))
        return (set: any) => {
            if (Enforce.not.is(Set)(set)) {
                return false
            }
            return Utils.assertOfArray(allValidators)([...set])
        }
    }

    static mapOf(...enforcedTypes: [IValidEnforcerArgs, IValidEnforcerArgs][]) {
        let allValidators
        try {
            allValidators = Utils.createMapValidators(enforcedTypes)
        } catch {
            return () => true
        }

        return (map: any) => {
            if (Enforce.not.is(Map)(map)) {
                return false
            }
            return [...map].every(([key, value]) => {
                return allValidators.some(([keyValidator, valueValidator]) => {
                    return keyValidator(key) && valueValidator(value)
                })
            })
        }
    }

    static is(enforcedType: IValidEnforcerArgs) {
        const validator = Utils.getValidator(enforcedType)
        return (el: any) => validator(el)
    }

    static oneOf(...enforcedTypes: IValidEnforcerArgs[]) {
        const allValidators = Utils.createArrayValidators(enforcedTypes)
        return Utils.ensure.some(allValidators)
    }

    static allOf(...enforcedTypes: IValidEnforcerArgs[]) {
        const allValidators = Utils.createArrayValidators(enforcedTypes)
        return Utils.ensure.every(allValidators)
    }

    static not = {
        setOf(...enforcedTypes: IValidEnforcerArgs[]) {
            const allValidators = Utils.createArrayValidators(enforcedTypes)
            return (set: any) => {
                if (Enforce.not.is(Set)(set)) {
                    return true
                }
                return [...set].every(entry => {
                    return allValidators.every(el => !el(entry))
                })
            }
        },
        mapOf(...enforcedTypes: [IValidEnforcerArgs, IValidEnforcerArgs][]) {
            let allValidators
            try {
                allValidators = Utils.createMapValidators(enforcedTypes)
            } catch {
                return () => true
            }
            return (map: any) => {
                if (Enforce.not.is(Map)(map)) {
                    return true
                }
                return [...map].every(([key, value]) => {
                    return allValidators.every(([keyValidator, valueValidator]) => {
                        return !keyValidator(key) || !valueValidator(value)
                    })
                })
            }
        },
        is: (enforcedType: IValidEnforcerArgs) => {
            const validator = Utils.getValidator(enforcedType)
            return (element: any) => !validator(element)
        },
        oneOf: (...enforcedTypes: IValidEnforcerArgs[]) => {
            const allValidators = Utils.createArrayValidators(enforcedTypes)
            return Utils.ensure.not.every(allValidators)
        },
        arrayOf: (...enforcedTypes: IValidEnforcerArgs[]) => {
            const allValidators = Utils.createArrayValidators(enforcedTypes)

            return (array: any) => {
                if (Enforce.not.is(Array)(array)) {
                    return true
                }
                return array.every((entry: any) => {
                    return allValidators.every(el => !el(entry))
                })
            }
        },
        shape: (shape: ShapeArg = {}) => {
            let shapeSize
            try {
                shapeSize = getPojoSize(shape)
            } catch {
                return () => true
            }

            const notPojo = Enforce.not.is(Utils.POJO)
            const notArgToAssert = makeNotArgToAssert()
            return (arg: any) => {
                try {
                    if (notPojo(arg)) {
                        return true
                    }
                    if (notArgToAssert(arg)) {
                        return false
                    }
                    return Utils.ensure.not.matchShape({ shape, arg })
                } catch {
                    return true
                }
            }

            function makeNotArgToAssert() {
                const shapeAndArgEmpty = arg => shapeSize === 0 && Object.values(arg).length === 0
                const isPojo = Enforce.is(Utils.POJO)
                const isAnyAssertionAndObj = (arg) => shape === Utils.ANY && isPojo(arg)
                return Enforce.oneOf(isAnyAssertionAndObj, shapeAndArgEmpty)
            }
        },
    }
}
