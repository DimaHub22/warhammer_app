const AddedArmy = require('../models/AddedArmy')

class AddArmy  {


    async addUnitToArmy(req,res){
        try {

            const {unitId,categoryId,name,pts,model,image,power,description,race,codexId} = req.body
            const unit = await new AddedArmy({
                unitId,codexId,categoryId,name,pts,model,image,power,description,race
            })



            await unit.save()
            res.status(201).json({error: false, message: "Unit added"})

        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async getArmy(req,res){
        try {

            const units = await AddedArmy.find()
            res.status(200).json(units)

        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async getArmyId(req,res){
        try {

            const units = await AddedArmy.findOne({_id:req.params.id})
            res.status(200).json(units)

        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }
    async deleteUnit(req,res){
        try {

            await AddedArmy.deleteOne({_id: req.params.id})

            res.status(201).json({error: false, message: "Unit deleted"})
        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateArmyPower(req,res){
        try {

            const power = await AddedArmy.findOneAndUpdate(
            {_id: req.params.id},
            {$set: req.body},
            {new: true}
            )


            res.status(201).json({error: false, message: "Power update"})
        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    // async duplicateArmy(req, res){
    //     try {
    //
    //
    //         const {categoryId,name,pts,image,power,codexId,description,race,unitId} = req.boby
    //
    //
    //
    //
    //
    //     }catch (e) {
    //         console.log(e)
    //         res.status(400).json({error: true, message: "Error service"})
    //     }
    // }


}

module.exports = new AddArmy()