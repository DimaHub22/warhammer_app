const {Schema, model} = require('mongoose')

const Unit = new Schema({
    categoryId: {
        ref: 'Category',
        type: Schema.Types.ObjectId,
        required: true
    },
    name:String,
    pts:Number,
    image:String,
    power:{
        type:Boolean,
        default:false
    },
    count:{
       type: Number,
        default: 0
    },
    codexId:{
        type:String,
        default:''
    },
    description:{
        type: String,
        default: ''
    },
    race:String

})

module.exports = model('Unit', Unit)