import EventEmitter from "events";
import { TodoDomainEvent } from "../todo/events";

export type DomainEvent = TodoDomainEvent
type MatchedEvent<T extends DomainEvent["type"]> = Extract<DomainEvent, { type: T }>

const broker = new EventEmitter()

export type PublishEvent = (event: TodoDomainEvent) => void;
export type SubscribeEvent = <K extends DomainEvent["type"]>(type: K, callback: (paylod: MatchedEvent<K>) => void) => void

export const publishEvent: PublishEvent = (event) => broker.emit(event.type, event)
export const subscribeEvent: SubscribeEvent = (type, callback) => broker.on(type, (event) => {
  callback(event)
})
