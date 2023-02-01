import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Render,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppService } from './app.service';
import RegisterDto from './register.dto';

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
  register(@Body() registerDto: RegisterDto) {
    if (!registerDto.email.includes('@')) {
      throw new BadRequestException('Email must conatina @ character');
    }
    if (registerDto.password !== registerDto.passwordAgain) {
      throw new BadRequestException('The two password must match!');
    }
    if (registerDto.password.length < 8) {
      throw new BadRequestException('The password must be at least 8 characters long');
    }
  }
}
