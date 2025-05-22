import { ok, safeTry } from "neverthrow";
import { Validate } from "../types";
import { TodoId, TodoTitle } from "../../../models/common";

export const validate: Validate = (command) => safeTry(function*() {
  const id = yield* TodoId(command.id)
  const title = yield* TodoTitle(command.title)
  return ok({
    state: "valdated" as const,
    id,
    title,
  })
})
