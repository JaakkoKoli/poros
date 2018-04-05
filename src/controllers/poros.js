const porosRouter = require('express').Router()
const Poro = require('../models/poro')

porosRouter.get('/', async (request, response) => {
    try{
        const poros = await Poro.find({})
        response.json(poros)
    } catch (exception) {
        console.log(exception)
        response.status(400).send({ error: 'malformatted id' })
    }
})

porosRouter.get('/:id', async (request, response) => {
    try{
        const poro = await Poro.findById(request.params.id)
        if(poro){
            response.json(poro)
        }
        response.status(404).end()
    } catch (exception) {
        console.log(exception)
        response.status(400).send({ error: 'malformatted id' })
    }
})

module.exports = porosRouter