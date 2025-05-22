import { ResultAsync } from "neverthrow";
import { DomainEvent } from "..";

export type StoreEvent = (event: DomainEvent) => ResultAsync<void, Error>

