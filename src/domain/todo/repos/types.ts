import { ResultAsync } from "neverthrow";
import { TodoId } from "../models/common";
import { Todo } from "../models/entity";
import { TodoDomainEvent } from "../events";

export type GetTodo = (id: TodoId) => ResultAsync<Todo | null, Error>;
export type GetAllTodos = () => ResultAsync<Todo[], Error>;
export type GetTodoHistory = (
  id: TodoId,
) => ResultAsync<TodoDomainEvent[], Error>;
