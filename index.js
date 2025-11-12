const express = require('express')
const app = express()
const port = 3001

const morgan = require('morgan')
const logger = morgan('tiny')
const cors = require('cors')

app.use(express.json())

app.use(morgan('tiny'))

app.use(cors())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
  response.send('Hello World!')
})

app.get('/api/info', (request, response) => {
    const total = persons.length
    let currentDate = new Date()
    response.write(`<p> Phonebook has info for ${total} people </p>` + `<p></p>` + `<p> ${currentDate} </p>`)
    response.end()
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    console.log(person)
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    let remainPeople = persons.filter(p => p.id !== id)
    persons = remainPeople
    console.log(remainPeople)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const newId = Math.floor((Math.random()*1000)+1)
    const body = request.body

    console.log(newId)
    console.log(newId)

    if(!body.name || !body.number) {
        return response.status(400).json({ error: 'content missing' })
    }  

    const exists = persons.find(p =>  p.name === body.name )
    if (exists) {
        return response.status(400).json({error: 'name must be unique '})
    }

    const newPerson = {
        id: newId,
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(newPerson)
    response.json(newPerson)


})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})