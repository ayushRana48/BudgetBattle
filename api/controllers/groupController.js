const Group = require('../model/Group')
const User = require('../model/User')
const url=require('url')
const querystring=require('querystring')

const crypto = require('crypto');
const { getSystemErrorMap } = require('util');


const handleNewGroup = async (req, res) => {
    const { user, groupName } = req.body;
    //missing group name
    if (!user || !groupName) return res.status(401);
    // check for duplicate usernames in the db
    try {
        //encrypt the password
        let groupId;
        while(true){
            groupId = crypto.randomBytes(10).toString('hex');
            const duplicate = await Group.findOne({groupId:groupId}).exec();
            if(!duplicate){
                break;
            }
        }
        //store the new user
        const newGroup = await Group.create({ "groupId":groupId, "host": user, "groupName": groupName, "guests":[]});
        const updatedUser = await User.findOneAndUpdate(
            { username: user },
            { $push: { groups: { "groupId": groupId, "groupName":groupName } } },
            { new: true }
        );
        res.status(201).json({ 'success': `New group ${newGroup} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }

    
}


const addMember = async (req,res) =>{
    const {groupId,user} = req.body;
    const foundUser = await User.findOne({username:user}).exec();
    if (!foundUser) return res.status(401).json("User not found"); 
    const group = await Group.findOne({groupId:groupId}).exec();
    if(group.host==user || group.guests.includes(user)) return res.status(409).json("User already in group"); 

    const updatedGroup = await Group.findOneAndUpdate({"groupId":groupId}, { $push: { guests: user }}, {new: true});
    const updatedUser = await User.findOneAndUpdate(
        { username: user },
        { $push: { groups: { groupId: groupId, groupName: group.groupName } } },
        { new: true }
      );
      res.json({
        group: updatedGroup,
        user: updatedUser
      });
}

const getAll = async (req,res)=>{
    Group.find({})
  .then(groups => {
    console.log(groups); // Prints all the documents in the "Group" collection
  })
  .catch(err => {
    console.error(err); // Handle any errors that occurred
  });
}


const getAllMembers = async (req,res)=>{
  const parsedUrl=url.parse(req.url)
  const parsedQuery=querystring.parse(parsedUrl.query)

  const groupId=parsedQuery.groupId
  const group=await Group.findOne({groupId:groupId}).exec();
  res.json({host:group.host,guests:group.guests})
}

const getAllInvites = async (req,res)=>{
  const parsedUrl=url.parse(req.url)
  const parsedQuery=querystring.parse(parsedUrl.query)

  const groupId=parsedQuery.groupId
  const group=await Group.findOne({groupId:groupId}).exec();
  res.json({invites:group.sentInvites})
}

const leaveGroup = async (req,res) =>{
  const {groupId,user} = req.body;
  const foundUser = await User.findOne({username:user}).exec();

  if (!foundUser) return res.status(401).json("User not found"); 
  const foundGroup = await Group.findOne({groupId:groupId}).exec();
  let groupUpdate;

  if((foundGroup && !foundGroup.guests.includes(user)) && (foundGroup && foundGroup.host!=user))return res.status(401).json("User not in group"); 

  if(foundGroup && foundGroup.host==user){
    if(foundGroup && foundGroup.guests.length==0) return res.status(401).json("Can't leave group as last member"); 
    groupUpdate = {
      host:foundGroup.guests[0],
      $pull: { guests:foundGroup.guests[0] }
    };
  }
  else{
    groupUpdate={ $pull: { guests: user }}
  }
    const updatedGroup = await Group.findOneAndUpdate({"groupId":groupId}, groupUpdate, {new: true});
    const updatedUser = await User.findOneAndUpdate(
        { username: user },
        { $pull: { groups: { groupId: groupId, groupName: foundGroup.groupName } } },
        { new: true }
      );
    res.json({
      group: updatedGroup,
      user: updatedUser
    });
}

const leaveDeleteGroup = async (req,res)=>{
  const {groupId,user} = req.body;
  const foundUser = await User.findOne({username:user}).exec();

  if (!foundUser) return res.status(401).json("User not found"); 
  const foundGroup = await Group.findOne({groupId:groupId}).exec();

  if((foundGroup && !foundGroup.guests.includes(user)) && (foundGroup && foundGroup.host!=user))return res.status(401).json("User not in group"); 
  if(foundGroup && (foundGroup.host!=foundUser && foundGroup.guests.length!=0)) return res.status(401).json("Can't delete group"); 

  Group.deleteOne(foundGroup)
  .then(() => {
    console.log('Deleted group');
  })
  .catch((err) => {
    console.error(err);
  });


  const updatedUser = await User.findOneAndUpdate(
    { username: user },
    { $pull: { groups: { groupId: groupId, groupName: foundGroup.groupName } } },
    { new: true }
  );

  res.json({
    group: Group,
    user: updatedUser
  });
}


const setStartDate = async (req,res) =>{
  const {groupId,startDate} = req.body;
  const group = await Group.findOne({groupId:groupId}).exec();
  if (!group) return res.status(401).json("Group not found"); 

  const updatedGroup = await Group.findOneAndUpdate({"groupId":groupId}, {"startDate":startDate}, {new: true});
  res.json({
    group: updatedGroup,
  });
}

const setEndDate = async (req,res) =>{
  const {groupId,endDate} = req.body;
  const group = await Group.findOne({groupId:groupId}).exec();
  if (!group) return res.status(401).json("Group not found"); 

  const updatedGroup = await Group.findOneAndUpdate({"groupId":groupId}, {"endDate":endDate}, {new: true});
  res.json({
    group: updatedGroup,
  });
}

const getStartDate = async (req,res)=>{
  const parsedUrl=url.parse(req.url)
  const parsedQuery=querystring.parse(parsedUrl.query)

  const groupId=parsedQuery.groupId
  const group=await Group.findOne({groupId:groupId}).exec();
  res.json({startDate:group.startDate})
}

const getEndDate = async (req,res)=>{
  const parsedUrl=url.parse(req.url)
  const parsedQuery=querystring.parse(parsedUrl.query)

  const groupId=parsedQuery.groupId
  const group=await Group.findOne({groupId:groupId}).exec();
  res.json({endDate:group.endDate})
}


module.exports = { handleNewGroup,addMember, getAll,
  getAllMembers,getAllInvites,leaveGroup,
  leaveDeleteGroup,setStartDate,setEndDate,getStartDate,getEndDate};