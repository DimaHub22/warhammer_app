const Units = require('../models/Units')

class Unit {

    async createUnit(req, res){
        try {

            const {categoryId, name, pts,image,race} = req.body
            const newUnit = await new Units({
                categoryId, name, pts,image,race
            })

            await newUnit.save()
            res.status(201).json({error: false, message: "Unit successfully created"})



        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async getUnits(req,res){
        try {

            const units = await Units.find()
            res.status(200).json(units)

        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async getUnitsCategory(req,res){
        try {

            const units = await Units.find({categoryId:req.query.category, race:req.query.idCodex})
            res.status(200).json(units)

        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }


}

module.exports = new Unit()