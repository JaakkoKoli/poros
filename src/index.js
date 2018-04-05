const http = require('http')
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

mongoose
  .connect(config.mongoUrl)
  .then(() => {
    console.log('connected to database', config.mongoUrl)
  })
  .catch(err => {
    console.log(err)
  })

mongoose.Promise = global.Promise

app.use(cors())
app.use(bodyParser.json())

app.get('/debug', async (request, response) => {
  response.send('works')
})


const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app, server
}