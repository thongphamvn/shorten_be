import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { AppEnv } from './appEnv'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const configService = app.get<ConfigService<AppEnv>>(ConfigService)

  //
  const globalPrefix = 'api'
  app.setGlobalPrefix(globalPrefix)

  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: true,
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  )

  app.enableCors({
    origin: configService.get<string>('clientOriginUrls'),
    methods: ['*'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    maxAge: 86400,
  })

  const port = configService.get('port')
  await app.listen(port || 3000)

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  )
}

bootstrap()
