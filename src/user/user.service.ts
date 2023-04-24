import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDoc } from '../models/user.model'

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private user: Model<UserDoc>) {}

  async onboardUser(sub: string): Promise<UserDoc> {
    const existedUser = await this.user.findOne({ sub })
    if (existedUser) {
      return existedUser
    }

    return this.user.create({ sub })
  }
}
