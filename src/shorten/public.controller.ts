import { Controller, Get, Param, Redirect } from '@nestjs/common'
import { RedirectResponse } from './response'
import { ShortenService } from './shorten.service'

@Controller()
export class PublicShortenController {
  constructor(private readonly shorten: ShortenService) {}

  @Get(':shortUrl')
  @Redirect()
  async findOneAndRedirect(
    @Param('shortUrl') shortUrl: string
  ): Promise<RedirectResponse> {
    return this.shorten.getAndRedirect(shortUrl)
  }
}
