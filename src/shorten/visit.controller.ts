import {
  Controller,
  Get,
  Header,
  Injectable,
  Param,
  Redirect,
  UseGuards,
} from '@nestjs/common'
import { Throttle, ThrottlerGuard } from '@nestjs/throttler'
import { RedirectResponse } from './response'
import { VisitService } from './visit.service'

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  getTracker(req: Record<string, string>) {
    console.log(req.ip, req.url)
    return req.ip + req.url
  }
}

@Controller()
export class VisitController {
  constructor(private readonly visit: VisitService) {}

  @UseGuards(CustomThrottlerGuard)
  @Throttle(3, 60)
  @Get(':shortUrl')
  @Redirect()
  @Header('Cache-Control', 'no-store')
  async findOneAndRedirect(
    @Param('shortUrl') shortUrl: string
  ): Promise<RedirectResponse> {
    return this.visit.getAndRedirect(shortUrl)
  }
}
