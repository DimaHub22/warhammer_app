const {Schema, model} = require('mongoose')

const Squad = new Schema({
    squad: String
})

module.exports = model('Squad', Squad)