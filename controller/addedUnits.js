const AddedUnits = require('../models/AddedUnits')
const AddedArmy = require('../models/AddedArmy')

class AddUnit {

    async addUnit(req,res){
        try {

            const {idCodex,name,image} = req.body

            const newUnit = await new AddedUnits({
                idCodex,name,image
            })
            await newUnit.save()
            res.status(201).json({error: false, message: 'Added unit access'})

        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async getAddedUnits(req,res){
        try {

            const units = await AddedUnits.find()
            res.status(200).json(units)

        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async getAddedUnitById(req,res){
        try {
            const addedUnit = await AddedUnits.findOne({_id:req.params.id})
            res.status(200).json(addedUnit)

        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }

    }

    async deleteAddedUnit(req,res){
        try {

                const units = await AddedArmy.find({codexId:req.params.id})

            await AddedUnits.deleteOne({_id: req.params.id})

            if(units){
                await AddedArmy.deleteMany({codexId:req.params.id})
            }


            res.status(200).json({error: false, message: "Delete access"})

        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateLongList(req,res){
        try {

            await AddedUnits.findOneAndUpdate(
                {_id: req.params.id},
                {$set:req.body},
                {new: true}
            )
            res.status(200).json({error: false, message: "Update access"})

        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }



}

module.exports = new AddUnit()