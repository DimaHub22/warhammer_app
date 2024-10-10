const Router = require('express')
const router = new Router()
const AddedUnits = require('../controller/addedUnits')


router.get('/', AddedUnits.getAddedUnits)
router.get('/:id', AddedUnits.getAddedUnitById)
router.post('/add', AddedUnits.addUnit)
router.delete('/:id', AddedUnits.deleteAddedUnit)
router.patch('/:id', AddedUnits.updateLongList)




module.exports = router