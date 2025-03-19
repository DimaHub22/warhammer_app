const Router = require('express')
const router = new Router()
const Category = require('../controller/categories')

router.post('/create', Category.createCategory)
router.get('/all', Category.getAllCategories)
router.get('/:id', Category.getCategoryById)
router.patch('/:id', Category.updateCategory)
router.delete('/:id',Category.deleteUnitCategory)

module.exports = router