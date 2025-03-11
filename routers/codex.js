const Router = require('express')
const router = new Router()
const Codex = require('../controller/codex')
const upload = require('../middleware/upload')


router.get('/', Codex.getCodex)
router.get('/:id', Codex.getCodexId)
router.get('/category/:id', Codex.getIdCodex)
router.post('/create', Codex.createCodex)
router.patch('/create-codex/:id', upload.single('image'),Codex.createCodexForCategory)
router.patch('/change-codex/:id', upload.single('image'),Codex.codexChange)


module.exports = router