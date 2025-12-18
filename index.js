require('dotenv').config() //TO use environmental variables in .env file

const Person = require('./models/person')
const express = require('express') //Web Framework used to create APIs (get,post,put,delete,etc)
const app = express()
const PORT = process.env.PORT || 3001

const morgan = require('morgan')
const logger = morgan('tiny')
const cors = require('cors')

app.use(express.json()) //express middleware to enable express to understand JSON data in requests: https://www.geeksforgeeks.org/web-tech/express-js-express-json-function/

app.use(express.static('dist')) //Serving static files in Express: https://expressjs.com/en/starter/static-files.html

app.use(morgan('tiny')) // https://expressjs.com/en/resources/middleware/morgan.html

app.use(cors()) //CORS node.js package middleware to enable CORS: https://github.com/expressjs/cors

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
  response.send('Hello Phonebook!')
})

// API connected with MongoDB
app.get('/api/info', (request, response) => {
    Person.countDocuments({}).then(count => {
        const total = count
        let currentDate = new Date()
        response.write(`<p> Phonebook has info for ${total} people </p>` + `<p></p>` + `<p> ${currentDate} </p>`)
        response.end()
    }).catch(error => {
        console.error(error)
        response.status(500).end()
    })
})

// API connected with MongoDB
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons=> {
    response.json(persons)
  })
})

// API connected with MongoDB
app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
      if (person){
        response.json(person)
      } else {
        response.status(404).end
      }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// API connected with MongoDB
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ error: 'content missing' })
    }

    // const exists = persons.find(p =>  p.name === body.name )
    // if (exists) {
    //     return response.status(400).json({error: 'name must be unique '})
    // }

    const newPerson = new Person({
        name: body.name,
        number: body.number,
    })

    newPerson.save().then(p => {
    response.json(p)
    })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

//****************** Error Handler ************************/
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  next(error)
}

// este debe ser el último middleware cargado, ¡también todas las rutas deben ser registrada antes que esto!
app.use(errorHandler)
//*********************************************************/

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})