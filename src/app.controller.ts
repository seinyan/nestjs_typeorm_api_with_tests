import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('App (Test)')
@Controller()
export class AppController {
  @Get('/ping')
  ping(): string {
    return 'pong';
  }
}
