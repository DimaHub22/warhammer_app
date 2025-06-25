const Router = require('express')
const router = new Router()
const Codex = require('../controller/codex')
const upload = require('../middleware/upload')


router.get('/', Codex.getCodex)
router.get('/:id', Codex.getCodexId)
router.get('/added-shared/codex', Codex.getSharedSameCodex)
router.get('/my-codex/:id', Codex.getCodexIdFromItems)
router.get('/enchant-codex/:id', Codex.getEnchants)
router.get('/my-enchants/:id', Codex.getCodexItems)

router.get('/category/:id', Codex.getIdCodex)



router.post('/create', Codex.createCodex)
router.patch('/change/:id', Codex.categoryChange)
router.patch('/create-codex/:id', upload.single('image'),Codex.createCodexForCategory)
router.patch('/change-codex/:id', upload.single('image'),Codex.codexChange)
router.patch('/change-category/:id', Codex.changeCodexForCategory)
router.patch('/update-content/:id', Codex.updateContent)
router.patch('/update-detachment/:id',Codex.updateDetachment)
router.patch('/update-content-enhancement/:id', Codex.updateContentEnhancement)
router.patch('/update-choice-content/:id',Codex.editContent)
router.patch('/update-choice-detachment/:id',Codex.editContentDetachment)
router.patch('/update-choice-content-enhancement/:id',Codex.editContentEnhancement)
router.patch('/update-detachment-title/:id',Codex.updateDetachmentTitle)
router.patch('/delete-choice-content/:id',Codex.deleteContent)
router.patch('/delete-choice-detachment/:id',Codex.deleteDetachment)
router.patch('/delete-choice-enhancement/:id',Codex.deleteContentEnhancement)

router.patch('/shared-same-codex-choice/:id',Codex.sharedSameCodexs)
router.patch('/shared-same-codex',Codex.sharedSameCodex)

router.delete('/delete-codex/:id', Codex.deleteCodex)
router.delete('/delete-category/:id', Codex.deleteCategory)


module.exports = router