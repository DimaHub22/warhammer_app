const {Schema, model} = require('mongoose')


const Codex = new Schema({
    title: String,
    items: [
        {
            name: String,
            image: String,
            rules: [{content: String,name:String,color:String}],
            detachments:[{title:String, detachment:String, shared:Boolean,codexId:String,color:String}],
            stratagems:[{content: String, detachmentId:String, pcCost:Number,name:String,color:String}],
            enhancements:[{content: String, detachmentId:String, enchantPts:Number,name:String,color:String}]
        }
        ]
})

module.exports = model('Codex', Codex)