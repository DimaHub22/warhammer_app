const Router = require('express')
const router = new Router()
const AddedUnits = require('../controller/addedUnits')


router.get('/', AddedUnits.getAddedUnits)
router.get('/:id', AddedUnits.getAddedUnitById)
router.post('/add', AddedUnits.addUnit)
router.post('/duplicate-race', AddedUnits.duplicateRace)
router.delete('/:id', AddedUnits.deleteAddedUnit)
router.patch('/list/:id', AddedUnits.updateLongList)
router.patch('/favorite-race/:id', AddedUnits.favoriteRace)
router.patch('/update-lock/:id',AddedUnits.lockCodex)
router.patch('/date/:id', AddedUnits.addDateForCodex)




module.exports = router