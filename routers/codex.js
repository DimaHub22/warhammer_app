const Router = require('express')
const router = new Router()
const Codex = require('../controller/codex')
const upload = require('../middleware/upload')


router.get('/', Codex.getCodex)
router.get('/:id', Codex.getCodexId)
router.get('/my-codex/:id', Codex.getCodexIdFromItems)
router.get('/category/:id', Codex.getIdCodex)

router.post('/create', Codex.createCodex)
router.patch('/change/:id', Codex.categoryChange)
router.patch('/create-codex/:id', upload.single('image'),Codex.createCodexForCategory)
router.patch('/change-codex/:id', upload.single('image'),Codex.codexChange)
router.patch('/update-content/:id', Codex.updateContent)
router.patch('/update-choice-content/:id',Codex.editContent)
router.patch('/delete-choice-content/:id',Codex.deleteContent)
router.delete('/delete-codex/:id', Codex.deleteCodex)
router.delete('/delete-category/:id', Codex.deleteCategory)


module.exports = router