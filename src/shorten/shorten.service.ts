import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { nanoid } from 'nanoid'
import { AuthUser } from '../auth/auth.guard'
import { ShortenUrl, ShortenUrlDoc } from '../models/short-url.model'
import { ShortenUrlDto, ShortenUrlParams } from './dto'
import { RedirectResponse, ShortenResponse } from './response'
import { toResponse } from 'src/utils/utils'

@Injectable()
export class ShortenService {
  constructor(
    @InjectModel(ShortenUrl.name) private shorten: Model<ShortenUrlDoc>
  ) {}

  async create({ id }: AuthUser, dto: ShortenUrlDto): Promise<ShortenResponse> {
    const doc = await this.shorten.create({
      ...dto,
      shortUrl: nanoid(7),
      ownerId: id,
    })

    return toResponse(ShortenResponse)(doc)
  }

  async findAll(user: AuthUser): Promise<ShortenResponse[]> {
    return this.shorten
      .find({ ownerId: user.id })
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

    return { url: doc.originalUrl, statusCode: HttpStatus.PERMANENT_REDIRECT }
  }

  async publicCreate(dto: ShortenUrlDto): Promise<ShortenResponse> {
    const doc = await this.shorten.create({
      ...dto,
      shortUrl: nanoid(7),
    })
    console.log(doc)
    return toResponse(ShortenResponse)(doc)
  }
}
