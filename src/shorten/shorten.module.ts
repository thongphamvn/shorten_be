import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Statistics, StatisticsSchema } from 'src/models/statistics.model'
import { ShortenUrl, ShortenUrlSchema } from '../models/short-url.model'
import { User, UserSchema } from '../models/user.model'
import { UserModule } from '../user/user.module'
import { ShortenController } from './shorten.controller'
import { ShortenService } from './shorten.service'
import { VisitController } from './visit.controller'
import { VisitService } from './visit.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShortenUrl.name, schema: ShortenUrlSchema },
      { name: Statistics.name, schema: StatisticsSchema },
      { name: User.name, schema: UserSchema },
    ]),
    UserModule,
  ],
  controllers: [ShortenController, VisitController],
  providers: [ShortenService, VisitService],
})
export class ShortenModule {}
