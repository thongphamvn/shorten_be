import { Controller, Get, UseGuards } from '@nestjs/common'
import { Throttle, ThrottlerGuard } from '@nestjs/throttler'

@Controller()
export class AppController {
  @Get()
  @UseGuards(ThrottlerGuard)
  @Throttle(5, 60)
  getData() {
    return 'Hello there!'
  }
}
