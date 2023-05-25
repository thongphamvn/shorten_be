import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { AppEnv } from './appEnv'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const configService = app.get<ConfigService<AppEnv>>(ConfigService)

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

  if (configService.get('inDev')) {
    const config = new DocumentBuilder()
      .setTitle('Shorten URL APIs')
      .setDescription('Shorten URL APIs')
      .setVersion('1.0')
      .addBearerAuth()
      .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document)
  }

  const port = configService.get('port')
  await app.listen(port || 3000)

  Logger.log(`🚀 Application is running port: ${port}`)
}

bootstrap()
