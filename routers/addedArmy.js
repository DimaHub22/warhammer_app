const Router = require('express')
const router = new Router()
const AddedArmy = require('../controller/addedArmy')

router.get('/', AddedArmy.getArmy)
router.get('/:id', AddedArmy.getArmyId)
router.post('/addArmy', AddedArmy.addUnitToArmy)
router.delete('/:id', AddedArmy.deleteUnit)
router.patch('/:id', AddedArmy.updateArmyPower)





module.exports = router