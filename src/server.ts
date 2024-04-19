import fastify from 'fastify'
import { serializerCompiler, validatorCompiler,} from 'fastify-type-provider-zod'
import { createEvent } from './routes/create-event'
import { registerForEvent } from './routes/register-for-event'
import { getEvent } from './routes/get-events'


const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createEvent)
app.register(registerForEvent)
app.register(getEvent)

app.listen({port: 3030}).then(() =>{
    console.log('server is running!')
})