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
                screenshotSecond,
                count,
                transportCount,
                canBeEmbarkedCount,
                attachUnitTransport,
                attachTransport,
                attach,
                secondName
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
                screenshotSecond,
                count,
                transportCount,
                canBeEmbarkedCount,
                attachUnitTransport,
                attachTransport,
                attach,
                secondName
            })


            await unit.save()
            res.status(201).json(unit)
            // res.status(201).json({error: false, message: "Unit added"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async duplicateUnit(req, res) {
        try {
            const {
                attach,
                attachTransport,
                attachUnitTransport,
                attachUnits,
                attachUnitsForTransport,
                canBeEmbarkedCount,
                categoryId,
                codexId,
                count,
                description,
                image,
                join,
                model,
                name,
                originCategory,
                position,
                power,
                pts,
                race,
                screenshotOne,
                screenshotSecond,
                squad,
                transportCount,
                unitId,
                enchantmentUnit,
                secondName
            } = req.body.unit

            const unit = await new AddedArmy({
                attach,
                attachTransport,
                attachUnitTransport,
                attachUnits,
                attachUnitsForTransport,
                canBeEmbarkedCount,
                categoryId,
                codexId,
                count,
                description,
                image,
                join,
                model,
                name,
                originCategory,
                position,
                power,
                pts,
                race,
                screenshotOne,
                screenshotSecond,
                squad,
                transportCount,
                unitId,
                enchantmentUnit,
                secondName
            })

            await unit.save()
            res.status(201).json(unit)


        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async duplicateArmySquad(req, res) {
        try {

            const unit = await AddedArmy.findOne({_id: req.params.id})


            let squad

            if (unit.attachUnits.length !== 0) {
                const leader = unit
                const attach = await AddedArmy.find({_id: {$in: leader.attachUnits}})
                 squad = [leader, ...attach]


            }

            if (unit.attachLeader) {
                const leader = await AddedArmy.findOne({_id: unit.attachLeader})
                const attach = await AddedArmy.find({_id: {$in: leader.attachUnits}})
                 squad = [leader, ...attach]
            }


            // if(squad.length !== 0){
                let newCodex2 = []
                squad.forEach(item => {

                    const newUnits = {
                        _id: item._id,
                        unitId: item.unitId,
                        categoryId: item.categoryId,
                        name: item.name,
                        secondName:item.secondName,
                        pts: item.pts,
                        model: item.model,
                        image: item.image,
                        power: item.power,
                        description: item.description,
                        race: item.race,
                        codexId: item.codexId,
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
                        // enchantmentUnit: {
                        //     name:item.enchantmentUnit.name,
                        //     detachmentId:item.enchantmentUnit.detachmentId,
                        //     enchantPts:item.enchantmentUnit.enchantPts,
                        //     enchantId:item.enchantmentUnit.enchantId
                        // }
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

                });

                const AddedArmys = [];
                duplicatedArray.forEach(doc => {
                    AddedArmys.push(doc); // Добавляем каждый документ в массив
                });


                AddedArmy.insertMany(AddedArmys)
                // AddedArmys.forEach(async item => {
                //     const unit = await new AddedArmy(item)
                //
                //     await unit.save()
                // })

                res.status(201).json({error: false, message: "Duplicate squad"})
            // }




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


    async deleteManyUnits(req, res) {
        try {
            await AddedArmy.deleteMany({_id: {$in: req.body.units}})

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

                if (leaderAttach && leaderAttach.attachUnits.length !== 0) {
                    // console.log(leaderAttach)
                } else {

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

    async addAttachUnitForTransport(req, res) {
        try {
            const {unit, updateArr, embark} = req.body

            const unitAttach = await AddedArmy.findOne({_id: unit})


            if (!updateArr) {
                if (Array.isArray(unit)) {
                    const transports = await AddedArmy.findOne({_id: req.params.id})

                    if (transports && transports.attachUnitsForTransport.length !== 0) {

                        const transport = await AddedArmy.findOneAndUpdate(
                            {_id: req.params.id},
                            {
                                $set: {'attachUnitsForTransport': [...unit, ...transports.attachUnitsForTransport]},
                                'embark': embark
                            }
                        )

                    } else {
                        const transport = await AddedArmy.findOneAndUpdate(
                            {_id: req.params.id},
                            {$set: {'attachUnitsForTransport': unit}, 'embark': embark}
                        )
                    }

                    // const transport = await AddedArmy.findOneAndUpdate(
                    //     {_id: req.params.id},
                    //     {$set:{'attachUnitsForTransport': unit},'embark': embark}
                    // )

                } else {
                    const transport = await AddedArmy.findOneAndUpdate(
                        {_id: req.params.id},
                        {$push: {'attachUnitsForTransport': unit}, 'embark': embark}
                    )

                }

            } else {
                if (Array.isArray(unit)) {

                    const transport = await AddedArmy.findOneAndUpdate(
                        {_id: req.params.id},
                        {$pullAll: {'attachUnitsForTransport': unit}}
                    )

                    const transports = await AddedArmy.findOne({_id: req.params.id})

                    if (transports && transports.attachUnitsForTransport.length === 0) {
                        await AddedArmy.findOneAndUpdate(
                            {_id: req.params.id},
                            {$set: {'categoryId': transports.originCategory}, 'embark': false, 'join': false}
                        )
                    }

                    if (transports && transports.attachUnitsForTransport.length !== 0) {

                        // const transport = await AddedArmy.findOneAndUpdate(
                        //     {_id: req.params.id},
                        //     {$set:{'attachUnitsForTransport': [...unit, ...transports.attachUnitsForTransport]},'embark': embark}
                        // )

                    } else {
                        // const transport = await AddedArmy.findOneAndUpdate(
                        //     {_id: req.params.id},
                        //     {$set:{'attachUnitsForTransport': unit},'embark': embark}
                        // )
                    }

                    // const transport = await AddedArmy.findOneAndUpdate(
                    //     {_id: req.params.id},
                    //     {$set:{'attachUnitsForTransport': unit},'embark': embark}
                    // )

                } else {

                    const transport = await AddedArmy.findOneAndUpdate(
                        {_id: req.params.id},
                        {$pull: {'attachUnitsForTransport': unit}}
                    )

                    const transports = await AddedArmy.findOne({_id: req.params.id})

                    if (transports && transports.attachUnitsForTransport.length === 0) {
                        await AddedArmy.findOneAndUpdate(
                            {_id: req.params.id},
                            {$set: {'categoryId': transports.originCategory}, 'embark': false, 'join': false}
                        )
                    }

                }
            }
            //
            //     const leader = await AddedArmy.findOneAndUpdate(
            //         {_id: req.params.id},
            //         {$push: {'attachUnitsForTransport': unit}, 'embark': embark}
            //     )
            // } else {
            //     const leader = await AddedArmy.findOneAndUpdate(
            //         {_id: req.params.id},
            //         {$pull: {'attachUnitsForTransport': unit}, 'embark': embark}
            //     )
            //
            //     const leaderAttach = await AddedArmy.findOne({_id: req.params.id})
            //     if(leaderAttach && leaderAttach.attachUnits.length !== 0){
            //         // console.log(leaderAttach)
            //     }else{
            //
            //         const leader = await AddedArmy.findOneAndUpdate(
            //             {_id: req.params.id},
            //             {'embark': false}
            //         )
            //     }
            // }

            res.status(200).json({error: false, message: "Added"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateUnitsFromTransport(req, res) {
        try {
            const {units} = req.body

            const unitsUpdate = await AddedArmy.find({_id: {$in: units}})

            if (unitsUpdate) {
                unitsUpdate.forEach(async item => {

                    const updatedUnit = await AddedArmy.findOneAndUpdate(
                        {_id: item._id},
                        {$set: {"categoryId": item.originCategory}}
                    )

                })

                res.status(200).json({error: false, message: "Added"})

            }


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

    async changeUnit(req, res) {
        try {

            const secondLeader = await AddedArmy.findOne({_id: req.params.id})
            const leader = await AddedArmy.findOne({_id: req.body.idLeader})


            const newArr = secondLeader.attachUnits.filter(item => item !== req.body.idLeader)

            await AddedArmy.findOneAndUpdate({_id: req.body.idLeader}, {
                $set: {
                    'attachLeader': '',
                    'attachUnits': [...newArr, req.params.id]
                }
            })
            await AddedArmy.findOneAndUpdate({_id: req.params.id}, {
                $set: {
                    'attachLeader': req.body.idLeader,
                    'attachUnits': []
                }
            })


            if (secondLeader) {
                const attachUnit = secondLeader.attachUnits.find(item => item !== req.body.idLeader)
                if (attachUnit) {
                    // const unit = await AddedArmy.findOne({_id: attachUnit})

                    await AddedArmy.findOneAndUpdate({_id: attachUnit}, {$set: {'attachLeader': req.body.idLeader}})

                }
            }

            res.status(200).json({error: false, message: "Update"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateCoutn(req, res) {
        try {
            const {count} = req.body

            await AddedArmy.findOneAndUpdate({_id: req.params.id}, {$set: {'count': count}})

            res.status(200).json({error: false, message: "Update"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async disembarkTransport(req, res) {
        try {

            const {unitsNotJoin} = req.body

            if (unitsNotJoin.length !== 0) {

                const units = await AddedArmy.find({_id: {$in: unitsNotJoin}})
                units.map(async item => {
                    await AddedArmy.findOneAndUpdate(
                        {_id: item._id},
                        {$set: {'categoryId': item.originCategory}}
                    )

                })
            }

            await AddedArmy.findOneAndUpdate(
                {_id: req.params.id},
                {$set: req.body})

            res.status(200).json({error: false, message: "Disembark"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    ///////////////////////ATTACH//////////////

    async addAttachLeaderForSquad(req, res) {
        try {
            const {unitId} = req.body

            const secondLeader = await AddedArmy.findOne({_id: req.params.id})

            await AddedArmy.findOneAndUpdate({_id: unitId}, {
                $set: {
                    'attachLeader': '',
                    'attachUnits': [...secondLeader.attachUnits, req.params.id]
                }
            })
            await AddedArmy.findOneAndUpdate({_id: req.params.id}, {
                $set: {
                    'attachLeader': unitId,
                    'attachUnits': []
                }
            })
            await AddedArmy.findOneAndUpdate({_id: secondLeader.attachUnits[0]}, {
                $set: {
                    'attachLeader': unitId,
                }
            })


            res.status(200).json({error: false, message: "Added"})


        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    /////////////////////////////////////////

////////////////////////////////////DETACH///////////////////////////////////////////////////////////
    async detachLeader(req, res) {
        try {

            const secondLeader = await AddedArmy.findOne({_id: req.params.id})
            const leader = await AddedArmy.findOne({_id: req.body.idLeader})


            const newArr = secondLeader.attachUnits.filter(item => item !== req.body.idLeader)

            await AddedArmy.findOneAndUpdate({_id: req.body.idLeader}, {
                $set: {
                    'attachLeader': '',
                    'attachUnits': [...newArr]
                }
            })

            await AddedArmy.findOneAndUpdate(
                {_id: req.params.id},
                {
                    $set: {
                        'attachLeader': '',
                        'attachUnits': [],
                        "categoryId": secondLeader.originCategory,
                        "join": false
                    }
                })

            if (secondLeader) {
                const attachUnit = secondLeader.attachUnits.find(item => item !== req.body.idLeader)
                if (attachUnit) {

                    await AddedArmy.findOneAndUpdate({_id: attachUnit}, {$set: {'attachLeader': req.body.idLeader}})
                }
            }

            res.status(200).json({error: false, message: "Update"})


        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async detachSecond(req, res) {
        try {
            const unit = await AddedArmy.findOne({_id: req.params.id})

            const updatedUnit = await AddedArmy.findOneAndUpdate(
                {_id: req.params.id},
                {
                    $set: {
                        'join': false,
                        'attachLeader': '',
                    }
                }
            )

            const leader = await AddedArmy.findOneAndUpdate(
                {_id: unit.attachLeader},
                {$pull: {'attachUnits': unit._id}}
            )

            res.status(200).json({error: false, message: "Update"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async detachUnits(req, res) {
        try {

            const leader = await AddedArmy.findOne({_id: req.params.id})
            const {units} = req.body

            if (units.length !== 0) {

                if (units.length === 1) {

                    const unitId = units[0]
                    const unit = await AddedArmy.findOne({_id: unitId})

                    if (unit) {
                        await AddedArmy.updateMany(
                            {_id: unitId},
                            {$set: {"categoryId": unit.originCategory, 'join': false, 'attachLeader': ''}}
                        )

                        await AddedArmy.findOneAndUpdate(
                            {_id: unit.attachLeader},
                            {$set: {'attachUnits': [], 'join': false}}
                        )

                    }


                } else {

                    const unitId1 = units[0]
                    const unit1 = await AddedArmy.findOne({_id: unitId1})

                    await AddedArmy.updateMany(
                        {_id: unitId1},
                        {$set: {"categoryId": unit1.originCategory}, 'join': false, 'attachLeader': ''}
                    )

                    const unitId2 = units[1]
                    const unit2 = await AddedArmy.findOne({_id: unitId2})

                    await AddedArmy.updateMany(
                        {_id: unitId2},
                        {$set: {"categoryId": unit2.originCategory}, 'join': false, 'attachLeader': ''}
                    )

                    const {leaderId} = req.body

                    const leaderAttach = await AddedArmy.findOne({_id: leaderId})

                    if (leaderAttach && leaderAttach.attachUnits.length !== 0) {
                        await AddedArmy.findOneAndUpdate(
                            {_id: leaderId},
                            {'join': false, 'attachUnits': []}
                        )
                    }
                }

            }


            res.status(200).json({error: false, message: "Update"})


        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

//////////////////////////////////////////////////////////////////////////////////////////////
   async changeEnchantmentUnit(req,res){
        try {
            const {enchantmentUnit} = req.body

            await AddedArmy.findOneAndUpdate({_id:req.params.id},
                {$set:{'enchantmentUnit':enchantmentUnit}})

            res.status(200).json({error: false, message: "Update enchantment"})

        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

}





module.exports = new AddArmy()