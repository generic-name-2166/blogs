import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from "typeorm";
import { Blog } from "./blog.entity.ts";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  username!: string;
  @Column()
  hashedPassword!: string;
  @OneToMany(() => Blog, (blog) => blog.author)
  blogs!: Relation<Blog[]>;
}
