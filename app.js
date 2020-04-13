var express = require('express');
var createError = require('http-errors');
const path = require('path');
var bodyParser = require('body-parser');
var app = express();
var bodyParser = require("body-parser");
var imageRoute = require('./routes/imageUpload')
var mongoose = require("mongoose");

app.use(bodyParser.urlencoded({extended: true}));

mongoose.set('useUnifiedTopology', true);

// Setting the mongoose connection

mongoose.connect(process.env.MONGODB_URI || `mongodb://localhost/image_uploader`, {
    useNewUrlParser: true,
    useCreateIndex: true 
});

console.log("DB connected ...");

/* This is for deploying on heroku server . It asks the node js server (which acts as
    server and also serves react application) to look for React files in client/build
*/

app.use(express.static(path.join(__dirname, 'client/build')));

/* This is to deal with Access-Control-Allow-Origin errors */

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', '*');  // enables all the methods to take place
    return next();
});

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json({ extended: false }));
app.use('/images', imageRoute);

/*  This renders React file index.html  */

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`SERVER RUNNING AT PORT ${PORT}`));