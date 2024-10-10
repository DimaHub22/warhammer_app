const {Schema, model} = require('mongoose')


const Codex = new Schema({
    title: String,
    items:[{name:String,image:String}]

})

module.exports = model('Codex', Codex)