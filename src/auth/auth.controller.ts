import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Request,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateUserDto, RegisterUserDto } from 'src/users/dto/create-user.dto';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Public()
  // @UseGuards(JwtAuthGuard)
  @ResponseMessage('Register a new user')
  @Post('register')
  create(@Body() registerUserDto: RegisterUserDto) {
    // @Body('email') email: string,
    // @Body('password') password: string,
    // @Body('name') name: string,
    return this.authService.register(registerUserDto);
  }
}
