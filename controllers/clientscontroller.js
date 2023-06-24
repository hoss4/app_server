const auth = require('../middleware/auth');
const Client = require('../models/Client');
const RequestedTranslation = require('../models/Requested_Translation');
const AssignedTranslation = require('../models/Assigned_Requests');
const bcrypt = require('bcryptjs');
const validator = require("validator");
const AcceptedTranslation = require('../models/Accepted_Translations');
const Translator = require('../models/Translator');



const updateclient = async (req, res) => {
    const token = auth.getToken(req)
    if (token == null) {
        console.log("no token");
        return res.status(401).json({ message: "no token" });
    }
    const id = auth.getUserIdFromToken(token);
    const { email, username, name } = req.body
    console.log(id, email, username, name)

    var user = username.split('.');
    if (user.length != 2 || (user[0] != "client")) {
        return res.status(404).send({ message: " username should be in the format of client._____ , ex: client.john12", status: "404" });
    }
    if (!validator.isEmail(email)) {
        return res.status(404).send({ message: "Email entered is not a valid Email", status: "404" });
    }
    const checkuser = await Client.findOne({ username: username });
    if (checkuser && checkuser._id != id) {
        return res.status(404).send({ message: "Username is already used", status: "404" });
    }
    const checkemail = await Client.findOne({ email: email });
    if (checkemail && checkemail._id != id) {
        return res.status(404).send({ message: "Email is already used", status: "404" });
    }
    
    try {
        const client = await Client.findByIdAndUpdate(id, {
            email: email,
            username: username,
            name: name
        })
        if (client) {
            res.status(200).send({ "update": req.body, 'message': "client updated successfully", "status": "200" });
        } else {
            res.status(404).json({ message: "client not found", status: "404" })
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message, status: "400" })
    }
}


const resetpassword = async (req, res) => {
    const token = auth.getToken(req)
    if (token == null) {
        console.log("no token");
        return res.status(401).json({ message: "no token" });
    }
    const id = auth.getUserIdFromToken(token);
    const { password, newpass } = req.body
    if (!validator.isStrongPassword(newpass)) {
        return res.status(404).send({ message: "New password must be strong, you need to have a capital letter, lowercase letter , a number and a special character " });
    }
    try {
        const client = await Client.findById(id);
        console.log(client.password)
        if (bcrypt.compareSync(password, client.password)) {
            const salt = bcrypt.genSaltSync(10);
            newpasshash = bcrypt.hashSync(newpass, salt);
            client.password = newpasshash;
            client.save();
            res.status(200).send({ "message": "password updated successfully", status: "200" });
        }
        else {
            res.status(404).json({ "message": "old password is incorrect", status: "404" })
        }

    }
    catch (error) {
        res.status(400).json({ message: error.message, status: "400" })
    }
}

const getclient = async (req, res) => {

    const token = auth.getToken(req)
    if (token == null) {
        console.log("no token");
        return res.status(401).json({ message: "no token" });
    }
    const id = auth.getUserIdFromToken(token);

    try {

        const client = await Client.findById(id);
        console.log(client)
        res.status(200).json(client);

    } catch (error) {
        res.status(400).json({ message: error.message })
    }

}

const requesttranslation = async (req, res) => {
    console.log("requesttranslation");
    const token = auth.getToken(req)
    if (token == null) {
        console.log("no token");
        return res.status(401).json({ message: "no token" });
    }
    const id = auth.getUserIdFromToken(token);
    const { tolanguage, fromlanguage, onthephone, inperson, date } = req.body
    console.log(id, tolanguage, fromlanguage, onthephone, inperson, date)
    try {
        const request = await RequestedTranslation.create({
            clientid: id,
            tolang: tolanguage,
            fromlang: fromlanguage,
            onthephone: onthephone,
            inperson: inperson,
            date: date,

        })

        console.log(request.clientid, request._id)
    

        res.status(200).json({ message: "translation requested successfully", status: "200" })

    }
    catch (error) {
        res.status(400).json({ message: error.message, status: "400" })
    }

}

const gettranslationrequests = async (req, res) => {
    const token = auth.getToken(req)
    if (token == null) {
        console.log("no token");
        return res.status(401).json({ message: "no token" });
    }
    const id = auth.getUserIdFromToken(token);
    try {

        const requests = await RequestedTranslation.find({ clientid: id });
        const requests2 = await AssignedTranslation.find({ clientid: id });
        var result = [...requests, ...requests2]
        console.log(result)
        res.status(200).json(result);

    } catch (error) {
        res.status(400).json({ message: error.message })
    }

}

const deleterequest = async (req, res) => {
    console.log("deleterequest");
    const token = auth.getToken(req)
    if (token == null) {
        console.log("no token");
        return res.status(401).json({ message: "no token" });
    }
    const id = auth.getUserIdFromToken(token);
    const { requestid } = req.body
    console.log(id, requestid)
    try {
        const request = await RequestedTranslation.findByIdAndDelete(requestid);
       
        res.status(200).json({ message: "Appointement has been succesfully removed", status: "200" });

    } catch (error) {
        res.status(400).json({ message: error.message, status: "400" })
    }

}

// get translation requests that there date is before today and time is before now
const getoldtranslations = async (req, res) => {
    const token = auth.getToken(req)
    if (token == null) {
        console.log("no token");
        return res.status(401).json({ message: "no token" });
    }
    const id = auth.getUserIdFromToken(token);
    var translatorname = '';
    var finaltranslationrequests = [];
    try {
        const requests = await AcceptedTranslation.find({ date: { $lt: new Date() }, clientid: id });
        for (let i = 0; i < requests.length; i++) {

            var translatorid = requests[i].translatorid.toString();
            translatorname = await Translator.findById(translatorid).select('name');
            finaltranslationrequests.push({ translatorname: translatorname.name, ...requests[i].toObject() });

        }
        console.log(finaltranslationrequests)
        res.status(200).json(finaltranslationrequests);

    } catch (error) {
        res.status(400).json({ message: error.message })
    }

}
// get accepted translation requests that there date is after today and time is after now
const getupcomingtranslations = async (req, res) => {
    const token = auth.getToken(req)
    if (token == null) {
        console.log("no token");

        return res.status(401).json({ message: "no token" });
    }
    const id = auth.getUserIdFromToken(token);
    var translatorname = '';
    var finaltranslationrequests = [];
    try {
        const requests = await AcceptedTranslation.find({ date: { $gt: new Date() }, clientid: id });
        for (let i = 0; i < requests.length; i++) {

            var translatorid = requests[i].translatorid.toString();
            translatorname = await Translator.findById(translatorid).select('name');
            finaltranslationrequests.push({ translatorname: translatorname.name, ...requests[i].toObject() });

        }
        console.log(finaltranslationrequests)
        res.status(200).json(finaltranslationrequests);

    } catch (error) {
        res.status(400).json({ message: error.message })
    }


}

const CancelApp = async (req, res) => {

    const { translationid } = req.body
    console.log(translationid)
    try {
        const request = await AcceptedTranslation.findByIdAndDelete(translationid);
        res.status(200).json({ message: "Appointement has been succesfully removed", status: "200" });

    } catch (error) {
        res.status(400).json({ message: error.message, status: "400" })
    }

}



module.exports = {
    resetpassword,
    updateclient,
    getclient,
    requesttranslation,
    gettranslationrequests,
    deleterequest,
    getoldtranslations,
    getupcomingtranslations,
    CancelApp,

};