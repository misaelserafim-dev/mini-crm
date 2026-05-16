import Fastify from "fastify";
import { routes } from "./routes";
import cors from '@fastify/cors'
import { appErrorHandler } from './errors/errorHandler';

const port = 3333;

const app = Fastify({
  logger: true 
});

app.setErrorHandler(appErrorHandler);

app.get("/", async () => {
  return { status: "ok" };
});

app.register(routes);

app.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
})

const start = async () => {
  try 
  {
    await app.listen({ port, host: '0.0.0.0'});
    app.log.info(`Backend rodando em http://localhost:${port}`);
  }
  catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();