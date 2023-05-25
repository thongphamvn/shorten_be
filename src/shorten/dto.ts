import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator'

export class ShortenUrlDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  displayName?: string

  @ApiProperty()
  @IsUrl()
  @IsNotEmpty()
  originalUrl: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  customShortUrl?: string
}

export class EditShortDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  displayName?: string
}

export class ShortenUrlParams {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  shortUrl: string
}

export enum StatsPeriod {
  '24h' = '24h',
  '7days' = '7days',
}

export class StatisticsQuery {
  @IsEnum(StatsPeriod)
  @IsNotEmpty()
  @ApiProperty({ enum: StatsPeriod, enumName: 'StatsPeriod' })
  period: StatsPeriod
}
