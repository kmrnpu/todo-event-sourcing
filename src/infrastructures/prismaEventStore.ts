import { PrismaClient } from "@prisma/client";
import { StoreEvent } from "../domain/events/repos/types";
import { err, ok, safeTry } from "neverthrow";

export const storeEvent =
  (prisma: PrismaClient): StoreEvent =>
  (event) =>
    safeTry(async function* () {
      try {
        await prisma.event.create({
          data: {
            type: event.type,
            payload: event.payload,
            occuredAt: event.occuredAt,
          },
        });
        console.log("Stored event: ", event);
        return ok();
      } catch (e) {
        return err(e as Error);
      }
    });
