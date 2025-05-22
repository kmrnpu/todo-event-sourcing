import { z } from "zod";
import { domainEvent } from "../../events/schema";
import { todoDescription, todoId, todoTitle } from "../models/common";

export const [todoCreatedEvent, TodoCreatedEvent] = domainEvent("todoCreated", z.object({
  id: todoId,
  title: todoTitle,
  description: todoDescription,
}))

export type TodoCreatedEvent = z.infer<typeof todoCreatedEvent>

export const [todoCompletedEvent, TodoCompletedEvent] = domainEvent("todoCompleted", z.object({
  id: todoId,
}))

export type TodoCompletedEvent = z.infer<typeof todoCompletedEvent>

export type TodoDomainEvent = TodoCreatedEvent | TodoCompletedEvent
