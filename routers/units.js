const Router = require('express')
const router = new Router()
const Unit = require('../controller/units')


router.post('/create', Unit.createUnit)
router.get('/', Unit.getUnits)
router.get('/units', Unit.getUnitsCategory)
router.get('/:id')
router.patch('/:id', Unit.updateUnit)
router.delete('/:id')


module.exports = router