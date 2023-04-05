const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');


router.get('/getAll', userController.getAllUsers);
router.get('/getUserInfo', userController.getUserInfo);

router.put('/updateUserBankInfo',userController.updateBankInfo)

router.get('/getGroups',userController.getUserGroups)

module.exports = router;