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