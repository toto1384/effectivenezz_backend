const { number } = require('@hapi/joi');
const mongoose = require('mongoose');


const ScheduledSchema = mongoose.Schema({
    _id:{
        type:String,
        default:new mongoose.Types.ObjectId().toHexString(),
    },
    startTime: {
        type: Date,
    },
    duration: {
        type: Number,
        default: 0,
    },
    repeatRule: {
        type: Number,
        default: 0,
    },
    repeatValue: {
        type: String,
        default: 0,
    },
    repeatUntil: {
        type: Date,
    },
},{ _id: false });

module.exports = mongoose.model('Schedules',ScheduledSchema);