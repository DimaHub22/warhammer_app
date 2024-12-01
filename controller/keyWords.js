const KeyWords = require('../models/KeyWords')

class KeyWord {

    async createKeyWord(req, res) {

        try {

            const {keyword, position} = req.body

            const key = await KeyWords.findOne({position: position})

            if (!key) {

                const newKeyWord = new KeyWords({
                    keyword, position
                })

                await newKeyWord.save()

            } else {
                return res.status(400).json({error: true, message: "The number exists", messageError:"The number exists"})
            }


            res.status(201).json({error: false, message: "Key word successfully created"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async getAllKeywords(req, res) {
        try {

            const keywords = await KeyWords.find()

            res.status(201).json(keywords)

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async getKeywordId(req, res) {
        try {
            const keyword = await KeyWords.findOne({_id: req.params.id})

            res.status(201).json(keyword)
        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateKeyword(req, res) {

        try {
            const keyword = {
                keyword: req.body.keyword,
                position: req.body.position
            }
            const keyUp = await KeyWords.findOne({_id: req.params.id})
            const key = await KeyWords.findOne({position: req.body.position})

            if (keyUp && key) {
                await KeyWords.updateOne({_id: key._id}, {$set: {position: keyUp.position}})
                await KeyWords.updateOne({_id: req.params.id}, {$set: keyword})
            } else {
                await KeyWords.updateOne({_id: req.params.id}, {$set: keyword})
            }
            res.status(200).json({error: false, message: "Update"})


        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async deleteKeywordId(req,res){
        try {


           await KeyWords.deleteOne({_id:req.params.id})


            res.status(200).json({error: false, message: "Delete keyword"})

        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

}

module.exports = new KeyWord()