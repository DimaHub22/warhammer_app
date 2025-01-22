const Router = require('express')
const router = new Router()
const Squad = require('../controller/squad')


router.get('/',Squad.getSquadAll)
router.post('/add',Squad.createSquad)
router.patch('/add-leader/:id', Squad.updateLeaderForUnit)
router.patch('/add-second-leader/:id', Squad.updateSecondLeaderForLeader)
router.patch('/add-leader-second/:id', Squad.updateLeaderForSecondLeader)
router.patch('/attach/:id', Squad.attachUnit)
router.patch('/update-squad/:id', Squad.updateSquadUnit)
router.patch('/update-count/:id', Squad.updateSquadUnitCount)





module.exports = router