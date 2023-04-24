export type ShortenUrlType = {
  id: string
  originalUrl: string
  shortUrl: string
  ownerId?: string
}

export type UserType = {
  id: string
  sub: string
  name?: string
}
