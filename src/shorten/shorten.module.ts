import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ShortenUrl, ShortenUrlSchema } from '../models/short-url.model'
import { User, UserSchema } from '../models/user.model'
import { UserModule } from '../user/user.module'
import { PublicShortenController } from './public.controller'
import { ShortenController } from './shorten.controller'
import { ShortenService } from './shorten.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShortenUrl.name, schema: ShortenUrlSchema },
      { name: User.name, schema: UserSchema },
    ]),
    UserModule,
  ],
  controllers: [ShortenController, PublicShortenController],
  providers: [ShortenService],
})
export class ShortenModule {}
