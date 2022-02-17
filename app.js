const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

var fs = require('fs');
var https = require('https');
const http = require('http');

// .Env
const dotenv = require('dotenv');
dotenv.config();

var certificate = fs.readFileSync(process.env.CERT_CRT_PATH, 'utf8');
var privateKey  = fs.readFileSync(process.env.CERT_KEY_PATH, 'utf8');

// init mongoose db
const mongoose = require('mongoose');

var credentials = {key: privateKey, cert: certificate};

// init express
const app = express();

// Static Files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))

// Set template
app.use(expressLayouts);
app.set('layout', './layout/main')
app.set('view engine', 'ejs')

var httpsServer = https.createServer(credentials, app);

// config BodyParser
app.use(bodyParser.urlencoded({
    extended: true
}));

// cookieParser middleware
app.use(cookieParser());

app.use(bodyParser.json());
app.use(cors());

// API's
const Noa = require('./routes/noa.route');
app.use('/api/v1/noa', Noa);

connect_server = function(){
    // Connect function
    const PORT = process.env.PORT || 8080;

    httpsServer.listen(PORT, ()=> {
        console.log(`Server running in PORT: ${PORT}\b\n`);
    });
}

let mongoDB = process.env.MONGOOSE_URI
    .replace("{MONGOOSE_DATABASE_HOST}", process.env.MONGOOSE_DATABASE_HOST)
    .replace("{MONGOOSE_DATABASE_PORT}", process.env.MONGOOSE_DATABASE_PORT)
    .replace("{MONGOOSE_DATABASE_NAME}", process.env.MONGOOSE_DATABASE_NAME);

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => connect_server())
    .catch((err) => console.log(err));

// HTTP
const Access = require('./models/access.model');

app.get(['', '/pwa/', '/@/noa'], (req, res) => {
    Access.find({ enabled: 1 }, async (err, data) => {
        if( data.length == 0 ){
            res.render('login');
        } else {
            res.render('app/noa');
        }
    });
})