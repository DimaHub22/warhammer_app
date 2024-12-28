const {Schema, model} = require('mongoose')

const Unit = new Schema({
    categoryId: {
        ref: 'Category',
        type: Schema.Types.ObjectId,
        required: true
    },
    name:String,
    pts:{
        type:Number,
        default: 0
    },
    ptsForModel:[{model:Number, pts:Number, checked:Boolean, position:Number}],
    image:{
        type: String,
        default: ''
    },
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
    race:String,

    keywords:String,
    squad:[String],
    transportCount:{
        type:Number,
        default: 0
    },

    canBeEmbarkedCount:{ count:{ type:Number, default: 0}, checked:{type:Boolean,default: false}},
    attach:[String]


})

module.exports = model('Unit', Unit)