
const jwt=require('jsonwebtoken');


function authenticatetoken(req,res,next){
    const authHeader=req.headers['authorization'];
    const token=authHeader && authHeader.split(' ')[1];
    if(token==null){
     return res.sendStatus(401);
    }
    
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err){
            return res.sendStatus(403);
        }
        req.user=user;
        next();
    });
}
function generateAccessToken(id){
    return jwt.sign({data:id},process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:'3h'});
}
function getToken(header)
{
    if(header){
        const token=header.split(' ')[1];
        return token;
    }
    else{
        return null;
    }
}

function getUserIdFromToken(token) {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(decoded);
    return decoded.data;
  }

module.exports={
    authenticatetoken,
    generateAccessToken,
    getToken,
    getUserIdFromToken};