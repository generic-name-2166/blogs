import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from "typeorm";
import { User } from "./user.entity.ts";

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  id!: number;
  @CreateDateColumn()
  createdAt!: Date;
  @Column()
  contents?: string;
  @Column()
  filename?: string;
  @Column()
  isImage?: boolean;
  @ManyToOne(() => User, (user) => user.blogs)
  author!: Relation<User>;
}
