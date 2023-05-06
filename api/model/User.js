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
    banks:[{
        accessToken:{
            type:String,
            required: true,
        },
        bankName:{
            type:String,
            required: true,
        },
        bankBrand:{
            type:String,
            required:true,
        },
        accountNum:{
            type:String,
            required: true,
        },
        account_id:{
            type:String,
            required:true,
        },
    }],
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
    ,
    groupInvites: [{
        inviter:{
            type:String,
            required: function () {
                return this.groups.length > 0;
            }
        },
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