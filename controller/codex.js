const Codex = require('../models/Codex')
const AddedArmy = require('../models/AddedArmy')
const AddedUnits = require('../models/AddedUnits')


class Codexes {
    async createCodex(req, res) {
        try {

            const {title, items} = req.body
            const newCodex = await new Codex({
                title, items
            })

            await newCodex.save()
            res.status(201).json({error: false, message: "Codex successfully created"})


        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async categoryChange(req, res) {
        try {
            const {title} = req.body

            await Codex.findOneAndUpdate({_id: req.params.id},
                {$set: {'title': title}})
            res.status(200).json({error: false, message: "Category successfully update"})
        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async createCodexForCategory(req, res) {
        try {
            const codex = await Codex.findOne({_id: req.params.id})

            const newCodex = {
                name: req.body.name,
                image: req.file ? req.file.path : ''
            }

            await Codex.findOneAndUpdate({_id: req.params.id},
                {$push: {'items': newCodex}})

            res.status(201).json({error: false, message: "Codex successfully created"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async codexChange(req, res) {
        try {

            const codex = await Codex.findOne({_id: req.body.category, 'items._id': req.params.id}, {"items.$": 1})

            const codexUp = await Codex.findOneAndUpdate({_id: req.body.category, 'items._id': req.params.id},
                {
                    $set: {
                        'items.$.name': req.body.name,
                        'items.$.image': req.file ? req.file.path : codex.items[0].image
                    }
                })

            res.status(201).json({error: false, message: "Codex successfully created"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async changeCodexForCategory(req, res) {
        try {
            const {newCategoryId} = req.body
            const codex = await Codex.findOne({'items._id': req.params.id}, {"items.$": 1})

            const lastCategoryId = codex._id
            const codexChoice = codex.items[0]


            const newCategory = await Codex.findOneAndUpdate({_id: newCategoryId},
                {$push: {'items': codexChoice}})


            await Codex.findOneAndUpdate({_id: lastCategoryId},
                {$pull: {'items': {_id: codexChoice._id}}})


            res.status(201).json({error: false, message: "Codex successfully created"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async getCodex(req, res) {
        try {
            const codex = await Codex.find()
            res.status(200).json(codex)

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async getIdCodex(req, res) {
        try {

            const codex = await Codex.findOne({_id: req.params.id})
            res.status(200).json(codex)
        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async getCodexId(req, res) {
        try {

            const codex = await Codex.findOne({items: req.params.id})
            res.status(200).json({error: false, message: "Codex"})
        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async getCodexIdFromItems(req, res) {
        try {

            const codex = await Codex.findOne({'items._id': req.params.id}, {"items.$": 1})

            res.status(200).json(codex)

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async getCodexItems(req, res) {
        try {

            const {itemId, detachment} = req.body;

            const matchingEnhancements = await Codex.aggregate([
                // 1. Разворачиваем массив items
                {$unwind: "$items"},

                // 2. Разворачиваем массив enhancements
                {$unwind: "$items.enhancements"},

                // 3. Фильтруем только enhancements с нужным detachmentId
                {$match: {"items.enhancements.detachmentId": req.params.id}},

                // 4. Формируем результат (только нужные данные)
                {
                    $project: {
                        _id: 0, // Исключаем служебные поля
                        enhancement: "$items.enhancements",
                    }
                }
            ]);

            res.status(200).json(matchingEnhancements)

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateContent(req, res) {
        try {

            const content = {
                content: req.body.content
            };

            const codexUp = await Codex.findOneAndUpdate({'items._id': req.params.id},
                {$push: {'items.$.rules': content}})

            res.status(201).json({error: false, message: "Codex successfully created"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateDetachment(req, res) {
        try {
            const content = {
                title: req.body.title,
                detachment: req.body.detachment
            };
            const codexUp = await Codex.findOneAndUpdate({'items._id': req.params.id},
                {$push: {'items.$.detachments': content}})


            res.status(201).json({error: false, message: "Codex successfully created"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateContentEnhancement(req, res) {
        try {

            const content = {
                content: req.body.content,
                detachmentId: req.body.detachmentId,
                enchantPts: req.body.enchantPts,
                name: req.body.name
            };

            const codexUp = await Codex.findOneAndUpdate({'items._id': req.params.id},
                {$push: {'items.$.enhancements': content}})

            res.status(201).json({error: false, message: "Codex successfully created"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async editContent(req, res) {
        try {
            const {itemId, contentId, content} = req.body;

            const result = await Codex.findOneAndUpdate(
                {
                    _id: req.params.id,
                    'items._id': itemId,
                    'items.rules._id': contentId,
                },
                {
                    $set: {
                        'items.$[item].rules.$[rule].content': req.body.content,
                    },
                },
                {
                    arrayFilters: [
                        {'item._id': itemId}, // Фильтр для элемента в массиве items
                        {'rule._id': contentId}, // Фильтр для элемента в массиве rules
                    ],
                    new: true, // Возвращает обновленный документ
                }
            );


            res.status(200).json({error: false, message: "Codex successfully update"})


        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async editContentEnhancement(req, res) {
        try {

            const {itemId, detachmentId, content, enchantPts} = req.body;

            const result = await Codex.findOneAndUpdate(
                {
                    _id: req.params.id,
                    'items._id': itemId,
                    'items.enhancements._id': detachmentId,
                },
                {
                    $set: {
                        'items.$[item].enhancements.$[rule].content': req.body.content,
                        'items.$[item].enhancements.$[rule].enchantPts': req.body.enchantPts,
                        'items.$[item].enhancements.$[rule].name': req.body.name,

                    },
                },
                {
                    arrayFilters: [
                        {'item._id': itemId}, // Фильтр для элемента в массиве items
                        {'rule._id': detachmentId}, // Фильтр для элемента в массиве rules
                    ],
                    new: true, // Возвращает обновленный документ
                }
            );

            const units = await AddedArmy.updateMany({'enchantmentUnit.enchantId': detachmentId},
                {$set: {"enchantmentUnit.name": req.body.name, "enchantmentUnit.enchantPts": req.body.enchantPts}})


            res.status(200).json({error: false, message: "Codex successfully update"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async editContentDetachment(req, res) {
        try {

            const {itemId, detachmentId, detachment} = req.body;

            const result = await Codex.findOneAndUpdate(
                {
                    _id: req.params.id,
                    'items._id': itemId,
                    'items.detachments._id': detachmentId,
                },
                {
                    $set: {
                        'items.$[item].detachments.$[rule].detachment': req.body.detachment,
                    },
                },
                {
                    arrayFilters: [
                        {'item._id': itemId}, // Фильтр для элемента в массиве items
                        {'rule._id': detachmentId}, // Фильтр для элемента в массиве rules
                    ],
                    new: true, // Возвращает обновленный документ
                }
            );

            res.status(200).json({error: false, message: "Codex successfully update"})
        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateDetachmentTitle(req, res) {
        try {
            const {itemId, detachmentId, title} = req.body;

            const result = await Codex.findOneAndUpdate(
                {
                    _id: req.params.id,
                    'items._id': itemId,
                    'items.detachments._id': detachmentId,
                },
                {
                    $set: {
                        'items.$[item].detachments.$[rule].title': req.body.title,
                    },
                },
                {
                    arrayFilters: [
                        {'item._id': itemId}, // Фильтр для элемента в массиве items
                        {'rule._id': detachmentId}, // Фильтр для элемента в массиве rules
                    ],
                    new: true, // Возвращает обновленный документ
                }
            );

            res.status(200).json({error: false, message: "Codex successfully update"})
        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async deleteContent(req, res) {
        try {

            const {itemId, contentId} = req.body;

            const result = await Codex.findOneAndUpdate(
                {
                    _id: req.params.id,
                    'items._id': itemId,
                },
                {
                    $pull: {
                        'items.$.rules': {_id: contentId}, // Удаляем правило по ID
                    },
                },
                {
                    new: true,
                })

            res.status(200).json({error: false, message: "Codex successfully delete"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async deleteContentEnhancement(req, res) {
        try {

            const {itemId, detachmentId} = req.body;

            const result = await Codex.findOneAndUpdate(
                {
                    _id: req.params.id,
                    'items._id': itemId,
                },
                {
                    $pull: {
                        'items.$.enhancements': {_id: detachmentId}, // Удаляем правило по ID
                    },
                },
                {
                    new: true,
                })

            res.status(200).json({error: false, message: "Codex successfully delete"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async sharedSameCodex(req, res) {
        try {
            const {itemId, detachment} = req.body;

            const result = await Codex.findOneAndUpdate(
                {
                    _id: req.params.id,
                    'items._id': itemId,
                },
                {
                    $push: {
                        'items.$.detachments': detachment, // Удаляем правило по ID
                    },
                },
                {
                    new: true,
                })


            res.status(200).json({error: false, message: "Shared codex"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async deleteDetachment(req, res) {
        try {

            const {itemId, detachmentId,codexId} = req.body;


            const result = await Codex.findOneAndUpdate(
                {
                    _id: req.params.id,
                    'items._id': itemId,
                },
                {
                    $pull: {
                        'items.$.detachments': {_id: detachmentId}, // Удаляем правило по ID
                        'items.$.enhancements': {detachmentId: detachmentId}
                    },
                },
                {
                    new: true,
                })


            const codex = await AddedUnits.find({detachment: detachmentId, shared: true,idCodex:codexId})

            if (codex.length !== 0) {

                const codexIds = codex.flatMap(e => String(e._id))

                const units = await AddedArmy.updateMany(
                    {codexId: {$in: codexIds}},
                    {
                        $set: {
                            'enchantmentUnit.name': '',
                            'enchantmentUnit.detachmentId': '',
                            'enchantmentUnit.enchantPts': 0,
                            'enchantmentUnit.enchantId': ''

                        }
                    })

                const cod = await Codex.findOne({
                    _id: req.params.id,
                    'items._id': itemId,
                }, {
                    "items.$": 1  // Возвращает только совпавший элемент массива items
                })

                const detachIdNew = cod.items.map(e => {
                    return e.detachments.length > 0 ? String(e.detachments[0]._id) : '';

                    }
                )

                await AddedUnits.updateMany({_id:{$in:codexIds}},{$set:{detachment:detachIdNew[0]}})

            }else{
                const codexFree = await AddedUnits.find({detachment: detachmentId})

                const codexFreeId = codexFree.flatMap(e => String(e._id))

                const cod = await Codex.findOne({
                    _id: req.params.id,
                    'items._id': itemId,
                }, {
                    "items.$": 1  // Возвращает только совпавший элемент массива items
                })


                const detachIdNew = cod.items.map(e => {
                        return e.detachments.length > 0 ? String(e.detachments[0]._id) : '';
                    }
                )

                await AddedUnits.updateMany({_id:{$in:codexFreeId}},{$set:{detachment:detachIdNew[0]}})


            }

            // await AddedUnits.updateMany({detachment:detachmentId},{$set:{detachment:''}})


            res.status(200).json({error: false, message: "Detachment successfully delete"})
        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async deleteCodex(req, res) {
        try {

            const codex = await Codex.findOne({'items._id': req.params.id})

            if (codex) {
                await Codex.updateOne({_id: codex._id}, {$pull: {'items': {_id: req.params.id}}})
            }

            res.status(200).json({error: false, message: "Codex successfully delete"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async deleteCategory(req, res) {
        try {

            await Codex.deleteOne({_id: req.params.id})

            res.status(200).json({error: false, message: "Category successfully delete"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }
}

module.exports = new Codexes()