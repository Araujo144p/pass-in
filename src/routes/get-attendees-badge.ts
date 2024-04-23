import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function getAttendeesBadge(app: FastifyInstance){
    app
    .withTypeProvider<ZodTypeProvider>()
    .get('/attendee/:attendeeId/badge', {
        schema: { 
            summary: 'Get an attendees badge',
            tags: ['attendees'],
            params: z.object({
                attendeeId: z.coerce.number().int()
            }),
            response: {
                200: z.object({
                    attendee: z.object({
                        name: z.string(),
                        email: z.string(),
                        eventName: z.string(),
                        checkInURL: z.string().url(),
                    })
                })
            }
        }   
    }, async (request, reply)=> {
        const { attendeeId } = request.params

        const attendee = await prisma.attendee.findUnique({
            select :{
                name: true,
                email: true,
                event: { 
                    select: {
                        tittle: true
                    },
                },
            },
            where: { 
                id: attendeeId
            }   
        })

        if(attendee === null){
            throw new Error('atendee not found.')
        }

        const baseURL = `${request.protocol}://${request.hostname}`
        const checkInURL = new URL(`/attendee/${attendeeId}/check-in`, baseURL)

        reply.status(200).send({ 
            attendee: {
                name: attendee.name,
                email: attendee.email,
                eventName: attendee.event.tittle,
                checkInURL: checkInURL.toString()
            } 
        })


    })
}