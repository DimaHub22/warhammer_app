const Router = require('express')
const router = new Router()
const Unit = require('../controller/units')

router.patch('/create/:id',Unit.addPtsForModel)
router.patch('/update/:id', Unit.updatePtsAndModel)



module.exports = router