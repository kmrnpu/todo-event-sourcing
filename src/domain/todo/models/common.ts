import { z } from "zod";
import { branded } from "../../utility/schema";

export const [todoId, TodoId] = branded("TodoId", z.string().uuid())
export type TodoId = z.infer<typeof todoId>

export const [todoTitle, TodoTitle] = branded("TodoTitle", z.string())
export type TodoTitle = z.infer<typeof todoTitle>

export const [todoDescription, TodoDescription] = branded("TodoDescription", z.string())
export type TodoDescription = z.infer<typeof todoDescription>
