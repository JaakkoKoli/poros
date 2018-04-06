let persons = [
      {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Martti Tienari",
        "number": "040-123456",
        "id": 2
      },
      {
        "name": "Arto Järvinen",
        "number": "040-123456",
        "id": 3
      },
      {
        "name": "Lea Kutvonen",
        "number": "040-123456",
        "id": 4
      }
    ]

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const Person = require('./models/person')

morgan.token('content', function (req, res) { return JSON.stringify(req.body) })

app.use(express.static('build'))
app.use(morgan(':method :url :content :status :res[content-length] - :response-time ms'))
app.use(bodyParser.json())


app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
    Person.find({}).then(r => {
      res.send('puhelinluettelossa on '+r.length+' henkilön tiedot<br /><br />'+Date())
    })
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(r => {
      persons = r.map(Person.format)
      persons.forEach(p => console.log(p))
      res.json(persons)
    }).catch(error => {
      console.log(error)
    })
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    
    Person.findById(id).then(r => {
      person = Person.format(r)
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    }).catch(error => {
      console.log(error)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    
    Person.findByIdAndRemove(id).then(a => {
      response.status(204).end()
    }).catch(error => {
      console.log(error)
    })
})

const generateId = () => {
    return Math.round(Math.random()*1000000)
}
  
app.post('/api/persons', (request, response) => {
  const body = request.body
  Person.find({name: body.name}).then(persons => {
    if (body.name === undefined) {
      return response.status(400).json({error: 'name missing'})
    }

    if (body.number === undefined) {
        return response.status(400).json({error: 'number missing'})
    }

    if (persons.length>0) {
        return response.status(400).json({error: 'name must be unique'})
    }

    const person = new Person({
      name: body.name,
      number: body.number
    })

    person.save().then(res => {
      response.json(Person.format(person))
    }).catch(e => {
      console.log(e)
    })
  })
})

app.put('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const body = request.body
  Person.findByIdAndUpdate({ _id: id }, { $set: { number: body.number }}).then(r => response.json(r)).catch(e => {
    console.log(e)
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})