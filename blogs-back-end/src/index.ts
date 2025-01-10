import initialize from "./app.ts";
import { blogRepository, userRepository } from "./data-source.ts";
import { RealService, type Service } from "./service.ts";

const service: Service = new RealService(userRepository, blogRepository);
const port = 3000;

const app = initialize(service);

const server = app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

server.on("error", console.error);
