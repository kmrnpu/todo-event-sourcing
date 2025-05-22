import { ok } from "neverthrow";
import { TodoCompletedEvent } from "../../../events";
import { EstablishEvent } from "../types";
import { randomUUID } from "crypto";

export const establishEvent: EstablishEvent = (state) =>
  TodoCompletedEvent({
    id: randomUUID(),
    type: "todoCompleted",
    payload: {
      id: state.todo.id,
    },
    occuredAt: state.todo.completedAt,
  }).andThen((event) =>
    ok({
      state: "eventEstablished" as const,
      todo: state.todo,
      event,
    }),
  );
