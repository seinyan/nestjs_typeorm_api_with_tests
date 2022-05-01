import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { AppBaseEntity } from '../../app-base.entity';
import { IUser } from '../interface/user.interface';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../enums/user-role.enum';

@Entity({ name: 'users' })
export class User extends AppBaseEntity implements IUser {
  @ApiProperty()
  @Column({ type: 'bool', name: 'is_active', default: true })
  isActive: boolean;

  @ApiProperty()
  @Column({ type: 'varchar', name: 'email', unique: true, nullable: false })
  email: string;

  @ApiProperty()
  @Column({ type: 'varchar', name: 'phone', unique: true, nullable: true })
  phone: string;

  @Column({ type: 'varchar', nullable: true })
  @Exclude()
  password: string;

  @ApiProperty()
  @Column({ type: 'integer', name: 'role', default: UserRole.User })
  role: number;

  async generatePasswordHash(): Promise<string> {
    const saltOrRounds = 10;
    // const salt = await bcrypt.genSalt();
    if (!this.password) {
      this.password = this.generateRandomPassword();
    }

    this.password = await bcrypt.hash(this.password, saltOrRounds);
    return this.password;
  }

  generateRandomPassword() {
    this.password = (Math.random() + 1).toString(36).substring(7);
    return this.password;
  }
}
