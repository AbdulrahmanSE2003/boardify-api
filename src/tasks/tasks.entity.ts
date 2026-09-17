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
import { Comment } from '../comments/comment.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToMany(() => User)
  @JoinTable()
  assigningTo: User[];

  @Column({ type: 'float', default: 1000 })
  position: number;

  @ManyToOne(() => BoardColumn, (column) => column.tasks)
  column: BoardColumn;

  @OneToMany(() => Comment, (comment) => comment.task, { eager: false })
  comments: Comment[];

  @Column('text', { nullable: true, array: true })
  labels: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
