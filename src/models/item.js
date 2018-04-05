const mongoose = require('mongoose')

const Item = mongoose.model('Item', {
    name: String,
    description: String,
    type: String
})

module.exports = Item