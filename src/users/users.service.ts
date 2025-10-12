import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from './dto/create-user-dto';
import * as bcrypt from 'bcryptjs';
import { UpdateResult } from 'typeorm/browser';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userDTO: CreateUserDTO): Promise<User> {
    const salt = await bcrypt.genSalt();
    userDTO.password = await bcrypt.hash(userDTO.password, salt);
    const user = await this.userRepository.save(userDTO);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    // delete user.password; // 5.
    return rest;
  }

  async findOne(data: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: data.email });
    if (!user) {
      throw new UnauthorizedException('Could not find user.');
    }
    return user;
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException('User not Found');
    }
    return user;
  }

  async updateSecretKey(userId, secret: string): Promise<UpdateResult> {
    return this.userRepository.update(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      { id: userId },
      {
        twoFASecret: secret,
        enable2FA: true,
      },
    );
  }

  async disable2FA(userId: number): Promise<UpdateResult> {
    return this.userRepository.update(
      { id: userId },
      {
        enable2FA: false,
        twoFASecret: null,
      },
    );
  }
}
