const Core = require('../models/CoreStratagrms')

class CoreStratagem {

    async createCoreStratagem(req,res){
        try {
            const {name,color,pcCost,content} = req.body

            const newCore = await new Core({
                name,color,pcCost,content
            })

            await newCore.save()

            res.status(201).json({error: false, message: "Core successfully created"})

        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async getAllCoreStratagem(req,res){
        try {

           const core =  await Core.find()

            res.status(200).json(core)

        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateCoreStratagem(req,res){
        try {
            const{name,color,pcCost,content} = req.body

            await Core.findOneAndUpdate(
                {_id:req.params.id},
                {$set:{name,color,pcCost,content}}
            )


            res.status(200).json({error: false, message: "Core successfully update"})
        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async deleteCoreStratagem(req,res){
        try {
            await Core.deleteOne({_id:req.params.id})

            res.status(200).json({error: false, message: "Core successfully delete"})

        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async saveOrder(req,res){
        try {

            const{core} = req.body

            await Core.deleteMany({});

            await Core.insertMany(core);

            res.status(200).json({error: false, message: "Order successfully save"})
        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

}

module.exports = new CoreStratagem()