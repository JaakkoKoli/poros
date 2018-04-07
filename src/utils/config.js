if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const port = process.env.PORT
const mongoUrl = process.env.MONGODB_URI
const secret = process.env.SECRET
const client_id = process.env.CLIENT_ID
const no_weapon = process.env.NO_WEAPON_ID
const no_misc = process.env.NO_MISC_ID
const no_helmet = process.env.NO_HELMET_ID
const no_footwear = process.env.NO_FOOTWEAR_ID
const token = process.env.TOKEN

module.exports = {
  mongoUrl, port, secret, client_id, no_weapon, no_misc, no_helmet, no_footwear, token
}