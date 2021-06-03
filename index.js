require('dotenv').config()
const { request, response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const person = require('./models/person')

const app = express()

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

// virheellisten pyyntöjen käsittely
  const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id '})
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: message })
    }

    next(error)
  }

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

app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(persons => {
        if (person) {
            response.json(persons)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
  })

app.get('/info', (req, res) => {
    Person.find({}).then(persons => {
        res.send(`<p>Phonebook has info for ${persons.length} people<br>
        <br>
        ${new Date()}           
        </p>`)
    })
  })

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
          .then((updatedPerson) => {
             response.json(updatedPerson)
          })
          .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

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

    person.save()
          .then(savedPerson => savedPerson.toJSON())
          .then(savedAndFormattedPerson => {
              response.json(savedAndFormattedPerson)
          })
          .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id).then(result => {
        response.status(204).end()
    })
    .catch(error => next(error));
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'Unknown endpoint' })
  }

  // olemattomien osoitteiden käsittely
  app.use(unknownEndpoint)

  app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})