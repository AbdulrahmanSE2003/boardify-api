import { Injectable } from '@nestjs/common';
import { CreateBoardDTO } from './dtos/create-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private boardsRepository: Repository<Board>,
  ) {}

  async getMyBoards(userId: string) {
    const boards = await this.boardsRepository.find({
      where: { owner: { id: userId } },
    });
    return boards;
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
}
