import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { addDays, format, startOfDay } from 'date-fns'
import { Model } from 'mongoose'
import { nanoid } from 'nanoid'
import { toResponse } from 'src/utils/utils'
import { AuthUser } from '../auth/auth.guard'
import { ShortenUrl, ShortenUrlDoc } from '../models/short-url.model'
import { ShortenUrlDto, ShortenUrlParams } from './dto'
import { ShortenDetailResponse, ShortenResponse } from './response'

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

    const currentDate = startOfDay(new Date())
    const statistics = []

    for (let i = 7; i >= 0; i--) {
      const day = format(addDays(currentDate, -i), 'MM-dd-yyyy')
      const count = short.statistics[day] || 0
      statistics.push({
        period: day,
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
}
