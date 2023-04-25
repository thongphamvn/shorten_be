import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { nanoid } from 'nanoid'
import { toResponse } from 'src/utils/utils'
import { AuthUser } from '../auth/auth.guard'
import { ShortenUrl, ShortenUrlDoc } from '../models/short-url.model'
import { ShortenUrlDto, ShortenUrlParams } from './dto'
import { RedirectResponse, ShortenResponse } from './response'

@Injectable()
export class ShortenService {
  constructor(
    @InjectModel(ShortenUrl.name) private shorten: Model<ShortenUrlDoc>
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
    return this.shorten
      .findOne({ shortUrl, ownerId: user.id })
      .then(toResponse(ShortenResponse))
  }

  async remove(user: AuthUser, { shortUrl }: ShortenUrlParams): Promise<void> {
    await this.shorten.findOneAndRemove({ ownerId: user.id, shortUrl })
  }

  async getAndRedirect(shortUrl: string): Promise<RedirectResponse> {
    const doc = await this.shorten.findOne({ shortUrl })
    if (!doc) {
      throw new NotFoundException('Short URL not found')
    }

    return { url: doc.originalUrl }
  }

  async publicCreate(dto: ShortenUrlDto): Promise<ShortenResponse> {
    const doc = await this.shorten.create({
      ...dto,
      shortUrl: nanoid(7),
    })

    return toResponse(ShortenResponse)(doc)
  }
}
