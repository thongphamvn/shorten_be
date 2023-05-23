import { HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { startOfHour } from 'date-fns'
import { Model } from 'mongoose'
import { Statistics, StatisticsDoc } from 'src/models/statistics.model'
import { ShortenUrl, ShortenUrlDoc } from '../models/short-url.model'
import { RedirectResponse } from './response'

@Injectable()
export class VisitService {
  constructor(
    @InjectModel(ShortenUrl.name) private shorten: Model<ShortenUrlDoc>,
    @InjectModel(Statistics.name) private stats: Model<StatisticsDoc>,
    private readonly config: ConfigService
  ) {}

  async getAndRedirect(shortUrl: string): Promise<RedirectResponse> {
    const doc = await this.shorten.findOne({ shortUrl })
    if (!doc) {
      const url = this.config.get<string>('clientOriginUrls')[0]
      return { url, statusCode: HttpStatus.PERMANENT_REDIRECT }
    }

    const updateTotal = this.shorten.updateOne(
      { shortUrl: doc.shortUrl },
      {
        $inc: {
          totalClicks: 1,
        },
      }
    )

    const updateStats = this.stats.updateOne(
      {
        short: shortUrl,
        timestamp: startOfHour(new Date()),
      },
      {
        $inc: { count: 1 },
      },
      { upsert: true }
    )

    await Promise.all([updateTotal, updateStats])

    return { url: doc.originalUrl, statusCode: HttpStatus.PERMANENT_REDIRECT }
  }
}
