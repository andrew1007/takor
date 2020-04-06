import { ShapeOfMatchers } from './types'

export function getPojoSize(obj: ShapeOfMatchers) {
    return Object.keys(obj as any).length
}
