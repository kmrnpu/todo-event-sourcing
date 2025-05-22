import { PrismaClient } from "@prisma/client";
import { getAllTodos, getTodo } from "./infrastructures/prismaTodoRepository";
import { TodoId } from "./domain/todo/models/common";
import { createTodoWorkflow } from "./domain/todo/workflows/creation";
import { publishEvent, subscribeEvent } from "./domain/events/index"
import { storeEvent } from "./infrastructures/prismaEventStore.ts"
import { completeTodoWorkflow } from "./domain/todo/workflows/completion/index.ts";
import { changeTodoTitleWorkflow } from "./domain/todo/workflows/titleChange/index.ts";

const prisma = new PrismaClient()
const storeEventToDB = storeEvent(prisma)

const eventTypes = ["todoCreated", "todoCompleted", "todoTitleUpdated"] as const 
eventTypes.forEach(type => {
  subscribeEvent(type, (e) => {
    const result = storeEventToDB(e)
    result.match(
      () => console.log("Success"),
      (e) => console.log("Error:", e)
    )
  })
})

// const changeTodoTitle = changeTodoTitleWorkflow({
//   getTodo: getTodo(prisma),
//   pubishEvent: publishEvent,
// })
// changeTodoTitle({
//   id: "c3fba319-6173-4005-adaa-aa7d68367829",
//   title: "a",
// }).match(
//   () => {},
//   (e) => console.log(e),
// )

// const completeTodo = completeTodoWorkflow({
//   getTodo: getTodo(prisma),
//   pubishEvent: publishEvent,
// })

// completeTodo({
//   id: "c3fba319-6173-4005-adaa-aa7d68367829",
// }).match(
//   () => {},
//   (e) => console.log(e),
// )

// const workflow = createTodoWorkflow({
//   pubishEvent: publishEvent,
//   getTodo: getTodo(prisma),
// })
//
// const result = workflow({
//   title: "寝る",
//   description: "8時間寝る",
// })
//
// result.match(
//   () => {},
//   (e) => console.log(e),
// )


getTodo(new PrismaClient())("0b19200e-8618-40e0-9828-c656a82c7b9b" as TodoId).match(
  (a) => console.log(a),
  (b) => console.log(b),
)

getAllTodos(new PrismaClient())().match(
  (a) => console.log(a),
  (b) => console.log(b),
)
