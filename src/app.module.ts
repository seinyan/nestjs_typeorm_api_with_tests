import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemModule } from './item/item.module';
import { NoticeModule } from './notice/notice.module';
import { AuthModule } from './auth/auth.module';
// @ts-ignore
import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { BullModule } from '@nestjs/bull';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.dev', '.env.test', '.env'],
      expandVariables: true,
      isGlobal: true,
      cache: false,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          // url: configService.get<number>('DATABASE_URL'),
          type: 'postgres',
          host: configService.get('DATABASE_HOST', '127.0.0.1'),
          port: configService.get<number>('DATABASE_PORT', 5432),
          username: configService.get('DATABASE_USER', ''),
          password: configService.get('DATABASE_PASS', ''),
          database: configService.get('DATABASE_NAME', ''),
          entities: ['dist/**/*.entity{.ts,.js}'],
          synchronize: true, // sync db  -> create tables
          autoLoadEntities: true,
          logging: false,
        };
      },
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: configService.get('MAILER_TRANSPORT'),
        // transport: {
        //   host: process.env.MAILER_HOST || 'localhost',
        //   // port: parseInt(process.env.SMTP_PORT, 10) || 1025,
        //   secure: process.env.SMTP_SECURE === 'true',
        //   ignoreTLS: process.env.SMTP_SECURE !== 'false',
        //   auth: {
        //     user: process.env.MAILER_USER || 'username',
        //     pass: process.env.MAILER_PASS || 'password',
        //   },
        // },
        defaults: {
          from: configService.get('EMAIL_NORELY'),
        },
        template: {
          // dir: process.cwd() + '/templates/emails/',
          dir: join(__dirname, './templates/emails/'),
          adapter: new HandlebarsAdapter(), // or new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          ttl: configService.get('CACHE_TTL', 5),
          isGlobal: true,
          store: redisStore,
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379),
          // socket: {
          //   host: configService.get('REDIS_HOST', ''),
          //   port: configService.get('REDIS_PORT', 6379),
          // },
        };
      },
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379),
        },
      }),
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        name: 'GREETING_SERVICE',
        useFactory: async (configService: ConfigService) => ({
          name: 'GREETING_SERVICE',
          transport: Transport.RMQ,
          options: {
            urls: [configService.get('RABBITMQ_URL').toString()],
            queue: 'cats_queue_1',
            noAck: false,
            queueOptions: {
              durable: false,
            },
          },
        }),
      },
    ]),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    NoticeModule,
    ItemModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}

// SequelizeModule.forRootAsync({
//   imports: [ConfigModule],
//   inject: [ConfigService],
//   useFactory: async (configService: ConfigService) => ({
//     dialect: 'postgres',
//     host: configService.get('DATABASE_HOST', 'localhost'),
//     port: configService.get<number>('DATABASE_PORT', 5432),
//     username: configService.get('DATABASE_USER', 'postgres'),
//     password: configService.get('DATABASE_PASS', 'postgres'),
//     database: configService.get('DATABASE_NAME', 'db_name'),
//     // logging: true,
//     synchronize: true,
//     autoLoadModels: true,
//     models: [],
//     repositoryMode: true,
//   }),
// }),

// TypeOrmModule.forRoot({
//   type: 'postgres',
//   host: '127.0.0.1',
//   port: 5432,
//   username: 'postgres',
//   password: '8888',
//   database: 'nest_api',
//   entities: ['dist/**/*.entity{.ts,.js}'],
//   synchronize: true, // sync db  -> create tables
//   autoLoadEntities: true,
//   logging: false,
// }),

// ClientsModule.register([
//   {
//     name: 'GREETING_SERVICE',
//     transport: Transport.RMQ,
//     options: {
//       urls: ['amqp://localhost:5672'],
//       queue: 'cats_queue_1',
//       noAck: false,
//       queueOptions: {
//         durable: false,
//       },
//     },
//   },
// ]),
