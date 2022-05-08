import { Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import { tap } from 'rxjs';

@ApiTags('App (Test)')
@Controller()
export class AppController {
  constructor(@Inject('GREETING_SERVICE') private client: ClientProxy) {}

  // @MessagePattern('notifications')
  // getNotifications(@Payload() data: number[], @Ctx() context: RmqContext) {

  // }

  // @Cron(CronExpression.EVERY_SECOND)
  async getHelloAsync() {

    // await this.client.emit('notifications', {
    //   val: 123,
    // });

    const message = this.client
      .send('notifications', {
        value: 555,
      }).subscribe();
    //

    // return message;
  }

  @Post('/publishEvent')
  async publishEvent() {
    const res = await this.getHelloAsync();

    this.client.emit('notifications', {
      val: 123,
    });
  }

  @Get('/ping')
  ping(): string {
    return 'pong';
  }
}
