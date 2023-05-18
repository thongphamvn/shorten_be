import { Controller, Get } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'

@Controller()
export class AppController {
  @Get()
  @Throttle(5, 60)
  getData() {
    return 'Hello there!'
  }
}
