import { Result, ResultAsync } from "neverthrow";
import { TodoCompletedEvent } from "../../events";
import { TodoId } from "../../models/common";
import { Todo, TodoCompleted, TodoUncompleted } from "../../models/entity";

export type CompleteTodoCommand = {
  id: string;
};

export type CompleteTodoCommandValidated = {
  state: "valdated";
  id: TodoId;
};

export type CompleteTodoTargetIdentified = {
  state: "targetIdentified";
  todo: Todo;
};

export type CompleteTodoCompletionChecked = {
  state: "completionChecked";
  todo: TodoUncompleted;
};

export type CompleteTodoCompleted = {
  state: "completed";
  todo: TodoCompleted;
};

export type CompleteTodoEventEstablished = {
  state: "eventEstablished";
  todo: TodoCompleted;
  event: TodoCompletedEvent;
};

export type Validate = (
  command: CompleteTodoCommand,
) => Result<CompleteTodoCommandValidated, Error>;
export type IdentifyTarget = (
  command: CompleteTodoCommandValidated,
) => ResultAsync<CompleteTodoTargetIdentified, Error>;
export type CheckCompletion = (
  command: CompleteTodoTargetIdentified,
) => Result<CompleteTodoCompletionChecked, Error>;
export type Complete = (
  command: CompleteTodoCompletionChecked,
) => Result<CompleteTodoCompleted, Error>;
export type EstablishEvent = (
  command: CompleteTodoCompleted,
) => Result<CompleteTodoEventEstablished, Error>;
export type CompleteTodoWorkflow = (
  command: CompleteTodoCommand,
) => ResultAsync<void, Error>;
