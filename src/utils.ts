import { ShapeArg } from './types'

export function getPojoSize(obj: ShapeArg) {
    return Object.keys(obj as any).length
}
