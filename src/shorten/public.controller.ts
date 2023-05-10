import { Controller, Get, Header, Param, Redirect } from '@nestjs/common'
import { RedirectResponse } from './response'
import { ShortenService } from './shorten.service'

@Controller()
export class PublicShortenController {
  constructor(private readonly shorten: ShortenService) {}

  @Get(':shortUrl')
  @Redirect()
  @Header('Cache-Control', 'no-store')
  async findOneAndRedirect(
    @Param('shortUrl') shortUrl: string
  ): Promise<RedirectResponse> {
    return this.shorten.getAndRedirect(shortUrl)
  }
}
