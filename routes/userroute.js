const {
    login,
    register,
    forgotPassword,
    checkCode,
    changepassword,
    
}=require ('../controllers/usercontroller')

const express = require('express');
const router = express.Router();
router.post('/register',register);
router.post('/login',login);
router.post('/forgotPassword',forgotPassword);
router.post('/checkcode',checkCode);
router.post('/changepassword',changepassword);

module.exports = router;