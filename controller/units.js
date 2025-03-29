const Units = require('../models/Units')
const AddedArmy = require('../models/AddedArmy')

const fsPromises = require('fs/promises');
const fs = require('fs');

class Unit {

    async createUnit(req, res) {
        try {

            const {categoryId, name, pts, image, race, keywords} = req.body


            const newUnit = new Units({
                categoryId,
                name,
                pts,
                image: req.file ? req.file.path : '',
                race,
                keywords
            })

            await newUnit.save()

            res.status(201).json(newUnit)
            // res.status(201).json({error: false, message: "Unit successfully created"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async screenOne(req,res){
        try {
            const unit =await Units.findOne({_id:req.params.id})

            if(unit){
                await Units.findOneAndUpdate(
                    {_id:req.params.id},
                    {$set:{'screenshotOne':req.file ? req.file.path : ''}}
                )

            }
            res.status(201).json({error:false, message:"Add screen"})
        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }
    async screenSecond(req,res){
        try {
            const unit =await Units.findOne({_id:req.params.id})

            if(unit){
                await Units.findOneAndUpdate(
                    {_id:req.params.id},
                    {$set:{'screenshotSecond':req.file ? req.file.path : ''}}
                )

            }
            res.status(201).json({error:false, message:"Add screen"})
        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }
    async getUnitId(req,res){
        try {
            const unit  = await Units.findOne({_id:req.params.id})
            res.status(200).json(unit)


        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }
    async addPtsForModel(req, res) {
        try {

            await Units.findOneAndUpdate(
                {_id: req.params.id},
                {$set: {ptsForModel: req.body}}
            )

            res.status(201).json({error: false, message: "Add models"})


        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updatePtsAndModel(req, res) {
        try {

            if (req.body.checked) {
                const model = await Units.findOne({_id: req.params.id, 'ptsForModel.position': req.body.position})

                if (model) {

                    await Units.updateOne({
                        _id: req.params.id,
                        'ptsForModel.position': req.body.position
                    }, {$set: {'ptsForModel.$.pts': req.body.pts, 'ptsForModel.$.model': req.body.model}})

                } else {
                    await Units.findOneAndUpdate({_id: req.params.id}, {$push: {'ptsForModel': req.body}})
                }


            } else {
                await Units.findOneAndUpdate({_id: req.params.id}, {$pull: {'ptsForModel': {'model': req.body.model}}})
            }


            res.status(201).json({error: false, message: "Models update"})
        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async getUnits(req, res) {
        try {

            const units = await Units.find()
            res.status(200).json(units)

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async getUnitsOfCodex(req,res){
        try {

            const units = await Units.find({race: req.params.race})
            res.status(200).json(units)

        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }
    async getUnitsArr(req, res) {
        try {

            const arr = req.query.arr
            const units = await Units.find({ _id: { $in: req.query.arr } })
            res.status(200).json(units)

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async getUnitsCategory(req, res) {
        try {

            const units = await Units.find({categoryId: req.query.category, race: req.query.idCodex})
            console.log(req.query)
            res.status(200).json(units)

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateUnit(req, res) {
        try {
            let update = {
                categoryId: req.body.categoryId,
                name: req.body.name,
                pts: req.body.pts,
                // image: req.file ? req.file.path : '',
                race: req.body.race,
                keywords: req.body.keywords
            }

            if (req.file) {
                update.image = req.file.path
            }


            await Units.findOneAndUpdate(
                {_id: req.params.id},
                {$set: update}
            )

            // const addedArmy = await AddedArmy.find({unitId: req.params.id})
            //
            // if (addedArmy) {
            //     let unit = {
            //         name: req.body.name,
            //         pts: req.body.pts,
            //     }
            //
            //     if (req.file) {
            //         unit.image = req.file.path
            //     }
            //
            //
            //     await AddedArmy.updateMany(
            //         {unitId: req.params.id},
            //         {$set: unit}
            //     )
            // }
            res.status(200).json({error: false, message: "Update"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async deleteUnit(req, res) {
        try {

            const unit = await Units.findOne({_id: req.params.id})

            if (unit) {
                const imageName = unit.image.replace(/uploads/g, '').slice(1)

                fs.access(`${imageName}`, async function (error) {

                    if (error) {

                        console.log("Файл не найден");
                        await Units.deleteOne({_id: req.params.id})

                    } else {
                        await fsPromises.rm(`./${unit.image}`);
                        await Units.deleteOne({_id: req.params.id})
                        console.log("Файл найден");

                    }

                });


            }


            res.status(200).json({error: false, message: "Delete"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async searchUnit(req, res) {
        try {
            const {query, race} = req.query

            if (!query) {
                return res.status(400).json({error: true, message: "Not found"})
            }
            console.log(req.query)
            const units = await Units.find(
                {'name': {"$regex": query}, 'race':{"$regex": race}}
            )
            res.json(units)

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async searchSquadUnit(req,res){
        try {
            const {squad,race} = req.query

            if (!squad) {
                return res.status(400).json({error: true, message: "Not found"})
            }

            const units = await Units.find(
                {'squad': {"$regex": squad}, 'race':{"$regex": race}}
            )

            res.json(units)

        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }

    }

    async getUnitsRorRace(req,res){
        try {

            const units = await Units.find(
                {'race':req.query.codex}
            )
            res.json(units)

        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }
    async searchSquadUnitTransport(req, res){
        try {
            const {race} = req.query

            if (!race) {
                return res.status(400).json({error: true, message: "Not found"})
            }
            const units = await Units.find(
                {'canBeEmbarkedCount.checked':true, 'race':{"$regex": race}}
            )
            res.json(units)
        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }


}

module.exports = new Unit()