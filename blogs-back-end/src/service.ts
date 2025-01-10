import type { Repository } from "typeorm";
import { User } from "./entities/user.entity.ts";
import { comparePassword, generateAccessToken, hashPassword } from "./auth.ts";
import type { Blog } from "./entities/blog.entity.ts";

export interface Service {
  getIdByName(username: string): Promise<number | undefined>;
  postUser(username: string, password: string): Promise<void>;
  /**
   * @returns token of the signed in user or null if user wasn't found
   */
  signIn(username: string, password: string): Promise<string | null>;
  getAllBlogs(): Promise<Blog[]>;
  /**
   * @returns success (true) or failure (false)
   */
  createBlog(
    authorName: string,
    contents?: string,
    filename?: string,
    isImage?: boolean,
  ): Promise<boolean>;
  getBlog(id: number): Promise<Blog | null>;
  putBlog(
    id: number,
    contents?: string,
    filename?: string,
    isImage?: boolean,
  ): Promise<void>;
  deleteBlog(id: number): Promise<void>;
}

export class RealService implements Service {
  constructor(
    private userRepository: Repository<User>,
    private blogRepository: Repository<Blog>,
  ) {}

  async getIdByName(username: string): Promise<number | undefined> {
    const user = await this.userRepository.findOneBy({ username });
    return user?.id;
  }

  async postUser(username: string, password: string): Promise<void> {
    const hashedPassword = await hashPassword(password);
    await this.userRepository.save([
      {
        username,
        hashedPassword,
      },
    ]);
  }

  private getUserByName(username: string): Promise<User | null> {
    return this.userRepository.findOneBy({ username });
  }

  async signIn(username: string, pass: string): Promise<string | null> {
    const user: User | null = await this.getUserByName(username);

    if (user === null || !(await comparePassword(pass, user?.hashedPassword))) {
      return null;
    }
    return generateAccessToken(username);
  }

  getAllBlogs(): Promise<Blog[]> {
    return this.blogRepository.find();
  }

  async createBlog(
    authorName: string,
    contents?: string,
    filename?: string,
    isImage?: boolean,
  ): Promise<boolean> {
    const author = await this.userRepository.findOneBy({
      username: authorName,
    });
    if (!author) {
      return false;
    }
    await this.blogRepository.save([
      {
        author,
        contents,
        filename,
        isImage,
      },
    ]);
    return true;
  }

  getBlog(id: number): Promise<Blog | null> {
    return this.blogRepository.findOneBy({ id });
  }

  async putBlog(
    id: number,
    contents?: string,
    filename?: string,
    isImage?: boolean,
  ): Promise<void> {
    await this.blogRepository.save([
      {
        id,
        contents,
        filename,
        isImage,
      },
    ]);
  }

  async deleteBlog(id: number): Promise<void> {
    await this.blogRepository.delete(id);
  }
}
