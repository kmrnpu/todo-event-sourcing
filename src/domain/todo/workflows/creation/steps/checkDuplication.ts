import { err, ok } from "neverthrow";
import { GetTodo } from "../../../repos/types";
import { CheckDuplication } from "../types";

export const checkDuplication =
  (getTodoById: GetTodo): CheckDuplication =>
  (command) =>
    getTodoById(command.todo.id).andThen((todo) => {
      if (todo) return err(new Error("Todo already registerd."));
      return ok({
        state: "duplicationChecked" as const,
        todo: command.todo,
      });
    });
