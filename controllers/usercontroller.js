const bycrptjs = require('bcryptjs');
const userService = require('../services/userservices');
const auth = require('../middleware/auth');
require('dotenv').config()
const validator = require("validator");
const Client = require('../models/Client');


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
  return res.status(200).json({ message: "Authorized USER" });
}


const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Client.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const token = await createtoken(user._id);

    const url = `http://localhost:5000/api/users/changepassword/` + token;
    const url2 = `http://localhost:3000/forgotpassword/` + token;

    nodeoutlook.sendEmail({
      auth: {
        user: process.env.EMAIL, // Your email must be same outlook email
        pass: process.env.PASSWORD,
      },
      from: process.env.EMAIL,
      to: email,
      subject: "Reset Password",
      html: `<h1>DONOT FORGOT PASSWORD AGAIN</h1>
          <p>Click on the link below to reset your password</p>
          <a href=${url2}>${url2}</a>`,
      onError: (e) => console.log(e),
      onSuccess: (i) => console.log(i),
    });

    res.status(200).json({ url });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


