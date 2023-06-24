import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private useModel: Model<User>) {}
  getHassPassword(password: string) {
    const salt = genSaltSync(10);
    return hashSync(password, salt);
  }
  async create(createUserDto: CreateUserDto) {
    let hassPassword = this.getHassPassword(createUserDto.password);
    let user = await this.useModel.create({
      email: createUserDto.email,
      password: hassPassword,
      name: createUserDto.name,
    });
    return user;
  }

  async findAll() {
    return await this.useModel.find().exec()
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return { msg: `Not found user` };
    return await this.useModel.findOne({ _id: id });
  }

  // async update(id: string, updateUserDto: UpdateUserDto) {
  //   if (!mongoose.Types.ObjectId.isValid(id)) return { msg: `Not update` };

  //   return await this.useModel.updateOne({ _id: id }, { ...updateUserDto });
  // }
  async update( updateUserDto: UpdateUserDto) {
    
    return await this.useModel.updateOne({ _id: updateUserDto._id }, { ...updateUserDto });
  }
  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
