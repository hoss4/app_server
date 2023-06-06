const Translator = require('../models/Translator')
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const validator = require("validator");
const AssignedTranslation = require('../models/Assigned_Requests')
const Client = require('../models/Client')
const AcceptedTranslation = require('../models/Accepted_Translations')
const RequestedTranslation = require('../models/Requested_Translation')




const gettranslator = async (req, res) => {

    const token = auth.getToken(req)
    if (token == null) {
        console.log("no token");
        return res.status(401).json({ message: "no token" });
    }
    const id = auth.getUserIdFromToken(token);

    try {

        const translator = await Translator.findById(id);
        console.log(translator)
        res.status(200).json(translator);

    } catch (error) {
        res.status(400).json({ message: error.message })
    }

}

const updateTranslator = async (req, res) => {
    const token = auth.getToken(req)
    if (token == null) {
        console.log("no token");
        return res.status(401).json({ message: "no token" });
    }
    const id = auth.getUserIdFromToken(token);
    const { email, username, name } = req.body
    console.log(id, email, username, name)

    var user = username.split('.');
    if (user.length != 2 || (user[0] != "translator")) {
        return res.status(404).send({ message: " username should be in the format of client._____ , ex: client.john12", status: "404" });
    }
    if (!validator.isEmail(email)) {
        return res.status(404).send({ message: "Email entered is not a valid Email", status: "404" });
    }
    try {
        const translator = await Translator.findByIdAndUpdate(id, {
            email: email,
            username: username,
            name: name
        })
        if (translator) {
            res.status(200).send({ "update": req.body, 'message': "translator updated successfully", "status": "200" });
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
        const translator = await Translator.findById(id);
        console.log(translator.password)
        if (bcrypt.compareSync(password, translator.password)) {
            const salt = bcrypt.genSaltSync(10);
            newpasshash = bcrypt.hashSync(newpass, salt);
            translator.password = newpasshash;
            translator.save();
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

const gettranslationrequests = async (req, res) => {
    const token = auth.getToken(req)
    if (token == null) {
        return res.status(401).json({ message: "no token" });
    }
    var clientname = '';
    var finaltranslationrequests = [];
    const id = auth.getUserIdFromToken(token);
    try {

        const requests = await AssignedTranslation.find({ translatorid: id });
        for (let i = 0; i < requests.length; i++) {

            var clientid = requests[i].clientid.toString();
            clientname = await Client.findById(clientid).select('name');
            finaltranslationrequests.push({ clientname: clientname.name, ...requests[i].toObject() });

        }
        res.status(200).json(finaltranslationrequests);

    } catch (error) {
        res.status(400).json({ message: error.message })
    }

}

const addLanguage = async (req, res) => {
    const token = auth.getToken(req)
    if (token == null) {
        return res.status(401).json({ message: "no token" });
    }
    const id = auth.getUserIdFromToken(token);
    try {
        const translator = await Translator.findById(id)
        const language = req.body.language
        const hasLanguage = translator.languages.includes(language)
        if (hasLanguage) {
            res.status(404).json({ message: "You Already have this language ", status: "404" })
        }else{
        translator.languages.push(language)
        const updatedTranslator = await translator.save()
        res.status(200).json({ message: "language added successfully", status: "200" })
        }
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}


const removeLanguage = async (req, res) => {
    const token = auth.getToken(req)
    if (token == null) {
        return res.status(401).json({ message: "no token" });
    }
    const id = auth.getUserIdFromToken(token);
    try {
        const translator = await Translator.findById(id)
        const language = req.body.language
        translator.languages.pop(language)
        const updatedTranslator = await translator.save()
        res.status(200).json({ message: "language removed successfully", status: "200" })
        
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

const getLanguages = async (req, res) => {
    try {
        const translator = await Translator.findById(req.params.id)
        res.status(200).json(translator.languages)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

const acceptrequest = async (req, res) => {

    const translationid = req.body.translationid;
    try {
        const assigned = await AssignedTranslation.findById(translationid);
        if (assigned) {
            const accepted = new AcceptedTranslation({
                clientid: assigned.clientid,
                translatorid: assigned.translatorid,
                fromlang: assigned.fromlang,
                tolang: assigned.tolang,
                onthephone: assigned.onthephone,
                inperson: assigned.inperson,
                date: assigned.date,
                created: assigned.created,
            })
            accepted.save();
            assigned.delete();
            res.status(200).send({ "message": "translation accepted successfully", status: "200" });

        }
    }
    catch (error) {
        res.status(400).json({ message: error.message, status: "400" })

    }

}

const rejectrequest = async (req, res) => {

    const translationid = req.body.translationid;
    try {
        const assigned = await AssignedTranslation.findById(translationid);
        if (assigned) {
            const requested = new RequestedTranslation ({
                clientid: assigned.clientid,
                fromlang: assigned.fromlang,
                tolang: assigned.tolang,
                onthephone: assigned.onthephone,
                inperson: assigned.inperson,
                date: assigned.date,
                createdAt: assigned.created,

            })
            requested.save();
            assigned.delete();
            res.status(200).send({ "message": "translation Rejected successfully", status: "200" });

        }
    }
    catch (error) {
        res.status(400).json({ message: error.message, status: "400" })

    }

}

const getoldtranslations = async (req, res) => {
    const token = auth.getToken(req)
    if (token == null) {
        console.log("no token");
        return res.status(401).json({ message: "no token" });
    }
    const id = auth.getUserIdFromToken(token);
    var clientname = '';
    var finaltranslationrequests = [];
    try {
        const requests = await AcceptedTranslation.find({ date: { $lt: new Date() }, translatorid: id });
        for (let i = 0; i < requests.length; i++) {

            var clientid = requests[i].clientid.toString();
            clientname = await Client.findById(clientid).select('name');
            finaltranslationrequests.push({ clientname: clientname.name, ...requests[i].toObject() });

        }
        console.log(finaltranslationrequests)
        res.status(200).json(finaltranslationrequests);

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const getupcomingtranslations = async (req, res) => {
    const token = auth.getToken(req)
    if (token == null) {
        console.log("no token");
        return res.status(401).json({ message: "no token" });
    }
    const id = auth.getUserIdFromToken(token);
    var clientname = '';
    var finaltranslationrequests = [];
    try {
        const requests = await AcceptedTranslation.find({ date: { $gt: new Date() }, translatorid: id });
        for (let i = 0; i < requests.length; i++) {

            var clientid = requests[i].clientid.toString();
            clientname = await Client.findById(clientid).select('name');
            finaltranslationrequests.push({ clientname: clientname.name, ...requests[i].toObject() });

        }
        console.log(finaltranslationrequests)
        res.status(200).json(finaltranslationrequests);

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const cancelrequest = async (req, res) => {

    const translationid = req.body.translationid;
    try {
        const accepted = await AcceptedTranslation.findById(translationid);
        if (accepted) {
            const requested = new RequestedTranslation ({
                clientid: accepted.clientid,
                fromlang: accepted.fromlang,
                tolang: accepted.tolang,
                onthephone: accepted.onthephone,
                inperson: accepted.inperson,
                date: accepted.date,
                createdAt: accepted.created,

            })
            requested.save();
            accepted.delete();
            res.status(200).send({ "message": "translation Canceled successfully", status: "200" });

        }
    }
    catch (error) {
        res.status(400).json({ message: error.message, status: "400" })

    }

}

module.exports = {
    addLanguage,
    getLanguages,
    gettranslator,
    updateTranslator,
    resetpassword,
    gettranslationrequests,
    acceptrequest,
    rejectrequest,
    getoldtranslations,
    getupcomingtranslations,
    cancelrequest,
    removeLanguage,
}      
