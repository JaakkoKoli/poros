const mongoose = require('mongoose')

const Statchange = mongoose.model('Statchange', {
    stat: String,
    flat: Boolean,
    amount: Number
})

module.exports = Statchange