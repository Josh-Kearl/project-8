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


app.get('/listingView', (req, res) =>{
    let callback = (jsonDataObject) =>{
        console.log("User data returned successfully");
        res.render('listingView', {users: jsonDataObject.users});
    }
    read(callback);
});


app.listen(3000, () =>{
    console.log('Listening on port 3000');
});