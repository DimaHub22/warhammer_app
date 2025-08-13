const {Schema, model} = require('mongoose')

const CoreStartagem = new Schema({
    name:String,
    color:String,
    pcCost:Number,
    content: String,

})

module.exports = model('CoreStartagem', CoreStartagem)