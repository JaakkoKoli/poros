const typesRouter = require('express').Router()
const Type = require('../models/type')
const poroutils = require('../utils/poroutils')

typesRouter.get('/', async (request, response) => {
    const types = await Type.find({})
    response.json(types)
})

typesRouter.get('/new', async (request, response) => {
    try{
        const types = await Type.find({})
        response.json(poroutils.getType(types))
    }catch(exception){
        response.json({exception: exception})
    }
})

module.exports = typesRouter