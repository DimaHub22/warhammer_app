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

            const transport = await Units.findOne({_id: req.params.id})
            await Units.findOneAndUpdate(
                {_id: req.params.id},
                {$set: req.body}
            )

            await Units.updateMany({_id: {$in: req.body.attachUnitTransport}}, {$addToSet: {'attachTransport': transport._id}})

            await AddedArmy.updateMany({unitId: {$in: req.body.attachUnitTransport}}, {$addToSet: {'attachTransport': transport._id}})


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
                res.status(200).json({error: false, message: "Leader added successfully"});
            } else {
                await Units.updateOne(
                    {_id: req.params.id},
                    {$pull: {'leader': leader}}
                )
                res.status(200).json({error: false, message: "Leader removed successfully"});
            }

            // res.status(200).json({error: false, message: "Added leader"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateSecondLeaderForLeader(req, res) {
        try {

            const {second} = req.body

            await Units.findOneAndUpdate({_id: second}, {$pull: {'moreLeader': req.params.id}})

            // if (add) {
            //     if (!unit.leader.includes(leader)) {
            //         await Units.updateOne(
            //             {_id: req.params.id},
            //             {$push: {'moreLeader': leader}}
            //         )
            //     }
            // } else {
            //     await Units.updateOne(
            //         {_id: req.params.id},
            //         {$pull: {'moreLeader': leader}}
            //     )
            // }

            res.status(200).json({error: false, message: "Update leader"})
        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateArrSecondLeaderForLeader(req, res) {
        try {

            const {units, ststus, squadChoiceValue, squadChoiceSquadId} = req.body

            const second = await Units.findOne({_id: req.params.id})


            await Units.findOneAndUpdate(
                {_id: req.params.id},
                {$set: {'moreLeader': units}},
                {new: true}
            )

            const squadsAll = await Squad.find()
            const leader = squadsAll.find(e => e.squad === 'Leader')
            const secondLeader = squadsAll.find(e => e.squad === '2nd Leader')


            const lesderUp = await Units.find({
                _id: { $in: units },
                squad: {
                    $eq: String(leader._id),  // равно leader._id
                    $ne: String(secondLeader._id)   // и не равно second._id
                }
            });

            if(lesderUp.length !== 0){
                const leaderId = lesderUp.flatMap(e => e._id)

                await Units.updateMany({_id: {$in: leaderId}}, {$addToSet: {'moreSecond': second._id}})
            }


            const secondUp = await Units.find({
                _id: {$in: units},
                squad: String(secondLeader._id)  // Проверяем, есть ли такой ID в squad
            });


            if (secondUp.length !== 0) {

                const secondsId = secondUp.flatMap(e => e._id)

                if (!ststus) {
                    // await Units.updateMany({_id: {$in: units}}, {$addToSet: {'moreSecond': second._id}})
                } else {
                    await Units.updateMany({_id: {$in: secondsId}}, {$addToSet: {'moreLeader': second._id}})
                }

            }


            res.status(200).json({error: false, message: "Added leader"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateSecondForCheckedFree(req, res) {
        try {
            const {squadChoiceSquadId} = req.body

            const second = await Units.findOne({_id: req.params.id})

            const moreLeader = second.moreLeader
            const attach = second.attach
            const attachTransport = second.attachTransport
            // canBeEmbarkedCount

            await Units.bulkWrite([
                {
                    updateMany: {
                        filter: {_id: {$in: moreLeader}},
                        update: {
                            $pull: {
                                moreSecond: req.params.id,
                                moreLeader: req.params.id
                            }
                        }
                    }
                },
                {
                    updateMany: {
                        filter: {_id: {$in: attach}},
                        update: {
                            $pull: {leader: req.params.id}
                        }
                    }
                },
                {
                    updateMany: {
                        filter: {_id: {$in: attachTransport}},
                        update: {
                            $pull: {
                                attachUnitTransport: req.params.id,
                            }
                        }
                    }
                },
            ]);


            const unit = await Units.findOneAndUpdate(
                {_id: req.params.id},
                {
                    $set: {
                        'moreLeader': [],
                        'attachTransport': [],
                        // 'squad': [] ,
                        'attach': [],
                        // 'canBeEmbarkedCount.count':0,
                        // 'canBeEmbarkedCount.checked':false
                    },
                    $pull: {squad: squadChoiceSquadId}
                },
                {new: true}
            )

            res.status(200).json(unit)
        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateSecondForCheckedSecond(req, res) {
        try {

            const {squadChoiceSquadId} = req.body

            //////////// Ищим сквад лидера
            const squads = await Squad.findOne({squad: 'Leader'})

            const secondUp = await Units.findOne({
                _id: req.params.id,
                squad: String(squads._id) // Проверяем, есть ли такой ID в squad
            });

            let unit;

            if (secondUp) {
                const moreSecond = secondUp.moreSecond
                const attach = secondUp.attach
                const attachTransport = secondUp.attachTransport

                // if(moreSecond.length !== 0 || attach.length !== 0 || attachTransport.length !== 0){

                await Units.bulkWrite([
                    {
                        updateMany: {
                            filter: {_id: {$in: moreSecond}},
                            update: {
                                $pull: {
                                    moreLeader: req.params.id
                                }
                            }
                        }
                    },
                    {
                        updateMany: {
                            filter: {_id: {$in: attach}},
                            update: {
                                $pull: {leader: req.params.id}
                            }
                        }
                    },
                    {
                        updateMany: {
                            filter: {_id: {$in: attachTransport}},
                            update: {
                                $pull: {
                                    attachUnitTransport: req.params.id,
                                }
                            }
                        }
                    },
                ]);

                unit = await Units.findOneAndUpdate(
                    {_id: req.params.id},
                    {
                        $set: {'moreSecond': [], 'attach': []},
                        $push: {squad: squadChoiceSquadId}
                    },
                    {new: true}
                )

                // if(unit){
                //     res.status(200).json(unit)
                // }

                // }

            } else {
                // res.status(200).json({error: false, message: "Added leader"})
            }


            res.status(200).json(unit)

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateSecondForChecked2ndTo2nd(req, res) {
        try {

            const squads = await Squad.findOne({squad: '2nd Leader'})

            const second = await Units.findOne({_id: req.params.id})

            const moreLeader = second.moreLeader

            const units = await Units.find({_id: {$in: moreLeader}, squad: squads._id})

            let unit;

            if (units.length !== 0) {

                const unitIds = units.flatMap(e => String(e._id))

                await Units.bulkWrite([
                    {
                        updateMany: {
                            filter: {_id: {$in: unitIds}},
                            update: {
                                $pull: {
                                    moreLeader: req.params.id
                                }
                            }
                        }
                    },
                    // {
                    //     updateMany: {
                    //         filter: { _id: { $in: attach } },
                    //         update: {
                    //             $pull: { leader: req.params.id }
                    //         }
                    //     }
                    // },
                    // {
                    //     updateMany: {
                    //         filter: { _id: { $in: attachTransport } },
                    //         update: {
                    //             $pull: {
                    //                 attachUnitTransport: req.params.id,
                    //             }
                    //         }
                    //     }
                    // },
                ]);

                unit = await Units.findOneAndUpdate(
                    {_id: req.params.id},
                    {
                        $pull: {moreLeader: {$in: unitIds}}
                    },
                    {new: true}
                )

            }

            res.status(200).json(unit)
            // res.status(200).json({error: false, message: "Added leader"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateLeaderForSecondLeader(req, res) {
        try {

            const {leader, status} = req.body

            if (!status) {
                const le = await Units.findOne({_id: leader})

                await Units.findOneAndUpdate({_id: leader}, {$pull: {'moreSecond': req.params.id}})
            } else {
                await Units.findOneAndUpdate({_id: leader}, {$pull: {'moreLeader': req.params.id}})
            }

            // await Units.findOneAndUpdate({_id: leader}, {$pull: {'moreSecond': req.params.id}})

            // const unit = await Units.findOne({_id: req.params.id})
            //
            // if (add) {
            //     if (!unit.leader.includes(leader)) {
            //         await Units.updateOne(
            //             {_id: req.params.id},
            //             {$push: {'moreSecond': leader}}
            //         )
            //     }
            // } else {
            //     await Units.updateOne(
            //         {_id: req.params.id},
            //         {$pull: {'moreSecond': leader}}
            //     )
            // }

            res.status(200).json({error: false, message: "Added leader"})
        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateArrLeaderForSecondLeader(req, res) {
        try {

            const {units, ststus} = req.body

            const leader = await Units.findOne({_id: req.params.id})

            await Units.updateOne(
                {_id: req.params.id},
                {$set: {'moreSecond': units}}
            )

            await Units.updateMany({_id: {$in: units}}, {$addToSet: {'moreLeader': leader._id}})

            res.status(200).json({error: false, message: "Added leader"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateLeaderForCheckedFree(req, res) {
        try {

            const leader = await Units.findOne({_id: req.params.id})

            const moreSecond = leader.moreSecond
            const moreLeader = leader.moreLeader
            const attach = leader.attach
            const attachTransport = leader.attachTransport


            await Units.bulkWrite([
                {
                    updateMany: {
                        filter: {_id: {$in: moreSecond}},
                        update: {
                            $pull: {
                                moreLeader: req.params.id,
                                // moreSecond:req.params.id
                            }
                        }
                    }
                },
                {
                    updateMany: {
                        filter: {_id: {$in: moreLeader}},
                        update: {
                            $pull: {
                                // moreLeader: req.params.id,
                                moreSecond: req.params.id
                            }
                        }
                    }
                },
                {
                    updateMany: {
                        filter: {_id: {$in: attach}},
                        update: {
                            $pull: {
                                leader: req.params.id,
                            }
                        }
                    }
                },
                {
                    updateMany: {
                        filter: {_id: {$in: attachTransport}},
                        update: {
                            $pull: {
                                attachUnitTransport: req.params.id,
                            }
                        }
                    }
                },
            ]);


            // await Units.updateMany({_id:{$in:attachTransport}},{$pull:{'attachUnitTransport':req.params.id}})

            const unit = await Units.findOneAndUpdate(
                {_id: req.params.id},
                {
                    $set: {
                        'moreSecond': [],
                        'moreLeader': [],
                        'attachTransport': [],
                        'squad': [],
                        'attach': [],
                        'canBeEmbarkedCount.count': 0,
                        'canBeEmbarkedCount.checked': false
                    }
                },
                {new: true}
            )

            res.status(200).json(unit)

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateAttachForCheckedFree(req, res) {
        try {
            const {squadChoiceSquadId} = req.body

            const attach = await Units.findOne({_id: req.params.id})

            const leader = attach.leader
            const attachTransport = attach.attachTransport

            await Units.bulkWrite([
                {
                    updateMany: {
                        filter: {_id: {$in: leader}},
                        update: {
                            $pull: {
                                attach: req.params.id,
                            }
                        }
                    }
                },
                {
                    updateMany: {
                        filter: {_id: {$in: attachTransport}},
                        update: {
                            $pull: {
                                attachUnitTransport: req.params.id,
                            }
                        }
                    }
                },
            ]);


            const unit = await Units.findOneAndUpdate(
                {_id: req.params.id},
                {
                    $set: {
                        'leader': [],
                        'attachTransport': [],
                        'squad': [],
                        // 'attach': [],
                        'canBeEmbarkedCount.count': 0,
                        'canBeEmbarkedCount.checked': false
                    },
                },
                {new: true}
            )

            res.status(200).json(unit)
        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateCanBeEmbarkedForCheckedFree(req, res) {
        try {

            const {squadChoiceSquadId} = req.body


            const unitChoice = await Units.findOne({_id: req.params.id})

            const attachTransport = unitChoice.attachTransport

            let unit;

            if (attachTransport.length !== 0) {
                await Units.bulkWrite([
                    {
                        updateMany: {
                            filter: {_id: {$in: attachTransport}},
                            update: {
                                $pull: {
                                    attachUnitTransport: req.params.id,
                                }
                            }
                        }
                    },
                ]);

                //
                unit = await Units.findOneAndUpdate(
                    {_id: req.params.id},
                    {
                        $set: {
                            'attachTransport': [],
                            // 'squad': [] ,
                            // 'attach': [],
                            'canBeEmbarkedCount.count': 0,
                            'canBeEmbarkedCount.checked': false
                        },
                        $pull: {squad: squadChoiceSquadId}
                    },
                    {new: true}
                )
            }


            //
            res.status(200).json(unit)
            // res.status(200).json({error: false, message: "AttachTransport"})
        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateTransportForCheckedFree(req, res) {
        try {
            const {squadChoiceSquadId} = req.body

            const transport = await Units.findOne({_id: req.params.id})

            const attachUnitTransport = transport.attachUnitTransport


            await Units.bulkWrite([
                {
                    updateMany: {
                        filter: {_id: {$in: attachUnitTransport}},
                        update: {
                            $pull: {
                                attachTransport: req.params.id,
                            }
                        }
                    }
                },
                // {
                //     updateMany: {
                //         filter: { _id: { $in: attachTransport } },
                //         update: {
                //             $pull: {
                //                 attachUnitTransport: req.params.id,
                //             }
                //         }
                //     }
                // },
            ]);


            const unit = await Units.findOneAndUpdate(
                {_id: req.params.id},
                {
                    $set: {
                        'transportCount': 0,
                        'attachUnitTransport': [],
                        'squad': [],
                        // 'attach': [],
                        // 'canBeEmbarkedCount.count':0,
                        // 'canBeEmbarkedCount.checked':false
                    },
                },
                {new: true}
            )

            res.status(200).json(unit)

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }


    async updateUnitForTransport(req, res) {
        try {

            const {unit} = req.body

            await Units.findOneAndUpdate({_id: unit}, {$pull: {'attachTransport': req.params.id}})
            // console.log(unit)

            await AddedArmy.updateMany({unitId: unit}, {$pull: {'attachTransport': req.params.id}})

            // const unit = await Units.findOne({_id: req.params.id})
            //
            // if (add) {
            //     if (!unit.leader.includes(leader)) {
            //         await Units.updateOne(
            //             {_id: req.params.id},
            //             {$push: {'attachTransport': leader}}
            //         )
            //     }
            // } else {
            //     await Units.updateOne(
            //         {_id: req.params.id},
            //         {$pull: {'attachTransport': leader}}
            //     )
            // }

            res.status(200).json({error: false, message: "Added leader"})
        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateTransportForUnit(req, res) {
        try {
            const {unit} = req.body

            const unitAdded = await AddedArmy.find({unitId: req.params.id})

            const unitAddedIds = unitAdded.flatMap(e => e._id)

            const transports = await AddedArmy.find({
                unitId: unit,
                attachUnitsForTransport: {$in: unitAddedIds} // автоматически проверяет вхождение в массив
            });

            if (transports.length !== 0) {

                const transportIds = transports.flatMap(e => e._id)

                await AddedArmy.updateMany(
                    {_id: {$in: transportIds}},
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

            await Units.findOneAndUpdate({_id: unit}, {$pull: {'attachUnitTransport': req.params.id}})

            await AddedArmy.updateMany({unitId: unit}, {$pull: {'attachUnitTransport': req.params.id}})


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

            await Units.updateMany({_id: {$in: req.body.attachTransport}}, {$addToSet: {'attachUnitTransport': unit._id}})

            await AddedArmy.updateMany({unitId: {$in: req.body.attachTransport}}, {$addToSet: {'attachUnitTransport': unit._id}})

            res.status(200).json({error: false, message: "Added unit"})
        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }


    async resetApp(req, res) {
        // try {
        //
        //     await Units.updateMany(
        //         {},
        //         {
        //             $set: {
        //                 "pts": 0, "squad": [], 'canBeEmbarkedCount.count': 0, 'canBeEmbarkedCount.checked': false,
        //                 "transportCount": 0, "attach": [], "ptsForModel": [], "moreSecond": [], "attachTransport": [],
        //                 "leader": [], "moreLeader": [], "attachUnitTransport": []
        //             }
        //         }
        //     )
        //
        //     await AddedArmy.deleteMany({})
        //     await AddedUnits.deleteMany({})
        //
        //
        //     res.status(200).json({error: false, message: "Successful app reset"})
        // } catch (e) {
        //     console.log(e)
        //     res.status(400).json({error: true, message: "Error service"})
        // }
    }
}

module.exports = new Squads()