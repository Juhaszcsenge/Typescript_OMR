import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Param,
  Render,
  Patch,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppService } from './app.service';
import RegisterDto from './register.dto';
import User from './user.entity';
import * as bcrypt from 'bcrypt';
import changeuserDto from './changeuser.dto';
import ChangeuserDto from './changeuser.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private dataSource: DataSource,
  ) {}

  @Get()
  @Render('index')
  index() {
    return { message: 'Welcome to the homepage' };
  }

  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    if (
      !registerDto.email ||
      !registerDto.password ||
      !registerDto.passwordAgain
    ) {
      throw new BadRequestException('All fields are required');
    }
    if (!registerDto.email.includes('@')) {
      throw new BadRequestException('Email must conatina @ character');
    }
    if (registerDto.password !== registerDto.passwordAgain) {
      throw new BadRequestException('The two password must match!');
    }
    if (registerDto.password.length < 8) {
      throw new BadRequestException(
        'The password must be at least 8 characters long',
      );
    }

    // új user beszúrása az adatbázisba Datasources
    const userRepo = this.dataSource.getRepository(User);
    const user = new User();
    user.email = registerDto.email;
    user.password = bcrypt.hash(registerDto.password, 15);
    await userRepo.save(user);

    delete user.password;

    // DB-be beszúrásmegtörtént
    const newUser = {
      id: 34,
      email: 'email@example.com',
    };
    return newUser;
  }

  @Post('/user/:id')
  async user(@Param('id') id: number, changeuserDto: ChangeuserDto) {
    if (!changeuserDto.email.includes('@')) {
      throw new BadRequestException('Email must conatin a @ character');
    }
    if (changeuserDto.profilePicturesUrl == ''){
      changeuserDto.profilePicturesUrl = '';
    }
    if (
      changeuserDto.profilePicturesUrl.includes('http') ||
      changeuserDto.profilePicturesUrl.includes('https')
    ) {
      throw new BadRequestException('Profilepictures must be linked in');
    }

    const userRepo = this.dataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id: id });
    user.email = changeuserDto.email;
    user.profilePictrueUrl = changeuserDto.profilePicturesUrl;
    await userRepo.save(user);
      
    return user;
  }
}
