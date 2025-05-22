import { IdentifyTarget } from "../types";
import { GetTodo} from "../../../repos/types"
import { err, ok } from "neverthrow";

export const identifyTarget  = (getTodo: GetTodo): IdentifyTarget => (state) => 
  getTodo(state.id)
  .andThen((todo) => {
    if(!todo) return err(new Error("Todo not found"))
    return ok({
      state: "todoIdentified" as const ,
      todo: todo,
      title: state.title
    })
  })
