const Client = require('../models/Client');
const Admin = require('../models/Admin');
const Translator = require('../models/Translator');

const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const validator = require("validator");

async function register(params, callback) {
    if(params.username===undefined){
      return callback({message:"Username is required"});
    }
    const client=new Client(params);
  
    var user=client.username.split('.');
  if(user.length != 2 || (user[0] != "client")){
    console.log("username should be in the format of client._____ , ex: client.john12");
    return callback({message:" username should be in the format of client._____ , ex: client.john12"});
  }
    if (!validator.isEmail(client.email)) {
      console.log("Email entered is not a valid Email");
      return callback({message: "Email entered is not a valid Email"});
      
    }
  
    const exists = await Client.findOne({ username: client.username });
      if (exists) {
        console.log("Username already in use, please try another");
          return callback({message: "Username already in use, please try another"});
      }
  
     

      client.save()
     .then((response)=>{
      result={"email":response.email,"username":response.username,"name":response.name,"id":response._id}
           return callback(null,result);
  
     })
     .catch((error)=>{
   
      return callback(error);
     });
  
  }
  
  async function login({ username, password }, callback) {

    var user=username.split('.');
    var type = user[0];
  if(user.length != 2 || (user[0] != "client" && user[0] != "admin" && user[0] != "translator")){
    console.log("username should be in the format of client.name  or admin.name or translator.name");
    return callback({message:"Invalid Username Format , username should be in the format of client.name  or admin.name or translator.name"});
  }
  if(type=="client"){
    const user = await Client.findOne({ username });
    console.log(user);

    if (user != null) {
        
        if(bcrypt.compareSync(password,user.password)){
            const token = auth.generateAccessToken(user._id);
            result={"email":user.email,"username":user.username,"name":user.name,"id":user._id,"token":token}

            return callback(null,result);
            } 
            else{
                console.log("Invalid Username/Password");
                return callback(
                    {message:"Invalid Username/Password"});
            }
        }
        else{
             console.log("Username does not exist");
            return callback(
                {message:"Username does not exist"});
        }
  }
  if(type=="admin"){
    console.log("admin");
    }
    if(type=="translator"){
        console.log("translator");
    }
  

}

module.exports = { 
    login, 
    register };
