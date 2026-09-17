import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/users.entity';
import { BoardsService } from './boards.service';
import { CreateBoardDTO } from './dtos/create-board.dto';
import { AddDeleteMemberDTO } from './dtos/add-delete-member.dto';
import { UpdateBoardDTO } from './dtos/update-board.dto';

@Controller('boards')
@UseGuards(JwtAuthGuard)
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  getMyBoards(@GetUser() user: User) {
    return this.boardsService.getMyBoards(user.id);
  }

  @Get(':id')
  getBoard(@Param('id') id: string) {
    return this.boardsService.getBoard(id);
  }

  @Post()
  createBoard(@GetUser() user: User, @Body() createBoardDTO: CreateBoardDTO) {
    return this.boardsService.createBoard(user, createBoardDTO);
  }

  @Patch('/:id/members')
  addMember(
    @Param('id') id: string,
    @Body() addDeleteMemberDTO: AddDeleteMemberDTO,
  ) {
    return this.boardsService.addMember(id, addDeleteMemberDTO);
  }

  @Patch('/:id')
  updateBoard(@Param('id') id: string, @Body() updateBoardDTO: UpdateBoardDTO) {
    return this.boardsService.updateBoard(id, updateBoardDTO);
  }

  @Delete("/:id")
  deleteBoard(@Param('id') id:string){
    return this.boardsService.deleteBoard(id)
  }

  @Delete('/:id/members')
  removeMember(
    @Param('id') id: string,
    @Body() addDeleteMemberDTO: AddDeleteMemberDTO,
  ) {
    return this.boardsService.removeMember(id, addDeleteMemberDTO);
  }
}
