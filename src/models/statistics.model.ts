import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { StatisticsType } from 'src/types'

export type StatisticsDoc = HydratedDocument<Statistics>

@Schema({
  collection: 'statistics',
  versionKey: false,
  timestamps: false,
  autoCreate: true,
})
export class Statistics implements StatisticsType {
  @Prop({ required: true })
  short: string

  @Prop({ default: 0 })
  count: number

  @Prop({ required: true })
  timestamp: Date
}

const StatisticsSchema = SchemaFactory.createForClass(Statistics)

export { StatisticsSchema }
