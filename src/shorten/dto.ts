import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator'

export class ShortenUrlDto {
  @IsUrl()
  @IsNotEmpty()
  originalUrl: string

  @IsString()
  @IsOptional()
  customShortUrl?: string
}

export class ShortenUrlParams {
  @IsNotEmpty()
  @IsString()
  shortUrl: string
}
