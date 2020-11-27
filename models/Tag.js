const mongoose = require('mongoose');


const TagSchema = mongoose.Schema({
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
        required: true
    },
    show: {
        type: Boolean,
        default : true
    },
},{ _id: false });

module.exports = mongoose.model('Tags',TagSchema);