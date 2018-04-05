const mongoose = require('mongoose')

const Misc = mongoose.model('Misc', {
    name: String,
    description: String,
    statchange: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StatChange' }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

module.exports = Misc