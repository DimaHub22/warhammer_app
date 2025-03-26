const {Schema, model} = require('mongoose')


const Codex = new Schema({
    title: String,
    items: [
        {
            name: String,
            image: String,
            rules: [{content: String}],
            detachments:[{title:String, detachment:String}]
        }
        ]
})

module.exports = model('Codex', Codex)