const Router = require('express')
const router = new Router()
const Keywords = require('../controller/keyWords')


router.get('/',Keywords.getAllKeywords)
router.get('/:id',Keywords.getKeywordId)
router.post('/keywords', Keywords.createKeyWord)
router.patch('/:id',Keywords.updateKeyword)


module.exports = router