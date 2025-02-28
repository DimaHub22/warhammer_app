const AddedUnits = require('../models/AddedUnits')
const AddedArmy = require('../models/AddedArmy')

class AddUnit {

    async addUnit(req, res) {
        try {

            const {idCodex, name, image,dateChange} = req.body

            const newUnit = await new AddedUnits({
                idCodex, name, image, dateChange
            })
            await newUnit.save()

            res.status(201).json(newUnit)

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async duplicateRace(req, res) {
        try {
            const {idCodex, name, image, listName, favorite, _id, dateChange} = req.body.codex

            const codexNew = await new AddedUnits({
                idCodex, name, image, listName, favorite,dateChange
            })
            await codexNew.save()


            const units = await AddedArmy.find({"codexId": _id})

            if (units && units.length !== 0) {
                units.forEach(async item => {

                    const newUnits = {
                        unitId: item.unitId,
                        categoryId: item.categoryId,
                        name: item.name,
                        pts: item.pts,
                        model: item.model,
                        image: item.image,
                        power: item.power,
                        description: item.description,
                        race: item.race,
                        codexId: codexNew._id,
                        join: item.join,
                        embark:item.embark,
                        attachLeader: item.attachLeader,
                        attachUnits: item.attachUnits,
                        originCategory: item.originCategory,
                        position: item.position,
                        squad: item.squad,
                        screenshotOne: item.screenshotOne,
                        screenshotSecond: item.screenshotSecond,
                        count: item.count,
                        transportCount: item.transportCount,
                        canBeEmbarkedCount: item.canBeEmbarkedCount,
                        attachUnitTransport: item.attachUnitTransport,
                        attachTransport: item.attachTransport,
                        attachUnitsForTransport:item.attachUnitsForTransport,
                        attach: item.attach,
                        lastId: item._id
                    }


                    const unit = await new AddedArmy(newUnits)

                    await unit.save()

                })


            }

            setTimeout(async () => {
                const unitsNewCodex = await AddedArmy.find({'codexId': String(codexNew._id)})

                if (unitsNewCodex) {
                    const lastUnits = units.filter(item => item.join)

                    if (lastUnits && lastUnits.length !== 0) {

                        const leaderLast = lastUnits.filter(leader => leader.attachUnits.length !== 0)

                        const attachLast = lastUnits.filter(attach => attach.attachLeader)

                        unitsNewCodex.forEach(async item => {

                            if (leaderLast.some(el => String(el._id) === item.lastId)) {

                                const unit = attachLast.filter(e => e.attachLeader === item.lastId)

                                unit.forEach(async u => {

                                    await AddedArmy.findOneAndUpdate({'lastId': u._id}, {$set: {'attachLeader': String(item._id)}})
                                })

                                const attachs = unitsNewCodex.filter(el => unit.some(e => el.lastId === String(e._id))).map(e => String(e._id))

                                await AddedArmy.findOneAndUpdate({_id: item._id}, {$set: {'attachUnits': attachs}})

                            }
                        })

                    }

                    const transportLast = unitsNewCodex.filter( async transport =>{
                        if(transport.embark){
                            const unitForTransport = unitsNewCodex.filter(el => transport.attachUnitsForTransport.includes(el.lastId)).map(e => String(e._id))

                            await AddedArmy.findOneAndUpdate({_id: transport._id}, {$set: {'attachUnitsForTransport': unitForTransport}})
                        }
                    })

                }
            }, 300)


            res.status(201).json({error: false, message: "Duplicate race"})
        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async favoriteRace(req,res){
        try {

            const {favorite} = req.body

            const codex = await AddedUnits.findOneAndUpdate({_id: req.params.id},{$set:{'favorite':favorite}})

            res.status(200).json({error: false, message: "Favorite race"})
        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async addDateForCodex(req,res){
        try {

            await AddedUnits.findOneAndUpdate(
                {_id:req.params.id},
                {$set:{'dateChange': req.body.dateChange}}
            )

            res.status(200).json({error: false, message: "Added date"})

        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async getAddedUnits(req, res) {
        try {

            const units = await AddedUnits.find()
            res.status(200).json(units)

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async getAddedUnitById(req, res) {
        try {
            const addedUnit = await AddedUnits.findOne({_id: req.params.id})
            res.status(200).json(addedUnit)

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }

    }

    async deleteAddedUnit(req, res) {
        try {

            const units = await AddedArmy.find({codexId: req.params.id})

            await AddedUnits.deleteOne({_id: req.params.id})

            if (units) {
                await AddedArmy.deleteMany({codexId: req.params.id})
            }


            res.status(200).json({error: false, message: "Delete access"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateLongList(req, res) {
        try {

            await AddedUnits.findOneAndUpdate(
                {_id: req.params.id},
                {$set: req.body},
                {new: true}
            )
            res.status(200).json({error: false, message: "Update access"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }


}

module.exports = new AddUnit()