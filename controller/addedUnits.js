const AddedUnits = require('../models/AddedUnits')
const AddedArmy = require('../models/AddedArmy')
const {ObjectId} = require('mongodb');

class AddUnit {

    async addUnit(req, res) {
        try {

            const {idCodex, name, image, dateChange, detachment} = req.body

            const newUnit = await new AddedUnits({
                idCodex, name, image, dateChange, detachment
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
            const {idCodex, name, image, listName, favorite, _id, dateChange, detachment,armyPoints} = req.body.codex

            const codexNew = await new AddedUnits({
                idCodex, name, image, listName, favorite, dateChange, detachment,armyPoints
            })
            await codexNew.save()


            const units = await AddedArmy.find({"codexId": _id})

            console.log(codexNew)

            if (units && units.length !== 0) {

                let newCodex2 = []

                units.forEach(item => {

                    const newUnits = {
                        _id: item._id,
                        unitId: item.unitId,
                        categoryId: item.categoryId,
                        name: item.name,
                        secondName: item.secondName,
                        pts: item.pts,
                        model: item.model,
                        image: item.image,
                        power: item.power,
                        description: item.description,
                        race: item.race,
                        codexId: codexNew._id,
                        join: item.join,
                        embark: item.embark,
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
                        attachUnitsForTransport: item.attachUnitsForTransport,
                        attach: item.attach,
                        enchantmentUnit: {
                            name: item.enchantmentUnit.name,
                            detachmentId: item.enchantmentUnit.detachmentId,
                            enchantPts: item.enchantmentUnit.enchantPts,
                            enchantId: item.enchantmentUnit.enchantId
                        },
                        alliedUnits:item.alliedUnits,
                        categoryAllide:item.categoryAllide,
                        sameCodex:item.sameCodex
                        // lastId: item._id
                    }
                    newCodex2.push(newUnits)

                })


                const duplicatedArray = newCodex2.map(doc => ({
                    ...doc,
                    _id: new ObjectId(),
                }));


                const idMapping = {};
                newCodex2.forEach((oldDoc, index) => {
                    const newDoc = duplicatedArray[index];
                    idMapping[oldDoc._id.toString()] = String(newDoc._id);
                });

                // Шаг 3: Обновляем ссылки в дубликате
                duplicatedArray.forEach(newDoc => {
                    // Обновляем attachLeader
                    if (newDoc.attachLeader && idMapping[newDoc.attachLeader.toString()]) {
                        newDoc.attachLeader = idMapping[newDoc.attachLeader.toString()];
                    }

                    // Обновляем attachUnits
                    if (newDoc.attachUnits && newDoc.attachUnits.length > 0) {
                        newDoc.attachUnits = newDoc.attachUnits.map(unitId => {
                            return idMapping[unitId.toString()] || unitId;
                        });

                        [...new Set(newDoc.attachUnits)]
                    }

                    // Обновляем attachUnitsForTransport (если есть)
                    if (newDoc.attachUnitsForTransport && newDoc.attachUnitsForTransport.length > 0) {
                        newDoc.attachUnitsForTransport = newDoc.attachUnitsForTransport.map(unitId => {
                            return idMapping[unitId.toString()] || unitId;
                        });
                    }
                });

                const AddedArmys = [];
                duplicatedArray.forEach(doc => {
                    AddedArmys.push(doc); // Добавляем каждый документ в массив
                });


                AddedArmys.forEach(async item => {
                    const unit = await new AddedArmy(item)

                    await unit.save()
                })

                // res.status(201).json({error: false, message: "Duplicate race"})
                res.status(201).json(codexNew)
            } else {
                // res.status(201).json({error: false, message: "Duplicate race"})
                res.status(201).json(codexNew)
            }


        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async favoriteRace(req, res) {
        try {

            const {favorite} = req.body

            const codex = await AddedUnits.findOneAndUpdate({_id: req.params.id}, {$set: {'favorite': favorite}})

            res.status(200).json({error: false, message: "Favorite race"})
        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async lockCodex(req, res) {
        try {

            const {lock} = req.body

            const codex = await AddedUnits.findOneAndUpdate({_id: req.params.id}, {$set: {'lock': lock}})

            res.status(200).json({error: false, message: "Lock codex"})
        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async addDateForCodex(req, res) {
        try {

            await AddedUnits.findOneAndUpdate(
                {_id: req.params.id},
                {$set: {'dateChange': req.body.dateChange}}
            )

            res.status(200).json({error: false, message: "Added date"})

        } catch (e) {
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
            const {listName, detachment,armyPoints ,changeDetach} = req.body
            console.log(armyPoints)
            await AddedUnits.findOneAndUpdate(
                {_id: req.params.id},
                {$set: {"listName": listName, "detachment": detachment, armyPoints}},
                {new: true}
            )
            if (changeDetach) {
                await AddedArmy.updateMany({'codexId': req.params.id},
                    {$set: {'enchantmentUnit': {}}})
            }


            res.status(200).json({error: false, message: "Update access"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }


}

module.exports = new AddUnit()