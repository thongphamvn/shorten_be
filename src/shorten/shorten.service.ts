import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import {
  addMonths,
  differenceInMonths,
  format,
  startOfMonth,
  subMonths,
} from 'date-fns'
import { Model } from 'mongoose'
import { nanoid } from 'nanoid'
import { toResponse } from 'src/utils/utils'
import { AuthUser } from '../auth/auth.guard'
import { ShortenUrl, ShortenUrlDoc } from '../models/short-url.model'
import { ShortenUrlDto, ShortenUrlParams } from './dto'
import {
  RedirectResponse,
  ShortenDetailResponse,
  ShortenResponse,
} from './response'

@Injectable()
export class ShortenService {
  constructor(
    @InjectModel(ShortenUrl.name) private shorten: Model<ShortenUrlDoc>,
    private readonly config: ConfigService
  ) {}

  private async checkQuota(userId: string): Promise<void> {
    const count = await this.shorten.countDocuments({ ownerId: userId })
    if (count >= 10) {
      throw new BadRequestException('You have reached the quota')
    }
  }

  async create(
    { id }: AuthUser,
    { originalUrl, customShortUrl }: ShortenUrlDto
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

  async findOne(
    user: AuthUser,
    { shortUrl }: ShortenUrlParams
  ): Promise<ShortenResponse> {
    const short = await this.shorten.findOne({ shortUrl, ownerId: user.id })

    if (!short) {
      throw new NotFoundException('Short URL not found')
    }

    const currentMonth = startOfMonth(new Date())
    const sixMonthBefore = addMonths(new Date(currentMonth), -6)
    const createdAt = new Date(short.createdAt)

    const lastPeriod =
      createdAt > sixMonthBefore
        ? subMonths(startOfMonth(createdAt), 1)
        : sixMonthBefore

    const diffInMonth = differenceInMonths(currentMonth, lastPeriod)

    const statistics = []

    for (let i = diffInMonth - 1; i >= 0; i--) {
      const month = format(addMonths(currentMonth, -i), 'MM-yyyy')

      const count = short.statistics[month] || 0
      statistics.push({
        month,
        count,
      })
    }

    return toResponse(ShortenDetailResponse)({ ...short.toJSON(), statistics })
  }

  async remove(user: AuthUser, { shortUrl }: ShortenUrlParams): Promise<void> {
    const doc = await this.shorten.findOne({ shortUrl, ownerId: user.id })
    if (!doc) {
      throw new NotFoundException('Short URL not found')
    }

    await this.shorten.deleteOne({ _id: doc.id })
  }

  async getAndRedirect(shortUrl: string): Promise<RedirectResponse> {
    const doc = await this.shorten.findOne({ shortUrl })
    if (!doc) {
      const url = this.config.get<string>('clientOriginUrls')[0]
      return { url, statusCode: HttpStatus.PERMANENT_REDIRECT }
    }

    const month = format(new Date(), 'MM-yyyy')

    await this.shorten.updateOne(
      { shortUrl: doc.shortUrl },
      {
        $inc: {
          totalClicks: 1,
          [`statistics.${month}`]: 1,
        },
      }
    )

    return { url: doc.originalUrl, statusCode: HttpStatus.PERMANENT_REDIRECT }
  }
}
