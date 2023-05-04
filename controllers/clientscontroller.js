const auth = require('../middleware/auth');
const Client = require('../models/Client')
const RequestedTranslation = require('../models/requested_translation')
const bcrypt = require('bcryptjs');
const validator = require("validator");




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
    const { tolanguage, fromlanguage, onthephone, inperson, date, time } = req.body
    console.log(id, tolanguage, fromlanguage, onthephone, inperson, date, time)
    try {
        const request = await RequestedTranslation.create({
            clientid: id,
            tolang: tolanguage,
            fromlang: fromlanguage,
            onthephone: onthephone,
            inperson: inperson,
            date: date,
            time: time,

        })

        console.log(request.clientid, request._id)
        const client = await Client.findByIdAndUpdate(id, {
            $push: { reqtrans: request._id }
        })
        console.log(client)

        res.status(200).json({ message: "translation requested successfully", status: "200" })

    }
    catch (error) {
        res.status(400).json({ message: error.message, status: "400" })
    }

}


//get translation requests by client id
const gettranslationrequests = async (req, res) => {
    const token = auth.getToken(req)
    if (token == null) {
        console.log("no token");
        return res.status(401).json({ message: "no token" });
    }
    const id = auth.getUserIdFromToken(token);
    try {

        const requests = await RequestedTranslation.find({ clientid: id });
        res.status(200).json(requests);

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
        const client = await Client.findByIdAndUpdate(id, {
            $pull: { reqtrans: requestid }
        })
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
    deleterequest

};