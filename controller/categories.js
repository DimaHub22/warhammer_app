const Category = require('../models/Category')

class Categories {

    async createCategory(req, res) {
        try {
            const {category, image} = req.body

            const categories = await Category.findOne({category});

            if (categories) {
                return res.status(400).json({error: true, message: "Duplicate"})
            }

            const newCategory = await new Category({
                category, image
            })
            await newCategory.save()
            res.status(201).json(newCategory)

        } catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async getAllCategories(req,res){
        try {
            const categories = await Category.find()

            res.status(200).json(categories)

        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async getCategoryById(req,res){
        try {
            const category = await Category.findOne({_id:req.params.id})

            res.status(200).json(category)


        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

    async updateCategory(req,res){
        try {
            const update = {
                category:req.body.category
            }

            const category = await  Category.findOneAndUpdate(
                {_id:req.params.id},
                {$set:update},
                {new:true}
            )

            res.status(200).json(category)

        }catch (e) {
            console.log(e)
            res.status(400).json({error: true, message: "Error service"})
        }
    }

}

module.exports = new Categories()