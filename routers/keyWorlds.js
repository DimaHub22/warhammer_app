const Router = require('express')
const router = new Router()
const Keywords = require('../controller/keyWords')


router.get('/',Keywords.getAllKeywords)
router.post('/keywords', Keywords.createKeyWord)


module.exports = router