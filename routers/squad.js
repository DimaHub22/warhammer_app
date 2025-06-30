const Router = require('express')
const router = new Router()
const Squad = require('../controller/squad')

router.get('/reset-app', Squad.resetApp)
router.get('/',Squad.getSquadAll)
router.post('/add',Squad.createSquad)
router.patch('/add-leader/:id', Squad.updateLeaderForUnit)

router.patch('/add-second-leader/:id', Squad.updateSecondLeaderForLeader)
router.patch('/add/second-leader/:id', Squad.updateArrSecondLeaderForLeader)

router.patch('/add-leader-second/:id', Squad.updateLeaderForSecondLeader)
router.patch('/add/leader-second/:id', Squad.updateArrLeaderForSecondLeader)

router.patch('/add-transport/:id', Squad.updateUnitForTransport)
router.patch('/add-transport-unit/:id',Squad.updateTransportForUnit)
router.patch('/add-transport/new-unit/:id', Squad.updateTransportNewUnit)
router.patch('/attach/:id', Squad.attachUnit)
router.patch('/attach/transport/:id', Squad.attachUnitTransport)
router.patch('/update-squad/:id', Squad.updateSquadUnit)
router.patch('/update-count/:id', Squad.updateSquadUnitCount)





module.exports = router