const KeyWords = require('../models/KeyWords')

class KeyWord {

    async createKeyWord(req,res){

        try {

            const {keyword} = req.body

            const newKeyWord = new KeyWords({
                keyword
            })

            await newKeyWord.save()

            res.status(201).json({error: false, message: "Key word successfully created"})

        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async getAllKeywords(req,res){
        try {

            const keywords = await KeyWords.find()

            res.status(201).json(keywords)

        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }




}
module.exports = new KeyWord()