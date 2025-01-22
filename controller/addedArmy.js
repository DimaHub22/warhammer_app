const AddedArmy = require('../models/AddedArmy')
const Units = require('../models/Units')
const {ObjectId} = require('mongodb');

class AddArmy {


    async addUnitToArmy(req, res) {
        try {

            const {
                unitId,
                categoryId,
                name,
                pts,
                model,
                image,
                power,
                description,
                race,
                codexId,
                join,
                attachLeader,
                originCategory,
                position,
                squad,
                screenshotOne,
                screenshotSecond

            } = req.body

            const unit = await new AddedArmy({
                unitId,
                codexId,
                categoryId,
                name,
                pts,
                model,
                image,
                power,
                description,
                race,
                join,
                attachLeader,
                originCategory,
                position,
                squad,
                screenshotOne,
                screenshotSecond
            })


            await unit.save()
            res.status(201).json(unit)
            // res.status(201).json({error: false, message: "Unit added"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async getArmy(req, res) {
        try {

            const units = await AddedArmy.find()
            res.status(200).json(units)

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async getArmyOfCodex(req, res) {
        try {

            const units = await AddedArmy.find({race: req.params.race, codexId: req.params.codexId})
            res.status(200).json(units)

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async getArmyId(req, res) {
        try {

            const units = await AddedArmy.findOne({_id: req.params.id})
            res.status(200).json(units)

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async deleteUnit(req, res) {
        try {

            await AddedArmy.deleteOne({_id: req.params.id})

            res.status(201).json({error: false, message: "Unit deleted"})
        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateArmyPower(req, res) {
        try {

            const power = await AddedArmy.findOneAndUpdate(
                {_id: req.params.id},
                {$set: req.body},
                {new: true}
            )


            res.status(201).json({error: false, message: "Power update"})
        } catch (e) {
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

    async addAttachUnitForLeader(req, res) {
        try {
            const {unit, updateArr, join} = req.body

            const unitAttach = await AddedArmy.findOne({_id: unit})


            if (!updateArr) {
                const leader = await AddedArmy.findOneAndUpdate(
                    {_id: req.params.id},
                    {$push: {'attachUnits': unit}, 'join': join}
                )
            } else {
                const leader = await AddedArmy.findOneAndUpdate(
                    {_id: req.params.id},
                    {$pull: {'attachUnits': unit}, 'join': join}
                )

                const leaderAttach = await AddedArmy.findOne({_id: req.params.id})
                if(leaderAttach && leaderAttach.attachUnits.length !== 0){
                    // console.log(leaderAttach)
                }else{

                    const leader = await AddedArmy.findOneAndUpdate(
                        {_id: req.params.id},
                        {'join': false}
                    )
                }
            }

            res.status(200).json({error: false, message: "Added"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateAddedUnitForArmy(req, res) {
        try {
            const unit = await AddedArmy.findOne({_id: req.params.id})
            const {join, category, attachLeader} = req.body

            const updatedUnit = await AddedArmy.findOneAndUpdate(
                // const updatedUnit = await AddedArmy.updateMany(
                {_id: req.params.id},
                {
                    $set: {
                        "categoryId": category ? category : unit && unit.originCategory ? unit.originCategory : category,
                        join,
                        'attachLeader': attachLeader ? attachLeader : ''
                    }
                }
            )

            res.status(200).json({error: false, message: "Update"})
        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }

    }

    async changeUnit(req,res){
        try {

            const secondLeader = await AddedArmy.findOne({_id: req.params.id})
            const leader = await AddedArmy.findOne({_id: req.body.idLeader})


            const newArr = secondLeader.attachUnits.filter(item => item !== req.body.idLeader)

            await AddedArmy.findOneAndUpdate({_id: req.body.idLeader}, {$set:{'attachLeader': '', 'attachUnits':[...newArr, req.params.id]}})
            await AddedArmy.findOneAndUpdate({_id: req.params.id}, {$set:{'attachLeader': req.body.idLeader, 'attachUnits':[]}})


            if(secondLeader){
                const attachUnit = secondLeader.attachUnits.find(item => item !== req.body.idLeader)
                if(attachUnit){
                    // const unit = await AddedArmy.findOne({_id: attachUnit})

                    await AddedArmy.findOneAndUpdate({_id: attachUnit},{$set:{'attachLeader': req.body.idLeader}})

                }
            }

            res.status(200).json({error: false, message: "Update"})

        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }


}

module.exports = new AddArmy()