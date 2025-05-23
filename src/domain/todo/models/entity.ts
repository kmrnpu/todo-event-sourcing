/** @todo Add updatedAt propertiy to models. */

import { z } from "zod";
import { todoDescription, todoId, TodoTitle, todoTitle } from "./common";
import { parseWithResult } from "../../utility/schema";
import { TodoCompletedEvent, TodoTitleUpdatedEvent } from "../events";
import { DomainEventId } from "../../events/schema";

export const todoUncompleted = z.object({
  id: todoId,
  title: todoTitle,
  description: todoDescription,
  createdAt: z.date(),
  completedAt: z.null(),
  updatedAt: z.date().nullable(),
});

export type TodoUncompleted = z.infer<typeof todoUncompleted>;
export const TodoUncompleted = parseWithResult(todoUncompleted);

export const todoCompleted = z.object({
  id: todoId,
  title: todoTitle,
  description: todoDescription,
  createdAt: z.date(),
  completedAt: z.date(),
  updatedAt: z.date().nullable(),
});
export type TodoCompleted = z.infer<typeof todoCompleted>;
export const TodoCompleted = parseWithResult(todoCompleted);

const todo = z.union([todoUncompleted, todoCompleted]);

export const Todo = parseWithResult(todo);
export type Todo = z.infer<typeof todo>;

const complete = (
  todo: TodoUncompleted,
  completedAt: Date = new Date(),
): TodoCompleted => ({
  ...todo,
  completedAt,
})

export const completeTodo = (
  todo: TodoUncompleted,
  completedAt: Date = new Date(),
): {entity: TodoCompleted, event: TodoCompletedEvent} => {
    const completed = complete(todo, completedAt)

    return {
      entity: completed,
      event: {
      type: "todoCompleted",
      id: DomainEventId.create(),
      payload: {
        id: completed.id,
      },
      occuredAt: completedAt,
      },
    }
  }

export const uncompleteTodo = (todo: TodoCompleted): TodoUncompleted => ({
  ...todo,
  completedAt: null,
});

export const isCompleted = (todo: Todo) => todo.completedAt !== null;
const changeTitle = (todo: Todo, title: TodoTitle, updatedAt: Date=new Date()) => ({
  ...todo,
  title,
  updatedAt,
});

export const changeTodoTitle = (todo: Todo, title: TodoTitle, updatedAt: Date=new Date()): {entity: Todo, event: TodoTitleUpdatedEvent} => {
  const updated = changeTitle(todo, title, updatedAt)
  return {
    entity: updated,
    event: {
      id: DomainEventId.create(),
      type: "todoTitleUpdated",
      payload: {
        id: updated.id,
        title: updated.title,
      },
      occuredAt: updated.updatedAt,
    }
  }
}


