const express = require('express')
const app = express()
const port = 3001

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
    console.log(remainPeople)
    response.status(204).end()
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})