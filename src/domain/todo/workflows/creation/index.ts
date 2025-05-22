import { ok } from "neverthrow";
import { CreateTodoWorkflow } from "./types";
import { createTodo } from "./steps/creation";
import { establishEvent } from "./steps/eventEstablishment";
import { PublishEvent } from "../../../events";
import { GetTodo } from "../../repos/types";
import { checkDuplication } from "./steps/checkDuplication";

type Context = {
  pubishEvent: PublishEvent;
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
        ctx.pubishEvent(event);
        return ok();
      });
