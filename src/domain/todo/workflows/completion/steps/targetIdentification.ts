import { err, ok } from "neverthrow";
import { GetTodo } from "../../../repos/types";
import { IdentifyTarget } from "../types";

export const identifyTarget =
  (getTodo: GetTodo): IdentifyTarget =>
  (state) =>
    getTodo(state.id).andThen((todo) => {
      if (!todo) return err(new Error("Todo not found."));
      return ok({
        state: "targetIdentified" as const,
        todo: todo,
      });
    });
