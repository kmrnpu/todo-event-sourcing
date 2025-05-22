import { ok, safeTry } from "neverthrow"
import { TodoCreatedEvent, TodoCompletedEvent, TodoDomainEvent } from "../domain/todo/events"
import { TodoId } from "../domain/todo/models/common"
import { Todo } from "../domain/todo/models/entity"
import {match} from "ts-pattern"
import { PrismaClient } from "@prisma/client"
import { GetAllTodos, GetTodo } from "../domain/todo/repos/types"

type EventMap = Map<TodoId, Todo>

const handleCreatedEvent = (eventMap: EventMap) => (e: TodoCreatedEvent): EventMap => {
  const id = e.payload.id
  if(eventMap.get(id)) return eventMap
    const todo = Todo({
      id: e.payload.id,
      title: e.payload.title,
      description: e.payload.description,
      completed: false,
      createdAt: e.occuredAt,
      completedAt: null,
    })
  if(todo.isErr()) return eventMap
  eventMap.set(id, todo.value)
  return eventMap
}

const handleCompletedEvent = (eventMap: EventMap) => (e: TodoCompletedEvent): EventMap => {
  const id = e.payload.id
  const todo = eventMap.get(id)
  if(!todo) return eventMap
  eventMap.set(id, {
    ...todo,
    completed: true,
    completedAt: e.occuredAt,
  })
  return eventMap
}

const reducer = (eventMap: EventMap, event: TodoDomainEvent): EventMap => 
  match(event)
    .with({type: "todoCreated"}, handleCreatedEvent(eventMap))
    .with({type: "todoCompleted"}, handleCompletedEvent(eventMap))
  .exhaustive()

export const getTodo = (prisma: PrismaClient): GetTodo => (id) => safeTry(async function*() {
  const res = await prisma.event.findMany({
    where: {
      type: {
        in: ["todoCreated", "todoCompleted"],
      },
      payload: {
        path: ['id'],
        equals: id,
      }
    },
    orderBy: [
      {
        occuredAt: "asc",
      }
    ]
  }) as TodoDomainEvent[]

  const todos =  res.reduce(reducer, new Map() as EventMap)
  return ok(todos.get(id) ?? null)
})

export const getAllTodos = (prisma: PrismaClient): GetAllTodos => () => safeTry(async function*() {
  const res = await prisma.event.findMany({
    where: {
      type: {
        in: ["todoCreated", "todoCompleted"],
      },
    },
    orderBy: [
      {
        occuredAt: "asc",
      }
    ]
  }) as TodoDomainEvent[]

  const todo =  res.reduce(reducer, new Map() as EventMap)
  return ok(Array.from(todo.values()))
})


