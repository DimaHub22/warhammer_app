const Router = require('express')
const router = new Router()
const AddedArmy = require('../controller/addedArmy')

router.get('/', AddedArmy.getArmy)
router.get('/:race/:codexId', AddedArmy.getArmyOfCodex)
router.get('/:id', AddedArmy.getArmyId)
router.post('/addArmy', AddedArmy.addUnitToArmy)
router.delete('/:id', AddedArmy.deleteUnit)
router.delete('/items/units', AddedArmy.deleteManyUnits)
router.patch('/update-unit/transport', AddedArmy.updateUnitsFromTransport)
router.patch('/unit/:id', AddedArmy.updateAddedUnitForArmy)
router.patch('/:id', AddedArmy.updateArmyPower)
router.patch('/attach-unit/:id', AddedArmy.addAttachUnitForLeader)
router.patch('/attach-transport/:id', AddedArmy.addAttachUnitForTransport)
router.patch('/change/:id', AddedArmy.changeUnit)

router.patch('/count/:id', AddedArmy.updateCoutn)
router.patch('/disembark-transport/:id', AddedArmy.disembarkTransport)







module.exports = router