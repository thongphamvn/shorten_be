import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class ShortenUrlDto {
  @IsUrl()
  @IsNotEmpty()
  originalUrl: string;
}

export class ShortenUrlParams {
  @IsNotEmpty()
  @IsString()
  shortUrl: string;
}
