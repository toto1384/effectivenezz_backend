const mongoose = require('mongoose');


const CalendarSchema = mongoose.Schema({
    _id:{
        type:String,
        default:new mongoose.Types.ObjectId().toHexString(),
    },
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required:true
    },
    description: {
        type: String,
        default:""
    },
    value: {
        type: Number,
        default: 0,
    },
    valueMultiply: {
        type: Number,
        default: 0,
    },
    show: {
        type: Boolean,
        default: true,
    },
}, { _id: false });

module.exports = mongoose.model('Calendars',CalendarSchema);