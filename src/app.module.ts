import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { AppController } from './app.controller'
import { appEnv } from './appEnv'
import { ShortenModule } from './shorten/shorten.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    ThrottlerModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true, load: [appEnv] }),
    MongooseModule.forRoot(appEnv().mongoUri),
    ShortenModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
