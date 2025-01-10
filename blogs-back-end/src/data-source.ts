// for typeorm
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/user.entity.ts";
import { Blog } from "./entities/blog.entity.ts";

const appDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "blogs",
  synchronize: true,
  logging: false,
  entities: [Blog, User],
  subscribers: [],
  migrations: [],
});

await appDataSource.initialize();

export const userRepository = appDataSource.getRepository(User);
export const blogRepository = appDataSource.getRepository(Blog);
