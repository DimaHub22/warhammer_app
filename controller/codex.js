const Codex = require('../models/Codex')


class Codexes {
    async createCodex(req, res) {
        try {

            const {title, items} = req.body
            const newCodex = await new Codex({
                title, items
            })

            await newCodex.save()
            res.status(201).json({error: false, message: "Codex successfully created"})


        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async createCodexForCategory(req, res) {
        try {
            const codex = await Codex.findOne({_id: req.params.id})

            const newCodex = {
                name:req.body.name,
                image:req.file ? req.file.path : ''
            }

            await Codex.findOneAndUpdate({_id: req.params.id},
                {$push:{'items':newCodex}})

            res.status(201).json({error: false, message: "Codex successfully created"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async codexChange(req,res){
        try {

            const codex = await Codex.findOne({_id:req.body.category,'items._id':req.params.id }, { "items.$": 1 })

            const codexUp = await Codex.findOneAndUpdate({_id:req.body.category,'items._id':req.params.id },
                {$set:{'items.$.name':req.body.name,
                        'items.$.image': req.file ? req.file.path : codex.items[0].image
                }
                })

            res.status(201).json({error: false, message: "Codex successfully created"})

        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async getCodex(req, res) {
        try {
            const codex = await Codex.find()
            res.status(200).json(codex)

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async getIdCodex(req, res) {
        try {

            const codex = await Codex.findOne({_id: req.params.id})
            res.status(200).json(codex)
        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async getCodexId(req, res) {
        try {

            const codex = await Codex.findOne({items: req.params.id})
            res.status(200).json({error: false, message: "Codex"})
        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }
}

module.exports = new Codexes()