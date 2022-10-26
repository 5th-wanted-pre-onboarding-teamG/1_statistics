import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  userSignup(@Body() body: CreateUserDto) {
    return this.usersService.userSignup(body);
  }

  @Delete(':id')
  removeUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.removeUserById(id);
  }
}
