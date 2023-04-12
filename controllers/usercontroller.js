const bycrptjs = require('bcryptjs');
const userService = require('../services/userservices');
const auth = require('../middleware/auth');
require('dotenv').config()
const validator = require("validator");


exports.register = (req, res, next) => {
 const{password}=req.body;

 if (!validator.isStrongPassword(password)) {
  return next({message: "Password must be strong, you need to have a capital letter, lowercase letter , a number and a special character "});

}
 const salt =bycrptjs.genSaltSync(10);
 req.body.password=bycrptjs.hashSync(password,salt);
 userService.register(req.body,(error,result)=>{
 

    if(error){
      console.log("here ----",error);
      return next(error);
    }
   
   return res.status(200).send({message:"User Registered Successfully",
    data:result});
 })
}

exports.login = (req, res, next) => {
const{username,password}=req.body;


userService.login({username,password},(error,result)=>{
    if(error){
      console.log("here ----",error);
        return next(error);
      }
      
     return res.status(200).json({message:"User logged in Successfully",
      data:result});
   

});
}
exports.userProfile = (req, res, next) => {
//   const authHeader=req.headers['authorization'];
//   const token= auth.getToken(authHeader)
//   if(token==null){
//     console.log("here");
//   }else{
// console.log(token);
// const id = auth.getUserIdFromToken(token);
//   console.log(id)
//   }
//console.log('here');
    return res.status(200).json({message:"Authorized USER"});
}