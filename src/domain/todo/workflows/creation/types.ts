import { Result, ResultAsync } from "neverthrow";
import { TodoCreatedEvent } from "../../events";
import { TodoUncompleted } from "../../models/entity";

export type CreateTodoCommand = {
  title: string;
  description: string;
};

export type TodoCreated = {
  state: "created";
  todo: TodoUncompleted;
};

export type TodoDuplicationChecked = {
  state: "duplicationChecked";
  todo: TodoUncompleted;
};

export type EventEstablished = {
  state: "eventEstablished";
  todo: TodoUncompleted;
  event: TodoCreatedEvent;
};

export type CreateTodo = (
  command: CreateTodoCommand,
) => Result<TodoCreated, Error>;
export type CheckDuplication = (
  command: TodoCreated,
) => ResultAsync<TodoDuplicationChecked, Error>;
export type EstablishEvent = (
  state: TodoDuplicationChecked,
) => Result<EventEstablished, Error>;
export type CreateTodoWorkflow = (
  command: CreateTodoCommand,
) => ResultAsync<void, Error>;
