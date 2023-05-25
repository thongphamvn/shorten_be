import { ApiResponseProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { ShortenUrlType } from '../types'

export class ShortenResponse implements ShortenUrlType {
  @ApiResponseProperty() @Expose() displayName?: string
  @ApiResponseProperty() @Expose() originalUrl: string
  @ApiResponseProperty() @Expose() shortUrl: string
  @ApiResponseProperty() @Expose() createdAt: Date
  @ApiResponseProperty() @Expose() updatedAt: Date
  @ApiResponseProperty() @Expose() totalClicks: number
}

export class RedirectResponse {
  @Expose()
  url: string

  @Expose()
  statusCode: number
}

export class StatsResponse {
  @Expose()
  @ApiResponseProperty()
  timestamp: Date

  @ApiResponseProperty()
  @Expose()
  count: number
}
