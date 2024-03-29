const mongoose = require('mongoose');


const ActivitySchema = mongoose.Schema({
    _id:{
        type:String,
        default:new mongoose.Types.ObjectId().toHexString(),
    },
    name: {
        type: String,
        required: true
    },
    icon: {
        type: Number,
        required: true
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
}, { _id: false });

module.exports = mongoose.model('Activities',ActivitySchema);