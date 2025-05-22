import { ok } from "neverthrow";
import { PublishEvent } from "../../../events";
import { GetTodo } from "../../repos/types";
import { ChangeTodoTitleWorkflow } from "./types";
import { validate } from "./steps/validation";
import { identifyTarget } from "./steps/targetIdentification";
import { changeTitle } from "./steps/titleChange";
import { establishEvent } from "./steps/eventEstablishment";

type Context = {
  getTodo: GetTodo;
  pubishEvent: PublishEvent;
}

export const changeTodoTitleWorkflow = (ctx: Context): ChangeTodoTitleWorkflow => (command) => 
  ok(command)
  .andThen(validate)
  .asyncAndThen(identifyTarget(ctx.getTodo))
  .andThen(changeTitle)
  .andThen(establishEvent)
  .andThen(({event}) => {
    ctx.pubishEvent(event)
    return ok()
  })
