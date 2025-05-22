import { ok } from "neverthrow";
import { changeTodoTitle } from "../../../models/entity";
import { ChangeTitle } from "../types";

export const changeTitle: ChangeTitle = (command) => {
  const titleChanged = changeTodoTitle(command.todo, command.title)
  return ok({
    state: "titleChanged",
    todo: titleChanged,
  })
}
