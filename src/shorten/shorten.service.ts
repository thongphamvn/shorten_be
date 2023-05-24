import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { nanoid } from 'nanoid'
import { Statistics, StatisticsDoc } from 'src/models/statistics.model'
import { toResponse } from 'src/utils/utils'
import { AuthUser } from '../auth/auth.guard'
import { ShortenUrl, ShortenUrlDoc } from '../models/short-url.model'
import {
  EditShortDto,
  ShortenUrlDto,
  ShortenUrlParams,
  StatisticsQuery,
  StatsPeriod,
} from './dto'
import { ShortenResponse, StatsResponse } from './response'

@Injectable()
export class ShortenService {
  constructor(
    @InjectModel(ShortenUrl.name) private shorten: Model<ShortenUrlDoc>,
    @InjectModel(Statistics.name) private stats: Model<StatisticsDoc>
  ) {}

  private async checkQuota(userId: string): Promise<void> {
    const count = await this.shorten.countDocuments({ ownerId: userId })
    if (count >= 10) {
      throw new BadRequestException('You have reached the quota')
    }
  }

  private async findOneOrFail(shortUrl: string, ownerId: string) {
    const short = await this.shorten.findOne({ shortUrl, ownerId })

    if (!short) {
      throw new NotFoundException('Short URL not found')
    }
    return short
  }

  async create(
    { id }: AuthUser,
    { originalUrl, customShortUrl, displayName }: ShortenUrlDto
  ): Promise<ShortenResponse> {
    if (customShortUrl) {
      await this.checkQuota(id)

      const isShortExisted = await this.shorten.findOne({
        shortUrl: customShortUrl,
      })
      if (isShortExisted) {
        throw new ConflictException('This custom url is already in used')
      }
    }

    const doc = await this.shorten.create({
      displayName,
      originalUrl,
      shortUrl: customShortUrl || nanoid(7),
      ownerId: id,
    })

    return toResponse(ShortenResponse)(doc)
  }

  async findAll(user: AuthUser): Promise<ShortenResponse[]> {
    return this.shorten
      .find({ ownerId: user.id })
      .sort({ createdAt: 'desc' })
      .then(toResponse(ShortenResponse))
  }

  async getStatistics(
    user: AuthUser,
    { shortUrl }: ShortenUrlParams,
    { period }: StatisticsQuery
  ): Promise<StatsResponse[]> {
    await this.findOneOrFail(shortUrl, user.id)

    let aggQuery
    if (period === StatsPeriod['24h']) {
      aggQuery = [
        {
          $match: {
            short: shortUrl,
            timestamp: {
              $gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $group: {
            _id: '$timestamp',
            count: { $sum: '$count' },
          },
        },
      ]
    } else {
      aggQuery = [
        {
          $match: {
            short: shortUrl,
            timestamp: {
              $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            count: { $sum: '$count' },
          },
        },
      ]
    }

    const res = await this.stats.aggregate(aggQuery)
    return res.map((i) => toResponse(StatsResponse)({ ...i, timestamp: i._id }))
  }

  async findOne(
    user: AuthUser,
    { shortUrl }: ShortenUrlParams
  ): Promise<ShortenResponse> {
    const short = await this.findOneOrFail(shortUrl, user.id)

    return toResponse(ShortenResponse)(short.toJSON())
  }

  async edit(
    user: AuthUser,
    { shortUrl }: ShortenUrlParams,
    dto: EditShortDto
  ): Promise<ShortenResponse> {
    const short = await this.findOneOrFail(shortUrl, user.id)

    await this.shorten.updateOne({ _id: short.id }, dto)
    return this.findOne(user, { shortUrl })
  }

  async remove(user: AuthUser, { shortUrl }: ShortenUrlParams): Promise<void> {
    const doc = await this.findOneOrFail(shortUrl, user.id)

    await this.shorten.deleteOne({ _id: doc.id })
  }
}
