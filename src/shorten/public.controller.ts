import { Controller, Get, Param } from '@nestjs/common'
import { RedirectResponse } from './response'
import { ShortenService } from './shorten.service'

@Controller('p')
export class PublicShortenController {
  constructor(private readonly shorten: ShortenService) {}

  // @Post('shorten')
  // async create(@Body() shortenUrlDto: ShortenUrlDto): Promise<ShortenResponse> {
  //   return this.shorten.publicCreate(shortenUrlDto)
  // }

  @Get(':shortUrl')
  async findOne(
    @Param('shortUrl') shortUrl: string
  ): Promise<RedirectResponse> {
    return this.shorten.getAndRedirect(shortUrl)
  }
}
