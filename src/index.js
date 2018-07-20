const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const axios = require('axios')
const cors = require('cors')
const Poro = require('./models/poro')
const User = require('./models/user')
const Type = require('./models/type')
const Helmet = require('./models/helmet')
const Session = require('./models/session')
const Weapon = require('./models/weapon')
const Misc = require('./models/misc')
const StatChange = require('./models/statchange')
const Footwear = require('./models/footwear')
const bcrypt = require('bcrypt')
const porosRouter = require('./controllers/poros')
const usersRouter = require('./controllers/users')
const typesRouter = require('./controllers/types')
const config = require('./utils/config')
const mongoose = require('mongoose')
const poroutils = require('./utils/poroutils')

const generateToken = () => {
  return(Math.round(Math.random()*10000000))
}

const createSession = (id) => {
  var token = generateToken()
  console.log(token)
  bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
    var session = Session({hash: hash, id: id, created: new Date()})
    session.save()
      .then(res => {
        console.log(res)
        return(token)
      })
      .catch(error=> {
        console.log("error: "+error)
        return(null)
      })
  })
}

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
app.use(express.static('build'))
app.use('/api/poros', porosRouter)
app.use('/api/users', usersRouter)
app.use('/api/types', typesRouter)

app.get('/validatesession', async (request, response) => {
  try{
    var currentSession = await Session.find({userid: request.get('Id')})[0]
    bcrypt.compare(request.get('Token'), currentSession.hash, function(err, res) {
      if(currentSession.created.getTime()<new Date().getTime() && res){
        User.find({userid: request.get('Id')})
          .populate({ path: 'poros', populate: { path: 'type', model: Type } })
          .populate({ path: 'mainporo', populate: { path: 'type', model: Type } })
          .populate({ path: 'helmet', populate: { path: 'statchange', model: StatChange } })
          .populate({ path: 'weapon', populate: { path: 'statchange', model: StatChange } })
          .populate({ path: 'misc', populate: { path: 'statchange', model: StatChange } })
          .populate({ path: 'footwear', populate: { path: 'statchange', model: StatChange } })
          .then(result => {
            if(result){
              response.send({valid: true, user: result})
            }else{
              response.send({valid: false})
            }
          })
          .catch(error => {
            response.send({valid: false})
          })
        response.send({valid: true, user: userdata})
      }else{
        response.send({valid: false})
      }
    })
  }catch(e){
    response.send({valid: false})
  }
})

app.get('/validate', async (request, response) => {
  try {
    var conf = {
      "headers": {
        "Authorization": 'OAuth ' + request.get('access_token'),
        "Accept": 'application/vnd.twitchtv.v5+json',
        "Client-ID": config.client_id
      }
    }
    var r = await axios.get('https://api.twitch.tv/kraken', conf)
    if (!r.data.token.valid) {
      var r2 = await axios.post('https://api.twitch.tv/kraken/oauth2/token?grant_type=refresh_token&refresh_token=' + request.get('refresh_token') + '&client_id=' + config.client_id + '&client_secret=' + config.secret)
      if (r2.data.access_token && r2.data.refresh_token) {
        conf = {
          "headers": {
            "Authorization": 'OAuth ' + r2.data.access_token,
            "Accept": 'application/vnd.twitchtv.v5+json',
            "Client-ID": config.client_id
          }
        }
        var u1 = await axios.get('https://api.twitch.tv/kraken', conf)
        var user1 = await User.find({ twitchid: u1.data.token.user_id })
          .populate({ path: 'poros', populate: { path: 'type', model: Type } })
          .populate({ path: 'mainporo', populate: { path: 'type', model: Type } })
        user1 = user1[0]
        if (u1.data.token.user_name != user1.name) {
          user = await User(user1).save()
            .populate({ path: 'poros', populate: { path: 'type', model: Type } })
            .populate({ path: 'mainporo', populate: { path: 'type', model: Type } })
            .populate({ path: 'helmet', populate: { path: 'statchange', model: StatChange } })
            .populate({ path: 'weapon', populate: { path: 'statchange', model: StatChange } })
            .populate({ path: 'misc', populate: { path: 'statchange', model: StatChange } })
            .populate({ path: 'footwear', populate: { path: 'statchange', model: StatChange } })
          response.send({ valid: true, user, access_token: r2.data.access_token, refresh_token: r2.data.refresh_token })
        } else {
          let aToken = request.get('access_token')
          let rToken = request.get('refresh_token')
          if (r.data.access_token) {
            aToken = r.data.access_token
          }
          if (r.data.refresh_token) {
            rToken = r.data.refresh_token
          }
          response.send({ valid: true, user: user1, access_token: aToken, refresh_token: rToken })
        }
      }
    } else {
      var user1 = await User.find({ twitchid: r.data.token.user_id })
        .populate({ path: 'poros', populate: { path: 'type', model: Type } })
        .populate({ path: 'mainporo', populate: { path: 'type', model: Type } })
        .populate({ path: 'helmet', populate: { path: 'statchange', model: StatChange } })
        .populate({ path: 'weapon', populate: { path: 'statchange', model: StatChange } })
        .populate({ path: 'misc', populate: { path: 'statchange', model: StatChange } })
        .populate({ path: 'footwear', populate: { path: 'statchange', model: StatChange } })
      user1 = user1[0]
      if (r.data.token.user_name != user1.name) {
        var user = await User(user1).save()
          .populate({ path: 'poros', populate: { path: 'type', model: Type } })
          .populate({ path: 'mainporo', populate: { path: 'type', model: Type } })
          .populate({ path: 'helmet', populate: { path: 'statchange', model: StatChange } })
          .populate({ path: 'weapon', populate: { path: 'statchange', model: StatChange } })
          .populate({ path: 'misc', populate: { path: 'statchange', model: StatChange } })
          .populate({ path: 'footwear', populate: { path: 'statchange', model: StatChange } })
        response.send({ valid: true, user, access_token: r.data.access_token, refresh_token: r.data.refresh_token })
      } else {
        let aToken = request.get('access_token')
        let rToken = request.get('refresh_token')
        if (r.data.access_token) {
          aToken = r.data.access_token
        }
        if (r.data.refresh_token) {
          rToken = r.data.refresh_token
        }
        response.send({ valid: true, user: user1, access_token: aToken, refresh_token: rToken })
      }
    }
  } catch (exception) {
    response.send({ valid: false, error: exception })
  }
})


app.get('/addsnacks', async (request, response) => {
  try {
    if (request.query.token === config.token && request.query.username && request.query.amount) {
      const user = await User.find({ name: request.query.username })
      let res = await User.findByIdAndUpdate(user[0]._id, { $set: { snacks: user[0].snacks + Number(request.query.amount) } })
        .populate({ path: 'poros', populate: { path: 'type', model: Type } })
        .populate({ path: 'mainporo', populate: { path: 'type', model: Type } })
        .populate({ path: 'helmet', populate: { path: 'statchange', model: StatChange } })
        .populate({ path: 'weapon', populate: { path: 'statchange', model: StatChange } })
        .populate({ path: 'misc', populate: { path: 'statchange', model: StatChange } })
        .populate({ path: 'footwear', populate: { path: 'statchange', model: StatChange } })
      response.send({message: 'Added '+request.query.amount+' snacks to user '+request.query.username, user: res})
    } else {
      response.send('error')
    }
  } catch (exception) {
    response.send(exception)
  }
})

app.get('/buyporo', async (request, response) => {
  try {
    if (request.get('access_token')) {
      const conf = {
        "headers": {
          "Authorization": 'OAuth ' + request.get('access_token'),
          "Accept": 'application/vnd.twitchtv.v5+json',
          "Client-ID": config.client_id
        }
      }
      var res = await axios.get('https://api.twitch.tv/kraken', conf)
      if (res.data.token.user_id) {
        var user = await User.find({ twitchid: res.data.token.user_id })
          .populate('poros')
        if (user[0].snacks >= 100) {
          var types = await Type.find({})
          const poro = poroutils.getPoro(types, user._id)
          var p = await Poro(poro).save()
          const poros = user[0].poros.concat(p._id)
          var u = await User.findByIdAndUpdate(user[0]._id, { $set: { poros: poros, snacks: user[0].snacks - 100 } })
            .populate({ path: 'poros', populate: { path: 'type', model: Type } })
            .populate({ path: 'mainporo', populate: { path: 'type', model: Type } })
            .populate({ path: 'helmet', populate: { path: 'statchange', model: StatChange } })
            .populate({ path: 'weapon', populate: { path: 'statchange', model: StatChange } })
            .populate({ path: 'misc', populate: { path: 'statchange', model: StatChange } })
            .populate({ path: 'footwear', populate: { path: 'statchange', model: StatChange } })
          u.snacks -= 100
          response.send({ new_poro: p, user: u })
        } else {
          response.send({ error: 'not enough snacks' })
        }
      } else {
        response.send({ error: 'invalid session' })
      }
    } else {
      response.send({ error: 'invalid session' })
    }
  }catch (exception) {
    response.send(exception)
  }
})

app.get('/data', (request, response) => {
  Type.find({})
    .then(types => response.send({ types: types }))
})

app.get('/login', async (request, response) => {
  try {
    if (request.query.code) { // OAuth
      const code = request.query.code
      const req = 'https://api.twitch.tv/api/oauth2/token?client_id=' + config.client_id + '&client_secret=' + config.secret + '&code=' + code + '&grant_type=authorization_code&redirect_uri=https://poros.herokuapp.com/'
      var res = await axios.post(req)
      console.log("1")
      if (res.data.access_token) {
        const conf = {
          "headers": {
            "Authorization": 'OAuth ' + res.data.access_token,
            "Accept": 'application/vnd.twitchtv.v5+json',
            "Client-ID": config.client_id
          }
        }
        var r = await axios.get('https://api.twitch.tv/kraken', conf)
        var currentUser = await User.find({ twitchid: r.data.token.user_id }) // Is user in database?
        console.log("2")
        if (currentUser.length === 0) { // Create a DB entry
          const newUser = User({
            name: r.data.token.user_name,
            twitchid: r.data.token.user_id,
            snacks: 0,
            picture: '',
            weapon: config.no_weapon,
            mainporo: config.no_weapon,
            misc: config.no_misc,
            helmet: config.no_helmet,
            footwear: config.no_footwear,
            poros: [],
            items: [],
            achievements: [],
            access_token: res.data.access_token,
            refresh_token: res.data.refresh_token
          })
          var currentUser2 = await newUser.save()
          User.find({ twitchid: r.data.token.user_id })
          var types = await Type.find()
          var newPoro = poroutils.getPoro(types, currentUser2._id)
          var newPoro2 = await Poro(newPoro).save()
          currentUser2.mainporo = newPoro2._id
          console.log("3")
          if (currentUser2.poros === undefined) {
            currentUser2.poros = [newPoro2._id]
          } else {
            currentUser2.poros = currentUser2.poros.concat(newPoro2._id)
          }
          var res2 = await axios.post('https://id.twitch.tv/oauth2/token?client_id=' + config.client_id + '&client_secret=' + config.secret + '&grant_type=client_credentials')
          const conf2 = {
            "headers": {
              "Authorization": 'OAuth ' + res2.data.access_token,
              "Accept": 'application/vnd.twitchtv.v5+json',
              "Client-ID": config.client_id
            }
          }
          var userData = await axios.get('https://api.twitch.tv/helix/users?id=' + r.data.token.user_id, conf2)
          currentUser2.picture = userData.data.data[0].profile_image_url
          console.log("4")
          const removeTokens = ({name, twitchid, snacks, picture, weapon, helmet, footwear, misc, mainporo, poros, items, achievements}) => ({name, twitchid, snacks, picture, weapon, helmet, footwear, misc, mainporo, poros, items, achievements})
          var user1 = await User.findByIdAndUpdate(currentUser2._id, { $set: { mainporo: currentUser2.mainporo, poros: currentUser2.poros, picture: currentUser2.picture } })
            .populate({ path: 'poros', populate: { path: 'type', model: Type } })
            .populate({ path: 'mainporo', populate: { path: 'type', model: Type } })
            .populate({ path: 'helmet', populate: { path: 'statchange', model: StatChange } })
            .populate({ path: 'weapon', populate: { path: 'statchange', model: StatChange } })
            .populate({ path: 'misc', populate: { path: 'statchange', model: StatChange } })
            .populate({ path: 'footwear', populate: { path: 'statchange', model: StatChange } })
          response.send({ user: removeTokens(user1), new_account: true, session: createSession(user1._id) })
        } else {
          console.log("5")
          console.log(createSession(user1._id))
          var user1 = await User.findById(currentUser[0]._id)
            .populate({ path: 'poros', populate: { path: 'type', model: Type } })
            .populate({ path: 'mainporo', populate: { path: 'type', model: Type } })
            .populate({ path: 'helmet', populate: { path: 'statchange', model: StatChange } })
            .populate({ path: 'weapon', populate: { path: 'statchange', model: StatChange } })
            .populate({ path: 'misc', populate: { path: 'statchange', model: StatChange } })
            .populate({ path: 'footwear', populate: { path: 'statchange', model: StatChange } })
          response.send({ user: removeTokens(user1), new_account: false, session: createSession(user1._id) })
        }
      }
    } else {
      response.send({ error: 'missing code' })
    }
  }catch (exception) {
    console.log('error')
    response.send({error: exception})
  }
})

app.get('/setmainporo', async (request, response) => {
  try {
    if (request.query.id&&request.query.token) {
      const id = request.query.id
      const token = request.query.token
      const conf = {
        "headers": {
          "Authorization": 'OAuth ' + token,
          "Accept": 'application/vnd.twitchtv.v5+json',
          "Client-ID": config.client_id
        }
      }
      var r = await axios.get('https://api.twitch.tv/kraken', conf)
      var currentUser = await User.find({twitchid: r.data.token.user_id})
      if(currentUser[0].poros.filter(x => x == id).length>0){
        const u = await User.findByIdAndUpdate(currentUser[0]._id, {$set: {mainporo: id}})
        response.send('Main Poro changed')
      }
    } else {
      response.send('missing id')
    }
  }catch (exception) {
    console.log('error')
    response.send(exception)
  }
})

app.use('/*', express.static('build'))

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