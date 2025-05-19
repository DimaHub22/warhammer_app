const Units = require('../models/Units')
const AddedArmy = require('../models/AddedArmy')
const {ObjectId} = require('mongodb');

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
                {$set: update}
            )


            setTimeout(async () => {
                try {
                    const originUnit = await Units.findOne({_id: req.params.id})
                    const addedArmy = await AddedArmy.find({unitId: req.params.id})
                    console.log(originUnit)
                    const unitFreePts = []

                    //Обновляем начальные данные

                    if (addedArmy) {
                        let unit = {
                            // categoryId: req.body.categoryId,
                            originCategory: req.body.categoryId,
                            canBeEmbarkedCount: originUnit.canBeEmbarkedCount,
                            name: originUnit.name,
                            secondName: originUnit.secondName,
                            race: req.body.race,
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
                            attach: originUnit.attach

                        }


                     const res = await AddedArmy.updateMany(
                            {unitId: req.params.id},
                            {$set: unit}
                        )
                    }

                    ////////////////

                    //Обновляем squad ////

                    if(res.statusMessage === 'OK'){
                        setTimeout(async () => {
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

                                            // const attachTransportId = attachNotAttach.flatMap(e => e.attachTransport)


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

                                            // if (attachTransportId.length !== 0) {
                                            //
                                            //     const unitsToProcessTransport = await AddedArmy.find({unitId: {$in: attachTransportId}});
                                            //     const attachUnit = attachNotAttach.flatMap(e => e._id)
                                            //     const unitNotEmbark = unitsToProcessTransport.filter(e => !e.attachUnitsForTransport.some(el => attachUnit.includes(el)))
                                            //
                                            //     if (unitNotEmbark.length !== 0) {
                                            //
                                            //         const transportId = unitNotEmbark.flatMap(e => e._id)
                                            //
                                            //         await AddedArmy.updateMany(
                                            //             {_id: {$in: transportId}},
                                            //             [
                                            //                 {
                                            //                     $set: {
                                            //                         join: false,
                                            //                         embark: false,
                                            //                         attachUnitsForTransport: [],
                                            //                         count: 0,
                                            //                         categoryId: "$originCategory"
                                            //                     }
                                            //                 }
                                            //             ]
                                            //         );
                                            //
                                            //     }
                                            //
                                            // }

                                            await processDisembark(attachNotAttach, leaderAttachUnits)

                                        }


                                        if (secondNotAttach.length !== 0) {


                                            const leaderId = secondNotAttach.flatMap(e => e.attachLeader)

                                            const unitsToProcess = await AddedArmy.find({_id: {$in: leaderId}});

                                            const leader = unitsToProcess.flatMap(e => e._id)
                                            const leaderAttachUnits = unitsToProcess.flatMap(e => e.attachUnits)

                                            // const attachTransportId = secondNotAttach.flatMap(e => e.attachTransport)

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


                                            // if (attachTransportId.length !== 0) {
                                            //
                                            //     const unitsToProcessTransport = await AddedArmy.find({unitId: {$in: attachTransportId}});
                                            //     const attachUnit = attachNotAttach.flatMap(e => e._id)
                                            //     const unitNotEmbark = unitsToProcessTransport.filter(e => !e.attachUnitsForTransport.some(el => attachUnit.includes(el)))
                                            //
                                            //     if (unitNotEmbark.length !== 0) {
                                            //
                                            //         const transportId = unitNotEmbark.flatMap(e => e._id)
                                            //
                                            //         await AddedArmy.updateMany(
                                            //             {_id: {$in: transportId}},
                                            //             [
                                            //                 {
                                            //                     $set: {
                                            //                         join: false,
                                            //                         embark: false,
                                            //                         attachUnitsForTransport: [],
                                            //                         count: 0,
                                            //                         categoryId: "$originCategory"
                                            //                     }
                                            //                 }
                                            //             ]
                                            //         );
                                            //
                                            //     }
                                            //
                                            // }

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


                                    if (transportEmbark.length !== 0) {
                                        await removeOverfilledTransports(transportEmbark)
                                    }

                                }

                            }

                            ///////////////////

//Обновляем pts
                            const modelPtsMap = {};
                            let pts = 0
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


                            if (unitFreePts.length !== 0) {

                                // Находим юниты с pts = 0 и непустыми attachUnits перед удалением
                                const unitsToProcess = await AddedArmy.find({
                                    _id: {$in: unitFreePts},
                                });


                                const armyId = unitsToProcess.flatMap(e => e.attachUnits)

                                unitsToProcess.forEach(async item => {

                                    if (item.position === 4) {
                                        const units = await AddedArmy.find({attachUnits: {$in: unitFreePts}})

                                        if (units.length !== 0) {

                                            const arrUnit = units.flatMap(e => e._id)
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
                                })

                            }


                            // Удаляем все юниты с pts: 0 из коллекции AddedArmy
                            const deleteResult = await AddedArmy.deleteMany({
                                _id: {$in: unitFreePts.map(id => id)},
                                pts: 0
                            });
                            console.log(`Удалено ${deleteResult.deletedCount} юнитов с нулевыми pts`);


///////////////////////////////////////////////////////////////////////////////

                            // Дополнительно удаляем ссылки на эти юниты в других коллекциях
                            if (unitFreePts.length !== 0) {

                                await AddedArmy.updateMany(
                                    {
                                        $or: [
                                            // { squad: { $in: unitFreePts } },
                                            {attachUnits: {$in: unitFreePts}},
                                            {attachLeader: {$in: unitFreePts}}
                                        ]
                                    },
                                    {
                                        $pull: {
                                            // squad: { $in: unitFreePts },
                                            attachUnits: {$in: unitFreePts},
                                        },
                                        $set: {
                                            attachLeader: ""
                                        }
                                    }
                                );

                            }


//////// END PTS /////////
                        },500)

                    }


                } catch (e) {
                    console.log(e)
                }


            }, 600)

            async function processDisembark(attachNotAttach, units) {

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
                                filter: { "_id": item.id },
                                update: { $set: { "count": item.slot } }
                            }
                        }));

                        if (bulkOps.length > 0) {
                            await AddedArmy.bulkWrite(bulkOps);
                        }
                    }

                    if(resId.some(e => !e.change)){
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
            // console.log(addedArmy)
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


}

module.exports = new Unit()