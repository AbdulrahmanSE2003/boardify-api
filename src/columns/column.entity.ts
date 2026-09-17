import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Board } from '../boards/board.entity';
import { Task } from '../tasks/tasks.entity';

@Entity()
export class BoardColumn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'New Column' })
  title: string;

  @Column({ type: 'float', default: 1000 })
  position: number;

  @ManyToOne(() => Board, (board) => board.columns)
  board: Board;

  @OneToMany(() => Task, (task) => task.column)
  tasks: Task[];
}
