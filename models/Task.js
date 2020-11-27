const mongoose = require('mongoose');


const TaskSchema = mongoose.Schema({
    _id:{
        type:String,
        default:new mongoose.Types.ObjectId().toHexString(),
    },
    name: {
        type: String,
        required: true
    },
    checks: {
        type: [Date],
        default: []
    },
    tags: {
        type: [String],
        default: [],
    },
    color: {
        type: String,
        required:true
    },
    trackedStart: {
        type: [Date],
        default: [],
    },
    trackedEnd: {
        type: [Date],
        default: [],
    },
    parentId: {
        type: String,
        default: -1,
    },
    isParentCalendar: {
        type: Boolean,
        default: true
    },
    description: {
        type: String,
        default:""
    },
    value: {
        type: Number,
        default: 0,
    },
    blacklistedDates: {
        type: [Date],
        default: [],
    },
    valueMultiply: {
        type: Number,
        default: 0,
    },
    schedules: {
        type: [String],
        default: [],
    },
},{ _id: false });

module.exports = mongoose.model('Tasks',TaskSchema);