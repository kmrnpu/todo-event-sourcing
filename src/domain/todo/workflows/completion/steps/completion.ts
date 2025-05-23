import { ok } from "neverthrow";
import { Complete } from "../types";
import { completeTodo } from "../../../models/entity";

export const complete: Complete = (command) =>
  ok(command).andThen(() => {
    const todo = completeTodo(command.todo);
    return ok({
      state: "completed" as const,
      todo: todo.entity,
      event: todo.event,
    });
  });
