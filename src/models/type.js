const mongoose = require('mongoose')

const Type = mongoose.model('Type', {
    name: String,
    picture: String,
    rarity: Number,
    baseHealth: Number,
    baseAttack: Number,
    baseDefense: Number,
    baseStamina: Number,
    baseSpeed: Number,
    healthGain: Number,
    attackGain: Number,
    defenseGain: Number,
    staminaGain: Number,
    speedGain: Number
})

module.exports = Type