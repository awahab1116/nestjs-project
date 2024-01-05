import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './constant/customdecorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
