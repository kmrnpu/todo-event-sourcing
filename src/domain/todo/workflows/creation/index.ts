import { ok } from "neverthrow";
import { CreateTodoWorkflow } from "./types";
import { createTodo } from "./steps/creation";
import { establishEvent } from "./steps/eventEstablishment";
import { GetTodo } from "../../repos/types";
import { checkDuplication } from "./steps/checkDuplication";
import { StoreEvent } from "../../../events/repos/types";

type Context = {
  storeEvent: StoreEvent;
  getTodo: GetTodo;
};

export const createTodoWorkflow =
  (ctx: Context): CreateTodoWorkflow =>
  (command) =>
    ok(command)
      .andThen(createTodo)
      .asyncAndThen(checkDuplication(ctx.getTodo))
      .andThen(establishEvent)
      .andThen(({ event }) => {
        return ctx.storeEvent(event);
      });
