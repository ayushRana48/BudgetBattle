const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

router.post('/new', groupController.handleNewGroup);
router.put('/add', groupController.addMember);
router.get('/getAll', groupController.getAll);
router.get('/getAllMembers', groupController.getAllMembers);
router.get('/getAllInvites', groupController.getAllInvites);
router.put('/leaveGroup', groupController.leaveGroup);
router.put('/leaveDeleteGroup', groupController.leaveDeleteGroup);
router.put('/setStartDate', groupController.setStartDate);
router.put('/setEndDate', groupController.setEndDate);
router.get('/getStartDate', groupController.getStartDate);
router.get('/getEndDate', groupController.getEndDate);



module.exports = router;