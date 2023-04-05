const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    groupId:{
        type:String,
        required:true
    },
    host: {
        type: String,
        required: true
    },
    groupName:{
        type:String,
        required: true
    },

    guests: [{
        type: String
    }],
});

module.exports = mongoose.model('Group', groupSchema);