const Units = require('../models/Units')
const AddedArmy = require('../models/AddedArmy')
const {ObjectId} = require('mongodb');

const AddedUnits = require('../models/AddedUnits')

const fsPromises = require('fs/promises');
const fs = require('fs');

class Unit {

    async createUnit(req, res) {
        try {

            const {categoryId, name, pts, image, race, keywords, secondName} = req.body


            const newUnit = new Units({
                categoryId,
                name,
                pts,
                image: req.file ? req.file.path : '',
                race,
                keywords,
                secondName
            })

            await newUnit.save()

            res.status(201).json(newUnit)
            // res.status(201).json({error: false, message: "Unit successfully created"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async screenOne(req, res) {
        try {
            const unit = await Units.findOne({_id: req.params.id})

            if (unit) {
                await Units.findOneAndUpdate(
                    {_id: req.params.id},
                    {$set: {'screenshotOne': req.file ? req.file.path : ''}}
                )

            }
            res.status(201).json({error: false, message: "Add screen"})
        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async screenSecond(req, res) {
        try {
            const unit = await Units.findOne({_id: req.params.id})

            if (unit) {
                await Units.findOneAndUpdate(
                    {_id: req.params.id},
                    {$set: {'screenshotSecond': req.file ? req.file.path : ''}}
                )

            }
            res.status(201).json({error: false, message: "Add screen"})
        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async getUnitId(req, res) {
        try {
            const unit = await Units.findOne({_id: req.params.id})
            res.status(200).json(unit)


        } catch (e) {
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

    async getUnitsOfCodex(req, res) {
        try {

            const units = await Units.find({race: req.params.race})
            // const units = await Units.find({
            //     $or: [
            //         { race: req.params.race },               // Ищем по полю race
            //         { sameCodex: req.params.race }           // Ищем в массиве sameCodex
            //     ]
            // });

            res.status(200).json(units)

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async getUnitsArr(req, res) {
        try {

            const arr = req.query.arr
            const units = await Units.find({_id: {$in: req.query.arr}})
            res.status(200).json(units)

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async getUnitsCategory(req, res) {
        try {

            const units = await Units.find({categoryId: req.query.category, race: req.query.idCodex})

            const alliedUnits = await Units.find({
                alliedUnits: req.query.idCodex,
                categoryAllide: req.query.category // Простая проверка наличия значения в массиве
            });

            const sameCodexUnits = await Units.find({
                sameCodex: req.query.idCodex,
                categoryId: req.query.category
                // categoryAllide: req.query.category // Простая проверка наличия значения в массиве
            });

            // res.status(200).json([...units, ...alliedUnits, ...sameCodexUnits])
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
                race: req.body.race,
                keywords: req.body.keywords,
                secondName: req.body.secondName
            }

            if (req.file) {
                update.image = req.file.path
            }

            await Units.findOneAndUpdate(
                {_id: req.params.id},
                {$set: update},
                {new: true}
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

            const addedArmy = await AddedArmy.find({unitId: req.params.id})

            if (addedArmy.length !== 0) {
                const unitJoin = addedArmy.filter(e => e.join)
                const unitNotJoin = addedArmy.filter(e => !e.join)

                if (unitJoin.length !== 0) {

                    const arrUnitsDelete = unitJoin.flatMap(e => String(e._id))

                    for (const item of unitJoin) {
                        if (item.attachLeader) {

                            const units = await AddedArmy.find({attachUnits: {$in: arrUnitsDelete}})

                            if (units.length !== 0) {
                                const arrLeader = units.flatMap(e => String(e._id))
                                const army = await AddedArmy.find({attachLeader: {$in: arrLeader}})

                                if (army.length !== 0) {
                                    const idArmy = army.map(el => String(el._id)).filter(e => !arrUnitsDelete.includes(e))
                                    const idArmyDelete = army.map(el => String(el._id)).filter(e => arrUnitsDelete.includes(e))

                                    await processDisembark(army, idArmyDelete)

                                    await AddedArmy.deleteMany({_id: {$in: idArmyDelete}})
                                    await AddedArmy.updateMany({_id: {$in: idArmy}},
                                        [
                                            {
                                                $set: {
                                                    join: false,
                                                    attachLeader: "",
                                                    categoryId: "$originCategory"
                                                }
                                            }
                                        ]
                                    )
                                    await AddedArmy.updateMany({_id: {$in: arrLeader}}, {
                                        $set: {
                                            'join': false,
                                            'attachUnits': []
                                        }
                                    })
                                }
                                await AddedArmy.updateMany({_id: {$in: arrLeader}}, {$set: {'join': false}})

                            }

                        }

                        if (item.position === 2 || item.position === 3) {
                            if (item.attachUnits.length !== 0) {

                                const units = await AddedArmy.find({attachLeader: {$in: arrUnitsDelete}})
                                const arrAttach = units.flatMap(e => String(e._id))

                                const leader = await AddedArmy.find({attachUnits: {$in: arrAttach}})

                                if (leader.length !== 0) {
                                    const idArmy = leader.map(el => String(el._id)).filter(e => !arrUnitsDelete.includes(e))
                                    const idArmyDelete = leader.map(el => String(el._id)).filter(e => arrUnitsDelete.includes(e))

                                    await processDisembark(leader, idArmyDelete)

                                    await AddedArmy.deleteMany({_id: {$in: idArmyDelete}})

                                    await AddedArmy.updateMany(
                                        {_id: {$in: arrAttach}},
                                        [
                                            {
                                                $set: {
                                                    join: false,
                                                    attachLeader: "",
                                                    categoryId: "$originCategory" // Используем значение из поля originCategory того же документа
                                                }
                                            }
                                        ]
                                    );

                                }

                            }

                        }

                        if (item.position === 1) {
                            const unitsTransportId = unitJoin.flatMap(e => e.attachUnitsForTransport)

                            const uni = await AddedArmy.find({
                                _id: {$in: unitsTransportId},
                                join: false,
                            })

                            const resetUnitId = uni.flatMap(e => e._id)

                            await AddedArmy.updateMany(
                                {_id: {$in: resetUnitId}},
                                [
                                    {
                                        $set: {
                                            join: false,
                                            categoryId: "$originCategory"
                                        }
                                    }
                                ]
                            );

                            await AddedArmy.deleteMany({_id: {$in: arrUnitsDelete}})
                        }

                    }

                }

                if (unitNotJoin.length !== 0) {

                    const arrUnitsDelete = unitNotJoin.flatMap(e => String(e._id))

                    for (const item of unitNotJoin) {
                        if ([2, 3, 4].includes(item.position)) {

                            const idArmyDelete = unitNotJoin.map(el => String(el._id)).filter(e => arrUnitsDelete.includes(e))

                            await processDisembark(unitNotJoin, idArmyDelete)

                            await AddedArmy.deleteMany({_id: {$in: arrUnitsDelete}})

                        }
                        if (item.position === 1) {
                            await AddedArmy.deleteMany({_id: {$in: arrUnitsDelete}})
                        }

                    }
                }

            }


            async function processDisembark(army, idArmyDelete) {
                const transportArmyDelete = army.filter(e => idArmyDelete.includes(String(e._id))).flatMap(el => el.attachTransport)

                if (transportArmyDelete.length !== 0) {
                    const transport = await AddedArmy.find({
                        unitId: {$in: transportArmyDelete},
                        join: true,
                        embark: true
                    })

                    if (transport.length !== 0) {
                        const unitNotEmbark = transport.filter(e => e.attachUnitsForTransport.some(el => idArmyDelete.includes(el))).flatMap(e => e._id)

                        const units = transport.filter(e => e.attachUnitsForTransport.some(el => idArmyDelete.includes(el))).flatMap(e => e.attachUnitsForTransport)

                        const uni = await AddedArmy.find({
                            _id: {$in: units},
                            join: false,
                        })

                        const resetUnitId = uni.flatMap(e => e._id)

                        await AddedArmy.updateMany(
                            {_id: {$in: resetUnitId}},
                            [
                                {
                                    $set: {
                                        join: false,
                                        categoryId: "$originCategory"
                                    }
                                }
                            ]
                        );


                        await AddedArmy.updateMany(
                            {_id: {$in: unitNotEmbark}},
                            [
                                {
                                    $set: {
                                        join: false,
                                        embark: false,
                                        attachUnitsForTransport: [],
                                        count: 0,
                                        categoryId: "$originCategory"
                                    }
                                }
                            ]
                        );

                    }

                }
            }

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

            const units = await Units.find(
                {'name': {"$regex": query}, 'race': {"$regex": race}}
            )
            res.json(units)

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async searchSquadUnit(req, res) {
        try {
            const {squad, race} = req.query

            if (!squad) {
                return res.status(400).json({error: true, message: "Not found"})
            }

            const units = await Units.find(
                {'squad': {"$regex": squad}, 'race': {"$regex": race}}
            )

            res.json(units)

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }

    }

    async getUnitsRorRace(req, res) {
        try {
            // const units = await Units.find({
            //     $or: [
            //         { race: req.query.codex },
            //         { sameCodex: req.query.codex }
            //     ]
            // });

            const units = await Units.find(
                {'race': req.query.codex}
            )
            res.json(units)

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async searchSquadUnitTransport(req, res) {
        try {
            const {race} = req.query

            if (!race) {
                return res.status(400).json({error: true, message: "Not found"})
            }
            const units = await Units.find(
                {'canBeEmbarkedCount.checked': true, 'race': {"$regex": race}}
            )
            res.json(units)
        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateEnchancements(req, res) {
        try {

            const {enchancements} = req.body

            await Units.findOneAndUpdate({_id: req.params.id},
                {$set: {'enchancements': enchancements}})


            res.status(200).json({error: false, message: "Update enchancements"})
        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateAlliedUnits(req, res) {
        try {
            const {alliedUnits, categoryAllide} = req.body

            await Units.findOneAndUpdate({_id: req.params.id},
                {$set: {'alliedUnits': alliedUnits, 'categoryAllide': categoryAllide}})

            res.status(200).json({error: false, message: "Update allide units"})
        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async deleteUnitForAlliedUnits(req, res) {
        try {

            const {codexId} = req.body

            const codex = await AddedUnits.find({idCodex: codexId})

            const codexIds = codex.flatMap(e => String(e._id))

            const units = await AddedArmy.find({codexId: {$in: codexIds}, alliedUnits: codexId})

            if (units.length !== 0) {
                const deleteUnit = units.flatMap(e => e._id)
                await AddedArmy.deleteMany({_id: {$in: deleteUnit}})
            }


            res.status(200).json({error: false, message: "Update allide units"})
        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateSameCodex(req, res) {
        try {
            const {sameCodex} = req.body

            await Units.findOneAndUpdate({_id: req.params.id},
                {$set: {'sameCodex': sameCodex}})

            res.status(200).json({error: false, message: "Update same codex"})
        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateNewSameCodex(req, res) {
        try {
            const {id, unit, sameCodex} = req.body

            const newUnits = sameCodex.map(codexEntry => {
                const {_id, ...unitWithoutId} = unit;

                return {
                    ...unitWithoutId,
                    race: codexEntry,
                    attach: [],
                    squad: [],
                    leader: [],
                    moreLeader: [],
                    moreSecond: [],
                    attachTransport: [],
                    enchancements: [],
                    canBeEmbarkedCount: {count: 0, checked: false},
                    sameUnit: true,
                    originUnitId: unit._id
                };
            });

            const addedSameUnits = await Units.find({race: {$in: sameCodex}, sameUnit: true})

            if (addedSameUnits.length !== 0) {

                const units = newUnits.filter(e => !addedSameUnits.some(el => el.name === e.name && e.race === el.race))

                const savedUnits = await Units.insertMany(units);

            } else {

                const savedUnits = await Units.insertMany(newUnits);
            }

            await Units.findOneAndUpdate({_id: id},
                {$set: {'sameCodex': sameCodex}})

            res.status(200).json({error: false, message: "Update same codex"})
        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async deleteUnitForSameCodex(req, res) {
        try {
            const {codexId} = req.body

            const unitToDelete = await Units.findOne({race:codexId, originUnitId: req.params.id})
            const clearArrUnit = await Units.find({race:codexId, originUnitId: { $ne: req.params.id }})

            // 3. Подготавливаем операции для bulkWrite
            const bulkOps = clearArrUnit.reduce((ops, unit) => {
                const update = {};
                let needsUpdate = false;

                // Проверяем каждый массив на наличие удаляемого ID
                ['moreSecond', 'moreLeader', 'leader','attach','attachTransport'].forEach(field => {
                    if (unit[field] && unit[field].includes(unitToDelete._id)) {
                        update[field] = unit[field].filter(
                            item => item.toString() !== unitToDelete._id.toString()
                        );
                        needsUpdate = true;
                    }
                });

                if (needsUpdate) {
                    ops.push({
                        updateOne: {
                            filter: { _id: unit._id },
                            update: { $set: update }
                        }
                    });
                }

                return ops;
            }, []);

            // 4. Выполняем массовое обновление
            if (bulkOps.length > 0) {
                await Units.bulkWrite(bulkOps);
            }

            //


////////////

            const originUnit = await Units.findOne({originUnitId: req.params.id, race: codexId})
            const addedArmy = await AddedArmy.find({originUnitId: req.params.id})

            if (addedArmy.length !== 0) {

                const joinUnit = addedArmy.filter(e => e.join)

                const notJoinUnit = addedArmy.filter(e => !e.join)


                if (joinUnit.length !== 0) {

                    const leaderAttachUnits = joinUnit.filter(e => e.attachUnits.length !== 0 && e.position === 2)
                    if (leaderAttachUnits.length !== 0) {

                        const attachId = leaderAttachUnits.flatMap(e => e.attachUnits)

                        const unitsToProcess = await AddedArmy.find({_id: {$in: attachId}});

                        const attachNotAttach = unitsToProcess.filter(e => originUnit.attach.includes(e.unitId) && e.position === 4)

                        const secondNotAttach = unitsToProcess.filter(e => originUnit.moreSecond.includes(e.unitId) && e.position === 3)

                        if (attachNotAttach.length !== 0) {

                            const leader = attachNotAttach.flatMap(e => e.attachLeader)

                            const leaderForClearAttachUnits = await AddedArmy.find({_id: {$in: leader}});

                            const leaderAttachUnits = leaderForClearAttachUnits.flatMap(e => e.attachUnits)


                            await AddedArmy.updateMany(
                                {_id: {$in: leader}},
                                {
                                    $set: {
                                        join: false,
                                        attachUnits: [],
                                    }
                                }
                            );

                            await AddedArmy.updateMany(
                                {_id: {$in: leaderAttachUnits}},
                                [
                                    {
                                        $set: {
                                            join: false,
                                            attachLeader: "",
                                            categoryId: "$originCategory"
                                        }
                                    }
                                ]
                            );


                            await processDisembark(attachNotAttach, leaderAttachUnits)

                        }


                        if (secondNotAttach.length !== 0) {


                            const leaderId = secondNotAttach.flatMap(e => e.attachLeader)

                            const unitsToProcess = await AddedArmy.find({_id: {$in: leaderId}});

                            const leader = unitsToProcess.flatMap(e => e._id)
                            const leaderAttachUnits = unitsToProcess.flatMap(e => e.attachUnits)


                            await AddedArmy.updateMany(
                                {_id: {$in: leader}},
                                {
                                    $set: {
                                        join: false,
                                        attachUnits: [],
                                    }
                                }
                            );

                            await AddedArmy.updateMany(
                                {_id: {$in: leaderAttachUnits}},
                                [
                                    {
                                        $set: {
                                            join: false,
                                            attachLeader: "",
                                            categoryId: "$originCategory"
                                        }
                                    }
                                ]
                            );

                            await processDisembark(secondNotAttach, leaderAttachUnits)


                        }

                    }

                    const secondAttachLeader = joinUnit.filter(e => e.attachLeader && e.position === 3)
                    if (secondAttachLeader.length !== 0) {

                        const leaderId = secondAttachLeader.flatMap(e => e.attachLeader)

                        const unitsToProcess = await AddedArmy.find({_id: {$in: leaderId}});

                        const unitNotAttach = unitsToProcess.filter(e => originUnit.moreLeader.includes(e.unitId))

                        if (unitNotAttach.length !== 0) {
                            const leader = unitNotAttach.flatMap(e => e._id)
                            const leaderAttachUnits = unitNotAttach.flatMap(e => e.attachUnits)

                            await AddedArmy.updateMany(
                                {_id: {$in: leader}},
                                {
                                    $set: {
                                        join: false,
                                        attachUnits: [],
                                    }
                                }
                            );

                            await AddedArmy.updateMany(
                                {_id: {$in: leaderAttachUnits}},
                                [
                                    {
                                        $set: {
                                            join: false,
                                            attachLeader: "",
                                            categoryId: "$originCategory"
                                        }
                                    }
                                ]
                            );

                            await processDisembark(unitNotAttach, leaderAttachUnits)
                        }

                        const leaderAttachUnits = unitsToProcess.flatMap(e => e.attachUnits)

                        const unitsToAttachUnits = await AddedArmy.find({
                            _id: {$in: leaderAttachUnits},
                            position: 4
                        })

                        if (unitsToAttachUnits.length !== 0) {

                            const unitNotAttach = unitsToAttachUnits.filter(e => originUnit.attach.includes(e.unitId))

                            if (unitNotAttach.length !== 0) {

                                const leader = unitsToProcess.flatMap(e => e._id)
                                const leaderAttachUnits = unitsToProcess.flatMap(e => e.attachUnits)

                                await AddedArmy.updateMany(
                                    {_id: {$in: leader}},
                                    {
                                        $set: {
                                            join: false,
                                            attachUnits: [],
                                        }
                                    }
                                );

                                await AddedArmy.updateMany(
                                    {_id: {$in: leaderAttachUnits}},
                                    [
                                        {
                                            $set: {
                                                join: false,
                                                attachLeader: "",
                                                categoryId: "$originCategory"
                                            }
                                        }
                                    ]
                                );

                                await processDisembark(unitsToProcess, leaderAttachUnits)
                            }

                        }


                    }

                    const secondAttachUnits = joinUnit.filter(e => e.attachUnits.length !== 0 && e.position === 3)
                    if (secondAttachUnits.length !== 0) {


                        const attachId = secondAttachUnits.flatMap(e => e.attachUnits)

                        const unitsToProcess = await AddedArmy.find({_id: {$in: attachId}});

                        const unitNotAttach = unitsToProcess.filter(e => (originUnit.attach.includes(e.unitId) || originUnit.moreLeader.includes(e.unitId)))


                        if (unitNotAttach.length !== 0) {
                            const leader = unitNotAttach.flatMap(e => e.attachLeader)

                            const leaderAttach = await AddedArmy.find({_id: {$in: leader}});

                            const attachId = leaderAttach.flatMap(e => e.attachUnits)

                            const leaderAttachUnits = unitNotAttach.flatMap(e => e._id)

                            await AddedArmy.updateMany(
                                {_id: {$in: leader}},
                                {
                                    $set: {
                                        join: false,
                                        attachUnits: [],
                                    }
                                }
                            );

                            await AddedArmy.updateMany(
                                {_id: {$in: attachId}},
                                [
                                    {
                                        $set: {
                                            join: false,
                                            attachLeader: "",
                                            categoryId: "$originCategory"
                                        }
                                    }
                                ]
                            );
                            await processDisembark(unitNotAttach, attachId)
                        }

                    }

                    const attachUnit = joinUnit.filter(e => e.attachLeader && e.position === 4)
                    if(attachUnit.length !== 0){
                        const leaderId = attachUnit.flatMap(e => e.attachLeader)

                        const unitsToProcess = await AddedArmy.find({_id: {$in: leaderId}});

                        const unitNotAttach = unitsToProcess.filter(e => originUnit.leader.includes(e.unitId))

                        if (unitNotAttach.length !== 0) {
                            const leader = unitNotAttach.flatMap(e => e._id)
                            const leaderAttachUnits = unitNotAttach.flatMap(e => e.attachUnits)

                            await AddedArmy.updateMany(
                                {_id: {$in: leader}},
                                {
                                    $set: {
                                        join: false,
                                        attachUnits: [],
                                    }
                                }
                            );

                            await AddedArmy.updateMany(
                                {_id: {$in: leaderAttachUnits}},
                                [
                                    {
                                        $set: {
                                            join: false,
                                            attachLeader: "",
                                            categoryId: "$originCategory"
                                        }
                                    }
                                ]
                            );

                            await processDisembark(unitNotAttach, leaderAttachUnits)
                        }
                    }

                    const transportAttachUnits = joinUnit.filter(e => e.attachUnitsForTransport.length !== 0 && e.position === 1)
                    if (transportAttachUnits.length !== 0) {

                        const attachId = transportAttachUnits.flatMap(e => e.attachUnitsForTransport)

                        const unitsToProcess = await AddedArmy.find({_id: {$in: attachId}});

                        const attachNotTransport = unitsToProcess.filter(e => originUnit.attachUnitTransport.includes(e.unitId))

                        if (attachNotTransport.length !== 0) {

                            const attachUnit = attachNotTransport.flatMap(e => String(e._id))

                            const transportUnits = transportAttachUnits.filter(e => e.attachUnitsForTransport.some(el => attachUnit.includes(el))).flatMap(e => e._id)

                            if (transportUnits.length !== 0) {
                                await AddedArmy.updateMany(
                                    {_id: {$in: transportUnits}},
                                    [
                                        {
                                            $set: {
                                                join: false,
                                                embark: false,
                                                attachUnitsForTransport: [],
                                                count: 0,
                                                categoryId: "$originCategory"
                                            }
                                        }
                                    ]
                                );

                            }

                        }

                        setTimeout(async () => {
                            const addedArmy = await AddedArmy.find({unitId: req.params.id})
                            const joinUnit = addedArmy.filter(e => e.join)
                            const transportAttachUnits = joinUnit.filter(e => e.attachUnitsForTransport.length !== 0 && e.position === 1)
                            // console.log(transportAttachUnits)
                            await validateAndFixTransports(transportAttachUnits)

                        }, 500)


                    }


                    const unitTransportId = joinUnit.flatMap(e => e.attachTransport)

                    const unitsToEmbark = await AddedArmy.find({unitId: {$in: unitTransportId}});
                    const transportEmbark = unitsToEmbark.filter(e => addedArmy.some(el => e.attachUnitsForTransport.includes(el._id)))

                    if (transportEmbark.length !== 0) {
                        await removeOverfilledTransports(transportEmbark)
                    }

                }

                if (notJoinUnit.length !== 0) {

                    const unitTransportId = [...new Set(notJoinUnit.flatMap(e => e.attachTransport))]

                    const unitsToEmbark = await AddedArmy.find({unitId: {$in: unitTransportId}});

                    const transportEmbark = unitsToEmbark.filter(e => notJoinUnit.some(el => e.attachUnitsForTransport.includes(el._id)))


                    if (transportEmbark.length !== 0) {
                        await removeOverfilledTransports(transportEmbark)
                    }


                }

            }

            async function processDisembark(attachNotAttach, units) {
                console.log('processDisembark')
                const attachTransportId = attachNotAttach.flatMap(e => e.attachTransport)

                if (attachTransportId.length !== 0) {

                    const unitsToProcessTransport = await AddedArmy.find({unitId: {$in: attachTransportId}});
                    const attachUnit = attachNotAttach.flatMap(e => e._id)
                    const unitNotEmbark = unitsToProcessTransport.filter(e => e.attachUnitsForTransport.some(el => attachUnit.includes(el)) && e.attachUnitsForTransport.some(el => units.includes(el)))

                    if (unitNotEmbark.length !== 0) {
                        const transportId = unitNotEmbark.flatMap(e => e._id)

                        await AddedArmy.updateMany(
                            {_id: {$in: transportId}},
                            [
                                {
                                    $set: {
                                        join: false,
                                        embark: false,
                                        attachUnitsForTransport: [],
                                        count: 0,
                                        categoryId: "$originCategory"
                                    }
                                }
                            ]
                        );

                    }

                }

            }
            async function removeOverfilledTransports(transportAttachUnits) {
                console.log('removeOverfilledTransports')
                const validTransports = await Promise.all(
                    transportAttachUnits.map(async t => {

                        // 1. Получаем юниты, которые должны быть в транспорте
                        const unitIdsToEmbark = t.attachUnitsForTransport;

                        // 3. Находим юниты, которые должны быть в транспорте
                        const unitsInTransport = await AddedArmy.find({
                            _id: {$in: t.attachUnitsForTransport}
                        });

                        const unitsInTransport2 = await AddedArmy.updateMany({
                            _id: {$in: t.attachUnitsForTransport},

                        },
                           [ {
                                $set: {
                                    categoryId: "$originCategory" // Используем значение из поля originCategory
                                }
                            }]);

                        // 4. Считаем общее количество занимаемых слотов
                        const totalSlots = unitsInTransport.reduce((sum, unit) => {
                            const slotsPerUnit = (unit.canBeEmbarkedCount?.count || 1) * (unit.model || 1);
                            return sum + slotsPerUnit;
                        }, 0);

                        // 5. Если юниты НЕ помещаются — возвращаем null (транспорт удалится)
                        if (totalSlots > t.transportCount) {
                            return {slot: totalSlots, id: t._id, change: false}
                        } else {
                            return {slot: totalSlots, id: t._id, change: true}
                        }

                        return
                    })
                )


                const resId = validTransports.filter(e => e)


                if (resId.length !== 0) {

                    if (resId.some(e => e.change)) {
                        const transportId = resId.filter(e => e.change).flatMap(e => e.id)

                        await AddedArmy.updateMany(
                            {_id: {$in: transportId}},
                            [
                                {
                                    $set: {
                                        join: false,
                                        embark: false,
                                        attachUnitsForTransport: [],
                                        count: 0,
                                        categoryId: "$originCategory"
                                    }
                                }
                            ]
                        );

                        // const transportId = resId.filter(e => e.change)
                        //
                        //
                        // const bulkOps = transportId.map(item => ({
                        //     // updateOne: {
                        //     //     filter: {"_id": item.id},
                        //     //     update: {$set: {"count": item.slot}}
                        //     // }
                        //     updateOne: {
                        //         filter: {"_id": item.id},
                        //         update: {$set: {"count": item.slot}}
                        //     }
                        // }));
                        //
                        // if (bulkOps.length > 0) {
                        //     await AddedArmy.bulkWrite(bulkOps);
                        // }
                    }

                    if (resId.some(e => !e.change)) {
                        const transportId = resId.filter(e => !e.change).flatMap(e => e.id)

                        await AddedArmy.updateMany(
                            {_id: {$in: transportId}},
                            [
                                {
                                    $set: {
                                        join: false,
                                        embark: false,
                                        attachUnitsForTransport: [],
                                        count: 0,
                                        categoryId: "$originCategory"
                                    }
                                }
                            ]
                        );
                    }

                }

            }

            async function validateAndFixTransports(transportAttachUnits) {
                console.log('validateAndFixTransports')
                const validTransports = await Promise.all(
                    transportAttachUnits.map(async t => {

                        // 1. Получаем юниты, которые должны быть в транспорте
                        const unitIdsToEmbark = t.attachUnitsForTransport;

                        // 2. Находим их в общем списке юнитов
                        const unitsToEmbark = await AddedArmy.find({_id: {$in: unitIdsToEmbark}});

                        // Считаем общее количество моделей: canBeEmbarkedCount.count * model
                        const totalModels = unitsToEmbark.reduce((sum, unit) => {
                            const modelsPerUnit = (unit.canBeEmbarkedCount?.count || 1) * (unit.model || 1);
                            return sum + modelsPerUnit;
                        }, 0);

                        // Если не помещается — очищаем массив
                        if (totalModels > t.transportCount) {
                            return t._id
                        }

                        return

                    })
                )

                const resId = validTransports.filter(e => e)

                if (resId.length !== 0) {

                    await AddedArmy.updateMany(
                        {_id: {$in: resId}},
                        [
                            {
                                $set: {
                                    join: false,
                                    embark: false,
                                    attachUnitsForTransport: [],
                                    count: 0,
                                    categoryId: "$originCategory"
                                }
                            }
                        ]
                    );

                }
            }

            async function removeTransports(units, arrUnit) {
                console.log('removeTransports')
                const transport = units.flatMap(e => e.attachTransport)

                if (transport.length !== 0) {
                    const unitTransports = await AddedArmy.find({unitId: {$in: transport}})
                    const transportsId = unitTransports.filter(e => e.attachUnitsForTransport.some(el => arrUnit.includes(el))).flatMap(e => e._id)

                    if (transportsId.length !== 0) {
                        await AddedArmy.updateMany(
                            {_id: {$in: transportsId}},
                            [
                                {
                                    $set: {
                                        join: false,
                                        embark: false,
                                        attachUnitsForTransport: [],
                                        count: 0,
                                        categoryId: "$originCategory" // Используем значение из поля originCategory того же документа
                                    }
                                }
                            ]
                        );
                    }
                }

            }

////////////////////////////////////////////
            await Units.deleteOne({originUnitId: req.params.id,sameUnit:true,race:codexId})

            const addedUnitSame = await AddedArmy.deleteMany({originUnitId: req.params.id,race:codexId})

        ////////////
            const codex = await AddedUnits.find({idCodex: codexId})

            const codexIds = codex.flatMap(e => String(e._id))

            const units = await AddedArmy.find({codexId: {$in: codexIds}, sameCodex: codexId})

            if (units.length !== 0) {
                const deleteUnit = units.flatMap(e => e._id)

                await AddedArmy.deleteMany({_id: {$in: deleteUnit}})
            }

            res.status(200).json({error: false, message: "Update same codex"})
        } catch (e) {

            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateAllAddedUnits(req, res) {
        try {
            const originUnit = await Units.findOne({_id: req.params.id})
            const addedArmy = await AddedArmy.find({unitId: req.params.id})


            const unitFreePts = []

            const sameUnits = await Units.find({originUnitId: req.params.id})

            if (sameUnits.length !== 0) {
                let unit = {
                    categoryId: originUnit.categoryId,
                    originCategory: originUnit.categoryId,
                    // canBeEmbarkedCount: originUnit.canBeEmbarkedCount,
                    name: originUnit.name,
                    secondName: originUnit.secondName,
                    // race: originUnit.race,
                    image: originUnit.image,
                    pts: originUnit.pts,
                    ptsForModel: originUnit.ptsForModel,
                    screenshotOne: originUnit.screenshotOne,
                    screenshotSecond: originUnit.screenshotSecond,
                    power: originUnit.power,
                    description: originUnit.description,
                    // squad: originUnit.squad,
                    keywords: originUnit.keywords,
                    // enchancements:originUnit.enchancements,
                    // count: originUnit.count,
                    // transportCount: originUnit.transportCount,
                    // attachTransport: originUnit.attachTransport,
                    // attachUnitTransport: originUnit.attachUnitTransport,
                    // attach: originUnit.attach,

                    // alliedUnits: originUnit.alliedUnits,
                    // categoryAllide: originUnit.categoryAllide,
                    // sameCodex: originUnit.sameCodex

                }

                await Units.updateMany(
                    {originUnitId: req.params.id},
                    {$set: unit},
                )
            }

            const armySame = await Units.findOne({originUnitId: req.params.id})


            const addedArmySame = await AddedArmy.find({originUnitId: req.params.id})


            //Обновляем начальные данные

            if (addedArmy.length !== 0) {

                let unit = {
                    // categoryId: req.body.categoryId,
                    originCategory: originUnit.categoryId,
                    canBeEmbarkedCount: originUnit.canBeEmbarkedCount,
                    name: originUnit.name,
                    secondName: originUnit.secondName,
                    race: originUnit.race,
                    image: originUnit.image,
                    screenshotOne: originUnit.screenshotOne,
                    screenshotSecond: originUnit.screenshotSecond,
                    power: originUnit.power,
                    description: originUnit.description,
                    squad: originUnit.squad,
                    // count: originUnit.count,
                    transportCount: originUnit.transportCount,
                    attachTransport: originUnit.attachTransport,
                    attachUnitTransport: originUnit.attachUnitTransport,
                    attach: originUnit.attach,

                    alliedUnits: originUnit.alliedUnits,
                    categoryAllide: originUnit.categoryAllide,
                    sameCodex: originUnit.sameCodex

                }

                await AddedArmy.updateMany(
                    {unitId: req.params.id},
                    {$set: unit},
                )

            }

            ///////

            if (armySame) {

                let unit = {
                    // categoryId: req.body.categoryId,
                    originCategory: armySame.categoryId,
                    canBeEmbarkedCount: armySame.canBeEmbarkedCount,
                    name: armySame.name,
                    secondName: armySame.secondName,
                    // race: armySame.race,
                    image: armySame.image,
                    screenshotOne: armySame.screenshotOne,
                    screenshotSecond: armySame.screenshotSecond,
                    power: armySame.power,
                    description: armySame.description,
                    squad: armySame.squad,
                    // count: originUnit.count,
                    transportCount: armySame.transportCount,
                    attachTransport: armySame.attachTransport,
                    // attachUnitTransport: armySame.attachUnitTransport,
                    attach: armySame.attach,

                    alliedUnits: armySame.alliedUnits,
                    categoryAllide: armySame.categoryAllide,
                    sameCodex: armySame.sameCodex

                }

                await AddedArmy.updateMany(
                    {originUnitId: req.params.id},
                    {$set: unit},
                )

            }
            ////////////////

            //Обновляем squad ////

            if (addedArmy.length !== 0) {

                const joinUnit = addedArmy.filter(e => e.join)

                const notJoinUnit = addedArmy.filter(e => !e.join)


                if (joinUnit.length !== 0) {

                    const leaderAttachUnits = joinUnit.filter(e => e.attachUnits.length !== 0 && e.position === 2)
                    if (leaderAttachUnits.length !== 0) {

                        const attachId = leaderAttachUnits.flatMap(e => e.attachUnits)

                        const unitsToProcess = await AddedArmy.find({_id: {$in: attachId}});

                        const attachNotAttach = unitsToProcess.filter(e => !originUnit.attach.includes(e.unitId) && e.position === 4)

                        const secondNotAttach = unitsToProcess.filter(e => !originUnit.moreSecond.includes(e.unitId) && e.position === 3)

                        if (attachNotAttach.length !== 0) {

                            const leader = attachNotAttach.flatMap(e => e.attachLeader)

                            const leaderForClearAttachUnits = await AddedArmy.find({_id: {$in: leader}});

                            const leaderAttachUnits = leaderForClearAttachUnits.flatMap(e => e.attachUnits)


                            await AddedArmy.updateMany(
                                {_id: {$in: leader}},
                                {
                                    $set: {
                                        join: false,
                                        attachUnits: [],
                                    }
                                }
                            );

                            await AddedArmy.updateMany(
                                {_id: {$in: leaderAttachUnits}},
                                [
                                    {
                                        $set: {
                                            join: false,
                                            attachLeader: "",
                                            categoryId: "$originCategory"
                                        }
                                    }
                                ]
                            );


                            await processDisembark(attachNotAttach, leaderAttachUnits)

                        }


                        if (secondNotAttach.length !== 0) {


                            const leaderId = secondNotAttach.flatMap(e => e.attachLeader)

                            const unitsToProcess = await AddedArmy.find({_id: {$in: leaderId}});

                            const leader = unitsToProcess.flatMap(e => e._id)
                            const leaderAttachUnits = unitsToProcess.flatMap(e => e.attachUnits)


                            await AddedArmy.updateMany(
                                {_id: {$in: leader}},
                                {
                                    $set: {
                                        join: false,
                                        attachUnits: [],
                                    }
                                }
                            );

                            await AddedArmy.updateMany(
                                {_id: {$in: leaderAttachUnits}},
                                [
                                    {
                                        $set: {
                                            join: false,
                                            attachLeader: "",
                                            categoryId: "$originCategory"
                                        }
                                    }
                                ]
                            );

                            await processDisembark(secondNotAttach, leaderAttachUnits)


                        }

                    }

                    const secondAttachLeader = joinUnit.filter(e => e.attachLeader && e.position === 3)
                    if (secondAttachLeader.length !== 0) {

                        const leaderId = secondAttachLeader.flatMap(e => e.attachLeader)

                        const unitsToProcess = await AddedArmy.find({_id: {$in: leaderId}});

                        const unitNotAttach = unitsToProcess.filter(e => !originUnit.moreLeader.includes(e.unitId))

                        if (unitNotAttach.length !== 0) {
                            const leader = unitNotAttach.flatMap(e => e._id)
                            const leaderAttachUnits = unitNotAttach.flatMap(e => e.attachUnits)

                            await AddedArmy.updateMany(
                                {_id: {$in: leader}},
                                {
                                    $set: {
                                        join: false,
                                        attachUnits: [],
                                    }
                                }
                            );

                            await AddedArmy.updateMany(
                                {_id: {$in: leaderAttachUnits}},
                                [
                                    {
                                        $set: {
                                            join: false,
                                            attachLeader: "",
                                            categoryId: "$originCategory"
                                        }
                                    }
                                ]
                            );

                            await processDisembark(unitNotAttach, leaderAttachUnits)
                        }

                        const leaderAttachUnits = unitsToProcess.flatMap(e => e.attachUnits)

                        const unitsToAttachUnits = await AddedArmy.find({
                            _id: {$in: leaderAttachUnits},
                            position: 4
                        })

                        if (unitsToAttachUnits.length !== 0) {

                            const unitNotAttach = unitsToAttachUnits.filter(e => !originUnit.attach.includes(e.unitId))

                            if (unitNotAttach.length !== 0) {

                                const leader = unitsToProcess.flatMap(e => e._id)
                                const leaderAttachUnits = unitsToProcess.flatMap(e => e.attachUnits)

                                await AddedArmy.updateMany(
                                    {_id: {$in: leader}},
                                    {
                                        $set: {
                                            join: false,
                                            attachUnits: [],
                                        }
                                    }
                                );

                                await AddedArmy.updateMany(
                                    {_id: {$in: leaderAttachUnits}},
                                    [
                                        {
                                            $set: {
                                                join: false,
                                                attachLeader: "",
                                                categoryId: "$originCategory"
                                            }
                                        }
                                    ]
                                );

                                await processDisembark(unitsToProcess, leaderAttachUnits)
                            }

                        }


                    }

                    const secondAttachUnits = joinUnit.filter(e => e.attachUnits.length !== 0 && e.position === 3)
                    if (secondAttachUnits.length !== 0) {

                        const attachId = secondAttachUnits.flatMap(e => e.attachUnits)

                        const unitsToProcess = await AddedArmy.find({_id: {$in: attachId}});

                        const unitNotAttach = unitsToProcess.filter(e => !(originUnit.attach.includes(e.unitId) || originUnit.moreLeader.includes(e.unitId)))


                        if (unitNotAttach.length !== 0) {
                            const leader = unitNotAttach.flatMap(e => e.attachLeader)

                            const leaderAttach = await AddedArmy.find({_id: {$in: leader}});

                            const attachId = leaderAttach.flatMap(e => e.attachUnits)

                            const leaderAttachUnits = unitNotAttach.flatMap(e => e._id)

                            await AddedArmy.updateMany(
                                {_id: {$in: leader}},
                                {
                                    $set: {
                                        join: false,
                                        attachUnits: [],
                                    }
                                }
                            );

                            await AddedArmy.updateMany(
                                {_id: {$in: attachId}},
                                [
                                    {
                                        $set: {
                                            join: false,
                                            attachLeader: "",
                                            categoryId: "$originCategory"
                                        }
                                    }
                                ]
                            );
                            await processDisembark(unitNotAttach, attachId)
                        }

                    }

                    const transportAttachUnits = joinUnit.filter(e => e.attachUnitsForTransport.length !== 0 && e.position === 1)
                    if (transportAttachUnits.length !== 0) {
                        console.log('transportAttachUnits')
                        const attachId = transportAttachUnits.flatMap(e => e.attachUnitsForTransport)

                        const unitsToProcess = await AddedArmy.find({_id: {$in: attachId}});

                        const attachNotTransport = unitsToProcess.filter(e => !originUnit.attachUnitTransport.includes(e.unitId))

                        if (attachNotTransport.length !== 0) {

                            const attachUnit = attachNotTransport.flatMap(e => String(e._id))

                            const transportUnits = transportAttachUnits.filter(e => e.attachUnitsForTransport.some(el => attachUnit.includes(el))).flatMap(e => e._id)

                            if (transportUnits.length !== 0) {
                                await AddedArmy.updateMany(
                                    {_id: {$in: transportUnits}},
                                    [
                                        {
                                            $set: {
                                                join: false,
                                                embark: false,
                                                attachUnitsForTransport: [],
                                                count: 0,
                                                categoryId: "$originCategory"
                                            }
                                        }
                                    ]
                                );

                            }

                        }

                        setTimeout(async () => {
                            const addedArmy = await AddedArmy.find({unitId: req.params.id})
                            const joinUnit = addedArmy.filter(e => e.join)
                            const transportAttachUnits = joinUnit.filter(e => e.attachUnitsForTransport.length !== 0 && e.position === 1)

                            await validateAndFixTransports(transportAttachUnits)

                        }, 500)


                    }


                    const unitTransportId = joinUnit.flatMap(e => e.attachTransport)



                    const unitsToEmbark = await AddedArmy.find({unitId: {$in: unitTransportId}});
                    const transportEmbark = unitsToEmbark.filter(e => addedArmy.some(el => e.attachUnitsForTransport.includes(el._id)))

                    if (transportEmbark.length !== 0) {
                        await removeOverfilledTransports(transportEmbark)
                    }

                }

                if (notJoinUnit.length !== 0) {

                    const unitTransportId = [...new Set(notJoinUnit.flatMap(e => e.attachTransport))]

                    const unitsToEmbark = await AddedArmy.find({unitId: {$in: unitTransportId}});

                    const transportEmbark = unitsToEmbark.filter(e => notJoinUnit.some(el => e.attachUnitsForTransport.includes(el._id)))

                    console.log(transportEmbark)
                    if (transportEmbark.length !== 0) {
                        await removeOverfilledTransports(transportEmbark)
                    }


                }

            }



            ///////////////////

//Обновляем pts


            const modelPtsMap = {};
            let pts = 0

            /////// Origin Unit //////////
            if (originUnit.ptsForModel.length !== 0) {

                originUnit.ptsForModel.forEach(item => {
                    modelPtsMap[item.model] = item.pts;
                });

            } else {
                pts = originUnit.pts
            }

            if (originUnit.ptsForModel.length === 0 && addedArmy.some(e => e.model)) {
                pts = 0
            }

            // Обновляем все найденные AddedArmy
            const bulkOps = addedArmy.map(unit => {
                if (unit.model !== 0 && !modelPtsMap[unit.model]) {
                    unitFreePts.push(unit._id)
                }

                const ptsValue = modelPtsMap[unit.model] || pts || 0; // Используем 0 если модель не найдена


                if (ptsValue === 0) {
                    unitFreePts.push(unit._id)
                }

                return {
                    updateOne: {
                        filter: {_id: unit._id},
                        update: {$set: {pts: ptsValue}}
                    }
                };
            });

            if (bulkOps.length > 0) {
                await AddedArmy.bulkWrite(bulkOps);
            }

            /////////////////////////////////////////////

            /////// Same Unit //////////
            if (armySame) {
                if (armySame.ptsForModel.length !== 0) {

                    armySame.ptsForModel.forEach(item => {
                        modelPtsMap[item.model] = item.pts;
                    });

                } else {
                    pts = armySame.pts
                }
            }

            if (armySame) {
                if (armySame.ptsForModel.length === 0 && addedArmySame.some(e => e.model)) {
                    pts = 0
                }
            }

            const bulkOpsSame = addedArmySame.map(unit => {
                if (unit.model !== 0 && !modelPtsMap[unit.model]) {
                    unitFreePts.push(unit._id)
                }

                const ptsValue = modelPtsMap[unit.model] || pts || 0; // Используем 0 если модель не найдена


                if (ptsValue === 0) {
                    unitFreePts.push(unit._id)
                }

                return {
                    updateOne: {
                        filter: {_id: unit._id},
                        update: {$set: {pts: ptsValue}}
                    }
                };
            });

            if (bulkOpsSame.length > 0) {
                await AddedArmy.bulkWrite(bulkOpsSame);
            }


            ////////////////////////////////////////////////

            if (unitFreePts.length !== 0) {

                // Находим юниты с pts = 0 и непустыми attachUnits перед удалением
                const unitsToProcess = await AddedArmy.find({
                    _id: {$in: unitFreePts},
                });


                const armyId = unitsToProcess.flatMap(e => e.attachUnits)
                const arrUnits = unitsToProcess.flatMap(e => String(e._id))

                for (const item of unitsToProcess) {

                    if (item.position === 4) {
                        const units = await AddedArmy.find({attachUnits: {$in: unitFreePts}})

                        await removeTransports(unitsToProcess, arrUnits)

                        if (units.length !== 0) {

                            const arrUnit = units.flatMap(e => String(e._id))
                            const army = await AddedArmy.find({attachLeader: {$in: arrUnit}})

                            if (army.length !== 0) {
                                const idArmy = army.map(el => el._id)

                                await AddedArmy.updateMany({_id: {$in: idArmy}}, {
                                    $set: {
                                        'join': false,
                                        'attachLeader': ''
                                    }
                                })
                                await AddedArmy.updateMany({_id: {$in: arrUnit}}, {
                                    $set: {
                                        'join': false,
                                        'attachUnits': []
                                    }
                                })
                            }
                            await AddedArmy.updateMany({_id: {$in: arrUnit}}, {$set: {'join': false}})
                        }

                    }

                    if (item.position === 2 || item.position === 3) {

                        await removeTransports(unitsToProcess, arrUnits)
                        if (item.attachUnits.length !== 0) {
                            if (armyId.length !== 0) {
                                await AddedArmy.updateMany(
                                    {_id: {$in: armyId}},
                                    [
                                        {
                                            $set: {
                                                join: false,
                                                attachLeader: "",
                                                categoryId: "$originCategory" // Используем значение из поля originCategory того же документа
                                            }
                                        }
                                    ]
                                );
                            }
                        }

                        if (item.attachLeader) {
                            unitFreePts.push(item.attachLeader)

                            const units = await AddedArmy.find({attachUnits: {$in: unitFreePts}})

                            if (units.length !== 0) {

                                const arrUnit = units.flatMap(e => e._id)

                                const army = await AddedArmy.find({attachLeader: {$in: arrUnit}})

                                if (army.length !== 0) {
                                    const idArmy = army.map(el => el._id)

                                    await AddedArmy.updateMany({_id: {$in: idArmy}},
                                        [
                                            {
                                                $set: {
                                                    join: false,
                                                    attachLeader: "",
                                                    categoryId: "$originCategory", // Используем значение из поля originCategory того же документа
                                                    attachUnits: []
                                                }
                                            }
                                        ])
                                    await AddedArmy.updateMany({_id: {$in: arrUnit}},
                                        [
                                            {
                                                $set: {
                                                    join: false,
                                                    attachUnits: []
                                                }
                                            }
                                        ])
                                }
                                await AddedArmy.updateMany({_id: {$in: arrUnit}}, {$set: {'join': false}})
                            }
                        }

                    }
                }


            }


            // Удаляем все юниты с pts: 0 из коллекции AddedArmy
            const deleteResult = await AddedArmy.deleteMany({
                _id: {$in: unitFreePts.map(id => id)},
                pts: 0
            });

            // console.log(`Удалено ${deleteResult.deletedCount} юнитов с нулевыми pts`);

///////////////////////////////////////////////////////////////////////////////

            // Дополнительно удаляем ссылки на эти юниты в других коллекциях
            if (unitFreePts.length !== 0) {

                await AddedArmy.updateMany(
                    {
                        $or: [
                            {attachUnits: {$in: unitFreePts}},
                            {attachLeader: {$in: unitFreePts}}
                        ]
                    },
                    {
                        $pull: {
                            attachUnits: {$in: unitFreePts},
                        },
                        $set: {
                            attachLeader: ""
                        }
                    }
                );

            }


//////// END PTS /////////


            async function processDisembark(attachNotAttach, units) {
                console.log('processDisembark')
                const attachTransportId = attachNotAttach.flatMap(e => e.attachTransport)

                if (attachTransportId.length !== 0) {

                    const unitsToProcessTransport = await AddedArmy.find({unitId: {$in: attachTransportId}});
                    const attachUnit = attachNotAttach.flatMap(e => e._id)
                    const unitNotEmbark = unitsToProcessTransport.filter(e => !e.attachUnitsForTransport.some(el => attachUnit.includes(el)) && e.attachUnitsForTransport.some(el => units.includes(el)))

                    if (unitNotEmbark.length !== 0) {
                        const transportId = unitNotEmbark.flatMap(e => e._id)

                        await AddedArmy.updateMany(
                            {_id: {$in: transportId}},
                            [
                                {
                                    $set: {
                                        join: false,
                                        embark: false,
                                        attachUnitsForTransport: [],
                                        count: 0,
                                        categoryId: "$originCategory"
                                    }
                                }
                            ]
                        );

                    }

                }

            }

            async function validateAndFixTransports(transportAttachUnits) {
                console.log('validateAndFixTransports ее')
                const validTransports = await Promise.all(
                    transportAttachUnits.map(async t => {

                        // 1. Получаем юниты, которые должны быть в транспорте
                        const unitIdsToEmbark = t.attachUnitsForTransport;

                        // 2. Находим их в общем списке юнитов
                        const unitsToEmbark = await AddedArmy.find({_id: {$in: unitIdsToEmbark}});

                        // Считаем общее количество моделей: canBeEmbarkedCount.count * model
                        const totalModels = unitsToEmbark.reduce((sum, unit) => {
                            const modelsPerUnit = (unit.canBeEmbarkedCount?.count || 1) * (unit.model || 1);
                            return sum + modelsPerUnit;
                        }, 0);

                        // Если не помещается — очищаем массив
                        if (totalModels > t.transportCount) {
                            return t._id
                        }

                        return

                    })
                )

                const resId = validTransports.filter(e => e)

                if (resId.length !== 0) {

                    await AddedArmy.updateMany(
                        {_id: {$in: resId}},
                        [
                            {
                                $set: {
                                    join: false,
                                    embark: false,
                                    attachUnitsForTransport: [],
                                    count: 0,
                                    categoryId: "$originCategory"
                                }
                            }
                        ]
                    );

                }
            }

            async function removeOverfilledTransports(transportAttachUnits) {
                console.log('removeOverfilledTransports')
                const validTransports = await Promise.all(
                    transportAttachUnits.map(async t => {

                        // 1. Получаем юниты, которые должны быть в транспорте
                        const unitIdsToEmbark = t.attachUnitsForTransport;

                        // 3. Находим юниты, которые должны быть в транспорте
                        const unitsInTransport = await AddedArmy.find({
                            _id: {$in: t.attachUnitsForTransport},
                        });

                        // 4. Считаем общее количество занимаемых слотов
                        const totalSlots = unitsInTransport.reduce((sum, unit) => {
                            const slotsPerUnit = (unit.canBeEmbarkedCount?.count || 1) * (unit.model || 1);
                            return sum + slotsPerUnit;
                        }, 0);

                        // 5. Если юниты НЕ помещаются — возвращаем null (транспорт удалится)
                        if (totalSlots > t.transportCount) {
                            return {slot: totalSlots, id: t._id, change: false}
                        } else {
                            return {slot: totalSlots, id: t._id, change: true}
                        }

                        return
                    })
                )


                const resId = validTransports.filter(e => e)


                if (resId.length !== 0) {

                    if (resId.some(e => e.change)) {
                        const transportId = resId.filter(e => e.change)

                        const bulkOps = transportId.map(item => ({
                            updateOne: {
                                filter: {"_id": item.id},
                                update: {$set: {"count": item.slot}}
                            }
                        }));

                        if (bulkOps.length > 0) {
                            await AddedArmy.bulkWrite(bulkOps);
                        }
                    }

                    if (resId.some(e => !e.change)) {
                        const transportId = resId.filter(e => !e.change).flatMap(e => e.id)

                        await AddedArmy.updateMany(
                            {_id: {$in: transportId}},
                            [
                                {
                                    $set: {
                                        join: false,
                                        embark: false,
                                        attachUnitsForTransport: [],
                                        count: 0,
                                        categoryId: "$originCategory"
                                    }
                                }
                            ]
                        );
                    }

                }

            }

            async function removeTransports(units, arrUnit) {
                console.log('removeTransports')
                const transport = units.flatMap(e => e.attachTransport)

                if (transport.length !== 0) {
                    const unitTransports = await AddedArmy.find({unitId: {$in: transport}})
                    const transportsId = unitTransports.filter(e => e.attachUnitsForTransport.some(el => arrUnit.includes(el))).flatMap(e => e._id)

                    if (transportsId.length !== 0) {
                        await AddedArmy.updateMany(
                            {_id: {$in: transportsId}},
                            [
                                {
                                    $set: {
                                        join: false,
                                        embark: false,
                                        attachUnitsForTransport: [],
                                        count: 0,
                                        categoryId: "$originCategory" // Используем значение из поля originCategory того же документа
                                    }
                                }
                            ]
                        );
                    }
                }

            }

            res.status(200).json({error: false, message: "Update"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async deleteEnchantForAddedUnits(req, res) {
        try {

            const {enchantId} = req.body

            const units = await AddedArmy.updateMany(
                {
                    unitId: req.params.id,
                    'enchantmentUnit.enchantId': enchantId
                },
                {
                    $set: {
                        'enchantmentUnit.name': '',
                        'enchantmentUnit.detachmentId': '',
                        'enchantmentUnit.enchantPts': 0,
                        'enchantmentUnit.enchantId': ''
                    }
                })


            res.status(200).json({error: false, message: "Update enchant"})
        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }


}

module.exports = new Unit()