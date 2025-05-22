import { randomUUID } from "crypto";
import { TodoTitleUpdatedEvent } from "../../../events";
import { EstablishEvent } from "../types";

export const establishEvent: EstablishEvent = (command) =>
  TodoTitleUpdatedEvent({
    id: randomUUID(),
    type: "todoTitleUpdated",
    payload: {
      id: command.todo.id,
      title: command.todo.title,
    },
    occuredAt: new Date(),
  }).map((event) => ({
    state: "eventEstablished",
    todo: command.todo,
    event,
  }));
