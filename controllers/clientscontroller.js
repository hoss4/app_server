
const Client = require('../models/Client')
const RequestedTranslation=require('../models/requested_translation')


const createclient = async (req, res) => {

try{
 
    const client = await Client.create({
        email: req.body.email,
        password: req.body.password,
        backupemail: req.body.backupemail,
        name: req.body.name
    })
    res.status(200).json(client)
}catch(err){
    res.status(400).json({message: err.message})
}
}

const updateclient = async (req, res) => {
    const id = req.params.id
    console.log(id)
    const{email,password,backupemail,name}=req.body
    try{
    const client=await Client.findByIdAndUpdate(id,{
        email: email,
        password: password,
        backupemail: backupemail,
        name:name
    })
console.log(client)
if(client){
    res.status(200).send({"update":req.body,"message":"client updated successfully"});
}else{
    res.status(404).json({message: "client not found"})
}
    }
catch(error)
{
    res.status(400).json({message: error.message})
}
}



const getclient = async (req, res) => {
    const email = req.body.username
    //const password = req.body.password
    console.log(email)
    try{
    const client=await Client.find({});
    console.log(client)
    if(client){
    res.status(200).json(client.password);
    }else{
    res.status(404).json({message: "client not found"})
    }
    }
    catch(error)
    {
        res.status(400).json({message: error.message})
    }   

}

const requesttranslation = async (req, res) => {
    const id = req.params.id
    const{tolang,fromlang,overphone,inperson,date,}=req.body
    try{
        const request = await RequestedTranslation.create({
            clientid: id,
            tolang: tolang,
            fromlang: fromlang,
            overphone: overphone,
            inperson: inperson,
            date: date,
           
        })



        console.log(request.clientid,request._id)
       const client = await Client.findByIdAndUpdate(id,{   
        $push: {reqtrans: request._id}
    })
    console.log(client)

        res.status(200).json(request)

    }
    catch(error)
    {
        res.status(400).json({message: error.message})
    }

 }


module.exports = {
    createclient,
    updateclient,
    getclient,
    requesttranslation,
};