import { PrismaClient } from "@prisma/client";
import { StoreEvent } from "../domain/events/repos/types";
import { err, ok, safeTry } from "neverthrow";
import { PublishEvent } from "../domain/events";

export const storeEvent =
  (ctx: { prisma: PrismaClient; publishEvent: PublishEvent }): StoreEvent =>
  (event) =>
    safeTry(async function* () {
      try {
        await ctx.prisma.event.create({
          data: {
            type: event.type,
            payload: event.payload,
            occuredAt: event.occuredAt,
          },
        });
        console.log("Stored event: ", event);
        ctx.publishEvent(event);
        return ok();
      } catch (e) {
        return err(e as Error);
      }
    });
