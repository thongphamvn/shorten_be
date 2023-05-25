import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiExcludeEndpoint } from '@nestjs/swagger'
import { Throttle, ThrottlerGuard } from '@nestjs/throttler'

@Controller()
export class AppController {
  @Get()
  @UseGuards(ThrottlerGuard)
  @ApiExcludeEndpoint()
  @Throttle(5, 60)
  getData() {
    return 'Hello there!'
  }
}
