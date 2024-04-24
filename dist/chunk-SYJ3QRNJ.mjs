import {
  BadRequest
} from "./chunk-JRO4E4TH.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/check-in.ts
import { z } from "zod";
async function checkIn(app) {
  app.withTypeProvider().get("/attendee/:attendeeId/check-in", {
    schema: {
      summary: "Check-in an attendees",
      tags: ["check-ins"],
      params: z.object({
        attendeeId: z.coerce.number().int()
      }),
      response: {
        201: z.null()
      }
    }
  }, async (request, reply) => {
    const { attendeeId } = request.params;
    const attendeeCheckIn = await prisma.checkIn.findUnique({
      where: {
        attendeeId
      }
    });
    if (attendeeCheckIn !== null) {
      throw new BadRequest("attendee already checked in!");
    }
    await prisma.checkIn.create({
      data: {
        attendeeId
      }
    });
    reply.status(201).send();
  });
}

export {
  checkIn
};
