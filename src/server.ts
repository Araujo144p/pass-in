import fastify from 'fastify'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { serializerCompiler, validatorCompiler, jsonSchemaTransform} from 'fastify-type-provider-zod'
import { createEvent } from './routes/create-event'
import { registerForEvent } from './routes/register-for-event'
import { getEvent } from './routes/get-events'
import { getAttendeesBadge } from './routes/get-attendees-badge'
import { checkIn } from './routes/check-in'
import { getEventAttendee } from './routes/get-event-attendee'
import { errorHandler } from './error-handler'


const app = fastify()

app.register(fastifySwagger, {
    swagger: {
        consumes: ['application/json'],
        produces: ['application/json'],
        info: {
            title: 'pass.in',
            description: 'Especificações da API para o back-end da aplicação pass.in',
            version: '1.0.0'
        },
    },
    transform: jsonSchemaTransform
})

app.register(fastifySwaggerUI, {
    routePrefix: '/docs',
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createEvent)
app.register(registerForEvent)
app.register(getEvent)
app.register(getAttendeesBadge)
app.register(checkIn)
app.register(getEventAttendee)

app.setErrorHandler(errorHandler)

app.listen({port: 3030}).then(() =>{
    console.log('server is running!')
})