import { err, ok } from "neverthrow";
import { isCompleted } from "../../../models/entity";
import { CheckCompletion } from "../types";

export const checkCompletion: CheckCompletion = (state) => {
  if(isCompleted(state.todo)) return err( new Error("todo is already completed"))
    return ok({
      state: "completionChecked",
      todo: state.todo,
    })
}
