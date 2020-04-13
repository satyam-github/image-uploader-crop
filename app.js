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

mongoose.connect("mongodb+srv://satyam:satyam@cluster0-iwwk2.mongodb.net/image_uploader?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useCreateIndex: true 
});

// mongoose.connect(process.env.MONGODB_URI || `mongodb://localhost/image_uploader`, {
//     useNewUrlParser: true,
//     useCreateIndex: true 
// });

console.log("DB connected ...");

app.use(express.static(path.join(__dirname, 'client/build')));

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
// app.use('/', (req, res) => res.send("Upload your image now"));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`SERVER RUNNING AT PORT ${PORT}`));