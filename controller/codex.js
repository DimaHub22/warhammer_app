const Codex = require('../models/Codex')
const AddedArmy = require('../models/AddedArmy')
const AddedUnits = require('../models/AddedUnits')
const SameCodex = require('../models/SameCodex')
const Units = require('../models/Units')

const { ObjectId } = require('mongodb');

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

            const addedCodex = await AddedUnits.updateMany(
                {idCodex: req.params.id},
                {$set :{
                        name: req.body.name,
                        image: req.file ? req.file.path : codex.items[0].image
                    }})
            console.log(addedCodex)

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

    async getEnchants(req, res) {
        try {

            const codex = await Codex.findOne({'items._id': req.params.id}, {"items.$": 1})
            const detachId = codex.items.flatMap(e => e.detachments.flatMap(el => String(el._id)))

            const enhancements = await Codex.aggregate([
                // Разворачиваем массив items (если enhancements внутри items)
                { $unwind: "$items" },
                // Разворачиваем массив enhancements внутри items
                { $unwind: "$items.enhancements" },
                // Фильтруем enhancements по detachmentId
                { $match: { "items.enhancements.detachmentId": { $in: detachId } } },
                // Оставляем только enhancements (без вложенной структуры)
                { $replaceRoot: { newRoot: "$items.enhancements" } }
            ]);

            res.status(200).json(enhancements)

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

    async getStratagems(req, res) {
        try {

            const {itemId, detachment} = req.body;

            const stratagems = await Codex.aggregate([
                // 1. Разворачиваем массив items
                {$unwind: "$items"},

                // 2. Разворачиваем массив enhancements
                {$unwind: "$items.stratagems"},

                // 3. Фильтруем только enhancements с нужным detachmentId
                {$match: {"items.stratagems.detachmentId": req.params.id}},

                // 4. Формируем результат (только нужные данные)
                {
                    $project: {
                        _id: 0, // Исключаем служебные поля
                        stratagems: "$items.stratagems",
                    }
                }
            ]);

            res.status(200).json(stratagems)

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateContent(req, res) {
        try {

            const content = {
                content: req.body.content,
                name:req.body.name,
                color:req.body.color
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
                detachment: req.body.detachment,
                color:req.body.color
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
                name: req.body.name,
                color:req.body.color
            };

            const codexUp = await Codex.findOneAndUpdate({'items._id': req.params.id},
                {$push: {'items.$.enhancements': content}})

            res.status(201).json({error: false, message: "Codex successfully created"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateContentStrategem(req,res){
        try {

            const content = {
                content: req.body.content,
                detachmentId: req.body.detachmentId,
                pcCost: req.body.pcCost,
                name: req.body.name,
                color:req.body.color
            };

            const codexUp = await Codex.findOneAndUpdate({'items._id': req.params.id},
                {$push: {'items.$.stratagems': content}})

            res.status(201).json({error: false, message: "Codex successfully created"})

        }catch (e) {
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
                        'items.$[item].rules.$[rule].name': req.body.name,
                        'items.$[item].rules.$[rule].color': req.body.color,
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
                        'items.$[item].enhancements.$[rule].color': req.body.color,

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

    async editContentStratagem(req,res){
        try {

            const {itemId, detachmentId, content, pcCost} = req.body;

            const result = await Codex.findOneAndUpdate(
                {
                    _id: req.params.id,
                    'items._id': itemId,
                    'items.stratagems._id': detachmentId,
                },
                {
                    $set: {
                        'items.$[item].stratagems.$[rule].content': req.body.content,
                        'items.$[item].stratagems.$[rule].pcCost': req.body.pcCost,
                        'items.$[item].stratagems.$[rule].name': req.body.name,
                        'items.$[item].stratagems.$[rule].color': req.body.color,

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

            // const units = await AddedArmy.updateMany({'enchantmentUnit.enchantId': detachmentId},
            //     {$set: {"enchantmentUnit.name": req.body.name, "enchantmentUnit.enchantPts": req.body.enchantPts}})


            res.status(200).json({error: false, message: "Codex successfully update"})

        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async editContentDetachment(req, res) {
        try {

            const {itemId, detachmentId,color,detachment} = req.body;


            const result = await Codex.findOneAndUpdate(
                {
                    _id: req.params.id,
                    'items._id': itemId,
                    'items.detachments._id': detachmentId,
                },
                {
                    $set: {
                        'items.$[item].detachments.$[rule].color': req.body.color,
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

            await Codex.updateMany(
                {
                    "items.detachments._id": detachmentId,
                    "items.detachments.shared": true
                },
                {
                    $set: {
                        "items.$[item].detachments.$[detach].color": req.body.color,
                        "items.$[item].detachments.$[detach].detachment": req.body.detachment
                    }
                },
                {
                    arrayFilters: [
                        {
                            "item.detachments._id": detachmentId,
                            "item.detachments.shared": true
                        },
                        {
                            "detach._id": detachmentId,
                            "detach.shared": true
                        }
                    ],
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
            const {itemId, detachmentId, color,title} = req.body;

            const result = await Codex.findOneAndUpdate(
                {
                    _id: req.params.id,
                    'items._id': itemId,
                    'items.detachments._id': detachmentId,
                },
                {
                    $set: {
                        'items.$[item].detachments.$[rule].color': req.body.color,
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

            await Codex.updateMany(
                {
                    "items.detachments._id": detachmentId,
                    "items.detachments.shared": true
                },
                {
                    $set: {
                        "items.$[item].detachments.$[detach].color": req.body.color,
                        "items.$[item].detachments.$[detach].title": req.body.title
                    }
                },
                {
                    arrayFilters: [
                        {
                            "item.detachments._id": detachmentId,
                            "item.detachments.shared": true
                        },
                        {
                            "detach._id": detachmentId,
                            "detach.shared": true
                        }
                    ],
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

    async deleteContentStratagem(req,res){
        try {

            const {itemId, detachmentId} = req.body;

            const result = await Codex.findOneAndUpdate(
                {
                    _id: req.params.id,
                    'items._id': itemId,
                },
                {
                    $pull: {
                        'items.$.stratagems': {_id: detachmentId}, // Удаляем правило по ID
                    },
                },
                {
                    new: true,
                })

            res.status(200).json({error: false, message: "Codex successfully delete"})

        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async sharedSameCodexs(req, res) {
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

    async sharedSameCodex(req, res) {
        try {
            const {detachId, value} = req.body;

            if (value) {
                const addDetach = await SameCodex.findOneAndUpdate(
                    {},
                    {$addToSet: {'sharedDetachments': detachId}},
                    {
                        upsert: true,  // Создать новый документ, если не найден
                        new: true      // Вернуть обновленный/новый документ
                    })
            } else {
                const deleteDetach = await SameCodex.findOneAndUpdate({},
                    {$pull: {'sharedDetachments': detachId}},
                )

                const res1 = await Codex.aggregate([
                    { $unwind: "$items" }, // Разворачиваем массив items
                    { $unwind: "$items.enhancements" }, // Разворачиваем enhancements
                    { $match: { "items.enhancements.detachmentId": detachId } }, // Фильтруем по detachmentId
                    {
                        $project: {
                            codexId: "$items._id", // Сохраняем _id кодекса
                            enhancementId: "$items.enhancements._id" // Также можно добавить _id enhancement
                        }
                    }
                ]);

                const codexId = [...new Set(res1.map(e => String(e.codexId)))]
                const enchantId = res1.flatMap(e => String(e.enhancementId))


                const units = await Units.updateMany({ race: { $ne: codexId[0] } },{$pull:{'enchancements':{$in:enchantId}}})

                const result = await Codex.updateMany(
                    {
                        'items.detachments._id': detachId, 'items.detachments.shared': true
                    },
                    {
                        $pull: {
                            'items.$.detachments': {_id: detachId}, // Удаляем правило по ID
                            // 'items.$.enhancements': {detachmentId: detachmentId}
                        }
                    }
                )

                const codexFree = await AddedUnits.find({detachment: detachId,shared:true})

                if (codexFree.length !== 0) {

                    const codexIds = codexFree.flatMap(e => String(e._id))

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

                    // 2. Для каждой записи находим соответствующий кодекс
                    for (const unit of codexFree) {
                        // 3. Находим кодекс по idCodex
                        const codex = await Codex.findOne({
                            "items._id": unit.idCodex
                        });

                        // 4. Находим нужный item в кодексе
                        const item = codex.items.find(i => String(i._id) === unit.idCodex);

                        // 5. Берем первый enhancements
                        const firstEnhancementId = item.detachments.length !== 0 ? item.detachments[0]._id : '';

                        // 6. Обновляем запись в AddedUnits
                        await AddedUnits.updateOne(
                            {_id: unit._id},
                            {$set: {detachment: firstEnhancementId}}
                        );
                    }


                }


            }


            res.status(200).json({error: false, message: "Shared codex"})

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async getSharedSameCodex(req, res) {
        try {

            const sameCodex = await SameCodex.findOne();
            res.status(200).json(sameCodex.sharedDetachments)

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async deleteDetachment(req, res) {
        try {

            const {itemId, detachmentId, value, codexId} = req.body;

            const enhancement = await Codex.findOne(
                { "items.enhancements.detachmentId": detachmentId },
                { "items.enhancements.$": 1 } // Проекция для точного совпадения
            );

            const enhancementId = String(enhancement?.items?.[0]?.enhancements?.[0]?._id);
            const enhancementIdArr = enhancement?.items?.[0].enhancements.flatMap(e => String(e._id))
            console.log(enhancementIdArr)
            const result = await Codex.findOneAndUpdate(
                {
                    _id: req.params.id,
                    'items._id': itemId,
                },
                {
                    $pull: {
                        'items.$.detachments': {_id: detachmentId}, // Удаляем правило по ID
                        'items.$.enhancements': {detachmentId: detachmentId},
                        'items.$.stratagems': {detachmentId: detachmentId},
                    },
                },
                {
                    new: true,
                })

            if (value) {

                const codex = await AddedUnits.find({detachment: detachmentId, idCodex: codexId})

                // const units = await Units.updateMany({ race: codexId },{$pull:{'enchancements':enhancementId}})

                const units = await Units.updateMany({ race: codexId },{$pull:{'enchancements':{$in:enhancementIdArr}}})

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

                    await AddedUnits.updateMany({_id: {$in: codexIds}}, {$set: {detachment: detachIdNew[0]}})

                }
            } else {

                const codexFree = await AddedUnits.find({detachment: detachmentId})


                ///////////////

                const result = await Codex.updateMany(
                    {
                        'items.detachments._id': detachmentId,
                    },
                    {
                        $pull: {
                            "items.$.detachments": {_id: detachmentId},
                            'items.$.enhancements': {detachmentId: detachmentId}
                        }
                    }
                )

                const deleteDetach = await SameCodex.findOneAndUpdate({},
                    {$pull: {'sharedDetachments': detachmentId}},
                )

                // 2. Для каждой записи находим соответствующий кодекс
                for (const unit of codexFree) {
                    // 3. Находим кодекс по idCodex
                    const codex = await Codex.findOne({
                        "items._id": unit.idCodex
                    });

                    // 4. Находим нужный item в кодексе
                    const item = codex.items.find(i => String(i._id) === unit.idCodex);

                    // 5. Берем первый enhancements
                    const firstEnhancementId = item.detachments[0]._id;

                    // 6. Обновляем запись в AddedUnits
                    await AddedUnits.updateOne(
                        {_id: unit._id},
                        {$set: {detachment: firstEnhancementId}}
                    );
                }
                //////////////

            }


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