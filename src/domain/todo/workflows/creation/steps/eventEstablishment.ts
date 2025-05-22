import { ok, safeTry } from "neverthrow";
import { EstablishEvent } from "../types";
import { TodoCreatedEvent } from "../../../events";
import { randomUUID } from "crypto";

export const establishEvent: EstablishEvent = (state) => safeTry(function* () {
  const event = yield* TodoCreatedEvent({
    id: randomUUID(),
    type: "todoCreated",
    payload: {
      id: state.todo.id,
      title: state.todo.title,
      description: state.todo.description,
    },
    occuredAt: state.todo.createdAt,
  })

  return ok({
    state: "eventEstablished",
    todo: state.todo,
    event: event,
  })
})
