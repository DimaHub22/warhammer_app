const Router = require('express')
const router = new Router()
const AddedArmy = require('../controller/addedArmy')

router.get('/', AddedArmy.getArmy)
router.get('/:race/:codexId', AddedArmy.getArmyOfCodex)
router.get('/:id', AddedArmy.getArmyId)

router.post('/addArmy', AddedArmy.addUnitToArmy)
router.post('/duplicate',AddedArmy.duplicateUnit)

router.delete('/:id', AddedArmy.deleteUnit)
router.delete('/items/units', AddedArmy.deleteManyUnits)
router.patch('/update-unit/transport', AddedArmy.updateUnitsFromTransport)
router.patch('/unit/:id', AddedArmy.updateAddedUnitForArmy)
router.patch('/:id', AddedArmy.updateArmyPower)
router.patch('/attach-unit/:id', AddedArmy.addAttachUnitForLeader)
router.patch('/attach-transport/:id', AddedArmy.addAttachUnitForTransport)
router.patch('/change/:id', AddedArmy.changeUnit)
router.patch('/duplicate-squad/:id', AddedArmy.duplicateArmySquad)

router.patch('/count/:id', AddedArmy.updateCoutn)
router.patch('/disembark-transport/:id', AddedArmy.disembarkTransport)
router.patch('/change-enchantment/:id', AddedArmy.changeEnchantmentUnit)



router.patch('/detach-leader/:id', AddedArmy.detachLeader)
router.patch('/detach-second/:id', AddedArmy.detachSecond)
router.patch('/detach-units/:id', AddedArmy.detachUnits)

router.patch('/attach-leader-squad/:id',AddedArmy.addAttachLeaderForSquad)

router.post('/is-reserve', AddedArmy.isReservers)






module.exports = router