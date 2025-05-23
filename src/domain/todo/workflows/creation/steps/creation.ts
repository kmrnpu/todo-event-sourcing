import { randomUUID } from "crypto";
import { TodoUncompleted } from "../../../models/entity";
import { CreateTodo } from "../types";

export const createTodo: CreateTodo = (command) =>
  TodoUncompleted({
    id: randomUUID(),
    title: command.title,
    description: command.description,
    createdAt: new Date(),
    completedAt: null,
    updatedAt: null,
  }).map((todo) => ({
    state: "created",
    todo,
  }));
