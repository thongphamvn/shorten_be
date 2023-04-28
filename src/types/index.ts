export type ShortenUrlType = {
  id: string
  originalUrl: string
  shortUrl: string
  ownerId?: string
  statistics?: Record<string, number>
  totalClicks?: number
}

export type UserType = {
  id: string
  sub: string
  name?: string
}
