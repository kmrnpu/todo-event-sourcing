import Fastify from "fastify";
import { CreateTodoCommand } from "./domain/todo/workflows/creation/types";
import { TodoChangeTitleCommand } from "./domain/todo/workflows/titleChange/types";
import { PrismaClient } from "@prisma/client";
import {
  getAllTodos,
  getTodo,
  getTodoHistory,
} from "./infrastructures/prismaTodoRepository";
import { TodoId } from "./domain/todo/models/common";
import { createTodoWorkflow } from "./domain/todo/workflows/creation";
import { publishEvent } from "./domain/events/index";
import { storeEvent } from "./infrastructures/prismaEventStore";
import { completeTodoWorkflow } from "./domain/todo/workflows/completion/index";
import { changeTodoTitleWorkflow } from "./domain/todo/workflows/titleChange/index";

const prisma = new PrismaClient();
const storeEventToDB = storeEvent({ prisma, publishEvent });

const fastify = Fastify({
  logger: true,
});

fastify.get("/todos/:id", async (request, reply) => {
  const { id } = request.params as { id: string };
  const res = await TodoId(id).asyncAndThen(getTodo(prisma));
  if (res.isOk()) return res.value;
  return reply.status(400).send({ error: res.error.message });
});

fastify.get("/todos/:id/history", async (request, reply) => {
  const { id } = request.params as { id: string };
  const res = await TodoId(id).asyncAndThen(getTodoHistory(prisma));
  if (res.isOk()) return res.value;
  return reply.status(400).send({ error: res.error.message });
});

fastify.get("/todos", async (_, reply) => {
  const res = await getAllTodos(prisma)();
  if (res.isOk()) return res.value;
  return reply.status(500).send({ error: res.error.message });
});

fastify.patch("/todos/:id/complete", async (request, reply) => {
  const { id } = request.params as { id: string };
  const workflow = completeTodoWorkflow({
    getTodo: getTodo(prisma),
    storeEvent: storeEventToDB,
  });
  const res = await workflow({
    id,
  });

  if (res.isOk()) return reply.status(200).send();
  return reply.status(500).send({ error: res.error.message });
});

fastify.patch("/todos/:id/title", async (request, reply) => {
  const command = request.body as TodoChangeTitleCommand;

  const workflow = changeTodoTitleWorkflow({
    getTodo: getTodo(prisma),
    storeEvent: storeEventToDB,
  });
  const res = await workflow(command);

  if (res.isOk()) return reply.status(200).send();
  return reply.status(500).send({ error: res.error.message });
});

fastify.post("/todos", async (req, reply) => {
  const body = req.body as CreateTodoCommand;

  const workflow = createTodoWorkflow({
    storeEvent: storeEventToDB,
    getTodo: getTodo(prisma),
  });
  const result = await workflow(body);

  if (result.isOk()) return reply.status(201).send();
  return reply.status(500).send({ error: result.error.message });
});

fastify.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening at ${address}`);
});
