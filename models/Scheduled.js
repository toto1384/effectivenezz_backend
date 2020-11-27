const { number } = require('@hapi/joi');
const mongoose = require('mongoose');


const ScheduledSchema = mongoose.Schema({
    _id:Number,
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
        type: Number,
        default: 0,
    },
    repeatUntil: {
        type: Date,
    },
});

module.exports = mongoose.model('Schedules',ScheduledSchema);