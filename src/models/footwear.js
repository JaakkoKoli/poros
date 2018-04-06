const mongoose = require('mongoose')

const Footwear = mongoose.model('Footwear', {
    name: String,
    description: String,
    statchange: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StatChange' }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

module.exports = Footwear