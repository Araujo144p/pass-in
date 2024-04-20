import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function getAttendeesBadge(app: FastifyInstance){
    app
    .withTypeProvider<ZodTypeProvider>()
    .get('/attendee/:attendeeId', {
        schema: { 
            params: z.object({
                attendeeId: z.coerce.number().int()
            }),
            response: {
                200: z.object({
                    attendee: z.object({
                        name: z.string(),
                        email: z.string(),
                        event_name: z.string(),
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

        reply.status(200).send({ 
            attendee: {
                name: attendee.name,
                email: attendee.email,
                event_name: attendee.event.tittle
            } 
        })


    })
}