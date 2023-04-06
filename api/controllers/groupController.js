const Group = require('../model/Group')
const User = require('../model/User')
const url=require('url')
const querystring=require('querystring')

const crypto = require('crypto');


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




module.exports = { handleNewGroup,addMember, getAll,getAllMembers,getAllInvites };