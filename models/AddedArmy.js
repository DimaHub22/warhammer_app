const {Schema, model} = require('mongoose')

const AddedArmy = new Schema({
    unitId: {
        type: String,
    },
    codexId: String,
    categoryId: {
        ref: 'Category',
        type: Schema.Types.ObjectId,
        required: true
    },
    name: String,
    pts: Number,
    model: {
        type: Number,
    },
    image: String,
    power: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        default: ''
    },
    race: String,
    join: {
        type: Boolean,
        default: false
    },
    attachLeader:String,
    attachUnits:[String],
    // leader:[String],
    // category:String
    originCategory:String,
    position:Number,
    squad:[String],
    screenshotOne:String,
    screenshotSecond:String,
    count:Number,
    transportCount:Number,
    canBeEmbarkedCount:{ count:{ type:Number, default: 0}, checked:{type:Boolean,default: false}},
    embark:{
        type:Boolean,
        defauil:false
    },
    attachUnitsForTransport:[String],

})

module.exports = model('AddedArmy', AddedArmy)