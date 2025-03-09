const Router = require('express')
const router = new Router()
const Codex = require('../controller/codex')


router.get('/', Codex.getCodex)
router.get('/:id', Codex.getCodexId)
router.get('/category/:id', Codex.getIdCodex)
router.post('/create', Codex.createCodex)


module.exports = router