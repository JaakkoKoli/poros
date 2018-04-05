const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    try{
        const users = await User.find({})
        response.json(users)
    } catch (exception) {
        console.log(exception)
        response.status(400).send({ error: 'malformatted id' })
    }
})

usersRouter.get('/:id', async (request, response) => {
    try{
        const user = await User.findById(request.params.id)
        if(user){
            response.json(user)
        }
        response.status(404).end()
    } catch (exception) {
        console.log(exception)
        response.status(400).send({ error: 'malformatted id' })
    }
})

module.exports = usersRouter