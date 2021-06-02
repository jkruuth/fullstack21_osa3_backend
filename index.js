require('dotenv').config()
const { request, response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

/* let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },

    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5352367"
    },

    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-123456"
    },

    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-123456"
    }
] */

const generateRndId = () => {
    return Math.floor(Math.random() * 1000)
}

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :info"))

morgan.token('info', (request) => {
    return JSON.stringify(request.body)
})

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
  })

app.get('/info', (req, res) => {
    const lkm = persons.length
    res.send(`<p>Phonebook has info for ${lkm} people<br>
             <br>
             ${new Date()}           
             </p>`)
  })

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (body.name === undefined || body.number === undefined) {
        return response.status(400).json({ error: 'Name or number is missing'})
    }

    /* const found = Persons.find(person => person.name === body.name)

    if (found !== undefined) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    } */

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id).then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status.send({ error: 'Unknown endpoint' })
  }

  // olemattomien osoitteiden käsittely
  app.use(unknownEndpoint)


  // virheellisten pyyntöjen käsittely
  const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id '})
    }

    next(error)
  }

  app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})