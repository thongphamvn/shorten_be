import { Body, Controller, Get, Param, Post, Redirect } from '@nestjs/common'
import { ShortenUrlDto } from './dto'
import { RedirectResponse, ShortenResponse } from './response'
import { ShortenService } from './shorten.service'

@Controller('p')
export class PublicShortenController {
  constructor(private readonly shorten: ShortenService) {}

  @Post('shorten')
  async create(@Body() shortenUrlDto: ShortenUrlDto): Promise<ShortenResponse> {
    return this.shorten.publicCreate(shortenUrlDto)
  }

  @Get(':shortUrl')
  @Redirect()
  async findOne(
    @Param('shortUrl') shortUrl: string
  ): Promise<RedirectResponse> {
    return this.shorten.getAndRedirect(shortUrl)
  }
}
