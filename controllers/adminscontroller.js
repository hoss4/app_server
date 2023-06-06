const Admin = require('../models/Admin')
const Translator = require('../models/Translator')
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const validator = require("validator");
const RequestedTranslation = require('../models/Requested_Translation')
const AssignedTranslation = require('../models/Assigned_Requests')
const AcceptedTranslation = require('../models/Accepted_Translations')
const Client = require('../models/Client')



const createTranslator = async (req, res) => {
    const { email, username, name, password } = req.body
    console.log(email, username, name, password)
    var user = username.split('.');
    if (user.length != 2 || (user[0] != "translator")) {
        return res.status(404).send({ message: " username should be in the format of translator._____ , ex: translator.john12", status: "404" });
    }
    if (!validator.isEmail(email)) {
        return res.status(404).send({ message: "Email entered is not a valid Email", status: "404" });
    }
    if (!validator.isStrongPassword(password)) {
        return res.status(404).send({ message: "New password must be strong, you need to have a capital letter, lowercase letter , a number and a special character " });
    }

    const exists = await Translator.findOne({ username: username });
    if (exists) {
        console.log("Username already in use, please try another");
        return res.status(404).send({ message: "Username already in use, please try another" });
    }


    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newTranslator = new Translator({
            email: email,
            username: username,
            name: name,
            password: hashedPassword
        })
        const savedTranslator = await newTranslator.save();
        res.status(200).send({ "create": req.body, 'message': "translator created successfully", "status": "200" });
    }
    catch (error) {
        res.status(400).json({ message: error.message, status: "400" })
    }
}

const createAdmin = async (req, res) => {
    const { email, username, name, password } = req.body
    console.log(email, username, name, password)
    var user = username.split('.');
    if (user.length != 2 || (user[0] != "admin")) {
        return res.status(404).send({ message: " username should be in the format of admin._____ , ex: admin.john12", status: "404" });
    }
    if (!validator.isEmail(email)) {
        return res.status(404).send({ message: "Email entered is not a valid Email", status: "404" });
    }
    if (!validator.isStrongPassword(password)) {
        return res.status(404).send({ message: "New password must be strong, you need to have a capital letter, lowercase letter , a number and a special character " });
    }

    const exists = await Admin.findOne({ username: username });
    if (exists) {
        console.log("Username already in use, please try another");
        return res.status(404).send({ message: "Username already in use, please try another" });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newadmin = new Admin({
            email: email,
            username: username,
            name: name,
            password: hashedPassword
        })
        const savedAdmin = await newadmin.save();
        res.status(200).send({ "create": req.body, 'message': "Admin created successfully", "status": "200" });
    }
    catch (error) {
        res.status(400).json({ message: error.message, status: "400" })
    }
}

const getadmin = async (req, res) => {

    const token = auth.getToken(req)
    if (token == null) {
        console.log("no token");
        return res.status(401).json({ message: "no token" });
    }
    const id = auth.getUserIdFromToken(token);

    try {

        const admin = await Admin.findById(id);
        console.log(admin)
        res.status(200).send(admin);

    } catch (error) {
        res.status(400).json({ message: error.message })
    }

}

const updateAdmin = async (req, res) => {
    const token = auth.getToken(req)
    if (token == null) {
        console.log("no token");
        return res.status(401).json({ message: "no token" });
    }
    const id = auth.getUserIdFromToken(token);
    const { email, username, name } = req.body
    console.log(id, email, username, name)

    var user = username.split('.');
    if (user.length != 2 || (user[0] != "admin")) {
        return res.status(404).send({ message: " username should be in the format of client._____ , ex: client.john12", status: "404" });
    }
    if (!validator.isEmail(email)) {
        return res.status(404).send({ message: "Email entered is not a valid Email", status: "404" });
    }
    try {
        const admin = await Admin.findByIdAndUpdate(id, {
            email: email,
            username: username,
            name: name
        })
        if (admin) {
            res.status(200).send({ "update": req.body, 'message': "admin updated successfully", "status": "200" });
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
        const admin = await Admin.findById(id);
        console.log(admin.password)
        if (bcrypt.compareSync(password, admin.password)) {
            const salt = bcrypt.genSaltSync(10);
            newpasshash = bcrypt.hashSync(newpass, salt);
            admin.password = newpasshash;
            admin.save();
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

const getalltranslationrequests = async (req, res) => {

    var clientname = '';
    var finaltranslationrequests = [];
    try {
        const translationrequests = await RequestedTranslation.find({});

        // loop through all the translation requests and get the client name
        for (let i = 0; i < translationrequests.length; i++) {

            var clientid = translationrequests[i].clientid.toString();
            clientname = await Client.findById(clientid).select('name');
            finaltranslationrequests.push({ clientname: clientname.name, ...translationrequests[i].toObject() });

        }
        // sort the translation requests by creation date ascending order
        //finaltranslationrequests.sort((a, b) => (a.createdAt > b.createdAt) ? 1 : -1)
        res.status(200).send(finaltranslationrequests);
    }
    catch (error) {
        res.status(400).json({ message: error.message, status: "400" })
    }
}

const gettranslators = async (req, res) => {

    const { from, to } = req.body
    try {
        const translators = await Translator.find({ $and: [{ languages: { $elemMatch: { $eq: from } } }, { languages: { $elemMatch: { $eq: to } } }] }).select('name');
        console.log(translators)
        res.status(200).send(translators);
    }
    catch (error) {
        res.status(400).json({ message: error.message, status: "400" })
    }
}

const AssignedRequest = async (req, res) => {

    const { translationid, translatorid } = req.body
    console.log(translationid, translatorid)
    try {
        const translation = await RequestedTranslation.findById(translationid);
        console.log(translation)
        if (translation) {
            const Assign = new AssignedTranslation({
                clientid: translation.clientid,
                translatorid: translatorid,
                fromlang: translation.fromlang,
                tolang: translation.tolang,
                onthephone: translation.onthephone,
                inperson: translation.inperson,
                date: translation.date,
                created: translation.createdAt,
            })
            Assign.save();
            translation.delete();
            console.log(Assign)
            res.status(200).send({ "message": "translation assigned successfully", status: "200" });

        }
        else {
            res.status(404).json({ message: "translation not found", status: "404" })
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message, status: "400" })
    }
}

const getupcomingtranslations = async (req, res) => {
   
    var clientname = '';
    var translatorname = '';
    var finaltranslationrequests = [];
    try {
        const requests = await AcceptedTranslation.find({ date: { $gt: new Date() }});
        for (let i = 0; i < requests.length; i++) {

            var clientid = requests[i].clientid.toString();
            var translatorid = requests[i].translatorid.toString();
            clientname = await Client.findById(clientid).select('name');
            translatorname = await Translator.findById(translatorid).select('name');
            finaltranslationrequests.push({ clientname: clientname.name,translatorname:translatorname.name ,...requests[i].toObject() });

        }
        console.log(finaltranslationrequests)
        res.status(200).json(finaltranslationrequests);

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const getoldtranslations = async (req, res) => {
   
    var clientname = '';
    var translatorname = '';
    var finaltranslationrequests = [];
    try {
        const requests = await AcceptedTranslation.find({  date: { $lt: new Date() }});
        for (let i = 0; i < requests.length; i++) {

            var clientid = requests[i].clientid.toString();
            var translatorid = requests[i].translatorid.toString();
            clientname = await Client.findById(clientid).select('name');
            translatorname = await Translator.findById(translatorid).select('name');
            finaltranslationrequests.push({ clientname: clientname.name,translatorname:translatorname.name ,...requests[i].toObject() });

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
    createTranslator,
    createAdmin,
    getadmin,
    updateAdmin,
    resetpassword,
    getalltranslationrequests,
    gettranslators,
    AssignedRequest,
    getupcomingtranslations,
    getoldtranslations,
    CancelApp,

}
