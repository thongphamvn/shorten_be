import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { AuthUser, AuthorizationGuard } from '../auth/auth.guard'
import { ShortenUrlDto, ShortenUrlParams } from './dto'
import { ShortenResponse } from './response'
import { ShortenService } from './shorten.service'

@Controller('shorten')
@UseGuards(AuthorizationGuard)
export class ShortenController {
  constructor(private readonly shorten: ShortenService) {}

  @Post()
  async create(
    @AuthUser() user: AuthUser,
    @Body() shortenUrlDto: ShortenUrlDto
  ): Promise<ShortenResponse> {
    return this.shorten.create(user, shortenUrlDto)
  }

  @Get()
  async findAll(@AuthUser() user: AuthUser): Promise<ShortenResponse[]> {
    return this.shorten.findAll(user)
  }

  @Get(':shortUrl')
  async findOne(
    @AuthUser() user: AuthUser,
    @Param() params: ShortenUrlParams
  ): Promise<ShortenResponse> {
    const shortenUrl = await this.shorten.findOne(user, params)
    return shortenUrl
  }

  @Delete(':shortUrl')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @AuthUser() user: AuthUser,
    @Param() params: ShortenUrlParams
  ): Promise<void> {
    await this.shorten.remove(user, params)
  }
}
