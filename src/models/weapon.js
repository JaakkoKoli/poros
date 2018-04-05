const mongoose = require('mongoose')

const Weapon = mongoose.model('Weapon', {
    name: String,
    description: String,
    statchange: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StatChange' }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

module.exports = Weapon