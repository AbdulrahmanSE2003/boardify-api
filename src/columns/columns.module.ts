import { Module } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { ColumnsController } from './columns.controller';
import { BoardColumn } from './column.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([BoardColumn])],
  providers: [ColumnsService],
  controllers: [ColumnsController]
})
export class ColumnsModule {}
