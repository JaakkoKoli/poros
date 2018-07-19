const mongoose = require('mongoose')

const User = mongoose.model('User', {
    name: String,
    twitchid: String,
    snacks: Number,
    picture: String,
    weapon: { type: mongoose.Schema.Types.ObjectId, ref: 'Weapon' },
    helmet: { type: mongoose.Schema.Types.ObjectId, ref: 'Helmet' },
    footwear: { type: mongoose.Schema.Types.ObjectId, ref: 'Footwear' },
    misc: { type: mongoose.Schema.Types.ObjectId, ref: 'Misc' },
    mainporo: { type: mongoose.Schema.Types.ObjectId, ref: 'Poro' },
    poros: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Poro' }],
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
    achievements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' }],
    access_token: String,
    refresh_token: String
})

module.exports = User