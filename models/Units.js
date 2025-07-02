const {Schema, model} = require('mongoose')

const Unit = new Schema({
    categoryId: {
        ref: 'Category',
        type: Schema.Types.ObjectId,
        required: true
    },
    name:String,
    secondName:{
        type: String,
        default: ''
    },
    pts:{
        type:Number,
        default: 0
    },
    ptsForModel:[{model:Number, pts:Number, checked:Boolean, position:Number}],
    image:{
        type: String,
        default: ''
    },
    screenshotOne: {
        type: String,
        default: ''
    },
    screenshotSecond: {
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

    canBeEmbarkedCount:{ count:{ type:Number, default: 0}, checked:{type:Boolean, default: false}},
    attach:[String],
    attachUnitTransport:[String],
    leader:[String],
    moreLeader:[String],
    moreSecond:[String],
    attachTransport:[String],

    enchancements:[String],
    alliedUnits:[String],
    categoryAllide:String,
    sameCodex:[String],
    sameUnit:{type:Boolean, default: false},
    allideUnit:{type:Boolean, default: false},
    originUnitId:String


})

module.exports = model('Unit', Unit)