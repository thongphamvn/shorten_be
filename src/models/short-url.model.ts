import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import { ShortenUrlType } from 'src/types'
import { User } from './user.model'

export type ShortenUrlDoc = HydratedDocument<
  ShortenUrlType & {
    createdAt: Date
    updatedAt: Date
  }
>

@Schema({
  collection: 'shorten-urls',
  versionKey: false,
  timestamps: true,
  autoCreate: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id
      delete ret.__v
      return ret
    },
  },
  toObject: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id
      delete ret.__v
      return ret
    },
  },
})
export class ShortenUrl implements Omit<ShortenUrlType, 'id'> {
  @Prop({ required: true })
  originalUrl: string

  @Prop({ required: true, unique: true })
  shortUrl: string

  @Prop({ type: Types.ObjectId, ref: User.name })
  ownerId: string

  @Prop({ default: 0 })
  totalClicks: number

  @Prop({ type: String, required: false })
  displayName?: string
}

const ShortenUrlSchema = SchemaFactory.createForClass(ShortenUrl)
ShortenUrlSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

export { ShortenUrlSchema }
