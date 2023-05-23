import { Expose } from 'class-transformer'
import { ShortenUrlType } from '../types'

export class ShortenResponse implements ShortenUrlType {
  @Expose() displayName?: string
  @Expose() originalUrl: string
  @Expose() shortUrl: string
  @Expose() createdAt: Date
  @Expose() updatedAt: Date
  @Expose() totalClicks: number
}

export class RedirectResponse {
  @Expose()
  url: string

  @Expose()
  statusCode: number
}

export class StatsResponse {
  @Expose()
  timestamp: Date

  @Expose()
  count: number
}
