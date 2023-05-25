import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { AuthUser, AuthorizationGuard } from '../auth/auth.guard'
import {
  EditShortDto,
  ShortenUrlDto,
  ShortenUrlParams,
  StatisticsQuery,
} from './dto'
import { ShortenResponse, StatsResponse } from './response'
import { ShortenService } from './shorten.service'

@Controller('shorten')
@ApiTags('Config')
@UseGuards(AuthorizationGuard)
export class ShortenController {
  constructor(private readonly shorten: ShortenService) {}

  @Post()
  @ApiOkResponse({ type: ShortenResponse })
  async create(
    @AuthUser() user: AuthUser,
    @Body() shortenUrlDto: ShortenUrlDto
  ): Promise<ShortenResponse> {
    return this.shorten.create(user, shortenUrlDto)
  }

  @Get()
  @ApiOkResponse({ type: ShortenResponse, isArray: true })
  async findAll(@AuthUser() user: AuthUser): Promise<ShortenResponse[]> {
    return this.shorten.findAll(user)
  }

  @Get(':shortUrl')
  @ApiOkResponse({ type: ShortenResponse })
  async findOne(
    @AuthUser() user: AuthUser,
    @Param() params: ShortenUrlParams
  ): Promise<ShortenResponse> {
    const shortenUrl = await this.shorten.findOne(user, params)
    return shortenUrl
  }

  @ApiOkResponse({ type: StatsResponse, isArray: true })
  @Get(':shortUrl/stats')
  async getStatistics(
    @AuthUser() user: AuthUser,
    @Param() params: ShortenUrlParams,
    @Query() query: StatisticsQuery
  ): Promise<StatsResponse[]> {
    return this.shorten.getStatistics(user, params, query)
  }

  @Put(':shortUrl')
  @ApiOkResponse({ type: ShortenResponse })
  async update(
    @AuthUser() user: AuthUser,
    @Param() params: ShortenUrlParams,
    @Body() shortenUrlDto: EditShortDto
  ): Promise<ShortenResponse> {
    return this.shorten.edit(user, params, shortenUrlDto)
  }

  @ApiNoContentResponse()
  @Delete(':shortUrl')
  async delete(
    @AuthUser() user: AuthUser,
    @Param() params: ShortenUrlParams
  ): Promise<void> {
    await this.shorten.remove(user, params)
  }
}
