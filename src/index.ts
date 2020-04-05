import { getPojoSize } from './utils'
import TakorUtils from './TakorUtils'
import { ShapeArg, IValidEnforcerArgs } from './types'

export default class takor extends TakorUtils {
    static pojo = TakorUtils.pojo
    static any = TakorUtils.ANY
    static truthy = TakorUtils.TRUTHY
    static falsey = TakorUtils.FALSEY

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
            return TakorUtils.ensure.matchShape({ shape, arg })
        }

        function makeAutomaticallyGoodArg(shape) {
            const isPojo = takor.is(TakorUtils.pojo)
            const isAny = () => shape === TakorUtils.ANY
            return takor.allOf(isPojo, isAny)
        }
        function makeNotArgToAssert() {
            const shapeEmptyButArgPopulated = (arg: any) => shapeSize === 0 && Object.values(arg).length > 0
            const isPojo = takor.is(TakorUtils.pojo)
            const notPojo = takor.not.is(isPojo)
            return takor.oneOf(notPojo, shapeEmptyButArgPopulated)
        }
    }

    static arrayOf(...enforcedTypes: IValidEnforcerArgs[]) {
        const allValidators = TakorUtils.createArrayValidators(enforcedTypes)
        return TakorUtils.assertOfArray(allValidators)
    }

    static setOf(...enforcedTypes: IValidEnforcerArgs[]) {
        const allValidators = (enforcedTypes).map(el => TakorUtils.getValidator(el))
        return (set: any) => {
            if (takor.not.is(Set)(set)) {
                return false
            }
            return TakorUtils.assertOfArray(allValidators)([...set])
        }
    }

    static mapOf(...enforcedTypes: [IValidEnforcerArgs, IValidEnforcerArgs][]) {
        let allValidators
        try {
            allValidators = TakorUtils.createMapValidators(enforcedTypes)
        } catch {
            return () => true
        }

        return (map: any) => {
            if (takor.not.is(Map)(map)) {
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
        const validator = TakorUtils.getValidator(enforcedType)
        return (el: any) => validator(el)
    }

    static oneOf(...enforcedTypes: IValidEnforcerArgs[]) {
        const allValidators = TakorUtils.createArrayValidators(enforcedTypes)
        return TakorUtils.ensure.some(allValidators)
    }

    static allOf(...enforcedTypes: IValidEnforcerArgs[]) {
        const allValidators = TakorUtils.createArrayValidators(enforcedTypes)
        return TakorUtils.ensure.every(allValidators)
    }

    static not = {
        setOf(...enforcedTypes: IValidEnforcerArgs[]) {
            const allValidators = TakorUtils.createArrayValidators(enforcedTypes)
            return (set: any) => {
                if (takor.not.is(Set)(set)) {
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
                allValidators = TakorUtils.createMapValidators(enforcedTypes)
            } catch {
                return () => true
            }
            return (map: any) => {
                if (takor.not.is(Map)(map)) {
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
            const validator = TakorUtils.getValidator(enforcedType)
            return (element: any) => !validator(element)
        },
        oneOf: (...enforcedTypes: IValidEnforcerArgs[]) => {
            const allValidators = TakorUtils.createArrayValidators(enforcedTypes)
            return TakorUtils.ensure.not.every(allValidators)
        },
        arrayOf: (...enforcedTypes: IValidEnforcerArgs[]) => {
            const allValidators = TakorUtils.createArrayValidators(enforcedTypes)

            return (array: any) => {
                if (takor.not.is(Array)(array)) {
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

            const notPojo = takor.not.is(TakorUtils.pojo)
            const notArgToAssert = makeNotArgToAssert()
            return (arg: any) => {
                try {
                    if (notPojo(arg)) {
                        return true
                    }
                    if (notArgToAssert(arg)) {
                        return false
                    }
                    return TakorUtils.ensure.not.matchShape({ shape, arg })
                } catch {
                    return true
                }
            }

            function makeNotArgToAssert() {
                const shapeAndArgEmpty = arg => shapeSize === 0 && Object.values(arg).length === 0
                return takor.oneOf(shapeAndArgEmpty)
            }
        },
    }
}
