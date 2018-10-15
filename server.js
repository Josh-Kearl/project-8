
//server set up
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

//storage/identification for users
const userJsonFile = __dirname +'/users.json';
const 




app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('/', express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));






app.listen(3000, () =>{
    console.log('Listening on port 3000');
});