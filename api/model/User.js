const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    accessToken:String,
    bankName:String,
    groups: [{
        groupName:{
            type:String,
            required: function () {
                return this.groups.length > 0;
            },
        },
        groupId:{
            type:String,
            required: function () {
                return this.groups.length > 0;
            },
        }
    }]
});

module.exports = mongoose.model('User', userSchema);