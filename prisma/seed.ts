import { prisma } from "../src/lib/prisma"

async function seed(){
    await prisma.event.create({
        data: { 
            id: 'f4822b38-f789-4157-9adc-0242b0966592',
            tittle: 'United Summit',
            slug: 'united-summit',
            details: 'Um evento p/ devs apaixonados <3',
            maximumAttendees: 120
        }
    }) 
}

seed().then(() => {
    console.log('Database seeded')
    prisma.$disconnect()
})