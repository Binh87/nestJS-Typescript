import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private useModel: SoftDeleteModel<UserDocument>,
  ) {}
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
    return await this.useModel.find().exec();
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return { msg: `Not found user` };
    return await this.useModel.findOne({ _id: id });
  }
  async findOneByUsername(username: string) {
    return await this.useModel.findOne({ email: username });
  }
  isValidPassword(pass: string, hash: string) {
    return compareSync(pass, hash);
  }

  // async update(id: string, updateUserDto: UpdateUserDto) {
  //   if (!mongoose.Types.ObjectId.isValid(id)) return { msg: `Not update` };

  //   return await this.useModel.updateOne({ _id: id }, { ...updateUserDto });
  // }
  async update(updateUserDto: UpdateUserDto) {
    return await this.useModel.updateOne(
      { _id: updateUserDto._id },
      { ...updateUserDto },
    );
  }
  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return { msg: `Not found user` };
    return await this.useModel.softDelete({ _id: id });
  }
}
