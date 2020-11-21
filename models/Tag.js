const mongoose = require('mongoose');


const TagSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    show: {
        type: Boolean,
        default : true
    },
});

module.exports = mongoose.model('Tags',TagSchema);