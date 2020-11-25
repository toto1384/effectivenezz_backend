const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const argv = require('optimist').argv;

const fs = require('fs');

var privateKey = fs.readFileSync( 'cert.pem' );
var certificate = fs.readFileSync( 'key.pem' );

const app = express();

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




//Listen
https.createServer({key: privateKey,cert: certificate}, app).listen(8080, function(){
  console.log("Express server listening on port " + 8080);
});