import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/get-event-attendee.ts
import { z } from "zod";
async function getEventAttendee(app) {
  app.withTypeProvider().get("/events/:eventId/attendees", {
    schema: {
      summary: "Get event attendees",
      tags: ["attendees"],
      params: z.object({
        eventId: z.string().uuid()
      }),
      querystring: z.object({
        query: z.string().nullish(),
        pageIndex: z.string().nullish().default("0").transform(Number)
      }),
      response: {
        200: z.object({
          attendees: z.array(
            z.object({
              id: z.number(),
              name: z.string(),
              email: z.string(),
              createdAt: z.date(),
              checkInAt: z.date().nullable()
            })
          )
        })
      }
    }
  }, async (request, reply) => {
    const { eventId } = request.params;
    const { pageIndex, query } = request.query;
    const attendees = await prisma.attendee.findMany({
      where: query ? {
        eventId,
        name: {
          contains: query
        }
      } : {
        eventId
      },
      take: 10,
      skip: pageIndex * 10,
      orderBy: {
        createAt: "desc"
      },
      select: {
        id: true,
        name: true,
        email: true,
        createAt: true,
        checkIn: {
          select: {
            createAt: true
          }
        }
      }
    });
    reply.status(200).send({
      attendees: attendees.map((attendee) => {
        return {
          id: attendee.id,
          name: attendee.name,
          email: attendee.email,
          createdAt: attendee.createAt,
          checkInAt: attendee.checkIn?.createAt ?? null
        };
      })
    });
  });
}

export {
  getEventAttendee
};
