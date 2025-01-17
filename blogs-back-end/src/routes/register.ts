import express, {
  type Request,
  type RequestHandler,
  type Response,
  type Router,
} from "express";
import {
  checkSchema,
  matchedData,
  validationResult,
  type Schema,
} from "express-validator";
import type { Service } from "../service.ts";
import { generateAccessToken } from "../auth.ts";

const schema: Schema = {
  username: {
    notEmpty: true,
    in: "body",
  },
  password: {
    notEmpty: true,
    in: "body",
  },
};
const renewSchema: Schema = {
  username: {
    notEmpty: true,
    in: "body",
  },
  password: {
    notEmpty: true,
    in: "body",
  },
};

async function createUser(
  req: Request,
  res: Response,
  service: Service,
): Promise<Response> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }

  const data = matchedData(req);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const username: string = data.username;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const password: string = data.password;

  if ((await service.getIdByName(username)) !== undefined) {
    return res.status(403).send({ error: "this username is already in use" });
  }

  await service.postUser(username, password);

  const token = generateAccessToken(username);

  return res.status(201).send(token);
}

async function renewUser(
  req: Request,
  res: Response,
  service: Service,
): Promise<Response> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }

  const data = matchedData(req);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const username: string = data.username;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const password: string = data.password;

  const token: string | null = await service.signIn(username, password);

  if (token === null) {
    return res.status(401).send({ error: "incorrect email or password" });
  }

  return res.status(200).send(token);
}

export default function register(service: Service): Router {
  const router: Router = express.Router();

  // type assertion due to https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871
  const renew = (async (req: Request, res: Response) =>
    void (await renewUser(req, res, service))) as RequestHandler;
  const handler = (async (req: Request, res: Response) =>
    void (await createUser(req, res, service))) as RequestHandler;

  router.post("/", checkSchema(schema), handler);
  router.post("/renew", checkSchema(renewSchema), renew);

  return router;
}
