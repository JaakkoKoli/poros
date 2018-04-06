const mongoose = require('mongoose')

const Attribute = mongoose.model('Attribute', {
    name: String,
    position: Number,
    statchanges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Statchange' }]
})

module.exports = Attribute