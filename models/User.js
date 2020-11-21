const mongoose = require('mongoose');


const UserSchema = mongoose.Schema({
    googleId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    tasks: {
        type: [String],
        default:[]
    },
    activities: {
        type: [String],
        default:[]
    },
    calendars: {
        type: [String],
        default:[]
    },
    tags: {
        type: [String],
        default:[]
    },
});

module.exports = mongoose.model('Users',UserSchema);