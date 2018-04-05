const mongoose = require('mongoose')

const Helmet = mongoose.model('Helmet', {
    name: String,
    description: String,
    statchange: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StatChange' }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

module.exports = Helmet