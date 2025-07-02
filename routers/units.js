const Router = require('express')
const router = new Router()
const Unit = require('../controller/units')
const upload = require('../middleware/upload')
const AddedArmy = require("../controller/addedArmy");

router.delete('/:id', Unit.deleteUnit)
router.get('/', Unit.getUnits)
router.get('/:id', Unit.getUnitId)
router.post('/create', upload.single('image'), Unit.createUnit)
router.get('/search/units/codex', Unit.searchUnit)
router.get('/units/:race', Unit.getUnitsOfCodex)
router.get('/array-units/codex', Unit.getUnitsArr)
router.get('/units/units-codex/all-units', Unit.getUnitsCategory)

// router.get('/units-race', Unit.getUnitsRorRace)
router.get('/units-race/search', Unit.getUnitsRorRace)
router.get('/search-squad/search/unit', Unit.searchSquadUnit)

router.get('/search-transport/transport', Unit.searchSquadUnitTransport)



router.patch('/:id', upload.single('image'), Unit.updateUnit)
router.patch('/screen-one/:id', upload.single('image'), Unit.screenOne)
router.patch('/screen-two/:id', upload.single('image'), Unit.screenSecond)
router.patch('/update-enchancement/:id',Unit.updateEnchancements)
router.patch('/update-added-units/:id',Unit.updateAllAddedUnits)
router.patch('/update-allide/:id',Unit.updateAlliedUnits)
router.post('/update-allide-new',Unit.updateNewAlliedUnits)
router.patch('/update-same/:id',Unit.updateSameCodex)
router.post('/update-same-new',Unit.updateNewSameCodex)
router.patch('/update-codex-same/:id',Unit.deleteUnitForSameCodex)
router.patch('/update-codex-allied/:id',Unit.deleteUnitForAlliedUnits)

router.patch('/delete-enchancement-unit/:id',Unit.deleteEnchantForAddedUnits)





module.exports = router