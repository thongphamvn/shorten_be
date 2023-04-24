import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller'
import { appEnv } from './appEnv'
import { ShortenModule } from './shorten/shorten.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appEnv] }),
    MongooseModule.forRoot(appEnv().mongoUri),
    ShortenModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
