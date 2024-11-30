const {Schema, model} = require('mongoose')

const KeyWords = new Schema({
    keyword:{
        type:String,
        default: ''
    },
    position:Number
})

module.exports = model('KeyWords', KeyWords)