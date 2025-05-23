import { z, ZodTypeAny } from "zod";
import { branded, parseWithResult } from "../utility/schema.js";
import { randomUUID } from "crypto";

const [domainEventId] = branded("DomainEventId", z.string());
export type DomainEventId = z.infer<typeof domainEventId>

export const DomainEventId = {
  create: () => randomUUID() as DomainEventId,
  reconstruct: (value: string) => parseWithResult(domainEventId)(value)
}

export const createDomainEventSchema = <
  Type extends string,
  Payload extends ZodTypeAny,
>(
  type: Type,
  payload: Payload,
) =>
  z.object({
    type: z.literal(type),
    id: domainEventId,
    payload: payload,
    occuredAt: z.date(),
  });

export const domainEvent = <Type extends string, Payload extends ZodTypeAny>(
  type: Type,
  payload: Payload,
) => {
  const schema = createDomainEventSchema(type, payload);
  return [schema, parseWithResult(schema)] as const;
};
