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
  @Column({ nullable: true })
  contents?: string;
  @Column({ nullable: true })
  filename?: string;
  @Column({ nullable: true })
  isImage?: boolean;
  @ManyToOne(() => User, (user) => user.blogs)
  author!: Relation<User>;
}
