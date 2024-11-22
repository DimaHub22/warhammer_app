const {Schema, model} = require('mongoose')

const KeyWords = new Schema({
    keyword:{
        type:String,
        default: ''
    }
})

module.exports = model('KeyWords', KeyWords)