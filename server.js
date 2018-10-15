const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

//storage/identification for users
const userJsonFile = __dirname +'/users.json';
const uuidv1 = require('uuid/v1'); //generates a random Id


app.set('views', path.join(__dirname, 'views'));

//engine template syntax, remember for future dates
app.set('view engine', 'pug');

//for parsing application/json
app.use(bodyParser.json());


//for parsing application /x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

//when a 'get' request is coming from the root
app.use('/', express.static('public'));

function read (callback) {
    fs.readFile(userJsonFile, 'utf8', (err, data) =>{
        if (err) console.log(err);
        let userData = JSON.parse(data);
        callback(userData);
    });
}

function write (dataObject, callback) {
    fs.writeFile(userJsonFile, JSON.stringify(dataObject), 'utf8', (err) =>{
        if (err) console.log(err);
        callback();
    });
}

function addUser(dataObject, callback) {
    let readData = (userDataObject) =>{
        let users = userDataObject.users;
        let writeData = () =>{
            callback();
        };
        users.push(dataObject);
        write(userDataObject, writeData);
    };
    read(readData);
}

app.post('/addUser', (req, res) => {
    let body = req.body;
    let newUserObject = {
        uid: uuidv1(),
        id: body.id,
        name: body.name,
        email: body.email,
        age: body.age,
    }

    let addUserCB = () => {
        console.log("User successfully added!");
        res.redirect('/listingView');
    };
    addUser(newUserObject, addUserCB);
});

function editUser(uid, callback){
    let readData = (userDataObject) =>{
        let users = userDataObject.users;
        users.forEach((user, index) =>{
            if (user.uid === uid) {
                callback(index, userDataObject);
            }
        });
    };
    read(readData);
}

app.get('/edit/:uid', (req, res) => {
    let uid = req.params.uid;
    let editUserCB = (index, dataObject) => {
        let users = dataObject.users;
        console.log(`${users[index].name}Grabbed edit successfully`);
        res.render('editView', {user: users[index]});
    };
    editUser(uid, editUserCB);
});

app.post('/edit/:uid', (req, res) => {
    let uid = req.params.uid;
    let body = req.body;
    let newUserObject = {
        uid: uid,
        id: body.id,
        name: body.name,
        email: body.email,
        age: body.age,
    }
    let editUserCB = (index, dataObject) => {
        let users = dataObject.users;
        let writeCB = () => {
            console.log('Edit Successful');
            res.redirect('/listingView');
        };
        users[index] = newUserObject;
        write(dataObject, writeCB);
    };
    editUser(uid, editUserCB);
});

app.get('/delete/:uid', (req, res) =>{
    let uid = req.params.uid;
    let editUserCB = (index, jsonDataObject) =>{
        let users = jsonDataObject.users;
        let writeCB = () =>{
            console.log('User Updated');
            res.redirect('/listingView');
        };
        users.splice(index, 1);
        write(jsonDataObject, writeCB);
    };
    editUser(uid, editUserCB);
});


app.get('/listingView', (req, res) =>{
    let callback = (jsonDataObject) =>{
        console.log("User data grabbed successfully");
        res.render('listingView', {users: jsonDataObject.users});
    }
    read(callback);
});


app.listen(3000, () =>{
    console.log('Listening on port 3000');
});