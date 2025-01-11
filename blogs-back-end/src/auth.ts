import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";

// using bcryptjs because bcrypt's dependencies don't play well with esbuild

export function comparePassword(pass: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pass, hash);
}

export function hashPassword(password: string): Promise<string> {
  const rounds = 10;
  return bcrypt.hash(password, rounds);
}

// openssl rand -hex 32
const secret =
  "4a29d888ad4b04b6a627fd650ae1126beecd2b36771e1c1b835b35a318d20300";

export function generateAccessToken(username: string): string {
  const token = jwt.sign({ username }, secret, { expiresIn: "1h" });
  return token;
}

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;
  const token: string | undefined = authHeader?.split(" ")[1];

  if (token === undefined) {
    res.sendStatus(401);
    return;
  }

  try {
    const decoded = jwt.verify(token, secret);
    //@ts-expect-error decoded is a json string
    const username = decoded.username as string;
    res.locals.username = username;
    next();
  } catch (e) {
    console.error(e);
    res.sendStatus(403);
    return;
  }
}
