import express, { type Request, type Response, type Router } from "express";
import {
  checkSchema,
  matchedData,
  validationResult,
  type Schema,
} from "express-validator";
import multer from "multer";
import type { Service } from "../service.ts";
import { authenticateToken } from "../auth.ts";
import type { Blog } from "../entities/blog.entity.ts";

async function getAllBlogs(res: Response, service: Service): Promise<void> {
  const blogs: Blog[] = await service.getAllBlogs();
  res.send(blogs);
}

const upload = multer({
  storage: multer.diskStorage({
    destination(_req, _file, cb) {
      cb(null, "./media");
    },
    filename(_req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  fileFilter(_req, file, cb) {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

const postSchema: Schema = {
  contents: {
    optional: true,
    isString: true,
    in: "body",
  },
};

const imageMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/bmp",
  "image/webp",
];
const videoMimeTypes = [
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-flv",
  "video/x-m4v",
];
const allowedMimeTypes = imageMimeTypes.concat(videoMimeTypes);

async function postBlog(
  req: Request,
  res: Response,
  service: Service,
): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).send({ errors: errors.array() });
    return;
  }

  const data = matchedData(req);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const contents: string | undefined = data.contents;
  const media = req.file;
  const isImage: boolean | undefined = media
    ? imageMimeTypes.includes(media.mimetype)
    : undefined;
  const filename: string | undefined = media?.filename;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const username: string = res.locals.username;

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  (await service.createBlog(username, contents, filename, isImage))
    ? res.sendStatus(201)
    : res.sendStatus(400);
}

const getSchema: Schema = {
  id: {
    isInt: true,
    toInt: true,
  },
};

async function getBlog(
  req: Request,
  res: Response,
  service: Service,
): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).send({ errors: errors.array() });
    return;
  }

  const data = matchedData(req);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const id: number = data.id;
  const blog = await service.getBlog(id);
  res.send(blog);
}

const putSchema: Schema = {
  id: {
    isInt: true,
    toInt: true,
  },
};

async function putBlog(
  req: Request,
  res: Response,
  service: Service,
): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).send({ errors: errors.array() });
    return;
  }

  const data = matchedData(req);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const id: number = data.id;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const contents: string | undefined = data.contents;
  const media = req.file;
  const isImage: boolean | undefined = media
    ? imageMimeTypes.includes(media.mimetype)
    : undefined;
  const filename: string | undefined = media?.filename;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const username = res.locals.username;

  const blog = await service.getBlog(id);
  if (blog?.author.username !== username) {
    res.sendStatus(403);
    return;
  }
  return service.putBlog(id, contents, filename, isImage);
}

async function removeBlog(
  req: Request,
  res: Response,
  service: Service,
): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).send({ errors: errors.array() });
    return;
  }

  const data = matchedData(req);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const id: number = data.id;

  return service.deleteBlog(id);
}

export default function blogs(service: Service): Router {
  const router: Router = express.Router();

  const getAll = (_req: Request, res: Response) => getAllBlogs(res, service);
  const post = (req: Request, res: Response) => postBlog(req, res, service);
  const get = (req: Request, res: Response) => getBlog(req, res, service);
  const put = (req: Request, res: Response) => putBlog(req, res, service);
  const remove = (req: Request, res: Response) => removeBlog(req, res, service);

  router.get("/", getAll);
  router.post(
    "/",
    authenticateToken,
    upload.single("media"),
    checkSchema(postSchema),
    post,
  );
  router.get("/:id", checkSchema(getSchema), get);
  router.put(
    "/:id",
    authenticateToken,
    upload.single("media"),
    checkSchema(putSchema),
    put,
  );
  router.delete("/:id", authenticateToken, checkSchema(getSchema), remove);

  return router;
}
