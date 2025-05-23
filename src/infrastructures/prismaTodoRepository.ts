import { err, ok, safeTry } from "neverthrow";
import {
  TodoCreatedEvent,
  TodoCompletedEvent,
  TodoDomainEvent,
  TodoTitleUpdatedEvent,
} from "../domain/todo/events";
import { TodoId } from "../domain/todo/models/common";
import {
  changeTodoTitle,
  completeTodo,
  Todo,
} from "../domain/todo/models/entity";
import { match } from "ts-pattern";
import { PrismaClient } from "@prisma/client";
import {
  GetAllTodos,
  GetTodo,
  GetTodoHistory,
} from "../domain/todo/repos/types";

type EventMap = Map<TodoId, Todo>;

const handleCreated =
  (eventMap: EventMap) =>
  (e: TodoCreatedEvent): EventMap => {
    const id = e.payload.id;
    if (eventMap.get(id)) return eventMap;
    const todo = Todo({
      id: e.payload.id,
      title: e.payload.title,
      description: e.payload.description,
      createdAt: e.occuredAt,
      completedAt: null,
      updatedAt: null,
    });
    if (todo.isErr()) return eventMap;
    eventMap.set(id, todo.value);
    return eventMap;
  };

const handleCompleted =
  (eventMap: EventMap) =>
  (e: TodoCompletedEvent): EventMap => {
    const id = e.payload.id;
    const todo = eventMap.get(id);
    if (!todo || todo.completedAt) return eventMap;
    eventMap.set(id, completeTodo(todo, e.occuredAt).entity);
    return eventMap;
  };

const handleTitleUpdated =
  (eventMap: EventMap) =>
  (e: TodoTitleUpdatedEvent): EventMap => {
    const id = e.payload.id;
    const todo = eventMap.get(id);
    if (!todo) return eventMap;
    eventMap.set(
      id,
      changeTodoTitle(todo, e.payload.title, e.occuredAt).entity,
    );
    return eventMap;
  };

const reducer = (eventMap: EventMap, event: TodoDomainEvent): EventMap =>
  match(event)
    .with({ type: "todoCreated" }, handleCreated(eventMap))
    .with({ type: "todoCompleted" }, handleCompleted(eventMap))
    .with({ type: "todoTitleUpdated" }, handleTitleUpdated(eventMap))
    .exhaustive();

export const getTodo =
  (prisma: PrismaClient): GetTodo =>
  (id) =>
    safeTry(async function* () {
      const res = (await prisma.event.findMany({
        where: {
          type: {
            in: ["todoCreated", "todoCompleted", "todoTitleUpdated"],
          },
          payload: {
            path: ["id"],
            equals: id,
          },
        },
        orderBy: [
          {
            occuredAt: "asc",
          },
        ],
      })) as TodoDomainEvent[];

      const todos = res.reduce(reducer, new Map() as EventMap);
      return ok(todos.get(id) ?? null);
    });

export const getAllTodos =
  (prisma: PrismaClient): GetAllTodos =>
  () =>
    safeTry(async function* () {
      const res = (await prisma.event.findMany({
        where: {
          type: {
            in: ["todoCreated", "todoCompleted", "todoTitleUpdated"],
          },
        },
        orderBy: [
          {
            occuredAt: "asc",
          },
        ],
      })) as TodoDomainEvent[];

      const todo = res.reduce(reducer, new Map() as EventMap);
      return ok(Array.from(todo.values()));
    });

export const getTodoHistory =
  (prisma: PrismaClient): GetTodoHistory =>
  (id) =>
    safeTry(async function* () {
      try {
        const res = (await prisma.event.findMany({
          where: {
            type: {
              in: ["todoCreated", "todoCompleted", "todoTitleUpdated"],
            },
            payload: {
              path: ["id"],
              equals: id,
            },
          },
          orderBy: [
            {
              occuredAt: "asc",
            },
          ],
        })) as TodoDomainEvent[];

        return ok(res);
      } catch (e) {
        return err(e as Error);
      }
    });
