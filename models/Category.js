const {Schema,model} =  require('mongoose')

const Category = new Schema({

    category: {
        type:String,
        required: true
    },
    image:{
        type:String
    }

})

module.exports = model('Category',Category)