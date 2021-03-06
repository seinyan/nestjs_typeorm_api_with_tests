import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { UniqueUserValidator } from './unique-user.validator';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticeModule } from '../notice/notice.module';
import { UserPublicController } from './user-public.controller';
import { UserCurrentController } from './user-current.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User]), NoticeModule],
  controllers: [UserPublicController, UserCurrentController, UserController],
  providers: [UserService, UniqueUserValidator],
  exports: [UserService],
})
export class UserModule {}
