import { ok, safeTry } from "neverthrow";
import { Validate } from "../types";
import { TodoId } from "../../../models/common";

export const validate: Validate = (command) =>
  safeTry(function* () {
    const todoId = yield* TodoId(command.id);
    return ok({
      state: "valdated" as const,
      id: todoId,
    });
  });
