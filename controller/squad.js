const Squad = require('../models/Squad')
const Units = require('../models/Units')
const AddedArmy = require('../models/AddedArmy')
const AddedUnits = require('../models/AddedUnits')
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
    async attachUnitTransport(req, res) {
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

    async updateLeaderForUnit(req, res) {
        try {


            const {add, leader} = req.body

            const unit = await Units.findOne({_id: req.params.id})

            if (add) {
                if (!unit.leader.includes(leader)) {
                    await Units.updateOne(
                        {_id: req.params.id},
                        {$push: {'leader': leader}}
                    )
                }
            } else{
                await Units.updateOne(
                    {_id: req.params.id},
                    {$pull: {'leader': leader}}
                )
            }

            res.status(200).json({error: false, message: "Added leader"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateSecondLeaderForLeader(req, res) {
        try {

            const {add, leader} = req.body

            const unit = await Units.findOne({_id: req.params.id})

            if (add) {
                if (!unit.leader.includes(leader)) {
                    await Units.updateOne(
                        {_id: req.params.id},
                        {$push: {'moreLeader': leader}}
                    )
                }
            } else {
                await Units.updateOne(
                    {_id: req.params.id},
                    {$pull: {'moreLeader': leader}}
                )
            }

            res.status(200).json({error: false, message: "Added leader"})
        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateArrSecondLeaderForLeader(req, res) {
        try {

            const {units} = req.body

            await Units.updateOne(
                {_id: req.params.id},
                {$set: {'moreLeader': units}}
            )

            res.status(200).json({error: false, message: "Added leader"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateLeaderForSecondLeader(req, res) {
        try {

            const {add, leader} = req.body

            const unit = await Units.findOne({_id: req.params.id})

            if (add) {
                if (!unit.leader.includes(leader)) {
                    await Units.updateOne(
                        {_id: req.params.id},
                        {$push: {'moreSecond': leader}}
                    )
                }
            } else {
                await Units.updateOne(
                    {_id: req.params.id},
                    {$pull: {'moreSecond': leader}}
                )
            }

            res.status(200).json({error: false, message: "Added leader"})
        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateArrLeaderForSecondLeader(req, res) {
        try {

            const {units} = req.body

            await Units.updateOne(
                {_id: req.params.id},
                {$set: {'moreSecond': units}}
            )

            res.status(200).json({error: false, message: "Added leader"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }


    async updateUnitForTransport(req, res) {
        try {

            const {add, leader} = req.body

            const unit = await Units.findOne({_id: req.params.id})

            if (add) {
                if (!unit.leader.includes(leader)) {
                    await Units.updateOne(
                        {_id: req.params.id},
                        {$push: {'attachTransport': leader}}
                    )
                }
            } else {
                await Units.updateOne(
                    {_id: req.params.id},
                    {$pull: {'attachTransport': leader}}
                )
            }

            res.status(200).json({error: false, message: "Added leader"})
        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateTransportNewUnit(req, res) {
        try {

            const unit = await Units.findOne({_id: req.params.id})

            if (!unit) {
                return res.status(400).json({error: true, message: "Error service"})
            }

            await Units.findOneAndUpdate(
                {_id: req.params.id},
                {$set: {'attachTransport': req.body.attachTransport}}
            )

            res.status(200).json({error: false, message: "Added unit"})
        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }


    async resetApp(req,res){
        try {

            await Units.updateMany(
                {},
                {$set:{"pts": 0, "squad":[],'canBeEmbarkedCount.count':0,'canBeEmbarkedCount.checked': false,
                        "transportCount": 0, "attach": [], "ptsForModel": [], "moreSecond": [],"attachTransport": [],
                        "leader": [], "moreLeader":[],"attachUnitTransport":[] }}
            )

            await AddedArmy.deleteMany({})
            await AddedUnits.deleteMany({})


            res.status(200).json({error: false, message: "Successful app reset"})
        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }
}

module.exports = new Squads()