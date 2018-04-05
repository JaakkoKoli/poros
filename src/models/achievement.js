const mongoose = require('mongoose')

const Achievement = mongoose.model('Achievement', {
    name: String,
    description: String,
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
})

module.exports = Achievement