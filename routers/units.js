const Router = require('express')
const router = new Router()
const Unit = require('../controller/units')
const upload = require('../middleware/upload')



router.post('/create', upload.single('image'), Unit.createUnit)
router.get('/', Unit.getUnits)
router.get('/search', Unit.searchUnit)
router.get('/units', Unit.getUnitsCategory)
router.get('/:id')
router.patch('/:id', upload.single('image'), Unit.updateUnit)
router.delete('/:id', Unit.deleteUnit)




module.exports = router