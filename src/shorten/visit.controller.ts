import { Controller, Get, Header, Param, Redirect } from '@nestjs/common'
import { RedirectResponse } from './response'
import { VisitService } from './visit.service'

@Controller()
export class VisitController {
  constructor(private readonly visit: VisitService) {}

  @Get(':shortUrl')
  @Redirect()
  @Header('Cache-Control', 'no-store')
  async findOneAndRedirect(
    @Param('shortUrl') shortUrl: string
  ): Promise<RedirectResponse> {
    return this.visit.getAndRedirect(shortUrl)
  }
}
