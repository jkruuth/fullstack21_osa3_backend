const { request, response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')


const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('build'))


let persons = [
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
]

const generateRndId = () => {
    return Math.floor(Math.random() * 1000)
}

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :info"))

morgan.token('info', (request) => {
    return JSON.stringify(request.body)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
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

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'something is missing'
        })
    }

    const found = persons.find(person => person.name === body.name)

    if (found !== undefined) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateRndId(),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)

    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})