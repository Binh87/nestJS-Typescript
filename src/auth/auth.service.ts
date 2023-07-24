import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { UsersService } from 'src/users/users.service';

import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { CreateUserDto, RegisterUserDto } from 'src/users/dto/create-user.dto';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { log } from 'console';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    
  ) {}
  getHassPassword(password: string) {
    const salt = genSaltSync(10);
    return hashSync(password, salt);
  }
  // username and pass la 2 tham so thu vien passport nem ve
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      let isValid = this.usersService.isValidPassword(pass, user.password);
      if (isValid) {
        return user;
      }
    }

    return null;
  }
  async login(user: IUser) {
    const { _id, name, email, role } = user;
    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id,
      name,
      email,
      role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      _id,
      name,
      email,
      role,
    };
  }
  async register(user: RegisterUserDto) {
   
    let newUser = await this.usersService.register(user);

    return { _id: newUser?._id, createdAt: newUser?.createdAt };
  }
}
