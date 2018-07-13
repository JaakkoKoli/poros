const mongoose = require('mongoose')

const Session = mongoose.model('Session', {
    userid: String,
    hash: String,
    created: Date
})

module.exports = Session