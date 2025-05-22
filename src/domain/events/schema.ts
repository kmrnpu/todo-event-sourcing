import { z, ZodTypeAny } from 'zod';
import { branded, parseWithResult } from '../utility/schema.js';

const [domainEventId] = branded("DomainEventId", z.string())

export const createDomainEventSchema = <
  Type extends string,
  Payload extends ZodTypeAny
>(
  type: Type,
  payload: Payload
) =>
  z.object({
    type: z.literal(type),
    id: domainEventId,
    payload: payload,
    occuredAt: z.date(),
  });


export const domainEvent = <
  Type extends string,
  Payload extends ZodTypeAny
>(
  type: Type,
  payload: Payload
) => {
  const schema = createDomainEventSchema(type, payload)
  return [schema, parseWithResult(schema)] as const
}
