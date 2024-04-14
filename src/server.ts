import fastify from 'fastify'

const app = fastify()

app.get('/', (request, reply)=>{
    return 'Hello ignite'
})

app.listen({port: 3030}).then(() =>{
    console.log('server is running!')
})