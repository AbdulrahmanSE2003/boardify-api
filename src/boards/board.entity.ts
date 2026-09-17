import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/users.entity';
import { BoardColumn } from '../columns/column.entity';

@Entity()
export class Board {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'New Board' })
  title: string;

  @ManyToOne(() => User, { eager: false })
  owner: User;

  @OneToMany(() => BoardColumn, (column) => column.board, { eager: false })
  columns: BoardColumn[];

  @ManyToMany(() => User, { eager: false })
  @JoinTable()
  members: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
