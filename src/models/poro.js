const mongoose = require('mongoose')

const Poro = mongoose.model('Poro', {
    name: String,
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'Type' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: Date,
    experience: Number,
    level: Number,
    healthIV: Number,
    attackIV: Number,
    defenseIV: Number,
    staminaIV: Number,
    speedIV: Number
})

module.exports = Poro