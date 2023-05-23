import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { AuthUser, AuthorizationGuard } from '../auth/auth.guard'
import {
  EditShortDto,
  ShortenUrlDto,
  ShortenUrlParams,
  StatisticsQuery,
} from './dto'
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

  @Get(':shortUrl/stats')
  async getStatistics(
    @AuthUser() user: AuthUser,
    @Param() params: ShortenUrlParams,
    @Query() query: StatisticsQuery
  ): Promise<any> {
    return this.shorten.getStatistics(user, params, query)
  }

  @Put(':shortUrl')
  async update(
    @AuthUser() user: AuthUser,
    @Param() params: ShortenUrlParams,
    @Body() shortenUrlDto: EditShortDto
  ): Promise<ShortenResponse> {
    return this.shorten.edit(user, params, shortenUrlDto)
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
