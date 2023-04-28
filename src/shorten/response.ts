import { Expose, Transform } from 'class-transformer'
import { ShortenUrlType } from '../types'

export class ShortenResponse implements ShortenUrlType {
  @Expose()
  id: string

  @Expose()
  originalUrl: string

  @Expose()
  shortUrl: string
}

export class SHortenDetailResponse extends ShortenResponse {
  @Expose()
  createdAt: Date

  @Expose()
  updatedAt: Date

  @Expose()
  totalClicks: number

  @Expose()
  @Transform(({ key, obj }) => {
    return obj?.[key]
  })
  statistics: Record<string, number>
}

export class RedirectResponse {
  @Expose()
  url: string

  @Expose()
  statusCode: number
}
