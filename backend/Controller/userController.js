const db = require("../database/db");
const mongodb = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const ObjectId = mongodb.ObjectId;

async function register(req, res) {
    const enteredName = req.body.userName;
    const enteredEmail = req.body.email;
    const enteredPassword = req.body.password;

    console.log(enteredEmail);
    console.log(enteredPassword);

    if(!enteredName || !enteredEmail.includes('@') || !enteredPassword) {
        res.send({auth: false, token: "Error in entering user data"})
    }

    const existingUser = await db.getDb().collection('netflix-user').findOne({email: enteredEmail});
    if(existingUser) {
        res.send({auth: false, token: "Same user already exists"});
    }

    const hashPassword = bcrypt.hashSync(enteredPassword, 8);
    const userRegister = {
        userName: enteredName,
        email: enteredEmail,
        password: hashPassword
    }

    await db.getDb().collection("netflix-user").insertOne(userRegister);
    res.send('user registered');
}



async function login(req, res) {
    const enteredEmail = req.body.email;
    const enteredPassword = req.body.password;

    const existingUser = await db.getDb().collection('netflix-user').findOne({email: enteredEmail});
    if(!existingUser) {
        res.send({auth: false, token: "Invalid credentials"});
    }
    const passwordAreEqual = await bcrypt.compareSync(enteredPassword, existingUser.password);
    if(passwordAreEqual) {
        const token = jwt.sign({id: existingUser._id}, config.secret, {expiresIn: 86400});
        res.send({auth: true, token: token})
    }
}

function userInfo(req, res) {
    let token = req.headers["x-access-token"];
    console.log(token)
    if(!token) {
        res.send({auth: false, token: "Invalid token"})
    }

    // jwt verification
    jwt.verify(token, config.secret, async (err, user) => {
        console.log(user)
        if(err) res.send({auth:false, token: "Invalid token credentials"});
        try {
            const response = await db.getDb().collection('netflix-user').findOne({_id: new ObjectId(user.id)});
            console.log(response)
            res.send(response)
        } catch(err) {
            res.send(err.message)
        }
    })
}

module.exports = {
    register: register,
    login: login,
    userInfo: userInfo
}