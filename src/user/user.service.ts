import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PaginateQueryUserDto } from './dto/paginate-query-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paginate } from '../paginate';
import { PaginateResultUser } from './paginate/paginate-result-user.';
import { NoticeService } from '../notice/notice.service';
import { UpdatePasswordUserDto } from './dto/update-password-user.dto';
import { RestoreUserDto } from './dto/restore-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private repository: Repository<User>,
    private readonly noticeService: NoticeService,
  ) {}

  async checkUsername(username: string, id: number = null): Promise<boolean> {
    const user: User = await this.repository.findOne({
      where: { email: username },
    });

    if (user) {
      if (user.id == id) {
        return false;
      }
      return true;
    }

    return false;
  }

  async findByUsername(username: string): Promise<User> {
    return await this.repository.findOne({ where: { email: username } });
  }

  async register(dto: CreateUserDto): Promise<User> {
    const password = dto.password;
    const user: User = this.repository.create(dto);
    await user.generatePasswordHash();
    await this.repository.save(user);

    await this.noticeService.addEmailNotice(
      user.email,
      'Thank you for registering',
      'user/register.hbs',
      {
        id: user.id,
        username: user.email,
        password: password,
        msg: 'Thank you for registering',
      },
    );

    return user;
  }

  async restore(dto: RestoreUserDto): Promise<boolean> {
    const user: User = await this.findByUsername(dto.username);
    if (user) {
      const password = user.generateRandomPassword();
      await user.generatePasswordHash();
      await this.repository.update(user.id, { password: user.password });

      await this.noticeService.addEmailNotice(
        user.email,
        'Restore password',
        'user/restore.hbs',
        {
          id: user.id,
          username: user.email,
          password: password,
          msg: 'Restore password',
        },
      );

      return true;
    }

    return false;
  }

  async paginate(dto: PaginateQueryUserDto): Promise<PaginateResultUser> {
    return await Paginate(this.repository.createQueryBuilder('c'), dto);
  }

  async findOne(id: number): Promise<User> {
    return await this.repository.findOne(id);
  }

  async updatePassword(
    id: number,
    dto: UpdatePasswordUserDto,
  ): Promise<number> {
    const { affected } = await this.repository.update(id, dto);

    return affected;
  }

  async update(id: number, dto: UpdateUserDto): Promise<number> {
    const { affected } = await this.repository.update(id, dto);

    return affected;
  }

  async remove(id: number): Promise<number> {
    const { affected } = await this.repository.delete(id);

    return affected;
  }
}
