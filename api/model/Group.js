const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    groupId:{
        type:String,
        required:true
    },
    host: {
        name:{
            type:String,
            required: true,
        },
        bankName:{
            type:String,
        }
    },
    groupName:{
        type:String,
        required: true
    },
    sentInvites:[{
        type: String
    }],
    guests: [{
        name:{
            type:String,
            required: true,
        },
        bankName:{
            type:String,
            
        },
    }],
    startDate:{
        type:Date
    },
    endDate:{
        type:Date
    },

});

module.exports = mongoose.model('Group', groupSchema);