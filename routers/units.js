const Router = require('express')
const router = new Router()
const Unit = require('../controller/units')
const upload = require('../middleware/upload')
const AddedArmy = require("../controller/addedArmy");



router.post('/create', upload.single('image'), Unit.createUnit)
router.get('/', Unit.getUnits)
router.get('/units/:race', Unit.getUnitsOfCodex)
router.get('/array', Unit.getUnitsArr)
router.get('/search', Unit.searchUnit)
router.get('/search-squad', Unit.searchSquadUnit)
router.get('/search-transport', Unit.searchSquadUnitTransport)
router.get('/units', Unit.getUnitsCategory)
router.get('/:id', Unit.getUnitId)
router.patch('/:id', upload.single('image'), Unit.updateUnit)
router.patch('/screen-one/:id', upload.single('image'), Unit.screenOne)
router.patch('/screen-two/:id', upload.single('image'), Unit.screenSecond)
router.delete('/:id', Unit.deleteUnit)




module.exports = router