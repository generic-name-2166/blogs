import express, { type Application } from "express";
import helmet from "helmet";
import blogs from "./routes/blogs.ts";
import register from "./routes/register.ts";
import type { Service } from "./service.ts";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

export default function initialize(service: Service): Application {
  const router = express.Router();
  router.use("/register", register(service));
  router.use("/blogs", blogs(service));
  app.use("/api", router);

  app.use("/media", express.static("media"));
  app.use(express.static("../blogs-front-end/dist"));

  return app;
}
