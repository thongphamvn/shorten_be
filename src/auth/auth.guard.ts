import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request, Response } from 'express'
import {
  InvalidTokenError,
  UnauthorizedError,
  auth,
} from 'express-oauth2-jwt-bearer'
import { promisify } from 'util'
import { AppEnv } from '../appEnv'
import { UserType } from '../types'
import { UserService } from '../user/user.service'

export type AuthUser = UserType

export const AuthUser = createParamDecorator(
  (data, ctx: ExecutionContext): AuthUser => {
    const req = ctx.switchToHttp().getRequest()
    return req.user
  }
)

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private configService: ConfigService<AppEnv>,
    private readonly user: UserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()
    const response = context.switchToHttp().getResponse<Response>()

    const validateAccessToken = promisify(
      auth({
        issuerBaseURL: this.configService.get('issuerBaseUrl'),
        audience: this.configService.get('audience'),
      })
    )

    try {
      await validateAccessToken(request, response)

      // request.auth as AuthResult will be attached to request
      const sub = request.auth.payload.sub
      const user = await this.user.onboardUser(sub)
      request['user'] = { ...user, id: user._id }

      return true
    } catch (error) {
      if (error instanceof InvalidTokenError) {
        throw new UnauthorizedException('Bad credentials')
      }

      if (error instanceof UnauthorizedError) {
        throw new UnauthorizedException('Requires authentication')
      }

      throw new InternalServerErrorException()
    }
  }
}
