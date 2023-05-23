import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { UserType } from '../types'

export type UserDoc = HydratedDocument<UserType>

@Schema({
  collection: 'users',
  versionKey: false,
  timestamps: true,
  autoCreate: true,
})
export class User implements Omit<UserType, 'id'> {
  @Prop({ required: true, unique: true })
  sub: string

  @Prop({ required: false })
  name?: string
}

const UserSchema = SchemaFactory.createForClass(User)
UserSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

export { UserSchema }
