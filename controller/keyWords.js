const KeyWords = require('../models/KeyWords')

class KeyWord {

    async createKeyWord(req,res){

        try {

            const {keyword, position} = req.body

            const newKeyWord = new KeyWords({
                keyword, position
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

    async getKeywordId(req,res){
        try {
            const keyword = await KeyWords.findOne({_id:req.params.id})

            res.status(201).json(keyword)
        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateKeyword(req,res){
        try {
            const keyword = {
                keyword:req.body.keyword,
                position:req.body.position
            }

            await KeyWords.updateOne({_id:req.params.id},{$set:keyword})
            res.status(200).json({error: false, message: "Update"})

        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }




}
module.exports = new KeyWord()