const Codex = require('../models/Codex')


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

    async changeCodexForCategory(req,res){
        try {
            const {newCategoryId} = req.body
            const codex = await Codex.findOne({'items._id': req.params.id},{"items.$": 1})

            const lastCategoryId = codex._id
            const codexChoice = codex.items[0]
            console.log(lastCategoryId)

            const newCategory = await Codex.findOneAndUpdate({_id:newCategoryId},
                {$push:{'items': codexChoice}})


            await Codex.findOneAndUpdate({_id: lastCategoryId},
                {$pull:{'items':{_id:codexChoice._id}}})



            res.status(201).json({error: false, message: "Codex successfully created"})

        }catch (e) {
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

    async updateDetachment(req,res){
        try {
            const content = {
                title: req.body.title,
                detachment: req.body.detachment
            };
            const codexUp = await Codex.findOneAndUpdate({'items._id': req.params.id},
                {$push: {'items.$.detachments': content}})


            res.status(201).json({error: false, message: "Codex successfully created"})

        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateContentEnhancement(req,res){
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

    async editContentEnhancement(req,res){
        try {

            const {itemId, detachmentId, content,enchantPts} = req.body;

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


            res.status(200).json({error: false, message: "Codex successfully update"})

        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async editContentDetachment(req,res){
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
        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateDetachmentTitle(req,res){
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
        }catch (e) {
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

    async deleteContentEnhancement(req,res){
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

        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async deleteDetachment(req,res){
        try {

            const {itemId, detachmentId} = req.body;

            const result = await Codex.findOneAndUpdate(
                {
                    _id: req.params.id,
                    'items._id': itemId,
                },
                {
                    $pull: {
                        'items.$.detachments': {_id: detachmentId}, // Удаляем правило по ID
                    },
                },
                {
                    new: true,
                })

            res.status(200).json({error: false, message: "Detachment successfully delete"})
        }catch (e) {
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