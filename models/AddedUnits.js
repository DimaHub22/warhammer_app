const {Schema, model} = require('mongoose')

const AddedUnits = new Schema({
    idCodex:String,
    name: String,
    image: String,
    listName:{
        type:String,
        default: ''
    },
    favorite:{
        type:Boolean,
        default:false
    },
    dateChange:String,
    detachment:String

})

module.exports = model('AddedUnits', AddedUnits)