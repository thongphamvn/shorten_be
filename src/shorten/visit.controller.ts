import { Controller, Get, Header, Param, Redirect } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { RedirectResponse } from './response'
import { VisitService } from './visit.service'

@Controller()
export class VisitController {
  constructor(private readonly visit: VisitService) {}

  @Throttle(3, 60)
  @Get(':shortUrl')
  @Redirect()
  @Header('Cache-Control', 'no-store')
  async findOneAndRedirect(
    @Param('shortUrl') shortUrl: string
  ): Promise<RedirectResponse> {
    return this.visit.getAndRedirect(shortUrl)
  }
}
