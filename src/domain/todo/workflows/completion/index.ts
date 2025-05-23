import { ok } from "neverthrow";
import { GetTodo } from "../../repos/types";
import { CompleteTodoWorkflow } from "./types";
import { validate } from "./steps/validation";
import { identifyTarget } from "./steps/targetIdentification";
import { checkCompletion } from "./steps/checkCompletion";
import { complete } from "./steps/completion";
import { StoreEvent } from "../../../events/repos/types";

type Context = {
  getTodo: GetTodo;
  storeEvent: StoreEvent;
};

export const completeTodoWorkflow =
  (ctx: Context): CompleteTodoWorkflow =>
  (command) =>
    ok(command)
      .andThen(validate)
      .asyncAndThen(identifyTarget(ctx.getTodo))
      .andThen(checkCompletion)
      .andThen(complete)
      .andThen(({ event }) => {
        return ctx.storeEvent(event);
      });
