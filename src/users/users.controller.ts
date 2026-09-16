import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from './users.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { SearchUsersDTO } from './dtos/search-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getUsers(@Query() searchUsersDTO: SearchUsersDTO) {
    return this.usersService.findUsers(searchUsersDTO);
  }

  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Patch('me')
  updateMe(@GetUser() user: User, @Body() updateUserDTO: UpdateUserDTO) {
    return this.usersService.updateUser(user.id, updateUserDTO);
  }

  @Delete('me')
  deleteMe(@GetUser() user: User) {
    return this.usersService.deleteUser(user.id);
  }
}
