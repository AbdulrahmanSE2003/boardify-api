import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/users.entity';
import { BoardsService } from './boards.service';
import { CreateBoardDTO } from './dtos/create-board.dto';

@Controller('boards')
@UseGuards(JwtAuthGuard)
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Get()
  getMyBoards(@GetUser() user: User) {
    return this.boardsService.getMyBoards(user.id);
  }

  @Post()
  createBoard(@GetUser() user: User, @Body() createBoardDTO: CreateBoardDTO) {
    return this.boardsService.createBoard(user, createBoardDTO);
  }
}
