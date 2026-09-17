import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBoardDTO } from './dtos/create-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { AddDeleteMemberDTO } from './dtos/add-delete-member.dto';
import { UpdateBoardDTO } from './dtos/update-board.dto';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private boardsRepository: Repository<Board>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getMyBoards(userId: string) {
    const boards = await this.boardsRepository.find({
      where: { owner: { id: userId } },
    });
    return boards;
  }

  async getBoard(boardId: string) {
    const board = await this.boardsRepository.findOne({
      where: { id: boardId },
      relations: {
        members: true,
      },
    });

    if (!board)
      throw new NotFoundException(`Board with that id ${boardId} not found.`);

    return board;
  }

  async createBoard(user: User, createBoardDTO: CreateBoardDTO) {
    const { title } = createBoardDTO;
    const board = await this.boardsRepository.create({
      title,
      owner: user,
    });

    await this.boardsRepository.save(board);

    return board;
  }

  async findMember(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!user)
      throw new NotFoundException(`No such user found with this ${userId}.`);
    return user;
  }

  async addMember(boardId: string, addMemberDTO: AddDeleteMemberDTO) {
    const board = await this.boardsRepository.findOne({
      where: { id: boardId },
      relations: {
        members: true,
      },
    });
    if (!board)
      throw new NotFoundException(`Board with that id ${boardId} not found.`);

    if (board?.members.length == 5)
      throw new ConflictException('Maximum members for this board.');

    const user = await this.findMember(addMemberDTO.userId);

    const isAlreadyMember = board.members.some((m) => m.id === user.id);
    if (isAlreadyMember) {
      throw new BadRequestException('User is already a member of this board.');
    }

    board.members.push(user);
    await this.boardsRepository.save(board);
  }

  async removeMember(boardId: string, addMemberDTO: AddDeleteMemberDTO) {
    const board = await this.boardsRepository.findOne({
      where: { id: boardId },
      relations: {
        members: true,
      },
    });

    if (!board) {
      throw new NotFoundException(`Board with ID ${boardId} not found.`);
    }

    const user = await this.findMember(addMemberDTO.userId);

    board.members = board.members.filter((m) => m.id !== user.id);
    await this.boardsRepository.save(board);
  }

  async updateBoard(boardId: string, updateBoardDTO: UpdateBoardDTO) {
    const { title } = updateBoardDTO;
    const board = await this.boardsRepository.findOne({
      where: { id: boardId },
    });
    if (!board)
      throw new NotFoundException(`Board with that id ${boardId} not found.`);

    board.title = updateBoardDTO.title;

    await this.boardsRepository.save(board);
  }

  async deleteBoard(boardId: string) {
    const board = await this.boardsRepository.findOne({
      where: { id: boardId },
    });
    if (!board)
      throw new NotFoundException(`Board with that id ${boardId} not found.`);

    await this.boardsRepository.remove(board);
  }
}
