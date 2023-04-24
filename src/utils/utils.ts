import {
  ClassConstructor,
  ClassTransformOptions,
  plainToInstance,
} from 'class-transformer'

export const toResponse =
  (Cls: ClassConstructor<any>, opts: ClassTransformOptions = {}) =>
  (data: unknown) =>
    plainToInstance(Cls, data, { ...opts, excludeExtraneousValues: true })
