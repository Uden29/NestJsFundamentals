import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from 'src/users/dto/create-user-dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';
import { Enable2FAType } from 'src/types/auth.type';
import { UpdateResult } from 'typeorm/browser';
import { ValidateTokenDTO } from './dto/validate-token.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  signup(@Body() userDTO: CreateUserDTO): Promise<User> {
    return this.userService.create(userDTO);
  }

  @Post('login')
  login(
    @Body() loginDTO: LoginDTO,
  ): Promise<
    { accessToken: string } | { validate2FA: string; message: string }
  > {
    return this.authService.login(loginDTO);
  }

  @Post('enable-2fa')
  @UseGuards(JwtAuthGuard)
  enable2FA(@Request() req): Promise<Enable2FAType> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.authService.enable2FA(req.user.userId);
  }

  @Get('disable-2fa')
  @UseGuards(JwtAuthGuard)
  disable2FA(@Request() req): Promise<UpdateResult> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.authService.disable2FA(req.user.userId as number);
  }

  @Post('validate-2fa')
  @UseGuards(JwtAuthGuard)
  validate2FA(
    @Request() req,
    @Body() validateTokenDto: ValidateTokenDTO,
  ): Promise<{ verified: boolean }> {
    return this.authService.validate2FAToken(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      req.user.userId,
      validateTokenDto.token,
    );
  }

  @Get('test')
  testEnv() {
    return this.authService.getEnvVariables();
  }
}
