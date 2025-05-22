import { Result, ResultAsync } from "neverthrow";
import { TodoTitleUpdatedEvent } from "../../events";
import { TodoId, TodoTitle } from "../../models/common";
import { Todo } from "../../models/entity";

export type TodoChangeTitleCommand = {
  id: string;
  title: string;
};

export type CommandValidated = {
  state: "valdated";
  id: TodoId;
  title: TodoTitle;
};

export type TargetIdentified = {
  state: "todoIdentified";
  todo: Todo;
  title: TodoTitle;
};

export type TitleChanged = {
  state: "titleChanged";
  todo: Todo;
};

export type EventEstablished = {
  state: "eventEstablished";
  todo: Todo;
  event: TodoTitleUpdatedEvent;
};

export type Validate = (
  command: TodoChangeTitleCommand,
) => Result<CommandValidated, Error>;
export type IdentifyTarget = (
  command: CommandValidated,
) => ResultAsync<TargetIdentified, Error>;
export type ChangeTitle = (
  command: TargetIdentified,
) => Result<TitleChanged, Error>;
export type EstablishEvent = (
  command: TitleChanged,
) => Result<EventEstablished, Error>;
export type ChangeTodoTitleWorkflow = (
  command: TodoChangeTitleCommand,
) => ResultAsync<void, Error>;
