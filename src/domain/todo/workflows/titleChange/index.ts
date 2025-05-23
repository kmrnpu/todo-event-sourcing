import { ok } from "neverthrow";
import { GetTodo } from "../../repos/types";
import { ChangeTodoTitleWorkflow } from "./types";
import { validate } from "./steps/validation";
import { identifyTarget } from "./steps/targetIdentification";
import { changeTitle } from "./steps/titleChange";
import { StoreEvent } from "../../../events/repos/types";

type Context = {
  getTodo: GetTodo;
  storeEvent: StoreEvent;
};

export const changeTodoTitleWorkflow =
  (ctx: Context): ChangeTodoTitleWorkflow =>
  (command) =>
    ok(command)
      .andThen(validate)
      .asyncAndThen(identifyTarget(ctx.getTodo))
      .andThen(changeTitle)
      .andThen(({ event }) => {
        return ctx.storeEvent(event);
      });
