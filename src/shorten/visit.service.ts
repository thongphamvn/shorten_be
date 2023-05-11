import { HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { format } from 'date-fns'
import { Model } from 'mongoose'
import { ShortenUrl, ShortenUrlDoc } from '../models/short-url.model'
import { RedirectResponse } from './response'

@Injectable()
export class VisitService {
  constructor(
    @InjectModel(ShortenUrl.name) private shorten: Model<ShortenUrlDoc>,
    private readonly config: ConfigService
  ) {}

  async getAndRedirect(shortUrl: string): Promise<RedirectResponse> {
    const doc = await this.shorten.findOne({ shortUrl })
    if (!doc) {
      const url = this.config.get<string>('clientOriginUrls')[0]
      return { url, statusCode: HttpStatus.PERMANENT_REDIRECT }
    }

    const day = format(new Date(), 'MM-dd-yyyy')

    await this.shorten.updateOne(
      { shortUrl: doc.shortUrl },
      {
        $inc: {
          totalClicks: 1,
          [`statistics.${day}`]: 1,
        },
      }
    )

    return { url: doc.originalUrl, statusCode: HttpStatus.PERMANENT_REDIRECT }
  }
}
