const {
    login,
    register,
    userProfile,
}=require ('../controllers/usercontroller')

const express = require('express');
const router = express.Router();
router.post('/register',register);
router.post('/login',login);
router.get('/userProfile',userProfile);
module.exports = router;