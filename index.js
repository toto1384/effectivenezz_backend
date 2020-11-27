const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const argv = require('optimist').argv;
const http = require('http');
const https = require('https')

const fs = require('fs');

var path = require('path');

// Certificate
const privateKey = fs.readFileSync('/etc/letsencrypt/live/api.effectivenezz.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/api.effectivenezz.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/api.effectivenezz.com/chain.pem', 'utf8');

const credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca
};

const app = express();
app.use(express.static(__dirname, { dotfiles: 'allow' } ));

//import routes
app.use(bodyParser.json());


const userRoute = require('./routes/users')
app.use('/user',userRoute);

const activitiesRoute = require('./routes/activities')
app.use('/activity',activitiesRoute);

const calendarsRoute = require('./routes/calendars')
app.use('/calendar',calendarsRoute);

const schedulesRoute = require('./routes/scheduleds')
app.use('/scheduled',schedulesRoute);

const tasksRoute = require('./routes/tasks')
app.use('/task',tasksRoute);

const tagRoute = require('./routes/tags')
app.use('/tag',tagRoute);


//connect to db
mongoose.connect('mongodb://' + argv.be_ip + ':80/my_database',
{ useNewUrlParser: true ,useUnifiedTopology: true },()=>{
    console.log('connected to db');
});


// Starting both http & https servers
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(80, () => {
        console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
        console.log('HTTPS Server running on port 443');
});