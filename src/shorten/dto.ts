import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator'

export class ShortenUrlDto {
  @IsString()
  @IsOptional()
  displayName?: string

  @IsUrl()
  @IsNotEmpty()
  originalUrl: string

  @IsString()
  @IsOptional()
  customShortUrl?: string
}

export class EditShortDto {
  @IsString()
  @IsOptional()
  displayName?: string
}

export class ShortenUrlParams {
  @IsNotEmpty()
  @IsString()
  shortUrl: string
}

export enum StatsPeriod {
  '24h' = '24h',
  '7days' = '7days',
}
export class StatisticsQuery {
  @IsEnum(StatsPeriod)
  @IsNotEmpty()
  period: StatsPeriod
}
