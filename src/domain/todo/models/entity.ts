/** @todo Add updatedAt propertiy to models. */

import { z } from "zod";
import { todoDescription, todoId, TodoTitle, todoTitle } from "./common";
import { parseWithResult } from "../../utility/schema";

export const todoUncompleted = z.object({
  id: todoId,
  title: todoTitle,
  description: todoDescription,
  completed: z.literal(false),
  createdAt: z.date(),
  completedAt: z.null(),
});

export type TodoUncompleted = z.infer<typeof todoUncompleted>;
export const TodoUncompleted = parseWithResult(todoUncompleted);

export const todoCompleted = z.object({
  id: todoId,
  title: todoTitle,
  description: todoDescription,
  completed: z.literal(true),
  createdAt: z.date(),
  completedAt: z.date(),
});
export type TodoCompleted = z.infer<typeof todoCompleted>;
export const TodoCompleted = parseWithResult(todoCompleted);

const todo = z.union([todoUncompleted, todoCompleted]);

export const Todo = parseWithResult(todo);
export type Todo = z.infer<typeof todo>;

export const completeTodo = (
  todo: TodoUncompleted,
  completedAt: Date = new Date(),
): TodoCompleted => ({
  ...todo,
  completed: true,
  completedAt,
});

export const uncompleteTodo = (todo: TodoCompleted): TodoUncompleted => ({
  ...todo,
  completed: false,
  completedAt: null,
});

export const isCompleted = (todo: Todo) => todo.completed;
export const changeTodoTitle = (todo: Todo, title: TodoTitle) => ({
  ...todo,
  title,
});
