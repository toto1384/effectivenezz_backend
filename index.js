const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');

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
mongoose.connect('mongodb://' + process.env.DB_CONNECTION + ':80/my_database'),
{ useNewUrlParser: true ,useUnifiedTopology: true },()=>{
    console.log('connected to db');
};




//Listen
app.listen(3000);