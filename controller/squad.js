const Squad = require('../models/Squad')
const Units = require('../models/Units')

class Squads {

    async createSquad(req, res) {
        try {

            const {squad} = req.body

            const squads = await Squad.findOne({squad})

            if (squads) {
                return res.status(400).json({error: true, message: "Duplicate"})
            }

            const newSquad = await new Squad({
                squad
            })


            await newSquad.save()
            res.status(201).json({error: false, message: "Squad added"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async getSquadAll(req, res) {
        try {
            const squards = await Squad.find()

            res.status(200).json(squards)

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateSquadUnit(req, res) {
        try {

            const squad = await Units.findOneAndUpdate(
                {_id: req.params.id},
                {$set: req.body}
            )

            res.status(201).json({error: false, message: "Squad update"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateSquadUnitCount(req, res) {
        try {

            await Units.findOneAndUpdate(
                {_id: req.params.id},
                {$set: req.body}
            )


            res.status(201).json({error: false, message: "Squad update"})
        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async attachUnit(req, res) {
        try {

                await Units.findOneAndUpdate(
                    {_id: req.params.id},
                    {$set: req.body}
                )

            res.status(200).json({error: false, message: "Added unit"})
        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

}

module.exports = new Squads()