const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const axios = require('axios')
const cors = require('cors')
const Poro = require('./models/poro')
const User = require('./models/user')
const Type = require('./models/type')
const StatChange = require('./models/statchange')
const config = require('./utils/config')
const mongoose = require('mongoose')
const poroutils = require('./utils/poroutils')




app.use(bodyParser.json())

app.get('/debug', async (request, response) => {
  response.send('works')
})

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${config.port}`)
})
