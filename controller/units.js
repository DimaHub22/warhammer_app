const Units = require('../models/Units')
const fs = require('fs/promises');

class Unit {

    async createUnit(req, res) {
        try {

            const {categoryId, name, pts, image, race} = req.body


            const newUnit = new Units({
                categoryId,
                name,
                pts,
                image: req.file ? req.file.path : '',
                race
            })

            await newUnit.save()
            res.status(201).json({error: false, message: "Unit successfully created"})

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

    async getUnitsCategory(req, res) {
        try {

            const units = await Units.find({categoryId: req.query.category, race: req.query.idCodex})
            res.status(200).json(units)

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateUnit(req, res) {

        try {
            const update = {
                categoryId: req.body.categoryId,
                name: req.body.name,
                pts: req.body.pts,
                image: req.file ? req.file.path : '',
                race: req.body.race
            }


            await Units.findOneAndUpdate(
                {_id: req.params.id},
                {$set: update}
            )
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

                await fs.rm(`./${unit.image}`);
            }

            await Units.deleteOne({_id: req.params.id})

            res.status(200).json({error: false, message: "Delete"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async searchUnit(req, res) {
        try {
            const {query} = req.query

            if (!query) {
                return res.status(400).json({error: true, message: "Not found"})
            }

            const units = await Units.find(
                {'name': {"$regex": query}}
            )
            res.json(units)

        } catch (e) {

        }
    }


}

module.exports = new Unit()