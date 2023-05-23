export type ShortenUrlType = {
  displayName?: string
  originalUrl: string
  shortUrl: string
  ownerId?: string
  totalClicks?: number
}

export type UserType = {
  id: string
  sub: string
  name?: string
}

export type StatisticsType = {
  short: string
  timestamp: Date
  count: number
}
