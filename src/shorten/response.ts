import { Expose } from 'class-transformer'
import { ShortenUrlType } from '../types'

export class ShortenResponse implements ShortenUrlType {
  @Expose()
  id: string

  @Expose()
  originalUrl: string

  @Expose()
  shortUrl: string
}

export class Statistics {
  @Expose()
  month: string

  @Expose()
  count: number
}

export class ShortenDetailResponse extends ShortenResponse {
  @Expose()
  createdAt: Date

  @Expose()
  updatedAt: Date

  @Expose()
  totalClicks: number

  @Expose()
  statistics: Statistics
}

export class RedirectResponse {
  @Expose()
  url: string

  @Expose()
  statusCode: number
}
