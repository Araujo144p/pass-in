import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { generateSlug } from '../utils/generate-slug'
import { prisma } from '../lib/prisma'
import { FastifyInstance } from 'fastify'

export async function registerForEvent(app: FastifyInstance){
    app
     .withTypeProvider<ZodTypeProvider>()
     .post('/events/:eventId/attendee', {
        schema:{
            body: z.object({
                name: z.string().min(4),
                email: z.string().email(),
            }),
            params: z.object({
                eventId: z.string().uuid()
            }),
            response: {
                201: z.object({
                    attendeeId: z.number(),
                })
            }
     }}, async (request, reply)=>{
        const { name , email } = request.body
        const { eventId } = request.params

        const existEvent = await prisma.event.findUnique({
            where: { 
                id: eventId
            }
        })

        if(existEvent === null){
            throw new Error('this event id is a bad request or not exist.')
        }

        const attendeeFromEmail = await prisma.attendee.findUnique({
            where: {
                eventId_email: {
                    email,
                    eventId
                }
            }
        })

        if(attendeeFromEmail !== null){
            throw new Error('this e-mail is already registered for this event.')
        }

        const [event, amountOfAttendeesForEvent] = await Promise.all([
            prisma.event.findUnique({
                where: {
                    id: eventId
                }
            }),
            prisma.attendee.count({
                where:{
                    eventId
                }
            })
        ])

        if(event?.maximumAttendees && event.maximumAttendees >= amountOfAttendeesForEvent){
            throw new Error('the maximum number of attendees for this event has been reached.')
        }

        const attendee = await prisma.attendee.create({
            data: {
                name,
                email,
                eventId
            }
        })

        return reply.status(201).send({attendeeId: attendee.id})
     })
}