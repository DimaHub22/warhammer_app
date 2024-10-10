const Codex = require('../models/Codex')


class Codexes {
    async createCodex(req, res ){
        try {

            const {title, items} = req.body
            const newCodex = await new Codex({
                title,items
            })

            await newCodex.save()
            res.status(201).json({error: false, message: "Codex successfully created"})


        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async getCodex(req,res){
        try {
            const codex = await Codex.find()
            res.status(200).json(codex)

        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async getCodexId(req,res){
        try {
            console.log(req.params)
            const codex = await Codex.findOne({items:req.params.id})
            console.log(codex)
        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }
}

module.exports = new Codexes()