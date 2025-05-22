import { ok } from "neverthrow";
import { PublishEvent } from "../../../events";
import { GetTodo } from "../../repos/types";
import { CompleteTodoWorkflow } from "./types";
import { validate } from "./steps/validation";
import { identifyTarget } from "./steps/targetIdentification";
import { checkCompletion } from "./steps/checkCompletion";
import { complete } from "./steps/completion";
import { establishEvent } from "./steps/eventEstablishment";

type Context = {
  getTodo: GetTodo;
  pubishEvent: PublishEvent;
};

export const completeTodoWorkflow =
  (ctx: Context): CompleteTodoWorkflow =>
  (command) =>
    ok(command)
      .andThen(validate)
      .asyncAndThen(identifyTarget(ctx.getTodo))
      .andThen(checkCompletion)
      .andThen(complete)
      .andThen(establishEvent)
      .andThen(({ event }) => {
        ctx.pubishEvent(event);
        return ok();
      });
