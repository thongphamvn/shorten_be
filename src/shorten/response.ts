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

export class RedirectResponse {
  @Expose()
  url: string
}
