import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { SearchUsersDTO } from './dtos/search-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findUsers(searchUsersDTO: SearchUsersDTO) {
    const { email } = searchUsersDTO;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) return { message: 'No such user with this email.' };

    return user;
  }

  async updateUser(id: string, updateUserDTO: UpdateUserDTO): Promise<User> {
    if (!id) throw new ConflictException('Id is required.');
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) throw new NotFoundException('User not found.');

    const newUser = Object.assign(user, updateUserDTO);

    return await this.userRepository.save(newUser);
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) throw new NotFoundException('User not found.');

    await this.userRepository.remove(user);

    return { message: 'User deleted successfully' };
  }
}
