const Router = require('express')
const router = new Router()
const Core = require('../controller/coreStratagem')


router.get('/', Core.getAllCoreStratagem)
router.post('/create', Core.createCoreStratagem)
router.patch('/update-core/:id',Core.updateCoreStratagem)
router.patch('/save-order',Core.saveOrder)
router.delete('/delete-core/:id', Core.deleteCoreStratagem)





module.exports = router