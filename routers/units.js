const Router = require('express')
const router = new Router()
const Unit = require('../controller/units')
const upload = require('../middleware/upload')
const AddedArmy = require("../controller/addedArmy");

router.get('/', Unit.getUnits)
router.get('/:id', Unit.getUnitId)
router.post('/create', upload.single('image'), Unit.createUnit)
router.get('/search/units/codex', Unit.searchUnit)
router.get('/units/:race', Unit.getUnitsOfCodex)
router.get('/array', Unit.getUnitsArr)


// router.get('/units-race', Unit.getUnitsRorRace)
router.get('/units-race/search', Unit.getUnitsRorRace)
router.get('/search-squad/search/unit', Unit.searchSquadUnit)

router.get('/search-transport', Unit.searchSquadUnitTransport)
router.get('/units', Unit.getUnitsCategory)


router.patch('/:id', upload.single('image'), Unit.updateUnit)
router.patch('/screen-one/:id', upload.single('image'), Unit.screenOne)
router.patch('/screen-two/:id', upload.single('image'), Unit.screenSecond)
router.delete('/:id', Unit.deleteUnit)




module.exports = router