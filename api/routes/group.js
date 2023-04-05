const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

router.post('/new', groupController.handleNewGroup);
router.put('/add', groupController.addMember);
router.get('/getAll', groupController.getAll);
router.get('/getAllMembers', groupController.getAllMembers);




module.exports = router;