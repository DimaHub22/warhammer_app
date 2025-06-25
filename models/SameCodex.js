const {Schema, model} = require('mongoose')

const SameCodex = new Schema({
    sharedDetachments:[String]

})

module.exports = model('SameCodex', SameCodex)