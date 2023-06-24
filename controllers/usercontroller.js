const bycrptjs = require('bcryptjs');
const userService = require('../services/userservices');
require('dotenv').config()
const validator = require("validator");
const Client = require('../models/Client');
const Translator = require('../models/Translator');
const Admin = require('../models/Admin');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
 



exports.sendEmail = async (email,title, mess) => {
  try{
    const transporter = nodemailer.createTransport({
      // Replace with your SMTP server details
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const message = {
      from: 'mohamed2001hoss@gmail.com',
      to: email,
      subject: title,
      text: mess,
    };

    // Send the email
    await transporter.sendMail(message);
    return "200"
  }catch(error){
    console.log(error)
    return "400"
    }
}

const sendPasswordResetEmail = async (email,type) => {
  try {
   var code= crypto.randomInt(100000000).toString().padStart(8, '0');
  
   console.log(code)

    // Create a SMTP transporter object
    const transporter = nodemailer.createTransport({
      // Replace with your SMTP server details
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    // Define the email message
    const message = {
      from: 'mohamed2001hoss@gmail.com',
      to: email,
      subject: 'Password Reset Request',
      text: `Dear User, here is your password reset code : ${code}`,
    };

    // Send the email
    await transporter.sendMail(message);
    if(type=="client"){
      var client = await Client.findOne({ email: email });
      client.passwordResetCode=code;
      client.save();
      return "200" ;
    }
    if(type=="translator"){
      var translator = await Translator.findOne({ email: email });
      translator.passwordResetCode=code;
      translator.save();
      return "200" ;
    }
    if(type=="admin"){
      var admin = await Admin.findOne({ email: email });
      admin.passwordResetCode=code;
      admin.save();
      return "200" ;
    }

  
  } catch (error) {
   console.log(error)
    return "400" ;
   
  }
};

exports.checkCode = async (req, res) => {
  try {
    const { email, type, code } = req.body;
    
    if (type == "client"){
        var client = await Client.findOne({ email: email });
        if (client.passwordResetCode == code) {
          return res.status(200).json({ status: "200", message: 'code is correct' });
        }
        else {
          return res.status(400).json({ status: "400", message: 'code is incorrect' });
        }
    }

    if (type == "translator"){
      var translator = await Translator.findOne({ email: email });
        if (translator.passwordResetCode == code) {
          return res.status(200).json({ status: "200", message: 'code is correct' });
        }
        else {
          return res.status(400).json({ status: "400", message: 'code is incorrect' });
        }
    }

    if (type == "admin"){
      var admin = await Admin.findOne({ email: email });
      if (admin.passwordResetCode == code) {
        return res.status(200).json({ status: "200", message: 'code is correct' });
      }
      else {
        return res.status(400).json({ status: "400", message: 'code is incorrect' });
      }
    }
  } catch (error) {
    return res.status(400).json({ status: "400", message: 'error' });
  }
}

exports.register = (req, res, next) => {
  const { password } = req.body;

  if (!validator.isStrongPassword(password)) {
    return next({ message: "Password must be strong, you need to have a capital letter, lowercase letter , a number and a special character " });

  }
  const salt = bycrptjs.genSaltSync(10);
  req.body.password = bycrptjs.hashSync(password, salt);
  userService.register(req.body, (error, result) => {


    if (error) {
      return next(error);
    }

    return res.status(200).send({
      message: "User Registered Successfully",
      data: result
    });
  })
}

exports.login = (req, res, next) => {
  const { username, password } = req.body;


  userService.login({ username, password }, (error, result) => {
    if (error) {
      return next(error);
    }

    return res.status(200).json({
      message: "User logged in Successfully",
      data: result
    });


  });
}

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email, username } = req.body;

    // Find user with the provided email

    var user = username.split('.');
    var type = user[0];
    if (type == "client") {
      var client = await Client.findOne({ username: username });
      if (client) {
        if (client.email == email) {
          var result = await sendPasswordResetEmail(client.email,type);
         
          if(result=='200'){
            return res.status(200).json({ status: "200", message: 'Password reset email sent' }); 
         }else{
             var status = result;
            return res.status(status).json({ status: status, message: 'email not sent' });
         }
        } else {
          return res.status(404).json({ status: "404", message: 'Incorrect Email' });
        }
      } else {
        return res.status(404).json({ status: "404", message: 'client not found' });
      }
    }
    if (type == "translator") {
      var translator = await Translator.findOne({ username: username });
      if (translator) {
        if (translator.email == email) {
          var result =await sendPasswordResetEmail(translator.email,type);
          if(result=='200'){
            return res.status(200).json({ status: "200", message: 'Password reset email sent' }); 
         }else{
              var status = result;
            return res.status(status).json({ status: status, message: 'email not sent' });
         }
        } else {
          return res.status(404).json({ status: "404", message: 'Incorrect Email' });
        }
      } else {
        return res.status(404).json({ status: "404", message: 'translator not found' });
      }
    }
    if (type == "admin") {
      var admin = await Admin.findOne({ username: username });
      if (admin) {
        if (admin.email == email) {

          var result = await sendPasswordResetEmail(admin.email,type);
           if(result=='200'){
            
              return res.status(200).json({ status: "200", message: 'Password reset email sent' }); 
           }else{
               var status = result
              return res.status(status).json({ status: status, message: 'email not sent' });
           }
      

        } else {
          return res.status(404).json({ status: "404", message: 'Incorrect Email' });
        }
      } else {
        return res.status(404).json({ status: "404", message: 'admin not found' });
      }
    }
  } catch (error) {
   return res.status(400).json({ status: "400", message: error.message });
  }
};

exports.changepassword = async (req, res) => {
  try {
    const { email, type, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    newpass = bcrypt.hashSync(password, salt);
    
    if (type == "client"){
        var client = await Client.findOne({ email: email });
        if (client) {  
          client.password = newpass;
          client.save();
         res.status(200).json({ status: "200", message: 'password changed successfully' });
        }else{
          return res.status(404).json({ status: "404", message: 'client not found' });
        }
    }

    if (type == "translator"){
      var translator = await Translator.findOne({ email: email });
      if (translator) {
        translator.password = newpass;
        translator.save();
       res.status(200).json({ status: "200", message: 'password changed successfully' });
      }else{
        return res.status(404).json({ status: "404", message: 'translator not found' });
      }
    }

    if (type == "admin"){
      var admin = await Admin.findOne({ email: email });
      if (admin) {
        admin.password = newpass;
        admin.save();
       res.status(200).json({ status: "200", message: 'password changed successfully' });
      }else{
        return res.status(404).json({ status: "404", message: 'admin not found' });
      }
    }
  } catch (error) {
    return res.status(400).json({ status: "400", message: 'error' });
  }

}



  