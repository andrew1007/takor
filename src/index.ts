import { getPojoSize } from './utils'
import TakorUtils from './TakorUtils'
import { ShapeOfMatchers, IMatcher } from './types'

export default class takor extends TakorUtils {
    /**
     * @param any
     * @description matcher that is intended to be used with an actual validator
     */
    static pojo = TakorUtils.pojo

    /**
     * @param any
     * @description matcher that is intended to be used with an actual validator
     */
    static any = TakorUtils.ANY

    /**
     * @param any
     * @description matcher that is intended to be used with an actual validator
     */
    static truthy = TakorUtils.TRUTHY

    /**
     * @param any
     * @description matcher that is intended to be used with an actual validator
     */
    static falsey = TakorUtils.FALSEY

    /**
     * @param shape pojo of one level of nesting
     * @description Checks keys of pojo. 
     * @note Nest another takor.shape if you want to assert nested keys
     */
    static shape(shape: ShapeOfMatchers) {
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

    /**
     * @param enforcedTypes arbitrary number of matchers
     * @description All elements in the Array must meet at least one matcher
     */
    static arrayOf(...enforcedTypes: IMatcher[]) {
        const allValidators = TakorUtils.createArrayValidators(enforcedTypes)
        return TakorUtils.assertOfArray(allValidators)
    }

    /**
     * @param enforcedTypes arbitrary number of matchers
     * @description All elements in the Set must meet at least one matcher
     */
    static setOf(...enforcedTypes: IMatcher[]) {
        const allValidators = (enforcedTypes).map(el => TakorUtils.getValidator(el))
        return (set: any) => {
            if (takor.not.is(Set)(set)) {
                return false
            }
            return TakorUtils.assertOfArray(allValidators)([...set])
        }
    }

    /**
     * @param enforcedTypes arbitrary number of tuple matchers for [key, value]
     * @description All elements in the Map must meet at least one matcher
     */
    static mapOf(...enforcedTypes: [IMatcher, IMatcher][]) {
        let allValidators
        try {
            allValidators = TakorUtils.createMapValidators(enforcedTypes)
        } catch {
            return () => false;
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

    /**
     * @param enforcedType single matcher
     * @description Element must meet that one single matcher
     */
    static is(enforcedType: IMatcher) {
        const validator = TakorUtils.getValidator(enforcedType)
        return (el: any) => validator(el)
    }

    /**
     * @param enforcedTypes arbitrary number of matchers
     * @description The element checked must meet at least one of the matchers
     */
    static oneOf(...enforcedTypes: IMatcher[]) {
        const allValidators = TakorUtils.createArrayValidators(enforcedTypes)
        return TakorUtils.ensure.some(allValidators)
    }

    /**
     * @param enforcedTypes arbitrary number of matchers
     * @description The element checked must meet _every_ matcher
     * @note If the list of matchers contradict each other, it will always return false
     */
    static allOf(...enforcedTypes: IMatcher[]) {
        const allValidators = TakorUtils.createArrayValidators(enforcedTypes)
        return TakorUtils.ensure.every(allValidators)
    }

    static not = {
        /**
         * @param enforcedTypes arbitrary number of matchers
         * @description converse of setOf
         */
        setOf(...enforcedTypes: IMatcher[]) {
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
        /**
         * @param enforcedTypes arbitrary number of tuple matchers for [key, value]
         * @description converse of mapOf
         */
        mapOf(...enforcedTypes: [IMatcher, IMatcher][]) {
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
        /**
         * @param enforcedType single matcher
         * @description converse of is
         */
        is: (enforcedType: IMatcher) => {
            const validator = TakorUtils.getValidator(enforcedType)
            return (element: any) => !validator(element)
        },
        /**
         * @param enforcedTypes arbitrary number of matchers
         * @description converse of oneOf
         */
        oneOf: (...enforcedTypes: IMatcher[]) => {
            const allValidators = TakorUtils.createArrayValidators(enforcedTypes)
            return TakorUtils.ensure.not.every(allValidators)
        },
        /**
         * @param enforcedTypes arbitrary number of matchers
         * @description converse of arrayOf
         */
        arrayOf: (...enforcedTypes: IMatcher[]) => {
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
        /**
         * @param shape pojo of one level of nesting
         * @description converse of shape
         * @note Nest another takor.shape if you want to assert nested keys
         */
        shape: (shape: ShapeOfMatchers = {}) => {
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
