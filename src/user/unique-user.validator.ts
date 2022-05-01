import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';

@ValidatorConstraint({ name: 'UniqueValidator', async: true })
@Injectable()
export class UniqueUserValidator implements ValidatorConstraintInterface {
  constructor(protected readonly userService: UserService) {}

  async validate(value: string, args: ValidationArguments) {
    const res = await this.userService.checkUsername(value, args.object['id']);

    return !res;
  }

  defaultMessage(args: ValidationArguments) {
    return 'User is exists!';
  }
}
